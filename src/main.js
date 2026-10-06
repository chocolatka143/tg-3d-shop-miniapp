import './style.css';
import { PRODUCTS, MATERIALS, COLORS, SIZES, SHOP, PAYMENT_METHODS, HOME_TABS, FAQ_ITEMS, PORTFOLIO_ITEMS, REVIEW_STUBS, LUCK_SEGMENTS, STATIC_PROMO_CODES, PROMO_EXPIRY_DAYS, DELIVERY_FEE_RUB } from './data.js';
import {
  initTelegram,
  getTelegram,
  showMainButton,
  hideMainButton,
  showBackButton,
  hideBackButton,
  haptic,
  getUser,
  getInitData,
  applyTelegramChrome,
} from './telegram.js';

const STORAGE_KEY = 'tg3d_cart_v1';
const THEME_KEY = 'buber-theme';
const ORDERS_KEY = 'tg3d_orders_v1';
const PROMO_KEY = 'tg3d_promo_v1';
const PROMO_USED_KEY = 'tg3d_promo_used_v1';
const LUCK_SPIN_DATE_KEY = 'tg3d_luck_spin_date_v1';
const LUCK_DEVICE_KEY = 'tg3d_luck_device_v1';
const REUSABLE_PROMO_CODES = new Set(['LATEST5']);
const LUCK_SPIN_DURATION_MS = 3400;

/** @typedef {{ type: 'product'|'custom', id: string, name: string, price: number, qty: number, emoji?: string, image?: string, color?: string, material?: string, size?: string, stlName?: string, comment?: string, productColor?: string }} CartItem */

const state = {
  screen: 'home', // home | product | custom | cart | success | orders
  productId: null,
  homeTab: 'all', // all | filament | figures | faq | portfolio | reviews
  // Previous logical routes for the in-app and Telegram back buttons.
  history: [],
  cart: loadCart(),
  lastOrder: null,
  orders: {
    loading: false,
    loaded: false,
    remote: null,
    error: '',
    source: '', // remote | local | ''
  },
  luck: {
    spinning: false,
    hasSpun: false,
    result: null,
    promo: null,
    rotation: 0,
  },
  checkout: {
    name: '',
    phone: '',
    telegram: '',
    payment: 'sbp',
    comment: '',
    promoInput: '',
    /** @type {null | { code: string, type: string, value: number, label: string, source?: string, expiresAt?: string }} */
    promoApplied: null,
    promoError: '',
    error: '',
    submitting: false,
  },
  custom: {
    material: MATERIALS[0],
    colorId: COLORS[0].id,
    size: SIZES[1],
    qty: 1,
    stlName: '',
    comment: '',
  },
};

const app = document.getElementById('app');

function getTheme() {
  const t = document.documentElement.getAttribute('data-theme');
  return t === 'dark' ? 'dark' : 'light';
}

function setTheme(theme) {
  const t = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch (_) {
    /* ignore */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'dark' ? '#0a0a0a' : '#f7f5f2');
  applyTelegramChrome(t);
}

function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  haptic('light');
}

// Гарантируем data-theme + chrome до первого render
setTheme(getTheme());
const tg = initTelegram(getTheme());

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

function cartCount() {
  return state.cart.reduce((s, i) => s + i.qty, 0);
}

function cartTotal() {
  return state.cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function formatRub(n) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(n);
}

function normalizePromoCode(code) {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

function isReusablePromoCode(code) {
  return REUSABLE_PROMO_CODES.has(normalizePromoCode(code));
}

function loadUsedPromoCodes() {
  try {
    const list = JSON.parse(localStorage.getItem(PROMO_USED_KEY) || '[]');
    return Array.isArray(list) ? list.map(normalizePromoCode).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function markPromoUsed(code) {
  const c = normalizePromoCode(code);
  if (!c || isReusablePromoCode(c)) return;
  const used = loadUsedPromoCodes();
  if (!used.includes(c)) {
    used.push(c);
    try {
      localStorage.setItem(PROMO_USED_KEY, JSON.stringify(used.slice(-80)));
    } catch (_) {
      /* ignore */
    }
  }
  const saved = loadSavedPromo();
  if (saved && normalizePromoCode(saved.code) === c) {
    clearSavedPromo();
  }
}

function loadSavedPromo() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROMO_KEY) || 'null');
    if (!raw || typeof raw !== 'object' || !raw.code) return null;
    return raw;
  } catch {
    return null;
  }
}

function savePromo(promo) {
  try {
    localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
  } catch (_) {
    /* ignore */
  }
}

function clearSavedPromo() {
  try {
    localStorage.removeItem(PROMO_KEY);
  } catch (_) {
    /* ignore */
  }
}

