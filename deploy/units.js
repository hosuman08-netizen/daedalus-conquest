const ARCHES = ["drone", "marksman", "guardian", "bruiser", "commander", "titan"];
const ARCH_GLYPH = { drone: "🛸", marksman: "🎯", guardian: "🛡️", bruiser: "🤖", commander: "🧠", titan: "🐉" };

const SSR_VIS = { Arclight: "⚖️", Solace: "🌊", Cipher: "🔭", Ignis: "🔥", Vector: "↯", Vespera: "🐝", Aegis: "🛡️", Anvil: "🔨", Dominus: "👑" };

const FEATURED_BANNERS = [
{ id: "arclight", pickup: "Arclight", name: "심판의 서막", en: "Arc of Judgment", durationDays: 7, sparkPity: 90, upRate: 0.015 },
{ id: "dominus", pickup: "Dominus", name: "군림의 시간", en: "Reign Eternal", durationDays: 7, sparkPity: 90, upRate: 0.015 },
{ id: "ignis", pickup: "Ignis", name: "겁화의 강림", en: "Inferno Descent", durationDays: 7, sparkPity: 90, upRate: 0.015 },
{ id: "vector", pickup: "Vector", name: "전율의 가속", en: "Surge Protocol", durationDays: 7, sparkPity: 90, upRate: 0.015 },
{ id: "aegis", pickup: "Aegis", name: "불멸의 방벽", en: "Eternal Bastion", durationDays: 7, sparkPity: 90, upRate: 0.015 },
{ id: "cipher", pickup: "Cipher", name: "심연의 해독", en: "Cipher's Eye", durationDays: 7, sparkPity: 90, upRate: 0.015 },
{ id: "vespera", pickup: "Vespera", name: "여명의 군무", en: "Dawn Swarm", durationDays: 7, sparkPity: 90, upRate: 0.015 },
{ id: "solace", pickup: "Solace", name: "정적의 물결", en: "Tides of Solace", durationDays: 7, sparkPity: 90, upRate: 0.015 },
{ id: "anvil", pickup: "Anvil", name: "단조의 의지", en: "Anvil's Resolve", durationDays: 7, sparkPity: 90, upRate: 0.015 },
];
function getFeaturedBanner(weekIdx) { const n = FEATURED_BANNERS.length; return FEATURED_BANNERS[(((weekIdx || 0) % n) + n) % n]; }
if (typeof window !== "undefined") { window.FEATURED_BANNERS = FEATURED_BANNERS; window.getFeaturedBanner = getFeaturedBanner; }

const FACTION_ACCENT = { Strategist: "🧠", Executor: "⚙️", Swarm: "🐜", Guardian: "🛡️", Intel: "👁️" };
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

const RARITY_MUL = { N: 1.0, R: 1.25, SR: 1.6, SSR: 2.2 }; 
const RARITY_COUNT = { R: 56, SR: 55, SSR: 9, N: 80 }; 
const RARITY_COLOR = { N: "#9ca3af", R: "#60a5fa", SR: "#c084fc", SSR: "#fbbf24" }; 

const FACTIONS = ["Strategist", "Executor", "Swarm", "Guardian", "Intel"];

const SSR_CHARS = [
{ name: "Arclight", title: "심판의 빛", persona: "군단의 전략적 판단자. 승기를 읽어 전군을 각성시킨다", faction: "Strategist", arch: "commander", trait: "처치 시 전군 AI+1.5 · 3초 치명 연쇄" },
{ name: "Solace", title: "재생의 물결", persona: "실행의 수호자. 사망을 수복으로 바꾼다", faction: "Executor", arch: "guardian", trait: "아군 사망 시 주변 3체 연쇄 수복(HP25%)" },
{ name: "Cipher", title: "정밀 해독", persona: "정밀한 감시자. 적의 약점을 드러낸다", faction: "Intel", arch: "marksman", trait: "적 방어 30% 무시 · 약점 노출(아군 다음 2명 치명+25%)" },
{ name: "Ignis", title: "광란의 폭주", persona: "광란의 파괴자. 다칠수록 강해진다", faction: "Swarm", arch: "bruiser", trait: "HP30%↓ 시 공격 x2.5 · 피해 반사" },
{ name: "Vector", title: "동시 지휘", persona: "조율의 사령관. 부대를 한 번에 움직인다", faction: "Strategist", arch: "commander", trait: "아군 3체 동시 돌격 · 속도+25%" },
{ name: "Vespera", title: "군집 분열", persona: "스웜의 군주. 개체는 약하나 무리는 무적", faction: "Swarm", arch: "bruiser", trait: "사망 시 하급 2~3체 분열 소환 · 군집 3+ 시 폭주" },
{ name: "Aegis", title: "수호의 방벽", persona: "감시의 방벽. 아군을 먼저 지킨다", faction: "Guardian", arch: "guardian", trait: "전투 시작 시 아군 2체 8초 보호막" },
{ name: "Anvil", title: "건설 프로토콜", persona: "수리와 건설의 핵심", faction: "Executor", arch: "titan", trait: "8초마다 임시 구조물 또는 팀 재생+10%(3초)" },
{ name: "Dominus", title: "군단의 핵", persona: "군림자. 군단의 정점", faction: "Guardian", arch: "titan", trait: "팀 내 SSR 1체당 전군 스탯+5%(최대25%)" },
];

