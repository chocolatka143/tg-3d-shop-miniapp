(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`p1`,name:`Кастомный брелок`,price:350,short:`Небольшой брелок по вашему STL или эскизу`,desc:`Печать брелка до 5 см. PLA/PETG, выбор цвета. Идеально для подарков и мерча.`,color:`#e74c3c`,emoji:`🔑`,material:`PLA`},{id:`p2`,name:`Фигурка 10 см`,price:1200,short:`Детализированная фигурка высотой до 10 см`,desc:`Печать фигурки с поддержками. Материал PLA или PETG. Возможна покраска отдельно.`,color:`#3498db`,emoji:`🧍`,material:`PLA`},{id:`p3`,name:`Корпус для электроники`,price:890,short:`Корпус / бокс под плату или датчик`,desc:`Прочный PETG-корпус. Укажите размеры отверстий в комментарии или приложите STL.`,color:`#2ecc71`,emoji:`📦`,material:`PETG`},{id:`p4`,name:`Ваза / кашпо`,price:1500,short:`Декоративная ваза или кашпо`,desc:`Ваза высотой до 20 см. PLA матовый или глянец. Водонепроницаемость — по запросу.`,color:`#9b59b6`,emoji:`🪴`,material:`PLA`},{id:`p5`,name:`Прототип детали`,price:2e3,short:`Инженерный прототип по чертежу / STL`,desc:`Точная печать прототипа. PETG или ABS. Обсудим допуски после заказа.`,color:`#f39c12`,emoji:`⚙️`,material:`PETG`}],t=[`PLA`,`PETG`,`ABS`,`TPU`,`Другой`],n=[{id:`white`,name:`Белый`,hex:`#f5f5f5`},{id:`black`,name:`Чёрный`,hex:`#222`},{id:`red`,name:`Красный`,hex:`#e74c3c`},{id:`blue`,name:`Синий`,hex:`#3498db`},{id:`green`,name:`Зелёный`,hex:`#2ecc71`},{id:`yellow`,name:`Жёлтый`,hex:`#f1c40f`},{id:`orange`,name:`Оранжевый`,hex:`#e67e22`},{id:`purple`,name:`Фиолетовый`,hex:`#9b59b6`},{id:`custom`,name:`Другой`,hex:`linear-gradient(135deg,#e74c3c,#3498db,#2ecc71)`}],r=[`S (до 5 см)`,`M (5–15 см)`,`L (15–25 см)`,`XL (25+ см)`,`Свой размер`],i=typeof window<`u`?window.Telegram?.WebApp:null,a=null;function o(){if(!i)return null;try{if(i.ready(),i.expand(),s(i.themeParams),i.setHeaderColor)try{i.setHeaderColor(`secondary_bg_color`)}catch{}}catch(e){console.warn(`Telegram init:`,e)}return i}function s(e={}){let t=document.documentElement;Object.entries({bg_color:`--tg-bg`,text_color:`--tg-text`,hint_color:`--tg-hint`,link_color:`--tg-link`,button_color:`--tg-button`,button_text_color:`--tg-button-text`,secondary_bg_color:`--tg-secondary-bg`}).forEach(([n,r])=>{e[n]&&t.style.setProperty(r,e[n])})}function c(e,t){if(!i?.MainButton)return!1;if(a&&i.MainButton.offClick)try{i.MainButton.offClick(a)}catch{}return a=t,i.MainButton.setText(e),i.MainButton.onClick(a),i.MainButton.show(),i.MainButton.enable(),!0}function l(){if(i?.MainButton){if(a&&i.MainButton.offClick)try{i.MainButton.offClick(a)}catch{}a=null,i.MainButton.hide()}}function u(e=`light`){try{i?.HapticFeedback?.impactOccurred?.(e)}catch{}}function d(){return i?.initDataUnsafe?.user||null}var f=`tg3d_cart_v1`,p={screen:`home`,productId:null,cart:g(),lastOrder:null,custom:{material:t[0],colorId:n[0].id,size:r[1],qty:1,stlName:``,comment:``}},m=document.getElementById(`app`),h=o();function g(){try{return JSON.parse(localStorage.getItem(f)||`[]`)}catch{return[]}}function _(){localStorage.setItem(f,JSON.stringify(p.cart))}function v(){return p.cart.reduce((e,t)=>e+t.qty,0)}function y(){return p.cart.reduce((e,t)=>e+t.price*t.qty,0)}function b(e){return new Intl.NumberFormat(`ru-RU`,{style:`currency`,currency:`RUB`,maximumFractionDigits:0}).format(e)}function x(e,t={}){p.screen=e,t.productId&&(p.productId=t.productId),u(`light`),I()}function S(){return`c_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function C(e,t=1){let n=p.cart.find(t=>t.type===`product`&&t.productId===e.id);n?n.qty+=t:p.cart.push({type:`product`,id:S(),productId:e.id,name:e.name,price:e.price,qty:t,emoji:e.emoji,productColor:e.color,material:e.material}),_(),u(`medium`)}function w(){let e=p.custom,i=n.find(t=>t.id===e.colorId)||n[0],a=T(e);p.cart.push({type:`custom`,id:S(),name:`Свой вариант`,price:a,qty:e.qty,emoji:`✨`,productColor:typeof i.hex==`string`&&i.hex.startsWith(`#`)?i.hex:`#6c9eff`,material:e.material,color:i.name,size:e.size,stlName:e.stlName||``,comment:e.comment||``}),_(),u(`medium`),p.custom={material:t[0],colorId:n[0].id,size:r[1],qty:1,stlName:``,comment:``}}function T(e){let t={[r[0]]:400,[r[1]]:900,[r[2]]:1800,[r[3]]:3500,[r[4]]:1500},n={PLA:1,PETG:1.15,ABS:1.25,TPU:1.4,Другой:1.2},i=t[e.size]??900;return Math.round(i*(n[e.material]||1))}function E(e){p.cart=p.cart.filter(t=>t.id!==e),_(),u(`light`),I()}function D(){if(!p.cart.length)return;let e=d(),t={createdAt:new Date().toISOString(),user:e?{id:e.id,username:e.username,first_name:e.first_name,last_name:e.last_name}:null,items:p.cart,totalRub:y(),note:`Демо-заказ (без бэкенда). Сохранён локально в Mini App.`};p.lastOrder=t,console.log(`ORDER JSON:`,JSON.stringify(t,null,2)),p.cart=[],_(),u(`heavy`),x(`success`)}function O(){let e=p.screen===`cart`&&p.cart.length>0,t=document.getElementById(`bottom-bar`);if(e){let e=c(`Оформить заказ · ${b(y())}`,()=>D());t&&t.classList.toggle(`hidden`,!!e)}else l(),t&&t.classList.add(`hidden`)}function k(e,{back:t,cart:n}={}){return`
    <header class="header">
      ${t?`<button class="btn-icon" data-action="back" aria-label="Назад">←</button>`:`<span class="btn-icon" style="visibility:hidden">·</span>`}
      <h1>${e}</h1>
      ${n===!1?`<span class="btn-icon" style="visibility:hidden">·</span>`:`<button class="btn-icon" data-action="cart" aria-label="Корзина">
              🛒
              ${v()?`<span class="badge">${v()}</span>`:``}
            </button>`}
    </header>
    <div class="demo-banner">Демо-каталог · Москва · цены-заглушки</div>
  `}function A(){let t=e.map(e=>`
    <article class="card" data-action="open-product" data-id="${e.id}">
      <div class="card-img" style="background:${e.color}33">${e.emoji}</div>
      <div class="card-body">
        <h3>${F(e.name)}</h3>
        <div class="price">${b(e.price)}</div>
        <p class="short">${F(e.short)}</p>
      </div>
    </article>
  `).join(``);return`
    ${k(`3D Печать`)}
    <div class="screen">
      <div class="hero">
        <h2>Печать на заказ</h2>
        <p>Выберите готовый товар или опишите свой вариант — материал, цвет, размер и STL.</p>
        <button class="btn-custom" data-action="custom">✨ Свой вариант</button>
      </div>
      <h3 class="section-title">Каталог</h3>
      <div class="grid">${t}</div>
    </div>
  `}function j(){let t=e.find(e=>e.id===p.productId);return t?`
    ${k(t.name)}
    <div class="screen">
      <div class="detail-img" style="background:${t.color}44">${t.emoji}</div>
      <div class="detail-price">${b(t.price)}</div>
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
  `:A()}function M(){let e=p.custom,i=t.map(t=>`<option value="${t}" ${t===e.material?`selected`:``}>${t}</option>`).join(``),a=r.map(t=>`<option value="${F(t)}" ${t===e.size?`selected`:``}>${F(t)}</option>`).join(``),o=n.map(t=>`
    <button type="button" class="color-swatch ${t.id===e.colorId?`selected`:``}"
      data-action="pick-color" data-id="${t.id}"
      title="${F(t.name)}"
      style="background:${t.hex}"></button>
  `).join(``),s=T(e);return`
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
        Оценка: <span style="color:var(--tg-link)">${b(s)}</span>
        <span style="color:var(--tg-hint);font-weight:400;font-size:0.85rem"> × ${e.qty}</span>
      </p>

      <button class="btn btn-primary" data-action="add-custom">Добавить в корзину</button>
      <button class="btn btn-secondary" data-action="home">К каталогу</button>
    </div>
  `}function N(){if(!p.cart.length)return`
      ${k(`Корзина`)}
      <div class="screen">
        <div class="cart-empty">
          <div class="emoji">🛒</div>
          <p>Корзина пуста</p>
          <button class="btn btn-primary" style="margin-top:20px" data-action="home">В каталог</button>
        </div>
      </div>
    `;let e=p.cart.map(e=>{let t=[];return e.material&&t.push(e.material),e.color&&t.push(e.color),e.size&&t.push(e.size),e.stlName&&t.push(`файл: ${e.stlName}`),e.comment&&t.push(e.comment),`
      <div class="cart-item">
        <div class="thumb" style="background:${e.productColor||`#444`}44">${e.emoji||`📦`}</div>
        <div class="info">
          <h4>${F(e.name)} × ${e.qty}</h4>
          <div class="meta">${F(t.join(` · `)||`—`)}</div>
          <div class="line-price">${b(e.price*e.qty)}</div>
        </div>
        <button class="remove" data-action="remove" data-id="${e.id}" aria-label="Удалить">✕</button>
      </div>`}).join(``);return`
    ${k(`Корзина`)}
    <div class="screen">
      ${e}
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${b(y())}</span>
      </div>
      <p style="color:var(--tg-hint);font-size:0.8rem;margin-bottom:12px">
        Оплата и доставка подключим позже. Сейчас заказ сохранится локально (JSON в консоли).
      </p>
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
      <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
    </div>
  `}function P(){let e=p.lastOrder,t=e?JSON.stringify(e,null,2):`{}`;return`
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
  `}function F(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function I(){let e;switch(p.screen){case`product`:e=j();break;case`custom`:e=M();break;case`cart`:e=N();break;case`success`:e=P();break;default:e=A()}e+=`
    <div id="bottom-bar" class="bottom-bar hidden">
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
    </div>
  `,m.innerHTML=e,R(),O()}function L(){let e=document.getElementById(`f-material`),t=document.getElementById(`f-size`),n=document.getElementById(`f-comment`);e&&(p.custom.material=e.value),t&&(p.custom.size=t.value),n&&(p.custom.comment=n.value)}function R(){m.querySelectorAll(`[data-action]`).forEach(t=>{t.addEventListener(`click`,n=>{let r=t.getAttribute(`data-action`),i=t.getAttribute(`data-id`);if(r===`back`){(p.screen===`product`||p.screen===`custom`||p.screen===`cart`||p.screen===`success`)&&x(`home`);return}if(r===`home`)return x(`home`);if(r===`cart`)return x(`cart`);if(r===`custom`)return x(`custom`);if(r===`open-product`)return x(`product`,{productId:i});if(r===`add-product`){let t=e.find(e=>e.id===i);t&&(C(t,1),x(`cart`));return}if(r===`pick-color`){L(),p.custom.colorId=i,I();return}if(r===`qty-minus`){L(),p.custom.qty=Math.max(1,p.custom.qty-1),I();return}if(r===`qty-plus`){L(),p.custom.qty=Math.min(99,p.custom.qty+1),I();return}if(r===`add-custom`){L(),w(),x(`cart`);return}if(r===`remove`){E(i);return}if(r===`checkout`){D();return}})});let t=document.getElementById(`f-stl`);t&&t.addEventListener(`change`,()=>{L();let e=t.files?.[0];p.custom.stlName=e?e.name:``,I()}),[`f-material`,`f-size`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`change`,()=>{L(),I()})})}I(),h?console.info(`Telegram WebApp ready`,{version:h.version,platform:h.platform}):console.info(`Running outside Telegram — MainButton fallback available on cart.`);