function makeWheelPromoCode(prefix) {
  const p = String(prefix || 'BX').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'BX';
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${p}-${tail}`;
}

function promoExpiryIso(days = PROMO_EXPIRY_DAYS) {
  const d = new Date();
  d.setDate(d.getDate() + Math.max(1, Number(days) || 30));
  return d.toISOString();
}

function isPromoExpired(promo) {
  if (!promo || !promo.expiresAt) return false;
  const t = Date.parse(promo.expiresAt);
  return Number.isFinite(t) && t < Date.now();
}

function promoTypeLabel(type, value) {
  if (type === 'order_percent') return `Скидка ${value}% на заказ`;
  if (type === 'delivery_percent') return `Скидка ${value}% на доставку`;
  return 'Промокод';
}

/** Каталог известных промо: статичные + сохранённый с колеса. */
function knownPromoCatalog() {
  const list = STATIC_PROMO_CODES.map((p) => ({
    code: normalizePromoCode(p.code),
    type: p.type,
    value: Number(p.value) || 0,
    label: p.label || promoTypeLabel(p.type, p.value),
    source: 'static',
    expiresAt: null,
  }));
  const saved = loadSavedPromo();
  if (saved && saved.code) {
    list.push({
      code: normalizePromoCode(saved.code),
      type: saved.type,
      value: Number(saved.value) || 0,
      label: saved.label || promoTypeLabel(saved.type, saved.value),
      source: saved.source || 'wheel',
      expiresAt: saved.expiresAt || null,
    });
  }
  return list;
}

/**
 * @returns {{ ok: true, promo: object } | { ok: false, error: string }}
 */
function resolvePromoCode(rawCode) {
  const code = normalizePromoCode(rawCode);
  if (!code) return { ok: false, error: 'Введите промокод' };

  const used = loadUsedPromoCodes();
  if (!isReusablePromoCode(code) && used.includes(code)) {
    return { ok: false, error: 'Этот промокод уже использован на этом устройстве' };
  }

  const found = knownPromoCatalog().find((p) => p.code === code);
  if (!found) return { ok: false, error: 'Промокод не найден' };
  if (isPromoExpired(found)) return { ok: false, error: 'Срок действия промокода истёк' };
  if (!found.value || found.value <= 0) return { ok: false, error: 'Промокод недействителен' };

  return {
    ok: true,
    promo: {
      code: found.code,
      type: found.type,
      value: found.value,
      label: found.label,
      source: found.source,
      expiresAt: found.expiresAt,
    },
  };
}

function deliveryFeeRub() {
  const n = Number(DELIVERY_FEE_RUB);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

/**
 * Итоги заказа с учётом промо.
 * @returns {{ subtotal: number, deliveryFee: number, orderDiscount: number, deliveryDiscount: number, discountTotal: number, total: number, promo: object|null, deliveryNote: string }}
 */
function getOrderPricing(promo = state.checkout.promoApplied) {
  const subtotal = cartTotal();
  const deliveryFee = deliveryFeeRub();
  let orderDiscount = 0;
  let deliveryDiscount = 0;
  let deliveryNote = '';

  if (promo && promo.type === 'order_percent') {
    orderDiscount = Math.round((subtotal * Number(promo.value)) / 100);
    orderDiscount = Math.min(orderDiscount, subtotal);
  } else if (promo && promo.type === 'delivery_percent') {
    if (deliveryFee > 0) {
      deliveryDiscount = Math.round((deliveryFee * Number(promo.value)) / 100);
      deliveryDiscount = Math.min(deliveryDiscount, deliveryFee);
    } else {
      deliveryNote =
        `Скидка ${promo.value}% на доставку сохранена. Сейчас доставка в сумме не учтена — применим при подтверждении заказа.`;
    }
  }

  const discountTotal = orderDiscount + deliveryDiscount;
  const total = Math.max(0, subtotal + deliveryFee - discountTotal);
  return {
    subtotal,
    deliveryFee,
    orderDiscount,
    deliveryDiscount,
    discountTotal,
    total,
    promo: promo || null,
    deliveryNote,
  };
}

function createPromoFromSegment(segment) {
  if (!segment || !segment.promo) return null;
  const { type, value, codePrefix } = segment.promo;
  const code = makeWheelPromoCode(codePrefix);
  return {
    code,
    type,
    value: Number(value) || 0,
    label: segment.result || promoTypeLabel(type, value),
    source: 'wheel',
    segmentId: segment.id,
    createdAt: new Date().toISOString(),
    expiresAt: promoExpiryIso(PROMO_EXPIRY_DAYS),
  };
}

function applyPromoFromInput() {
  syncCheckoutFromDom();
  const result = resolvePromoCode(state.checkout.promoInput);
  if (!result.ok) {
    state.checkout.promoApplied = null;
    state.checkout.promoError = result.error;
    return false;
  }
  state.checkout.promoApplied = result.promo;
  state.checkout.promoInput = result.promo.code;
  state.checkout.promoError = '';
  return true;
}

function clearAppliedPromo() {
  state.checkout.promoApplied = null;
  state.checkout.promoError = '';
  state.checkout.promoInput = '';
}

/** Prefill checkout promo from wheel win (if unused). */
function hydratePromoFromStorage() {
  if (state.checkout.promoApplied) return;
  const saved = loadSavedPromo();
  if (!saved) return;
  const resolved = resolvePromoCode(saved.code);
  if (!resolved.ok) return;
  state.checkout.promoApplied = resolved.promo;
  state.checkout.promoInput = resolved.promo.code;
}

function navigate(screen, opts = {}) {
  const currentRoute = { screen: state.screen, productId: state.productId };

  if (opts.resetHistory || screen === 'home') {
    state.history = [];
  } else if (screen !== state.screen) {
    state.history.push(currentRoute);
  }

  state.screen = screen;
  if (screen === 'home') state.productId = null;
  if (opts.productId !== undefined) state.productId = opts.productId;
  haptic('light');
  render();
}

function goBack() {
  const previous = state.history.pop();
  if (previous) {
    state.screen = previous.screen;
    state.productId = previous.productId ?? null;
  } else {
    // The home screen is the safe fallback for a freshly opened deep link.
    state.screen = 'home';
    state.productId = null;
  }
  haptic('light');
  render();
}

function uid() {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function addProductToCart(product, qty = 1) {
  const existing = state.cart.find(
    (i) => i.type === 'product' && i.productId === product.id
  );
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({
      type: 'product',
      id: uid(),
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
      emoji: product.emoji,
      image: product.image,
      productColor: product.color,
      material: product.material,
    });
  }
  saveCart();
  haptic('medium');
}

function addCustomToCart() {
  const c = state.custom;
  const color = COLORS.find((x) => x.id === c.colorId) || COLORS[0];
  const estimated = estimateCustomPrice(c);
  state.cart.push({
    type: 'custom',
    id: uid(),
    name: 'Свой вариант',
    price: estimated,
    qty: c.qty,
    emoji: '✨',
    productColor: typeof color.hex === 'string' && color.hex.startsWith('#') ? color.hex : '#6c9eff',
    material: c.material,
    color: color.name,
    size: c.size,
    stlName: c.stlName || '',
    comment: c.comment || '',
  });
  saveCart();
  haptic('medium');
  // reset form lightly
  state.custom = {
    material: MATERIALS[0],
    colorId: COLORS[0].id,
    size: SIZES[1],
    qty: 1,
    stlName: '',
    comment: '',
  };
}

function estimateCustomPrice(c) {
  // Заглушка: простая оценка для демо
  const sizeBase = {
    [SIZES[0]]: 400,
    [SIZES[1]]: 900,
    [SIZES[2]]: 1800,
    [SIZES[3]]: 3500,
    [SIZES[4]]: 1500,
  };
  const matMul = { PLA: 1, PETG: 1.15, ABS: 1.25, TPU: 1.4, Другой: 1.2 };
  const base = sizeBase[c.size] ?? 900;
  return Math.round(base * (matMul[c.material] || 1));
}

function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  saveCart();
  haptic('light');
  render();
}

function prefillCheckoutFromTg() {
  const user = getUser();
  if (!user) return;
  if (!state.checkout.telegram && user.username) {
    state.checkout.telegram = '@' + user.username;
  }
  if (!state.checkout.name && user.first_name) {
    const parts = [user.first_name, user.last_name].filter(Boolean);
    state.checkout.name = parts.join(' ');
  }
}

function syncCheckoutFromDom() {
  const name = document.getElementById('co-name');
  const phone = document.getElementById('co-phone');
  const telegram = document.getElementById('co-telegram');
  const comment = document.getElementById('co-comment');
  const promo = document.getElementById('co-promo');
  const pay = document.querySelector('input[name="co-payment"]:checked');
  if (name) state.checkout.name = name.value.trim();
  if (phone) state.checkout.phone = phone.value.trim();
  if (telegram) state.checkout.telegram = telegram.value.trim();
  if (comment) state.checkout.comment = comment.value.trim();
  if (promo) state.checkout.promoInput = promo.value.trim();
  if (pay) state.checkout.payment = pay.value;
}

function validateCheckout() {
  syncCheckoutFromDom();
  const name = state.checkout.name.trim();
  const phone = state.checkout.phone.trim();
  const tgContact = state.checkout.telegram.replace(/^@/, '').trim();
  if (!name || !phone || !tgContact) {
    state.checkout.error = 'Укажите имя, телефон и @username Telegram';
    return false;
  }
  state.checkout.error = '';
  return true;
}

function paymentLabel(id) {
  return PAYMENT_METHODS.find((p) => p.id === id)?.label || id;
}

function formatOrderText(order) {
  const lines = [];
  lines.push(`Заказ «${SHOP.name}»`);
  lines.push(`Дата: ${new Date(order.createdAt).toLocaleString('ru-RU')}`);
  lines.push(`Город: ${SHOP.city}`);
  lines.push('');
  lines.push('Товары:');
  order.items.forEach((i, idx) => {
    const bits = [];
    if (i.material) bits.push(i.material);
    if (i.color) bits.push(i.color);
    if (i.size) bits.push(i.size);
    if (i.stlName) bits.push(`файл: ${i.stlName}`);
    const meta = bits.length ? ` (${bits.join(', ')})` : '';
    const itemComment = i.comment ? ` — ${i.comment}` : '';
    lines.push(`${idx + 1}. ${i.name} × ${i.qty} — ${formatRub(i.price * i.qty)}${meta}${itemComment}`);
  });
  lines.push('');
  if (order.subtotalRub != null && order.subtotalRub !== order.totalRub) {
    lines.push(`Сумма товаров: ${formatRub(order.subtotalRub)}`);
  }
  if (order.deliveryFeeRub) {
    lines.push(`Доставка: ${formatRub(order.deliveryFeeRub)}`);
  }
  if (order.promoCode) {
    lines.push(`Промокод: ${order.promoCode}${order.promoLabel ? ` (${order.promoLabel})` : ''}`);
  }
  if (order.discountRub) {
    lines.push(`Скидка: −${formatRub(order.discountRub)}`);
  }
  if (order.deliveryDiscountPending) {
    lines.push(`Скидка на доставку: ${order.deliveryDiscountPending} (применим при расчёте доставки)`);
  }
  lines.push(`Итого: ${formatRub(order.totalRub)}`);
  lines.push(`Оплата: ${paymentLabel(order.checkout.payment)}`);
  if (order.checkout.name) lines.push(`Имя: ${order.checkout.name}`);
  if (order.checkout.phone) lines.push(`Телефон: ${order.checkout.phone}`);
  if (order.checkout.telegram) lines.push(`Telegram: ${order.checkout.telegram}`);
  if (order.checkout.comment) lines.push(`Комментарий: ${order.checkout.comment}`);
  lines.push('');
  if (order.checkout.payment === 'sbp') {
    lines.push(SHOP.sbpHint);
  } else {
    lines.push('Оплата наличными при встрече / самовывозе.');
  }
  return lines.join('\n');
}

function shopTelegramUrl(orderText) {
  const u = (SHOP.telegramUsername || '').replace(/^@/, '').trim();
  if (!u) return null;
  const base = `https://t.me/${u}`;
  if (!orderText) return base;
  return `${base}?text=${encodeURIComponent(orderText)}`;
}

