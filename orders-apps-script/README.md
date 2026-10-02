# Приём заказов: Google Таблица + Telegram

Маленький скрипт Google Apps Script принимает JSON от Mini App, пишет строку на лист **«Заказы»** и шлёт вам сообщение в Telegram.  
Для ЛК: **GET** с `userId` возвращает заказы этого Telegram-пользователя.

Секреты (`BOT_TOKEN`, `CHAT_ID`, `WEBHOOK_SECRET`) хранятся только в свойствах скрипта Google — **не коммитьте их в git**.

Схема статусов и колонок: **[../LK-ORDERS.md](../LK-ORDERS.md)**.

## 1. Таблица

1. Откройте [Google Таблицы](https://sheets.google.com) и создайте **пустую** таблицу (например «Бубер 3D — Заказы»).
2. Можно сразу переименовать первый лист в `Заказы` — скрипт сам создаст лист и заголовки, если их нет:
   - Дата · **order_id** · **telegram_user_id** · Имя · Телефон · Username · Оплата · Комментарий · Состав · Сумма · Статус

Если лист уже был со старыми колонками — добавьте `order_id` и `telegram_user_id` после «Дата» или начните с пустого листа (см. LK-ORDERS.md).

## 2. Apps Script

1. В таблице: **Расширения → Apps Script**.
2. Удалите код по умолчанию и вставьте содержимое файла `Code.gs` из этой папки.
3. Сохраните проект (Ctrl/Cmd+S), имя любое — например `buber3d-orders`.

## 3. Свойства скрипта

**Проект → Настройки проекта** (шестерёнка) → блок **Свойства скрипта** → **Добавить свойство**:

| Свойство         | Значение |
|------------------|----------|
| `BOT_TOKEN`      | токен от [@BotFather](https://t.me/BotFather) (`/token` у вашего бота магазина) |
| `CHAT_ID`        | числовой id чата, куда слать уведомления |
| `WEBHOOK_SECRET` | длинная случайная строка (пароль вебхука), латиница/цифры |

Сохраните свойства.

### Как узнать CHAT_ID

1. Напишите боту магазина **`/start`** с того аккаунта, куда нужны уведомления (например с аккаунта владельца).
2. Вариант А: откройте в браузере  
   `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`  
   и найдите `"chat":{"id": ...}` — это и есть `CHAT_ID`.
3. Вариант Б: напишите [@userinfobot](https://t.me/userinfobot) — он покажет ваш id.

## 4. Развёртывание (Web App)

1. В редакторе Apps Script: **Развернуть → Новое развёртывание**.
2. Тип: **Веб-приложение**.
3. Описание: например `orders-v1`.
4. **Выполнять от имени:** Меня.
5. **У кого есть доступ:** Все (Anyone).  
   Секрет всё равно проверяется через `?key=` / заголовок — без `WEBHOOK_SECRET` запросы отклоняются.
6. Нажмите **Развернуть**, подтвердите права доступа к таблице и внешним запросам (Telegram).
7. Скопируйте **URL веб-приложения** — вида  
   `https://script.google.com/macros/s/XXXX/exec`

При правках кода: **Развернуть → Управление развёртываниями → ✏️ → Новая версия → Развернуть**.

## 5. Подключить Mini App

В репозитории `src/data.js` в объекте `SHOP`:

```js
orderWebhookUrl: 'https://script.google.com/macros/s/XXXX/exec',
orderWebhookSecret: 'тот_же_WEBHOOK_SECRET',
```

Пока оба поля пустые — магазин работает как раньше (копирование заказа + ссылка в Telegram).  
**Не коммитьте реальный секрет в публичный репозиторий**, если репо открытое: подставьте значения только на машине деплоя / в приватной копии `data.js`.

После подстановки — соберите и выложите Mini App как обычно.

## 6. Проверка curl

### POST — новый заказ

```bash
curl -sS -X POST \
  'https://script.google.com/macros/s/XXXX/exec?key=ВАШ_СЕКРЕТ' \
  -H 'Content-Type: text/plain;charset=utf-8' \
  -d '{
    "order_id": "ord_test_001",
    "telegram_user_id": 123456789,
    "name": "Тест",
    "phone": "+79990001122",
    "username": "testuser",
    "payment": "sbp",
    "comment": "Проверка вебхука",
    "items": [
      {"name": "Кастомный брелок", "qty": 1, "price": 350, "material": "PLA"}
    ],
    "total": 350,
    "createdAt": "2026-10-02T12:00:00.000Z"
  }'
```

Ожидается JSON вроде `{"ok":true,"telegram":true,"order_id":"ord_test_001"}`.  
В таблице появится строка со статусом **Новый**, в Telegram — сообщение о заказе.

### GET — health / список для ЛК

```bash
# Жив ли приёмник
curl -sS 'https://script.google.com/macros/s/XXXX/exec?key=ВАШ_СЕКРЕТ'

# Заказы пользователя (telegram_user_id)
curl -sS 'https://script.google.com/macros/s/XXXX/exec?key=ВАШ_СЕКРЕТ&userId=123456789'
```

Ответ списка: `{ "ok": true, "orders": [ { "order_id", "date", "status", … } ] }`.

## 7. Формат JSON от Mini App (POST)

| Поле | Тип | Описание |
|------|-----|----------|
| `order_id` | string | Уникальный id заказа (генерит Mini App) |
| `telegram_user_id` | number \| string | `initDataUnsafe.user.id` |
| `name` | string | Имя |
| `phone` | string | Телефон |
| `username` | string | Telegram без обязательного `@` |
| `payment` | `sbp` \| `cash` | Способ оплаты |
| `comment` | string | Комментарий к заказу |
| `items` | array \| string | Позиции или готовый текст |
| `total` | number | Сумма (₽) |
| `createdAt` | string ISO | Время создания |

Авторизация: query `?key=WEBHOOK_SECRET` (предпочтительно для браузера) или заголовок `X-Webhook-Secret`.

> **CORS:** браузерный `POST` с `Content-Type: application/json` часто упирается в preflight. Mini App шлёт тело как **`text/plain`** с JSON-строкой — так запрос «простой» и доходит до Apps Script без OPTIONS. В `Code.gs` есть `doOptions` на всякий случай.

> **Безопасность ЛК:** MVP передаёт `userId` с клиента. Перед публичным ЛК нужна проверка подписи Telegram `initData` (см. LK-ORDERS.md).

## Если что-то не так

- `{"ok":false,"error":"unauthorized"}` — неверный или пустой `WEBHOOK_SECRET` / `key`.
- `missing_column_telegram_user_id` — на листе нет колонки; обновите заголовки.
- Строка есть, Telegram молчит — проверьте `BOT_TOKEN`, `CHAT_ID` и что вы написали боту `/start`.
- «Нужны права» при деплое — заново подтвердите доступ к таблице и `https://api.telegram.org`.
