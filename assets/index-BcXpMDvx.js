(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`p1`,name:`Кастомный брелок`,price:350,short:`Небольшой брелок по вашему STL или эскизу`,desc:`Печать брелка до 5 см. PLA/PETG, выбор цвета. Идеально для подарков и мерча.`,color:`#e74c3c`,emoji:`🔑`,material:`PLA`,category:`accessories`},{id:`fig-suit`,name:`Фигурка в костюме`,price:1990,short:`Раскрашенная фигурка, печать + покраска`,desc:`3D-печать и ручная покраска. Высота ориентировочно 15–20 см. Тестовая цена — уточним при заказе.`,color:`#2c3e7a`,emoji:`🧍`,material:`PLA`,category:`figures`,image:`/assets/figures/suit-leader.jpg`},{id:`fig-67`,name:`Фигурка «67»`,price:1490,short:`Воксельный персонаж из цифр 6 и 7`,desc:`Печать в стиле блок/воксель, PLA. Тестовая цена.`,color:`#1abc9c`,emoji:`🔢`,material:`PLA`,category:`figures`,image:`/assets/figures/voxel-67.jpg`},{id:`fig-deathstar`,name:`Звезда Смерти`,price:2490,short:`Модель Death Star, серый PLA`,desc:`Сфера с суперлазером и экваториальной бороздой. Тестовая цена.`,color:`#95a5a6`,emoji:`🌑`,material:`PLA`,category:`figures`,image:`/assets/figures/death-star.jpg`},{id:`p3`,name:`Корпус для электроники`,price:890,short:`Корпус / бокс под плату или датчик`,desc:`Прочный PETG-корпус. Укажите размеры отверстий в комментарии или приложите STL.`,color:`#2ecc71`,emoji:`📦`,material:`PETG`,category:`parts`},{id:`p4`,name:`Ваза / кашпо`,price:1500,short:`Декоративная ваза или кашпо`,desc:`Ваза высотой до 20 см. PLA матовый или глянец. Водонепроницаемость — по запросу.`,color:`#9b59b6`,emoji:`🪴`,material:`PLA`,category:`decor`},{id:`p5`,name:`Прототип детали`,price:2e3,short:`Инженерный прототип по чертежу / STL`,desc:`Точная печать прототипа. PETG или ABS. Обсудим допуски после заказа.`,color:`#f39c12`,emoji:`⚙️`,material:`PETG`,category:`parts`},{id:`p-filament`,name:`Филамент`,price:1800,short:`Катушка PLA или PETG, цвет на выбор`,desc:`Катушка филамента PLA или PETG для 3D-печати. Выберите материал и цвет при заказе.`,color:`#ff8a1f`,emoji:`🧵`,material:`PLA`,category:`filament`}],t=[{id:`order-5`,label:`−5%`,result:`Скидка 5% на заказ`,weight:25,color:`#ff8a1f`,promo:{type:`order_percent`,value:5,codePrefix:`B5`}},{id:`order-7`,label:`−7%`,result:`Скидка 7% на заказ`,weight:10,color:`#ffca5c`,promo:{type:`order_percent`,value:7,codePrefix:`B7`}},{id:`delivery-5`,label:`Дст −5%`,result:`Скидка 5% на доставку`,weight:15,color:`#55c98a`,promo:{type:`delivery_percent`,value:5,codePrefix:`D5`}},{id:`delivery-7`,label:`Дст −7%`,result:`Скидка 7% на доставку`,weight:5,color:`#4db6ac`,promo:{type:`delivery_percent`,value:7,codePrefix:`D7`}},{id:`empty`,label:`Пусто`,result:`Повезёт в следующий раз`,weight:45,color:`#ef6b62`}],n=[{code:`BUBER5`,type:`order_percent`,value:5,label:`Скидка 5% на заказ`},{code:`BUBER7`,type:`order_percent`,value:7,label:`Скидка 7% на заказ`},{code:`LATEST5`,type:`order_percent`,value:5,label:`Тестовая скидка 5% на заказ`},{code:`DOST5`,type:`delivery_percent`,value:5,label:`Скидка 5% на доставку`},{code:`DOST7`,type:`delivery_percent`,value:7,label:`Скидка 7% на доставку`}],r=[{id:`all`,label:`Все`},{id:`filament`,label:`Филамент`},{id:`figures`,label:`Фигурки`},{id:`faq`,label:`FAQ`},{id:`portfolio`,label:`Портфолио`},{id:`reviews`,label:`Отзывы`},{id:`luck`,label:`🎡 Удача`}],i=[{q:`Как заказать?`,a:`Выберите товар в каталоге или нажмите «Свой вариант», заполните параметры и оформите заказ в корзине. Мы свяжемся для подтверждения.`},{q:`Как оплатить?`,a:`СБП — перевод по реквизитам после подтверждения заказа. Наличные — при встрече или самовывозе в Москве.`},{q:`Свой STL / кастом`,a:`Через «Свой вариант»: материал, цвет, размер и файл .stl / .obj / .3mf. Оценим и уточним цену в чате.`},{q:`Связаться с нами`,a:`Telegram: @bubershop3d — напишите по заказу, срокам или вопросам.`}],a=[{image:`/portfolio/modular-wall-organizer.jpg`,title:`Модульный органайзер на стену`,alt:`Модульный настенный органайзер с держателями для наушников и игрового контроллера`}],o=[{name:`Алексей`,text:`Заказал брелок — качество супер, ответили быстро.`,stars:5},{name:`Мария`,text:`Печать по моему STL, всё совпало с размерами.`,stars:5},{name:`Игорь`,text:`Удобно оформить в Mini App, жду ещё работы в портфолио :)`,stars:4}],s=[`PLA`,`PETG`,`ABS`,`TPU`,`Другой`],c=[{id:`white`,name:`Белый`,hex:`#f5f5f5`},{id:`black`,name:`Чёрный`,hex:`#222`},{id:`red`,name:`Красный`,hex:`#e74c3c`},{id:`blue`,name:`Синий`,hex:`#3498db`},{id:`green`,name:`Зелёный`,hex:`#2ecc71`},{id:`yellow`,name:`Жёлтый`,hex:`#f1c40f`},{id:`orange`,name:`Оранжевый`,hex:`#e67e22`},{id:`purple`,name:`Фиолетовый`,hex:`#9b59b6`},{id:`custom`,name:`Другой`,hex:`linear-gradient(135deg,#e74c3c,#3498db,#2ecc71)`}],l=[`S (до 5 см)`,`M (5–15 см)`,`L (15–25 см)`,`XL (25+ см)`,`Свой размер`],u={name:`Бубер 3D`,city:`Москва`,telegramUsername:`bubershop3d`,sbpHint:`Реквизиты СБП пришлём в чат после подтверждения заказа`,orderWebhookUrl:`https://script.google.com/macros/s/AKfycbzVEKwta7ZkLtA-IG8jx7nbTy9KET-61bDQwKt2FhHhm4PmXfsH7fJAlbqsk3-6gxFx/exec`},d=[{id:`sbp`,label:`СБП`,hint:`Перевод по реквизитам после подтверждения заказа`},{id:`cash`,label:`Наличные`,hint:`Оплата при встрече или самовывозе`}],f=typeof window<`u`?window.Telegram?.WebApp:null,p=null,m=null,ee={light:`#f7f5f2`,dark:`#0a0a0a`};function te(e=`light`){if(!f)return;let t=ee[e]||ee.light;if(f.setHeaderColor)try{f.setHeaderColor(t)}catch{try{f.setHeaderColor(`bg_color`)}catch{}}if(f.setBackgroundColor)try{f.setBackgroundColor(t)}catch{}if(f.MainButton?.setParams)try{f.MainButton.setParams({color:`#ff8a1f`,text_color:`#ffffff`})}catch{}}function ne(e=`light`){if(!f)return null;try{f.ready(),f.expand(),te(e)}catch(e){console.warn(`Telegram init:`,e)}return f}function re(e,t){if(!f?.MainButton)return!1;if(p&&f.MainButton.offClick)try{f.MainButton.offClick(p)}catch{}return p=t,f.MainButton.setText(e),f.MainButton.onClick(p),f.MainButton.show(),f.MainButton.enable(),!0}function ie(){if(f?.MainButton){if(p&&f.MainButton.offClick)try{f.MainButton.offClick(p)}catch{}p=null,f.MainButton.hide()}}function ae(e){if(!f?.BackButton)return!1;if(m&&f.BackButton.offClick)try{f.BackButton.offClick(m)}catch{}return m=e,f.BackButton.onClick(m),f.BackButton.show(),!0}function oe(){if(f?.BackButton){if(m&&f.BackButton.offClick)try{f.BackButton.offClick(m)}catch{}m=null,f.BackButton.hide()}}function h(e=`light`){try{f?.HapticFeedback?.impactOccurred?.(e)}catch{}}function g(){return f?.initDataUnsafe?.user||null}function se(){let e=f?.initData;return typeof e==`string`?e:``}var _=`tg3d_cart_v1`,ce=`buber-theme`,v=`tg3d_orders_v1`,y=`tg3d_promo_v1`,b=`tg3d_promo_used_v1`,le=`tg3d_luck_spin_date_v1`,ue=`tg3d_luck_device_v1`,de=new Set([`LATEST5`]),fe=3400,x={screen:`home`,productId:null,homeTab:`all`,history:[],cart:ge(),lastOrder:null,orders:{loading:!1,loaded:!1,remote:null,error:``,source:``},luck:{spinning:!1,hasSpun:!1,result:null,promo:null,rotation:0},checkout:{name:``,phone:``,telegram:``,payment:`sbp`,comment:``,promoInput:``,promoApplied:null,promoError:``,error:``,submitting:!1},custom:{material:s[0],colorId:c[0].id,size:l[1],qty:1,stlName:``,comment:``}},pe=document.getElementById(`app`);function S(){return document.documentElement.getAttribute(`data-theme`)===`dark`?`dark`:`light`}function me(e){let t=e===`dark`?`dark`:`light`;document.documentElement.setAttribute(`data-theme`,t);try{localStorage.setItem(ce,t)}catch{}let n=document.querySelector(`meta[name="theme-color"]`);n&&n.setAttribute(`content`,t===`dark`?`#0a0a0a`:`#f7f5f2`),te(t)}function he(){me(S()===`dark`?`light`:`dark`),h(`light`)}me(S());var C=ne(S());function ge(){try{return JSON.parse(localStorage.getItem(_)||`[]`)}catch{return[]}}function w(){localStorage.setItem(_,JSON.stringify(x.cart))}function T(){return x.cart.reduce((e,t)=>e+t.qty,0)}function _e(){return x.cart.reduce((e,t)=>e+t.price*t.qty,0)}function E(e){return new Intl.NumberFormat(`ru-RU`,{style:`currency`,currency:`RUB`,maximumFractionDigits:0}).format(e)}function D(e){return String(e||``).trim().toUpperCase().replace(/\s+/g,``)}function O(e){return de.has(D(e))}function k(){try{let e=JSON.parse(localStorage.getItem(b)||`[]`);return Array.isArray(e)?e.map(D).filter(Boolean):[]}catch{return[]}}function ve(e){let t=D(e);if(!t||O(t))return;let n=k();if(!n.includes(t)){n.push(t);try{localStorage.setItem(b,JSON.stringify(n.slice(-80)))}catch{}}let r=A();r&&D(r.code)===t&&be()}function A(){try{let e=JSON.parse(localStorage.getItem(y)||`null`);return!e||typeof e!=`object`||!e.code?null:e}catch{return null}}function ye(e){try{localStorage.setItem(y,JSON.stringify(e))}catch{}}function be(){try{localStorage.removeItem(y)}catch{}}function xe(e){return`${String(e||`BX`).toUpperCase().replace(/[^A-Z0-9]/g,``).slice(0,4)||`BX`}-${Math.random().toString(36).slice(2,6).toUpperCase()}`}function Se(e=30){let t=new Date;return t.setDate(t.getDate()+Math.max(1,Number(e)||30)),t.toISOString()}function j(e){if(!e||!e.expiresAt)return!1;let t=Date.parse(e.expiresAt);return Number.isFinite(t)&&t<Date.now()}function M(e,t){return e===`order_percent`?`Скидка ${t}% на заказ`:e===`delivery_percent`?`Скидка ${t}% на доставку`:`Промокод`}function Ce(){let e=n.map(e=>({code:D(e.code),type:e.type,value:Number(e.value)||0,label:e.label||M(e.type,e.value),source:`static`,expiresAt:null})),t=A();return t&&t.code&&e.push({code:D(t.code),type:t.type,value:Number(t.value)||0,label:t.label||M(t.type,t.value),source:t.source||`wheel`,expiresAt:t.expiresAt||null}),e}function we(e){let t=D(e);if(!t)return{ok:!1,error:`Введите промокод`};let n=k();if(!O(t)&&n.includes(t))return{ok:!1,error:`Этот промокод уже использован на этом устройстве`};let r=Ce().find(e=>e.code===t);return r?j(r)?{ok:!1,error:`Срок действия промокода истёк`}:!r.value||r.value<=0?{ok:!1,error:`Промокод недействителен`}:{ok:!0,promo:{code:r.code,type:r.type,value:r.value,label:r.label,source:r.source,expiresAt:r.expiresAt}}:{ok:!1,error:`Промокод не найден`}}function Te(){return 0}function N(e=x.checkout.promoApplied){let t=_e(),n=Te(),r=0,i=0,a=``;e&&e.type===`order_percent`?(r=Math.round(t*Number(e.value)/100),r=Math.min(r,t)):e&&e.type===`delivery_percent`&&(n>0?(i=Math.round(n*Number(e.value)/100),i=Math.min(i,n)):a=`Скидка ${e.value}% на доставку сохранена. Сейчас доставка в сумме не учтена — применим при подтверждении заказа.`);let o=r+i,s=Math.max(0,t+n-o);return{subtotal:t,deliveryFee:n,orderDiscount:r,deliveryDiscount:i,discountTotal:o,total:s,promo:e||null,deliveryNote:a}}function Ee(e){if(!e||!e.promo)return null;let{type:t,value:n,codePrefix:r}=e.promo;return{code:xe(r),type:t,value:Number(n)||0,label:e.result||M(t,n),source:`wheel`,segmentId:e.id,createdAt:new Date().toISOString(),expiresAt:Se(30)}}function De(){B();let e=we(x.checkout.promoInput);return e.ok?(x.checkout.promoApplied=e.promo,x.checkout.promoInput=e.promo.code,x.checkout.promoError=``,!0):(x.checkout.promoApplied=null,x.checkout.promoError=e.error,!1)}function P(){x.checkout.promoApplied=null,x.checkout.promoError=``,x.checkout.promoInput=``}function F(){if(x.checkout.promoApplied)return;let e=A();if(!e)return;let t=we(e.code);t.ok&&(x.checkout.promoApplied=t.promo,x.checkout.promoInput=t.promo.code)}function I(e,t={}){let n={screen:x.screen,productId:x.productId};t.resetHistory||e===`home`?x.history=[]:e!==x.screen&&x.history.push(n),x.screen=e,e===`home`&&(x.productId=null),t.productId!==void 0&&(x.productId=t.productId),h(`light`),Q()}function L(){let e=x.history.pop();e?(x.screen=e.screen,x.productId=e.productId??null):(x.screen=`home`,x.productId=null),h(`light`),Q()}function R(){return`c_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function Oe(e,t=1){let n=x.cart.find(t=>t.type===`product`&&t.productId===e.id);n?n.qty+=t:x.cart.push({type:`product`,id:R(),productId:e.id,name:e.name,price:e.price,qty:t,emoji:e.emoji,image:e.image,productColor:e.color,material:e.material}),w(),h(`medium`)}function ke(){let e=x.custom,t=c.find(t=>t.id===e.colorId)||c[0],n=z(e);x.cart.push({type:`custom`,id:R(),name:`Свой вариант`,price:n,qty:e.qty,emoji:`✨`,productColor:typeof t.hex==`string`&&t.hex.startsWith(`#`)?t.hex:`#6c9eff`,material:e.material,color:t.name,size:e.size,stlName:e.stlName||``,comment:e.comment||``}),w(),h(`medium`),x.custom={material:s[0],colorId:c[0].id,size:l[1],qty:1,stlName:``,comment:``}}function z(e){let t={[l[0]]:400,[l[1]]:900,[l[2]]:1800,[l[3]]:3500,[l[4]]:1500},n={PLA:1,PETG:1.15,ABS:1.25,TPU:1.4,Другой:1.2},r=t[e.size]??900;return Math.round(r*(n[e.material]||1))}function Ae(e){x.cart=x.cart.filter(t=>t.id!==e),w(),h(`light`),Q()}function je(){let e=g();if(e&&(!x.checkout.telegram&&e.username&&(x.checkout.telegram=`@`+e.username),!x.checkout.name&&e.first_name)){let t=[e.first_name,e.last_name].filter(Boolean);x.checkout.name=t.join(` `)}}function B(){let e=document.getElementById(`co-name`),t=document.getElementById(`co-phone`),n=document.getElementById(`co-telegram`),r=document.getElementById(`co-comment`),i=document.getElementById(`co-promo`),a=document.querySelector(`input[name="co-payment"]:checked`);e&&(x.checkout.name=e.value.trim()),t&&(x.checkout.phone=t.value.trim()),n&&(x.checkout.telegram=n.value.trim()),r&&(x.checkout.comment=r.value.trim()),i&&(x.checkout.promoInput=i.value.trim()),a&&(x.checkout.payment=a.value)}function Me(){B();let e=x.checkout.name.trim(),t=x.checkout.phone.trim(),n=x.checkout.telegram.replace(/^@/,``).trim();return!e||!t||!n?(x.checkout.error=`Укажите имя, телефон и @username Telegram`,!1):(x.checkout.error=``,!0)}function Ne(e){return d.find(t=>t.id===e)?.label||e}function V(e){let t=[];return t.push(`Заказ «${u.name}»`),t.push(`Дата: ${new Date(e.createdAt).toLocaleString(`ru-RU`)}`),t.push(`Город: ${u.city}`),t.push(``),t.push(`Товары:`),e.items.forEach((e,n)=>{let r=[];e.material&&r.push(e.material),e.color&&r.push(e.color),e.size&&r.push(e.size),e.stlName&&r.push(`файл: ${e.stlName}`);let i=r.length?` (${r.join(`, `)})`:``,a=e.comment?` — ${e.comment}`:``;t.push(`${n+1}. ${e.name} × ${e.qty} — ${E(e.price*e.qty)}${i}${a}`)}),t.push(``),e.subtotalRub!=null&&e.subtotalRub!==e.totalRub&&t.push(`Сумма товаров: ${E(e.subtotalRub)}`),e.deliveryFeeRub&&t.push(`Доставка: ${E(e.deliveryFeeRub)}`),e.promoCode&&t.push(`Промокод: ${e.promoCode}${e.promoLabel?` (${e.promoLabel})`:``}`),e.discountRub&&t.push(`Скидка: −${E(e.discountRub)}`),e.deliveryDiscountPending&&t.push(`Скидка на доставку: ${e.deliveryDiscountPending} (применим при расчёте доставки)`),t.push(`Итого: ${E(e.totalRub)}`),t.push(`Оплата: ${Ne(e.checkout.payment)}`),e.checkout.name&&t.push(`Имя: ${e.checkout.name}`),e.checkout.phone&&t.push(`Телефон: ${e.checkout.phone}`),e.checkout.telegram&&t.push(`Telegram: ${e.checkout.telegram}`),e.checkout.comment&&t.push(`Комментарий: ${e.checkout.comment}`),t.push(``),e.checkout.payment===`sbp`?t.push(u.sbpHint):t.push(`Оплата наличными при встрече / самовывозе.`),t.join(`
`)}function Pe(e){let t=(u.telegramUsername||``).replace(/^@/,``).trim();if(!t)return null;let n=`https://t.me/${t}`;return e?`${n}?text=${encodeURIComponent(e)}`:n}function Fe(e){try{let t=JSON.parse(localStorage.getItem(v)||`[]`);t.unshift(e),localStorage.setItem(v,JSON.stringify(t.slice(0,30)))}catch{}}function Ie(){try{let e=JSON.parse(localStorage.getItem(v)||`[]`);return Array.isArray(e)?e:[]}catch{return[]}}function Le(){return`pending_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function Re(e){return/^pending_/i.test(String(e||``))}var H={new:`Новый`,work:`В работе`,ready:`Готов к выдаче`,done:`Выдан`,cancelled:`Отменён`},ze={"":`new`,новый:`new`,new:`new`,"в работе":`work`,работа:`work`,work:`work`,working:`work`,подтвержден:`work`,подтверждён:`work`,"в печати":`work`,готов:`ready`,ready:`ready`,"готов к выдаче":`ready`,выдан:`done`,done:`done`,отменен:`cancelled`,отменён:`cancelled`,cancelled:`cancelled`};function U(e){return ze[String(e??``).trim().replace(/\s+/g,` `).toLocaleLowerCase(`ru-RU`)]||`new`}function W(e){return H[U(e)]}function Be(e){let t=U(e);return`<span class="order-status status-${t}">${Z(H[t])}</span>`}function Ve(e){let t=e.items,n=[],r=``;return Array.isArray(t)?(n=t,r=n.slice(0,2).map(e=>typeof e==`string`?e:e.name).filter(Boolean).join(`, `),n.length>2&&(r+=`…`)):typeof t==`string`&&t.trim()&&(r=t.trim().split(`
`)[0],t.includes(`
`)&&(r+=`…`)),{id:e.order_id||e.id||`—`,status:W(e.status),createdAt:e.createdAt||null,date:e.date||``,totalRub:e.total==null?e.totalRub:e.total,items:n,itemsHint:r||`—`,payment:e.payment||``,comment:e.comment||``,source:`remote`}}function He(e){let t=Array.isArray(e.items)?e.items.length:0,n=t?e.items.slice(0,2).map(e=>e.name).filter(Boolean).join(`, `)+(t>2?`…`:``):`—`;return{id:e.id||`—`,status:W(e.status),createdAt:e.createdAt||null,date:``,totalRub:e.totalRub==null?e.total:e.totalRub,items:Array.isArray(e.items)?e.items:[],itemsHint:n,payment:e.checkout?.payment||e.payment||``,comment:e.checkout?.comment||e.comment||``,source:`local`}}async function Ue(){let e=(u.orderWebhookUrl||``).trim();if(!e)return{ok:!1,skipped:!0,error:`no_webhook`};let t=se();if(!t)return{ok:!1,skipped:!0,error:`no_init_data`};let n=await fetch(e,{method:`POST`,headers:{"Content-Type":`text/plain;charset=utf-8`},body:JSON.stringify({action:`list`,initData:t})}),r=null;try{r=await n.json()}catch{}if(!n.ok||!r||r.ok!==!0){let e=r&&r.error||`http_${n.status}`;throw Error(e)}return{ok:!0,orders:Array.isArray(r.orders)?r.orders.map(Ve):[]}}async function G(e=!1){if(!x.orders.loading&&(!x.orders.loaded||e)){if(!(u.orderWebhookUrl||``).trim()){x.orders.loading=!1,x.orders.loaded=!0,x.orders.remote=null,x.orders.error=``,x.orders.source=`local`,x.screen===`orders`&&Q();return}x.orders.loading=!0,x.orders.error=``,x.screen===`orders`&&Q();try{let e=await Ue();e.skipped?(x.orders.remote=null,x.orders.source=`local`,x.orders.error=``):(x.orders.remote=e.orders,x.orders.source=`remote`,x.orders.error=``)}catch(e){console.warn(`Orders list failed, fallback to localStorage`,e),x.orders.remote=null,x.orders.source=`local`,x.orders.error=String(e&&e.message?e.message:e)}finally{x.orders.loading=!1,x.orders.loaded=!0,x.screen===`orders`&&Q()}}}function We(){let e=t.reduce((e,t)=>e+Math.max(0,t.weight||0),0),n=Math.random()*e;return t.find(e=>(n-=Math.max(0,e.weight||0),n<0))||t[t.length-1]}function Ge(e,t){return(e%t+t)%t}function Ke(){try{let e=localStorage.getItem(ue);if(e)return e;let t=globalThis.crypto?.randomUUID?.()||`device_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;return localStorage.setItem(ue,t),t}catch{return`session-device`}}function qe(){let e=g();return e?.id==null?`device-${Ke()}`:`telegram-${String(e.id)}`}function K(e=new Date){let t=new Intl.DateTimeFormat(`en-US`,{timeZone:`Europe/Moscow`,year:`numeric`,month:`2-digit`,day:`2-digit`}).formatToParts(e),n=Object.fromEntries(t.map(e=>[e.type,e.value]));return`${n.year}-${n.month}-${n.day}`}function q(){return`${le}:${qe()}`}function Je(){try{return{available:!0,date:localStorage.getItem(q())}}catch{return{available:!1,date:null}}}function Ye(){return Je().date===K()}function Xe(){let e=Je();x.luck.hasSpun&&!x.luck.spinning&&e.available&&e.date!==K()&&(x.luck.hasSpun=!1,x.luck.result=null,x.luck.promo=null)}function Ze(){try{localStorage.setItem(q(),K())}catch{}}function Qe(){if(x.luck.spinning||x.luck.hasSpun||!t.length)return;if(Ye()){x.luck.hasSpun=!0,Q();return}let e=We(),n=Ge(-(t.findIndex(t=>t.id===e.id)*(360/t.length))-x.luck.rotation,360),r=5+Math.floor(Math.random()*2);x.luck.spinning=!0,x.luck.hasSpun=!0,Ze(),x.luck.result=null,x.luck.rotation+=r*360+n,h(`medium`),Q(),window.setTimeout(()=>{x.luck.spinning=!1,x.luck.result=e;let t=Ee(e);t?(ye(t),x.luck.promo=t,x.checkout.promoApplied||(x.checkout.promoApplied={code:t.code,type:t.type,value:t.value,label:t.label,source:t.source,expiresAt:t.expiresAt},x.checkout.promoInput=t.code,x.checkout.promoError=``)):x.luck.promo=null,h(`medium`),x.screen===`home`&&x.homeTab===`luck`&&Q()},fe)}function $e(){let e=360/t.length,n=t.map((t,n)=>{let r=n*e,i=(n+1)*e;return`${t.color} ${r}deg ${i}deg`}).join(`, `);return`background: conic-gradient(from ${-e/2}deg, ${n}); transform: rotate(${x.luck.rotation}deg);`}function et(){Xe();let e=360/t.length,n=t.map((t,n)=>{let r=n*e*(Math.PI/180),i=50+Math.sin(r)*35,a=50-Math.cos(r)*35;return`<span class="wheel-label" style="left:${i.toFixed(2)}%;top:${a.toFixed(2)}%">${Z(t.label)}</span>`}).join(``),r=x.luck.promo||A(),i=x.luck.result&&x.luck.result.label===`Пусто`,a=``;if(x.luck.result){if(i)a=`<div class="luck-result" role="status">
        <span class="luck-result-icon">🙂</span>
        <strong>${Z(x.luck.result.result)}</strong>
        <small>Попробуйте снова в следующий раз.</small>
      </div>`;else if(r&&r.code){let e=r.expiresAt?new Date(r.expiresAt).toLocaleDateString(`ru-RU`):``;a=`<div class="luck-result" role="status">
        <span class="luck-result-icon">🎉</span>
        <strong>${Z(r.label||x.luck.result.result)}</strong>
        <div class="promo-code-box">
          <span class="promo-code-label">Ваш промокод</span>
          <code class="promo-code-value">${Z(r.code)}</code>
          <button type="button" class="btn btn-secondary btn-sm" data-action="copy-promo" data-code="${Z(r.code)}">Скопировать</button>
        </div>
        <small>Введите код в корзине при оформлении.${e?` Действует до ${Z(e)}.`:``} Один раз на устройстве.</small>
      </div>`}else a=`<div class="luck-result" role="status">
        <span class="luck-result-icon">🎉</span>
        <strong>${Z(x.luck.result.result)}</strong>
      </div>`}else if(r&&r.code&&!j(r)&&!k().includes(D(r.code))){let e=r.expiresAt?new Date(r.expiresAt).toLocaleDateString(`ru-RU`):``;a=`<div class="luck-result" role="status">
        <span class="luck-result-icon">🎫</span>
        <strong>${Z(r.label||`Ваш приз`)}</strong>
        <div class="promo-code-box">
          <span class="promo-code-label">Сохранённый промокод</span>
          <code class="promo-code-value">${Z(r.code)}</code>
          <button type="button" class="btn btn-secondary btn-sm" data-action="copy-promo" data-code="${Z(r.code)}">Скопировать</button>
        </div>
        <small>Уже можно применить в корзине.${e?` До ${Z(e)}.`:``}</small>
      </div>`}let o=x.luck.spinning?`Колесо крутится…`:x.luck.hasSpun?`Уже крутили сегодня`:`Крутить колесо`,s=x.luck.hasSpun&&!x.luck.spinning?`<p class="luck-cooldown" role="status">Уже крутили сегодня. Следующая попытка завтра.</p>`:``;return`
    <section class="luck-panel" aria-labelledby="luck-title">
      <div class="luck-heading">
        <span class="luck-kicker">Случайный приз</span>
        <h3 class="section-title" id="luck-title">Колесо удачи</h3>
        <p class="tab-lead">Крутите колесо и ловите промокод на скидку.</p>
      </div>
      <div class="wheel-wrap">
        <span class="wheel-pointer" aria-hidden="true">▼</span>
        <div class="luck-wheel ${x.luck.spinning?`is-spinning`:``}" style="${$e()}" aria-label="Колесо с призами">
          ${n}
          <span class="wheel-hub" aria-hidden="true">🎁</span>
        </div>
      </div>
      <button class="btn btn-primary luck-spin" data-action="spin-luck" ${x.luck.spinning||x.luck.hasSpun?`disabled`:``}>
        ${o}
      </button>
      ${s}
      ${a}
      <p class="luck-note">Одна попытка в календарный день по Москве для пользователя Telegram или этого устройства. Выигранный промокод сохраняется на устройстве и вводится в корзине.</p>
    </section>`}async function tt(e){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.left=`-9999px`,document.body.appendChild(t),t.select();let n=document.execCommand(`copy`);return document.body.removeChild(t),n}catch{return!1}}function nt(e){return/[А-Яа-яЁё]/.test(String(e||``))}async function rt(e){let t=(u.orderWebhookUrl||``).trim();if(!t)return{sent:!1,skipped:!0};let n=se();if(!n)throw Error(`Откройте магазин из Telegram`);let r=(e.checkout.telegram||``).replace(/^@/,``).trim(),i={initData:n,order_id:``,name:e.checkout.name||``,phone:e.checkout.phone||``,username:r,payment:e.checkout.payment||`sbp`,comment:e.checkout.comment||``,items:e.items,subtotal:e.subtotalRub==null?e.totalRub:e.subtotalRub,delivery_fee:e.deliveryFeeRub||0,promo_code:e.promoCode||``,promo_type:e.promoType||``,promo_value:e.promoValue==null?``:e.promoValue,promo_label:e.promoLabel||``,discount:e.discountRub||0,discount_order:e.orderDiscountRub||0,discount_delivery:e.deliveryDiscountRub||0,delivery_discount_pending:e.deliveryDiscountPending||``,total:e.totalRub,createdAt:e.createdAt},a=await fetch(t,{method:`POST`,headers:{"Content-Type":`text/plain;charset=utf-8`},body:JSON.stringify(i)}),o=null;try{o=await a.json()}catch{}if(!a.ok||!o||o.ok!==!0){let e=o&&o.error||`http_${a.status}`;throw Error(e)}return{sent:!0,telegram:!!o.telegram,order_id:o.order_id?String(o.order_id):``}}async function it(){if(x.checkout.submitting||!x.cart.length)return;if(!Me()){h(`light`),Q();let e=document.getElementById(`co-error`);e&&e.scrollIntoView({behavior:`smooth`,block:`center`});return}let e=g(),t=x.checkout.telegram.trim(),n=N(),r=n.promo,i={id:Le(),status:`Новый`,createdAt:new Date().toISOString(),shop:u.name,city:u.city,telegramUserId:e?.id??null,user:e?{id:e.id,username:e.username,first_name:e.first_name,last_name:e.last_name}:null,checkout:{name:x.checkout.name,phone:x.checkout.phone,telegram:t,payment:x.checkout.payment,comment:x.checkout.comment,promoCode:r?.code||``},items:x.cart.map(e=>({...e})),subtotalRub:n.subtotal,deliveryFeeRub:n.deliveryFee,promoCode:r?.code||``,promoType:r?.type||``,promoValue:r?.value??null,promoLabel:r?.label||``,orderDiscountRub:n.orderDiscount,deliveryDiscountRub:n.deliveryDiscount,discountRub:n.discountTotal,deliveryDiscountPending:r&&r.type===`delivery_percent`&&n.deliveryFee<=0?`${r.value}% на доставку`:``,totalRub:n.total,note:`Заказ без онлайн-оплаты. Свяжемся для подтверждения. СБП — реквизиты в чат; наличные — при встрече.`,webhookOk:!1};i.text=V(i),x.checkout.submitting=!0,x.checkout.error=``,Q();try{let e=await rt(i);i.webhookOk=!!e.sent,e.order_id&&!Re(e.order_id)&&(i.id=String(e.order_id),i.text=V(i))}catch(e){let t=String(e&&e.message?e.message:e);if(nt(t)){x.checkout.submitting=!1,x.checkout.error=t,h(`light`),Q();let e=document.getElementById(`co-error`);e&&e.scrollIntoView({behavior:`smooth`,block:`center`});return}console.warn(`Order webhook failed, fallback to copy/Telegram`,e),i.webhookOk=!1}r?.code&&ve(r.code),P(),x.lastOrder=i,Fe(i),console.log(`ORDER JSON:`,JSON.stringify(i,null,2)),x.cart=[],w(),x.checkout.submitting=!1,x.checkout.error=``,h(`heavy`),I(`success`,{resetHistory:!0})}function at(){x.screen===`home`?oe():ae(()=>L())}function ot(){let e=x.screen===`cart`&&x.cart.length>0,t=document.getElementById(`bottom-bar`);if(e){let e=re(x.checkout.submitting?`Отправка…`:`Оформить заказ · ${E(N().total)}`,()=>it());t&&t.classList.toggle(`hidden`,!!e)}else ie(),t&&t.classList.add(`hidden`)}function st(){return`<span class="brand-mark" aria-hidden="true">
    <img src="/logo-buber-256.jpg" alt="" width="40" height="40" />
  </span>`}function J(e,{back:t,cart:n,brand:r}={}){let i=r?`<div class="brand">${st()}<h1 class="brand-title">${e}</h1></div>`:`<h1>${e}</h1>`,a=S(),o=a===`dark`?`☀️`:`🌙`,s=a===`dark`?`Светлая тема`:`Тёмная тема`;return`
    <header class="header">
      ${t?`<button class="btn-icon" data-action="back" aria-label="Назад">←</button>`:`<span class="btn-icon" style="visibility:hidden">·</span>`}
      ${i}
      <button class="btn-icon btn-theme" data-action="toggle-theme" aria-label="${s}" title="${s}">${o}</button>
      <button class="btn-icon" data-action="orders" aria-label="Мои заказы" title="Мои заказы">📋</button>
      ${n===!1?`<span class="btn-icon" style="visibility:hidden">·</span>`:`<button class="btn-icon" data-action="cart" aria-label="Корзина">
              🛒
              ${T()?`<span class="badge">${T()}</span>`:``}
            </button>`}
    </header>
    <div class="demo-banner">Демо-каталог · Москва · цены-заглушки</div>
  `}function Y(t){return t===`filament`?e.filter(e=>e.category===`filament`||e.id===`p-filament`):t===`figures`?e.filter(e=>e.category===`figures`):e}function X(e){return e.length?`<div class="grid">${e.map(e=>`
    <article class="card" data-action="open-product" data-id="${e.id}">
      ${e.image?`<div class="card-img card-img--photo" style="background:${e.color}33"><img src="${Z(e.image)}" alt="${Z(e.name)}" loading="lazy" /></div>`:`<div class="card-img" style="background:${e.color}33">${e.emoji}</div>`}
      <div class="card-body">
        <h3>${Z(e.name)}</h3>
        <div class="price">${E(e.price)}</div>
        <p class="short">${Z(e.short)}</p>
      </div>
    </article>`).join(``)}</div>`:`<div class="tab-empty"><div class="emoji">📭</div><p>Пока нет товаров в этой категории</p></div>`}function ct(){return`<nav class="tabs-bar" role="tablist" aria-label="Разделы">${r.map(e=>`
    <button type="button" class="tab-chip ${x.homeTab===e.id?`active`:``}"
      data-action="home-tab" data-id="${e.id}" role="tab"
      aria-selected="${x.homeTab===e.id?`true`:`false`}">${Z(e.label)}</button>`).join(``)}</nav>`}function lt(){let t=x.homeTab;if(t===`all`)return`
      <h3 class="section-title">Каталог</h3>
      ${X(Y(`all`))}`;if(t===`filament`)return`
      <h3 class="section-title">Филамент</h3>
      ${X(Y(`filament`))}`;if(t===`figures`)return`
      <h3 class="section-title">Фигурки</h3>
      ${X(Y(`figures`))}`;if(t===`faq`){let e=i.map(e=>`
      <details class="faq-item">
        <summary>${Z(e.q)}</summary>
        <p>${Z(e.a)}</p>
      </details>`).join(``),t=(u.telegramUsername||``).replace(/^@/,``);return`
      <h3 class="section-title">Как заказать</h3>
      <div class="faq-list">${e}</div>
      ${t?`<a class="btn btn-primary" href="https://t.me/${Z(t)}" target="_blank" rel="noopener">Написать @${Z(t)}</a>`:``}
      <button class="btn btn-secondary" data-action="custom">Свой вариант →</button>`}return t===`portfolio`?`
      <h3 class="section-title">Портфолио</h3>
      <p class="tab-lead">Примеры работ Бубер 3D</p>
      <div class="portfolio-grid">${a.map(e=>`
      <article class="portfolio-card">
        <img class="portfolio-img" src="${Z(e.image)}" alt="${Z(e.alt||e.title)}" loading="lazy" width="1200" height="1600" />
        <div class="portfolio-caption">
          <h4>${Z(e.title)}</h4>
        </div>
      </article>`).join(``)}</div>`:t===`reviews`?`
      <h3 class="section-title">Отзывы</h3>
      <p class="tab-lead">Демо-отзывы. Реальные появятся после заказов.</p>
      <div class="reviews-list">${o.map(e=>`
      <article class="review-card">
        <div class="review-top">
          <strong>${Z(e.name)}</strong>
          <span class="review-stars">${`★`.repeat(e.stars)}${`☆`.repeat(Math.max(0,5-e.stars))}</span>
        </div>
        <p>${Z(e.text)}</p>
      </article>`).join(``)}</div>`:t===`luck`?et():X(e)}function ut(){return`
    ${J(`Бубер 3D`,{brand:!0})}
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
      ${ct()}
      <div class="tab-panel" role="tabpanel">${lt()}</div>
    </div>
  `}function dt(){let t=e.find(e=>e.id===x.productId);return t?`
    ${J(t.name,{back:!0})}
    <div class="screen">
      ${t.image?`<div class="detail-img detail-img--photo" style="background:${t.color}44"><img src="${Z(t.image)}" alt="${Z(t.name)}" /></div>`:`<div class="detail-img" style="background:${t.color}44">${t.emoji}</div>`}
      <div class="detail-price">${E(t.price)}</div>
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
  `:ut()}function ft(){let e=x.custom,t=s.map(t=>`<option value="${t}" ${t===e.material?`selected`:``}>${t}</option>`).join(``),n=l.map(t=>`<option value="${Z(t)}" ${t===e.size?`selected`:``}>${Z(t)}</option>`).join(``),r=c.map(t=>`
    <button type="button" class="color-swatch ${t.id===e.colorId?`selected`:``}"
      data-action="pick-color" data-id="${t.id}"
      title="${Z(t.name)}"
      style="background:${t.hex}"></button>
  `).join(``),i=z(e);return`
    ${J(`Свой вариант`,{back:!0})}
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
        Оценка: <span style="color:var(--tg-link)">${E(i)}</span>
        <span style="color:var(--tg-hint);font-weight:400;font-size:0.85rem"> × ${e.qty}</span>
      </p>

      <button class="btn btn-primary" data-action="add-custom">Добавить в корзину</button>
      <button class="btn btn-secondary" data-action="home">К каталогу</button>
    </div>
  `}function pt(){if(!x.cart.length)return`
      ${J(`Корзина`,{back:!0})}
      <div class="screen">
        <div class="cart-empty">
          <div class="emoji">🛒</div>
          <p>Корзина пуста</p>
          <button class="btn btn-primary" style="margin-top:20px" data-action="home">В каталог</button>
        </div>
      </div>
    `;let e=x.cart.map(e=>{let t=[];return e.material&&t.push(e.material),e.color&&t.push(e.color),e.size&&t.push(e.size),e.stlName&&t.push(`файл: ${e.stlName}`),e.comment&&t.push(e.comment),`
      <div class="cart-item">
        <div class="thumb${e.image?` thumb--photo`:``}" style="background:${e.productColor||`#444`}44">${e.image?`<img src="${Z(e.image)}" alt="" loading="lazy" />`:e.emoji||`📦`}</div>
        <div class="info">
          <h4>${Z(e.name)} × ${e.qty}</h4>
          <div class="meta">${Z(t.join(` · `)||`—`)}</div>
          <div class="line-price">${E(e.price*e.qty)}</div>
        </div>
        <button class="remove" data-action="remove" data-id="${e.id}" aria-label="Удалить">✕</button>
      </div>`}).join(``),t=x.checkout,n=d.map(e=>`
    <label class="pay-option ${t.payment===e.id?`selected`:``}">
      <input type="radio" name="co-payment" value="${e.id}" ${t.payment===e.id?`checked`:``} data-action="pick-payment" />
      <span class="pay-option-body">
        <span class="pay-option-title">${Z(e.label)}</span>
        <span class="pay-option-hint">${Z(e.hint)}</span>
      </span>
    </label>`).join(``),r=t.payment===`sbp`?`<p class="checkout-note">${Z(u.sbpHint)}</p>`:`<p class="checkout-note">Оплата наличными при встрече или самовывозе в ${Z(u.city)}.</p>`,i=t.error?`<p class="form-error" id="co-error">${Z(t.error)}</p>`:`<div id="co-error"></div>`;F();let a=N(),o=t.promoError?`<p class="form-error promo-error">${Z(t.promoError)}</p>`:``,s=t.promoApplied?`<p class="promo-applied">✓ ${Z(t.promoApplied.label||t.promoApplied.code)}
        <button type="button" class="link-btn" data-action="clear-promo">Сбросить</button>
       </p>`:``,c=a.deliveryNote?`<p class="field-hint promo-delivery-note">${Z(a.deliveryNote)}</p>`:``,l=``;return l=a.discountTotal>0||a.deliveryFee>0||t.promoApplied?`<div class="cart-totals">
      <div class="cart-total-row"><span>Товары</span><span>${E(a.subtotal)}</span></div>
      ${a.deliveryFee>0?`<div class="cart-total-row"><span>Доставка</span><span>${E(a.deliveryFee)}</span></div>`:``}
      ${a.orderDiscount>0?`<div class="cart-total-row discount"><span>Скидка на заказ</span><span>−${E(a.orderDiscount)}</span></div>`:``}
      ${a.deliveryDiscount>0?`<div class="cart-total-row discount"><span>Скидка на доставку</span><span>−${E(a.deliveryDiscount)}</span></div>`:``}
      <div class="cart-total">
        <span>Итого</span>
        <span class="sum">${E(a.total)}</span>
      </div>
    </div>`:`<div class="cart-total">
      <span>Итого</span>
      <span class="sum">${E(a.total)}</span>
    </div>`,`
    ${J(`Корзина`,{back:!0})}
    <div class="screen">
      ${e}
      ${l}
      ${c}

      <section class="checkout-block">
        <h3 class="section-title">Оформление</h3>
        <p class="checkout-intro">
          После заказа мы свяжемся с вами в Telegram или по телефону, подтвердим детали и способ получения.
          Онлайн-оплаты пока нет: <strong>СБП</strong> — перевод по реквизитам после подтверждения;
          <strong>наличные</strong> — при встрече / самовывозе.
        </p>

        <div class="form-group">
          <label for="co-name">Имя</label>
          <input type="text" id="co-name" autocomplete="name" placeholder="Как к вам обращаться" value="${Z(t.name)}" required />
        </div>

        <div class="form-group">
          <label for="co-phone">Телефон</label>
          <input type="tel" id="co-phone" autocomplete="tel" inputmode="tel" placeholder="+7 …" value="${Z(t.phone)}" required />
        </div>

        <div class="form-group">
          <label for="co-telegram">Telegram @username</label>
          <input type="text" id="co-telegram" autocomplete="username" placeholder="@username" value="${Z(t.telegram)}" required />
        </div>
        <p class="field-hint">Имя, телефон и @username обязательны.</p>

        <div class="form-group">
          <label for="co-promo">Промокод <span class="opt">(необязательно)</span></label>
          <div class="promo-row">
            <input type="text" id="co-promo" autocomplete="off" placeholder="Например BUBER5" value="${Z(t.promoInput)}" ${t.promoApplied?`readonly`:``} />
            ${t.promoApplied?`<button type="button" class="btn btn-secondary" data-action="clear-promo">Сброс</button>`:`<button type="button" class="btn btn-secondary" data-action="apply-promo">Применить</button>`}
          </div>
          ${s}
          ${o}
          <p class="field-hint">Код с колеса удачи или статичный (BUBER5 / BUBER7 / LATEST5 / DOST5 / DOST7). Все, кроме LATEST5, одноразовые на устройстве.</p>
        </div>

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

        <button class="btn btn-primary" data-action="checkout" ${x.checkout.submitting?`disabled`:``}>${x.checkout.submitting?`Отправка…`:`Оформить заказ · ${E(a.total)}`}</button>
        <button class="btn btn-secondary" data-action="home">Продолжить покупки</button>
      </section>
    </div>
  `}function mt(e){let t=e.date?e.date:e.createdAt?new Date(e.createdAt).toLocaleString(`ru-RU`):`—`,n=e.totalRub!=null&&e.totalRub!==``?E(e.totalRub):`—`;return`
      <article class="order-card">
        <div class="order-card-top">
          <strong class="order-id">${Z(e.id)}</strong>
          ${Be(e.status)}
        </div>
        <div class="order-meta">${Z(t)}</div>
        <div class="order-items">${Z(e.itemsHint||`—`)}</div>
        <div class="order-total">${Z(n)}</div>
      </article>`}function ht(){let e=!!(u.orderWebhookUrl||``).trim(),{loading:t,loaded:n,remote:r,error:i,source:a}=x.orders,o=Ie().map(He),s=``,c=[],l;return t&&!n?l=`
      <p class="tab-lead">Загружаем заказы…</p>
      <div class="placeholder-panel orders-loading">
        <div class="emoji">⏳</div>
        <h3>Мои заказы</h3>
        <p>Синхронизация со статусами из таблицы</p>
      </div>`:a===`remote`&&Array.isArray(r)?(c=r,s=c.length?`Статусы из таблицы. Исполнитель меняет колонку «Статус» — обновите список.`:``,l=c.length?`
      <p class="tab-lead">${Z(s)}</p>
      <div class="orders-toolbar">
        <button class="btn btn-secondary btn-refresh-orders" data-action="refresh-orders" ${t?`disabled`:``}>${t?`Обновление…`:`Обновить статусы`}</button>
      </div>
      <div class="orders-list">${c.map(mt).join(``)}</div>`:`
      <div class="orders-toolbar">
        <button class="btn btn-secondary btn-refresh-orders" data-action="refresh-orders" ${t?`disabled`:``}>${t?`Обновление…`:`Обновить статусы`}</button>
      </div>
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Пока нет заказов</h3>
        <p>Оформите заказ в корзине — он появится здесь со статусом из таблицы.</p>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>`):o.length?(c=o,s=e?i?`Не удалось загрузить статусы (${i}). Показаны заказы с этого устройства.`:`Показаны заказы с этого устройства (офлайн).`:`Заказы с этого устройства. Подключите таблицу, чтобы видеть актуальные статусы.`,l=`
      <p class="tab-lead">${Z(s)}</p>
      ${e?`<div class="orders-toolbar">
        <button class="btn btn-secondary btn-refresh-orders" data-action="refresh-orders" ${t?`disabled`:``}>${t?`Обновление…`:`Обновить статусы`}</button>
      </div>`:``}
      <div class="orders-list">${c.map(mt).join(``)}</div>`):l=e?`
      <div class="orders-toolbar">
        <button class="btn btn-secondary btn-refresh-orders" data-action="refresh-orders" ${t?`disabled`:``}>${t?`Обновление…`:`Обновить статусы`}</button>
      </div>
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Пока нет заказов</h3>
        <p>${i?Z(`Не удалось загрузить список (${i}). `):``}Оформите заказ в корзине — он появится здесь.</p>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>`:`
      <div class="placeholder-panel">
        <div class="emoji">📋</div>
        <h3>Мои заказы</h3>
        <p>Заказы появятся после подключения таблицы</p>
        <p class="tab-lead" style="margin-top:8px">Пока можно оформить заказ и скопировать его в Telegram — история на устройстве появится здесь.</p>
        <button class="btn btn-primary" data-action="home">В каталог</button>
      </div>`,`
    ${J(`Мои заказы`,{back:!0})}
    <div class="screen">
      ${l}
    </div>
  `}function gt(){let e=x.lastOrder,t=e?.text||``,n=Pe(t),r=e?.checkout?.payment===`cash`?`Оплата наличными при встрече или самовывозе.`:u.sbpHint,i=n?`<a class="btn btn-primary" href="${Z(n)}" target="_blank" rel="noopener">Написать нам в Telegram</a>
       <button class="btn btn-secondary" data-action="copy-order">Скопировать заказ</button>`:`<p class="checkout-note">Заказ сохранён на этом устройстве. Скопируйте текст и пришлите его в наш Telegram-бот или чат.</p>
       <button class="btn btn-primary" data-action="copy-order">Скопировать заказ</button>`;return`
    ${J(`Готово`,{back:!0,cart:!1})}
    <div class="screen">
      <div class="success">
        <div class="emoji">✅</div>
        <h2>Заказ оформлен</h2>
        <p>${e?.webhookOk?`Заказ отправлен. Мы свяжемся с вами для подтверждения. `:(u.orderWebhookUrl||``).trim()?`Не удалось отправить автоматически — скопируйте заказ или напишите нам в Telegram. `:`Мы свяжемся с вами для подтверждения. `}${Z(r)}</p>
        <div class="order-summary" id="order-summary">${Z(t)}</div>
        <p class="copy-status" id="copy-status" hidden></p>
        ${i}
        <button class="btn btn-secondary" data-action="orders">Мои заказы</button>
        <button class="btn btn-secondary" data-action="home">В каталог</button>
      </div>
    </div>
  `}function Z(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Q(){let e;switch(x.screen){case`product`:e=dt();break;case`custom`:e=ft();break;case`cart`:e=pt();break;case`success`:e=gt();break;case`orders`:e=ht(),!x.orders.loaded&&!x.orders.loading&&queueMicrotask(()=>G());break;default:e=ut()}e+=`
    <div id="bottom-bar" class="bottom-bar hidden">
      <button class="btn btn-primary" data-action="checkout">Оформить заказ</button>
    </div>
  `,pe.innerHTML=e,_t(),at(),ot()}function $(){let e=document.getElementById(`f-material`),t=document.getElementById(`f-size`),n=document.getElementById(`f-comment`);e&&(x.custom.material=e.value),t&&(x.custom.size=t.value),n&&(x.custom.comment=n.value)}function _t(){pe.querySelectorAll(`[data-action]`).forEach(t=>{t.addEventListener(`click`,n=>{let r=t.getAttribute(`data-action`),i=t.getAttribute(`data-id`);if(r===`back`){L();return}if(r===`toggle-theme`){he(),x.screen===`custom`&&$(),x.screen===`cart`&&B(),Q();return}if(r===`home`)return I(`home`);if(r===`home-tab`){x.homeTab=i||`all`,h(`light`),Q();return}if(r===`spin-luck`){Qe();return}if(r===`cart`)return I(`cart`);if(r===`orders`){I(`orders`),G();return}if(r===`refresh-orders`){h(`light`),G(!0);return}if(r===`custom`)return I(`custom`);if(r===`open-product`)return I(`product`,{productId:i});if(r===`add-product`){let t=e.find(e=>e.id===i);t&&(Oe(t,1),I(`cart`));return}if(r===`pick-color`){$(),x.custom.colorId=i,Q();return}if(r===`qty-minus`){$(),x.custom.qty=Math.max(1,x.custom.qty-1),Q();return}if(r===`qty-plus`){$(),x.custom.qty=Math.min(99,x.custom.qty+1),Q();return}if(r===`add-custom`){$(),ke(),I(`cart`);return}if(r===`remove`){Ae(i);return}if(r===`pick-payment`){B(),x.checkout.payment=t.getAttribute(`value`)||x.checkout.payment,x.checkout.error=``,Q();return}if(r===`apply-promo`){h(De()?`medium`:`light`),Q();return}if(r===`clear-promo`){B(),P(),h(`light`),Q();return}if(r===`copy-promo`){tt(t.getAttribute(`data-code`)||x.luck.promo?.code||A()?.code||``).then(e=>{h(e?`medium`:`light`)});return}if(r===`checkout`){it();return}if(r===`copy-order`){tt(x.lastOrder?.text||``).then(e=>{let t=document.getElementById(`copy-status`);t&&(t.hidden=!1,t.textContent=e?`Скопировано — вставьте в чат с нами`:`Не удалось скопировать — выделите текст вручную`),h(e?`medium`:`light`)});return}})}),[`co-name`,`co-phone`,`co-telegram`,`co-comment`,`co-promo`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`input`,()=>{if(B(),x.checkout.error){let e=x.checkout.phone,t=x.checkout.telegram.replace(/^@/,``).trim();if(e||t){x.checkout.error=``;let e=document.getElementById(`co-error`);e&&(e.textContent=``)}}})});let t=document.getElementById(`f-stl`);t&&t.addEventListener(`change`,()=>{$();let e=t.files?.[0];x.custom.stlName=e?e.name:``,Q()}),[`f-material`,`f-size`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`change`,()=>{$(),Q()})})}je(),F(),x.luck.hasSpun=Ye(),Q(),C?console.info(`Telegram WebApp ready`,{version:C.version,platform:C.platform}):console.info(`Running outside Telegram — MainButton fallback available on cart.`);