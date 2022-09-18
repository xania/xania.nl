(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const N of i.addedNodes)N.tagName==="LINK"&&N.rel==="modulepreload"&&s(N)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerpolicy&&(i.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?i.credentials="include":r.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();var x=(e=>(e[e.Text=0]="Text",e[e.Tag=1]="Tag",e[e.State=2]="State",e[e.Disposable=3]="Disposable",e[e.DOM=4]="DOM",e[e.Renderable=5]="Renderable",e[e.ViewProvider=6]="ViewProvider",e[e.Expression=7]="Expression",e[e.Fragment=8]="Fragment",e))(x||{}),L=(e=>(e[e.Attribute=0]="Attribute",e[e.Event=1]="Event",e[e.ClassName=2]="ClassName",e))(L||{});const B=Symbol(new Date().getTime()),F=Symbol("values");var h=(e=>(e[e.PushFirstChild=0]="PushFirstChild",e[e.PushNextSibling=1]="PushNextSibling",e[e.PushChild=2]="PushChild",e[e.PopNode=3]="PopNode",e[e.SetAttribute=4]="SetAttribute",e[e.SetClassName=5]="SetClassName",e[e.SetTextContent=6]="SetTextContent",e[e.Renderable=7]="Renderable",e[e.AddEventListener=8]="AddEventListener",e[e.AppendChild=9]="AppendChild",e[e.SelectNode=10]="SelectNode",e))(h||{});function j(e,t,n){const{offset:s,data:r}=t;for(let i=s,N=r.length;i<N;i++){const f=r[i];let d={head:f[n]};for(let u=0,a=e.length|0;u<a;u=u+1|0){const o=e[u];switch(o.type){case h.SelectNode:d={head:f[n],tail:d};break;case h.PushChild:d={head:d.head.childNodes[o.index],tail:d};break;case h.PushFirstChild:d={head:d.head.firstChild,tail:d};break;case h.PushNextSibling:d={head:d.head.nextSibling,tail:d};break;case h.PopNode:d=d.tail;break;case h.SetTextContent:const b=o.expression;switch(b.type){case v.Property:d.head.textContent=f[b.name];break;case v.Function:const c=b.deps.map(g=>f[g]);d.head.textContent=b.func.apply(null,c);break;case v.State:b.state.subscribe({next(g){d.head.textContent=g}});break}break;case h.SetAttribute:const p=o.expression;switch(p.type){case v.Property:const c=f[p.name];d.head[o.name]=c;break;case v.Function:const g=p.deps.map(C=>f[C]);d.head[o.name]=p.func.apply(null,g);break;case v.State:p.state.subscribe({next(C){d.head[o.name]=C}});break}break;case h.SetClassName:const l=o.expression;switch(l.type){case v.Property:const c=f[l.name];c!=null?d.head.className=c:d.head.className="";break;case v.Function:const g=l.deps.map(S=>f[S]),C=l.func.apply(null,g);C?d.head.className=C:d.head.className="";break;case v.State:l.state.subscribe({next(S){S?d.head.className=S:d.head.className=""}});break}break;case h.AppendChild:d.head.appendChild(o.node);break;case h.Renderable:o.renderable.render(d.head,f);break}}}}var A=(e=>(e[e.PUSH=0]="PUSH",e[e.MOVE=1]="MOVE",e[e.REMOVE_AT=2]="REMOVE_AT",e[e.INSERT=3]="INSERT",e[e.RESET=4]="RESET",e[e.CLEAR=5]="CLEAR",e[e.RENDER=6]="RENDER",e[e.SWAP=7]="SWAP",e))(A||{});function q(e,t){const n=[];if(!e)return n;const s=[];for(let i=0;i<e.length;i++)s[i]=e[i];for(;s.length>0;){var r=s.pop();if(r instanceof Array){let i=r.length;for(;i--;)s.push(r[i])}else if(r!=null){const i=t(r);if(i)for(let N=i.length-1;N>=0;N--)s[s.length]=i[N];n.push(r)}}return n}function K(){const e=new Map;return{get(t){return e.get(t)},add(t,n){const s=e.get(t);s?s.push(n):e.set(t,[n])}}}function H(e){return e&&typeof e.subscribe=="function"}function X(e){return e&&typeof e.unsubscribe=="function"}function G(e){return document.createElementNS(e==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml",e)}class M{constructor(t){this.current=t,this.observers=[]}subscribe(t){const{observers:n}=this,s=n.length;return n[s]=t,{unsubscribe(){const r=n.indexOf(t);r>=0&&n.splice(r,1)}}}update(t){const{current:n}=this,s=t(n);if(s!==n){this.current=s;for(const r of this.observers)r.next(s)}}set(t){const{current:n}=this;if(t!==n){this.current=t;for(const s of this.observers)s.next(t)}}map(t){const{observers:n}=this,s=new J(this.current,t);return n.push(s),s}toString(){return this.current}}class J extends M{constructor(t,n){super(n(t)),this.mapper=n}next(t){this.set(this.mapper(t))}}function O(e){const t=[],n=e.length;for(let s=0;s<n;s++)t.push(e[s]);return t}function V(e,t){const n=[];for(const s of e)if(s){const r=t(s);for(const i of r)i&&n.push(i)}return n}function I(e){return new Set(e)}class U{constructor(t){this.customizations=t}}function Q(e){if(e instanceof U)return e;const t=K(),n=new DocumentFragment;t.add(n,{type:h.SelectNode});const s=[];if(e instanceof Array)for(const u of e)s.push([n,u]);else s.push([n,z(e)]);for(;s.length>0;){const u=s.pop(),[a,o]=u;if(o instanceof Array)throw new Error("array unexpected!");if(o!=null)switch(o.type){case x.Tag:const{name:b,attrs:p,children:l}=o,c=G(b);if(a.appendChild(c),p)for(let w=0;w<p.length;w++){const E=p[w];E.type===L.Attribute?d(c,E.name,E.value):E.type===L.ClassName?f(c,E.value):E.type===L.Event&&t.add(c,{type:h.AddEventListener,name:E.event,handler:E.handler})}let{length:g}=l;for(;g--;)s.push([c,z(l[g])]);break;case x.Text:const C=document.createTextNode(o.value);a.appendChild(C);break;case x.State:const S=o.state,m=document.createTextNode(S.current);a.appendChild(m),t.add(m,{type:h.SetTextContent,expression:{type:v.State,state:S}});break;case x.DOM:t.add(a,{type:h.AppendChild,node:o.node});break;case x.Renderable:t.add(a,{type:h.Renderable,renderable:o.renderer});break;case x.Expression:const y=document.createTextNode("");a.appendChild(y),t.add(y,{type:h.SetTextContent,expression:o.expression});break;case x.Fragment:for(let w=o.children.length;w--;)s.push([a,z(o.children[w])]);break;case x.ViewProvider:const{view:k}=o.provider;s.push([a,z(k)]);break}}return N();function r(u){const a=t.get(u)||[],o=q([i(u,0,a)],({templateNode:p})=>O(p.childNodes).map((l,c)=>i(l,c,t.get(l)))),b=new Map;for(let p=o.length-1;p>=0;p--){let l=function(m,y){const k=y(m);if(g.length||k.length){if(g.length===1&&g[0].templateNode.nodeType===Node.TEXT_NODE){const E=y(g[0]);if(E&&E.length===1&&E[0].type===h.SetTextContent){const R=g[0],{parentElement:P}=R.templateNode;if(P){P==null||P.removeChild(R.templateNode),k.push(E[0]);return}}}let w=-1;for(const E of g){const R=y(E);if(R!=null&&R.length){const{index:P}=E;P===0?k.push({type:h.PushFirstChild}):P===w+1?(k.pop(),k.push({type:h.PushNextSibling})):k.push({type:h.PushChild,index:P}),k.push(...R),k.push({type:h.PopNode}),w=P}}}};const c=o[p],g=O(c.templateNode.childNodes).map(m=>b.get(m)).filter(m=>!!m);b.set(c.templateNode,c),l(c,m=>m.render);const C=I(V(g,m=>Object.keys(m.events)));for(const m of C)c.events[m]||(c.events[m]=[]),l(c,y=>y.events[m]);const S=I(V(g,m=>Object.keys(m.updates)));for(const m of S)c.updates[m]||(c.updates[m]=[]),l(c,y=>y.updates[m])}return b}function i(u,a,o){const b=[],p={},l={};if(o)for(const c of o)switch(c.type){case h.SetClassName:case h.SetAttribute:case h.SetTextContent:if(c.expression.type===v.Property){const S=c.expression.name;(l[S]||(l[S]=[])).push(c)}else if(c.expression.type===v.Function){const{deps:S}=c.expression;for(const m of S)(l[m]||(l[m]=[])).push(c)}b.push(c);break;case h.AppendChild:case h.Renderable:b.push(c);break;case h.AddEventListener:const{name:g}=c;(p[g]||(p[g]=[])).push(c);break}return{dom:Symbol(a),templateNode:u,index:a,render:b,events:p,updates:l}}function N(){const{childNodes:u}=n,a=u.length;if(a===0)return null;const o=new Array(a);for(let b=0;b<a;b++){const p=u[b],l=r(p).get(p);o[b]=l;const{updates:c}=l;for(const g in l.updates)c[g].unshift({type:h.SelectNode})}return new U(o)}function f(u,a){if(!!a)if(a.type===x.Expression)t.add(u,{type:h.SetClassName,expression:a.expression});else if(a instanceof M)a.current&&u.classList.add(a.current),t.add(u,{type:h.SetClassName,expression:{type:v.State,state:a}});else if(a instanceof Function){const o=a;t.add(u,{type:h.Renderable,renderable:{render(b,p){const l=o(p);return H(l),{dispose(){}}}}})}else for(const o of a.split(" "))u.classList.add(o)}function d(u,a,o){if(!!o)if(o.type===x.Expression)t.add(u,{type:h.SetAttribute,name:a,expression:o.expression});else if(o instanceof M)o.current&&u.setAttribute(a,o.current),t.add(u,{type:h.SetAttribute,name:a,expression:{type:v.State,state:o}});else if(o instanceof Function){const b=o;t.add(u,{type:h.Renderable,renderable:{render(p,l){const c=b(l);return H(c),{dispose(){}}}}})}else u.setAttribute(a,o)}}function z(e){return typeof e>"u"||e===null?null:Z(e)?e:e instanceof te?{type:x.Renderable,renderer:e}:e instanceof M?{type:x.State,state:e}:X(e)?{type:x.Disposable,dispose(){e.unsubscribe()}}:$(e)?{type:x.DOM,node:e}:"view"in Object.keys(e)||"view"in e.constructor.prototype?{type:x.ViewProvider,provider:e}:Y(e)?{type:x.Renderable,renderer:e}:typeof e=="function"?{type:x.Renderable,renderer:{render:e}}:{type:x.Text,value:e}}function Y(e){return e&&typeof e.render=="function"}function Z(e){if(!e)return!1;const{type:t}=e;return t===0||!isNaN(parseInt(t))}function $(e){try{return e instanceof HTMLElement}catch{return typeof e=="object"&&e.nodeType===1&&typeof e.style=="object"&&typeof e.ownerDocument=="object"}}class W{constructor(t,n){this.target=n,this.vdata=[];const s=Q(t);s?this.customizations=s.customizations:this.customizations=[],this.listen()}dispose(){this.clear()}next(t){switch(t.type){case A.CLEAR:this.clear();break;case A.REMOVE_AT:this.removeAt(t.index);break;case A.MOVE:this.moveTo(t.from,t.to);break;case A.RENDER:this.render(t.data);break}}listen(){const{customizations:t,target:n,vdata:s}=this;for(const i of t){const N=I(Object.keys(i.events));for(const f of N)n.addEventListener(f,r)}return{unsubscribe(){}};function r(i){const N=i.type,f=i.target;let d=f;if(!d)return;let u=null;do if(u=d[B],u)break;while(d=d.parentNode);if(!t.includes(u)||!d)return;const{dom:a}=u,o=u.events[N];if(!o||!o.length)return;const b=[d];let p=0;for(let l=0,c=o.length|0;l<c;l=l+1|0){const g=o[l],C=b[p];switch(g.type){case h.PushChild:b[++p]=C.childNodes[g.index];break;case h.PushFirstChild:b[++p]=C.firstChild;break;case h.PushNextSibling:b[++p]=C.nextSibling;break;case h.PopNode:p--;break;case h.AddEventListener:if(f===C||C.contains(f))for(let S=0;S<s.length;S++){const m=s[S];m[a]===d&&g.handler({index:S,values:m[F],event:i})}break}}}}removeAt(t){const{target:n,customizations:s,vdata:r}=this;for(const i of s){const{dom:N}=i;n.removeChild(r[t][N]),r.splice(t,1)}}clear(){const{vdata:t,customizations:n}=this;for(const s of n){const{dom:r}=s;for(const i of t)i[r].remove()}t.length=0}render(t){const{vdata:n,customizations:s,target:r}=this,i=t.length,N=n.length;for(let f=N;f<i;f++){const d=t[f],u={[F]:d};n.push(u)}for(const f of s){const{updates:d,dom:u}=f;if(i>N){const{templateNode:a}=f;for(let o=N;o<i;o++){const b=a.cloneNode(!0);b[B]=f,r.appendChild(b);const p=t[o],l=n[o];if(l[u]=b,p)for(const c in d){const g=p[c];l[c]=g}}j(f.render,{target:r,data:n,offset:N},f.dom)}if(N>0)for(const a in d){const o=d[a];if(!o)break;const b=[];for(let p=0;p<N;p++){const l=t[p];let c=n[p];if(c[F]=l,!l)continue;const g=l[a];c[F]=l,c[a]!==g&&(c[a]=g,b.push(c))}b.length&&j(o,{target:r,data:b,offset:0},f.dom)}}}moveTo(t,n){if(t===n)return;const{vdata:s,customizations:r}=this,i=s[t],N=s[n];if(t<n)for(let f=t+1;f<=n;f++)s[f-1]=s[f];else if(t>n)for(let f=t;f>n;f--)s[f]=s[f-1];s[n]=i;for(const f of r){const{dom:d}=f,u=i[d],a=N[d];t<n?a.insertAdjacentElement("afterend",u):t>n&&a.insertAdjacentElement("beforebegin",u)}}}function D(e,t,n){const s=typeof t=="string"?document.querySelector(t):t;if(s&&e){const r=new W(e,s);return r.render([n]),r}return null}function _(e){return D(this,e)}function ne(e,t){return t instanceof Array&&t.length>0?{type:x.Fragment,children:t,render:_}:null}function se(e,t=null,...n){if(e===null)return{type:x.Fragment,children:n,render:_};if(typeof e=="string"){const s=T(t);return{type:x.Tag,name:e,attrs:s,children:ee(n),render:_}}if(typeof e=="function")try{return e(t,n)}catch{return Reflect.construct(e,[t,n])}return null}function T(e){return e?Object.keys(e).map(t=>{const n=e[t];return("on"+t).toLocaleLowerCase()in HTMLElement.prototype?{type:L.Event,event:t.toLocaleLowerCase(),handler:n}:t==="class"||t==="className"?{type:L.ClassName,value:n}:{type:L.Attribute,name:t,value:n}}):null}function ee(e){if(!(e instanceof Array))return e;for(var t=[],n=[e];n.length;){var s=n.pop();if(s instanceof Array)for(let r=s.length-1;r>=0;r--)n.push(s[r]);else s!=null&&t.push(s)}return t}var v=(e=>(e[e.Property=0]="Property",e[e.Function=1]="Function",e[e.State=2]="State",e))(v||{});class te{constructor(t){this.itemTemplate=t,this.bindings=[],this.pushMutation=n=>{if(!n)return;const{bindings:s}=this;let{length:r}=s;for(;r--;)s[r].next(n)}}render(t){const{itemTemplate:n,bindings:s}=this,r=new W(n,t);return s.push(r),{dispose(){const i=s.indexOf(r);i>=0&&s.splice(i,1)}}}dispose(){throw new Error("Method not implemented.")}clear(){this.pushMutation({type:A.CLEAR})}removeAt(t){t>=0&&this.pushMutation({type:A.REMOVE_AT,index:t})}swap(t,n){this.pushMutation({type:A.SWAP,index1:t,index2:n})}update(t){this.pushMutation({type:A.RENDER,data:t})}move(t,n){this.pushMutation({type:A.MOVE,from:t,to:n})}}export{ne as a,se as c,D as r};