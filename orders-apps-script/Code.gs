/**
 * Бубер 3D — приём заказов в Google Таблицу + уведомление в Telegram.
 * Список заказов для ЛК (предпочтительно):
 *   POST JSON { secret, action: "list", telegram_user_id }
 * GET ?key=&userId= — запасной вариант (редирект Google может съесть ?key=).
 *
 * Пуш клиенту при смене статуса:
 *   installable onEdit → onOrdersStatusEdit(e) на лист «Заказы», колонка «Статус».
 *   Один раз: запустить installTrigger() из редактора (удалит старые и создаст On edit).
 *   Тип триггера ОБЯЗАТЕЛЬНО: Из таблицы / При изменении (НЕ по времени, НЕ календарь).
 *   Клиент должен написать боту /start (иначе sendMessage по chat_id не дойдёт).
 *
 * Кнопки статуса под уведомлением о новом заказе (чат CHAT_ID):
 *   «В работе» / «Готов к выдаче» / «Выдан».
 *   callback_data: s:<orderId>:wrk|rdy|out (≤64 байт).
 *   Telegram шлёт callback_query на doPost БЕЗ WEBHOOK_SECRET.
 *   Принимаем только если message.chat.id == CHAT_ID.
 *   Скрипт сам пишет «Статус» и вызывает pushStatusForRow_ (onEdit от скрипта не срабатывает).
 *   Один раз после деплоя: выполнить setTelegramWebhook() (или setTelegramWebhookUrl_).
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
  'Промокод',
  'Скидка',
  'Сумма до скидки',
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
    var body = null;
    var parseFailed = false;
    try {
      body = parseBody_(e);
    } catch (parseErr) {
      parseFailed = true;
      body = null;
    }

    // Кнопки админа: Telegram присылает callback_query без WEBHOOK_SECRET.
    // Заказы Mini App ниже по-прежнему требуют секрет.
    if (body && typeof body === 'object' && body.callback_query) {
      return handleAdminCallback_(body.callback_query);
    }

    if (!checkSecret_(e)) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    if (parseFailed || !body || typeof body !== 'object') {
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
    var subtotal = body.subtotal != null ? body.subtotal : '';
    var promoCode = str_(body.promo_code || body.promoCode);
    var promoType = str_(body.promo_type || body.promoType);
    var promoValue = body.promo_value != null ? body.promo_value : body.promoValue;
    var promoLabel = str_(body.promo_label || body.promoLabel);
    var discount = body.discount != null ? body.discount : body.discountRub;
    var deliveryDiscountPending = str_(
      body.delivery_discount_pending || body.deliveryDiscountPending
    );
    var createdAt = str_(body.createdAt) || new Date().toISOString();
    var itemsText = formatItems_(body.items);
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
    // ensureHeaders_ уже вызван в getOrdersSheet_; promo-колонки гарантированы.

    // Клиентский order_id (pending_/ord_/ping-) ИГНОРИРУЕМ.
    // Источник истины — таблица: 1000, 1001…
    var clientOrderId = str_(body.order_id || body.orderId);
    var promoDisplay = promoCode;
    if (promoLabel) {
      promoDisplay = promoCode ? promoCode + ' (' + promoLabel + ')' : promoLabel;
    }
    if (deliveryDiscountPending) {
      promoDisplay = (promoDisplay ? promoDisplay + '; ' : '') + deliveryDiscountPending;
    }
    var discountVal =
      discount != null && discount !== '' ? Number(discount) : '';
    var subtotalVal =
      subtotal !== '' && subtotal != null ? Number(subtotal) : '';

    var lock = LockService.getScriptLock();
    lock.waitLock(15000);
    var orderId;
    var lastRowLocked;
    var mapLocked;
    try {
      // Всегда свой номер. clientOrderId (pending_/ord_/…) только для логов.
      orderId = nextOrderId_(sheet);
      if (clientOrderId) {
        Logger.log('ignore client order_id=' + clientOrderId + ' -> ' + orderId);
      }
      mapLocked = headerIndexMap_(sheet);
      var rowArr = buildRowByHeaders_(sheet, mapLocked, {
        'Дата': dateRu,
        'order_id': orderId,
        'telegram_user_id': telegramUserId,
        'Имя': name,
        'Телефон': phone,
        'Username': username,
        'Оплата': paymentLabel,
        'Комментарий': comment,
        'Состав': itemsText,
        'Сумма': total != null && total !== '' ? Number(total) : '',
        'Статус': 'Новый',
        'Промокод': promoDisplay || '',
        'Скидка': discountVal,
        'Сумма до скидки': subtotalVal,
      });
      // appendRow принимает любую длину; длина = ширина листа после ensureHeaders_
      sheet.appendRow(rowArr);
      lastRowLocked = sheet.getLastRow();
      // Текстовый формат для id (Sheets иначе портит длинные числа)
      writeTextCol_(sheet, lastRowLocked, mapLocked, 'order_id', orderId);
      writeTextCol_(sheet, lastRowLocked, mapLocked, 'telegram_user_id', telegramUserId);
    } finally {
      lock.releaseLock();
    }

    var tgText = buildTgMessage_({
      dateRu: dateRu,
      orderId: orderId,
      name: name,
      phone: phone,
      username: username,
      paymentLabel: paymentLabel,
      comment: comment,
      itemsText: itemsText,
      total: total,
      subtotal: subtotal,
      promoCode: promoCode,
      promoLabel: promoLabel,
      discount: discount,
      deliveryDiscountPending: deliveryDiscountPending,
    });
    var tgOk = sendTelegram_(tgText, {
      reply_markup: adminStatusKeyboard_(orderId),
    });

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
  ensurePromoColumns_(sheet);
}

/**
 * Добавляет колонки Промокод / Скидка / Сумма до скидки в конец, не ломая старые данные.
 * ВАЖНО: Sheet.getRange(row, column, numRows, numColumns) — 3-й/4-й аргументы это
 * КОЛИЧЕСТВО строк/колонок, а не endRow/endCol. Старый вызов
 * getRange(1, 12, 1, 14) давал range на 14 колонок → ошибка «array: 3; range: 14».
 */
