/**
 * Бубер 3D — приём заказов в Google Таблицу + уведомление в Telegram.
 * Список заказов для ЛК (предпочтительно):
 *   POST JSON { secret, action: "list", telegram_user_id }
 * GET ?key=&userId= — запасной вариант (редирект Google может съесть ?key=).
 *
 * Пуш клиенту при смене статуса:
 *   installable onEdit → onOrdersStatusEdit(e) на лист «Заказы», колонка «Статус».
 *   Один раз: запустить installTrigger_() из редактора (или создать триггер вручную).
 *   Клиент должен написать боту /start (иначе sendMessage по chat_id не дойдёт).
 *
 * Script Properties (Проект → Настройки проекта → Свойства скрипта):
 *   BOT_TOKEN        — токен бота от @BotFather
 *   CHAT_ID          — ваш chat id (куда слать уведомления о новых заказах)
 *   WEBHOOK_SECRET   — общий секрет (в JSON body.secret / ?key= / X-Webhook-Secret)
 *   TEST_CHAT_ID     — опционально: chat id для testStatusPush()
 *
 * Деплой: Развернуть → Новое развёртывание → Веб-приложение
 *   Выполнять от имени: Меня
 *   У кого есть доступ: Все
 *   Триггер onEdit — отдельно (не входит в web app deployment).
 *
 * См. также LK-ORDERS.md в корне репозитория.
 */

var SHEET_NAME = 'Заказы';
var HEADERS = [
  'Дата',
  'order_id',
  'telegram_user_id',
  'Имя',
  'Телефон',
  'Username',
  'Оплата',
  'Комментарий',
  'Состав',
  'Сумма',
  'Статус',
];

/**
 * GET:
 *   ?key=SECRET              — health-check
 *   ?key=SECRET&userId=123   — заказы этого telegram_user_id (для ЛК)
 *
 * MVP: userId с клиента (initDataUnsafe). Позже — verify initData.
 */
function doGet(e) {
  if (!checkSecret_(e)) {
    return json_({ ok: false, error: 'unauthorized' });
  }

  var userId = '';
  if (e && e.parameter && e.parameter.userId != null) {
    userId = String(e.parameter.userId).trim();
  }

  if (userId) {
    try {
      var orders = listOrdersByUser_(userId);
      return json_({ ok: true, orders: orders });
    } catch (err) {
      return json_({
        ok: false,
        error: String(err && err.message ? err.message : err),
      });
    }
  }

  return json_({
    ok: true,
    service: 'buber3d-orders',
    sheet: SHEET_NAME,
    time: new Date().toISOString(),
  });
}

/**
 * Preflight CORS. ContentService почти не даёт свои CORS-заголовки —
 * Mini App шлёт Content-Type: text/plain, чтобы обойти OPTIONS.
 * doOptions оставлен на всякий случай.
 */
function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(
    ContentService.MimeType.TEXT
  );
}

