let activeComplaint = null;
let cachedTopics = [];
let cachedRegions = [];

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setupEventListeners();
});

async function initApp() {
  await Promise.all([loadHealth(), loadRegions(), loadTopics()]);
  await Promise.all([loadStats(), loadQueue()]);
}

function setupEventListeners() {
  const textInput = document.getElementById("intake-text");
  const charNum = document.getElementById("char-num");
  textInput.addEventListener("input", () => {
    charNum.textContent = textInput.value.length;
  });

  document.getElementById("intake-form").addEventListener("submit", handleIntakeSubmit);
  document.getElementById("btn-classify").addEventListener("click", handleClassify);
  document.getElementById("confirm-form").addEventListener("submit", handleConfirmSubmit);
  document.getElementById("confirm-topic").addEventListener("change", handleTopicChange);
}

async function loadHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    document.getElementById("app-mode").textContent = data.mode;
    document.getElementById("app-training").textContent = data.training_status;
  } catch (err) {
    console.error("Health check error", err);
  }
}

async function loadRegions() {
  try {
    const res = await fetch("/api/regions");
    const data = await res.json();
    cachedRegions = data.regions || [];
    const select = document.getElementById("intake-region");
    select.innerHTML = '<option value="">-- Выберите регион --</option>';
    cachedRegions.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = `${r.name_ru} (${r.name_kk})`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load regions", err);
  }
}

async function loadTopics() {
  try {
    const res = await fetch("/api/topics");
    const data = await res.json();
    cachedTopics = data.topics || [];
    const select = document.getElementById("confirm-topic");
    select.innerHTML = '<option value="">-- Выберите тему --</option>';
    cachedTopics.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name_ru} / ${t.name_kk}`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load topics", err);
  }
}

async function loadStats() {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    document.getElementById("stat-total").textContent = data.total_complaints;
    document.getElementById("stat-pending").textContent = data.pending_count;
    document.getElementById("stat-confirmed").textContent = data.confirmed_count;

    const breakdown = document.getElementById("topics-breakdown");
    breakdown.innerHTML = "";
    const topicMap = Object.fromEntries(cachedTopics.map(t => [t.id, t.name_ru]));
    for (const [topicId, count] of Object.entries(data.by_topic || {})) {
      const row = document.createElement("div");
      row.className = "breakdown-row";
      const name = topicMap[topicId] || topicId;
      row.innerHTML = `<span>${name}</span><strong>${count}</strong>`;
      breakdown.appendChild(row);
    }
  } catch (err) {
    console.error("Failed to load stats", err);
  }
}

async function loadQueue() {
  try {
    const res = await fetch("/api/complaints?limit=30");
    const data = await res.json();
    const list = document.getElementById("queue-list");
    list.innerHTML = "";
    const complaints = data.complaints || [];
    if (!complaints.length) {
      list.innerHTML = '<li class="empty-state">Очередь пуста</li>';
      return;
    }
    complaints.forEach(c => {
      const item = document.createElement("li");
      item.className = "queue-item";
      if (activeComplaint && activeComplaint.id === c.id) {
        item.classList.add("selected");
      }
      const badgeClass = c.decision_status === "confirmed" ? "badge-confirmed" : "badge-pending";
      const shortText = c.text.length > 55 ? c.text.substring(0, 55) + "..." : c.text;
      item.innerHTML = `
        <span title="${c.text}">${shortText}</span>
        <span class="badge ${badgeClass}">${c.decision_status}</span>
      `;
      item.addEventListener("click", () => selectComplaint(c));
      list.appendChild(item);
    });
  } catch (err) {
    console.error("Failed to load queue", err);
  }
}

function selectComplaint(c) {
  activeComplaint = c;
  document.getElementById("active-id").textContent = c.id;
  document.getElementById("active-text").textContent = c.text;
  const regionObj = cachedRegions.find(r => r.id === c.region_id);
  document.getElementById("active-region").textContent = regionObj ? regionObj.name_ru : c.region_id;
  document.getElementById("active-origin").textContent = c.data_origin;

  const badge = document.getElementById("active-status-badge");
  badge.textContent = c.decision_status;
  badge.className = `badge ${c.decision_status === "confirmed" ? "badge-confirmed" : "badge-pending"}`;

  document.getElementById("btn-classify").disabled = false;
  document.getElementById("btn-confirm").disabled = false;
  document.getElementById("confirm-error").style.display = "none";
  document.getElementById("confirm-success").style.display = "none";

  // Pre-fill confirm form
  document.getElementById("confirm-topic").value = c.topic || c.proposed_topic || "";
  document.getElementById("confirm-service").value = c.service_id || c.proposed_service_id || "";
  document.getElementById("confirm-priority").value = c.priority || c.proposed_priority || "normal";

  // Load proposal / similar if already present
  if (c.proposed_topic) {
    renderProposal({
      topic: c.proposed_topic,
      service_id: c.proposed_service_id,
      priority: c.proposed_priority
    });
  } else {
    document.getElementById("proposal-content").innerHTML = '<p class="empty-state">Нажмите «Запросить предложение» для анализа текста.</p>';
  }
  loadSimilar(c.id);
  loadQueue();
}

async function handleIntakeSubmit(e) {
  e.preventDefault();
  const errorBox = document.getElementById("intake-error");
  errorBox.style.display = "none";

  const region = document.getElementById("intake-region").value;
  const lang = document.getElementById("intake-lang").value;
  const text = document.getElementById("intake-text").value.trim();

  if (!region) {
    showError(errorBox, "Выберите регион");
    return;
  }
  if (!text) {
    showError(errorBox, "Введите текст обращения");
    return;
  }

  try {
    const res = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, region_id: region, language: lang }),
    });
    if (!res.ok) {
      const errData = await res.json();
      showError(errorBox, errData.detail || "Ошибка валидации приёма");
      return;
    }
    const created = await res.json();
    document.getElementById("intake-form").reset();
    document.getElementById("char-num").textContent = "0";
    await loadStats();
    await loadQueue();
    // Fetch full complaint and select
    const fullRes = await fetch(`/api/complaints/${created.id}`);
    const fullData = await fullRes.json();
    selectComplaint(fullData.complaint);
  } catch (err) {
    showError(errorBox, "Сетевая ошибка при отправке обращения");
  }
}

async function handleClassify() {
  if (!activeComplaint) return;
  const btn = document.getElementById("btn-classify");
  btn.disabled = true;
  try {
    const res = await fetch(`/api/complaints/${activeComplaint.id}/classify`, { method: "POST" });
    const data = await res.json();
    renderProposal(data.proposal);
    if (data.proposal.topic) {
      document.getElementById("confirm-topic").value = data.proposal.topic;
    }
    if (data.proposal.service_id) {
      document.getElementById("confirm-service").value = data.proposal.service_id;
    }
    if (data.proposal.priority) {
      document.getElementById("confirm-priority").value = data.proposal.priority;
    }
    await loadSimilar(activeComplaint.id);
  } catch (err) {
    console.error("Classification error", err);
  } finally {
    btn.disabled = false;
  }
}

function renderProposal(proposal) {
  const container = document.getElementById("proposal-content");
  if (!proposal || !proposal.topic) {
    container.innerHTML = `
      <div class="proposal-pill" style="background:#fee2e2;color:#991b1b;">Тема не распознана</div>
      <p style="font-size:0.85rem;margin-top:0.4rem;">Требуется ручной выбор темы оператором (needs_review).</p>
    `;
    return;
  }
  const tObj = cachedTopics.find(t => t.id === proposal.topic);
  const topicName = tObj ? tObj.name_ru : proposal.topic;
  container.innerHTML = `
    <div>Предлагаемая тема: <span class="proposal-pill">${topicName}</span></div>
    <div style="font-size:0.85rem;margin-top:0.3rem;">Служба: <strong>${proposal.service_id || "—"}</strong> | Приоритет: <strong>${proposal.priority}</strong></div>
  `;
}

async function loadSimilar(complaintId) {
  try {
    const res = await fetch(`/api/complaints/${complaintId}/similar?limit=5`);
    const data = await res.json();
    const container = document.getElementById("similar-list");
    container.innerHTML = "";
    const candidates = data.candidates || [];
    if (!candidates.length) {
      container.innerHTML = '<p class="empty-state">Похожих обращений не найдено.</p>';
      return;
    }
    candidates.forEach(cand => {
      const div = document.createElement("div");
      div.className = "similar-item";
      const resText = cand.resolution_text ? `<div style="color:#059669;">Решение: ${cand.resolution_text}</div>` : "";
      div.innerHTML = `
        <div><strong>[${cand.complaint_id}]</strong> ${cand.excerpt}</div>
        <div style="color:#64748b;font-size:0.75rem;">Статус: ${cand.decision_status} | Источник: ${cand.origin}</div>
        ${resText}
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load similar complaints", err);
  }
}

