const fs = require('fs'), vm = require('vm');
const chain = () => new Proxy(function(){}, { get(t,k){ if(k==='length')return 0; if(k===Symbol.iterator)return [][Symbol.iterator].bind([]); return chain(); }, apply(){ return chain(); } });
function mockEl(){
  const e = { textContent:'', innerHTML:'', value:'', dataset:{}, style:new Proxy({},{get(t,k){if(k==='removeProperty'||k==='setProperty'||k==='getPropertyValue')return ()=>'';return t[k]??'';},set(t,k,v){t[k]=v;return true}}),
    classList:{add(){},remove(){},toggle(){},contains(){return false}}, offsetWidth:100, clientWidth:360, width:360, height:360,
    children:[], firstChild:null, checked:false,
    addEventListener(){}, removeEventListener(){}, appendChild(){}, removeChild(){}, remove(){}, setAttribute(){}, getAttribute(){return null},
    querySelector(){return mockEl()}, querySelectorAll(){return []}, getContext(){return ctx()}, getBoundingClientRect(){return{width:360,height:360,top:0,left:0}},
    insertBefore(){}, cloneNode(){return mockEl()}, closest(){return null}, focus(){}, click(){} };
  e.parentElement = { clientWidth:360, appendChild(){}, style:{} };
  return e;
}
function ctx(){ return new Proxy({ canvas:{width:360,height:360}, measureText(){return{width:10}} }, { get(t,k){ if(k in t)return t[k]; if(k==='createRadialGradient'||k==='createLinearGradient')return ()=>({addColorStop(){}}); return ()=>{}; }, set(){return true} }); }
const els={};
const sb = {};
sb.console=console; sb.Math=Math; sb.Date=Date; sb.JSON=JSON; sb.Object=Object; sb.Array=Array; sb.String=String; sb.Number=Number; sb.Boolean=Boolean; sb.RegExp=RegExp; sb.isNaN=isNaN; sb.parseInt=parseInt; sb.parseFloat=parseFloat; sb.Set=Set; sb.Map=Map; sb.Symbol=Symbol; sb.Proxy=Proxy; sb.Error=Error;
sb.setTimeout=()=>0; sb.clearTimeout=()=>{}; sb.setInterval=()=>0; sb.clearInterval=()=>{}; sb.requestAnimationFrame=()=>0; sb.cancelAnimationFrame=()=>{};
sb.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=String(v)},removeItem(k){delete this._d[k]}};
sb.Image=function(){return mockEl()};
sb.AudioContext=function(){return new Proxy({state:'running',currentTime:0,destination:{},sampleRate:44100},{get(t,k){if(k in t)return t[k]; if(k==='createOscillator')return ()=>({connect(){},start(){},stop(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:0},type:'',detune:{setValueAtTime(){}}}); if(k==='createGain')return ()=>({connect(){},gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}}}); if(k==='createBuffer'||k==='createBufferSource')return ()=>({connect(){},start(){},stop(){},buffer:null}); if(k==='resume')return ()=>{}; return ()=>{}; }})};
sb.webkitAudioContext=sb.AudioContext;
sb.navigator={language:'ko',userAgent:'node'};
sb.document={ getElementById(id){return els[id]||(els[id]=mockEl())}, querySelector(){return mockEl()}, querySelectorAll(){return []}, createElement(){return mockEl()}, addEventListener(){}, body:mockEl(), documentElement:mockEl(), hidden:false };
sb.getComputedStyle=()=>new Proxy({},{get(){return ''}});
sb.window=sb; sb.globalThis=sb; sb.self=sb;
sb.window.Telegram=undefined; sb.addEventListener=()=>{}; sb.removeEventListener=()=>{}; sb.scrollTo=()=>{}; sb.matchMedia=()=>({matches:false,addEventListener(){}}); sb.innerWidth=400; sb.innerHeight=800;
vm.createContext(sb);
let fail=0;
for(const f of ['i18n.js','units.js','gear.js','lore.js','game.js']){
  try{ vm.runInContext(fs.readFileSync(f,'utf8'),sb,{filename:f}); console.log('LOAD',f,'✅'); }
  catch(e){ fail++; console.log('LOAD ERROR',f,'❌',e.message,'\n',(e.stack||'').split('\n').slice(0,3).join('\n')); }
}
// 핵심 함수 런타임 호출

const T = `(function(){
  var R=[];
  function chk(label, field, f){
    try{
      var before = (function(){ try{ return eval(field); }catch(e){ return undefined; } })();
      f();
      var after = (function(){ try{ return eval(field); }catch(e){ return undefined; } })();
      if(after === undefined){ R.push('⚠️ '+label+' — 필드('+field+') 못읽음'); return; }
      var changed = JSON.stringify(after)!==JSON.stringify(before);
      R.push((changed?'✅':'🔴')+' '+label+' : '+field+' '+JSON.stringify(before)+'→'+JSON.stringify(after)+(changed?'':'  [안변함!]'));
    }catch(e){ R.push('❌ '+label+' — '+e.message); }
  }
  if(typeof running!=='undefined') running=false;
  META.gold=99999999; META.gems=999999; META.soul=999999; META.ether=99999;
  META.chapter=50;
  var uid = (typeof ROSTER!=='undefined' && ROSTER.length) ? ROSTER[0].id : 1;
  META.owned=[uid]; if(!META.charLv)META.charLv={}; if(!META.charEnh)META.charEnh={};
  META.dupes=META.dupes||{}; META.dupes[uid]=5;
  if(!META.heroLv)META.heroLv={strategist:1,berserker:1,warden:1,ranger:1,mech:1,engineer:1,dragoon:1};
  META.hero='strategist';                       // ✅ 유효 영웅키
  if(!META.asc)META.asc={might:0,bulwark:0,momentum:0};
  if(!META.lv)META.lv={}; if(!META.gear)META.gear=[];
  if(!META.attend)META.attend={day:0,last:''};
  META.cqClaimed=[];

  chk('claimCq(3) 골드', 'META.gold', ()=>claimCq(3));
  chk('upgradeHero 영웅레벨', 'META.heroLv[META.hero]', ()=>upgradeHero());
  chk('upgradeHero 골드소비', 'META.gold', ()=>upgradeHero());
  chk('charLevelUp 캐릭레벨', 'META.charLv['+uid+']', ()=>charLevelUp(uid));
  chk('charEnhance 골드소비', 'META.gold', ()=>charEnhance(uid));
  chk('fuseChar 중복소비', 'META.dupes['+uid+']', ()=>fuseChar(uid));
  chk('goldGacha 일일뽑기', 'META.dailyPulls', ()=>goldGacha());
  chk('gacha 천장', 'META.pity', ()=>gacha());
  chk('gacha10 젬소비', 'META.gems', ()=>gacha10());
  chk('gearGacha(1) 장비수', 'META.gear.length', ()=>gearGacha(1));
  chk('claimCq(3) 골드', 'META.gold', ()=>{ if(typeof claimCq==='function'){ META.cqClaimed=[]; META.chapter=50; claimCq(3); } });
  chk('claimAttend 골드', 'META.gold', ()=>{ META.attend={day:0,last:''}; claimAttend(); });
  chk('grantPack(starter) 골드', 'META.gold', ()=>{ META.starter=false; grantPack('starter'); });
  chk('buyAscNode 노드레벨', 'META.asc.might', ()=>buyAscNode('might'));

  return R.join('\\n');
})()`;
try{ console.log('\n=== 눌러서 수치 오르나 — 정밀 재검증 ===\n'+vm.runInContext(T,sb)); }
catch(e){ console.log('AUDIT 오류:', e.message); }
