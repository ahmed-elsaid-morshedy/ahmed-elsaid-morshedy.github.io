(function(){const N=window.Native,V=3;let js='',css='',rv=0;
try{if(N){rv=+N.readText('ui.ver')||0;if(rv>V){js=N.readText('ui.js');css=N.readText('ui.css')}}}catch(e){}
function load(){if(js&&css){const s=document.createElement('style');s.textContent=css;document.head.append(s);try{(0,eval)(js+'\n//# sourceURL=ui.js');return}catch(e){}}
const l=document.createElement('link');l.rel='stylesheet';l.href='ui.css';document.head.append(l);const sc=document.createElement('script');sc.src='ui.js';document.body.append(sc)}
if(!js||!css){js='';css=''}
load();
if(N&&navigator.onLine){const SITE='https://ahmed-elsaid-morshedy.github.io/';fetch(SITE+'ui.json?t='+Date.now()).then(r=>r.json()).then(async j=>{if(j.v>Math.max(V,rv)){const a=await (await fetch(SITE+'ui.js?t='+j.v)).text(),b=await (await fetch(SITE+'ui.css?t='+j.v)).text();if(a.length>1000&&b.length>200){N.writeText('ui.js',a);N.writeText('ui.css',b);N.writeText('ui.ver',String(j.v))}}}).catch(()=>{})}})();
