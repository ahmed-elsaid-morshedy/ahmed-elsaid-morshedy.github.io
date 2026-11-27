if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').then(r=>{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()});
fetch('recitations.json').then(r=>r.json()).then(d=>{
document.getElementById("nm").textContent=d.name;tag.textContent=d.tagline;bio.textContent=d.bio;if(d.cover)hd.style.backgroundImage='linear-gradient(rgba(20,40,25,.55),rgba(20,40,25,.85)),url('+d.cover+')';if(d.site){site.href=d.site;site.hidden=false}d.sections.forEach(s=>{const e=document.createElement('section');const h=document.createElement('h2');h.textContent=s.h;const u=document.createElement('ul');s.li.forEach(x=>{const l=document.createElement('li');l.className='t';l.textContent=x;u.append(l)});e.append(h,u);secs.append(e)});yt.href=d.channel;
if(d.photo){photo.src=d.photo;photo.hidden=false}
if(d.tiktok){tt.href=d.tiktok;tt.hidden=false}
if(d.phone){wa.href='tel:'+d.phone;wa.textContent='اتصال: 01008082470';wa.hidden=false}
(d.audio||[]).forEach(i=>{const li=document.createElement('li');li.className='t';const s=document.createElement('strong');s.textContent=i.title;const a=document.createElement('audio');a.controls=true;a.preload='none';a.src=i.src;const b=document.createElement('button');b.className='btn alt';const n=document.createElement('small');n.style.display='block';li.append(s,a,b,n);alist.append(li);
const key=new URL(i.src,location.href).href;
const show=async()=>{const c=await caches.open('sheikh-audio');const h=await c.match(key);b.textContent=h?'تم الحفظ للاستماع بدون إنترنت (اضغط للحذف)':'حفظ للاستماع بدون إنترنت'+(i.mb?' ('+i.mb+' MB)':'');b.dataset.saved=h?'1':''};
b.onclick=async()=>{const c=await caches.open('sheikh-audio');if(b.dataset.saved){await c.delete(key);n.textContent='';return show()}
if(!navigator.onLine){n.textContent='لازم إنترنت عشان تحفظ التلاوة.';return}
b.disabled=true;n.textContent='جاري الحفظ...';try{const r=await fetch(key);if(!r.ok)throw 0;await c.put(key,r);n.textContent='';}catch(x){n.textContent='تعذر الحفظ. جرب مرة أخرى.'}b.disabled=false;show()};
show()});
const note=document.getElementById('offnote');const upd=()=>{note.hidden=navigator.onLine;document.getElementById('list').classList.toggle('off',!navigator.onLine)};addEventListener('online',upd);addEventListener('offline',upd);upd();
if(!d.items.length)empty.hidden=false;
d.items.forEach(i=>{const li=document.createElement('li');const a=document.createElement('a');a.href=i.url;a.target='_blank';a.rel='noopener';
const im=document.createElement('img');im.src=i.thumb;im.alt='';im.loading='lazy';im.onerror=()=>{im.style.display='none'};const s=document.createElement('span');s.textContent=i.title;const m=document.createElement('small');m.textContent=i.duration;
a.append(im,s,m);li.append(a);list.append(li)})});
