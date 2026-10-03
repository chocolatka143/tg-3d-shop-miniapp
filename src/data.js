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
    category: 'accessories',
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
    category: 'figures',
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
    category: 'parts',
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
    category: 'decor',
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
    category: 'parts',
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
    category: 'filament',
  },
];

/** Вкладки главной: каталог + контент */
/** Сегменты колеса: weight — относительный шанс (сумма ≈ 100).
 *  promo: type order_percent | delivery_percent; value — процент; codePrefix — для генерации кода.
 */
export const LUCK_SEGMENTS = [
  { id: 'order-5', label: '−5%', result: 'Скидка 5% на заказ', weight: 25, color: '#ff8a1f', promo: { type: 'order_percent', value: 5, codePrefix: 'B5' } },
  { id: 'order-7', label: '−7%', result: 'Скидка 7% на заказ', weight: 10, color: '#ffca5c', promo: { type: 'order_percent', value: 7, codePrefix: 'B7' } },
  { id: 'delivery-5', label: 'Дст −5%', result: 'Скидка 5% на доставку', weight: 15, color: '#55c98a', promo: { type: 'delivery_percent', value: 5, codePrefix: 'D5' } },
  { id: 'delivery-7', label: 'Дст −7%', result: 'Скидка 7% на доставку', weight: 5, color: '#4db6ac', promo: { type: 'delivery_percent', value: 7, codePrefix: 'D7' } },
  { id: 'empty', label: 'Пусто', result: 'Повезёт в следующий раз', weight: 45, color: '#ef6b62' },
];

/**
 * Статичные промокоды (можно вводить вручную в чекауте).
 * type: order_percent | delivery_percent
 */
export const STATIC_PROMO_CODES = [
  { code: 'BUBER5', type: 'order_percent', value: 5, label: 'Скидка 5% на заказ' },
  { code: 'BUBER7', type: 'order_percent', value: 7, label: 'Скидка 7% на заказ' },
  { code: 'LATEST5', type: 'order_percent', value: 5, label: 'Тестовая скидка 5% на заказ' },
  { code: 'DOST5', type: 'delivery_percent', value: 5, label: 'Скидка 5% на доставку' },
  { code: 'DOST7', type: 'delivery_percent', value: 7, label: 'Скидка 7% на доставку' },
];

/** Срок жизни промокода с колеса (дней). */
export const PROMO_EXPIRY_DAYS = 30;

/**
 * Стоимость доставки в рублях. 0 = пока не считаем в чекауте
 * (скидка на доставку сохраняется в заказе и применится, когда появится fee).
 */
export const DELIVERY_FEE_RUB = 0;

export const HOME_TABS = [
  { id: 'all', label: 'Все' },
  { id: 'filament', label: 'Филамент' },
  { id: 'figures', label: 'Фигурки' },
  { id: 'faq', label: 'FAQ' },
  { id: 'portfolio', label: 'Портфолио' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'luck', label: '🎡 Удача' },
];

export const FAQ_ITEMS = [
  {
    q: 'Как заказать?',
    a: 'Выберите товар в каталоге или нажмите «Свой вариант», заполните параметры и оформите заказ в корзине. Мы свяжемся для подтверждения.',
  },
  {
    q: 'Как оплатить?',
    a: 'СБП — перевод по реквизитам после подтверждения заказа. Наличные — при встрече или самовывозе в Москве.',
  },
  {
    q: 'Свой STL / кастом',
    a: 'Через «Свой вариант»: материал, цвет, размер и файл .stl / .obj / .3mf. Оценим и уточним цену в чате.',
  },
  {
    q: 'Связаться с нами',
    a: 'Telegram: @bubershop3d — напишите по заказу, срокам или вопросам.',
  },
];

export const PORTFOLIO_ITEMS = [
  {
    image: '/portfolio/modular-wall-organizer.jpg',
    title: 'Модульный органайзер на стену',
    alt: 'Модульный настенный органайзер с держателями для наушников и игрового контроллера',
  },
];

export const REVIEW_STUBS = [
  {
    name: 'Алексей',
    text: 'Заказал брелок — качество супер, ответили быстро.',
    stars: 5,
  },
  {
    name: 'Мария',
    text: 'Печать по моему STL, всё совпало с размерами.',
    stars: 5,
  },
  {
    name: 'Игорь',
    text: 'Удобно оформить в Mini App, жду ещё работы в портфолио :)',
    stars: 4,
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
  orderWebhookUrl: 'https://script.google.com/macros/s/AKfycbzVEKwta7ZkLtA-IG8jx7nbTy9KET-61bDQwKt2FhHhm4PmXfsH7fJAlbqsk3-6gxFx/exec',
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