const SR_CHARS = [
{ name: "와스프", title: "독침의 정찰" }, { name: "헌터", title: "추격의 사수" }, { name: "불워크", title: "철벽의 수호" }, { name: "크래셔", title: "분쇄의 돌격" }, { name: "택틱스", title: "전술의 지휘" }, { name: "골렘", title: "거석의 파수" },
{ name: "글리치", title: "교란의 정찰" }, { name: "바이퍼", title: "맹독의 사격" }, { name: "타워", title: "거탑의 방벽" }, { name: "램페이지", title: "난동의 돌격" }, { name: "마샬", title: "원수의 통솔" }, { name: "베히모스", title: "거수의 진격" },
{ name: "호크아이", title: "감시의 비행" }, { name: "사일런서", title: "무음의 저격" }, { name: "램파트", title: "성루의 방어" }, { name: "브레이커", title: "파쇄의 강습" }, { name: "바이저", title: "책략의 군사" }, { name: "콜로서스", title: "거상의 군림" },
{ name: "팬텀", title: "은신의 추적" }, { name: "아처", title: "정밀의 명사수" }, { name: "캐슬", title: "요새의 방패" }, { name: "슬래머", title: "강타의 파괴" }, { name: "워든", title: "통솔의 사령" }, { name: "와이번", title: "비룡의 강하" },
{ name: "버즈", title: "군집의 비행" }, { name: "매", title: "추적의 사수" }, { name: "수호자", title: "방벽의 수호" }, { name: "분쇄기", title: "강습의 돌격" }, { name: "총수", title: "전술의 지휘" }, { name: "마룡", title: "거신의 파수" },
{ name: "Strategist 매-035", title: "매" }, { name: "Executor 수호자-036", title: "수호자" }, { name: "Swarm 분쇄기-037", title: "분쇄기" }, { name: "Guardian 총수-038", title: "총수" }, { name: "Intel 마룡-039", title: "마룡" },
{ name: "Strategist 정찰기-040", title: "정찰기" }, { name: "Executor 매-041", title: "매" }, { name: "Swarm 수호자-042", title: "수호자" }, { name: "Guardian 분쇄기-043", title: "분쇄기" }, { name: "Intel 총수-044", title: "총수" },
{ name: "Strategist 마룡-045", title: "마룡" }, { name: "Executor 정찰기-046", title: "정찰기" }, { name: "Swarm 매-047", title: "매" }, { name: "Guardian 수호자-048", title: "수호자" }, { name: "Intel 분쇄기-049", title: "분쇄기" },
{ name: "Strategist 총수-050", title: "총수" }, { name: "Executor 마룡-051", title: "마룡" }, { name: "Swarm 정찰기-052", title: "정찰기" }, { name: "Guardian 매-053", title: "매" }, { name: "Intel 수호자-054", title: "수호자" },
{ name: "Strategist 분쇄기-055", title: "분쇄기" }, { name: "Executor 총수-056", title: "총수" }, { name: "Swarm 마룡-057", title: "마룡" }, { name: "Guardian 정찰기-058", title: "정찰기" }, { name: "Intel 매-059", title: "매" },
{ name: "Strategist 수호자-060", title: "수호자" }, { name: "Executor 분쇄기-061", title: "분쇄기" }, { name: "Swarm 총수-062", title: "총수" }, { name: "Guardian 마룡-063", title: "마룡" }, { name: "Intel 정찰기-064", title: "정찰기" },
];

function buildRoster() {
const roster = [];
let id = 0, ssrIdx = 0, srIdx = 0;
const order = ["SSR", "SR", "R", "N"]; 
order.forEach((rar) => {
const n = RARITY_COUNT[rar] || 0;
for (let i = 0; i < n; i++) {
const arch = ARCHES[i % ARCHES.length];
const fac = FACTIONS[i % FACTIONS.length];
const u = { id: ++id, arch: arch, rarity: rar, faction: fac, color: RARITY_COLOR[rar], glyph: ARCH_GLYPH[arch], mul: RARITY_MUL[rar] };
if (rar === "SSR" && ssrIdx < SSR_CHARS.length) {
const c = SSR_CHARS[ssrIdx++];
u.name = c.name; u.title = c.title; u.persona = c.persona; u.trait = c.trait; if (c.faction) u.faction = c.faction;
if (c.arch) { u.arch = c.arch; u.glyph = ARCH_GLYPH[c.arch]; } 
u.mul = 3.0; 
u.vis = SSR_VIS[c.name] || u.glyph; u.accent = FACTION_ACCENT[u.faction] || "";
} else if (rar === "SR" && srIdx < SR_CHARS.length) {
const c = SR_CHARS[srIdx++]; u.name = c.name; u.title = c.title;
u.vis = u.glyph; u.accent = FACTION_ACCENT[u.faction] || "";
} else if (rar === "N") {

const nouns = ARCH_NOUN[arch];
u.name = PREFIX[i % PREFIX.length] + " " + nouns[i % nouns.length];
u.vis = u.glyph; u.accent = FACTION_ACCENT[fac] || "";
} else {

const nouns = ARCH_NOUN[arch];
u.name = fac + " " + nouns[i % nouns.length] + "-" + String(id).padStart(3, "0");
u.vis = u.glyph; u.accent = FACTION_ACCENT[fac] || "";
}
roster.push(u);
}
});
return roster;
}

const ROSTER = buildRoster();