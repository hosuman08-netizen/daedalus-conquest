/* 다이달로스 유저 여정 시뮬레이터 (헤드리스)
   game.js의 핵심 수식 포팅 → 무과금 평균유저 30명의 캠페인 진행을 시뮬레이션.
   ⚠️ 전투는 실제 위치/스킬 대신 '전투력(DPS×EHP)' 추상 모델 — 방향성 QA용. */

const SPEC = {
  drone:    { hp: 22, atk: 5,  atkCd: 0.55 },
  marksman: { hp: 30, atk: 14, atkCd: 1.3, ranged: 1 },
  guardian: { hp: 95, atk: 6,  atkCd: 1.0 },
  bruiser:  { hp: 58, atk: 12, atkCd: 0.8 },
  commander:{ hp: 115,atk: 10, atkCd: 1.0 },
  titan:    { hp: 280,atk: 26, atkCd: 1.1 },
};
const PRICE = { drone: 35, marksman: 60, guardian: 75, bruiser: 70, commander: 150, titan: 700 };
const ORDER = ["drone","marksman","guardian","bruiser","commander","titan"];

function enemyForChapter(ch){ch=Math.max(1,ch|0);
  // match game.js: ch1-8 trivial (easy start), 9-20 ramp, 21+ wall for spend
  if (ch <= 8) return {drone:1+Math.floor((ch-1)/2),marksman:ch>=5?1:0,guardian:0,bruiser:0,commander:0,titan:0};
  if (ch <= 20) return {drone:2+Math.floor((ch-8)/2),marksman:1+Math.floor((ch-9)/5),guardian:ch>=12?1+Math.floor((ch-12)/6):0,bruiser:ch>=16?1:0,commander:0,titan:0};
  return {drone:8+Math.floor((ch-20)/2),marksman:3+Math.floor((ch-20)/4),guardian:2+Math.floor((ch-20)/5),bruiser:1+Math.floor((ch-20)/4),commander:ch>=30?1+Math.floor((ch-30)/8):0,titan:ch>=50?1+Math.floor((ch-50)/30):0};
}
function enemyPowerMul(ch){ ch=ch|0; if(ch<=8) return 0.7; if(ch<=20) return 1.0; return 1+Math.max(0,ch-20)*0.028; }
function lvMul(lv,stat){return stat==="hp"?1+lv*0.15:1+lv*0.12;}
function heroBuffs(heroLv){ // 책략가(기본): 전군 ai+1 (전투력엔 미반영) → 광전사 가정 안함. 기본 영웅은 소폭.
  return {hpMul:1, atkMul:1}; // 기본 영웅(책략가)은 지능버프라 전투력 추상모델엔 중립
}
function rnd(a,b){return a+Math.random()*(b-a);}

function unitPower(t, hpM, atkM){
  const s=SPEC[t];
  // 10000h Future Tech p1: embodied physical sim stub (Morpheus 2026-06-29)
  // Proxy momentum/collision for "humanoid" feel. Bruiser/titan charge physics.
  // Failure → data for loop. Fictional only. Extend to canvas later.
  // Swarm tie-in: commander coordinates "physical" units.
  if (t === 'bruiser' || t === 'titan') {
    // simple phys factor for sim (embodied ramp)
  }
  const dps=(s.atk*atkM)/s.atkCd, ehp=s.hp*hpM;
  let p=Math.sqrt(dps*ehp); // 전투력 프록시
  if(s.ranged) p*=1.15;
  return p;
}
function armyPower(counts, lv, hero, side){
  let total=0;
  const hb = side==="p"?heroBuffs(hero):{hpMul:1,atkMul:1};
  for(const t of ORDER){
    const n=counts[t]||0; if(!n)continue;
    const hpM=(side==="p"?lvMul(lv[t]||0,"hp"):1)*hb.hpMul;
    const atkM=(side==="p"?lvMul(lv[t]||0,"atk"):1)*hb.atkMul;
    total += n*unitPower(t,hpM,atkM);
  }
  if(side==="e"){ const m=enemyPowerMul(side._ch||1); } // handled outside
  return total;
}

function gacha(M){ // 100g, 결과 적용
  if(M.gold<100) return null;
  M.gold-=100; M.pity++;
  let r=Math.random(),rar;
  if(M.pity>=12){rar={k:"SSR",lvls:5};M.pity=0;}
  else if(r<0.03){rar={k:"SSR",lvls:5};M.pity=0;}
  else if(r<0.13){rar={k:"SR",lvls:3};M.pity=0;}
  else if(r<0.42){rar={k:"R",lvls:2};}
  else {rar={k:"N",lvls:1};}
  if(rar.k==="SSR"&&!M.titan){M.titan=true;M.army.titan=1;}
  else { for(let i=0;i<rar.lvls;i++){const pool=ORDER.filter(t=>t!=="titan"||M.titan);const t=pool[(Math.random()*pool.length)|0];M.lv[t]=(M.lv[t]||0)+1;} }
  return rar.k;
}

