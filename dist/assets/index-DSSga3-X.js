(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`p1`,name:`Кастомный брелок`,price:350,short:`Небольшой брелок по вашему STL или эскизу`,desc:`Печать брелка до 5 см. PLA/PETG, выбор цвета. Идеально для подарков и мерча.`,color:`#e74c3c`,emoji:`🔑`,material:`PLA`},{id:`p2`,name:`Фигурка 10 см`,price:1200,short:`Детализированная фигурка высотой до 10 см`,desc:`Печать фигурки с поддержками. Материал PLA или PETG. Возможна покраска отдельно.`,color:`#3498db`,emoji:`🧍`,material:`PLA`},{id:`p3`,name:`Корпус для электроники`,price:890,short:`Корпус / бокс под плату или датчик`,desc:`Прочный PETG-корпус. Укажите размеры отверстий в комментарии или приложите STL.`,color:`#2ecc71`,emoji:`📦`,material:`PETG`},{id:`p4`,name:`Ваза / кашпо`,price:1500,short:`Декоративная ваза или кашпо`,desc:`Ваза высотой до 20 см. PLA матовый или глянец. Водонепроницаемость — по запросу.`,color:`#9b59b6`,emoji:`🪴`,material:`PLA`},{id:`p5`,name:`Прототип детали`,price:2e3,short:`Инженерный прототип по чертежу / STL`,desc:`Точная печать прототипа. PETG или ABS. Обсудим допуски после заказа.`,color:`#f39c12`,emoji:`⚙️`,material:`PETG`}],t=[`PLA`,`PETG`,`ABS`,`TPU`,`Другой`],n=[{id:`white`,name:`Белый`,hex:`#f5f5f5`},{id:`black`,name:`Чёрный`,hex:`#222`},{id:`red`,name:`Красный`,hex:`#e74c3c`},{id:`blue`,name:`Синий`,hex:`#3498db`},{id:`green`,name:`Зелёный`,hex:`#2ecc71`},{id:`yellow`,name:`Жёлтый`,hex:`#f1c40f`},{id:`orange`,name:`Оранжевый`,hex:`#e67e22`},{id:`purple`,name:`Фиолетовый`,hex:`#9b59b6`},{id:`custom`,name:`Другой`,hex:`linear-gradient(135deg,#e74c3c,#3498db,#2ecc71)`}],r=[`S (до 5 см)`,`M (5–15 см)`,`L (15–25 см)`,`XL (25+ см)`,`Свой размер`],i=typeof window<`u`?window.Telegram?.WebApp:null,a=null;function o(){if(!i)return null;try{if(i.ready(),i.expand(),i.setHeaderColor)try{i.setHeaderColor(`#f7f5f2`)}catch{try{i.setHeaderColor(`bg_color`)}catch{}}if(i.setBackgroundColor)try{i.setBackgroundColor(`#f7f5f2`)}catch{}if(i.MainButton?.setParams)try{i.MainButton.setParams({color:`#ff8a1f`,text_color:`#ffffff`})}catch{}}catch(e){console.warn(`Telegram init:`,e)}return i}function s(e,t){if(!i?.MainButton)return!1;if(a&&i.MainButton.offClick)try{i.MainButton.offClick(a)}catch{}return a=t,i.MainButton.setText(e),i.MainButton.onClick(a),i.MainButton.show(),i.MainButton.enable(),!0}function c(){if(i?.MainButton){if(a&&i.MainButton.offClick)try{i.MainButton.offClick(a)}catch{}a=null,i.MainButton.hide()}}function l(e=`light`){try{i?.HapticFeedback?.impactOccurred?.(e)}catch{}}function u(){return i?.initDataUnsafe?.user||null}var d=`tg3d_cart_v1`,f={screen:`home`,productId:null,cart:h(),lastOrder:null,custom:{material:t[0],colorId:n[0].id,size:r[1],qty:1,stlName:``,comment:``}},p=document.getElementById(`app`),m=o();function h(){try{return JSON.parse(localStorage.getItem(d)||`[]`)}catch{return[]}}function g(){localStorage.setItem(d,JSON.stringify(f.cart))}function _(){return f.cart.reduce((e,t)=>e+t.qty,0)}function v(){return f.cart.reduce((e,t)=>e+t.price*t.qty,0)}function y(e){return new Intl.NumberFormat(`ru-RU`,{style:`currency`,currency:`RUB`,maximumFractionDigits:0}).format(e)}function b(e,t={}){f.screen=e,t.productId&&(f.productId=t.productId),l(`light`),I()}function x(){return`c_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function S(e,t=1){let n=f.cart.find(t=>t.type===`product`&&t.productId===e.id);n?n.qty+=t:f.cart.push({type:`product`,id:x(),productId:e.id,name:e.name,price:e.price,qty:t,emoji:e.emoji,productColor:e.color,material:e.material}),g(),l(`medium`)}function C(){let e=f.custom,i=n.find(t=>t.id===e.colorId)||n[0],a=w(e);f.cart.push({type:`custom`,id:x(),name:`Свой вариант`,price:a,qty:e.qty,emoji:`✨`,productColor:typeof i.hex==`string`&&i.hex.startsWith(`#`)?i.hex:`#6c9eff`,material:e.material,color:i.name,size:e.size,stlName:e.stlName||``,comment:e.comment||``}),g(),l(`medium`),f.custom={material:t[0],colorId:n[0].id,size:r[1],qty:1,stlName:``,comment:``}}function w(e){let t={[r[0]]:400,[r[1]]:900,[r[2]]:1800,[r[3]]:3500,[r[4]]:1500},n={PLA:1,PETG:1.15,ABS:1.25,TPU:1.4,Другой:1.2},i=t[e.size]??900;return Math.round(i*(n[e.material]||1))}function T(e){f.cart=f.cart.filter(t=>t.id!==e),g(),l(`light`),I()}function E(){if(!f.cart.length)return;let e=u(),t={createdAt:new Date().toISOString(),user:e?{id:e.id,username:e.username,first_name:e.first_name,last_name:e.last_name}:null,items:f.cart,totalRub:v(),note:`Демо-заказ (без бэкенда). Сохранён локально в Mini App.`};f.lastOrder=t,console.log(`ORDER JSON:`,JSON.stringify(t,null,2)),f.cart=[],g(),l(`heavy`),b(`success`)}function D(){let e=f.screen===`cart`&&f.cart.length>0,t=document.getElementById(`bottom-bar`);if(e){let e=s(`Оформить заказ · ${y(v())}`,()=>E());t&&t.classList.toggle(`hidden`,!!e)}else c(),t&&t.classList.add(`hidden`)}function O(){return`<span class="brand-mark" aria-hidden="true">
    <img src="/logo-buber-256.jpg" alt="" width="40" height="40" />
  </span>`}function k(e,{back:t,cart:n,brand:r}={}){let i=r?`<div class="brand">${O()}<h1 class="brand-title">${e}</h1></div>`:`<h1>${e}</h1>`;return`
    <header class="header">
      ${t?`<button class="btn-icon" data-action="back" aria-label="Назад">←</button>`:`<span class="btn-icon" style="visibility:hidden">·</span>`}
      ${i}
      ${n===!1?`<span class="btn-icon" style="visibility:hidden">·</span>`:`<button class="btn-icon" data-action="cart" aria-label="Корзина">
              🛒
              ${_()?`<span class="badge">${_()}</span>`:``}
            </button>`}
    </header>
    <div class="demo-banner">Демо-каталог · Москва · цены-заглушки</div>
  `}function A(){let t=e.map(e=>`
    <article class="card" data-action="open-product" data-id="${e.id}">
      <div class="card-img" style="background:${e.color}33">${e.emoji}</div>
      <div class="card-body">
        <h3>${F(e.name)}</h3>
        <div class="price">${y(e.price)}</div>
        <p class="short">${F(e.short)}</p>
      </div>
    </article>
  `).join(``);return`
    ${k(`Бубер 3D`,{brand:!0})}
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
  `}function j(){let t=e.find(e=>e.id===f.productId);return t?`
    ${k(t.name)}
    <div class="screen">
      <div class="detail-img" style="background:${t.color}44">${t.emoji}</div>
      <div class="detail-price">${y(t.price)}</div>
      <div class="detail-meta">
        <span class="chip">Материал: ${F(t.material)}</span>
        <span class="chip">Москва</span>
      </div>
      <p class="detail-desc">${F(t.desc)}</p>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="add-product" data-id="${t.id}">В корзину</button>
      </div>
      <button class="btn btn-secondary" data-action="custom">Или свой вариант →</button>
    </div>
  `:A()}function M(){let e=f.custom,i=t.map(t=>`<option value="${t}" ${t===e.material?`selected`:``}>${t}</option>`).join(``),a=r.map(t=>`<option value="${F(t)}" ${t===e.size?`selected`:``}>${F(t)}</option>`).join(``),o=n.map(t=>`
    <button type="button" class="color-swatch ${t.id===e.colorId?`selected`:``}"
      data-action="pick-color" data-id="${t.id}"
      title="${F(t.name)}"
      style="background:${t.hex}"></button>
  `).join(``),s=w(e);return`
    ${k(`Свой вариант`)}
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
          ${e.stlName?`📎 ${F(e.stlName)}`:`Нажмите, чтобы выбрать .stl / .obj / .3mf`}
          <input type="file" id="f-stl" accept=".stl,.obj,.3mf,model/*" />
        </label>
      </div>

      <div class="form-group">
        <label>Комментарий</label>
        <textarea id="f-comment" placeholder="Допуски, отверстия, срочность…">${F(e.comment)}</textarea>
      </div>

      <p style="margin-bottom:12px;font-weight:600">
        Оценка: <span style="color:var(--tg-link)">${y(s)}</span>
        <span style="color:var(--tg-hint);font-weight:400;font-size:0.85rem"> × ${e.qty}</span>
      </p>

      <button class="btn btn-primary" data-action="add-custom">Добавить в корзину</button>
      <button class="btn btn-secondary" data-action="home">К каталогу</button>
    </div>
  `}function N(){if(!f.cart.length)return`
      ${k(`Корзина`)}
      <div class="screen">
        <div class="cart-empty">
          <div class="emoji">🛒</div>
          <p>Корзина пуста</p>
          <button class="btn btn-primary" style="margin-top:20px" data-action="home">В каталог</button>
        </div>
      </div>
    `;let e=f.cart.map(e=>{let t=[];return e.material&&t.push(e.material),e.color&&t.push(e.color),e.size&&t.push(e.size),e.stlName&&t.push(`файл: ${e.stlName}`),e.comment&&t.push(e.comment),`
      <div class="cart-item">
        <div class="thumb" style="background:${e.productColor||`#444`}44">${e.emoji||`📦`}</div>
        <div class="info">
          <h4>${F(e.name)} × ${e.qty}</h4>
          <div class="meta">${F(t.join(` · `)||`—`)}</div>
          <div class="line-price">${y(e.price*e.qty)}</div>
        </div>
        <button class="remove" data-action="remove" data-id="${e.id}" aria-label="Удалить">✕</button>
      </div>`}).join(``);return`
    ${k(`Корзина`)}
    <div class="screen">
      ${e}
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${y(v())}</span>
      </div>
      <p style="color:var(--tg-hint);font-size:0.8rem;margin-bottom:12px">
        Оплата и доставка подключим позже. Сейчас заказ сохранится локально (JSON в консоли).
      </p>
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
      <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
    </div>
  `}function P(){let e=f.lastOrder,t=e?JSON.stringify(e,null,2):`{}`;return`
    ${k(`Готово`,{cart:!1})}
    <div class="screen">
      <div class="success">
        <div class="emoji">✅</div>
        <h2>Заказ принят (демо)</h2>
        <p>Бэкенда пока нет — заказ собран в JSON. Ниже превью для проверки.</p>
        <pre>${F(t)}</pre>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>
    </div>
  `}function F(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function I(){let e;switch(f.screen){case`product`:e=j();break;case`custom`:e=M();break;case`cart`:e=N();break;case`success`:e=P();break;default:e=A()}e+=`
    <div id="bottom-bar" class="bottom-bar hidden">
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
    </div>
  `,p.innerHTML=e,R(),D()}function L(){let e=document.getElementById(`f-material`),t=document.getElementById(`f-size`),n=document.getElementById(`f-comment`);e&&(f.custom.material=e.value),t&&(f.custom.size=t.value),n&&(f.custom.comment=n.value)}function R(){p.querySelectorAll(`[data-action]`).forEach(t=>{t.addEventListener(`click`,n=>{let r=t.getAttribute(`data-action`),i=t.getAttribute(`data-id`);if(r===`back`){(f.screen===`product`||f.screen===`custom`||f.screen===`cart`||f.screen===`success`)&&b(`home`);return}if(r===`home`)return b(`home`);if(r===`cart`)return b(`cart`);if(r===`custom`)return b(`custom`);if(r===`open-product`)return b(`product`,{productId:i});if(r===`add-product`){let t=e.find(e=>e.id===i);t&&(S(t,1),b(`cart`));return}if(r===`pick-color`){L(),f.custom.colorId=i,I();return}if(r===`qty-minus`){L(),f.custom.qty=Math.max(1,f.custom.qty-1),I();return}if(r===`qty-plus`){L(),f.custom.qty=Math.min(99,f.custom.qty+1),I();return}if(r===`add-custom`){L(),C(),b(`cart`);return}if(r===`remove`){T(i);return}if(r===`checkout`){E();return}})});let t=document.getElementById(`f-stl`);t&&t.addEventListener(`change`,()=>{L();let e=t.files?.[0];f.custom.stlName=e?e.name:``,I()}),[`f-material`,`f-size`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`change`,()=>{L(),I()})})}I(),m?console.info(`Telegram WebApp ready`,{version:m.version,platform:m.platform}):console.info(`Running outside Telegram — MainButton fallback available on cart.`);