function doPost(e) {
  try {
    if (!checkSecret_(e)) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    var body = parseBody_(e);
    if (!body || typeof body !== 'object') {
      return json_({ ok: false, error: 'invalid_json' });
    }

    var action = str_(body.action || '').toLowerCase();
    if (action === 'list') {
      var listUid = str_(
        body.telegram_user_id != null
          ? body.telegram_user_id
          : body.telegramUserId != null
            ? body.telegramUserId
            : body.userId != null
              ? body.userId
              : ''
      );
      if (!listUid) {
        return json_({ ok: false, error: 'need_user_id' });
      }
      try {
        var listed = listOrdersByUser_(listUid);
        return json_({ ok: true, orders: listed });
      } catch (listErr) {
        return json_({
          ok: false,
          error: String(listErr && listErr.message ? listErr.message : listErr),
        });
      }
    }

    var name = str_(body.name);
    var phone = str_(body.phone);
    var username = str_(body.username || body.telegram || '');
    var payment = str_(body.payment || 'sbp').toLowerCase();
    var comment = str_(body.comment);
    var total = body.total != null ? body.total : body.totalRub;
    var createdAt = str_(body.createdAt) || new Date().toISOString();
    var itemsText = formatItems_(body.items);
    var orderId =
      str_(body.order_id || body.orderId) ||
      'ord_' + Utilities.getUuid().replace(/-/g, '').slice(0, 12);
    var telegramUserId = str_(
      body.telegram_user_id != null
        ? body.telegram_user_id
        : body.telegramUserId != null
          ? body.telegramUserId
          : body.user && body.user.id != null
            ? body.user.id
            : ''
    );

    if (!name && !phone && !username) {
      return json_({ ok: false, error: 'need_contact' });
    }

    var paymentLabel = payment === 'cash' ? 'Наличные' : 'СБП';
    var when;
    try {
      when = new Date(createdAt);
      if (isNaN(when.getTime())) when = new Date();
    } catch (err) {
      when = new Date();
    }
    var dateRu = Utilities.formatDate(when, 'Europe/Moscow', 'dd.MM.yyyy HH:mm');

    var sheet = getOrdersSheet_();
    sheet.appendRow([
      dateRu,
      orderId,
      telegramUserId,
      name,
      phone,
      username,
      paymentLabel,
      comment,
      itemsText,
      total != null && total !== '' ? Number(total) : '',
      'Новый',
    ]);
    // Sheets иначе превращает длинный id в Number / 1.23E+09
    if (telegramUserId) {
      var uidCol = HEADERS.indexOf('telegram_user_id') + 1;
      sheet
        .getRange(sheet.getLastRow(), uidCol)
        .setNumberFormat('@')
        .setValue(String(telegramUserId));
    }

    var tgOk = sendTelegram_(
      buildTgMessage_({
        dateRu: dateRu,
        orderId: orderId,
        name: name,
        phone: phone,
        username: username,
        paymentLabel: paymentLabel,
        comment: comment,
        itemsText: itemsText,
        total: total,
      })
    );

    return json_({ ok: true, telegram: tgOk, order_id: orderId });
  } catch (err) {
    return json_({
      ok: false,
      error: String(err && err.message ? err.message : err),
    });
  }
}

/* ——— helpers ——— */

function props_() {
  return PropertiesService.getScriptProperties();
}

function checkSecret_(e) {
  var expected = String(props_().getProperty('WEBHOOK_SECRET') || '').trim();
  if (!expected) {
    // Без секрета не принимаем продакшен-запросы
    return false;
  }
  var provided = '';
  // Секрет в JSON — надёжнее: Google редирект часто съедает ?key=
  if (e && e.postData && e.postData.contents) {
    try {
      var tmp = JSON.parse(String(e.postData.contents));
      if (tmp && (tmp.secret || tmp.key)) {
        provided = String(tmp.secret || tmp.key).trim();
      }
    } catch (err0) {}
  }
  if (!provided && e && e.parameter && e.parameter.key) {
    provided = String(e.parameter.key);
  }
  if (!provided && e && e.headers) {
    var h = e.headers;
    provided =
      h['X-Webhook-Secret'] ||
      h['x-webhook-secret'] ||
      h['X-WEBHOOK-SECRET'] ||
      '';
  }
  if (!provided && e && e.queryString) {
    var m = String(e.queryString).match(/(?:^|&)key=([^&]+)/);
    if (m) {
      try {
        provided = decodeURIComponent(m[1]);
      } catch (err) {
        provided = m[1];
      }
    }
  }
  return String(provided) === expected;
}

function parseBody_(e) {
  if (!e || !e.postData || e.postData.contents == null) return null;
  var raw = e.postData.contents;
  if (typeof raw !== 'string') raw = String(raw);
  raw = raw.trim();
  if (!raw) return null;
  return JSON.parse(raw);
}

function getOrdersSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  var range = sheet.getRange(1, 1, 1, HEADERS.length);
  var values = range.getValues()[0];
  var empty = values.every(function (c) {
    return c === '' || c == null;
  });
  var mismatch = false;
  if (!empty) {
    for (var i = 0; i < HEADERS.length; i++) {
      if (String(values[i] || '') !== HEADERS[i]) {
        mismatch = true;
        break;
      }
    }
  }
  if (empty || mismatch) {
    // Если первая строка пустая или не наши заголовки и данных ещё нет — пишем заголовки
    if (empty || sheet.getLastRow() <= 1) {
      range.setValues([HEADERS]);
      sheet.setFrozenRows(1);
    }
  }
}

