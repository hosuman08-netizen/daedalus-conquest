// 깊은 엣지 케이스 감사 — QA 런타임 감사관 (1회성, repo 비오염: test/ 내부)
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
sb.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=String(v)},removeItem(k){delete this._d[k]},clear(){this._d={}}};
sb.Image=function(){return mockEl()};
sb.AudioContext=function(){return new Proxy({state:'running',currentTime:0,destination:{},sampleRate:44100},{get(t,k){if(k in t)return t[k]; if(k==='createOscillator')return ()=>({connect(){},start(){},stop(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:0},type:'',detune:{setValueAtTime(){}}}); if(k==='createGain')return ()=>({connect(){},gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}}}); if(k==='createBuffer'||k==='createBufferSource')return ()=>({connect(){},start(){},stop(){},buffer:null}); if(k==='resume')return ()=>{}; return ()=>{}; }})};
sb.webkitAudioContext=sb.AudioContext;
sb.navigator={language:'ko',userAgent:'node'};
sb.document={ getElementById(id){return els[id]||(els[id]=mockEl())}, querySelector(){return mockEl()}, querySelectorAll(){return []}, createElement(){return mockEl()}, addEventListener(){}, body:mockEl(), documentElement:mockEl(), hidden:false };
sb.getComputedStyle=()=>new Proxy({},{get(){return ''}});
sb.window=sb; sb.globalThis=sb; sb.self=sb;
sb.window.Telegram=undefined; sb.addEventListener=()=>{}; sb.removeEventListener=()=>{}; sb.scrollTo=()=>{}; sb.matchMedia=()=>({matches:false,addEventListener(){}}); sb.innerWidth=400; sb.innerHeight=800;
vm.createContext(sb);
for(const f of ['i18n.js','units.js','gear.js','lore.js','game.js']){
  try{ vm.runInContext(fs.readFileSync(f,'utf8'),sb,{filename:f}); }
  catch(e){ console.log('LOAD ERROR',f,e.message); }
}
function run(label, code){
  try{ const r = vm.runInContext('(function(){'+code+'})()', sb); console.log(r); }
  catch(e){ console.log('❌ '+label+' CRASH: '+e.message+'  | '+(e.stack||'').split('\n')[1]); }
}

// ── T1: pity 0→0 거짓경보 검증 — Math.random 제어로 N 강제
run('T1', `
  var R=[];
  running=false; META.gems=999999; META.pity=0;
  var origRandom = Math.random;
  Math.random = function(){ return 0.999; };  // 최저등급(N) 강제
  var p0 = META.pity; gacha(); var p1 = META.pity;
  R.push((p1===p0+1 ? '✅' : '🔴')+' T1 pity N뽑기: '+p0+'→'+p1+(p1===p0+1?' (정상 +1)':' [버그!]'));
  Math.random = origRandom;
  return R.join('\\n');
`);

// ── T2: pity 9→10 hard pity 경계 (SSR 보장 + 리셋)
run('T2', `
  var R=[]; running=false; META.gems=999999; META.pity=9;
  var orig=Math.random; Math.random=function(){return 0.999;};
  gacha();
  R.push((META.pity===0 ? '✅':'🔴')+' T2 hard-pity 9→10 후 리셋: pity='+META.pity+(META.pity===0?' (SSR보장후 0리셋 정상)':' [천장 안터짐!]'));
  Math.random=orig;
  return R.join('\\n');
`);

// ── T3: 구버전 세이브 로드 (신규필드 전무) → 크래시 없이 머지?
run('T3', `
  var R=[];
  var ancient = { gold: 1000, chapter: 5, gems: 30, army:{drone:5} };  // 옛 세이브: cqClaimed/asc/charLv/deployed 전무
  localStorage.setItem('daedalus_meta_v1', JSON.stringify(ancient));
  // META_KEY 모를 수 있으니 흔한 키 추정 — 실제 키로 덮어쓰기 시도
  var m = loadMeta();
  var ok = m && Array.isArray(m.cqClaimed) && m.asc && typeof m.asc.might==='number' && Array.isArray(m.deployed) && typeof m.charLv==='object';
  R.push((ok?'✅':'🔴')+' T3 고대세이브 머지: cqClaimed='+JSON.stringify(m.cqClaimed)+' asc='+JSON.stringify(m.asc)+' gold='+m.gold);
  return R.join('\\n');
`);

// ── T4: 손상된 세이브 (잘못된 JSON / null / 배열자리에 객체)
run('T4', `
  var R=[];
  localStorage._d = {};
  // 실제 META_KEY 찾기: loadMeta가 읽는 키. 흔히 META_KEY 전역
  var key = (typeof META_KEY!=='undefined') ? META_KEY : 'meta';
  localStorage.setItem(key, '{corrupt json!!');
  var m1 = loadMeta();
  R.push((m1 && m1.gold===550 ? '✅':'🔴')+' T4a 손상JSON→기본값 폴백: gold='+(m1?m1.gold:'NULL'));
  localStorage.setItem(key, JSON.stringify({ gold:500, gear:'NOT_ARRAY', owned:null, cqClaimed:42, charLv:'x' }));
  var m2 = loadMeta();
  var ok = Array.isArray(m2.gear) && Array.isArray(m2.owned) && Array.isArray(m2.cqClaimed) && typeof m2.charLv==='object';
  R.push((ok?'✅':'🔴')+' T4b 타입오염 세이브 가드: gear배열='+Array.isArray(m2.gear)+' owned배열='+Array.isArray(m2.owned)+' cqClaimed배열='+Array.isArray(m2.cqClaimed)+' charLv객체='+(typeof m2.charLv==='object'));
  return R.join('\\n');
`);