function ensurePromoColumns_(sheet) {
  var extra = ['Промокод', 'Скидка', 'Сумма до скидки'];
  var map = headerIndexMap_(sheet);
  var missing = [];
  for (var i = 0; i < extra.length; i++) {
    if (map[extra[i]] == null) missing.push(extra[i]);
  }
  if (!missing.length) return;

  // Правее последнего непустого заголовка (или после HEADERS.length)
  var probeCols = Math.max(sheet.getLastColumn(), HEADERS.length, 1);
  var headerRow = sheet.getRange(1, 1, 1, probeCols).getValues()[0];
  var rightmost = 0;
  for (var j = 0; j < headerRow.length; j++) {
    if (headerRow[j] !== '' && headerRow[j] != null) rightmost = j + 1;
  }
  var startCol = rightmost + 1;
  if (startCol < 1) startCol = 1;

  // getRange(row, column, numRows, numColumns) — пишем ровно missing.length колонок
  sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);
}

/**
 * Строка для appendRow / setValues: длина = max(lastColumn, HEADERS, max header index+1).
 * Значения раскладываются по имени заголовка; неизвестные колонки — пустые.
 */
function buildRowByHeaders_(sheet, map, valuesByHeader) {
  var width = Math.max(sheet.getLastColumn(), HEADERS.length, 1);
  for (var key in map) {
    if (Object.prototype.hasOwnProperty.call(map, key) && map[key] + 1 > width) {
      width = map[key] + 1;
    }
  }
  var row = [];
  for (var i = 0; i < width; i++) row.push('');
  for (var header in valuesByHeader) {
    if (!Object.prototype.hasOwnProperty.call(valuesByHeader, header)) continue;
    var idx = map[header];
    if (idx == null) continue;
    row[idx] = valuesByHeader[header];
  }
  return row;
}

/** Диапазон по абсолютным координатам (start..end включительно). */
function a1Range_(sheet, startRow, startCol, endRow, endCol) {
  var numRows = endRow - startRow + 1;
  var numCols = endCol - startCol + 1;
  if (numRows < 1) numRows = 1;
  if (numCols < 1) numCols = 1;
  return sheet.getRange(startRow, startCol, numRows, numCols);
}



/**
 * Временные / устаревшие id с клиента — не сохраняем в таблицу.
 * pending_* — локальный id Mini App до ответа webhook.
 * ord_* / ping-* — старые схемы нумерации.
 */