function handleTopicChange() {
  const topicId = document.getElementById("confirm-topic").value;
  const topicObj = cachedTopics.find(t => t.id === topicId);
  if (topicObj && topicObj.default_service) {
    document.getElementById("confirm-service").value = topicObj.default_service;
  }
}

async function handleConfirmSubmit(e) {
  e.preventDefault();
  if (!activeComplaint) return;
  const errBox = document.getElementById("confirm-error");
  const succBox = document.getElementById("confirm-success");
  errBox.style.display = "none";
  succBox.style.display = "none";

  const topic = document.getElementById("confirm-topic").value;
  const service_id = document.getElementById("confirm-service").value.trim();
  const priority = document.getElementById("confirm-priority").value;

  if (!topic) { showError(errBox, "Выберите тему"); return; }
  if (!service_id) { showError(errBox, "Укажите ответственную службу"); return; }

  try {
    const res = await fetch(`/api/complaints/${activeComplaint.id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, service_id, priority, actor: "operator_demo" }),
    });
    if (!res.ok) {
      const err = await res.json();
      showError(errBox, err.detail || "Ошибка подтверждения");
      return;
    }
    const data = await res.json();
    succBox.textContent = `Решение для обращения ${data.complaint.id} успешно подтверждено!`;
    succBox.style.display = "block";
    selectComplaint(data.complaint);
    await loadStats();
    await loadQueue();
  } catch (err) {
    showError(errBox, "Сетевая ошибка подтверждения");
  }
}

function showError(box, msg) {
  box.textContent = msg;
  box.style.display = "block";
}

async function callStub(url, method = "GET") {
  const out = document.getElementById("stub-output");
  out.style.display = "block";
  out.textContent = `Запрос: ${method} ${url}...\n`;
  try {
    const res = await fetch(url, { method });
    const json = await res.json();
    out.textContent += `HTTP ${res.status} ${res.statusText}\n${JSON.stringify(json, null, 2)}`;
  } catch (err) {
    out.textContent += `Ошибка: ${err.message}`;
  }
}
