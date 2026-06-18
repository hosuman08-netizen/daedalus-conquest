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
// in-context 런타임 테스트 (META는 vm 렉시컬이라 컨텍스트 안에서 호출)
const T = `(function(){
  var R=[];
  function tryFn(label, f){ try{ f(); R.push('✅ '+label); }catch(e){ R.push('❌ '+label+' — '+e.message); } }
  if(typeof running!=='undefined' && running) running=false;
  META.gold=9999999; META.gems=99999; META.soul=9999;
  tryFn('goldGacha', ()=>goldGacha());
  tryFn('goldGacha10', ()=>goldGacha10());
  tryFn('gacha', ()=>gacha());
  tryFn('gacha10', ()=>gacha10());
  tryFn('gearGacha10', ()=>gearGacha(10));
  tryFn('dismantleDupes', ()=>dismantleDupes());
  // fuseChar: 중복 세팅
  tryFn('fuseChar', ()=>{ META.dupes=META.dupes||{}; var sid=ROSTER.find(function(u){return u.rarity!=='SSR'}).id; META.owned=META.owned||[]; if(META.owned.indexOf(sid)<0)META.owned.push(sid); META.dupes[sid]=5; fuseChar(sid); });
  // soulBuy
  tryFn('soulBuy', ()=>soulBuy(20,{gold:5000}));
  // 영웅 강화
  tryFn('upgradeHero', ()=>{ META.gold=9999999; upgradeHero(); });
  // 부활/몽타주/연출 (cb 없이 안전호출)
  tryFn('playRebirthCeremony', ()=>playRebirthCeremony(function(){}));
  tryFn('ssrSpectacle', ()=>ssrSpectacle('테스트'));
  tryFn('maybeSortie', ()=>{ META.sortieDay=''; maybeSortie(); });
  globalThis.__R = R;
})();`;
try { vm.runInContext(T, sb, {filename:'test'}); } catch(e){ console.log('TEST BLOCK THREW', e.message); }
console.log('\n════ in-context 런타임 ════');
(sb.__R||[]).forEach(function(l){ console.log('  '+l); });
const bad=(sb.__R||[]).filter(function(l){return l[0]==='❌'}).length;
console.log(bad===0 ? '\n🟢 가챠·합성·강화·연출 전부 런타임 클린' : '\n🔴 '+bad+'건 오류');
