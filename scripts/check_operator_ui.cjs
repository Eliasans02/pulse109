/* Synthetic browser regression checks; use the same external Playwright as coverage QA. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const baseURL = process.argv[2] || 'http://127.0.0.1:8765';
const html = '\"><img src=x onerror="window.__p109Xss=true"> & <b>Тест</b>';
const complaints = [html, 'Синтетическое обращение: жарық жоқ', 'Синтетическое обращение: нет воды'].map((text, i) => ({
  id: `synthetic-ui-${i}`, text, region_id: 'KZ-AST', data_origin: 'synthetic',
  decision_status: 'pending', topic: null, proposed_topic: null,
}));
const candidate = {
  complaint_id: html, excerpt: html, resolution_text: html,
  decision_status: html, origin: html,
};
const proposal = {topic: 'test_topic', service_id: html, priority: html};

async function main() {
  const browser = await chromium.launch({headless: true, channel: process.env.P109_BROWSER || 'msedge'});
  const failures = [];
  async function check(name, run) {
    const page = await browser.newPage({viewport: {width: 1440, height: 1050}});
    page.setDefaultTimeout(4000);
    const errors = [];
    const writes = [];
    page.on('pageerror', error => errors.push(error.name));
    await page.route('**/api/**', route => {
      const request = route.request();
      const path = new URL(request.url()).pathname;
      if (request.method() !== 'GET') writes.push(path);
      let json;
      if (path === '/api/health') json = {mode: 'mock', training_status: 'not_trained'};
      else if (path === '/api/regions') json = {regions: [{id: 'KZ-AST', name_ru: 'Астана', name_kk: 'Астана'}]};
      else if (path === '/api/topics') json = {topics: [{id: 'test_topic', name_ru: html, name_kk: 'Синтетикалық'}]};
      else if (path === '/api/stats') json = {total_complaints: 3, pending_count: 3, confirmed_count: 0, by_topic: {test_topic: 3}};
      else if (path === '/api/complaints') json = {complaints};
      else if (path.endsWith('/similar')) json = {candidates: [candidate]};
      else if (path.endsWith('/classify')) json = {proposal};
      else return route.fulfill({status: 503, json: {detail: {error: 'synthetic_test_unavailable'}}});
      return route.fulfill({json});
    });
    try {
      await page.goto(baseURL);
      await page.waitForFunction(() => document.querySelectorAll('#queue-list .queue-item').length === 3);
      await run(page, writes);
      assert.deepEqual(errors, [], 'No uncaught browser errors');
      assert.equal(await page.evaluate(() => window.__p109Xss), undefined, 'HTML must not execute');
      console.log(`PASS OPERATOR: ${name}`);
    } catch (error) {
      failures.push(name);
      console.error(`FAIL OPERATOR: ${name}: ${error.message}`);
    } finally {
      await page.close();
    }
  }
  try {
    await check('queue preview and title preserve literal HTML', async page => {
      const preview = page.locator('#queue-list .queue-item').first().locator('span').first();
      assert.equal(await preview.textContent(), html.substring(0, 55) + '...');
      assert.equal(await preview.getAttribute('title'), html);
      assert.equal(await page.locator('#queue-list img, #queue-list b').count(), 0);
    });

    await check('similar cases and resolutions preserve literal HTML', async page => {
      await page.locator('#queue-list .queue-item').first().click();
      await page.locator('#similar-list .similar-item').waitFor();
      assert.equal((await page.locator('#similar-list').textContent()).split(html).length - 1, 5);
      assert.equal(await page.locator('#similar-list img, #similar-list b').count(), 0);
      assert.equal(await page.locator('#active-text').textContent(), html);
    });

    await check('proposal and topic counters preserve literal HTML', async page => {
      await page.locator('#queue-list .queue-item').first().click();
      await page.locator('#btn-classify').click();
      await page.locator('#proposal-content .proposal-pill').waitFor();
      assert.equal((await page.locator('#proposal-content').textContent()).split(html).length - 1, 3);
      assert.equal(await page.locator('#topics-breakdown span').textContent(), html);
      assert.equal(await page.locator('#proposal-content img, #topics-breakdown img').count(), 0);
    });

    await check('Tab/Enter/Space select native buttons without losing focus or confirming', async (page, writes) => {
      const buttons = page.locator('#queue-list button');
      assert.equal(await buttons.count(), 3, 'Every queue item needs a native button');
      await page.locator('#btn-submit-intake').focus();
      await page.keyboard.press('Tab');
      assert.equal(await buttons.first().evaluate(el => el === document.activeElement), true);
      assert.notEqual(await buttons.first().evaluate(el => getComputedStyle(el).outlineStyle), 'none');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.getElementById('active-id').textContent === 'synthetic-ui-0');
      await page.locator('#similar-list .similar-item').waitFor();
      assert.equal(await buttons.first().evaluate(el => el === document.activeElement), true);
      assert.equal(await buttons.first().getAttribute('aria-pressed'), 'true');
      await page.keyboard.press('Tab');
      assert.equal(await buttons.nth(1).evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Space');
      await page.waitForFunction(() => document.getElementById('active-id').textContent === 'synthetic-ui-1');
      assert.equal(await buttons.nth(1).evaluate(el => el === document.activeElement), true);
      assert.equal(await buttons.first().getAttribute('aria-pressed'), 'false');
      assert.equal(await buttons.nth(1).getAttribute('aria-pressed'), 'true');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await buttons.first().evaluate(el => el === document.activeElement), true);
      assert.deepEqual(writes, [], 'Selection must not submit intake or operator confirmation');
      if (process.argv[3]) await page.locator('.intake-panel').screenshot({path: process.argv[3]});
    });
  } finally {
    await browser.close();
  }
  assert.deepEqual(failures, [], 'Operator regression checks failed');
  console.log('ALL 4 OPERATOR UI CHECKS PASSED');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
