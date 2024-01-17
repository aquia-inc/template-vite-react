const e="component-library";let t,n,l,o=!1,s=!1,i=!1,c=!1,r=!1;const a=e=>{const t=new URL(e,we.t);return t.origin!==$e.location.origin?t.href:t.pathname},f={},u=e=>"object"==(e=typeof e)||"function"===e;function d(e){var t,n,l;return null!==(l=null===(n=null===(t=e.head)||void 0===t?void 0:t.querySelector('meta[name="csp-nonce"]'))||void 0===n?void 0:n.getAttribute("content"))&&void 0!==l?l:void 0}const h=(e,t,...n)=>{let l=null,o=null,s=null,i=!1,c=!1;const r=[],a=t=>{for(let n=0;n<t.length;n++)l=t[n],Array.isArray(l)?a(l):null!=l&&"boolean"!=typeof l&&((i="function"!=typeof e&&!u(l))&&(l+=""),i&&c?r[r.length-1].l+=l:r.push(i?p(null,l):l),c=i)};if(a(n),t){t.key&&(o=t.key),t.name&&(s=t.name);{const e=t.className||t.class;e&&(t.class="object"!=typeof e?e:Object.keys(e).filter((t=>e[t])).join(" "))}}if("function"==typeof e)return e(null===t?{}:t,r,y);const f=p(e,null);return f.o=t,r.length>0&&(f.i=r),f.u=o,f.h=s,f},p=(e,t)=>({p:0,m:e,l:t,$:null,i:null,o:null,u:null,h:null}),m={},y={forEach:(e,t)=>e.map($).forEach(t),map:(e,t)=>e.map($).map(t).map(b)},$=e=>({vattrs:e.o,vchildren:e.i,vkey:e.u,vname:e.h,vtag:e.m,vtext:e.l}),b=e=>{if("function"==typeof e.vtag){const t=Object.assign({},e.vattrs);return e.vkey&&(t.key=e.vkey),e.vname&&(t.name=e.vname),h(e.vtag,t,...e.vchildren||[])}const t=p(e.vtag,e.vtext);return t.o=e.vattrs,t.i=e.vchildren,t.u=e.vkey,t.h=e.vname,t},v=e=>ae(e).v,w=(e,t,n)=>{const l=v(e);return{emit:e=>g(l,t,{bubbles:!!(4&n),composed:!!(2&n),cancelable:!!(1&n),detail:e})}},g=(e,t,n)=>{const l=we.ce(t,n);return e.dispatchEvent(l),l},j=new WeakMap,k=e=>"sc-"+e.g,O=(e,t,n,l,o,s)=>{if(n!==l){let c=de(e,t),r=t.toLowerCase();if("class"===t){const t=e.classList,o=_(n),s=_(l);t.remove(...o.filter((e=>e&&!s.includes(e)))),t.add(...s.filter((e=>e&&!o.includes(e))))}else if("style"===t){for(const t in n)l&&null!=l[t]||(t.includes("-")?e.style.removeProperty(t):e.style[t]="");for(const t in l)n&&l[t]===n[t]||(t.includes("-")?e.style.setProperty(t,l[t]):e.style[t]=l[t])}else if("key"===t);else if("ref"===t)l&&l(e);else if(c||"o"!==t[0]||"n"!==t[1]){const r=u(l);if((c||r&&null!==l)&&!o)try{if(e.tagName.includes("-"))e[t]=l;else{const o=null==l?"":l;"list"===t?c=!1:null!=n&&e[t]==o||(e[t]=o)}}catch(i){}null==l||!1===l?!1===l&&""!==e.getAttribute(t)||e.removeAttribute(t):(!c||4&s||o)&&!r&&e.setAttribute(t,l=!0===l?"":l)}else t="-"===t[2]?t.slice(3):de($e,r)?r.slice(2):r[2]+t.slice(3),n&&we.rel(e,t,n,!1),l&&we.ael(e,t,l,!1)}},S=/\s/,_=e=>e?e.split(S):[],C=(e,t,n,l)=>{const o=11===t.$.nodeType&&t.$.host?t.$.host:t.$,s=e&&e.o||f,i=t.o||f;for(l in s)l in i||O(o,l,s[l],void 0,n,t.p);for(l in i)O(o,l,s[l],i[l],n,t.p)},M=(e,s,r,a)=>{const f=s.i[r];let u,d,h,p=0;if(o||(i=!0,"slot"===f.m&&(t&&a.classList.add(t+"-s"),f.p|=f.i?2:1)),null!==f.l)u=f.$=ve.createTextNode(f.l);else if(1&f.p)u=f.$=ve.createTextNode("");else{if(c||(c="svg"===f.m),u=f.$=ve.createElementNS(c?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml",2&f.p?"slot-fb":f.m),c&&"foreignObject"===f.m&&(c=!1),C(null,f,c),null!=t&&u["s-si"]!==t&&u.classList.add(u["s-si"]=t),f.i)for(p=0;p<f.i.length;++p)d=M(e,f,p,u),d&&u.appendChild(d);"svg"===f.m?c=!1:"foreignObject"===u.tagName&&(c=!0)}return u["s-hn"]=l,3&f.p&&(u["s-sr"]=!0,u["s-cr"]=n,u["s-sn"]=f.h||"",h=e&&e.i&&e.i[r],h&&h.m===f.m&&e.$&&R(e.$,!1)),u},R=(e,t)=>{we.p|=1;const n=e.childNodes;for(let o=n.length-1;o>=0;o--){const e=n[o];e["s-hn"]!==l&&e["s-ol"]&&(T(e).insertBefore(e,L(e)),e["s-ol"].remove(),e["s-ol"]=void 0,i=!0),t&&R(e,t)}we.p&=-2},N=(e,t,n,o,s,i)=>{let c,r=e["s-cr"]&&e["s-cr"].parentNode||e;for(r.shadowRoot&&r.tagName===l&&(r=r.shadowRoot);s<=i;++s)o[s]&&(c=M(null,n,s,e),c&&(o[s].$=c,r.insertBefore(c,L(t))))},x=(e,t,n,l,o)=>{for(;t<=n;++t)(l=e[t])&&(o=l.$,W(l),s=!0,o["s-ol"]?o["s-ol"].remove():R(o,!0),o.remove())},E=(e,t)=>e.m===t.m&&("slot"===e.m?e.h===t.h:e.u===t.u),L=e=>e&&e["s-ol"]||e,T=e=>(e["s-ol"]?e["s-ol"]:e).parentNode,P=(e,t)=>{const n=t.$=e.$,l=e.i,o=t.i,s=t.m,i=t.l;let r;null===i?(c="svg"===s||"foreignObject"!==s&&c,"slot"===s||C(e,t,c),null!==l&&null!==o?((e,t,n,l)=>{let o,s,i=0,c=0,r=0,a=0,f=t.length-1,u=t[0],d=t[f],h=l.length-1,p=l[0],m=l[h];for(;i<=f&&c<=h;)if(null==u)u=t[++i];else if(null==d)d=t[--f];else if(null==p)p=l[++c];else if(null==m)m=l[--h];else if(E(u,p))P(u,p),u=t[++i],p=l[++c];else if(E(d,m))P(d,m),d=t[--f],m=l[--h];else if(E(u,m))"slot"!==u.m&&"slot"!==m.m||R(u.$.parentNode,!1),P(u,m),e.insertBefore(u.$,d.$.nextSibling),u=t[++i],m=l[--h];else if(E(d,p))"slot"!==u.m&&"slot"!==m.m||R(d.$.parentNode,!1),P(d,p),e.insertBefore(d.$,u.$),d=t[--f],p=l[++c];else{for(r=-1,a=i;a<=f;++a)if(t[a]&&null!==t[a].u&&t[a].u===p.u){r=a;break}r>=0?(s=t[r],s.m!==p.m?o=M(t&&t[c],n,r,e):(P(s,p),t[r]=void 0,o=s.$),p=l[++c]):(o=M(t&&t[c],n,c,e),p=l[++c]),o&&T(u.$).insertBefore(o,L(u.$))}i>f?N(e,null==l[h+1]?null:l[h+1].$,n,l,c,h):c>h&&x(t,i,f)})(n,l,t,o):null!==o?(null!==e.l&&(n.textContent=""),N(n,null,t,o,0,o.length-1)):null!==l&&x(l,0,l.length-1),c&&"svg"===s&&(c=!1)):(r=n["s-cr"])?r.parentNode.textContent=i:e.l!==i&&(n.data=i)},U=e=>{const t=e.childNodes;let n,l,o,s,i,c;for(l=0,o=t.length;l<o;l++)if(n=t[l],1===n.nodeType){if(n["s-sr"])for(i=n["s-sn"],n.hidden=!1,s=0;s<o;s++)if(c=t[s].nodeType,t[s]["s-hn"]!==n["s-hn"]||""!==i){if(1===c&&i===t[s].getAttribute("slot")){n.hidden=!0;break}}else if(1===c||3===c&&""!==t[s].textContent.trim()){n.hidden=!0;break}U(n)}},A=[],D=e=>{let t,n,l,o,i,c,r=0;const a=e.childNodes,f=a.length;for(;r<f;r++){if(t=a[r],t["s-sr"]&&(n=t["s-cr"])&&n.parentNode)for(l=n.parentNode.childNodes,o=t["s-sn"],c=l.length-1;c>=0;c--)n=l[c],n["s-cn"]||n["s-nr"]||n["s-hn"]===t["s-hn"]||(F(n,o)?(i=A.find((e=>e.j===n)),s=!0,n["s-sn"]=n["s-sn"]||o,i?i.k=t:A.push({k:t,j:n}),n["s-sr"]&&A.map((e=>{F(e.j,n["s-sn"])&&(i=A.find((e=>e.j===n)),i&&!e.k&&(e.k=i.k))}))):A.some((e=>e.j===n))||A.push({j:n}));1===t.nodeType&&D(t)}},F=(e,t)=>1===e.nodeType?null===e.getAttribute("slot")&&""===t||e.getAttribute("slot")===t:e["s-sn"]===t||""===t,W=e=>{e.o&&e.o.ref&&e.o.ref(null),e.i&&e.i.map(W)},H=(e,t)=>{t&&!e.O&&t["s-p"]&&t["s-p"].push(new Promise((t=>e.O=t)))},q=(e,t)=>{if(e.p|=16,!(4&e.p))return H(e,e.S),Ne((()=>V(e,t)));e.p|=512},V=(e,t)=>{const n=e._;let l;return t&&(e.p|=256,e.C&&(e.C.map((([e,t])=>K(n,e,t))),e.C=null),l=K(n,"componentWillLoad")),Q(l,(()=>z(e,n,t)))},z=async(e,t,n)=>{const l=e.v,o=l["s-rc"];n&&(e=>{const t=e.M,n=e.v,l=t.p,o=((e,t)=>{var n;let l=k(t);const o=ye.get(l);if(e=11===e.nodeType?e:ve,o)if("string"==typeof o){let t,s=j.get(e=e.head||e);if(s||j.set(e,s=new Set),!s.has(l)){{t=ve.createElement("style"),t.innerHTML=o;const l=null!==(n=we.R)&&void 0!==n?n:d(ve);null!=l&&t.setAttribute("nonce",l),e.insertBefore(t,e.querySelector("link"))}s&&s.add(l)}}else e.adoptedStyleSheets.includes(o)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,o]);return l})(ge&&n.shadowRoot?n.shadowRoot:n.getRootNode(),t);10&l&&(n["s-sc"]=o,n.classList.add(o+"-h"))})(e);B(e,t),o&&(o.map((e=>e())),l["s-rc"]=void 0);{const t=l["s-p"],n=()=>G(e);0===t.length?n():(Promise.all(t).then(n),e.p|=4,t.length=0)}},B=(e,c)=>{try{c=c.render(),e.p&=-17,e.p|=2,((e,c)=>{const r=e.v,a=e.M,f=e.N||p(null,null),u=(e=>e&&e.m===m)(c)?c:h(null,null,c);if(l=r.tagName,a.L&&(u.o=u.o||{},a.L.map((([e,t])=>u.o[t]=r[e]))),u.m=null,u.p|=4,e.N=u,u.$=f.$=r.shadowRoot||r,t=r["s-sc"],n=r["s-cr"],o=ge&&0!=(1&a.p),s=!1,P(f,u),we.p|=1,i){let e,t,n,l,o,s;D(u.$);let i=0;for(;i<A.length;i++)e=A[i],t=e.j,t["s-ol"]||(n=ve.createTextNode(""),n["s-nr"]=t,t.parentNode.insertBefore(t["s-ol"]=n,t));for(i=0;i<A.length;i++)if(e=A[i],t=e.j,e.k){for(l=e.k.parentNode,o=e.k.nextSibling,n=t["s-ol"];n=n.previousSibling;)if(s=n["s-nr"],s&&s["s-sn"]===t["s-sn"]&&l===s.parentNode&&(s=s.nextSibling,!s||!s["s-nr"])){o=s;break}(!o&&l!==t.parentNode||t.nextSibling!==o)&&t!==o&&(!t["s-hn"]&&t["s-ol"]&&(t["s-hn"]=t["s-ol"].parentNode.nodeName),l.insertBefore(t,o))}else 1===t.nodeType&&(t.hidden=!0)}s&&U(u.$),we.p&=-2,A.length=0})(e,c)}catch(r){he(r,e.v)}return null},G=e=>{const t=e.v,n=e._,l=e.S;K(n,"componentDidRender"),64&e.p?K(n,"componentDidUpdate"):(e.p|=64,X(t),K(n,"componentDidLoad"),e.T(t),l||J()),e.O&&(e.O(),e.O=void 0),512&e.p&&Re((()=>q(e,!1))),e.p&=-517},I=e=>{{const t=ae(e),n=t.v.isConnected;return n&&2==(18&t.p)&&q(t,!1),n}},J=()=>{X(ve.documentElement),Re((()=>g($e,"appload",{detail:{namespace:e}})))},K=(e,t,n)=>{if(e&&e[t])try{return e[t](n)}catch(l){he(l)}},Q=(e,t)=>e&&e.then?e.then(t):t(),X=e=>e.classList.add("hydrated"),Y=(e,t,n)=>{if(t.P){e.watchers&&(t.U=e.watchers);const l=Object.entries(t.P),o=e.prototype;if(l.map((([e,[l]])=>{(31&l||2&n&&32&l)&&Object.defineProperty(o,e,{get(){return((e,t)=>ae(this).A.get(t))(0,e)},set(n){((e,t,n,l)=>{const o=ae(e),s=o.v,i=o.A.get(t),c=o.p,r=o._;if(n=((e,t)=>null==e||u(e)?e:4&t?"false"!==e&&(""===e||!!e):2&t?parseFloat(e):1&t?e+"":e)(n,l.P[t][0]),(!(8&c)||void 0===i)&&n!==i&&(!Number.isNaN(i)||!Number.isNaN(n))&&(o.A.set(t,n),r)){if(l.U&&128&c){const e=l.U[t];e&&e.map((e=>{try{r[e](n,i,t)}catch(l){he(l,s)}}))}2==(18&c)&&q(o,!1)}})(this,e,n,t)},configurable:!0,enumerable:!0})})),1&n){const n=new Map;o.attributeChangedCallback=function(e,t,l){we.jmp((()=>{const t=n.get(e);if(this.hasOwnProperty(t))l=this[t],delete this[t];else if(o.hasOwnProperty(t)&&"number"==typeof this[t]&&this[t]==l)return;this[t]=(null!==l||"boolean"!=typeof this[t])&&l}))},e.observedAttributes=l.filter((([e,t])=>15&t[0])).map((([e,l])=>{const o=l[1]||e;return n.set(o,e),512&l[0]&&t.L.push([e,o]),o}))}}return e},Z=e=>{K(e,"connectedCallback")},ee=(e,t)=>{class n extends Array{item(e){return this[e]}}if(8&t.p){const t=e.__lookupGetter__("childNodes");Object.defineProperty(e,"children",{get(){return this.childNodes.map((e=>1===e.nodeType))}}),Object.defineProperty(e,"childElementCount",{get:()=>e.children.length}),Object.defineProperty(e,"childNodes",{get(){const e=t.call(this);if(0==(1&we.p)&&2&ae(this).p){const t=new n;for(let n=0;n<e.length;n++){const l=e[n]["s-nr"];l&&t.push(l)}return t}return n.from(e)}})}},te=(e,t={})=>{var n;const l=[],o=t.exclude||[],s=$e.customElements,i=ve.head,c=i.querySelector("meta[charset]"),r=ve.createElement("style"),a=[];let f,u=!0;Object.assign(we,t),we.t=new URL(t.resourcesUrl||"./",ve.baseURI).href,e.map((e=>{e[1].map((t=>{const n={p:t[0],g:t[1],P:t[2],D:t[3]};n.P=t[2],n.D=t[3],n.L=[],n.U={},!ge&&1&n.p&&(n.p|=8);const i=n.g,c=class extends HTMLElement{constructor(e){super(e),ue(e=this,n),1&n.p&&(ge?e.attachShadow({mode:"open"}):"shadowRoot"in e||(e.shadowRoot=e)),ee(e,n)}connectedCallback(){f&&(clearTimeout(f),f=null),u?a.push(this):we.jmp((()=>(e=>{if(0==(1&we.p)){const t=ae(e),n=t.M,l=()=>{};if(1&t.p)le(e,t,n.D),Z(t._);else{t.p|=1,12&n.p&&(e=>{const t=e["s-cr"]=ve.createComment("");t["s-cn"]=!0,e.insertBefore(t,e.firstChild)})(e);{let n=e;for(;n=n.parentNode||n.host;)if(n["s-p"]){H(t,t.S=n);break}}n.P&&Object.entries(n.P).map((([t,[n]])=>{if(31&n&&e.hasOwnProperty(t)){const n=e[t];delete e[t],e[t]=n}})),(async(e,t,n,l,o)=>{if(0==(32&t.p)){{if(t.p|=32,(o=me(n)).then){const e=()=>{};o=await o,e()}o.isProxied||(n.U=o.watchers,Y(o,n,2),o.isProxied=!0);const e=()=>{};t.p|=8;try{new o(t)}catch(c){he(c)}t.p&=-9,t.p|=128,e(),Z(t._)}if(o.style){let e=o.style;const t=k(n);if(!ye.has(t)){const l=()=>{};8&n.p&&(e=await __sc_import_component_library("./p-3508048d.js").then((n=>n.scopeCss(e,t,!1)))),((e,t,n)=>{let l=ye.get(e);ke&&n?(l=l||new CSSStyleSheet,"string"==typeof l?l=t:l.replaceSync(t)):l=t,ye.set(e,l)})(t,e,!!(1&n.p)),l()}}}const s=t.S,i=()=>q(t,!0);s&&s["s-rc"]?s["s-rc"].push(i):i()})(0,t,n)}l()}})(this)))}disconnectedCallback(){we.jmp((()=>(()=>{if(0==(1&we.p)){const e=ae(this),t=e._;e.F&&(e.F.map((e=>e())),e.F=void 0),K(t,"disconnectedCallback")}})()))}componentOnReady(){return ae(this).W}};n.H=e[0],o.includes(i)||s.get(i)||(l.push(i),s.define(i,Y(c,n,1)))}))}));{r.innerHTML=l+"{visibility:hidden}.hydrated{visibility:inherit}",r.setAttribute("data-styles","");const e=null!==(n=we.R)&&void 0!==n?n:d(ve);null!=e&&r.setAttribute("nonce",e),i.insertBefore(r,c?c.nextSibling:i.firstChild)}u=!1,a.length?a.map((e=>e.connectedCallback())):we.jmp((()=>f=setTimeout(J,30)))},ne=(e,t)=>t,le=(e,t,n)=>{n&&n.map((([n,l,o])=>{const s=se(e,n),i=oe(t,o),c=ie(n);we.ael(s,l,i,c),(t.F=t.F||[]).push((()=>we.rel(s,l,i,c)))}))},oe=(e,t)=>n=>{try{256&e.p?e._[t](n):(e.C=e.C||[]).push([t,n])}catch(l){he(l)}},se=(e,t)=>8&t?$e:16&t?ve.body:e,ie=e=>0!=(2&e),ce=e=>we.R=e,re=new WeakMap,ae=e=>re.get(e),fe=(e,t)=>re.set(t._=e,t),ue=(e,t)=>{const n={p:0,v:e,M:t,A:new Map};return n.W=new Promise((e=>n.T=e)),e["s-p"]=[],e["s-rc"]=[],le(e,n,t.D),re.set(e,n)},de=(e,t)=>t in e,he=(e,t)=>(0,console.error)(e,t),pe=new Map,me=e=>{const t=e.g.replace(/-/g,"_"),n=e.H,l=pe.get(n);return l?l[t]:__sc_import_component_library(`./${n}.entry.js`).then((e=>(pe.set(n,e),e[t])),he)
/*!__STENCIL_STATIC_IMPORT_SWITCH__*/},ye=new Map,$e="undefined"!=typeof window?window:{},be=$e.CSS,ve=$e.document||{head:{}},we={p:0,t:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,l)=>e.addEventListener(t,n,l),rel:(e,t,n,l)=>e.removeEventListener(t,n,l),ce:(e,t)=>new CustomEvent(e,t)},ge=(()=>(ve.head.attachShadow+"").indexOf("[native")>-1)(),je=e=>Promise.resolve(e),ke=(()=>{try{return new CSSStyleSheet,"function"==typeof(new CSSStyleSheet).replaceSync}catch(e){}return!1})(),Oe=[],Se=[],_e=(e,t)=>n=>{e.push(n),r||(r=!0,t&&4&we.p?Re(Me):we.raf(Me))},Ce=e=>{for(let n=0;n<e.length;n++)try{e[n](performance.now())}catch(t){he(t)}e.length=0},Me=()=>{Ce(Oe),Ce(Se),(r=Oe.length>0)&&we.raf(Me)},Re=e=>je().then(e),Ne=_e(Se,!0);export{be as C,ne as F,m as H,e as N,je as a,te as b,w as c,ve as d,a as e,I as f,v as g,h,we as p,fe as r,ce as s,$e as w}