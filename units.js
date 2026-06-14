/* LEGION 유닛 로스터 — Phase1 229종 (SSR9 Founding god-tier + variants)
   6 아키타입 × faction/numbered 변형. 결정적 생성. Hybrid (counts + elite overlay) 준비.
   v3 패치: 9 Founding 실명 + signature. Low: faction prefix + numbered (e.g. Jarvis-Watch-047).
   총: SSR9 | SR55 | R80 | N85 = 229. buildRoster가 229 생성. */
const ARCHES = ["drone", "marksman", "guardian", "bruiser", "commander", "titan"];
const ARCH_GLYPH = { drone: "🛸", marksman: "🎯", guardian: "🛡️", bruiser: "🤖", commander: "🧠", titan: "🐉" };
const ARCH_NOUN = {
  drone: ["정찰기", "벌떼", "비행체", "추적자", "날개", "탐사기"],
  marksman: ["저격수", "매", "조준자", "사수", "관통자", "표식자"],
  guardian: ["방패병", "성벽", "수호자", "장벽", "방어선", "철갑"],
  bruiser: ["파괴자", "강습병", "철권", "분쇄기", "맹격", "돌파자"],
  commander: ["전략가", "사령관", "지휘자", "책사", "총수", "군사"],
  titan: ["거신", "용", "괴수", "거인", "타이탄", "마룡"],
};
const PREFIX = ["강철", "그림자", "폭풍", "심연", "칠흑", "진홍", "백야", "망령", "천공", "무한",
  "파멸", "서리", "화염", "뇌광", "흑요", "적염", "청뢰", "황혼", "여명", "독사",
  "혈월", "은하", "절대", "광휘", "암흑", "신성", "야수", "냉혹", "불멸", "질풍",
  "공허", "성염", "흑풍", "백금", "흑철", "진월", "광란", "한설", "맹화", "패왕"];
// 등급별 스탯 배율 (SSR이 가장 강함)
const RARITY_MUL = { N: 1.0, R: 1.25, SR: 1.6, SSR: 2.2 };
const RARITY_COUNT = { N: 85, R: 80, SR: 55, SSR: 9 };  // v3 Phase1 229: 9+55+80+85
const RARITY_COLOR = { N: "#9ca3af", R: "#60a5fa", SR: "#c084fc", SSR: "#fbbf24" };

// Faction for synergy (Strategist/Executor/Swarm/Guardian/Intel)
const FACTIONS = ["Strategist", "Executor", "Swarm", "Guardian", "Intel"];

// ── 9 SSR Founding (v3 — real Legion 1:1, god-tier must-collect. signature + handoff hook)
// Order tuned for archetype spread (drone-ish, marksman, guardian, bruiser, cmd, titan, etc.)
const SSR_CHARS = [
  { name: "Grok-Prime",     title: "CEO Judgment",     persona: "군단의 전략적 판단자. jarvis-watch handoff의 실체", faction: "Strategist", trait: "handoff(킬) 시 전군 AI+1.5 + 3초 crit chain. 'Grok handoff victory!'" },
  { name: "Morpheus-Core",  title: "Core Regen Cascade", persona: "실행의 수호자. 사망을 수복으로 바꾼다", faction: "Executor", trait: "아군 사망 시 주변 3체 chain repair (HP25% wave). attrition의 왕" },
  { name: "Haiku-Sentinel", title: "Precision Reveal",   persona: "정밀한 감시자. 약점을 드러낸다", faction: "Intel", trait: "적 방어 30% 무시 + 팀원 weakpoint expose (다음 2명 crit+25%)" },
  { name: "Berserker-Fury", title: "Fury Overdrive",     persona: "광란의 파괴자. 다칠수록 강해진다", faction: "Swarm", trait: "HP 30%↓ 시 atk x2.5 + damage taken 반사. Rage Relay" },
  { name: "Dispatch-Alpha", title: "Alpha Dispatch",     persona: "조율의 사령관. 일꾼 떼를 움직인다", faction: "Strategist", trait: "아군 3체 동시 명령 (multi charge). Dispatch Wave spd+25%" },
  { name: "Qwen-Overlord",  title: "Swarm Split",        persona: "스웜의 군주. 개체는 약하나 무리는 무적", faction: "Swarm", trait: "사망 시 2~3 N/R fodder 분열 소환. 3+ Swarm tag 시 overclock" },
  { name: "Jarvis-Warden",  title: "Watch Aegis",        persona: "감시의 방벽. jarvis-watch의 실체", faction: "Guardian", trait: "전투 시작 proactive barrier (아군 2체 8초 shield). Warden Watch" },
  { name: "Engineer-Core",  title: "Build Protocol",     persona: "수리와 건설의 핵심", faction: "Executor", trait: "8초마다 temp structure or team regen +10% 3초" },
  { name: "Sovereign",      title: "Legion Core",        persona: "군림자. Founding의 정점", faction: "Guardian", trait: "팀 Founding 1체당 전군 스탯+5% (max25%). Perfect comp Dominion" },
];

