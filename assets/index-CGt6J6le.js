(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`p1`,name:`Кастомный брелок`,price:350,short:`Небольшой брелок по вашему STL или эскизу`,desc:`Печать брелка до 5 см. PLA/PETG, выбор цвета. Идеально для подарков и мерча.`,color:`#e74c3c`,emoji:`🔑`,material:`PLA`},{id:`p2`,name:`Фигурка 10 см`,price:1200,short:`Детализированная фигурка высотой до 10 см`,desc:`Печать фигурки с поддержками. Материал PLA или PETG. Возможна покраска отдельно.`,color:`#3498db`,emoji:`🧍`,material:`PLA`},{id:`p3`,name:`Корпус для электроники`,price:890,short:`Корпус / бокс под плату или датчик`,desc:`Прочный PETG-корпус. Укажите размеры отверстий в комментарии или приложите STL.`,color:`#2ecc71`,emoji:`📦`,material:`PETG`},{id:`p4`,name:`Ваза / кашпо`,price:1500,short:`Декоративная ваза или кашпо`,desc:`Ваза высотой до 20 см. PLA матовый или глянец. Водонепроницаемость — по запросу.`,color:`#9b59b6`,emoji:`🪴`,material:`PLA`},{id:`p5`,name:`Прототип детали`,price:2e3,short:`Инженерный прототип по чертежу / STL`,desc:`Точная печать прототипа. PETG или ABS. Обсудим допуски после заказа.`,color:`#f39c12`,emoji:`⚙️`,material:`PETG`}],t=[`PLA`,`PETG`,`ABS`,`TPU`,`Другой`],n=[{id:`white`,name:`Белый`,hex:`#f5f5f5`},{id:`black`,name:`Чёрный`,hex:`#222`},{id:`red`,name:`Красный`,hex:`#e74c3c`},{id:`blue`,name:`Синий`,hex:`#3498db`},{id:`green`,name:`Зелёный`,hex:`#2ecc71`},{id:`yellow`,name:`Жёлтый`,hex:`#f1c40f`},{id:`orange`,name:`Оранжевый`,hex:`#e67e22`},{id:`purple`,name:`Фиолетовый`,hex:`#9b59b6`},{id:`custom`,name:`Другой`,hex:`linear-gradient(135deg,#e74c3c,#3498db,#2ecc71)`}],r=[`S (до 5 см)`,`M (5–15 см)`,`L (15–25 см)`,`XL (25+ см)`,`Свой размер`],i=typeof window<`u`?window.Telegram?.WebApp:null,a=null,o={light:`#f7f5f2`,dark:`#0a0a0a`};function s(e=`light`){if(!i)return;let t=o[e]||o.light;if(i.setHeaderColor)try{i.setHeaderColor(t)}catch{try{i.setHeaderColor(`bg_color`)}catch{}}if(i.setBackgroundColor)try{i.setBackgroundColor(t)}catch{}if(i.MainButton?.setParams)try{i.MainButton.setParams({color:`#ff8a1f`,text_color:`#ffffff`})}catch{}}function c(e=`light`){if(!i)return null;try{i.ready(),i.expand(),s(e)}catch(e){console.warn(`Telegram init:`,e)}return i}function l(e,t){if(!i?.MainButton)return!1;if(a&&i.MainButton.offClick)try{i.MainButton.offClick(a)}catch{}return a=t,i.MainButton.setText(e),i.MainButton.onClick(a),i.MainButton.show(),i.MainButton.enable(),!0}function u(){if(i?.MainButton){if(a&&i.MainButton.offClick)try{i.MainButton.offClick(a)}catch{}a=null,i.MainButton.hide()}}function d(e=`light`){try{i?.HapticFeedback?.impactOccurred?.(e)}catch{}}function f(){return i?.initDataUnsafe?.user||null}var p=`tg3d_cart_v1`,m=`buber-theme`,h={screen:`home`,productId:null,cart:x(),lastOrder:null,custom:{material:t[0],colorId:n[0].id,size:r[1],qty:1,stlName:``,comment:``}},g=document.getElementById(`app`);function _(){return document.documentElement.getAttribute(`data-theme`)===`dark`?`dark`:`light`}function v(e){let t=e===`dark`?`dark`:`light`;document.documentElement.setAttribute(`data-theme`,t);try{localStorage.setItem(m,t)}catch{}let n=document.querySelector(`meta[name="theme-color"]`);n&&n.setAttribute(`content`,t===`dark`?`#0a0a0a`:`#f7f5f2`),s(t)}function y(){v(_()===`dark`?`light`:`dark`),d(`light`)}v(_());var b=c(_());function x(){try{return JSON.parse(localStorage.getItem(p)||`[]`)}catch{return[]}}function S(){localStorage.setItem(p,JSON.stringify(h.cart))}function C(){return h.cart.reduce((e,t)=>e+t.qty,0)}function w(){return h.cart.reduce((e,t)=>e+t.price*t.qty,0)}function T(e){return new Intl.NumberFormat(`ru-RU`,{style:`currency`,currency:`RUB`,maximumFractionDigits:0}).format(e)}function E(e,t={}){h.screen=e,t.productId&&(h.productId=t.productId),d(`light`),H()}function D(){return`c_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function O(e,t=1){let n=h.cart.find(t=>t.type===`product`&&t.productId===e.id);n?n.qty+=t:h.cart.push({type:`product`,id:D(),productId:e.id,name:e.name,price:e.price,qty:t,emoji:e.emoji,productColor:e.color,material:e.material}),S(),d(`medium`)}function k(){let e=h.custom,i=n.find(t=>t.id===e.colorId)||n[0],a=A(e);h.cart.push({type:`custom`,id:D(),name:`Свой вариант`,price:a,qty:e.qty,emoji:`✨`,productColor:typeof i.hex==`string`&&i.hex.startsWith(`#`)?i.hex:`#6c9eff`,material:e.material,color:i.name,size:e.size,stlName:e.stlName||``,comment:e.comment||``}),S(),d(`medium`),h.custom={material:t[0],colorId:n[0].id,size:r[1],qty:1,stlName:``,comment:``}}function A(e){let t={[r[0]]:400,[r[1]]:900,[r[2]]:1800,[r[3]]:3500,[r[4]]:1500},n={PLA:1,PETG:1.15,ABS:1.25,TPU:1.4,Другой:1.2},i=t[e.size]??900;return Math.round(i*(n[e.material]||1))}function j(e){h.cart=h.cart.filter(t=>t.id!==e),S(),d(`light`),H()}function M(){if(!h.cart.length)return;let e=f(),t={createdAt:new Date().toISOString(),user:e?{id:e.id,username:e.username,first_name:e.first_name,last_name:e.last_name}:null,items:h.cart,totalRub:w(),note:`Демо-заказ (без бэкенда). Сохранён локально в Mini App.`};h.lastOrder=t,console.log(`ORDER JSON:`,JSON.stringify(t,null,2)),h.cart=[],S(),d(`heavy`),E(`success`)}function N(){let e=h.screen===`cart`&&h.cart.length>0,t=document.getElementById(`bottom-bar`);if(e){let e=l(`Оформить заказ · ${T(w())}`,()=>M());t&&t.classList.toggle(`hidden`,!!e)}else u(),t&&t.classList.add(`hidden`)}function P(){return`<span class="brand-mark" aria-hidden="true">
    <img src="/logo-buber-256.jpg" alt="" width="40" height="40" />
  </span>`}function F(e,{back:t,cart:n,brand:r}={}){let i=r?`<div class="brand">${P()}<h1 class="brand-title">${e}</h1></div>`:`<h1>${e}</h1>`,a=_(),o=a===`dark`?`☀️`:`🌙`,s=a===`dark`?`Светлая тема`:`Тёмная тема`;return`
    <header class="header">
      ${t?`<button class="btn-icon" data-action="back" aria-label="Назад">←</button>`:`<span class="btn-icon" style="visibility:hidden">·</span>`}
      ${i}
      <button class="btn-icon btn-theme" data-action="toggle-theme" aria-label="${s}" title="${s}">${o}</button>
      ${n===!1?`<span class="btn-icon" style="visibility:hidden">·</span>`:`<button class="btn-icon" data-action="cart" aria-label="Корзина">
              🛒
              ${C()?`<span class="badge">${C()}</span>`:``}
            </button>`}
    </header>
    <div class="demo-banner">Демо-каталог · Москва · цены-заглушки</div>
  `}function I(){let t=e.map(e=>`
    <article class="card" data-action="open-product" data-id="${e.id}">
      <div class="card-img" style="background:${e.color}33">${e.emoji}</div>
      <div class="card-body">
        <h3>${V(e.name)}</h3>
        <div class="price">${T(e.price)}</div>
        <p class="short">${V(e.short)}</p>
      </div>
    </article>
  `).join(``);return`
    ${F(`Бубер 3D`,{brand:!0})}
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
      <div class="grid">${t}</div>
    </div>
  `}function L(){let t=e.find(e=>e.id===h.productId);return t?`
    ${F(t.name)}
    <div class="screen">
      <div class="detail-img" style="background:${t.color}44">${t.emoji}</div>
      <div class="detail-price">${T(t.price)}</div>
      <div class="detail-meta">
        <span class="chip">Материал: ${V(t.material)}</span>
        <span class="chip">Москва</span>
      </div>
      <p class="detail-desc">${V(t.desc)}</p>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="add-product" data-id="${t.id}">В корзину</button>
      </div>
      <button class="btn btn-secondary" data-action="custom">Или свой вариант →</button>
    </div>
  `:I()}function R(){let e=h.custom,i=t.map(t=>`<option value="${t}" ${t===e.material?`selected`:``}>${t}</option>`).join(``),a=r.map(t=>`<option value="${V(t)}" ${t===e.size?`selected`:``}>${V(t)}</option>`).join(``),o=n.map(t=>`
    <button type="button" class="color-swatch ${t.id===e.colorId?`selected`:``}"
      data-action="pick-color" data-id="${t.id}"
      title="${V(t.name)}"
      style="background:${t.hex}"></button>
  `).join(``),s=A(e);return`
    ${F(`Свой вариант`)}
    <div class="screen">
      <p style="color:var(--tg-hint);font-size:0.9rem;margin-bottom:16px">
        Опишите заказ. Оценка цены ориентировочная — уточним после просмотра STL.
      </p>

      <div class="form-group">
        <label>Материал</label>
        <select id="f-material">${i}</select>
      </div>

      <div class="form-group">
        <label>Цвет</label>
        <div class="color-row">${o}</div>
      </div>

      <div class="form-group">
        <label>Размер</label>
        <select id="f-size">${a}</select>
      </div>

      <div class="form-group">
        <label>Количество</label>
        <div class="qty-row">
          <button type="button" data-action="qty-minus">−</button>
          <span id="f-qty">${e.qty}</span>
          <button type="button" data-action="qty-plus">+</button>
        </div>
      </div>

      <div class="form-group">
        <label>STL-файл</label>
        <label class="file-drop ${e.stlName?`has-file`:``}" id="file-drop">
          ${e.stlName?`📎 ${V(e.stlName)}`:`Нажмите, чтобы выбрать .stl / .obj / .3mf`}
          <input type="file" id="f-stl" accept=".stl,.obj,.3mf,model/*" />
        </label>
      </div>

      <div class="form-group">
        <label>Комментарий</label>
        <textarea id="f-comment" placeholder="Допуски, отверстия, срочность…">${V(e.comment)}</textarea>
      </div>

      <p style="margin-bottom:12px;font-weight:600">
        Оценка: <span style="color:var(--tg-link)">${T(s)}</span>
        <span style="color:var(--tg-hint);font-weight:400;font-size:0.85rem"> × ${e.qty}</span>
      </p>

      <button class="btn btn-primary" data-action="add-custom">Добавить в корзину</button>
      <button class="btn btn-secondary" data-action="home">К каталогу</button>
    </div>
  `}function z(){if(!h.cart.length)return`
      ${F(`Корзина`)}
      <div class="screen">
        <div class="cart-empty">
          <div class="emoji">🛒</div>
          <p>Корзина пуста</p>
          <button class="btn btn-primary" style="margin-top:20px" data-action="home">В каталог</button>
        </div>
      </div>
    `;let e=h.cart.map(e=>{let t=[];return e.material&&t.push(e.material),e.color&&t.push(e.color),e.size&&t.push(e.size),e.stlName&&t.push(`файл: ${e.stlName}`),e.comment&&t.push(e.comment),`
      <div class="cart-item">
        <div class="thumb" style="background:${e.productColor||`#444`}44">${e.emoji||`📦`}</div>
        <div class="info">
          <h4>${V(e.name)} × ${e.qty}</h4>
          <div class="meta">${V(t.join(` · `)||`—`)}</div>
          <div class="line-price">${T(e.price*e.qty)}</div>
        </div>
        <button class="remove" data-action="remove" data-id="${e.id}" aria-label="Удалить">✕</button>
      </div>`}).join(``);return`
    ${F(`Корзина`)}
    <div class="screen">
      ${e}
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${T(w())}</span>
      </div>
      <p style="color:var(--tg-hint);font-size:0.8rem;margin-bottom:12px">
        Оплата и доставка подключим позже. Сейчас заказ сохранится локально (JSON в консоли).
      </p>
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
      <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
    </div>
  `}function B(){let e=h.lastOrder,t=e?JSON.stringify(e,null,2):`{}`;return`
    ${F(`Готово`,{cart:!1})}
    <div class="screen">
      <div class="success">
        <div class="emoji">✅</div>
        <h2>Заказ принят (демо)</h2>
        <p>Бэкенда пока нет — заказ собран в JSON. Ниже превью для проверки.</p>
        <pre>${V(t)}</pre>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>
    </div>
  `}function V(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function H(){let e;switch(h.screen){case`product`:e=L();break;case`custom`:e=R();break;case`cart`:e=z();break;case`success`:e=B();break;default:e=I()}e+=`
    <div id="bottom-bar" class="bottom-bar hidden">
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
    </div>
  `,g.innerHTML=e,W(),N()}function U(){let e=document.getElementById(`f-material`),t=document.getElementById(`f-size`),n=document.getElementById(`f-comment`);e&&(h.custom.material=e.value),t&&(h.custom.size=t.value),n&&(h.custom.comment=n.value)}function W(){g.querySelectorAll(`[data-action]`).forEach(t=>{t.addEventListener(`click`,n=>{let r=t.getAttribute(`data-action`),i=t.getAttribute(`data-id`);if(r===`back`){(h.screen===`product`||h.screen===`custom`||h.screen===`cart`||h.screen===`success`)&&E(`home`);return}if(r===`toggle-theme`){y(),h.screen===`custom`&&U(),H();return}if(r===`home`)return E(`home`);if(r===`cart`)return E(`cart`);if(r===`custom`)return E(`custom`);if(r===`open-product`)return E(`product`,{productId:i});if(r===`add-product`){let t=e.find(e=>e.id===i);t&&(O(t,1),E(`cart`));return}if(r===`pick-color`){U(),h.custom.colorId=i,H();return}if(r===`qty-minus`){U(),h.custom.qty=Math.max(1,h.custom.qty-1),H();return}if(r===`qty-plus`){U(),h.custom.qty=Math.min(99,h.custom.qty+1),H();return}if(r===`add-custom`){U(),k(),E(`cart`);return}if(r===`remove`){j(i);return}if(r===`checkout`){M();return}})});let t=document.getElementById(`f-stl`);t&&t.addEventListener(`change`,()=>{U();let e=t.files?.[0];h.custom.stlName=e?e.name:``,H()}),[`f-material`,`f-size`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`change`,()=>{U(),H()})})}H(),b?console.info(`Telegram WebApp ready`,{version:b.version,platform:b.platform}):console.info(`Running outside Telegram — MainButton fallback available on cart.`);