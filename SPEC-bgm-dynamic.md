# Daedalus — Dynamic Phonk BGM Spec (v1)

**역할**: 작곡 디렉터 (Grok) → Morpheus(COO) 구현  
**목표**: 기존 static 16-step 반복 → sectional energy arc (느림→빨라짐→릴리스). esdeekid/phonk dark groovy. 완전 오리지널 패턴.  
**악기 재사용 100%**: kick(triangle sweep), clap(hat burst+square), hat(square), 808(sine slide), cowbell(triangle), pad(sine/saw).  
**총 루프**: 12 bars (192 steps) seamless. master step counter.

## 1. 섹션 구조 (bar = 16 steps)

- **Intro** (2 bars, 175ms/step ≈86BPM, heavy swing)  
  에너지: 낮은 텐션.  
  활성: kick(0,10), 808 sparse, low sine pad, minimal hat. cowbell 거의 없음.

- **Build** (4 bars, 148ms/step ≈101BPM)  
  에너지: 상승.  
  활성: +clap(8), hat 증가, cowbell light motif, 808 syncopated.

- **Drop** (4 bars, 118ms/step ≈127BPM)  
  에너지: 피크. "빨라지는" 체감 핵심.  
  활성: 전부 + hat roll + 808 denser + cowbell aggressive.

- **Break** (2 bars, 138ms/step ≈109BPM)  
  에너지: 다운.  
  활성: kick+long 808, atmospheric pad, cowbell sparse echo. clap/hat 거의 off. → Intro로 자연 연결.

**구현 팁**: globalStep 계속 증가. bar = (globalStep/16)|0 ; sec = ["intro","intro","build","build","build","build","drop","drop","drop","drop","break","break"][bar%12]  
section 변경 시 (globalStep%16===0 && cross) clearInterval + new setInterval(bgmTick, newMs)

## 2. 코드 진행 (단조 C minor family, Hz)

```js
const DYN_CHORDS = [
  [130.81, 155.56, 196.00], // Cm (i)
  [103.83, 130.81, 155.56], // Ab (VI)
  [116.54, 146.83, 174.61], // Bb (VII)
  [ 98.00, 116.54, 146.83]  // Gm (v)
];
const DROP_CHORDS = [
  [130.81, 155.56, 196.00], // Cm
  [174.61, 207.65, 261.63], // Fm (iv) — 긴장
  [103.83, 130.81, 155.56], // Ab
  [116.54, 146.83, 174.61]  // Bb
];
```

- Intro: Cm 고정 (2 bars)
- Build/Break: DYN_CHORDS[bar % 4]
- Drop: DROP_CHORDS[bar % 4]
- root = chord[0] (808용)
- melody tone = chord[idx-1] (1=root, 2=m3, 3=5th)

## 3. 멜로디 모티프 (cowbell, 16-step, 0=rest, 1~3=chord tone)

```js
const MELODY = {
  intro: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,3,0],
  build: [1,0,0,2,0,0,1,0,0,3,0,0,1,0,0,2],
  drop:  [1,0,2,0,1,0,3,0,0,1,0,2,1,3,0,1], // denser + sync
  break: [1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0]  // sparse echo
};
```

**변주**: Drop에서는 step%2==1 && val>0 이면 vol*1.1 + 약간 높은 옥타브( *1.02 ) 선택적.

## 4. 드롭 '빨라짐' 만드는 법 (기존 함수만 사용)

- **Tempo**: 118ms (실제 클럭 빨라짐)
- **Hat roll** (체감 2~4배 속도):
  ```js
  const DROP_ROLL = [2,6,10,14];
  if (sec==='drop' && DROP_ROLL.includes(step)) {
    for (let r=0; r<4; r++) setTimeout(() => bgmHat(0.014), r*21);
  }
  ```
- **808 double**: drop 패턴에 off-beat 1 추가 + 기존 슬라이드 유지
- **Clap ghost**: drop에서 step 4,12 에 낮은 vol bgmClap(0.018) 추가 (기존 clap은 8)
- **Cowbell**: drop motif 밀도 높음 + swing 적게 (또는 D() 최소화)
- **Pad**: drop에서 sawtooth 살짝 (vol 낮게) 추가로 레이어