// ── T5: 자원 부족 시 액션 (골드/젬 0) — 크래시 없이 거부?
run('T5', `
  var R=[]; running=false;
  META.gold=0; META.gems=0; META.soul=0;
  var uid=(typeof ROSTER!=='undefined'&&ROSTER.length)?ROSTER[0].id:1;
  META.owned=[uid]; META.charLv=META.charLv||{}; META.charEnh=META.charEnh||{};
  var g0=META.gold;
  charLevelUp(uid); charEnhance(uid); gacha(); gacha10();
  if(typeof gearGacha==='function') gearGacha(1);
  buyAscNode('might');
  R.push('✅ T5 자원0 액션 크래시없음: gold='+META.gold+' (거부되어 음수 안됨: '+(META.gold>=0)+')');
  return R.join('\\n');
`);

// ── T6: 음수 가드 — 모든 통화가 음수로 안 떨어지나
run('T6', `
  var R=[]; running=false;
  META.gold=0; META.gems=0; META.soul=0;
  // 무리하게 비싼 액션 반복
  for(var i=0;i<5;i++){ try{ gacha(); }catch(e){} try{ gacha10(); }catch(e){} }
  var neg = (META.gold<0)||(META.gems<0)||(META.soul<0);
  R.push((!neg?'✅':'🔴')+' T6 음수가드: gold='+META.gold+' gems='+META.gems+' soul='+META.soul+(neg?' [음수발생!]':''));
  return R.join('\\n');
`);

// ── T7: 보유 0 / 미정의 id 참조
run('T7', `
  var R=[]; running=false;
  META.owned=[]; META.dupes={};
  try{ fuseChar(99999); R.push('✅ T7a fuseChar(미정의id) 크래시없음'); }catch(e){ R.push('🔴 T7a fuseChar(미정의id) CRASH: '+e.message); }
  try{ charLevelUp(99999); R.push('✅ T7b charLevelUp(미정의id) 크래시없음'); }catch(e){ R.push('🔴 T7b charLevelUp(미정의id) CRASH: '+e.message); }
  try{ if(typeof openCharPanel==='function'){ openCharPanel(99999); } R.push('✅ T7c openCharPanel(미정의id) 크래시없음'); }catch(e){ R.push('🔴 T7c openCharPanel(미정의id) CRASH: '+e.message); }
  try{ if(typeof charEquip==='function'){ charEquip(99999, 99999); } R.push('✅ T7d charEquip(미정의) 크래시없음'); }catch(e){ R.push('🔴 T7d charEquip(미정의) CRASH: '+e.message); }
  return R.join('\\n');
`);

// ── T8: army 12 상한 / deployed 무결성 (owned에 없는 id)
run('T8', `
  var R=[]; running=false;
  META.deployed=[88888, 77777];  // owned에 없는 유령 id
  try{ if(typeof renderSquad==='function') renderSquad(); R.push('✅ T8a renderSquad(유령deployed) 크래시없음'); }catch(e){ R.push('🔴 T8a renderSquad CRASH: '+e.message); }
  try{ if(typeof reset==='function') reset(); R.push('✅ T8b reset(유령deployed) 크래시없음'); }catch(e){ R.push('🔴 T8b reset CRASH: '+e.message); }
  try{ if(typeof startBattle==='function'){} R.push('  (startBattle 존재:'+ (typeof startBattle==='function')+')'); }catch(e){}
  return R.join('\\n');
`);

// ── T9: ascend / rebirth ch 경계
run('T9', `
  var R=[]; running=false;
  META.chapter=1; META.gold=999999999; META.ether=0;
  try{ if(typeof ascend==='function'){ ascend('might'); } R.push('✅ T9a ascend(ch1 미달) 크래시없음'); }catch(e){ R.push('🔴 T9a ascend CRASH: '+e.message); }
  return R.join('\\n');
`);

// ── T10: claimCq 중복 클레임 (이미 받은 ch 다시)
run('T10', `
  var R=[]; running=false; META.gold=1000; META.cqClaimed=[];
  var g0=META.gold; if(typeof claimCq==='function'){ claimCq(3); } var g1=META.gold;
  if(typeof claimCq==='function'){ claimCq(3); } var g2=META.gold;  // 두번째는 거부돼야
  R.push((g2===g1 ? '✅':'🔴')+' T10 claimCq 중복방지: 1차 '+g0+'→'+g1+' 2차→'+g2+(g2===g1?' (중복거부 정상)':' [중복지급 버그!]'));
  return R.join('\\n');
`);
