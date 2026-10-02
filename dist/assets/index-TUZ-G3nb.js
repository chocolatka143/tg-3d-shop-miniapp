(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`p1`,name:`Кастомный брелок`,price:350,short:`Небольшой брелок по вашему STL или эскизу`,desc:`Печать брелка до 5 см. PLA/PETG, выбор цвета. Идеально для подарков и мерча.`,color:`#e74c3c`,emoji:`🔑`,material:`PLA`},{id:`p2`,name:`Фигурка 10 см`,price:1200,short:`Детализированная фигурка высотой до 10 см`,desc:`Печать фигурки с поддержками. Материал PLA или PETG. Возможна покраска отдельно.`,color:`#3498db`,emoji:`🧍`,material:`PLA`},{id:`p3`,name:`Корпус для электроники`,price:890,short:`Корпус / бокс под плату или датчик`,desc:`Прочный PETG-корпус. Укажите размеры отверстий в комментарии или приложите STL.`,color:`#2ecc71`,emoji:`📦`,material:`PETG`},{id:`p4`,name:`Ваза / кашпо`,price:1500,short:`Декоративная ваза или кашпо`,desc:`Ваза высотой до 20 см. PLA матовый или глянец. Водонепроницаемость — по запросу.`,color:`#9b59b6`,emoji:`🪴`,material:`PLA`},{id:`p5`,name:`Прототип детали`,price:2e3,short:`Инженерный прототип по чертежу / STL`,desc:`Точная печать прототипа. PETG или ABS. Обсудим допуски после заказа.`,color:`#f39c12`,emoji:`⚙️`,material:`PETG`}],t=[`PLA`,`PETG`,`ABS`,`TPU`,`Другой`],n=[{id:`white`,name:`Белый`,hex:`#f5f5f5`},{id:`black`,name:`Чёрный`,hex:`#222`},{id:`red`,name:`Красный`,hex:`#e74c3c`},{id:`blue`,name:`Синий`,hex:`#3498db`},{id:`green`,name:`Зелёный`,hex:`#2ecc71`},{id:`yellow`,name:`Жёлтый`,hex:`#f1c40f`},{id:`orange`,name:`Оранжевый`,hex:`#e67e22`},{id:`purple`,name:`Фиолетовый`,hex:`#9b59b6`},{id:`custom`,name:`Другой`,hex:`linear-gradient(135deg,#e74c3c,#3498db,#2ecc71)`}],r=[`S (до 5 см)`,`M (5–15 см)`,`L (15–25 см)`,`XL (25+ см)`,`Свой размер`],i={name:`Бубер 3D`,city:`Москва`,telegramUsername:`bubershop3d`,sbpHint:`Реквизиты СБП пришлём в чат после подтверждения заказа`,orderWebhookUrl:``,orderWebhookSecret:``},a=[{id:`sbp`,label:`СБП`,hint:`Перевод по реквизитам после подтверждения заказа`},{id:`cash`,label:`Наличные`,hint:`Оплата при встрече или самовывозе`}],o=typeof window<`u`?window.Telegram?.WebApp:null,s=null,c=null,l={light:`#f7f5f2`,dark:`#0a0a0a`};function u(e=`light`){if(!o)return;let t=l[e]||l.light;if(o.setHeaderColor)try{o.setHeaderColor(t)}catch{try{o.setHeaderColor(`bg_color`)}catch{}}if(o.setBackgroundColor)try{o.setBackgroundColor(t)}catch{}if(o.MainButton?.setParams)try{o.MainButton.setParams({color:`#ff8a1f`,text_color:`#ffffff`})}catch{}}function d(e=`light`){if(!o)return null;try{o.ready(),o.expand(),u(e)}catch(e){console.warn(`Telegram init:`,e)}return o}function f(e,t){if(!o?.MainButton)return!1;if(s&&o.MainButton.offClick)try{o.MainButton.offClick(s)}catch{}return s=t,o.MainButton.setText(e),o.MainButton.onClick(s),o.MainButton.show(),o.MainButton.enable(),!0}function p(){if(o?.MainButton){if(s&&o.MainButton.offClick)try{o.MainButton.offClick(s)}catch{}s=null,o.MainButton.hide()}}function m(e){if(!o?.BackButton)return!1;if(c&&o.BackButton.offClick)try{o.BackButton.offClick(c)}catch{}return c=e,o.BackButton.onClick(c),o.BackButton.show(),!0}function ee(){if(o?.BackButton){if(c&&o.BackButton.offClick)try{o.BackButton.offClick(c)}catch{}c=null,o.BackButton.hide()}}function h(e=`light`){try{o?.HapticFeedback?.impactOccurred?.(e)}catch{}}function g(){return o?.initDataUnsafe?.user||null}var _=`tg3d_cart_v1`,v=`buber-theme`,y=`tg3d_orders_v1`,b={screen:`home`,productId:null,history:[],cart:T(),lastOrder:null,checkout:{name:``,phone:``,telegram:``,payment:`sbp`,comment:``,error:``,submitting:!1},custom:{material:t[0],colorId:n[0].id,size:r[1],qty:1,stlName:``,comment:``}},x=document.getElementById(`app`);function S(){return document.documentElement.getAttribute(`data-theme`)===`dark`?`dark`:`light`}function C(e){let t=e===`dark`?`dark`:`light`;document.documentElement.setAttribute(`data-theme`,t);try{localStorage.setItem(v,t)}catch{}let n=document.querySelector(`meta[name="theme-color"]`);n&&n.setAttribute(`content`,t===`dark`?`#0a0a0a`:`#f7f5f2`),u(t)}function te(){C(S()===`dark`?`light`:`dark`),h(`light`)}C(S());var w=d(S());function T(){try{return JSON.parse(localStorage.getItem(_)||`[]`)}catch{return[]}}function E(){localStorage.setItem(_,JSON.stringify(b.cart))}function D(){return b.cart.reduce((e,t)=>e+t.qty,0)}function O(){return b.cart.reduce((e,t)=>e+t.price*t.qty,0)}function k(e){return new Intl.NumberFormat(`ru-RU`,{style:`currency`,currency:`RUB`,maximumFractionDigits:0}).format(e)}function A(e,t={}){let n={screen:b.screen,productId:b.productId};t.resetHistory||e===`home`?b.history=[]:e!==b.screen&&b.history.push(n),b.screen=e,e===`home`&&(b.productId=null),t.productId!==void 0&&(b.productId=t.productId),h(`light`),Q()}function j(){let e=b.history.pop();e?(b.screen=e.screen,b.productId=e.productId??null):(b.screen=`home`,b.productId=null),h(`light`),Q()}function M(){return`c_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function ne(e,t=1){let n=b.cart.find(t=>t.type===`product`&&t.productId===e.id);n?n.qty+=t:b.cart.push({type:`product`,id:M(),productId:e.id,name:e.name,price:e.price,qty:t,emoji:e.emoji,productColor:e.color,material:e.material}),E(),h(`medium`)}function N(){let e=b.custom,i=n.find(t=>t.id===e.colorId)||n[0],a=P(e);b.cart.push({type:`custom`,id:M(),name:`Свой вариант`,price:a,qty:e.qty,emoji:`✨`,productColor:typeof i.hex==`string`&&i.hex.startsWith(`#`)?i.hex:`#6c9eff`,material:e.material,color:i.name,size:e.size,stlName:e.stlName||``,comment:e.comment||``}),E(),h(`medium`),b.custom={material:t[0],colorId:n[0].id,size:r[1],qty:1,stlName:``,comment:``}}function P(e){let t={[r[0]]:400,[r[1]]:900,[r[2]]:1800,[r[3]]:3500,[r[4]]:1500},n={PLA:1,PETG:1.15,ABS:1.25,TPU:1.4,Другой:1.2},i=t[e.size]??900;return Math.round(i*(n[e.material]||1))}function F(e){b.cart=b.cart.filter(t=>t.id!==e),E(),h(`light`),Q()}function I(){let e=g();if(e&&(!b.checkout.telegram&&e.username&&(b.checkout.telegram=`@`+e.username),!b.checkout.name&&e.first_name)){let t=[e.first_name,e.last_name].filter(Boolean);b.checkout.name=t.join(` `)}}function L(){let e=document.getElementById(`co-name`),t=document.getElementById(`co-phone`),n=document.getElementById(`co-telegram`),r=document.getElementById(`co-comment`),i=document.querySelector(`input[name="co-payment"]:checked`);e&&(b.checkout.name=e.value.trim()),t&&(b.checkout.phone=t.value.trim()),n&&(b.checkout.telegram=n.value.trim()),r&&(b.checkout.comment=r.value.trim()),i&&(b.checkout.payment=i.value)}function R(){L();let e=b.checkout.phone,t=b.checkout.telegram.replace(/^@/,``).trim();return!e&&!t?(b.checkout.error=`Укажите телефон или @username Telegram — так мы свяжемся с вами`,!1):(b.checkout.error=``,!0)}function z(e){return a.find(t=>t.id===e)?.label||e}function B(e){let t=[];return t.push(`Заказ «${i.name}»`),t.push(`Дата: ${new Date(e.createdAt).toLocaleString(`ru-RU`)}`),t.push(`Город: ${i.city}`),t.push(``),t.push(`Товары:`),e.items.forEach((e,n)=>{let r=[];e.material&&r.push(e.material),e.color&&r.push(e.color),e.size&&r.push(e.size),e.stlName&&r.push(`файл: ${e.stlName}`);let i=r.length?` (${r.join(`, `)})`:``,a=e.comment?` — ${e.comment}`:``;t.push(`${n+1}. ${e.name} × ${e.qty} — ${k(e.price*e.qty)}${i}${a}`)}),t.push(``),t.push(`Итого: ${k(e.totalRub)}`),t.push(`Оплата: ${z(e.checkout.payment)}`),e.checkout.name&&t.push(`Имя: ${e.checkout.name}`),e.checkout.phone&&t.push(`Телефон: ${e.checkout.phone}`),e.checkout.telegram&&t.push(`Telegram: ${e.checkout.telegram}`),e.checkout.comment&&t.push(`Комментарий: ${e.checkout.comment}`),t.push(``),e.checkout.payment===`sbp`?t.push(i.sbpHint):t.push(`Оплата наличными при встрече / самовывозе.`),t.join(`
`)}function V(e){let t=(i.telegramUsername||``).replace(/^@/,``).trim();if(!t)return null;let n=`https://t.me/${t}`;return e?`${n}?text=${encodeURIComponent(e)}`:n}function H(e){try{let t=JSON.parse(localStorage.getItem(y)||`[]`);t.unshift(e),localStorage.setItem(y,JSON.stringify(t.slice(0,30)))}catch{}}async function U(e){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.left=`-9999px`,document.body.appendChild(t),t.select();let n=document.execCommand(`copy`);return document.body.removeChild(t),n}catch{return!1}}async function W(e){let t=(i.orderWebhookUrl||``).trim();if(!t)return{sent:!1,skipped:!0};let n=(i.orderWebhookSecret||``).trim(),r=t;n&&(r=`${t}${t.includes(`?`)?`&`:`?`}key=${encodeURIComponent(n)}`);let a=(e.checkout.telegram||``).replace(/^@/,``).trim(),o={name:e.checkout.name||``,phone:e.checkout.phone||``,username:a,payment:e.checkout.payment||`sbp`,comment:e.checkout.comment||``,items:e.items,total:e.totalRub,createdAt:e.createdAt},s=await fetch(r,{method:`POST`,headers:{"Content-Type":`text/plain;charset=utf-8`},body:JSON.stringify(o)}),c=null;try{c=await s.json()}catch{}if(!s.ok||!c||c.ok!==!0){let e=c&&c.error||`http_${s.status}`;throw Error(e)}return{sent:!0,telegram:!!c.telegram}}async function G(){if(b.checkout.submitting||!b.cart.length)return;if(!R()){h(`light`),Q();let e=document.getElementById(`co-error`);e&&e.scrollIntoView({behavior:`smooth`,block:`center`});return}let e=g(),t=b.checkout.telegram.trim(),n={createdAt:new Date().toISOString(),shop:i.name,city:i.city,user:e?{id:e.id,username:e.username,first_name:e.first_name,last_name:e.last_name}:null,checkout:{name:b.checkout.name,phone:b.checkout.phone,telegram:t,payment:b.checkout.payment,comment:b.checkout.comment},items:b.cart.map(e=>({...e})),totalRub:O(),note:`Заказ без онлайн-оплаты. Свяжемся для подтверждения. СБП — реквизиты в чат; наличные — при встрече.`,webhookOk:!1};n.text=B(n),b.checkout.submitting=!0,b.checkout.error=``,Q();try{n.webhookOk=!!(await W(n)).sent}catch(e){console.warn(`Order webhook failed, fallback to copy/Telegram`,e),n.webhookOk=!1}b.lastOrder=n,H(n),console.log(`ORDER JSON:`,JSON.stringify(n,null,2)),b.cart=[],E(),b.checkout.submitting=!1,b.checkout.error=``,h(`heavy`),A(`success`,{resetHistory:!0})}function K(){b.screen===`home`?ee():m(()=>j())}function q(){let e=b.screen===`cart`&&b.cart.length>0,t=document.getElementById(`bottom-bar`);if(e){let e=f(b.checkout.submitting?`Отправка…`:`Оформить заказ · ${k(O())}`,()=>G());t&&t.classList.toggle(`hidden`,!!e)}else p(),t&&t.classList.add(`hidden`)}function J(){return`<span class="brand-mark" aria-hidden="true">
    <img src="/logo-buber-256.jpg" alt="" width="40" height="40" />
  </span>`}function Y(e,{back:t,cart:n,brand:r}={}){let i=r?`<div class="brand">${J()}<h1 class="brand-title">${e}</h1></div>`:`<h1>${e}</h1>`,a=S(),o=a===`dark`?`☀️`:`🌙`,s=a===`dark`?`Светлая тема`:`Тёмная тема`;return`
    <header class="header">
      ${t?`<button class="btn-icon" data-action="back" aria-label="Назад">←</button>`:`<span class="btn-icon" style="visibility:hidden">·</span>`}
      ${i}
      <button class="btn-icon btn-theme" data-action="toggle-theme" aria-label="${s}" title="${s}">${o}</button>
      ${n===!1?`<span class="btn-icon" style="visibility:hidden">·</span>`:`<button class="btn-icon" data-action="cart" aria-label="Корзина">
              🛒
              ${D()?`<span class="badge">${D()}</span>`:``}
            </button>`}
    </header>
    <div class="demo-banner">Демо-каталог · Москва · цены-заглушки</div>
  `}function X(){let t=e.map(e=>`
    <article class="card" data-action="open-product" data-id="${e.id}">
      <div class="card-img" style="background:${e.color}33">${e.emoji}</div>
      <div class="card-body">
        <h3>${Z(e.name)}</h3>
        <div class="price">${k(e.price)}</div>
        <p class="short">${Z(e.short)}</p>
      </div>
    </article>
  `).join(``);return`
    ${Y(`Бубер 3D`,{brand:!0})}
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
  `}function re(){let t=e.find(e=>e.id===b.productId);return t?`
    ${Y(t.name,{back:!0})}
    <div class="screen">
      <div class="detail-img" style="background:${t.color}44">${t.emoji}</div>
      <div class="detail-price">${k(t.price)}</div>
      <div class="detail-meta">
        <span class="chip">Материал: ${Z(t.material)}</span>
        <span class="chip">Москва</span>
      </div>
      <p class="detail-desc">${Z(t.desc)}</p>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="add-product" data-id="${t.id}">В корзину</button>
      </div>
      <button class="btn btn-secondary" data-action="custom">Или свой вариант →</button>
    </div>
  `:X()}function ie(){let e=b.custom,i=t.map(t=>`<option value="${t}" ${t===e.material?`selected`:``}>${t}</option>`).join(``),a=r.map(t=>`<option value="${Z(t)}" ${t===e.size?`selected`:``}>${Z(t)}</option>`).join(``),o=n.map(t=>`
    <button type="button" class="color-swatch ${t.id===e.colorId?`selected`:``}"
      data-action="pick-color" data-id="${t.id}"
      title="${Z(t.name)}"
      style="background:${t.hex}"></button>
  `).join(``),s=P(e);return`
    ${Y(`Свой вариант`,{back:!0})}
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
          ${e.stlName?`📎 ${Z(e.stlName)}`:`Нажмите, чтобы выбрать .stl / .obj / .3mf`}
          <input type="file" id="f-stl" accept=".stl,.obj,.3mf,model/*" />
        </label>
      </div>

      <div class="form-group">
        <label>Комментарий</label>
        <textarea id="f-comment" placeholder="Допуски, отверстия, срочность…">${Z(e.comment)}</textarea>
      </div>

      <p style="margin-bottom:12px;font-weight:600">
        Оценка: <span style="color:var(--tg-link)">${k(s)}</span>
        <span style="color:var(--tg-hint);font-weight:400;font-size:0.85rem"> × ${e.qty}</span>
      </p>

      <button class="btn btn-primary" data-action="add-custom">Добавить в корзину</button>
      <button class="btn btn-secondary" data-action="home">К каталогу</button>
    </div>
  `}function ae(){if(!b.cart.length)return`
      ${Y(`Корзина`,{back:!0})}
      <div class="screen">
        <div class="cart-empty">
          <div class="emoji">🛒</div>
          <p>Корзина пуста</p>
          <button class="btn btn-primary" style="margin-top:20px" data-action="home">В каталог</button>
        </div>
      </div>
    `;let e=b.cart.map(e=>{let t=[];return e.material&&t.push(e.material),e.color&&t.push(e.color),e.size&&t.push(e.size),e.stlName&&t.push(`файл: ${e.stlName}`),e.comment&&t.push(e.comment),`
      <div class="cart-item">
        <div class="thumb" style="background:${e.productColor||`#444`}44">${e.emoji||`📦`}</div>
        <div class="info">
          <h4>${Z(e.name)} × ${e.qty}</h4>
          <div class="meta">${Z(t.join(` · `)||`—`)}</div>
          <div class="line-price">${k(e.price*e.qty)}</div>
        </div>
        <button class="remove" data-action="remove" data-id="${e.id}" aria-label="Удалить">✕</button>
      </div>`}).join(``),t=b.checkout,n=a.map(e=>`
    <label class="pay-option ${t.payment===e.id?`selected`:``}">
      <input type="radio" name="co-payment" value="${e.id}" ${t.payment===e.id?`checked`:``} data-action="pick-payment" />
      <span class="pay-option-body">
        <span class="pay-option-title">${Z(e.label)}</span>
        <span class="pay-option-hint">${Z(e.hint)}</span>
      </span>
    </label>`).join(``),r=t.payment===`sbp`?`<p class="checkout-note">${Z(i.sbpHint)}</p>`:`<p class="checkout-note">Оплата наличными при встрече или самовывозе в ${Z(i.city)}.</p>`,o=t.error?`<p class="form-error" id="co-error">${Z(t.error)}</p>`:`<div id="co-error"></div>`;return`
    ${Y(`Корзина`,{back:!0})}
    <div class="screen">
      ${e}
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${k(O())}</span>
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
          <input type="text" id="co-name" autocomplete="name" placeholder="Как к вам обращаться" value="${Z(t.name)}" />
        </div>

        <div class="form-group">
          <label for="co-phone">Телефон</label>
          <input type="tel" id="co-phone" autocomplete="tel" inputmode="tel" placeholder="+7 …" value="${Z(t.phone)}" />
        </div>

        <div class="form-group">
          <label for="co-telegram">Telegram @username</label>
          <input type="text" id="co-telegram" autocomplete="username" placeholder="@username" value="${Z(t.telegram)}" />
        </div>
        <p class="field-hint">Нужен хотя бы один контакт: телефон или @username.</p>

        <div class="form-group">
          <label>Способ оплаты</label>
          <div class="pay-list">${n}</div>
        </div>
        ${r}

        <div class="form-group">
          <label for="co-comment">Комментарий к доставке / встрече <span class="opt">(необязательно)</span></label>
          <textarea id="co-comment" placeholder="Район, метро, удобное время, самовывоз…">${Z(t.comment)}</textarea>
        </div>

        ${o}

        <button class="btn btn-primary" data-action="checkout" ${b.checkout.submitting?`disabled`:``}>${b.checkout.submitting?`Отправка…`:`Оформить заказ · ${k(O())}`}</button>
        <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
      </section>
    </div>
  `}function oe(){let e=b.lastOrder,t=e?.text||``,n=V(t),r=e?.checkout?.payment===`cash`?`Оплата наличными при встрече или самовывозе.`:i.sbpHint,a=n?`<a class="btn btn-primary" href="${Z(n)}" target="_blank" rel="noopener">Написать нам в Telegram</a>
       <button class="btn btn-secondary" data-action="copy-order">Скопировать заказ</button>`:`<p class="checkout-note">Заказ сохранён на этом устройстве. Скопируйте текст и пришлите его в наш Telegram-бот или чат.</p>
       <button class="btn btn-primary" data-action="copy-order">Скопировать заказ</button>`;return`
    ${Y(`Готово`,{back:!0,cart:!1})}
    <div class="screen">
      <div class="success">
        <div class="emoji">✅</div>
        <h2>Заказ оформлен</h2>
        <p>${e?.webhookOk?`Заказ отправлен. Мы свяжемся с вами для подтверждения. `:(i.orderWebhookUrl||``).trim()?`Не удалось отправить автоматически — скопируйте заказ или напишите нам в Telegram. `:`Мы свяжемся с вами для подтверждения. `}${Z(r)}</p>
        <div class="order-summary" id="order-summary">${Z(t)}</div>
        <p class="copy-status" id="copy-status" hidden></p>
        ${a}
        <button class="btn btn-secondary" data-action="home">В каталог</button>
      </div>
    </div>
  `}function Z(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Q(){let e;switch(b.screen){case`product`:e=re();break;case`custom`:e=ie();break;case`cart`:e=ae();break;case`success`:e=oe();break;default:e=X()}e+=`
    <div id="bottom-bar" class="bottom-bar hidden">
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
    </div>
  `,x.innerHTML=e,se(),K(),q()}function $(){let e=document.getElementById(`f-material`),t=document.getElementById(`f-size`),n=document.getElementById(`f-comment`);e&&(b.custom.material=e.value),t&&(b.custom.size=t.value),n&&(b.custom.comment=n.value)}function se(){x.querySelectorAll(`[data-action]`).forEach(t=>{t.addEventListener(`click`,n=>{let r=t.getAttribute(`data-action`),i=t.getAttribute(`data-id`);if(r===`back`){j();return}if(r===`toggle-theme`){te(),b.screen===`custom`&&$(),b.screen===`cart`&&L(),Q();return}if(r===`home`)return A(`home`);if(r===`cart`)return A(`cart`);if(r===`custom`)return A(`custom`);if(r===`open-product`)return A(`product`,{productId:i});if(r===`add-product`){let t=e.find(e=>e.id===i);t&&(ne(t,1),A(`cart`));return}if(r===`pick-color`){$(),b.custom.colorId=i,Q();return}if(r===`qty-minus`){$(),b.custom.qty=Math.max(1,b.custom.qty-1),Q();return}if(r===`qty-plus`){$(),b.custom.qty=Math.min(99,b.custom.qty+1),Q();return}if(r===`add-custom`){$(),N(),A(`cart`);return}if(r===`remove`){F(i);return}if(r===`pick-payment`){L(),b.checkout.payment=t.getAttribute(`value`)||b.checkout.payment,b.checkout.error=``,Q();return}if(r===`checkout`){G();return}if(r===`copy-order`){U(b.lastOrder?.text||``).then(e=>{let t=document.getElementById(`copy-status`);t&&(t.hidden=!1,t.textContent=e?`Скопировано — вставьте в чат с нами`:`Не удалось скопировать — выделите текст вручную`),h(e?`medium`:`light`)});return}})}),[`co-name`,`co-phone`,`co-telegram`,`co-comment`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`input`,()=>{if(L(),b.checkout.error){let e=b.checkout.phone,t=b.checkout.telegram.replace(/^@/,``).trim();if(e||t){b.checkout.error=``;let e=document.getElementById(`co-error`);e&&(e.textContent=``)}}})});let t=document.getElementById(`f-stl`);t&&t.addEventListener(`change`,()=>{$();let e=t.files?.[0];b.custom.stlName=e?e.name:``,Q()}),[`f-material`,`f-size`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`change`,()=>{$(),Q()})})}I(),Q(),w?console.info(`Telegram WebApp ready`,{version:w.version,platform:w.platform}):console.info(`Running outside Telegram — MainButton fallback available on cart.`);