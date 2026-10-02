import './style.css';
import { PRODUCTS, MATERIALS, COLORS, SIZES } from './data.js';
import {
  initTelegram,
  getTelegram,
  showMainButton,
  hideMainButton,
  haptic,
  getUser,
  applyTelegramChrome,
} from './telegram.js';

const STORAGE_KEY = 'tg3d_cart_v1';
const THEME_KEY = 'buber-theme';

/** @typedef {{ type: 'product'|'custom', id: string, name: string, price: number, qty: number, emoji?: string, color?: string, material?: string, size?: string, stlName?: string, comment?: string, productColor?: string }} CartItem */

const state = {
  screen: 'home', // home | product | custom | cart | success
  productId: null,
  cart: loadCart(),
  lastOrder: null,
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
  state.screen = screen;
  if (opts.productId) state.productId = opts.productId;
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

function placeOrder() {
  if (!state.cart.length) return;
  const user = getUser();
  const order = {
    createdAt: new Date().toISOString(),
    user: user
      ? {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
        }
      : null,
    items: state.cart,
    totalRub: cartTotal(),
    note: 'Демо-заказ (без бэкенда). Сохранён локально в Mini App.',
  };
  state.lastOrder = order;
  console.log('ORDER JSON:', JSON.stringify(order, null, 2));
  state.cart = [];
  saveCart();
  haptic('heavy');
  navigate('success');
}

function updateMainButton() {
  const onCheckoutScreens = state.screen === 'cart' && state.cart.length > 0;
  const bar = document.getElementById('bottom-bar');

  if (onCheckoutScreens) {
    const text = `Оформить заказ · ${formatRub(cartTotal())}`;
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

function renderHome() {
  const cards = PRODUCTS.map(
    (p) => `
    <article class="card" data-action="open-product" data-id="${p.id}">
      <div class="card-img" style="background:${p.color}33">${p.emoji}</div>
      <div class="card-body">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">${formatRub(p.price)}</div>
        <p class="short">${escapeHtml(p.short)}</p>
      </div>
    </article>
  `
  ).join('');

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
      </div>
      <h3 class="section-title">Каталог</h3>
      <div class="grid">${cards}</div>
    </div>
  `;
}

function renderProduct() {
  const p = PRODUCTS.find((x) => x.id === state.productId);
  if (!p) return renderHome();
  return `
    ${header(p.name)}
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
    ${header('Свой вариант')}
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
      ${header('Корзина')}
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

  return `
    ${header('Корзина')}
    <div class="screen">
      ${items}
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${formatRub(cartTotal())}</span>
      </div>
      <p style="color:var(--tg-hint);font-size:0.8rem;margin-bottom:12px">
        Оплата и доставка подключим позже. Сейчас заказ сохранится локально (JSON в консоли).
      </p>
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
      <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
    </div>
  `;
}

function renderSuccess() {
  const order = state.lastOrder;
  const json = order ? JSON.stringify(order, null, 2) : '{}';
  return `
    ${header('Готово', { cart: false })}
    <div class="screen">
      <div class="success">
        <div class="emoji">✅</div>
        <h2>Заказ принят (демо)</h2>
        <p>Бэкенда пока нет — заказ собран в JSON. Ниже превью для проверки.</p>
        <pre>${escapeHtml(json)}</pre>
        <button class="btn btn-primary" data-action="home">В каталог</button>
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
        if (state.screen === 'product' || state.screen === 'custom' || state.screen === 'cart') {
          navigate('home');
        } else if (state.screen === 'success') {
          navigate('home');
        }
        return;
      }
      if (action === 'toggle-theme') {
        toggleTheme();
        // обновить иконку в шапке без сброса формы — полный render ок
        if (state.screen === 'custom') syncCustomFromDom();
        render();
        return;
      }
      if (action === 'home') return navigate('home');
      if (action === 'cart') return navigate('cart');
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
      if (action === 'checkout') {
        placeOrder();
        return;
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
render();

if (tg) {
  console.info('Telegram WebApp ready', { version: tg.version, platform: tg.platform });
} else {
  console.info('Running outside Telegram — MainButton fallback available on cart.');
}
