/**
 * Бубер 3D — приём заказов в Google Таблицу + уведомление в Telegram.
 *
 * Script Properties (Проект → Настройки проекта → Свойства скрипта):
 *   BOT_TOKEN        — токен бота от @BotFather
 *   CHAT_ID          — ваш chat id (куда слать уведомления)
 *   WEBHOOK_SECRET   — общий секрет (заголовок X-Webhook-Secret или ?key=)
 *
 * Деплой: Развернуть → Новое развёртывание → Веб-приложение
 *   Выполнять от имени: Меня
 *   У кого есть доступ: Все
 */

var SHEET_NAME = 'Заказы';
var HEADERS = [
  'Дата',
  'Имя',
  'Телефон',
  'Username',
  'Оплата',
  'Комментарий',
  'Состав',
  'Сумма',
  'Статус',
];

function doGet(e) {
  if (!checkSecret_(e)) {
    return json_({ ok: false, error: 'unauthorized' }, 401);
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
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
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

    var name = str_(body.name);
    var phone = str_(body.phone);
    var username = str_(body.username || body.telegram || '');
    var payment = str_(body.payment || 'sbp').toLowerCase();
    var comment = str_(body.comment);
    var total = body.total != null ? body.total : body.totalRub;
    var createdAt = str_(body.createdAt) || new Date().toISOString();
    var itemsText = formatItems_(body.items);

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
      name,
      phone,
      username,
      paymentLabel,
      comment,
      itemsText,
      total != null && total !== '' ? Number(total) : '',
      'Новый',
    ]);

    var tgOk = sendTelegram_(buildTgMessage_({
      dateRu: dateRu,
      name: name,
      phone: phone,
      username: username,
      paymentLabel: paymentLabel,
      comment: comment,
      itemsText: itemsText,
      total: total,
    }));

    return json_({ ok: true, telegram: tgOk });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
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
  if (e && e.parameter && e.parameter.key) {
    provided = String(e.parameter.key);
  }
  if (!provided && e && e.headers) {
    // Apps Script может отдавать заголовки в разном регистре
    var h = e.headers;
    provided =
      h['X-Webhook-Secret'] ||
      h['x-webhook-secret'] ||
      h['X-WEBHOOK-SECRET'] ||
      '';
  }
  // Иногда postData / query в path
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
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
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

function sendTelegram_(text) {
  var token = String(props_().getProperty('BOT_TOKEN') || '').trim();
  var chatId = String(props_().getProperty('CHAT_ID') || '').trim();
  if (!token || !chatId) return false;
  var url =
    'https://api.telegram.org/bot' +
    encodeURIComponent(token) +
    '/sendMessage';
  var payload = {
    chat_id: chatId,
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
  return code >= 200 && code < 300;
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