/**
 * Индексы колонок по заголовкам (устойчиво к ручной перестановке, если заголовки на месте).
 */
function headerIndexMap_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    var key = String(headers[i] || '').trim();
    if (key) map[key] = i;
  }
  return map;
}

function listOrdersByUser_(userId) {
  var sheet = getOrdersSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var map = headerIndexMap_(sheet);
  var uidCol = map['telegram_user_id'];
  if (uidCol == null) {
    throw new Error('missing_column_telegram_user_id');
  }

  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  // getDisplayValues — id как на экране, без scientific notation от Number
  var data = sheet.getRange(2, 1, lastRow, lastCol).getValues();
  var display = sheet.getRange(2, 1, lastRow, lastCol).getDisplayValues();
  var want = telegramIdString_(userId);
  var out = [];

  for (var r = data.length - 1; r >= 0; r--) {
    var row = data[r];
    var cellUid = '';
    if (typeof row[uidCol] === 'number' && isFinite(row[uidCol])) {
      cellUid = String(Math.round(row[uidCol]));
    } else {
      cellUid = telegramIdString_(
        display[r][uidCol] !== '' && display[r][uidCol] != null
          ? display[r][uidCol]
          : row[uidCol]
      );
    }
    if (!cellUid || cellUid !== want) continue;

    out.push({
      order_id: cell_(row, map, 'order_id'),
      date: cell_(row, map, 'Дата'),
      telegram_user_id: cellUid,
      name: cell_(row, map, 'Имя'),
      phone: cell_(row, map, 'Телефон'),
      username: cell_(row, map, 'Username'),
      payment: cell_(row, map, 'Оплата'),
      comment: cell_(row, map, 'Комментарий'),
      items: cell_(row, map, 'Состав'),
      total: numOrRaw_(row, map, 'Сумма'),
      status: cell_(row, map, 'Статус') || 'Новый',
    });
  }
  return out;
}

function cell_(row, map, header) {
  var idx = map[header];
  if (idx == null) return '';
  var v = row[idx];
  if (v == null) return '';
  return String(v);
}

function numOrRaw_(row, map, header) {
  var idx = map[header];
  if (idx == null) return '';
  var v = row[idx];
  if (v === '' || v == null) return '';
  var n = Number(v);
  return isNaN(n) ? String(v) : n;
}

function formatItems_(items) {
  if (items == null) return '';
  if (typeof items === 'string') return items;
  if (!Array.isArray(items)) return String(items);
  return items
    .map(function (i, idx) {
      if (typeof i === 'string') return idx + 1 + '. ' + i;
      var name = i.name || i.title || 'Товар';
      var qty = i.qty != null ? i.qty : i.quantity != null ? i.quantity : 1;
      var price = i.price != null ? Number(i.price) : null;
      var bits = [];
      if (i.material) bits.push(i.material);
      if (i.color) bits.push(i.color);
      if (i.size) bits.push(i.size);
      if (i.stlName) bits.push('файл: ' + i.stlName);
      if (i.comment) bits.push(i.comment);
      var meta = bits.length ? ' (' + bits.join(', ') + ')' : '';
      var sum =
        price != null && !isNaN(price)
          ? ' — ' + formatRub_(price * Number(qty))
          : '';
      return idx + 1 + '. ' + name + ' × ' + qty + sum + meta;
    })
    .join('\n');
}

