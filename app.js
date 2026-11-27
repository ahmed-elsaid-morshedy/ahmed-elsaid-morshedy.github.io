if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
fetch('recitations.json').then(r=>r.json()).then(d=>{
document.getElementById("nm").textContent=d.name;tag.textContent=d.tagline;bio.textContent=d.bio;if(d.cover)hd.style.backgroundImage='linear-gradient(rgba(20,40,25,.55),rgba(20,40,25,.85)),url('+d.cover+')';if(d.site){site.href=d.site;site.hidden=false}d.sections.forEach(s=>{const e=document.createElement('section');const h=document.createElement('h2');h.textContent=s.h;const u=document.createElement('ul');s.li.forEach(x=>{const l=document.createElement('li');l.className='t';l.textContent=x;u.append(l)});e.append(h,u);secs.append(e)});yt.href=d.channel;
if(d.photo){photo.src=d.photo;photo.hidden=false}
if(d.tiktok){tt.href=d.tiktok;tt.hidden=false}
if(d.phone){wa.href='tel:'+d.phone;wa.textContent='اتصال: 01008082470';wa.hidden=false}
(d.audio||[]).forEach(i=>{const li=document.createElement('li');li.className='t';const s=document.createElement('strong');s.textContent=i.title;const a=document.createElement('audio');a.controls=true;a.preload='none';a.src=i.src;li.append(s,a);alist.append(li)});if(!d.items.length)empty.hidden=false;
d.items.forEach(i=>{const li=document.createElement('li');const a=document.createElement('a');a.href=i.url;a.target='_blank';a.rel='noopener';
const im=document.createElement('img');im.src=i.thumb;im.alt='';im.loading='lazy';const s=document.createElement('span');s.textContent=i.title;const m=document.createElement('small');m.textContent=i.duration;
a.append(im,s,m);li.append(a);list.append(li)})});