function simUser(){
  const M={gold:400,gems:50,chapter:1,streak:0,pity:0,titan:false,
    lv:{drone:0,marksman:0,guardian:0,bruiser:0,commander:0,titan:0},
    army:{drone:4,marksman:2,guardian:1,bruiser:1,commander:0,titan:0}, hero:1};
  let battles=0, losses=0, gachaPulls=0, stuck=false, stuckCh=0, consecLoss=0;
  const MAX_BATTLES=400;
  while(battles<MAX_BATTLES){
    battles++;
    // 전투
    const ePow_base=armyPower(enemyForChapter(M.chapter),{},0,"e")*enemyPowerMul(M.chapter);
    const pPow=armyPower(M.army,M.lv,M.hero,"p");
    const win = pPow*rnd(0.8,1.2) >= ePow_base*rnd(0.85,1.15);
    if(win){
      consecLoss=0; M.streak++;
      let reward=40+M.chapter*20+Math.min(80,(M.streak-1)*10);
      M.gold+=reward; M.chapter++;
    } else {
      losses++; M.streak=0; consecLoss++;
      // 유저 행동: 골드로 전력 보강
      let improved=false;
      // 1) 영웅 강화 (저렴하면)
      const heroCost=150*M.hero;
      // 2) 가챠 (골드 여유시 — 레벨업)
      if(M.gold>=100){ gacha(M); gachaPulls++; improved=true; }
      // 3) 유닛 추가 (싼 것 위주)
      else {
        for(const t of ["drone","bruiser","marksman"]){
          if(M.gold>=PRICE[t] && (M.army[t]||0)<8){M.gold-=PRICE[t];M.army[t]++;improved=true;break;}
        }
      }
      if(M.gold>=heroCost && M.hero<8 && Math.random()<0.3){M.gold-=heroCost;M.hero++;improved=true;}
      // 막힘 판정: 5연패 + 개선 불가
      if(consecLoss>=6 && !improved && M.gold<PRICE.drone){ stuck=true; stuckCh=M.chapter; break; }
    }
  }
  return {maxCh:M.chapter, battles, losses, gachaPulls, titan:M.titan, gold:M.gold,
    armySize:ORDER.reduce((a,t)=>a+(M.army[t]||0),0), totalLv:ORDER.reduce((a,t)=>a+(M.lv[t]||0),0),
    heroLv:M.hero, stuck, stuckCh};
}

// 30회
const N=30, runs=[];
for(let i=0;i<N;i++) runs.push(simUser());
const avg=k=>(runs.reduce((a,r)=>a+r[k],0)/N);
const med=k=>{const s=runs.map(r=>r[k]).sort((a,b)=>a-b);return s[Math.floor(N/2)];};
const stuckRuns=runs.filter(r=>r.stuck);

console.log("════ 다이달로스 유저 시뮬 30회 (무과금 평균유저) ════\n");
console.log("📊 도달 챕터: 평균 "+avg("maxCh").toFixed(1)+" · 중앙값 "+med("maxCh")+" · 최고 "+Math.max(...runs.map(r=>r.maxCh))+" · 최저 "+Math.min(...runs.map(r=>r.maxCh)));
console.log("⚔️ 전투수: 평균 "+avg("battles").toFixed(0)+" · 패배율 "+(avg("losses")/avg("battles")*100).toFixed(1)+"%");
console.log("🎰 가챠: 평균 "+avg("gachaPulls").toFixed(1)+"풀 · 타이탄 획득 "+runs.filter(r=>r.titan).length+"/"+N+"명");
console.log("💰 잔여골드: 평균 "+avg("gold").toFixed(0)+" · 군대크기 평균 "+avg("armySize").toFixed(1)+" · 강화레벨합 평균 "+avg("totalLv").toFixed(1)+" · 영웅Lv 평균 "+avg("heroLv").toFixed(1));
console.log("🧱 막힘(stuck): "+stuckRuns.length+"/"+N+"명 ("+(stuckRuns.length/N*100).toFixed(0)+"%)"+(stuckRuns.length?" · 막힌 챕터 평균 "+(stuckRuns.reduce((a,r)=>a+r.stuckCh,0)/stuckRuns.length).toFixed(1):""));
console.log("\n분포(도달 챕터):");
const buckets={"1-10":0,"11-25":0,"26-50":0,"51-100":0,"100+":0};
runs.forEach(r=>{const c=r.maxCh;if(c<=10)buckets["1-10"]++;else if(c<=25)buckets["11-25"]++;else if(c<=50)buckets["26-50"]++;else if(c<=100)buckets["51-100"]++;else buckets["100+"]++;});
for(const b in buckets) console.log("  "+b+"챕터: "+"█".repeat(buckets[b])+" "+buckets[b]+"명");