function formatRub_(n) {
  var v = Math.round(Number(n) || 0);
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

function buildTgMessage_(o) {
  var lines = [];
  lines.push('🛒 Новый заказ «Бубер 3D»');
  lines.push('📅 ' + o.dateRu);
  if (o.orderId) lines.push('🆔 ' + o.orderId);
  lines.push('');
  lines.push(o.itemsText || '(состав не указан)');
  lines.push('');
  if (o.total != null && o.total !== '') {
    lines.push('💰 Итого: ' + formatRub_(o.total));
  }
  lines.push('💳 Оплата: ' + o.paymentLabel);
  if (o.name) lines.push('👤 Имя: ' + o.name);
  if (o.phone) lines.push('📞 Телефон: ' + o.phone);
  if (o.username) {
    var u = String(o.username).replace(/^@/, '');
    lines.push('✈️ Telegram: @' + u);
  }
  if (o.comment) {
    lines.push('');
    lines.push('💬 ' + o.comment);
  }
  return lines.join('\n');
}

/**
 * Уведомление владельцу (CHAT_ID) о новом заказе.
 */
function sendTelegram_(text) {
  var chatId = String(props_().getProperty('CHAT_ID') || '').trim();
  return sendTelegramTo_(chatId, text).ok;
}

/**
 * sendMessage любому chat_id (числовой id или @username).
 * @return {{ok:boolean, code:number, body:string}}
 */
function sendTelegramTo_(chatId, text) {
  var token = String(props_().getProperty('BOT_TOKEN') || '').trim();
  var id = String(chatId || '').trim();
  if (!token || !id) {
    return { ok: false, code: 0, body: 'missing_token_or_chat' };
  }
  var url =
    'https://api.telegram.org/bot' +
    encodeURIComponent(token) +
    '/sendMessage';
  var payload = {
    chat_id: id,
    text: text,
    disable_web_page_preview: true,
  };
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  var code = res.getResponseCode();
  var body = '';
  try {
    body = String(res.getContentText() || '');
  } catch (err) {
    body = '';
  }
  return { ok: code >= 200 && code < 300, code: code, body: body };
}


/* ——— пуш клиенту при смене статуса ——— */

/**
 * Один раз: выберите эту функцию в редакторе Apps Script → Выполнить.
 * Создаёт installable onEdit (простой onEdit не может вызывать UrlFetchApp).
 * Либо вручную: Триггеры → Добавить → onOrdersStatusEdit / При изменении / Таблица.
 */
function installTrigger_() {
  var handlers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < handlers.length; i++) {
    if (handlers[i].getHandlerFunction() === 'onOrdersStatusEdit') {
      Logger.log('onOrdersStatusEdit trigger already exists');
      return;
    }
  }
  ScriptApp.newTrigger('onOrdersStatusEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  Logger.log('Created installable onEdit → onOrdersStatusEdit');
}

/**
 * Installable onEdit: смена колонки «Статус» на листе «Заказы» → Telegram клиенту.
 */
function onOrdersStatusEdit(e) {
  try {
    notifyCustomerStatusChange_(e);
  } catch (err) {
    Logger.log(
      'onOrdersStatusEdit error: ' +
        String(err && err.message ? err.message : err)
    );
  }
}

function notifyCustomerStatusChange_(e) {
  if (!e || !e.range) {
    Logger.log('status push skip: no edit event/range');
    return;
  }

  var sheet = e.range.getSheet();
  if (!sheet || sheet.getName() !== SHEET_NAME) {
    Logger.log(
      'status push skip: wrong sheet "' +
        (sheet ? sheet.getName() : '') +
        '" (need "' +
        SHEET_NAME +
        '")'
    );
    return;
  }

  // Только правка в одной колонке «Статус» (одна или несколько строк)
  if (e.range.getNumColumns() !== 1) {
    Logger.log(
      'status push skip: multi-column edit (cols=' +
        e.range.getNumColumns() +
        ')'
    );
    return;
  }

  var map = headerIndexMap_(sheet);
  var statusCol = map['Статус'];
  if (statusCol == null) {
    Logger.log('status push skip: no Статус column in header map');
    return;
  }

  var col = e.range.getColumn(); // 1-based
  if (col !== statusCol + 1) {
    Logger.log(
      'status push skip: wrong col ' +
        col +
        ' (Статус is ' +
        (statusCol + 1) +
        ')'
    );
    return;
  }

  var startRow = e.range.getRow();
  var numRows = e.range.getNumRows();
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  Logger.log(
    'status push: sheet=' +
      SHEET_NAME +
      ' rows=' +
      startRow +
      '..' +
      (startRow + numRows - 1)
  );

  for (var i = 0; i < numRows; i++) {
    var row = startRow + i;
    if (row < 2) {
      Logger.log('status push skip: header row');
      continue;
    }

    var newStatus = '';
    var oldStatus = '';
    if (numRows === 1 && e.value != null) {
      newStatus = str_(e.value);
      oldStatus = str_(e.oldValue != null ? e.oldValue : '');
    } else {
      newStatus = str_(sheet.getRange(row, col).getDisplayValue());
      // oldValue для мульти-правки недоступен
      oldStatus = '';
    }
    if (!newStatus) {
      Logger.log('status push skip: empty status at row ' + row);
      continue;
    }
    if (oldStatus && oldStatus === newStatus) {
      Logger.log(
        'status push skip: status unchanged "' + newStatus + '" row ' + row
      );
      continue;
    }

    pushStatusForRow_(sheet, map, row, lastCol, newStatus, oldStatus);
  }
}

function pushStatusForRow_(sheet, map, row, lastCol, newStatus, oldStatus) {
  var range = sheet.getRange(row, 1, row, lastCol);
  var rowValues = range.getValues()[0];
  var rowDisplay = range.getDisplayValues()[0];

  var orderId =
    cellDisplay_(rowDisplay, rowValues, map, 'order_id') || ('строка ' + row);
  var telegramUserId = telegramIdFromRow_(rowDisplay, rowValues, map);
  var username = cellDisplay_(rowDisplay, rowValues, map, 'Username');

  Logger.log(
    'status push row=' +
      row +
      ' order=' +
      orderId +
      ' rawUid=' +
      JSON.stringify(rowValues[map['telegram_user_id']]) +
      ' displayUid=' +
      JSON.stringify(
        map['telegram_user_id'] != null
          ? rowDisplay[map['telegram_user_id']]
          : null
      ) +
      ' coercedUid=' +
      telegramUserId +
      ' status=' +
      newStatus
  );

  var text = buildStatusPushMessage_({
    orderId: orderId,
    status: newStatus,
    oldStatus: oldStatus,
  });

  var target = resolveCustomerChatId_(telegramUserId, username);
  if (!target) {
    Logger.log(
      'status push skip: no telegram_user_id/username for order ' + orderId
    );
    return;
  }

  var result = sendTelegramTo_(target, text);
  if (!result.ok) {
    Logger.log(
      'status push failed order=' +
        orderId +
        ' chat=' +
        target +
        ' code=' +
        result.code +
        ' body=' +
        result.body
    );
  } else {
    Logger.log('status push ok order=' + orderId + ' chat=' + target);
  }
}

/**
 * Числовой telegram_user_id предпочтителен.
 * Если его нет — пробуем @username (сработает только если username публичный
 * и клиент уже писал боту; чаще всего нужен именно numeric id после /start).
 */
function resolveCustomerChatId_(telegramUserId, username) {
  var uid = telegramIdString_(telegramUserId);
  if (uid && /^\d+$/.test(uid)) return uid;

  var u = str_(username).replace(/^@/, '');
  if (u) return '@' + u;

  // Иногда в telegram_user_id ошибочно кладут @name
  var raw = str_(telegramUserId);
  if (raw) {
    var cleaned = raw.replace(/^@/, '');
    if (cleaned) return /^\d+$/.test(cleaned) ? cleaned : '@' + cleaned;
  }
  return '';
}

function buildStatusPushMessage_(o) {
  var lines = [];
  lines.push('📦 Бубер 3D — статус заказа');
  lines.push('');
  lines.push('Заказ: ' + o.orderId);
  lines.push('Новый статус: ' + o.status);
  if (o.oldStatus) {
    lines.push('(было: ' + o.oldStatus + ')');
  }
  lines.push('');
  lines.push('Актуальный статус также в Mini App → «Мои заказы».');
  return lines.join('\n');
}

/**
 * Читает telegram_user_id из строки: display предпочтительнее values
 * (Sheets часто хранит id как Number → 1.23E+09 в String()).
 */
function telegramIdFromRow_(rowDisplay, rowValues, map) {
  var idx = map['telegram_user_id'];
  if (idx == null) return '';
  var raw = rowValues && rowValues[idx] != null ? rowValues[idx] : '';
  var display = rowDisplay && rowDisplay[idx] != null ? rowDisplay[idx] : '';
  // Number из getValues() точнее, чем усечённый display "1.23E+09"
  if (typeof raw === 'number' && isFinite(raw)) {
    return String(Math.round(raw));
  }
  var fromDisplay = telegramIdString_(display);
  if (fromDisplay && /^\d+$/.test(fromDisplay)) return fromDisplay;
  return telegramIdString_(raw);
}

function cellDisplay_(rowDisplay, rowValues, map, header) {
  var idx = map[header];
  if (idx == null) return '';
  if (rowDisplay && rowDisplay[idx] != null && str_(rowDisplay[idx]) !== '') {
    return str_(rowDisplay[idx]);
  }
  return cell_(rowValues, map, header);
}

/**
 * Приводит telegram id к целочисленной строке без scientific notation.
 * Number / "1.23E+9" / "1234567890.0" → "1234567890".
 */
function telegramIdString_(v) {
  if (v == null || v === '') return '';
  if (typeof v === 'number') {
    if (!isFinite(v)) return '';
    return String(Math.round(v));
  }
  var s = String(v).trim();
  if (!s) return '';
  // scientific notation as text (Sheets display / copy-paste)
  if (/^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/.test(s)) {
    var n = Number(s);
    if (isFinite(n)) return String(Math.round(n));
  }
  // plain digits, optional trailing .0
  if (/^\d+(\.0+)?$/.test(s)) {
    return s.replace(/\.0+$/, '');
  }
  // Number-like with spaces
  var compact = s.replace(/\s+/g, '');
  if (/^\d+$/.test(compact)) return compact;
  return s;
}

/**
 * Тест пуша из редактора: выберите testStatusPush → Выполнить.
 * Цель: Script Property TEST_CHAT_ID, иначе первый непустой telegram_user_id на листе,
 * иначе CHAT_ID. В журнале: ok/code/body ответа Telegram.
 */
function testStatusPush() {
  var props = props_();
  var token = String(props.getProperty('BOT_TOKEN') || '').trim();
  if (!token) {
    Logger.log('testStatusPush: BOT_TOKEN missing in Script Properties');
    return;
  }

  var chatId = String(props.getProperty('TEST_CHAT_ID') || '').trim();
  if (!chatId) {
    chatId = firstTelegramUserIdFromSheet_();
  }
  if (!chatId) {
    chatId = String(props.getProperty('CHAT_ID') || '').trim();
  }
  chatId = telegramIdString_(chatId) || str_(chatId);
  if (!chatId) {
    Logger.log(
      'testStatusPush: no chat id — set TEST_CHAT_ID or fill telegram_user_id / CHAT_ID'
    );
    return;
  }

  var msg =
    '🧪 Бубер 3D — тест пуша\n' +
    'Если видите это сообщение, sendMessage работает.\n' +
    'chat_id=' +
    chatId +
    '\n' +
    Utilities.formatDate(new Date(), 'Europe/Moscow', 'dd.MM.yyyy HH:mm:ss');

  var result = sendTelegramTo_(chatId, msg);
  Logger.log(
    'testStatusPush: chat=' +
      chatId +
      ' ok=' +
      result.ok +
      ' code=' +
      result.code +
      ' body=' +
      result.body
  );
}

function firstTelegramUserIdFromSheet_() {
  try {
    var sheet = getOrdersSheet_();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return '';
    var map = headerIndexMap_(sheet);
    var uidCol = map['telegram_user_id'];
    if (uidCol == null) return '';
    var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
    var values = sheet.getRange(2, 1, lastRow, lastCol).getValues();
    var display = sheet.getRange(2, 1, lastRow, lastCol).getDisplayValues();
    for (var r = 0; r < values.length; r++) {
      var id = '';
      if (typeof values[r][uidCol] === 'number' && isFinite(values[r][uidCol])) {
        id = String(Math.round(values[r][uidCol]));
      } else {
        id = telegramIdString_(
          display[r][uidCol] !== '' && display[r][uidCol] != null
            ? display[r][uidCol]
            : values[r][uidCol]
        );
      }
      if (id) return id;
    }
  } catch (err) {
    Logger.log(
      'firstTelegramUserIdFromSheet_ error: ' +
        String(err && err.message ? err.message : err)
    );
  }
  return '';
}

function str_(v) {
  if (v == null) return '';
  return String(v).trim();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
