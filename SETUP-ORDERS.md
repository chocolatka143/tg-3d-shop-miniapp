# Заказы в таблицу + Telegram

Кратко: клиент жмёт «Оформить» → Google Apps Script пишет строку в таблицу **«Заказы»** и шлёт вам уведомление в Telegram.

Подробная инструкция (таблица, свойства скрипта, деплой, curl, chat id):

→ **[orders-apps-script/README.md](orders-apps-script/README.md)**

Код приёмника: `orders-apps-script/Code.gs`.

В Mini App в `src/data.js` задаётся только `SHOP.orderWebhookUrl`. Секрет в клиент не кладётся: заказ уходит с `initData` Telegram, Apps Script проверяет подпись. Пока URL пустой — магазин работает в режиме «скопировать заказ + написать в Telegram». `WEBHOOK_SECRET` и токен бота — только в свойствах скрипта Google.

Личный кабинет (статусы, колонки `order_id` / `telegram_user_id`, GET списка): **[LK-ORDERS.md](LK-ORDERS.md)**.

Пуш клиенту при смене статуса: см. **[orders-apps-script/README.md](orders-apps-script/README.md)** §8 и `installTrigger()` в `Code.gs`.
