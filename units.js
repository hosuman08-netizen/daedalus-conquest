/* LEGION 유닛 로스터 — 123종 (N50·R37·SR25·SSR11)
   6 아키타입(전투 엔진 역할) × 등급 변형. 결정적 생성(매번 동일). */
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
const RARITY_COUNT = { N: 50, R: 37, SR: 25, SSR: 11 };
const RARITY_COLOR = { N: "#9ca3af", R: "#60a5fa", SR: "#c084fc", SSR: "#fbbf24" };

// ── SSR 11종: 개성 부여 (아키타입 순서와 일치: drone,mark,guard,bruise,cmd,titan,drone,mark,guard,bruise,cmd) ──
const SSR_CHARS = [
  { name: "녹스",     title: "천 개의 눈",   persona: "말없이 모든 걸 관측하는 냉혈 정찰 지능", trait: "적 전체 간파 → 아군 명중·치명타↑" },
  { name: "레이븐",   title: "일격필살",     persona: "침묵의 저격수, 한 발이면 충분",          trait: "첫 사격 치명타 확정" },
  { name: "아틀라스", title: "불괴의 방벽",   persona: "흔들림 없는 과묵한 수호자",              trait: "받은 피해 일부 반사" },
  { name: "버서커",   title: "광란의 폭주",   persona: "분노에 잠식, 다칠수록 강해진다",         trait: "HP 낮을수록 공격력 폭증" },
  { name: "오라클",   title: "모든 수를 읽는 자", persona: "전장을 체스판으로 보는 냉정한 천재", trait: "전군 지능+2 (최적 표적)" },
  { name: "라그나",   title: "종말의 마룡",   persona: "재앙 그 자체, 압도적 침묵",             trait: "전장을 불태우는 강림" },
  { name: "스웜",     title: "벌떼 군주",     persona: "개체는 약하나 무리는 무적",             trait: "처치당할수록 분열 증식" },
  { name: "팰컨",     title: "폭풍의 사수",   persona: "속사·화려·자신만만",                    trait: "연사 가속" },
  { name: "이지스",   title: "빛의 수호기사", persona: "헌신과 정의의 화신",                    trait: "아군 전체 보호막" },
  { name: "타이런트", title: "강습 폭군",     persona: "오만한 압도적 완력",                    trait: "돌진 광역 강화" },
  { name: "소버린",   title: "군림자",       persona: "절대 권위, 군단의 정점",                trait: "전군 전 스탯 강화" },
];

function buildRoster() {
  const roster = [];
  let id = 0, pi = 0, ssrIdx = 0;
  const order = ["SSR", "SR", "R", "N"];   // 상위부터
  order.forEach((rar) => {
    const n = RARITY_COUNT[rar];
    for (let i = 0; i < n; i++) {
      const arch = ARCHES[i % ARCHES.length];
      const u = { id: ++id, arch: arch, rarity: rar, color: RARITY_COLOR[rar], glyph: ARCH_GLYPH[arch], mul: RARITY_MUL[rar] };
      if (rar === "SSR") {
        const c = SSR_CHARS[ssrIdx++];
        u.name = c.name; u.title = c.title; u.persona = c.persona; u.trait = c.trait;
      } else {
        const nouns = ARCH_NOUN[arch];
        const noun = nouns[Math.floor(i / ARCHES.length) % nouns.length];
        u.name = PREFIX[pi % PREFIX.length] + " " + noun; pi++;
      }
      roster.push(u);
    }
  });
  return roster;
}
const ROSTER = buildRoster();