function isThrowawayOrderId_(raw) {
  var s = String(raw || '').trim();
  if (!s) return true;
  if (/^pending_/i.test(s)) return true;
  if (/^ord_/i.test(s)) return true;
  if (/^ping-/i.test(s)) return true;
  return false;
}

/** Записать текстовое значение в колонку по имени заголовка (формат @). */
function writeTextCol_(sheet, row, map, header, value) {
  var idx = map[header];
  if (idx == null) return;
  var v = value == null ? '' : String(value);
  sheet.getRange(row, idx + 1).setNumberFormat('@').setValue(v);
}

/**
 * Следующий номер заказа: max(числовые order_id) + 1, минимум 1000.
 * Игнорирует pending_*, ord_*, ping-*, пустые и нечисловые значения.
 * @return {string}
 */
function nextOrderId_(sheet) {
  var map = headerIndexMap_(sheet);
  var col = map['order_id'];
  var start = 1000;
  if (col == null) return String(start);

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return String(start);

  var values = a1Range_(sheet, 2, col + 1, lastRow, col + 1).getDisplayValues();
  var maxNum = start - 1;
  for (var i = 0; i < values.length; i++) {
    var raw = String(values[i][0] || '').trim();
    if (!raw) continue;
    if (isThrowawayOrderId_(raw)) continue;
    // только целые числа (строка или число), без префиксов
    if (!/^\d+$/.test(raw)) continue;
    var n = parseInt(raw, 10);
    if (!isNaN(n) && n > maxNum) maxNum = n;
  }
  return String(maxNum + 1);
}

/**
 * Индексы колонок по заголовкам (устойчиво к ручной перестановке, если заголовки на месте).
 */
function headerIndexMap_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  var headers = a1Range_(sheet, 1, 1, 1, lastCol).getValues()[0];
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
  var data = a1Range_(sheet, 2, 1, lastRow, lastCol).getValues();
  var display = a1Range_(sheet, 2, 1, lastRow, lastCol).getDisplayValues();
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
  if (o.subtotal != null && o.subtotal !== '' && o.total != null && Number(o.subtotal) !== Number(o.total)) {
    lines.push('📦 Сумма товаров: ' + formatRub_(o.subtotal));
  }
  if (o.promoCode) {
    var promoLine = '🎟 Промокод: ' + o.promoCode;
    if (o.promoLabel) promoLine += ' (' + o.promoLabel + ')';
    lines.push(promoLine);
  }
  if (o.discount != null && o.discount !== '' && Number(o.discount) > 0) {
    lines.push('🏷 Скидка: −' + formatRub_(o.discount));
  }
  if (o.deliveryDiscountPending) {
    lines.push('🚚 Скидка на доставку: ' + o.deliveryDiscountPending);
  }
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
 * extra.reply_markup — inline-кнопки статуса (необязательно).
 */
function sendTelegram_(text, extra) {
  var chatId = String(props_().getProperty('CHAT_ID') || '').trim();
  return sendTelegramTo_(chatId, text, extra).ok;
}

/**
 * sendMessage любому chat_id (числовой id или @username).
 * extra может содержать reply_markup.
 * @return {{ok:boolean, code:number, body:string}}
 */
function sendTelegramTo_(chatId, text, extra) {
  var id = String(chatId || '').trim();
  if (!id) {
    return { ok: false, code: 0, body: 'missing_token_or_chat' };
  }
  var payload = {
    chat_id: id,
    text: text,
    disable_web_page_preview: true,
  };
  if (extra && extra.reply_markup) {
    payload.reply_markup = extra.reply_markup;
  }
  var result = telegramApi_('sendMessage', payload);
  if (!String(props_().getProperty('BOT_TOKEN') || '').trim()) {
    return { ok: false, code: 0, body: 'missing_token_or_chat' };
  }
  return result;
}

/**
 * POST https://api.telegram.org/bot<token>/<method>
 * @return {{ok:boolean, code:number, body:string}}
 */
function telegramApi_(method, payload) {
  var token = String(props_().getProperty('BOT_TOKEN') || '').trim();
  if (!token) {
    return { ok: false, code: 0, body: 'missing_token' };
  }
  var url =
    'https://api.telegram.org/bot' +
    encodeURIComponent(token) +
    '/' +
    method;
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload || {}),
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