## 5. 전체 패턴 (kick/clap/hat/bass — 0/1, 16-step)

```js
const PAT = {
  kick: {
    intro: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    build: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    drop:  [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0], // extra
    break: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
  clap: {
    intro: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    build: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    drop:  [0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // 2&4 + ghost
    break: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
  hat: {
    intro: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    build: [0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1],
    drop:  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], // dense base (rolls 별도)
    break: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
  bass: { // 1=bgm808(root, long, vol)
    intro: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    build: [1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0],
    drop:  [1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0], // denser + double
    break: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  // long slide 강조 (dur 0.7+)
  }
};
```

**Swing**: 기존 D() 로직 유지. Intro/Build 강하게(48ms), Drop/Break 약하게(22ms) 또는 off 시.

## 6. bgmTick 스케치 (직접 이식 가능)

```js
function bgmTick() {
  const step = bgmGlobalStep % 16;
  const bar = (bgmGlobalStep / 16) | 0;
  const sec = getSection(bar); // 12-bar 매핑 함수
  const chords = (sec === 'drop') ? DROP_CHORDS : DYN_CHORDS;
  const ch = chords[bar % (sec==='intro'?1:4)];
  const root = ch[0];
  const melIdx = MELODY[sec][step];
  const sw = (sec==='drop' || sec==='break') ? 22 : 48;
  const D = (fn, d=sw) => (step%2===1 && d) ? setTimeout(fn, d) : fn();

  // kick
  if (PAT.kick[sec][step]) bgmKick(sec==='drop'?0.16:0.12);
  // clap (+ghost in drop)
  if (PAT.clap[sec][step]) D(() => bgmClap(sec==='drop'?0.032:0.026));
  if (sec==='drop' && (step===4 || step===12)) bgmClap(0.018);

  // hat (+roll)
  if (PAT.hat[sec][step]) D(() => bgmHat(sec==='drop'?0.011:0.007));
  if (sec==='drop' && DROP_ROLL.includes(step)) {
    for (let r=0;r<4;r++) setTimeout(()=>bgmHat(0.013), r*21);
  }

  // 808
  if (PAT.bass[sec][step]) {
    const dur = (sec==='break') ? 0.72 : (sec==='drop'?0.48:0.55);
    bgm808(root, dur, sec==='drop'?0.22:0.17);
  }

  // cowbell melody
  if (melIdx) {
    let f = ch[melIdx-1];
    if (sec==='drop' && step%2) f *= 1.018;
    const v = (sec==='drop'?0.028:(sec==='break'?0.015:0.021));
    D(() => bgmCowbell(f, v));
  }

  // pad (sine low / saw build-drop)
  if (step === 0) {
    const pVol = (sec==='drop'?0.015:(sec==='break'?0.009:0.011));
    const pType = (sec==='build'||sec==='drop') ? 'sawtooth' : 'sine';
    const pDur = (sec==='break') ? 1.8 : 1.2;
    bgmTone(ch[1]*0.5, pDur, pType, pVol);
  }

  bgmGlobalStep++;
}
```

**startSynthBgm**: bgmGlobalStep=0; currentMs = 175; setInterval(bgmTick, currentMs) + section watch inside tick.

기존 start/stop/bgmStart 그대로 유지 (mp3 fallback 우선).

## 7. 세부 / 안전

- 모든 vol 기존 대비 ±20% 내 (폰 스피커 호환).
- Swing D() 는 cowbell/hat/clap에만. kick/808은 on-grid.
- section 변경 타이밍: bar 시작점 (step==0) 에서 ms 교체 → 드리프트 최소.
- META.music===false 가드 기존 유지.
- 총 루프 12bar 후 자동 %12 로 반복 (Break→Intro 연결 자연스럽게 low pad+sparse kick으로 텐션 리셋).
- 테스트 포인트: Drop 들어갈 때 "빨라졌다" 즉각 체감 (템포+롤+밀도).

**구현 순서 (Morpheus)**: 1) const + getSection 2) PAT/MELODY/CHORDS 3) bgmTick rewrite 4) startSynthBgm ms 처리 + globalStep 5) 기존 함수 건드리지 말고 호출만.

이 spec으로 1회 교체 후 바로 플레이 테스트. 오리지널 phonk 그루브 완성.
