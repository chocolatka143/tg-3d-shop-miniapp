# Заказы в таблицу + Telegram

Кратко: клиент жмёт «Оформить» → Google Apps Script пишет строку в таблицу **«Заказы»** и шлёт вам уведомление в Telegram.

Подробная инструкция (таблица, свойства скрипта, деплой, curl, chat id):

→ **[orders-apps-script/README.md](orders-apps-script/README.md)**

Код приёмника: `orders-apps-script/Code.gs`.

В Mini App URL и секрет задаются в `src/data.js` (`SHOP.orderWebhookUrl`, `SHOP.orderWebhookSecret`). Пока пусто — магазин работает в режиме «скопировать заказ + написать в Telegram». Реальные секреты в git не коммитить.