/** Подписи статусов для callback_data wrk|rdy|out. */
function statusLabelByShort_(short) {
  if (short === 'wrk') return 'В работе';
  if (short === 'rdy') return 'Готов к выдаче';
  if (short === 'out') return 'Выдан';
  return '';
}

/**
 * Inline-клавиатура под новым заказом.
 * callback_data ≤ 64 байт: s:<orderId>:wrk|rdy|out
 */
function adminStatusKeyboard_(orderId) {
  var id = String(orderId == null ? '' : orderId);
  return {
    inline_keyboard: [
      [
        { text: 'В работе', callback_data: statusCallbackData_(id, 'wrk') },
        { text: 'Готов к выдаче', callback_data: statusCallbackData_(id, 'rdy') },
        { text: 'Выдан', callback_data: statusCallbackData_(id, 'out') },
      ],
    ],
  };
}

function statusCallbackData_(orderId, short) {
  var data = 's:' + String(orderId) + ':' + short;
  // Лимит Telegram — 64 байта. Наши id короткие (1000+); на всякий случай режем id.
  if (data.length > 64) {
    var tail = ':' + short;
    var keep = 64 - ('s:'.length + tail.length);
    if (keep < 1) keep = 1;
    data = 's:' + String(orderId).substring(0, keep) + tail;
  }
  return data;
}

function parseStatusCallbackData_(raw) {
  var s = String(raw || '');
  var m = s.match(/^s:(.+):(wrk|rdy|out)$/);
  if (!m) return null;
  var label = statusLabelByShort_(m[2]);
  if (!label) return null;
  return { orderId: m[1], short: m[2], label: label };
}

/**
 * callback_query от Telegram. Секрет вебхука НЕ проверяем.
 * Разрешён только чат из Script Property CHAT_ID.
 */
function handleAdminCallback_(cq) {
  var cqId = cq && cq.id != null ? String(cq.id) : '';
  try {
    var adminChat = String(props_().getProperty('CHAT_ID') || '').trim();
    var msg = cq && cq.message ? cq.message : null;
    var fromChat = '';
    if (msg && msg.chat && msg.chat.id != null) {
      fromChat = String(msg.chat.id).trim();
    }
    if (!adminChat || !fromChat || fromChat !== adminChat) {
      if (cqId) answerCallbackQuery_(cqId, 'Нет доступа');
      Logger.log(
        'admin callback denied fromChat=' + fromChat + ' expected=' + adminChat
      );
      return json_({ ok: false, error: 'unauthorized' });
    }

    var parsed = parseStatusCallbackData_(cq.data);
    if (!parsed) {
      answerCallbackQuery_(cqId, 'Неизвестная кнопка');
      return json_({ ok: false, error: 'bad_callback' });
    }

    var sheet = getOrdersSheet_();
    var map = headerIndexMap_(sheet);
    var statusCol = map['Статус'];
    if (statusCol == null) {
      answerCallbackQuery_(cqId, 'Нет колонки Статус');
      return json_({ ok: false, error: 'no_status_col' });
    }

    var row = findOrderRowById_(sheet, map, parsed.orderId);
    if (row < 2) {
      answerCallbackQuery_(cqId, 'Заказ не найден');
      Logger.log('admin callback order not found ' + parsed.orderId);
      return json_({ ok: false, error: 'order_not_found' });
    }

    var oldStatus = str_(sheet.getRange(row, statusCol + 1).getDisplayValue());
    if (oldStatus !== parsed.label) {
      sheet.getRange(row, statusCol + 1).setValue(parsed.label);
    }

    answerCallbackQuery_(cqId, 'Статус: ' + parsed.label);

    // Правка ячейки из скрипта НЕ вызывает onEdit — пуш клиенту вручную.
    if (oldStatus !== parsed.label) {
      var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
      pushStatusForRow_(sheet, map, row, lastCol, parsed.label, oldStatus);
    } else {
      Logger.log(
        'admin callback status unchanged order=' +
          parsed.orderId +
          ' status=' +
          parsed.label
      );
    }

    var baseText = '';
    if (msg.text != null) baseText = String(msg.text);
    else if (msg.caption != null) baseText = String(msg.caption);
    var newText = withAdminStatusLine_(baseText, parsed.label);
    var edit = editAdminMessage_(
      fromChat,
      msg.message_id,
      newText,
      adminStatusKeyboard_(parsed.orderId)
    );
    if (!edit.ok) {
      Logger.log(
        'editMessageText failed order=' +
          parsed.orderId +
          ' code=' +
          edit.code +
          ' body=' +
          edit.body
      );
    }

    return json_({
      ok: true,
      order_id: parsed.orderId,
      status: parsed.label,
    });
  } catch (err) {
    Logger.log(
      'handleAdminCallback_ error: ' +
        String(err && err.message ? err.message : err)
    );
    if (cqId) {
      try {
        answerCallbackQuery_(cqId, 'Ошибка, см. журнал');
      } catch (err2) {}
    }
    return json_({
      ok: false,
      error: String(err && err.message ? err.message : err),
    });
  }
}

