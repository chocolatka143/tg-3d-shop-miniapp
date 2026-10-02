/** Демо-каталог: заменить на реальные товары позже */
export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Кастомный брелок',
    price: 350,
    short: 'Небольшой брелок по вашему STL или эскизу',
    desc: 'Печать брелка до 5 см. PLA/PETG, выбор цвета. Идеально для подарков и мерча.',
    color: '#e74c3c',
    emoji: '🔑',
    material: 'PLA',
  },
  {
    id: 'p2',
    name: 'Фигурка 10 см',
    price: 1200,
    short: 'Детализированная фигурка высотой до 10 см',
    desc: 'Печать фигурки с поддержками. Материал PLA или PETG. Возможна покраска отдельно.',
    color: '#3498db',
    emoji: '🧍',
    material: 'PLA',
  },
  {
    id: 'p3',
    name: 'Корпус для электроники',
    price: 890,
    short: 'Корпус / бокс под плату или датчик',
    desc: 'Прочный PETG-корпус. Укажите размеры отверстий в комментарии или приложите STL.',
    color: '#2ecc71',
    emoji: '📦',
    material: 'PETG',
  },
  {
    id: 'p4',
    name: 'Ваза / кашпо',
    price: 1500,
    short: 'Декоративная ваза или кашпо',
    desc: 'Ваза высотой до 20 см. PLA матовый или глянец. Водонепроницаемость — по запросу.',
    color: '#9b59b6',
    emoji: '🪴',
    material: 'PLA',
  },
  {
    id: 'p5',
    name: 'Прототип детали',
    price: 2000,
    short: 'Инженерный прототип по чертежу / STL',
    desc: 'Точная печать прототипа. PETG или ABS. Обсудим допуски после заказа.',
    color: '#f39c12',
    emoji: '⚙️',
    material: 'PETG',
  },
  {
    id: 'p-filament',
    name: 'Филамент',
    price: 1800,
    short: 'Катушка PLA или PETG, цвет на выбор',
    desc: 'Катушка филамента PLA или PETG для 3D-печати. Выберите материал и цвет при заказе.',
    color: '#ff8a1f',
    emoji: '🧵',
    material: 'PLA',
  },
];

export const MATERIALS = ['PLA', 'PETG', 'ABS', 'TPU', 'Другой'];
export const COLORS = [
  { id: 'white', name: 'Белый', hex: '#f5f5f5' },
  { id: 'black', name: 'Чёрный', hex: '#222' },
  { id: 'red', name: 'Красный', hex: '#e74c3c' },
  { id: 'blue', name: 'Синий', hex: '#3498db' },
  { id: 'green', name: 'Зелёный', hex: '#2ecc71' },
  { id: 'yellow', name: 'Жёлтый', hex: '#f1c40f' },
  { id: 'orange', name: 'Оранжевый', hex: '#e67e22' },
  { id: 'purple', name: 'Фиолетовый', hex: '#9b59b6' },
  { id: 'custom', name: 'Другой', hex: 'linear-gradient(135deg,#e74c3c,#3498db,#2ecc71)' },
];

export const SIZES = ['S (до 5 см)', 'M (5–15 см)', 'L (15–25 см)', 'XL (25+ см)', 'Свой размер'];

/** Контакты и оплата (без платёжки). telegramUsername без @, пусто = только копирование заказа */
export const SHOP = {
  name: 'Бубер 3D',
  city: 'Москва',
  telegramUsername: 'bubershop3d',
  sbpHint: 'Реквизиты СБП пришлём в чат после подтверждения заказа',
  /** URL веб-приложения Apps Script (.../exec). Пусто = без таблицы, только копирование + Telegram */
  orderWebhookUrl: '',
  /** Тот же WEBHOOK_SECRET, что в свойствах скрипта. Не коммитьте реальный секрет */
  orderWebhookSecret: '',
};

export const PAYMENT_METHODS = [
  {
    id: 'sbp',
    label: 'СБП',
    hint: 'Перевод по реквизитам после подтверждения заказа',
  },
  {
    id: 'cash',
    label: 'Наличные',
    hint: 'Оплата при встрече или самовывозе',
  },
];
