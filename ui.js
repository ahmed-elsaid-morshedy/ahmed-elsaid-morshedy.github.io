(function(){
const N=window.Native||null,B=window.DATA||null,SITE='https://ahmed-elsaid-morshedy.github.io/';
const h=(t,a,...c)=>{const e=document.createElement(t);for(const k in(a||{})){if(k==='class')e.className=a[k];else if(k.startsWith('on'))e[k]=a[k];else e.setAttribute(k,a[k])}c.flat().forEach(x=>{if(x!=null&&x!==false)e.append(x)});return e};
const store={get(k,d){try{const v=N?N.readText(k+'.json'):localStorage.getItem('k_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{const s=JSON.stringify(v);N?N.writeText(k+'.json',s):localStorage.setItem('k_'+k,s)}catch(e){}}};
let D=B||{},files=[],dir='',busy={};
const S={tab:'list',q:'',cat:'الكل',theme:store.get('theme','auto'),favs:store.get('favs',[]),pos:store.get('pos',{}),speed:store.get('speed',1),cur:null};
const bundled=new Set(((B&&B.audio)||[]).map(a=>a.src));
try{if(N){dir=N.dirUrl();files=JSON.parse(N.files());const m=N.loadMeta();if(m)D=JSON.parse(m)}}catch(e){}
const app=document.getElementById('app');
const au=new Audio();au.preload='none';
function applyTheme(){const dk=S.theme==='dark'||(S.theme==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dk);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=dk?'#0e1712':'#1f5a3a';return dk}
function cat(t){const m=/سورة\s+(آل|ال)?\s*([\u0621-\u064A]+)/.exec(t||'');return m?('سورة '+(m[1]==='آل'?'آل ':(m[1]||''))+m[2]).replace(/\s+/g,' ').trim():'أخرى'}
function items(){const a=(D.audio||[]).map(i=>({k:'a',id:i.src,title:i.title,dur:i.duration,cat:i.cat||cat(i.title),src:i.src}));const y=(D.items||[]).map(i=>({k:'y',id:i.url,title:i.title,dur:i.duration,cat:cat(i.title),url:i.url,thumb:i.thumb}));return a.concat(y)}
function localSrc(i){if(!N)return i.src;return bundled.has(i.src)?i.src:(files.includes(i.src)?dir+i.src:null)}
function fmt(s){s=Math.floor(s||0);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
// player
const P={bar:null};
function buildPlayer(){const t=h('div',{class:'pt'}),pp=h('button',{onclick:()=>au.paused?au.play():au.pause()},'▶'),bk=h('button',{onclick:()=>au.currentTime=Math.max(0,au.currentTime-15)},'‹15'),fw=h('button',{onclick:()=>au.currentTime=Math.min(au.duration||1e9,au.currentTime+15)},'15›'),r=h('input',{type:'range',min:0,max:1000,value:0}),tm=h('span',{class:'tm'},'0:00'),sp=h('button',{},S.speed+'x');
sp.onclick=()=>{const L=[1,1.25,1.5,2,0.75];S.speed=L[(L.indexOf(S.speed)+1)%L.length];au.playbackRate=S.speed;sp.textContent=S.speed+'x';store.set('speed',S.speed)};
r.oninput=()=>{if(au.duration)au.currentTime=r.value/1000*au.duration};
const bar=h('div',{id:'player'},t,h('div',{class:'ctl'},bk,pp,fw,r,tm,sp));document.body.append(bar);
let last=0;au.ontimeupdate=()=>{if(au.duration)r.value=au.currentTime/au.duration*1000;tm.textContent=fmt(au.currentTime);if(S.cur&&Date.now()-last>3000){last=Date.now();S.pos[S.cur.id]=au.currentTime;store.set('pos',S.pos)}};
au.onplay=()=>{pp.textContent='⏸';draw()};au.onpause=()=>{pp.textContent='▶';if(S.cur){S.pos[S.cur.id]=au.currentTime;store.set('pos',S.pos)}draw()};
au.onended=()=>{if(S.cur){delete S.pos[S.cur.id];store.set('pos',S.pos)}pp.textContent='▶'};
P.bar=bar;P.t=t}
function play(i){const s=localSrc(i);if(!s)return;if(S.cur&&S.cur.id===i.id){au.paused?au.play():au.pause();return}
S.cur=i;au.src=s;au.playbackRate=S.speed;const p=S.pos[i.id]||0;au.onloadedmetadata=()=>{if(p>1&&p<au.duration-3)au.currentTime=p};P.t.textContent=i.title;P.bar.classList.add('show');au.play().catch(()=>{})}
// views
const main=h('main',{class:'wrap'});let listBox,chipBox;
function chips(){chipBox.textContent='';const cs=['الكل','المفضلة'].concat([...new Set(items().map(i=>i.cat))].filter(c=>c!=='أخرى').sort(),['أخرى']).filter((c,i,a)=>a.indexOf(c)===i);cs.forEach(c=>chipBox.append(h('button',{class:'chip'+(S.cat===c?' on':''),onclick:()=>{S.cat=c;chips();list()}},c)))}
function match(i){const q=S.q.trim();if(q&&!(i.title+' '+i.cat).includes(q))return false;if(S.cat==='المفضلة')return S.favs.includes(i.id);if(S.cat!=='الكل'&&i.cat!==S.cat)return false;return true}
function card(i){const fav=S.favs.includes(i.id),fb=h('button',{class:'fav','aria-label':'مفضلة',onclick:e=>{e.preventDefault();e.stopPropagation();const x=S.favs.indexOf(i.id);x<0?S.favs.push(i.id):S.favs.splice(x,1);store.set('favs',S.favs);list()}},fav?'♥':'♡');
if(i.k==='y')return h('a',{class:'card yt',href:i.url,target:'_blank',rel:'noopener'},i.thumb?h('img',{src:i.thumb,alt:'',loading:'lazy',onerror:function(){this.style.display='none'}}):null,h('div',{class:'grow'},h('div',{class:'t'},i.title),h('div',{class:'m'},'يوتيوب · يحتاج إنترنت · '+(i.dur||''))),fb);
const s=localSrc(i),on=S.cur&&S.cur.id===i.id&&!au.paused;
return h('div',{class:'card'},h('div',{class:'row'},s?h('button',{class:'pbtn',onclick:()=>play(i)},on?'⏸':'▶'):h('span',{class:'pbtn',style:'display:grid;place-items:center;opacity:.5'},'⤓'),h('div',{class:'grow'},h('div',{class:'t'},i.title),h('div',{class:'m'},(i.dur||'')+' · '+(s?'بدون إنترنت':(busy[i.src]?'جاري التحميل...':'سيتم التحميل عند الاتصال بالإنترنت'))+(S.pos[i.id]>5&&s?' · استكمال من '+fmt(S.pos[i.id]):''))),fb))}
function list(){listBox.textContent='';const L=items().filter(match);const a=L.filter(i=>i.k==='a'),y=L.filter(i=>i.k==='y');
if(a.length){listBox.append(h('h2',{},'تلاوات داخل التطبيق'));a.forEach(i=>listBox.append(card(i)))}
if(y.length){listBox.append(h('h2',{},'تلاوات على يوتيوب'),h('div',{class:'note'},'تلاوات يوتيوب تحتاج إنترنت ولا تعمل بدون اتصال.'));y.forEach(i=>listBox.append(card(i)))}
if(!L.length)listBox.append(h('div',{class:'note'},S.cat==='المفضلة'?'لم تضف أي تلاوة للمفضلة بعد. اضغط ♡ بجانب أي تلاوة.':'لا توجد نتائج.'))}
function tabList(){const q=h('input',{class:'search',type:'search',placeholder:'ابحث عن تلاوة أو سورة...',value:S.q,oninput:e=>{S.q=e.target.value;list()}});chipBox=h('div',{class:'chips'});listBox=h('div');main.append(q,chipBox,listBox);chips();list()}
function tabAbout(){main.append(h('h2',{},'عن الشيخ'),h('div',{class:'card'},h('div',{class:'t'},D.tagline||''),h('div',{class:'m'},D.bio||'')));(D.sections||[]).filter(s=>s.h!=='العنوان').forEach(s=>main.append(h('h2',{},s.h),h('div',{class:'card'},h('ul',{class:'l'},s.li.map(x=>h('li',{},x))))));(D.about||[]).forEach(p=>main.append(h('div',{class:'card'},p)))}
function tabLessons(){main.append(h('h2',{},'الدروس والمواعيد'));const L=D.lessons||[];if(!L.length)main.append(h('div',{class:'note'},'لم يُعلن عن دروس أو مواعيد بعد. ستظهر هنا تلقائياً عند إضافتها.'));L.forEach(l=>main.append(h('div',{class:'card'},h('div',{class:'t'},l.title||''),h('div',{class:'m'},[l.day,l.time,l.place].filter(Boolean).join(' · ')))))}
function tabContact(){main.append(h('h2',{},'تواصل'));if(D.phone)main.append(h('a',{class:'btn',href:'tel:'+D.phone},'اتصال: 01008082470'));const ad=(D.sections||[]).find(s=>s.h==='العنوان');if(ad)main.append(h('div',{class:'card'},h('div',{class:'t'},'العنوان'),ad.li.map(x=>h('div',{class:'m'},x))));
if(D.channel)main.append(h('a',{class:'btn alt',href:D.channel,target:'_blank'},'القناة على يوتيوب'));if(D.tiktok)main.append(h('a',{class:'btn alt',href:D.tiktok,target:'_blank'},'تيك توك'));if(D.site)main.append(h('a',{class:'btn alt',href:D.site,target:'_blank'},'الموقع الرسمي'));
main.append(h('div',{class:'note'},'التطبيق يعمل بدون إنترنت. التلاوات الجديدة تُحمَّل تلقائياً عند الاتصال، وروابط يوتيوب وتيك توك تحتاج إنترنت.'))}
const T={list:['التلاوات','♪',tabList],about:['عن الشيخ','☰',tabAbout],lessons:['الدروس','◷',tabLessons],contact:['تواصل','☎',tabContact]};
let nav,hero;
function draw(){main.textContent='';T[S.tab][2]();[...nav.children].forEach((b,i)=>b.classList.toggle('on',Object.keys(T)[i]===S.tab));document.body.classList.toggle('off',!navigator.onLine)}
function dl(){const a=h('a',{class:'btn',href:SITE+'1-sheikh.apk',download:'Sheikh-Ahmed-El-Said.apk',style:'font-size:18px;padding:16px'},'⬇ تحميل تطبيق الأندرويد (APK مجاني)');
return h('div',{class:'wrap',id:'dl'},h('div',{class:'card'},h('div',{class:'t'},'حمّل تطبيق الشيخ أحمد السعيد مرشدي'),h('div',{class:'m'},'يعمل بدون إنترنت، ومجاني تماماً. حجمه حوالي 4 ميجا.'),a,
h('ol',{class:'l',style:'margin-top:8px'},h('li',{},'اضغط زر التحميل وافتح الملف بعد انتهائه.'),h('li',{},'إذا ظهرت رسالة "لأسباب أمنية، الهاتف غير مسموح له بتثبيت تطبيقات من هذا المصدر"، اضغط "الإعدادات" وفعّل "السماح من هذا المصدر" ثم ارجع.'),h('li',{},'إذا ظهرت رسالة Play Protect، اضغط "مزيد من التفاصيل" ثم "التثبيت على أي حال". التطبيق غير موجود على متجر Play لذلك تظهر هذه الرسالة.'),h('li',{},'اضغط "تثبيت" ثم "فتح".')),
h('div',{class:'m'},'للأندرويد فقط. على الآيفون: افتح هذا الموقع في Safari ثم زر المشاركة ثم "إضافة إلى الشاشة الرئيسية".')))}
function build(){const dk=applyTheme();const photo=(B&&B.photo)||D.photo,cover=(B&&B.cover)||D.cover;
const tb=h('button',{class:'tbtn','aria-label':'الوضع الليلي'},dk?'☀':'☾');tb.onclick=()=>{S.theme=document.documentElement.classList.contains('dark')?'light':'dark';store.set('theme',S.theme);tb.textContent=applyTheme()?'☀':'☾'};
hero=h('div',{class:'hero',style:cover?'--cover:url('+cover+')':''},tb,photo?h('img',{src:photo,alt:''}):null,h('h1',{},D.name||''),h('p',{},D.tagline||''));
nav=h('nav',{},Object.keys(T).map(k=>h('button',{onclick:()=>{S.tab=k;draw();scrollTo(0,0)}},h('b',{},T[k][1]),T[k][0])));
app.textContent='';app.append(hero);if(!N)app.append(dl());app.append(main,nav);if(!P.bar)buildPlayer();draw()}
// sync
window.onDl=(n,ok)=>{delete busy[n];if(ok)files.push(n);if(S.tab==='list')list();next()};
function pend(){return(D.audio||[]).filter(i=>!bundled.has(i.src)&&!files.includes(i.src)&&!busy[i.src])}
function next(){if(!N||!navigator.onLine)return;const p=pend()[0];if(p){busy[p.src]=1;if(S.tab==='list')list();N.download(p.src)}}
function sync(){if(!navigator.onLine)return;fetch(SITE+'recitations.json?t='+Date.now()).then(r=>r.json()).then(d=>{if(!d||!d.items)return;D=d;if(N){try{N.saveMeta(JSON.stringify(d))}catch(e){}}if(!B)build();else draw();if(S.tab==='list'&&chipBox)chips();next()}).catch(()=>{})}
addEventListener('online',()=>{draw();sync()});addEventListener('offline',draw);
build();sync();
const sp=document.getElementById('splash');if(sp){setTimeout(()=>{sp.classList.add('gone')},1300);setTimeout(()=>sp.remove(),1900)}
})();