function findOrderRowById_(sheet, map, orderId) {
  var col = map['order_id'];
  if (col == null) return -1;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var want = String(orderId || '').trim();
  if (!want) return -1;
  var values = a1Range_(sheet, 2, col + 1, lastRow, col + 1).getDisplayValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0] || '').trim() === want) return i + 2;
  }
  return -1;
}

function answerCallbackQuery_(callbackQueryId, text) {
  var id = String(callbackQueryId || '').trim();
  if (!id) return { ok: false, code: 0, body: 'no_callback_id' };
  var payload = { callback_query_id: id };
  if (text) payload.text = String(text).substring(0, 200);
  return telegramApi_('answerCallbackQuery', payload);
}

function editAdminMessage_(chatId, messageId, text, replyMarkup) {
  var payload = {
    chat_id: String(chatId),
    message_id: messageId,
    text: text,
    disable_web_page_preview: true,
  };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  return telegramApi_('editMessageText', payload);
}

/** Дописывает или заменяет строку «📌 Статус: …» в тексте админ-сообщения. */
function withAdminStatusLine_(text, statusLabel) {
  var raw = String(text || '');
  var lines = raw.split('\n');
  while (lines.length && /^\s*📌 Статус:/.test(lines[lines.length - 1])) {
    lines.pop();
  }
  while (lines.length && String(lines[lines.length - 1]).trim() === '') {
    lines.pop();
  }
  lines.push('');
  lines.push('📌 Статус: ' + statusLabel);
  var out = lines.join('\n');
  if (out.length > 4000) {
    out =
      out.substring(0, 3900) +
      '\n…\n\n📌 Статус: ' +
      statusLabel;
  }
  return out;
}

/**
 * Один раз после «Новая версия» веб-приложения: выполнить setTelegramWebhook.
 * Ставит webhook бота на URL текущего развёртывания (кнопки callback_query).
 * Если getUrl() пустой — выполните setTelegramWebhookUrl_('https://script.google.com/macros/s/XXX/exec')
 * либо откройте в браузере:
 *   https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<URL_/exec>
 */
function setTelegramWebhook() {
  var url = '';
  try {
    var svc = ScriptApp.getService();
    if (svc && svc.getUrl) url = String(svc.getUrl() || '').trim();
  } catch (err) {
    Logger.log(
      'setTelegramWebhook getUrl error: ' +
        String(err && err.message ? err.message : err)
    );
    url = '';
  }
  if (!url) {
    Logger.log(
      'setTelegramWebhook: ScriptApp.getService().getUrl() пустой. ' +
        'Разверните веб-приложение (доступ: Все), скопируйте URL, который заканчивается на /exec, ' +
        'и выполните setTelegramWebhookUrl_("https://script.google.com/macros/s/.../exec"). ' +
        'Либо в браузере: https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<URL_EXEC>'
    );
    return;
  }
  setTelegramWebhookUrl_(url);
}

/**
 * Поставить webhook на конкретный URL /exec (если getUrl() недоступен).
 * Запуск из редактора: вставить URL в вызов или временно подставить строку и Выполнить.
 */
function setTelegramWebhookUrl_(url) {
  var clean = String(url || '').trim();
  if (!clean) {
    Logger.log(
      'setTelegramWebhookUrl_: пустой URL. Вставьте адрес веб-приложения, ' +
        'например setTelegramWebhookUrl_("https://script.google.com/macros/s/XXX/exec")'
    );
    return;
  }
  var result = telegramApi_('setWebhook', {
    url: clean,
    allowed_updates: ['callback_query'],
  });
  Logger.log(
    'setTelegramWebhook url=' +
      clean +
      ' ok=' +
      result.ok +
      ' code=' +
      result.code +
      ' body=' +
      result.body
  );
}