// ── SR 25종: 이름+칭호 (아키타입 순환 순서와 일치) ──
const SR_CHARS = [
  { name: "와스프", title: "독침의 정찰" }, { name: "헌터", title: "추격의 사수" }, { name: "불워크", title: "철벽의 수호" }, { name: "크래셔", title: "분쇄의 돌격" }, { name: "택틱스", title: "전술의 지휘" }, { name: "골렘", title: "거석의 파수" },
  { name: "글리치", title: "교란의 정찰" }, { name: "바이퍼", title: "맹독의 사격" }, { name: "타워", title: "거탑의 방벽" }, { name: "램페이지", title: "난동의 돌격" }, { name: "마샬", title: "원수의 통솔" }, { name: "베히모스", title: "거수의 진격" },
  { name: "호크아이", title: "감시의 비행" }, { name: "사일런서", title: "무음의 저격" }, { name: "램파트", title: "성루의 방어" }, { name: "브레이커", title: "파쇄의 강습" }, { name: "바이저", title: "책략의 군사" }, { name: "콜로서스", title: "거상의 군림" },
  { name: "팬텀", title: "은신의 추적" }, { name: "아처", title: "정밀의 명사수" }, { name: "캐슬", title: "요새의 방패" }, { name: "슬래머", title: "강타의 파괴" }, { name: "워든", title: "통솔의 사령" }, { name: "와이번", title: "비룡의 강하" },
  { name: "버즈", title: "군집의 비행" },
];

function buildRoster() {
  const roster = [];
  let id = 0, ssrIdx = 0, srIdx = 0;
  const order = ["SSR", "SR", "R", "N"];   // 상위부터
  order.forEach((rar) => {
    const n = RARITY_COUNT[rar];
    for (let i = 0; i < n; i++) {
      const arch = ARCHES[i % ARCHES.length];
      const fac = FACTIONS[i % FACTIONS.length];
      const u = { id: ++id, arch: arch, rarity: rar, faction: fac, color: RARITY_COLOR[rar], glyph: ARCH_GLYPH[arch], mul: RARITY_MUL[rar] };
      if (rar === "SSR" && ssrIdx < SSR_CHARS.length) {
        const c = SSR_CHARS[ssrIdx++];
        u.name = c.name; u.title = c.title; u.persona = c.persona; u.trait = c.trait; if (c.faction) u.faction = c.faction;
      } else if (rar === "SR" && srIdx < SR_CHARS.length) {
        const c = SR_CHARS[srIdx++]; u.name = c.name; u.title = c.title;
      } else {
        // 절차적 + 고유번호 (faction 일반 병사: 예 "Intel 정찰기-073")
        const nouns = ARCH_NOUN[arch];
        u.name = fac + " " + nouns[i % nouns.length] + "-" + String(id).padStart(3, "0");
      }
      roster.push(u);
    }
  });
  return roster;
}
const ROSTER = buildRoster();