function saveOrderLocal(order) {
  try {
    const prev = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    prev.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(prev.slice(0, 30)));
  } catch (_) {
    /* ignore */
  }
}

function loadLocalOrders() {
  try {
    const list = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** Локальный временный id (только в UI/localStorage). В Sheet не уходит. */
function makeOrderId() {
  return `pending_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function isTempOrderId(id) {
  return /^pending_/i.test(String(id || ''));
}

const STATUS_LABELS = {
  new: 'Новый',
  work: 'В работе',
  ready: 'Готов к выдаче',
  done: 'Выдан',
  cancelled: 'Отменён',
};

// Таблица может содержать старые названия статусов. Сначала приводим их к
// одному ключу, а уже затем строим CSS-класс — иначе любой новый вариант
// незаметно попадал в один и тот же цвет.
const STATUS_ALIASES = {
  '': 'new',
  новый: 'new',
  new: 'new',
  'в работе': 'work',
  работа: 'work',
  work: 'work',
  working: 'work',
  подтвержден: 'work',
  подтверждён: 'work',
  'в печати': 'work',
  готов: 'ready',
  ready: 'ready',
  'готов к выдаче': 'ready',
  выдан: 'done',
  done: 'done',
  отменен: 'cancelled',
  отменён: 'cancelled',
  cancelled: 'cancelled',
};

function normalizeStatus(status) {
  const value = String(status ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('ru-RU');
  return STATUS_ALIASES[value] || 'new';
}

function statusLabel(status) {
  return STATUS_LABELS[normalizeStatus(status)];
}

function statusBadge(status) {
  const normalized = normalizeStatus(status);
  return `<span class="order-status status-${normalized}">${escapeHtml(STATUS_LABELS[normalized])}</span>`;
}

function normalizeRemoteOrder(o) {
  const itemsRaw = o.items;
  let items = [];
  let itemsHint = '';
  if (Array.isArray(itemsRaw)) {
    items = itemsRaw;
    itemsHint = items
      .slice(0, 2)
      .map((i) => (typeof i === 'string' ? i : i.name))
      .filter(Boolean)
      .join(', ');
    if (items.length > 2) itemsHint += '…';
  } else if (typeof itemsRaw === 'string' && itemsRaw.trim()) {
    itemsHint = itemsRaw.trim().split('\n')[0];
    if (itemsRaw.includes('\n')) itemsHint += '…';
  }
  return {
    id: o.order_id || o.id || '—',
    status: statusLabel(o.status),
    createdAt: o.createdAt || null,
    date: o.date || '',
    totalRub: o.total != null ? o.total : o.totalRub,
    items,
    itemsHint: itemsHint || '—',
    payment: o.payment || '',
    comment: o.comment || '',
    source: 'remote',
  };
}

function normalizeLocalOrder(o) {
  const itemsCount = Array.isArray(o.items) ? o.items.length : 0;
  const itemsHint = itemsCount
    ? o.items
        .slice(0, 2)
        .map((i) => i.name)
        .filter(Boolean)
        .join(', ') + (itemsCount > 2 ? '…' : '')
    : '—';
  return {
    id: o.id || '—',
    status: statusLabel(o.status),
    createdAt: o.createdAt || null,
    date: '',
    totalRub: o.totalRub != null ? o.totalRub : o.total,
    items: Array.isArray(o.items) ? o.items : [],
    itemsHint,
    payment: o.checkout?.payment || o.payment || '',
    comment: o.checkout?.comment || o.comment || '',
    source: 'local',
  };
}

async function fetchOrdersList() {
  const base = (SHOP.orderWebhookUrl || '').trim();
  if (!base) return { ok: false, skipped: true, error: 'no_webhook' };

  const initData = getInitData();
  if (!initData) return { ok: false, skipped: true, error: 'no_init_data' };

  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'list',
      initData,
    }),
  });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    /* ignore */
  }
  if (!res.ok || !data || data.ok !== true) {
    const msg = (data && data.error) || `http_${res.status}`;
    throw new Error(msg);
  }
  const orders = Array.isArray(data.orders) ? data.orders.map(normalizeRemoteOrder) : [];
  return { ok: true, orders };
}

async function loadRemoteOrders(force = false) {
  if (state.orders.loading) return;
  if (state.orders.loaded && !force) return;

  const hasWebhook = !!(SHOP.orderWebhookUrl || '').trim();
  if (!hasWebhook) {
    state.orders.loading = false;
    state.orders.loaded = true;
    state.orders.remote = null;
    state.orders.error = '';
    state.orders.source = 'local';
    if (state.screen === 'orders') render();
    return;
  }

  state.orders.loading = true;
  state.orders.error = '';
  if (state.screen === 'orders') render();

  try {
    const result = await fetchOrdersList();
    if (result.skipped) {
      state.orders.remote = null;
      state.orders.source = 'local';
      state.orders.error = '';
    } else {
      state.orders.remote = result.orders;
      state.orders.source = 'remote';
      state.orders.error = '';
    }
  } catch (err) {
    console.warn('Orders list failed, fallback to localStorage', err);
    state.orders.remote = null;
    state.orders.source = 'local';
    state.orders.error = String(err && err.message ? err.message : err);
  } finally {
    state.orders.loading = false;
    state.orders.loaded = true;
    if (state.screen === 'orders') render();
  }
}

function pickLuckSegment() {
  const totalWeight = LUCK_SEGMENTS.reduce((sum, segment) => sum + Math.max(0, segment.weight || 0), 0);
  let cursor = Math.random() * totalWeight;
  return LUCK_SEGMENTS.find((segment) => {
    cursor -= Math.max(0, segment.weight || 0);
    return cursor < 0;
  }) || LUCK_SEGMENTS[LUCK_SEGMENTS.length - 1];
}

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function localDeviceKey() {
  try {
    const existing = localStorage.getItem(LUCK_DEVICE_KEY);
    if (existing) return existing;

    const generated = globalThis.crypto?.randomUUID?.()
      || `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(LUCK_DEVICE_KEY, generated);
    return generated;
  } catch (_) {
    // Если localStorage недоступен, блокировка всё равно действует в текущем сеансе.
    return 'session-device';
  }
}

function luckIdentity() {
  const user = getUser();
  return user?.id != null ? `telegram-${String(user.id)}` : `device-${localDeviceKey()}`;
}

function moscowCalendarDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function luckSpinStorageKey() {
  return `${LUCK_SPIN_DATE_KEY}:${luckIdentity()}`;
}

function readLuckSpinDate() {
  try {
    return { available: true, date: localStorage.getItem(luckSpinStorageKey()) };
  } catch (_) {
    return { available: false, date: null };
  }
}

function hasSpunLuckToday() {
  return readLuckSpinDate().date === moscowCalendarDate();
}

function refreshLuckAvailability() {
  const stored = readLuckSpinDate();
  if (state.luck.hasSpun && !state.luck.spinning && stored.available && stored.date !== moscowCalendarDate()) {
    state.luck.hasSpun = false;
    state.luck.result = null;
    state.luck.promo = null;
  }
}

function markLuckSpunToday() {
  try {
    localStorage.setItem(luckSpinStorageKey(), moscowCalendarDate());
  } catch (_) {
    /* ignore — state still blocks another spin in this session */
  }
}

function spinLuckWheel() {
  if (state.luck.spinning || state.luck.hasSpun || !LUCK_SEGMENTS.length) return;

  // Re-read storage in case another Mini App tab/session used today's attempt.
  if (hasSpunLuckToday()) {
    state.luck.hasSpun = true;
    render();
    return;
  }

  const selected = pickLuckSegment();
  const selectedIndex = LUCK_SEGMENTS.findIndex((segment) => segment.id === selected.id);
  const slice = 360 / LUCK_SEGMENTS.length;
  const selectedCenter = selectedIndex * slice;
  const extraOffset = mod(-selectedCenter - state.luck.rotation, 360);
  const turns = 5 + Math.floor(Math.random() * 2);

  state.luck.spinning = true;
  state.luck.hasSpun = true;
  markLuckSpunToday();
  state.luck.result = null;
  state.luck.rotation += turns * 360 + extraOffset;
  haptic('medium');
  render();

  window.setTimeout(() => {
    state.luck.spinning = false;
    state.luck.result = selected;
    const promo = createPromoFromSegment(selected);
    if (promo) {
      savePromo(promo);
      state.luck.promo = promo;
      // Автоподстановка в чекаут, если ещё нет другого применённого кода
      if (!state.checkout.promoApplied) {
        state.checkout.promoApplied = {
          code: promo.code,
          type: promo.type,
          value: promo.value,
          label: promo.label,
          source: promo.source,
          expiresAt: promo.expiresAt,
        };
        state.checkout.promoInput = promo.code;
        state.checkout.promoError = '';
      }
    } else {
      state.luck.promo = null;
    }
    haptic('medium');
    if (state.screen === 'home' && state.homeTab === 'luck') render();
  }, LUCK_SPIN_DURATION_MS);
}

function luckWheelStyle() {
  const slice = 360 / LUCK_SEGMENTS.length;
  const stops = LUCK_SEGMENTS
    .map((segment, index) => {
      const start = index * slice;
      const end = (index + 1) * slice;
      return `${segment.color} ${start}deg ${end}deg`;
    })
    .join(', ');
  return `background: conic-gradient(from ${-slice / 2}deg, ${stops}); transform: rotate(${state.luck.rotation}deg);`;
}

function renderLuckWheel() {
  refreshLuckAvailability();
  const slice = 360 / LUCK_SEGMENTS.length;
  const labels = LUCK_SEGMENTS.map((segment, index) => {
    const angle = (index * slice) * (Math.PI / 180);
    const radius = 35;
    const left = 50 + Math.sin(angle) * radius;
    const top = 50 - Math.cos(angle) * radius;
    return `<span class="wheel-label" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%">${escapeHtml(segment.label)}</span>`;
  }).join('');

  const saved = state.luck.promo || loadSavedPromo();
  const isEmpty = state.luck.result && state.luck.result.label === 'Пусто';
  let result = '';
  if (state.luck.result) {
    if (isEmpty) {
      result = `<div class="luck-result" role="status">
        <span class="luck-result-icon">🙂</span>
        <strong>${escapeHtml(state.luck.result.result)}</strong>
        <small>Попробуйте снова в следующий раз.</small>
      </div>`;
    } else if (saved && saved.code) {
      const exp = saved.expiresAt
        ? new Date(saved.expiresAt).toLocaleDateString('ru-RU')
        : '';
      result = `<div class="luck-result" role="status">
        <span class="luck-result-icon">🎉</span>
        <strong>${escapeHtml(saved.label || state.luck.result.result)}</strong>
        <div class="promo-code-box">
          <span class="promo-code-label">Ваш промокод</span>
          <code class="promo-code-value">${escapeHtml(saved.code)}</code>
          <button type="button" class="btn btn-secondary btn-sm" data-action="copy-promo" data-code="${escapeHtml(saved.code)}">Скопировать</button>
        </div>
        <small>Введите код в корзине при оформлении.${exp ? ` Действует до ${escapeHtml(exp)}.` : ''} Один раз на устройстве.</small>
      </div>`;
    } else {
      result = `<div class="luck-result" role="status">
        <span class="luck-result-icon">🎉</span>
        <strong>${escapeHtml(state.luck.result.result)}</strong>
      </div>`;
    }
  } else if (saved && saved.code && !isPromoExpired(saved)) {
    const used = loadUsedPromoCodes().includes(normalizePromoCode(saved.code));
    if (!used) {
      const exp = saved.expiresAt
        ? new Date(saved.expiresAt).toLocaleDateString('ru-RU')
        : '';
      result = `<div class="luck-result" role="status">
        <span class="luck-result-icon">🎫</span>
        <strong>${escapeHtml(saved.label || 'Ваш приз')}</strong>
        <div class="promo-code-box">
          <span class="promo-code-label">Сохранённый промокод</span>
          <code class="promo-code-value">${escapeHtml(saved.code)}</code>
          <button type="button" class="btn btn-secondary btn-sm" data-action="copy-promo" data-code="${escapeHtml(saved.code)}">Скопировать</button>
        </div>
        <small>Уже можно применить в корзине.${exp ? ` До ${escapeHtml(exp)}.` : ''}</small>
      </div>`;
    }
  }

  const buttonLabel = state.luck.spinning
    ? 'Колесо крутится…'
    : state.luck.hasSpun
      ? 'Уже крутили сегодня'
      : 'Крутить колесо';

  const cooldownMessage = state.luck.hasSpun && !state.luck.spinning
    ? '<p class="luck-cooldown" role="status">Уже крутили сегодня. Следующая попытка завтра.</p>'
    : '';

  return `
    <section class="luck-panel" aria-labelledby="luck-title">
      <div class="luck-heading">
        <span class="luck-kicker">Случайный приз</span>
        <h3 class="section-title" id="luck-title">Колесо удачи</h3>
        <p class="tab-lead">Крутите колесо и ловите промокод на скидку.</p>
      </div>
      <div class="wheel-wrap">
        <span class="wheel-pointer" aria-hidden="true">▼</span>
        <div class="luck-wheel ${state.luck.spinning ? 'is-spinning' : ''}" style="${luckWheelStyle()}" aria-label="Колесо с призами">
          ${labels}
          <span class="wheel-hub" aria-hidden="true">🎁</span>
        </div>
      </div>
      <button class="btn btn-primary luck-spin" data-action="spin-luck" ${state.luck.spinning || state.luck.hasSpun ? 'disabled' : ''}>
        ${buttonLabel}
      </button>
      ${cooldownMessage}
      ${result}
      <p class="luck-note">Одна попытка в календарный день по Москве для пользователя Telegram или этого устройства. Выигранный промокод сохраняется на устройстве и вводится в корзине.</p>
    </section>`;
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

function isUserFacingError(msg) {
  return /[А-Яа-яЁё]/.test(String(msg || ''));
}

async function sendOrderWebhook(order) {
  const base = (SHOP.orderWebhookUrl || '').trim();
  if (!base) return { sent: false, skipped: true };

  const initData = getInitData();
  if (!initData) {
    throw new Error('Откройте магазин из Telegram');
  }

  const username = (order.checkout.telegram || '').replace(/^@/, '').trim();
  // order_id с клиента не шлём (pending_*): номер 1000+ выдаёт Apps Script.
  // telegram_user_id сервер берёт из проверенного initData, не из этого поля.
  const payload = {
    initData,
    order_id: '',
    name: order.checkout.name || '',
    phone: order.checkout.phone || '',
    username,
    payment: order.checkout.payment || 'sbp',
    comment: order.checkout.comment || '',
    items: order.items,
    subtotal: order.subtotalRub != null ? order.subtotalRub : order.totalRub,
    delivery_fee: order.deliveryFeeRub || 0,
    promo_code: order.promoCode || '',
    promo_type: order.promoType || '',
    promo_value: order.promoValue != null ? order.promoValue : '',
    promo_label: order.promoLabel || '',
    discount: order.discountRub || 0,
    discount_order: order.orderDiscountRub || 0,
    discount_delivery: order.deliveryDiscountRub || 0,
    delivery_discount_pending: order.deliveryDiscountPending || '',
    total: order.totalRub,
    createdAt: order.createdAt,
  };

  // text/plain — простой запрос без CORS preflight к Apps Script
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    /* ignore */
  }
  if (!res.ok || !data || data.ok !== true) {
    const msg = (data && data.error) || `http_${res.status}`;
    throw new Error(msg);
  }
  return {
    sent: true,
    telegram: !!data.telegram,
    order_id: data.order_id ? String(data.order_id) : '',
  };
}

async function placeOrder() {
  if (state.checkout.submitting) return;
  if (!state.cart.length) return;
  if (!validateCheckout()) {
    haptic('light');
    render();
    const err = document.getElementById('co-error');
    if (err) err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const user = getUser();
  const tgContact = state.checkout.telegram.trim();
  const pricing = getOrderPricing();
  const promo = pricing.promo;
  const order = {
    id: makeOrderId(),
    status: 'Новый',
    createdAt: new Date().toISOString(),
    shop: SHOP.name,
    city: SHOP.city,
    telegramUserId: user?.id ?? null,
    user: user
      ? {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
        }
      : null,
    checkout: {
      name: state.checkout.name,
      phone: state.checkout.phone,
      telegram: tgContact,
      payment: state.checkout.payment,
      comment: state.checkout.comment,
      promoCode: promo?.code || '',
    },
    items: state.cart.map((i) => ({ ...i })),
    subtotalRub: pricing.subtotal,
    deliveryFeeRub: pricing.deliveryFee,
    promoCode: promo?.code || '',
    promoType: promo?.type || '',
    promoValue: promo?.value ?? null,
    promoLabel: promo?.label || '',
    orderDiscountRub: pricing.orderDiscount,
    deliveryDiscountRub: pricing.deliveryDiscount,
    discountRub: pricing.discountTotal,
    deliveryDiscountPending:
      promo && promo.type === 'delivery_percent' && pricing.deliveryFee <= 0
        ? `${promo.value}% на доставку`
        : '',
    totalRub: pricing.total,
    note:
      'Заказ без онлайн-оплаты. Свяжемся для подтверждения. СБП — реквизиты в чат; наличные — при встрече.',
    webhookOk: false,
  };
  order.text = formatOrderText(order);

  state.checkout.submitting = true;
  state.checkout.error = '';
  render();

  try {
    const result = await sendOrderWebhook(order);
    order.webhookOk = !!result.sent;
    // Финальный номер — только из ответа Script ({ ok, order_id: "1000"… }).
    if (result.order_id && !isTempOrderId(result.order_id)) {
      order.id = String(result.order_id);
      order.text = formatOrderText(order);
    }
  } catch (err) {
    const msg = String(err && err.message ? err.message : err);
    if (isUserFacingError(msg)) {
      state.checkout.submitting = false;
      state.checkout.error = msg;
      haptic('light');
      render();
      const errEl = document.getElementById('co-error');
      if (errEl) errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    console.warn('Order webhook failed, fallback to copy/Telegram', err);
    order.webhookOk = false;
  }

  if (promo?.code) {
    markPromoUsed(promo.code);
  }
  clearAppliedPromo();

  state.lastOrder = order;
  saveOrderLocal(order);
  console.log('ORDER JSON:', JSON.stringify(order, null, 2));
  state.cart = [];
  saveCart();
  state.checkout.submitting = false;
  state.checkout.error = '';
  haptic('heavy');
  navigate('success', { resetHistory: true });
}

function updateBackButton() {
  const onNonHomeScreen = state.screen !== 'home';
  const handler = () => goBack();
  if (onNonHomeScreen) {
    showBackButton(handler);
  } else {
    hideBackButton();
  }
}

function updateMainButton() {
  const onCheckoutScreens = state.screen === 'cart' && state.cart.length > 0;
  const bar = document.getElementById('bottom-bar');

  if (onCheckoutScreens) {
    const text = state.checkout.submitting
      ? 'Отправка…'
      : `Оформить заказ · ${formatRub(getOrderPricing().total)}`;
    const usedTg = showMainButton(text, () => placeOrder());
    if (bar) bar.classList.toggle('hidden', !!usedTg);
  } else {
    hideMainButton();
    if (bar) bar.classList.add('hidden');
  }
}

/* ——— Renderers ——— */

function brandMark() {
  return `<span class="brand-mark" aria-hidden="true">
    <img src="/logo-buber-256.jpg" alt="" width="40" height="40" />
  </span>`;
}

function header(title, { back, cart, brand } = {}) {
  const titleHtml = brand
    ? `<div class="brand">${brandMark()}<h1 class="brand-title">${title}</h1></div>`
    : `<h1>${title}</h1>`;
  const theme = getTheme();
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';
  const themeLabel = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
  return `
    <header class="header">
      ${
        back
          ? `<button class="btn-icon" data-action="back" aria-label="Назад">←</button>`
          : `<span class="btn-icon" style="visibility:hidden">·</span>`
      }
      ${titleHtml}
      <button class="btn-icon btn-theme" data-action="toggle-theme" aria-label="${themeLabel}" title="${themeLabel}">${themeIcon}</button>
      <button class="btn-icon" data-action="orders" aria-label="Мои заказы" title="Мои заказы">📋</button>
      ${
        cart !== false
          ? `<button class="btn-icon" data-action="cart" aria-label="Корзина">
              🛒
              ${cartCount() ? `<span class="badge">${cartCount()}</span>` : ''}
            </button>`
          : `<span class="btn-icon" style="visibility:hidden">·</span>`
      }
    </header>
    <div class="demo-banner">Демо-каталог · Москва · цены-заглушки</div>
  `;
}

function productsForTab(tab) {
  if (tab === 'filament') {
    return PRODUCTS.filter((p) => p.category === 'filament' || p.id === 'p-filament');
  }
  if (tab === 'figures') {
    return PRODUCTS.filter((p) => p.category === 'figures');
  }
  return PRODUCTS;
}

function renderProductCards(list) {
  if (!list.length) {
    return `<div class="tab-empty"><div class="emoji">📭</div><p>Пока нет товаров в этой категории</p></div>`;
  }
  return `<div class="grid">${list
    .map(
      (p) => `
    <article class="card" data-action="open-product" data-id="${p.id}">
      ${p.image
        ? `<div class="card-img card-img--photo" style="background:${p.color}33"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" /></div>`
        : `<div class="card-img" style="background:${p.color}33">${p.emoji}</div>`}
      <div class="card-body">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">${formatRub(p.price)}</div>
        <p class="short">${escapeHtml(p.short)}</p>
      </div>
    </article>`
    )
    .join('')}</div>`;
}

function renderTabs() {
  const tabs = HOME_TABS.map(
    (t) => `
    <button type="button" class="tab-chip ${state.homeTab === t.id ? 'active' : ''}"
      data-action="home-tab" data-id="${t.id}" role="tab"
      aria-selected="${state.homeTab === t.id ? 'true' : 'false'}">${escapeHtml(t.label)}</button>`
  ).join('');
  return `<nav class="tabs-bar" role="tablist" aria-label="Разделы">${tabs}</nav>`;
}

function renderTabContent() {
  const tab = state.homeTab;
  if (tab === 'all') {
    return `
      <h3 class="section-title">Каталог</h3>
      ${renderProductCards(productsForTab('all'))}`;
  }
  if (tab === 'filament') {
    return `
      <h3 class="section-title">Филамент</h3>
      ${renderProductCards(productsForTab('filament'))}`;
  }
  if (tab === 'figures') {
    return `
      <h3 class="section-title">Фигурки</h3>
      ${renderProductCards(productsForTab('figures'))}`;
  }
  if (tab === 'faq') {
    const items = FAQ_ITEMS.map(
      (item) => `
      <details class="faq-item">
        <summary>${escapeHtml(item.q)}</summary>
        <p>${escapeHtml(item.a)}</p>
      </details>`
    ).join('');
    const u = (SHOP.telegramUsername || '').replace(/^@/, '');
    const tgLink = u
      ? `<a class="btn btn-primary" href="https://t.me/${escapeHtml(u)}" target="_blank" rel="noopener">Написать @${escapeHtml(u)}</a>`
      : '';
    return `
      <h3 class="section-title">Как заказать</h3>
      <div class="faq-list">${items}</div>
      ${tgLink}
      <button class="btn btn-secondary" data-action="custom">Свой вариант →</button>`;
  }
  if (tab === 'portfolio') {
    const cards = PORTFOLIO_ITEMS.map(
      (p) => `
      <article class="portfolio-card">
        <img class="portfolio-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.alt || p.title)}" loading="lazy" width="1200" height="1600" />
        <div class="portfolio-caption">
          <h4>${escapeHtml(p.title)}</h4>
        </div>
      </article>`
    ).join('');
    return `
      <h3 class="section-title">Портфолио</h3>
      <p class="tab-lead">Примеры работ Бубер 3D</p>
      <div class="portfolio-grid">${cards}</div>`;
  }
  if (tab === 'reviews') {
    const cards = REVIEW_STUBS.map(
      (r) => `
      <article class="review-card">
        <div class="review-top">
          <strong>${escapeHtml(r.name)}</strong>
          <span class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(Math.max(0, 5 - r.stars))}</span>
        </div>
        <p>${escapeHtml(r.text)}</p>
      </article>`
    ).join('');
    return `
      <h3 class="section-title">Отзывы</h3>
      <p class="tab-lead">Демо-отзывы. Реальные появятся после заказов.</p>
      <div class="reviews-list">${cards}</div>`;
  }
  if (tab === 'luck') {
    return renderLuckWheel();
  }
  return renderProductCards(PRODUCTS);
}

function renderHome() {
  return `
    ${header('Бубер 3D', { brand: true })}
    <div class="screen">
      <div class="hero">
        <div class="hero-logo-wrap">
          <img class="hero-logo" src="/logo-buber-256.jpg" alt="Бубер 3D" width="96" height="96" />
        </div>
        <h2>Печать на заказ</h2>
        <p>Выберите готовый товар или опишите свой вариант — материал, цвет, размер и STL.</p>
        <button class="btn-custom" data-action="custom">✨ Свой вариант</button>
        <button class="btn btn-secondary btn-orders-link" data-action="orders">📋 Мои заказы</button>
      </div>
      ${renderTabs()}
      <div class="tab-panel" role="tabpanel">${renderTabContent()}</div>
    </div>
  `;
}

function renderProduct() {
  const p = PRODUCTS.find((x) => x.id === state.productId);
  if (!p) return renderHome();
  return `
    ${header(p.name, { back: true })}
    <div class="screen">
      ${p.image
        ? `<div class="detail-img detail-img--photo" style="background:${p.color}44"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" /></div>`
        : `<div class="detail-img" style="background:${p.color}44">${p.emoji}</div>`}
      <div class="detail-price">${formatRub(p.price)}</div>
      <div class="detail-meta">
        <span class="chip">Материал: ${escapeHtml(p.material)}</span>
        <span class="chip">Москва</span>
      </div>
      <p class="detail-desc">${escapeHtml(p.desc)}</p>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="add-product" data-id="${p.id}">В корзину</button>
      </div>
      <button class="btn btn-secondary" data-action="custom">Или свой вариант →</button>
    </div>
  `;
}

function renderCustom() {
  const c = state.custom;
  const matOpts = MATERIALS.map(
    (m) => `<option value="${m}" ${m === c.material ? 'selected' : ''}>${m}</option>`
  ).join('');
  const sizeOpts = SIZES.map(
    (s) => `<option value="${escapeHtml(s)}" ${s === c.size ? 'selected' : ''}>${escapeHtml(s)}</option>`
  ).join('');
  const swatches = COLORS.map(
    (col) => `
    <button type="button" class="color-swatch ${col.id === c.colorId ? 'selected' : ''}"
      data-action="pick-color" data-id="${col.id}"
      title="${escapeHtml(col.name)}"
      style="background:${col.hex}"></button>
  `
  ).join('');
  const estimate = estimateCustomPrice(c);

  return `
    ${header('Свой вариант', { back: true })}
    <div class="screen">
      <p style="color:var(--tg-hint);font-size:0.9rem;margin-bottom:16px">
        Опишите заказ. Оценка цены ориентировочная — уточним после просмотра STL.
      </p>

      <div class="form-group">
        <label>Материал</label>
        <select id="f-material">${matOpts}</select>
      </div>

      <div class="form-group">
        <label>Цвет</label>
        <div class="color-row">${swatches}</div>
      </div>

      <div class="form-group">
        <label>Размер</label>
        <select id="f-size">${sizeOpts}</select>
      </div>

      <div class="form-group">
        <label>Количество</label>
        <div class="qty-row">
          <button type="button" data-action="qty-minus">−</button>
          <span id="f-qty">${c.qty}</span>
          <button type="button" data-action="qty-plus">+</button>
        </div>
      </div>

      <div class="form-group">
        <label>STL-файл</label>
        <label class="file-drop ${c.stlName ? 'has-file' : ''}" id="file-drop">
          ${c.stlName ? `📎 ${escapeHtml(c.stlName)}` : 'Нажмите, чтобы выбрать .stl / .obj / .3mf'}
          <input type="file" id="f-stl" accept=".stl,.obj,.3mf,model/*" />
        </label>
      </div>

      <div class="form-group">
        <label>Комментарий</label>
        <textarea id="f-comment" placeholder="Допуски, отверстия, срочность…">${escapeHtml(c.comment)}</textarea>
      </div>

      <p style="margin-bottom:12px;font-weight:600">
        Оценка: <span style="color:var(--tg-link)">${formatRub(estimate)}</span>
        <span style="color:var(--tg-hint);font-weight:400;font-size:0.85rem"> × ${c.qty}</span>
      </p>

      <button class="btn btn-primary" data-action="add-custom">Добавить в корзину</button>
      <button class="btn btn-secondary" data-action="home">К каталогу</button>
    </div>
  `;
}

function renderCart() {
  if (!state.cart.length) {
    return `
      ${header('Корзина', { back: true })}
      <div class="screen">
        <div class="cart-empty">
          <div class="emoji">🛒</div>
          <p>Корзина пуста</p>
          <button class="btn btn-primary" style="margin-top:20px" data-action="home">В каталог</button>
        </div>
      </div>
    `;
  }

  const items = state.cart
    .map((i) => {
      const metaParts = [];
      if (i.material) metaParts.push(i.material);
      if (i.color) metaParts.push(i.color);
      if (i.size) metaParts.push(i.size);
      if (i.stlName) metaParts.push(`файл: ${i.stlName}`);
      if (i.comment) metaParts.push(i.comment);
      return `
      <div class="cart-item">
        <div class="thumb${i.image ? ' thumb--photo' : ''}" style="background:${i.productColor || '#444'}44">${i.image ? `<img src="${escapeHtml(i.image)}" alt="" loading="lazy" />` : i.emoji || '📦'}</div>
        <div class="info">
          <h4>${escapeHtml(i.name)} × ${i.qty}</h4>
          <div class="meta">${escapeHtml(metaParts.join(' · ') || '—')}</div>
          <div class="line-price">${formatRub(i.price * i.qty)}</div>
        </div>
        <button class="remove" data-action="remove" data-id="${i.id}" aria-label="Удалить">✕</button>
      </div>`;
    })
    .join('');

  const co = state.checkout;
  const payRadios = PAYMENT_METHODS.map(
    (p) => `
    <label class="pay-option ${co.payment === p.id ? 'selected' : ''}">
      <input type="radio" name="co-payment" value="${p.id}" ${co.payment === p.id ? 'checked' : ''} data-action="pick-payment" />
      <span class="pay-option-body">
        <span class="pay-option-title">${escapeHtml(p.label)}</span>
        <span class="pay-option-hint">${escapeHtml(p.hint)}</span>
      </span>
    </label>`
  ).join('');

  const sbpPayment =
    co.payment === 'sbp'
      ? `<div class="sbp-payment">
          <p class="sbp-payment-title">Оплата по СБП</p>
          <p class="sbp-recipient"><span>Получатель</span> Миронова Мария Геннадьевна</p>
          <a class="btn btn-primary sbp-pay-btn" data-action="open-sbp" href="https://www.tbank-online.com/rm/r_ljmtSjOfvP.AvVhabUyZQ/dn0Mj26413" target="_blank" rel="noopener noreferrer">Оплатить по СБП</a>
          <img class="sbp-qr" src="/assets/sbp-qr.jpg" alt="QR-код для оплаты по СБП" loading="lazy" width="640" height="640" />
          <p class="sbp-receipt-note">После оплаты пришлём чек самозанятого</p>
        </div>`
      : '';
  const sbpNote =
    co.payment === 'sbp'
      ? `<p class="checkout-note">${escapeHtml(SHOP.sbpHint)}</p>`
      : `<p class="checkout-note">Оплата наличными при встрече или самовывозе в ${escapeHtml(SHOP.city)}.</p>`;

  const errHtml = co.error
    ? `<p class="form-error" id="co-error">${escapeHtml(co.error)}</p>`
    : '<div id="co-error"></div>';

  hydratePromoFromStorage();
  const pricing = getOrderPricing();
  const promoErr = co.promoError
    ? `<p class="form-error promo-error">${escapeHtml(co.promoError)}</p>`
    : '';
  const promoOk = co.promoApplied
    ? `<p class="promo-applied">✓ ${escapeHtml(co.promoApplied.label || co.promoApplied.code)}
        <button type="button" class="link-btn" data-action="clear-promo">Сбросить</button>
       </p>`
    : '';
  const deliveryNote = pricing.deliveryNote
    ? `<p class="field-hint promo-delivery-note">${escapeHtml(pricing.deliveryNote)}</p>`
    : '';

  let totalsHtml = '';
  if (pricing.discountTotal > 0 || pricing.deliveryFee > 0 || co.promoApplied) {
    totalsHtml = `<div class="cart-totals">
      <div class="cart-total-row"><span>Товары</span><span>${formatRub(pricing.subtotal)}</span></div>
      ${
        pricing.deliveryFee > 0
          ? `<div class="cart-total-row"><span>Доставка</span><span>${formatRub(pricing.deliveryFee)}</span></div>`
          : ''
      }
      ${
        pricing.orderDiscount > 0
          ? `<div class="cart-total-row discount"><span>Скидка на заказ</span><span>−${formatRub(pricing.orderDiscount)}</span></div>`
          : ''
      }
      ${
        pricing.deliveryDiscount > 0
          ? `<div class="cart-total-row discount"><span>Скидка на доставку</span><span>−${formatRub(pricing.deliveryDiscount)}</span></div>`
          : ''
      }
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${formatRub(pricing.total)}</span>
      </div>
    </div>`;
  } else {
    totalsHtml = `<div class="cart-total">
      <span>Итого</span>
      <span class="sum">${formatRub(pricing.total)}</span>
    </div>`;
  }

  return `
    ${header('Корзина', { back: true })}
    <div class="screen">
      ${items}
      ${totalsHtml}
      ${deliveryNote}

      <section class="checkout-block">
        <h3 class="section-title">Оформление</h3>
        <p class="checkout-intro">
          После заказа мы свяжемся с вами в Telegram или по телефону, подтвердим детали и способ получения.
          Онлайн-оплаты пока нет: <strong>СБП</strong> — перевод по реквизитам после подтверждения;
          <strong>наличные</strong> — при встрече / самовывозе.
        </p>

        <div class="form-group">
          <label for="co-name">Имя</label>
          <input type="text" id="co-name" autocomplete="name" placeholder="Как к вам обращаться" value="${escapeHtml(co.name)}" required />
        </div>

        <div class="form-group">
          <label for="co-phone">Телефон</label>
          <input type="tel" id="co-phone" autocomplete="tel" inputmode="tel" placeholder="+7 …" value="${escapeHtml(co.phone)}" required />
        </div>

        <div class="form-group">
          <label for="co-telegram">Telegram @username</label>
          <input type="text" id="co-telegram" autocomplete="username" placeholder="@username" value="${escapeHtml(co.telegram)}" required />
        </div>
        <p class="field-hint">Имя, телефон и @username обязательны.</p>

        <div class="form-group">
          <label for="co-promo">Промокод <span class="opt">(необязательно)</span></label>
          <div class="promo-row">
            <input type="text" id="co-promo" autocomplete="off" placeholder="Например BUBER5" value="${escapeHtml(co.promoInput)}" ${co.promoApplied ? 'readonly' : ''} />
            ${
              co.promoApplied
                ? `<button type="button" class="btn btn-secondary" data-action="clear-promo">Сброс</button>`
                : `<button type="button" class="btn btn-secondary" data-action="apply-promo">Применить</button>`
            }
          </div>
          ${promoOk}
          ${promoErr}
          <p class="field-hint">Код с колеса удачи или статичный (BUBER5 / BUBER7 / LATEST5 / DOST5 / DOST7). Все, кроме LATEST5, одноразовые на устройстве.</p>
        </div>

        <div class="form-group">
          <label>Способ оплаты</label>
          <div class="pay-list">${payRadios}</div>
        </div>
        ${sbpNote}
        ${sbpPayment}

        <div class="form-group">
          <label for="co-comment">Комментарий к доставке / встрече <span class="opt">(необязательно)</span></label>
          <textarea id="co-comment" placeholder="Район, метро, удобное время, самовывоз…">${escapeHtml(co.comment)}</textarea>
        </div>

        ${errHtml}

        <button class="btn btn-primary" data-action="checkout" ${state.checkout.submitting ? 'disabled' : ''}>${
          state.checkout.submitting ? 'Отправка…' : `Оформить заказ · ${formatRub(pricing.total)}`
        }</button>
        <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
      </section>
    </div>
  `;
}


function orderCardHtml(o) {
  const when = o.date
    ? o.date
    : o.createdAt
      ? new Date(o.createdAt).toLocaleString('ru-RU')
      : '—';
  const total = o.totalRub != null && o.totalRub !== '' ? formatRub(o.totalRub) : '—';
  return `
      <article class="order-card">
        <div class="order-card-top">
          <strong class="order-id">${escapeHtml(o.id)}</strong>
          ${statusBadge(o.status)}
        </div>
        <div class="order-meta">${escapeHtml(when)}</div>
        <div class="order-items">${escapeHtml(o.itemsHint || '—')}</div>
        <div class="order-total">${escapeHtml(total)}</div>
      </article>`;
}

function renderOrders() {
  const hasWebhook = !!(SHOP.orderWebhookUrl || '').trim();
  const { loading, loaded, remote, error, source } = state.orders;
  const local = loadLocalOrders().map(normalizeLocalOrder);

  let lead = '';
  let list = [];
  let body;

  if (loading && !loaded) {
    body = `
      <p class="tab-lead">Загружаем заказы…</p>
      <div class="placeholder-panel orders-loading">
        <div class="emoji">⏳</div>
        <h3>Мои заказы</h3>
        <p>Синхронизация со статусами из таблицы</p>
      </div>`;
  } else if (source === 'remote' && Array.isArray(remote)) {
    list = remote;
    lead = list.length
      ? 'Статусы из таблицы. Исполнитель меняет колонку «Статус» — обновите список.'
      : '';
    if (list.length) {
      body = `
      <p class="tab-lead">${escapeHtml(lead)}</p>
      <div class="orders-toolbar">
        <button class="btn btn-secondary btn-refresh-orders" data-action="refresh-orders" ${loading ? 'disabled' : ''}>${loading ? 'Обновление…' : 'Обновить статусы'}</button>
      </div>
      <div class="orders-list">${list.map(orderCardHtml).join('')}</div>`;
    } else {
      body = `
      <div class="orders-toolbar">
        <button class="btn btn-secondary btn-refresh-orders" data-action="refresh-orders" ${loading ? 'disabled' : ''}>${loading ? 'Обновление…' : 'Обновить статусы'}</button>
      </div>
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Пока нет заказов</h3>
        <p>Оформите заказ в корзине — он появится здесь со статусом из таблицы.</p>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>`;
    }
  } else if (local.length) {
    list = local;
    lead = hasWebhook
      ? (error
          ? `Не удалось загрузить статусы (${error}). Показаны заказы с этого устройства.`
          : 'Показаны заказы с этого устройства (офлайн).')
      : 'Заказы с этого устройства. Подключите таблицу, чтобы видеть актуальные статусы.';
    body = `
      <p class="tab-lead">${escapeHtml(lead)}</p>
      ${hasWebhook ? `<div class="orders-toolbar">
        <button class="btn btn-secondary btn-refresh-orders" data-action="refresh-orders" ${loading ? 'disabled' : ''}>${loading ? 'Обновление…' : 'Обновить статусы'}</button>
      </div>` : ''}
      <div class="orders-list">${list.map(orderCardHtml).join('')}</div>`;
  } else if (!hasWebhook) {
    body = `
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Мои заказы</h3>
        <p>Заказы появятся после подключения таблицы</p>
        <p class="tab-lead" style="margin-top:8px">Пока можно оформить заказ и скопировать его в Telegram — история на устройстве появится здесь.</p>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>`;
  } else {
    body = `
      <div class="orders-toolbar">
        <button class="btn btn-secondary btn-refresh-orders" data-action="refresh-orders" ${loading ? 'disabled' : ''}>${loading ? 'Обновление…' : 'Обновить статусы'}</button>
      </div>
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Пока нет заказов</h3>
        <p>${error ? escapeHtml(`Не удалось загрузить список (${error}). `) : ''}Оформите заказ в корзине — он появится здесь.</p>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>`;
  }

  return `
    ${header('Мои заказы', { back: true })}
    <div class="screen">
      ${body}
    </div>
  `;
}

function renderSuccess() {
  const order = state.lastOrder;
  const text = order?.text || '';
  const tgUrl = shopTelegramUrl(text);
  const pay = order?.checkout?.payment;
  const payHint =
    pay === 'cash'
      ? 'Оплата наличными при встрече или самовывозе.'
      : SHOP.sbpHint;

  const contactBlock = tgUrl
    ? `<a class="btn btn-primary" href="${escapeHtml(tgUrl)}" target="_blank" rel="noopener">Написать нам в Telegram</a>
       <button class="btn btn-secondary" data-action="copy-order">Скопировать заказ</button>`
    : `<p class="checkout-note">Заказ сохранён на этом устройстве. Скопируйте текст и пришлите его в наш Telegram-бот или чат.</p>
       <button class="btn btn-primary" data-action="copy-order">Скопировать заказ</button>`;

  return `
    ${header('Готово', { back: true, cart: false })}
    <div class="screen">
      <div class="success">
        <div class="emoji">✅</div>
        <h2>Заказ оформлен</h2>
        <p>${
          order?.webhookOk
            ? 'Заказ отправлен. Мы свяжемся с вами для подтверждения. '
            : (SHOP.orderWebhookUrl || '').trim()
              ? 'Не удалось отправить автоматически — скопируйте заказ или напишите нам в Telegram. '
              : 'Мы свяжемся с вами для подтверждения. '
        }${escapeHtml(payHint)}</p>
        <div class="order-summary" id="order-summary">${escapeHtml(text)}</div>
        <p class="copy-status" id="copy-status" hidden></p>
        ${contactBlock}
        <button class="btn btn-secondary" data-action="orders">Мои заказы</button>
        <button class="btn btn-secondary" data-action="home">В каталог</button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  let html;
  switch (state.screen) {
    case 'product':
      html = renderProduct();
      break;
    case 'custom':
      html = renderCustom();
      break;
    case 'cart':
      html = renderCart();
      break;
    case 'success':
      html = renderSuccess();
      break;
    case 'orders':
      html = renderOrders();
      if (!state.orders.loaded && !state.orders.loading) {
        queueMicrotask(() => loadRemoteOrders());
      }
      break;
    default:
      html = renderHome();
  }

  html += `
    <div id="bottom-bar" class="bottom-bar hidden">
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
    </div>
  `;

  app.innerHTML = html;
  bindEvents();
  updateBackButton();
  updateMainButton();
}

function syncCustomFromDom() {
  const mat = document.getElementById('f-material');
  const size = document.getElementById('f-size');
  const comment = document.getElementById('f-comment');
  if (mat) state.custom.material = mat.value;
  if (size) state.custom.size = size.value;
  if (comment) state.custom.comment = comment.value;
}

function bindEvents() {
  app.querySelectorAll('[data-action]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const action = el.getAttribute('data-action');
      const id = el.getAttribute('data-id');

      if (action === 'back') {
        goBack();
        return;
      }
      if (action === 'toggle-theme') {
        toggleTheme();
        // обновить иконку в шапке без сброса формы — полный render ок
        if (state.screen === 'custom') syncCustomFromDom();
        if (state.screen === 'cart') syncCheckoutFromDom();
        render();
        return;
      }
      if (action === 'home') return navigate('home');
      if (action === 'home-tab') {
        state.homeTab = id || 'all';
        haptic('light');
        render();
        return;
      }
      if (action === 'spin-luck') {
        spinLuckWheel();
        return;
      }
      if (action === 'cart') return navigate('cart');
      if (action === 'orders') {
        navigate('orders');
        loadRemoteOrders();
        return;
      }
      if (action === 'refresh-orders') {
        haptic('light');
        loadRemoteOrders(true);
        return;
      }
      if (action === 'custom') return navigate('custom');
      if (action === 'open-product') return navigate('product', { productId: id });
      if (action === 'add-product') {
        const p = PRODUCTS.find((x) => x.id === id);
        if (p) {
          addProductToCart(p, 1);
          navigate('cart');
        }
        return;
      }
      if (action === 'pick-color') {
        syncCustomFromDom();
        state.custom.colorId = id;
        render();
        return;
      }
      if (action === 'qty-minus') {
        syncCustomFromDom();
        state.custom.qty = Math.max(1, state.custom.qty - 1);
        render();
        return;
      }
      if (action === 'qty-plus') {
        syncCustomFromDom();
        state.custom.qty = Math.min(99, state.custom.qty + 1);
        render();
        return;
      }
      if (action === 'add-custom') {
        syncCustomFromDom();
        addCustomToCart();
        navigate('cart');
        return;
      }
      if (action === 'remove') {
        removeFromCart(id);
        return;
      }
      if (action === 'pick-payment') {
        syncCheckoutFromDom();
        state.checkout.payment = el.getAttribute('value') || state.checkout.payment;
        state.checkout.error = '';
        render();
        return;
      }
      if (action === 'open-sbp') {
        const url = el.getAttribute('href');
        if (tg?.openLink && url) {
          e.preventDefault();
          try {
            tg.openLink(url);
          } catch (_) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }
        return;
      }
      if (action === 'apply-promo') {
        const ok = applyPromoFromInput();
        haptic(ok ? 'medium' : 'light');
        render();
        return;
      }
      if (action === 'clear-promo') {
        syncCheckoutFromDom();
        clearAppliedPromo();
        haptic('light');
        render();
        return;
      }
      if (action === 'copy-promo') {
        const code = el.getAttribute('data-code') || state.luck.promo?.code || loadSavedPromo()?.code || '';
        copyText(code).then((ok) => {
          haptic(ok ? 'medium' : 'light');
        });
        return;
      }
      if (action === 'checkout') {
        placeOrder();
        return;
      }
      if (action === 'copy-order') {
        const order = state.lastOrder;
        const t = order?.text || '';
        copyText(t).then((ok) => {
          const status = document.getElementById('copy-status');
          if (status) {
            status.hidden = false;
            status.textContent = ok
              ? 'Скопировано — вставьте в чат с нами'
              : 'Не удалось скопировать — выделите текст вручную';
          }
          haptic(ok ? 'medium' : 'light');
        });
        return;
      }
    });
  });

  // live sync checkout fields
  ['co-name', 'co-phone', 'co-telegram', 'co-comment', 'co-promo'].forEach((fid) => {
    const el = document.getElementById(fid);
    if (!el) return;
    el.addEventListener('input', () => {
      syncCheckoutFromDom();
      if (state.checkout.error) {
        const phone = state.checkout.phone;
        const tgContact = state.checkout.telegram.replace(/^@/, '').trim();
        if (phone || tgContact) {
          state.checkout.error = '';
          const err = document.getElementById('co-error');
          if (err) err.textContent = '';
        }
      }
    });
  });

  const stl = document.getElementById('f-stl');
  if (stl) {
    stl.addEventListener('change', () => {
      syncCustomFromDom();
      const file = stl.files?.[0];
      state.custom.stlName = file ? file.name : '';
      render();
    });
  }

  // live-sync selects without full re-render needed for estimate on change
  ['f-material', 'f-size'].forEach((fid) => {
    const el = document.getElementById(fid);
    if (el) {
      el.addEventListener('change', () => {
        syncCustomFromDom();
        render();
      });
    }
  });
}

// Boot
prefillCheckoutFromTg();
hydratePromoFromStorage();
state.luck.hasSpun = hasSpunLuckToday();
render();

if (tg) {
  console.info('Telegram WebApp ready', { version: tg.version, platform: tg.platform });
} else {
  console.info('Running outside Telegram — MainButton fallback available on cart.');
}
