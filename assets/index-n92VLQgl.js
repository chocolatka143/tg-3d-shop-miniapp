(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`p1`,name:`Кастомный брелок`,price:350,short:`Небольшой брелок по вашему STL или эскизу`,desc:`Печать брелка до 5 см. PLA/PETG, выбор цвета. Идеально для подарков и мерча.`,color:`#e74c3c`,emoji:`🔑`,material:`PLA`,category:`accessories`},{id:`p2`,name:`Фигурка 10 см`,price:1200,short:`Детализированная фигурка высотой до 10 см`,desc:`Печать фигурки с поддержками. Материал PLA или PETG. Возможна покраска отдельно.`,color:`#3498db`,emoji:`🧍`,material:`PLA`,category:`figures`},{id:`p3`,name:`Корпус для электроники`,price:890,short:`Корпус / бокс под плату или датчик`,desc:`Прочный PETG-корпус. Укажите размеры отверстий в комментарии или приложите STL.`,color:`#2ecc71`,emoji:`📦`,material:`PETG`,category:`parts`},{id:`p4`,name:`Ваза / кашпо`,price:1500,short:`Декоративная ваза или кашпо`,desc:`Ваза высотой до 20 см. PLA матовый или глянец. Водонепроницаемость — по запросу.`,color:`#9b59b6`,emoji:`🪴`,material:`PLA`,category:`decor`},{id:`p5`,name:`Прототип детали`,price:2e3,short:`Инженерный прототип по чертежу / STL`,desc:`Точная печать прототипа. PETG или ABS. Обсудим допуски после заказа.`,color:`#f39c12`,emoji:`⚙️`,material:`PETG`,category:`parts`},{id:`p-filament`,name:`Филамент`,price:1800,short:`Катушка PLA или PETG, цвет на выбор`,desc:`Катушка филамента PLA или PETG для 3D-печати. Выберите материал и цвет при заказе.`,color:`#ff8a1f`,emoji:`🧵`,material:`PLA`,category:`filament`}],t=[{id:`all`,label:`Все`},{id:`filament`,label:`Филамент`},{id:`figures`,label:`Фигурки`},{id:`faq`,label:`FAQ`},{id:`portfolio`,label:`Портфолио`},{id:`reviews`,label:`Отзывы`}],n=[{q:`Как заказать?`,a:`Выберите товар в каталоге или нажмите «Свой вариант», заполните параметры и оформите заказ в корзине. Мы свяжемся для подтверждения.`},{q:`Как оплатить?`,a:`СБП — перевод по реквизитам после подтверждения заказа. Наличные — при встрече или самовывозе в Москве.`},{q:`Свой STL / кастом`,a:`Через «Свой вариант»: материал, цвет, размер и файл .stl / .obj / .3mf. Оценим и уточним цену в чате.`},{q:`Связаться с нами`,a:`Telegram: @bubershop3d — напишите по заказу, срокам или вопросам.`}],r=[{emoji:`🔑`,title:`Брелки и мерч`,note:`Скоро фото`},{emoji:`🧍`,title:`Фигурки`,note:`Скоро фото`},{emoji:`🪴`,title:`Декор`,note:`Скоро фото`},{emoji:`⚙️`,title:`Прототипы`,note:`Скоро фото`}],i=[{name:`Алексей`,text:`Заказал брелок — качество супер, ответили быстро.`,stars:5},{name:`Мария`,text:`Печать по моему STL, всё совпало с размерами.`,stars:5},{name:`Игорь`,text:`Удобно оформить в Mini App, жду ещё работы в портфолио :)`,stars:4}],a=[`PLA`,`PETG`,`ABS`,`TPU`,`Другой`],o=[{id:`white`,name:`Белый`,hex:`#f5f5f5`},{id:`black`,name:`Чёрный`,hex:`#222`},{id:`red`,name:`Красный`,hex:`#e74c3c`},{id:`blue`,name:`Синий`,hex:`#3498db`},{id:`green`,name:`Зелёный`,hex:`#2ecc71`},{id:`yellow`,name:`Жёлтый`,hex:`#f1c40f`},{id:`orange`,name:`Оранжевый`,hex:`#e67e22`},{id:`purple`,name:`Фиолетовый`,hex:`#9b59b6`},{id:`custom`,name:`Другой`,hex:`linear-gradient(135deg,#e74c3c,#3498db,#2ecc71)`}],s=[`S (до 5 см)`,`M (5–15 см)`,`L (15–25 см)`,`XL (25+ см)`,`Свой размер`],c={name:`Бубер 3D`,city:`Москва`,telegramUsername:`bubershop3d`,sbpHint:`Реквизиты СБП пришлём в чат после подтверждения заказа`,orderWebhookUrl:``,orderWebhookSecret:``},l=[{id:`sbp`,label:`СБП`,hint:`Перевод по реквизитам после подтверждения заказа`},{id:`cash`,label:`Наличные`,hint:`Оплата при встрече или самовывозе`}],u=typeof window<`u`?window.Telegram?.WebApp:null,d=null,f=null,p={light:`#f7f5f2`,dark:`#0a0a0a`};function m(e=`light`){if(!u)return;let t=p[e]||p.light;if(u.setHeaderColor)try{u.setHeaderColor(t)}catch{try{u.setHeaderColor(`bg_color`)}catch{}}if(u.setBackgroundColor)try{u.setBackgroundColor(t)}catch{}if(u.MainButton?.setParams)try{u.MainButton.setParams({color:`#ff8a1f`,text_color:`#ffffff`})}catch{}}function ee(e=`light`){if(!u)return null;try{u.ready(),u.expand(),m(e)}catch(e){console.warn(`Telegram init:`,e)}return u}function te(e,t){if(!u?.MainButton)return!1;if(d&&u.MainButton.offClick)try{u.MainButton.offClick(d)}catch{}return d=t,u.MainButton.setText(e),u.MainButton.onClick(d),u.MainButton.show(),u.MainButton.enable(),!0}function ne(){if(u?.MainButton){if(d&&u.MainButton.offClick)try{u.MainButton.offClick(d)}catch{}d=null,u.MainButton.hide()}}function h(e){if(!u?.BackButton)return!1;if(f&&u.BackButton.offClick)try{u.BackButton.offClick(f)}catch{}return f=e,u.BackButton.onClick(f),u.BackButton.show(),!0}function re(){if(u?.BackButton){if(f&&u.BackButton.offClick)try{u.BackButton.offClick(f)}catch{}f=null,u.BackButton.hide()}}function g(e=`light`){try{u?.HapticFeedback?.impactOccurred?.(e)}catch{}}function _(){return u?.initDataUnsafe?.user||null}var v=`tg3d_cart_v1`,ie=`buber-theme`,y=`tg3d_orders_v1`,b={screen:`home`,productId:null,homeTab:`all`,history:[],cart:oe(),lastOrder:null,checkout:{name:``,phone:``,telegram:``,payment:`sbp`,comment:``,error:``,submitting:!1},custom:{material:a[0],colorId:o[0].id,size:s[1],qty:1,stlName:``,comment:``}},x=document.getElementById(`app`);function S(){return document.documentElement.getAttribute(`data-theme`)===`dark`?`dark`:`light`}function C(e){let t=e===`dark`?`dark`:`light`;document.documentElement.setAttribute(`data-theme`,t);try{localStorage.setItem(ie,t)}catch{}let n=document.querySelector(`meta[name="theme-color"]`);n&&n.setAttribute(`content`,t===`dark`?`#0a0a0a`:`#f7f5f2`),m(t)}function ae(){C(S()===`dark`?`light`:`dark`),g(`light`)}C(S());var w=ee(S());function oe(){try{return JSON.parse(localStorage.getItem(v)||`[]`)}catch{return[]}}function T(){localStorage.setItem(v,JSON.stringify(b.cart))}function E(){return b.cart.reduce((e,t)=>e+t.qty,0)}function D(){return b.cart.reduce((e,t)=>e+t.price*t.qty,0)}function O(e){return new Intl.NumberFormat(`ru-RU`,{style:`currency`,currency:`RUB`,maximumFractionDigits:0}).format(e)}function k(e,t={}){let n={screen:b.screen,productId:b.productId};t.resetHistory||e===`home`?b.history=[]:e!==b.screen&&b.history.push(n),b.screen=e,e===`home`&&(b.productId=null),t.productId!==void 0&&(b.productId=t.productId),g(`light`),Q()}function A(){let e=b.history.pop();e?(b.screen=e.screen,b.productId=e.productId??null):(b.screen=`home`,b.productId=null),g(`light`),Q()}function j(){return`c_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function se(e,t=1){let n=b.cart.find(t=>t.type===`product`&&t.productId===e.id);n?n.qty+=t:b.cart.push({type:`product`,id:j(),productId:e.id,name:e.name,price:e.price,qty:t,emoji:e.emoji,productColor:e.color,material:e.material}),T(),g(`medium`)}function ce(){let e=b.custom,t=o.find(t=>t.id===e.colorId)||o[0],n=M(e);b.cart.push({type:`custom`,id:j(),name:`Свой вариант`,price:n,qty:e.qty,emoji:`✨`,productColor:typeof t.hex==`string`&&t.hex.startsWith(`#`)?t.hex:`#6c9eff`,material:e.material,color:t.name,size:e.size,stlName:e.stlName||``,comment:e.comment||``}),T(),g(`medium`),b.custom={material:a[0],colorId:o[0].id,size:s[1],qty:1,stlName:``,comment:``}}function M(e){let t={[s[0]]:400,[s[1]]:900,[s[2]]:1800,[s[3]]:3500,[s[4]]:1500},n={PLA:1,PETG:1.15,ABS:1.25,TPU:1.4,Другой:1.2},r=t[e.size]??900;return Math.round(r*(n[e.material]||1))}function N(e){b.cart=b.cart.filter(t=>t.id!==e),T(),g(`light`),Q()}function P(){let e=_();if(e&&(!b.checkout.telegram&&e.username&&(b.checkout.telegram=`@`+e.username),!b.checkout.name&&e.first_name)){let t=[e.first_name,e.last_name].filter(Boolean);b.checkout.name=t.join(` `)}}function F(){let e=document.getElementById(`co-name`),t=document.getElementById(`co-phone`),n=document.getElementById(`co-telegram`),r=document.getElementById(`co-comment`),i=document.querySelector(`input[name="co-payment"]:checked`);e&&(b.checkout.name=e.value.trim()),t&&(b.checkout.phone=t.value.trim()),n&&(b.checkout.telegram=n.value.trim()),r&&(b.checkout.comment=r.value.trim()),i&&(b.checkout.payment=i.value)}function I(){F();let e=b.checkout.phone,t=b.checkout.telegram.replace(/^@/,``).trim();return!e&&!t?(b.checkout.error=`Укажите телефон или @username Telegram — так мы свяжемся с вами`,!1):(b.checkout.error=``,!0)}function L(e){return l.find(t=>t.id===e)?.label||e}function R(e){let t=[];return t.push(`Заказ «${c.name}»`),t.push(`Дата: ${new Date(e.createdAt).toLocaleString(`ru-RU`)}`),t.push(`Город: ${c.city}`),t.push(``),t.push(`Товары:`),e.items.forEach((e,n)=>{let r=[];e.material&&r.push(e.material),e.color&&r.push(e.color),e.size&&r.push(e.size),e.stlName&&r.push(`файл: ${e.stlName}`);let i=r.length?` (${r.join(`, `)})`:``,a=e.comment?` — ${e.comment}`:``;t.push(`${n+1}. ${e.name} × ${e.qty} — ${O(e.price*e.qty)}${i}${a}`)}),t.push(``),t.push(`Итого: ${O(e.totalRub)}`),t.push(`Оплата: ${L(e.checkout.payment)}`),e.checkout.name&&t.push(`Имя: ${e.checkout.name}`),e.checkout.phone&&t.push(`Телефон: ${e.checkout.phone}`),e.checkout.telegram&&t.push(`Telegram: ${e.checkout.telegram}`),e.checkout.comment&&t.push(`Комментарий: ${e.checkout.comment}`),t.push(``),e.checkout.payment===`sbp`?t.push(c.sbpHint):t.push(`Оплата наличными при встрече / самовывозе.`),t.join(`
`)}function z(e){let t=(c.telegramUsername||``).replace(/^@/,``).trim();if(!t)return null;let n=`https://t.me/${t}`;return e?`${n}?text=${encodeURIComponent(e)}`:n}function B(e){try{let t=JSON.parse(localStorage.getItem(y)||`[]`);t.unshift(e),localStorage.setItem(y,JSON.stringify(t.slice(0,30)))}catch{}}function V(){try{let e=JSON.parse(localStorage.getItem(y)||`[]`);return Array.isArray(e)?e:[]}catch{return[]}}function H(){return`ord_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function U(e){return e||`Новый`}async function W(e){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.left=`-9999px`,document.body.appendChild(t),t.select();let n=document.execCommand(`copy`);return document.body.removeChild(t),n}catch{return!1}}async function le(e){let t=(c.orderWebhookUrl||``).trim();if(!t)return{sent:!1,skipped:!0};let n=(c.orderWebhookSecret||``).trim(),r=t;n&&(r=`${t}${t.includes(`?`)?`&`:`?`}key=${encodeURIComponent(n)}`);let i=(e.checkout.telegram||``).replace(/^@/,``).trim(),a=e.telegramUserId??e.user?.id??_()?.id??``,o={order_id:e.id||``,telegram_user_id:a,name:e.checkout.name||``,phone:e.checkout.phone||``,username:i,payment:e.checkout.payment||`sbp`,comment:e.checkout.comment||``,items:e.items,total:e.totalRub,createdAt:e.createdAt},s=await fetch(r,{method:`POST`,headers:{"Content-Type":`text/plain;charset=utf-8`},body:JSON.stringify(o)}),l=null;try{l=await s.json()}catch{}if(!s.ok||!l||l.ok!==!0){let e=l&&l.error||`http_${s.status}`;throw Error(e)}return{sent:!0,telegram:!!l.telegram}}async function G(){if(b.checkout.submitting||!b.cart.length)return;if(!I()){g(`light`),Q();let e=document.getElementById(`co-error`);e&&e.scrollIntoView({behavior:`smooth`,block:`center`});return}let e=_(),t=b.checkout.telegram.trim(),n={id:H(),status:`Новый`,createdAt:new Date().toISOString(),shop:c.name,city:c.city,telegramUserId:e?.id??null,user:e?{id:e.id,username:e.username,first_name:e.first_name,last_name:e.last_name}:null,checkout:{name:b.checkout.name,phone:b.checkout.phone,telegram:t,payment:b.checkout.payment,comment:b.checkout.comment},items:b.cart.map(e=>({...e})),totalRub:D(),note:`Заказ без онлайн-оплаты. Свяжемся для подтверждения. СБП — реквизиты в чат; наличные — при встрече.`,webhookOk:!1};n.text=R(n),b.checkout.submitting=!0,b.checkout.error=``,Q();try{n.webhookOk=!!(await le(n)).sent}catch(e){console.warn(`Order webhook failed, fallback to copy/Telegram`,e),n.webhookOk=!1}b.lastOrder=n,B(n),console.log(`ORDER JSON:`,JSON.stringify(n,null,2)),b.cart=[],T(),b.checkout.submitting=!1,b.checkout.error=``,g(`heavy`),k(`success`,{resetHistory:!0})}function ue(){b.screen===`home`?re():h(()=>A())}function de(){let e=b.screen===`cart`&&b.cart.length>0,t=document.getElementById(`bottom-bar`);if(e){let e=te(b.checkout.submitting?`Отправка…`:`Оформить заказ · ${O(D())}`,()=>G());t&&t.classList.toggle(`hidden`,!!e)}else ne(),t&&t.classList.add(`hidden`)}function fe(){return`<span class="brand-mark" aria-hidden="true">
    <img src="/logo-buber-256.jpg" alt="" width="40" height="40" />
  </span>`}function K(e,{back:t,cart:n,brand:r}={}){let i=r?`<div class="brand">${fe()}<h1 class="brand-title">${e}</h1></div>`:`<h1>${e}</h1>`,a=S(),o=a===`dark`?`☀️`:`🌙`,s=a===`dark`?`Светлая тема`:`Тёмная тема`;return`
    <header class="header">
      ${t?`<button class="btn-icon" data-action="back" aria-label="Назад">←</button>`:`<span class="btn-icon" style="visibility:hidden">·</span>`}
      ${i}
      <button class="btn-icon btn-theme" data-action="toggle-theme" aria-label="${s}" title="${s}">${o}</button>
      <button class="btn-icon" data-action="orders" aria-label="Мои заказы" title="Мои заказы">📋</button>
      ${n===!1?`<span class="btn-icon" style="visibility:hidden">·</span>`:`<button class="btn-icon" data-action="cart" aria-label="Корзина">
              🛒
              ${E()?`<span class="badge">${E()}</span>`:``}
            </button>`}
    </header>
    <div class="demo-banner">Демо-каталог · Москва · цены-заглушки</div>
  `}function q(t){return t===`filament`?e.filter(e=>e.category===`filament`||e.id===`p-filament`):e}function J(e){return e.length?`<div class="grid">${e.map(e=>`
    <article class="card" data-action="open-product" data-id="${e.id}">
      <div class="card-img" style="background:${e.color}33">${e.emoji}</div>
      <div class="card-body">
        <h3>${Z(e.name)}</h3>
        <div class="price">${O(e.price)}</div>
        <p class="short">${Z(e.short)}</p>
      </div>
    </article>`).join(``)}</div>`:`<div class="tab-empty"><div class="emoji">📭</div><p>Пока нет товаров в этой категории</p></div>`}function pe(){return`<nav class="tabs-bar" role="tablist" aria-label="Разделы">${t.map(e=>`
    <button type="button" class="tab-chip ${b.homeTab===e.id?`active`:``}"
      data-action="home-tab" data-id="${e.id}" role="tab"
      aria-selected="${b.homeTab===e.id?`true`:`false`}">${Z(e.label)}</button>`).join(``)}</nav>`}function me(){let t=b.homeTab;if(t===`all`)return`
      <h3 class="section-title">Каталог</h3>
      ${J(q(`all`))}`;if(t===`filament`)return`
      <h3 class="section-title">Филамент</h3>
      ${J(q(`filament`))}`;if(t===`figures`)return`
      <div class="placeholder-panel">
        <div class="emoji">🧍</div>
        <h3>Фигурки</h3>
        <p class="placeholder-badge">В разработке</p>
        <p>Скоро здесь появятся готовые фигурки. Пока можно заказать через «Свой вариант».</p>
        <button class="btn btn-primary" data-action="custom">✨ Свой вариант</button>
      </div>`;if(t===`faq`){let e=n.map(e=>`
      <details class="faq-item">
        <summary>${Z(e.q)}</summary>
        <p>${Z(e.a)}</p>
      </details>`).join(``),t=(c.telegramUsername||``).replace(/^@/,``);return`
      <h3 class="section-title">Как заказать</h3>
      <div class="faq-list">${e}</div>
      ${t?`<a class="btn btn-primary" href="https://t.me/${Z(t)}" target="_blank" rel="noopener">Написать @${Z(t)}</a>`:``}
      <button class="btn btn-secondary" data-action="custom">Свой вариант →</button>`}return t===`portfolio`?`
      <h3 class="section-title">Портфолио</h3>
      <p class="tab-lead">Примеры работ появятся здесь. Пока — заглушки.</p>
      <div class="portfolio-grid">${r.map(e=>`
      <article class="portfolio-card">
        <div class="portfolio-img">${e.emoji}</div>
        <h4>${Z(e.title)}</h4>
        <span class="placeholder-badge">${Z(e.note)}</span>
      </article>`).join(``)}</div>
      <p class="tab-soon">Скоро</p>`:t===`reviews`?`
      <h3 class="section-title">Отзывы</h3>
      <p class="tab-lead">Демо-отзывы. Реальные появятся после заказов.</p>
      <div class="reviews-list">${i.map(e=>`
      <article class="review-card">
        <div class="review-top">
          <strong>${Z(e.name)}</strong>
          <span class="review-stars">${`★`.repeat(e.stars)}${`☆`.repeat(Math.max(0,5-e.stars))}</span>
        </div>
        <p>${Z(e.text)}</p>
      </article>`).join(``)}</div>`:J(e)}function Y(){return`
    ${K(`Бубер 3D`,{brand:!0})}
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
      ${pe()}
      <div class="tab-panel" role="tabpanel">${me()}</div>
    </div>
  `}function he(){let t=e.find(e=>e.id===b.productId);return t?`
    ${K(t.name,{back:!0})}
    <div class="screen">
      <div class="detail-img" style="background:${t.color}44">${t.emoji}</div>
      <div class="detail-price">${O(t.price)}</div>
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
  `:Y()}function ge(){let e=b.custom,t=a.map(t=>`<option value="${t}" ${t===e.material?`selected`:``}>${t}</option>`).join(``),n=s.map(t=>`<option value="${Z(t)}" ${t===e.size?`selected`:``}>${Z(t)}</option>`).join(``),r=o.map(t=>`
    <button type="button" class="color-swatch ${t.id===e.colorId?`selected`:``}"
      data-action="pick-color" data-id="${t.id}"
      title="${Z(t.name)}"
      style="background:${t.hex}"></button>
  `).join(``),i=M(e);return`
    ${K(`Свой вариант`,{back:!0})}
    <div class="screen">
      <p style="color:var(--tg-hint);font-size:0.9rem;margin-bottom:16px">
        Опишите заказ. Оценка цены ориентировочная — уточним после просмотра STL.
      </p>

      <div class="form-group">
        <label>Материал</label>
        <select id="f-material">${t}</select>
      </div>

      <div class="form-group">
        <label>Цвет</label>
        <div class="color-row">${r}</div>
      </div>

      <div class="form-group">
        <label>Размер</label>
        <select id="f-size">${n}</select>
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
        Оценка: <span style="color:var(--tg-link)">${O(i)}</span>
        <span style="color:var(--tg-hint);font-weight:400;font-size:0.85rem"> × ${e.qty}</span>
      </p>

      <button class="btn btn-primary" data-action="add-custom">Добавить в корзину</button>
      <button class="btn btn-secondary" data-action="home">К каталогу</button>
    </div>
  `}function X(){if(!b.cart.length)return`
      ${K(`Корзина`,{back:!0})}
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
          <div class="line-price">${O(e.price*e.qty)}</div>
        </div>
        <button class="remove" data-action="remove" data-id="${e.id}" aria-label="Удалить">✕</button>
      </div>`}).join(``),t=b.checkout,n=l.map(e=>`
    <label class="pay-option ${t.payment===e.id?`selected`:``}">
      <input type="radio" name="co-payment" value="${e.id}" ${t.payment===e.id?`checked`:``} data-action="pick-payment" />
      <span class="pay-option-body">
        <span class="pay-option-title">${Z(e.label)}</span>
        <span class="pay-option-hint">${Z(e.hint)}</span>
      </span>
    </label>`).join(``),r=t.payment===`sbp`?`<p class="checkout-note">${Z(c.sbpHint)}</p>`:`<p class="checkout-note">Оплата наличными при встрече или самовывозе в ${Z(c.city)}.</p>`,i=t.error?`<p class="form-error" id="co-error">${Z(t.error)}</p>`:`<div id="co-error"></div>`;return`
    ${K(`Корзина`,{back:!0})}
    <div class="screen">
      ${e}
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${O(D())}</span>
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

        ${i}

        <button class="btn btn-primary" data-action="checkout" ${b.checkout.submitting?`disabled`:``}>${b.checkout.submitting?`Отправка…`:`Оформить заказ · ${O(D())}`}</button>
        <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
      </section>
    </div>
  `}function _e(){let e=V(),t=!!(c.orderWebhookUrl||``).trim(),n;return n=e.length?`
      <p class="tab-lead">Заказы с этого устройства. Статусы с таблицы появятся после подключения webhook.</p>
      <div class="orders-list">${e.map(e=>{let t=e.id||`—`,n=U(e.status),r=e.createdAt?new Date(e.createdAt).toLocaleString(`ru-RU`):`—`,i=e.totalRub==null?e.total==null?`—`:O(e.total):O(e.totalRub),a=Array.isArray(e.items)?e.items.length:0,o=a?e.items.slice(0,2).map(e=>e.name).filter(Boolean).join(`, `)+(a>2?`…`:``):`—`;return`
      <article class="order-card">
        <div class="order-card-top">
          <strong class="order-id">${Z(t)}</strong>
          <span class="order-status">${Z(n)}</span>
        </div>
        <div class="order-meta">${Z(r)}</div>
        <div class="order-items">${Z(o)}</div>
        <div class="order-total">${Z(i)}</div>
      </article>`}).join(``)}</div>`:t?`
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Пока нет заказов</h3>
        <p>Оформите заказ в корзине — он появится здесь. Синхронизация статусов с таблицей — следующий шаг.</p>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>`:`
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Мои заказы</h3>
        <p>Заказы появятся после подключения таблицы</p>
        <p class="tab-lead" style="margin-top:8px">Пока можно оформить заказ и скопировать его в Telegram — история на устройстве появится здесь.</p>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>`,`
    ${K(`Мои заказы`,{back:!0})}
    <div class="screen">
      ${n}
    </div>
  `}function ve(){let e=b.lastOrder,t=e?.text||``,n=z(t),r=e?.checkout?.payment===`cash`?`Оплата наличными при встрече или самовывозе.`:c.sbpHint,i=n?`<a class="btn btn-primary" href="${Z(n)}" target="_blank" rel="noopener">Написать нам в Telegram</a>
       <button class="btn btn-secondary" data-action="copy-order">Скопировать заказ</button>`:`<p class="checkout-note">Заказ сохранён на этом устройстве. Скопируйте текст и пришлите его в наш Telegram-бот или чат.</p>
       <button class="btn btn-primary" data-action="copy-order">Скопировать заказ</button>`;return`
    ${K(`Готово`,{back:!0,cart:!1})}
    <div class="screen">
      <div class="success">
        <div class="emoji">✅</div>
        <h2>Заказ оформлен</h2>
        <p>${e?.webhookOk?`Заказ отправлен. Мы свяжемся с вами для подтверждения. `:(c.orderWebhookUrl||``).trim()?`Не удалось отправить автоматически — скопируйте заказ или напишите нам в Telegram. `:`Мы свяжемся с вами для подтверждения. `}${Z(r)}</p>
        <div class="order-summary" id="order-summary">${Z(t)}</div>
        <p class="copy-status" id="copy-status" hidden></p>
        ${i}
        <button class="btn btn-secondary" data-action="orders">Мои заказы</button>
        <button class="btn btn-secondary" data-action="home">В каталог</button>
      </div>
    </div>
  `}function Z(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Q(){let e;switch(b.screen){case`product`:e=he();break;case`custom`:e=ge();break;case`cart`:e=X();break;case`success`:e=ve();break;case`orders`:e=_e();break;default:e=Y()}e+=`
    <div id="bottom-bar" class="bottom-bar hidden">
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
    </div>
  `,x.innerHTML=e,ye(),ue(),de()}function $(){let e=document.getElementById(`f-material`),t=document.getElementById(`f-size`),n=document.getElementById(`f-comment`);e&&(b.custom.material=e.value),t&&(b.custom.size=t.value),n&&(b.custom.comment=n.value)}function ye(){x.querySelectorAll(`[data-action]`).forEach(t=>{t.addEventListener(`click`,n=>{let r=t.getAttribute(`data-action`),i=t.getAttribute(`data-id`);if(r===`back`){A();return}if(r===`toggle-theme`){ae(),b.screen===`custom`&&$(),b.screen===`cart`&&F(),Q();return}if(r===`home`)return k(`home`);if(r===`home-tab`){b.homeTab=i||`all`,g(`light`),Q();return}if(r===`cart`)return k(`cart`);if(r===`orders`)return k(`orders`);if(r===`custom`)return k(`custom`);if(r===`open-product`)return k(`product`,{productId:i});if(r===`add-product`){let t=e.find(e=>e.id===i);t&&(se(t,1),k(`cart`));return}if(r===`pick-color`){$(),b.custom.colorId=i,Q();return}if(r===`qty-minus`){$(),b.custom.qty=Math.max(1,b.custom.qty-1),Q();return}if(r===`qty-plus`){$(),b.custom.qty=Math.min(99,b.custom.qty+1),Q();return}if(r===`add-custom`){$(),ce(),k(`cart`);return}if(r===`remove`){N(i);return}if(r===`pick-payment`){F(),b.checkout.payment=t.getAttribute(`value`)||b.checkout.payment,b.checkout.error=``,Q();return}if(r===`checkout`){G();return}if(r===`copy-order`){W(b.lastOrder?.text||``).then(e=>{let t=document.getElementById(`copy-status`);t&&(t.hidden=!1,t.textContent=e?`Скопировано — вставьте в чат с нами`:`Не удалось скопировать — выделите текст вручную`),g(e?`medium`:`light`)});return}})}),[`co-name`,`co-phone`,`co-telegram`,`co-comment`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`input`,()=>{if(F(),b.checkout.error){let e=b.checkout.phone,t=b.checkout.telegram.replace(/^@/,``).trim();if(e||t){b.checkout.error=``;let e=document.getElementById(`co-error`);e&&(e.textContent=``)}}})});let t=document.getElementById(`f-stl`);t&&t.addEventListener(`change`,()=>{$();let e=t.files?.[0];b.custom.stlName=e?e.name:``,Q()}),[`f-material`,`f-size`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`change`,()=>{$(),Q()})})}P(),Q(),w?console.info(`Telegram WebApp ready`,{version:w.version,platform:w.platform}):console.info(`Running outside Telegram — MainButton fallback available on cart.`);