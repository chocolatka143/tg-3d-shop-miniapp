import './style.css';
import { PRODUCTS, MATERIALS, COLORS, SIZES, SHOP, PAYMENT_METHODS, HOME_TABS, FAQ_ITEMS, PORTFOLIO_ITEMS, REVIEW_STUBS, LUCK_SEGMENTS } from './data.js';
import {
  initTelegram,
  getTelegram,
  showMainButton,
  hideMainButton,
  showBackButton,
  hideBackButton,
  haptic,
  getUser,
  applyTelegramChrome,
} from './telegram.js';

const STORAGE_KEY = 'tg3d_cart_v1';
const THEME_KEY = 'buber-theme';
const ORDERS_KEY = 'tg3d_orders_v1';
const LUCK_SPIN_DURATION_MS = 3400;

/** @typedef {{ type: 'product'|'custom', id: string, name: string, price: number, qty: number, emoji?: string, color?: string, material?: string, size?: string, stlName?: string, comment?: string, productColor?: string }} CartItem */

const state = {
  screen: 'home', // home | product | custom | cart | success | orders
  productId: null,
  homeTab: 'all', // all | filament | figures | faq | portfolio | reviews
  // Previous logical routes for the in-app and Telegram back buttons.
  history: [],
  cart: loadCart(),
  lastOrder: null,
  luck: {
    spinning: false,
    hasSpun: false,
    result: null,
    rotation: 0,
  },
  checkout: {
    name: '',
    phone: '',
    telegram: '',
    payment: 'sbp',
    comment: '',
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
  const pay = document.querySelector('input[name="co-payment"]:checked');
  if (name) state.checkout.name = name.value.trim();
  if (phone) state.checkout.phone = phone.value.trim();
  if (telegram) state.checkout.telegram = telegram.value.trim();
  if (comment) state.checkout.comment = comment.value.trim();
  if (pay) state.checkout.payment = pay.value;
}

function validateCheckout() {
  syncCheckoutFromDom();
  const phone = state.checkout.phone;
  const tgContact = state.checkout.telegram.replace(/^@/, '').trim();
  if (!phone && !tgContact) {
    state.checkout.error = 'Укажите телефон или @username Telegram — так мы свяжемся с вами';
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

function makeOrderId() {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function statusLabel(status) {
  return status || 'Новый';
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

function spinLuckWheel() {
  if (state.luck.spinning || state.luck.hasSpun || !LUCK_SEGMENTS.length) return;

  const selected = pickLuckSegment();
  const selectedIndex = LUCK_SEGMENTS.findIndex((segment) => segment.id === selected.id);
  const slice = 360 / LUCK_SEGMENTS.length;
  const selectedCenter = selectedIndex * slice;
  const extraOffset = mod(-selectedCenter - state.luck.rotation, 360);
  const turns = 5 + Math.floor(Math.random() * 2);

  state.luck.spinning = true;
  state.luck.hasSpun = true;
  state.luck.result = null;
  state.luck.rotation += turns * 360 + extraOffset;
  haptic('medium');
  render();

  window.setTimeout(() => {
    state.luck.spinning = false;
    state.luck.result = selected;
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
  const slice = 360 / LUCK_SEGMENTS.length;
  const labels = LUCK_SEGMENTS.map((segment, index) => {
    const angle = (index * slice) * (Math.PI / 180);
    const radius = 35;
    const left = 50 + Math.sin(angle) * radius;
    const top = 50 - Math.cos(angle) * radius;
    return `<span class="wheel-label" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%">${escapeHtml(segment.label)}</span>`;
  }).join('');
  const result = state.luck.result
    ? `<div class="luck-result" role="status">
        <span class="luck-result-icon">${state.luck.result.label === 'Пусто' ? '🙂' : '🎉'}</span>
        <strong>${escapeHtml(state.luck.result.result)}</strong>
        <small>${state.luck.result.label === 'Пусто' ? 'Попробуйте снова завтра.' : 'Покажите этот экран при оформлении заказа.'}</small>
      </div>`
    : '';
  const buttonLabel = state.luck.spinning
    ? 'Колесо крутится…'
    : state.luck.hasSpun
      ? 'Попытка использована'
      : 'Крутить колесо';

  return `
    <section class="luck-panel" aria-labelledby="luck-title">
      <div class="luck-heading">
        <span class="luck-kicker">Случайный приз</span>
        <h3 class="section-title" id="luck-title">Колесо удачи</h3>
        <p class="tab-lead">Крутите колесо и ловите подарки от Бубер 3D.</p>
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
      ${result}
      <p class="luck-note">Одна попытка за сеанс. Приз пока не сохраняется и промокод автоматически не создаётся.</p>
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

async function sendOrderWebhook(order) {
  const base = (SHOP.orderWebhookUrl || '').trim();
  if (!base) return { sent: false, skipped: true };

  const secret = (SHOP.orderWebhookSecret || '').trim();
  let url = base;
  if (secret) {
    const sep = base.includes('?') ? '&' : '?';
    url = `${base}${sep}key=${encodeURIComponent(secret)}`;
  }

  const username = (order.checkout.telegram || '').replace(/^@/, '').trim();
  const tgUserId =
    order.telegramUserId ??
    order.user?.id ??
    getUser()?.id ??
    '';
  const payload = {
    secret,
    order_id: order.id || '',
    telegram_user_id: tgUserId,
    name: order.checkout.name || '',
    phone: order.checkout.phone || '',
    username,
    payment: order.checkout.payment || 'sbp',
    comment: order.checkout.comment || '',
    items: order.items,
    total: order.totalRub,
    createdAt: order.createdAt,
  };

  // text/plain — простой запрос без CORS preflight к Apps Script
  const res = await fetch(url, {
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
  return { sent: true, telegram: !!data.telegram };
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
    },
    items: state.cart.map((i) => ({ ...i })),
    totalRub: cartTotal(),
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
  } catch (err) {
    console.warn('Order webhook failed, fallback to copy/Telegram', err);
    order.webhookOk = false;
  }

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
      : `Оформить заказ · ${formatRub(cartTotal())}`;
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
      <div class="card-img" style="background:${p.color}33">${p.emoji}</div>
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
      <div class="placeholder-panel">
        <div class="emoji">🧍</div>
        <h3>Фигурки</h3>
        <p class="placeholder-badge">В разработке</p>
        <p>Скоро здесь появятся готовые фигурки. Пока можно заказать через «Свой вариант».</p>
        <button class="btn btn-primary" data-action="custom">✨ Свой вариант</button>
      </div>`;
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
      <div class="detail-img" style="background:${p.color}44">${p.emoji}</div>
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
        <div class="thumb" style="background:${i.productColor || '#444'}44">${i.emoji || '📦'}</div>
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

  const sbpNote =
    co.payment === 'sbp'
      ? `<p class="checkout-note">${escapeHtml(SHOP.sbpHint)}</p>`
      : `<p class="checkout-note">Оплата наличными при встрече или самовывозе в ${escapeHtml(SHOP.city)}.</p>`;

  const errHtml = co.error
    ? `<p class="form-error" id="co-error">${escapeHtml(co.error)}</p>`
    : '<div id="co-error"></div>';

  return `
    ${header('Корзина', { back: true })}
    <div class="screen">
      ${items}
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${formatRub(cartTotal())}</span>
      </div>

      <section class="checkout-block">
        <h3 class="section-title">Оформление</h3>
        <p class="checkout-intro">
          После заказа мы свяжемся с вами в Telegram или по телефону, подтвердим детали и способ получения.
          Онлайн-оплаты пока нет: <strong>СБП</strong> — перевод по реквизитам после подтверждения;
          <strong>наличные</strong> — при встрече / самовывозе.
        </p>

        <div class="form-group">
          <label for="co-name">Имя <span class="opt">(необязательно)</span></label>
          <input type="text" id="co-name" autocomplete="name" placeholder="Как к вам обращаться" value="${escapeHtml(co.name)}" />
        </div>

        <div class="form-group">
          <label for="co-phone">Телефон</label>
          <input type="tel" id="co-phone" autocomplete="tel" inputmode="tel" placeholder="+7 …" value="${escapeHtml(co.phone)}" />
        </div>

        <div class="form-group">
          <label for="co-telegram">Telegram @username</label>
          <input type="text" id="co-telegram" autocomplete="username" placeholder="@username" value="${escapeHtml(co.telegram)}" />
        </div>
        <p class="field-hint">Нужен хотя бы один контакт: телефон или @username.</p>

        <div class="form-group">
          <label>Способ оплаты</label>
          <div class="pay-list">${payRadios}</div>
        </div>
        ${sbpNote}

        <div class="form-group">
          <label for="co-comment">Комментарий к доставке / встрече <span class="opt">(необязательно)</span></label>
          <textarea id="co-comment" placeholder="Район, метро, удобное время, самовывоз…">${escapeHtml(co.comment)}</textarea>
        </div>

        ${errHtml}

        <button class="btn btn-primary" data-action="checkout" ${state.checkout.submitting ? 'disabled' : ''}>${
          state.checkout.submitting ? 'Отправка…' : `Оформить заказ · ${formatRub(cartTotal())}`
        }</button>
        <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
      </section>
    </div>
  `;
}


function renderOrders() {
  const local = loadLocalOrders();
  const hasWebhook = !!(SHOP.orderWebhookUrl || '').trim();

  let body;
  if (local.length) {
    const cards = local
      .map((o) => {
        const id = o.id || '—';
        const status = statusLabel(o.status);
        const when = o.createdAt
          ? new Date(o.createdAt).toLocaleString('ru-RU')
          : '—';
        const total =
          o.totalRub != null ? formatRub(o.totalRub) : o.total != null ? formatRub(o.total) : '—';
        const itemsCount = Array.isArray(o.items) ? o.items.length : 0;
        const itemsHint = itemsCount
          ? o.items
              .slice(0, 2)
              .map((i) => i.name)
              .filter(Boolean)
              .join(', ') + (itemsCount > 2 ? '…' : '')
          : '—';
        return `
      <article class="order-card">
        <div class="order-card-top">
          <strong class="order-id">${escapeHtml(id)}</strong>
          <span class="order-status">${escapeHtml(status)}</span>
        </div>
        <div class="order-meta">${escapeHtml(when)}</div>
        <div class="order-items">${escapeHtml(itemsHint)}</div>
        <div class="order-total">${escapeHtml(total)}</div>
      </article>`;
      })
      .join('');
    body = `
      <p class="tab-lead">Заказы с этого устройства. Статусы с таблицы появятся после подключения webhook.</p>
      <div class="orders-list">${cards}</div>`;
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
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Пока нет заказов</h3>
        <p>Оформите заказ в корзине — он появится здесь. Синхронизация статусов с таблицей — следующий шаг.</p>
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
      if (action === 'orders') return navigate('orders');
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
  ['co-name', 'co-phone', 'co-telegram', 'co-comment'].forEach((fid) => {
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
render();

if (tg) {
  console.info('Telegram WebApp ready', { version: tg.version, platform: tg.platform });
} else {
  console.info('Running outside Telegram — MainButton fallback available on cart.');
}