/* ——— пуш клиенту при смене статуса ——— */

/**
 * Один раз: выберите installTrigger → Выполнить.
 * Удаляет ВСЕ старые триггеры onOrdersStatusEdit и создаёт правильный:
 *   From spreadsheet / On edit (Из таблицы / При изменении).
 * НЕ по времени, НЕ из календаря — иначе e.range будет пустым.
 *
 * Вручную: Триггеры → Добавить → функция onOrdersStatusEdit →
 *   источник «Из таблицы» → событие «При изменении» → Сохранить.
 * Старые сломанные триггеры на эту функцию — удалите перед созданием.
 */
function installTrigger() {
  var handlers = ScriptApp.getProjectTriggers();
  var removed = 0;
  for (var i = 0; i < handlers.length; i++) {
    if (handlers[i].getHandlerFunction() === 'onOrdersStatusEdit') {
      ScriptApp.deleteTrigger(handlers[i]);
      removed++;
    }
  }
  if (removed) {
    Logger.log('Deleted ' + removed + ' old onOrdersStatusEdit trigger(s)');
  }
  ScriptApp.newTrigger('onOrdersStatusEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  Logger.log(
    'Created installable onEdit → onOrdersStatusEdit ' +
      '(From spreadsheet / On edit). Change «Статус» cell in sheet to test — ' +
      'do NOT run onOrdersStatusEdit from the editor dropdown.'
  );
}

/** Alias (скрыт в dropdown из‑за _). */
function installTrigger_() {
  installTrigger();
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
  var range = e && e.range ? e.range : null;
  var eventValue = e && e.value != null ? e.value : null;
  var eventOldValue = e && e.oldValue != null ? e.oldValue : null;
  var usedActiveFallback = false;

  // Сломанный/неверный триггер (time-driven и т.п.) приходит без e.range.
  // Fallback: активная ячейка — только если это колонка «Статус» на «Заказы».
  if (!range) {
    try {
      range = SpreadsheetApp.getActiveRange();
    } catch (errActive) {
      range = null;
    }
    if (!range) {
      Logger.log(
        'status push skip: no edit event/range and no active range ' +
          '(fix trigger: delete old → run installTrigger → must be ' +
          'From spreadsheet / On edit, NOT time-driven)'
      );
      return;
    }
    usedActiveFallback = true;
    Logger.log(
      'status push: no e.range — fallback to activeRange ' +
        range.getA1Notation() +
        ' sheet="' +
        range.getSheet().getName() +
        '" (if this fires often, recreate trigger via installTrigger)'
    );
  }

  var sheet = range.getSheet();
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
  if (range.getNumColumns() !== 1) {
    Logger.log(
      'status push skip: multi-column edit (cols=' +
        range.getNumColumns() +
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

  var col = range.getColumn(); // 1-based
  if (col !== statusCol + 1) {
    Logger.log(
      'status push skip: wrong col ' +
        col +
        ' (Статус is ' +
        (statusCol + 1) +
        ')' +
        (usedActiveFallback ? ' [activeRange fallback]' : '')
    );
    return;
  }

  var startRow = range.getRow();
  var numRows = range.getNumRows();
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  Logger.log(
    'status push: sheet=' +
      SHEET_NAME +
      ' rows=' +
      startRow +
      '..' +
      (startRow + numRows - 1) +
      (usedActiveFallback ? ' via=activeRange' : ' via=e.range')
  );

  for (var i = 0; i < numRows; i++) {
    var row = startRow + i;
    if (row < 2) {
      Logger.log('status push skip: header row');
      continue;
    }

    var newStatus = '';
    var oldStatus = '';
    // e.value только у настоящего onEdit на одну ячейку; fallback — из ячейки
    if (numRows === 1 && eventValue != null && !usedActiveFallback) {
      newStatus = str_(eventValue);
      oldStatus = str_(eventOldValue != null ? eventOldValue : '');
    } else {
      newStatus = str_(sheet.getRange(row, col).getDisplayValue());
      // oldValue для мульти-правки / fallback недоступен
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
  var range = a1Range_(sheet, row, 1, row, lastCol);
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
    var values = a1Range_(sheet, 2, 1, lastRow, lastCol).getValues();
    var display = a1Range_(sheet, 2, 1, lastRow, lastCol).getDisplayValues();
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
