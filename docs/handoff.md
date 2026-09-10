# Pulse 109 — текущая передача работы

Дата: 2026-09-10. Ветка: `olga/data-coverage`, база: `a6b9443`.
Код и проверенный research: [5ceec95](https://github.com/Eliasans02/pulse109/commit/5ceec958eacb217f41b666f3fe69aee28a741e5a). [PR #43](https://github.com/Eliasans02/pulse109/pull/43) открыт, не слит; последующий commit обновляет только ссылки этой передачи. Актуальный HEAD проверять через git/PR.
Задача: [P109-26](https://github.com/Eliasans02/pulse109/issues/26), только компонент покрытия.

## Контракт до изменения кода

- **Goal:** руководитель различает наличие регионального файла, проверку полей и демо; неизвестное не становится нулём.
- **Allowed files:** `data_coverage.py`, `app.py` (только новый read-only endpoint), `static/index.html`, `static/coverage.js`, `static/style.css`, `scripts/check_coverage.py`, `scripts/smoke.py`, `.github/workflows/ci.yml`; точечные README/AGENTS/research/backlog/handoff updates. Без изменений ML, ingestion, complaint schema или аудита решений.
- **Inputs:** `planning/data_inventory.json`, `planning/data_matrix.json`, существующий `REGIONS`; исходные CSV не читает веб-приложение.
- **Acceptance:** 20 регионов, 7 поставленных/13 отсутствующих и 8 файлов выводятся из инвентаря; фильтр региона; статусы заголовков не объявляются проверкой содержимого; неизвестные строки/история/свежесть — null; отдельная подпись синтетических счётчиков; загрузка/пустое состояние/ошибка/повтор; управление клавиатурой.
- **Tests:** свежие `python scripts/check_plan.py`, `python scripts/smoke.py`; новые проверки источников, null, фильтра, рассогласования файлов и безопасного 503; браузерная проверка клавиатуры и состояний.
- **Dependencies:** P109-09 API доступен, issue #9 ещё открыт; P109-25 остаётся зависимостью полной витрины. Этот компонент не закрывает P109-26, P109-25 или национальное покрытие.
- **Evidence:** команды, exit status, синтетический скриншот, независимое ревью, focused PR без merge.

Уточнение контракта после локального аудита: разрешены `scripts/audit_received_csv.py`, его синтетические тесты, необязательный `scripts/check_coverage_ui.cjs` и числовой `local_profile` в существующем inventory. UI показывает проверенный подсчёт **CSV-записей**; уникальность обращений, значения полей и полнота истории остаются непроверенными. Исходные файлы и полный промежуточный отчёт не входят в Git.

## Передано и границы

- **Работает:** read-only `/api/data-coverage`, 20 регионов из существующих источников, 7/13/8, регион/наличие файла, клавиатура, загрузка/пустое состояние/503/повтор, защита от позднего ответа. Подсчитано 1 036 858 CSV-записей; личные строки не публикуются.
- **Mock:** классификация по правилам и кандидаты по теме, 20 синтетических fixtures, операторское подтверждение/аудит/SQLite-счётчики. Ни одна из двух моделей не обучена; настоящих метрик классификации/поиска нет.
- **Недоступно:** проверенные темы/агрегаты организаторов, общий инцидент/повтор, прогноз, alerts, NL, PDF/XLSX. Последние четыре модуля возвращают 501. Нет production deployment, полного покрытия или завершённого P109-26.
- **Данные:** все 8 файлов прочитаны локально, 0 blank/width/parser errors. Совпали размеры/заголовки; бинарная идентичность Drive, уникальность/перекрытие частей Павлодара, полнота истории, RU/KK и права на публикацию не установлены. Akmola `request_subject`: 3475/3506 заполнено, медиана 24, p95 50 символов — кандидат, не проверенный intake text. Караганда: оба формата времени неподдержаны; Акмола: 32 непустые даты не разобраны.
- **Решения:** стек и две отдельные будущие fine-tuning ветки E5 сохранены; код/активы аналогов не включены. Полезность прецедента оценивается независимо от типа связи, исходные обращения сохраняются. Никаких измеренных улучшений времени/качества не заявлено.

## Воспроизведение и фактические проверки

Linux/macOS setup и обычный запуск — README. В этом Windows-сеансе из корня workspace:
```powershell
$runtime = 'C:/Users/oarka/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
& $runtime -m venv work/pulse109/.venv
# Bundled runtime не содержит ensurepip; venv создан, pip bootstrap завершился ошибкой.
& $runtime -m pip --python work/pulse109/.venv/Scripts/python.exe install -r work/pulse109-olga/requirements.txt
$env:PYTHONUTF8='1'
Set-Location work/pulse109-olga
& ../pulse109/.venv/Scripts/python.exe scripts/check_plan.py
& ../pulse109/.venv/Scripts/python.exe scripts/check_coverage.py
& ../pulse109/.venv/Scripts/python.exe scripts/test_audit_received_csv.py
& ../pulse109/.venv/Scripts/python.exe scripts/smoke.py
```
Все четыре финальные команды **exit 0**: план 42 задачи/17 требований/35 групп источников; **10 coverage**, **8 audit**, **14 smoke** проверок. Исходный `a6b9443` отдельно дал 13 smoke, exit 0. На ограниченном Windows запуске tempfile/SQLite получал Access denied; те же тесты вне песочницы прошли. Это сбой окружения, код приложения ради него не меняли. Версии установленных библиотек записаны в README; исходные диапазоны requirements не менялись.

GitHub CI для implementation commit `5ceec95`: **success**, [test job](https://github.com/Eliasans02/pulse109/actions/runs/34498662422/job/102943543932) (Linux/Python 3.11; plan, smoke, coverage, synthetic audit). Браузерная проверка — локальная.

Повторный запуск адаптированного `scripts/audit_received_csv.py --source-dir <локальная папка> --output <путь вне папки CSV>`: **exit 0**, 8 complete, те же количества. Источник в этом сеансе: `C:/Users/oarka/OneDrive/Рабочий стол/Хакатон/GovTechCampPulse109`. Полный промежуточный отчёт остаётся вне Git.

Браузерная проверка (сначала сервер, отдельная synthetic БД):
```powershell
$env:DATABASE_PATH='C:/Users/oarka/Documents/Codex/2026-09-10/10-09-2026-18-10-your/work/coverage-ui-demo.db'
& ../pulse109/.venv/Scripts/python.exe -m uvicorn app:app --host 127.0.0.1 --port 8765
# В другой консоли; из корня репозитория:
$env:NODE_PATH='C:/Users/oarka/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
& 'C:/Users/oarka/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/check_coverage_ui.cjs http://127.0.0.1:8765
```
**Exit 0, 6 UI-сценариев:** loading, клавиатура/empty, Алматы city/region и поля, 503 + повреждённый JSON/повтор, поздний ответ, 7/13 фильтры и ширина 390px. Playwright 1.62.1 + установленный Edge; исполняемая browser-зависимость не добавлена в runtime. В первой версии QA-теста Enter открывал нативный select Edge; тест исправлен на End/Tab, повтор прошёл. Desktop screenshot просмотрен: читаемый, без гражданских записей. Независимое code review не нашло блокирующих новых дефектов; замечание о валидации даты источника исправлено и покрыто тестом.

## Исследование и интеграция

В `docs/research.md`, раздел «Аналоги»: **8 продуктов / 3 репозитория**, проверка 10.09.2026. Ключевые первичные ссылки: [OneService FAQ](https://www.oneservice.gov.sg/oschatbot-faqs/), [SeeClickFix duplicate lifecycle](https://www.civicplus.help/seeclickfix/docs/mark-a-request-as-a-duplicate), [NYC единица service request](https://home4.nyc.gov/site/311reporting/311-reports/service-requests.page). Три паттерна: свидетельства рядом с выводом, подтверждённая связь с сохранением оригиналов, локальная/языковая оценка. Рабочие установки аналогов не тестировали; рекламные эффекты не выдаются за метрики.

Проверенные кодовые базы: [FixMyStreet](https://github.com/mysociety/fixmystreet) и [Ushahidi backend](https://github.com/ushahidi/platform) — AGPL-3.0-or-later; [Mark-a-Spot](https://github.com/markaspot/mark-a-spot) — GPL-2.0-or-later. Pinned LICENSE/commit/release/зависимости приведены в research; для копирования понадобятся notices, проверка отдельных лицензий и соответствующие исходники, включая сетевое условие модифицированной AGPL-версии. Сейчас копирования нет. [E5 card](https://huggingface.co/intfloat/multilingual-e5-small): MIT, RU/KK заявлены, качество на 109 не измерено.

Изменения для Ильяса: новый endpoint и `data_coverage.py`, `static/coverage.js`, компонент в index/style; `local_profile` в inventory, новые scripts/CI и документы. **SQLite, intake/confirm и trained-model контракты не изменены.** При упаковке сервера включить оба `planning/data_*.json`; рассогласованные/отсутствующие файлы дадут 503. Даты проверки inventory не являются свежестью обращений. `record_count` — только CSV-записи, не использовать как готовый P109-25 aggregate. PR требует ревью Ильяса, merge не выполнен.

## Следующие три задачи

1. **Ольга / следующая модель — безопасный и клавиатурный операторский список, частично P109-09/P109-36.** Предсуществующий `static/app.js` вставляет текст обращения/решения через innerHTML, а строки очереди доступны лишь по click. Убрать HTML-интерпретацию пользовательских строк, сделать выбор нативной кнопкой; приёмка: синтетический HTML отображается буквально, Tab/Enter/Space выбирают обращение, smoke и coverage UI проходят. Не объявлять всю безопасность P109-36 закрытой.
2. **Ильяс — P109-03/P109-04, локальная семантическая проверка.** Проверить с человеком смысл Akmola `request_subject` на небольшой разрешённой выборке; фиксировать долю исходных текстов, RU/KK/mixed/unknown, связь с метками/исходом и условия использования. Приёмка: только сводный вердикт о пригодности и конкретных ограничениях, без публикации примеров; затем решение о двух обучающих корпусах. Наличие 13 недостающих регионов не блокирует корректный пилот на пригодной части.
3. **Нурали с Ольгой — QA покрытия, поддержка P109-26.** За 20–30 минут найти поставленный/отсутствующий регион, непроверенное поле и историю, отличить demo от CSV. Приёмка-цель: пять правильных ответов, записанные время/ошибки; не называть это ML-оценкой. Затем 12 синтетических пар для проверки формулировок связи по research.

## Первый запрос следующей модели

> Продолжай Pulse 109 с актуального PR/ветки olga/data-coverage; проверь status/HEAD, сохрани более новые правки. Выполни только первый пункт handoff: безопасный вывод строк в static/app.js и клавиатурный выбор очереди. Это ранее существовавшие проблемы, не дефекты coverage. Сначала контракт и синтетические регрессионные проверки HTML как текста и Tab/Enter/Space, затем минимальная правка, smoke/coverage UI и PR без merge. Не читай реальные CSV, не меняй API/SQLite/ML/стек и не повторяй исследование. Обнови этот handoff реальными результатами. Прочитать только AGENTS.md, docs/handoff.md, P109-09/P109-36 в planning/backlog.json, static/app.js, static/index.html, static/style.css, scripts/smoke.py и scripts/check_coverage_ui.cjs; scripts/check_coverage.py нужен smoke как импорт. Остальной research не нужен.
