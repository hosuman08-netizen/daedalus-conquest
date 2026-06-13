/* i18n — 6개 언어 (ko/en/ja/zh/hi/ru). game.js보다 먼저 로드. */
const LANGS = ["ko", "en", "ja", "zh", "hi", "ru"];
const LANG_LABEL = { ko: "한국어", en: "English", ja: "日本語", zh: "中文", hi: "हिन्दी", ru: "Русский" };

const I18N = {
  ko: {
    title: "AI 군단 전쟁",
    "mode.campaign": "📖 캠페인", "mode.tower": "🗼 무한탑", "mode.daily": "📅 일일", "mode.boss": "🐲 보스", "mode.turnbased": "⚔️ 턴제", "mode.arena": "🏟️ 아레나",
    start: "▶ 전투 시작", pause: "⏸ 일시정지", resume: "▶ 재개", auto: "⚔️ 자동사냥", autoOn: "⚔️ 자동 ON",
    reset: "↻ 다시", retry: "다시 ↻", cont: "계속 ▶", upgrade: "강화", gacha: "🎰 뽑기 100", pkg: "💎 패키지",
    buy: "구매하기", later: "나중에", confirm: "확인",
    speed: "속도 {n}x", speedLock: "속도 1x 🔒",
    armyTitle: "🔵 내 군단", armySub: "(골드로 구매 · −는 90% 환불)",
    sDeploy: "📖 챕터 {n} — 배치 후 ▶ 전투", sTower: "🗼 무한의 탑 {n}층  (최고 {b}층)",
    sDaily: "📅 일일던전 — 클리어 시 보너스 골드 💰", sDailyDone: "📅 일일던전 — 오늘 완료! 내일 다시 ↩",
    sBoss: "🐲 보스 레이드 — 거대 보스를 격파하라!", sFight: "⚔️ 교전 중 — AI 자율 전투", sStart: "군대를 배치하고 ▶ 전투 시작",
    rWin: "🏆 승리!", rLose: "💀 패배", rDraw: "⚖️ 무승부", rChapter: "🏆 챕터 클리어!", rTower: "🏆 {n}층 돌파!", rBoss: "🏆 보스 격파!", rDaily: "🏆 일일던전 클리어!",
    rwGold: "💰 +{n}", rwStreak: " · 🔥{n}연승!", rwChapter: "📖 챕터 {n} 해금!", rwTowerNext: "🗼 {n}층 도전 (최고 {b})", rwDailyBonus: "💰 +{n} 일일 보너스!", rwDailyDone: "오늘 보상은 이미 받음 — 내일 다시", rwBoss: "💰 +{n} 보스 보상!",
    legend1: "🛸 드론 다수·빠름·회피 · 🎯 사수 원거리·저격 · 🛡️ 가디언 탱커·방어막",
    legend2: "🤖 돌격봇 근접·돌진 · 🧠 지휘관 최고지능·전군강화 · 🐉 타이탄 전설",
    legend3: "티어 높을수록 AI가 똑똑해 몰살. 뽑기로 강화·전설🐉 해금.",
    spTitle: "💎 초심자 패키지", sp1: "⚡ 전투 속도 2x 영구 해금", sp2: "💰 골드 3,000 즉시 지급", sp3: "📈 골드 획득 영구 +20%", sp4: "🎰 10연 뽑기 효과", spPrice: "단 한 번 · ₩990",
    tComingTb: "⚔️ 턴제 전술 — 곧 출시!", tComingAr: "🏟️ PvP 아레나 — 곧 출시!", tNoSwitch: "전투 중엔 모드 변경 불가",
    tGoldShort: "골드 부족! {n}g 필요", tBought: "🛒 구매 −{n}g", tSold: "💸 판매 +{n}g", tMaxUnit: "이 유닛 최대치(12)",
    tAutoStart: "⚔️ 자동사냥 시작 — 알아서 싸웁니다", tAutoStop: "자동사냥 중지", tAutoRun: "⚔️ 자동사냥 진행…",
    tGachaUp: "유닛 +{n}강화", tTitan: "🐉 전설 타이탄 해금!!", tDaily: "🎁 일일 보상 +150 골드!", tIdle: "🌙 방치 보상 ({t}) +{n} 골드!",
    tStarter: "💎 스타터팩 획득! 속도 2x 해금 +골드3000", tOwned: "이미 보유 중 — 속도 2x 사용 가능",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 강화! Lv{n}",
    heroes: { strategist: ["책략가", "전군 AI 지능 +1"], berserker: ["광전사", "전군 공격력 +15%"], warden: ["수호자", "전군 체력 +20%"], ranger: ["사격대장", "드론·사수 공격 +30%"], mech: ["기갑사령", "돌격봇·가디언 체력 +40%"], engineer: ["정비공", "전군 체력 재생"], dragoon: ["용기사", "전군 +8% · 강력 궁극기"] },
    ultName: { focus: "전술 지휘", rage: "광폭화", wall: "철벽", volley: "일제사격", assault: "강습", repair: "긴급 수리", dragon: "드래곤 강림" },
  },
  en: {
    title: "AI Legion War",
    "mode.campaign": "📖 Campaign", "mode.tower": "🗼 Tower", "mode.daily": "📅 Daily", "mode.boss": "🐲 Boss", "mode.turnbased": "⚔️ Tactics", "mode.arena": "🏟️ Arena",
    start: "▶ Start", pause: "⏸ Pause", resume: "▶ Resume", auto: "⚔️ Auto-hunt", autoOn: "⚔️ Auto ON",
    reset: "↻ Reset", retry: "Retry ↻", cont: "Continue ▶", upgrade: "Upgrade", gacha: "🎰 Pull 100", pkg: "💎 Pack",
    buy: "Buy", later: "Later", confirm: "OK",
    speed: "Speed {n}x", speedLock: "Speed 1x 🔒",
    armyTitle: "🔵 My Legion", armySub: "(buy with gold · − refunds 90%)",
    sDeploy: "📖 Chapter {n} — deploy & ▶", sTower: "🗼 Tower floor {n}  (best {b})",
    sDaily: "📅 Daily Dungeon — clear for bonus gold 💰", sDailyDone: "📅 Daily — done today! Back tomorrow ↩",
    sBoss: "🐲 Boss Raid — defeat the giant boss!", sFight: "⚔️ In battle — AI auto-combat", sStart: "Deploy your army and ▶ Start",
    rWin: "🏆 Victory!", rLose: "💀 Defeat", rDraw: "⚖️ Draw", rChapter: "🏆 Chapter clear!", rTower: "🏆 Floor {n} cleared!", rBoss: "🏆 Boss slain!", rDaily: "🏆 Daily cleared!",
    rwGold: "💰 +{n}", rwStreak: " · 🔥{n} streak!", rwChapter: "📖 Chapter {n} unlocked!", rwTowerNext: "🗼 Floor {n} (best {b})", rwDailyBonus: "💰 +{n} daily bonus!", rwDailyDone: "Already claimed today — back tomorrow", rwBoss: "💰 +{n} boss reward!",
    legend1: "🛸 Drone swarm·fast·evade · 🎯 Marksman ranged·snipe · 🛡️ Guardian tank·barrier",
    legend2: "🤖 Bruiser melee·charge · 🧠 Commander smartest·rally · 🐉 Titan legendary",
    legend3: "Higher tier = smarter AI = wipeouts. Pull to upgrade & unlock 🐉.",
    spTitle: "💎 Starter Pack", sp1: "⚡ Unlock 2x speed forever", sp2: "💰 3,000 gold instantly", sp3: "📈 +20% gold gain forever", sp4: "🎰 10-pull worth", spPrice: "One time · $0.99",
    tComingTb: "⚔️ Turn-based tactics — coming soon!", tComingAr: "🏟️ PvP Arena — coming soon!", tNoSwitch: "Can't switch mode mid-battle",
    tGoldShort: "Not enough gold! Need {n}g", tBought: "🛒 Bought −{n}g", tSold: "💸 Sold +{n}g", tMaxUnit: "Max for this unit (12)",
    tAutoStart: "⚔️ Auto-hunt on — it fights for you", tAutoStop: "Auto-hunt off", tAutoRun: "⚔️ Auto-hunt running…",
    tGachaUp: "Units +{n} upgraded", tTitan: "🐉 Legendary Titan unlocked!!", tDaily: "🎁 Daily reward +150 gold!", tIdle: "🌙 Idle reward ({t}) +{n} gold!",
    tStarter: "💎 Starter Pack! 2x speed +3000 gold", tOwned: "Already owned — 2x speed available",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} upgraded! Lv{n}",
    heroes: { strategist: ["Strategist", "All units AI +1"], berserker: ["Berserker", "All ATK +15%"], warden: ["Warden", "All HP +20%"], ranger: ["Ranger Lord", "Drone·Marksman ATK +30%"], mech: ["Mech Cmdr", "Bruiser·Guardian HP +40%"], engineer: ["Engineer", "All units regen HP"], dragoon: ["Dragoon", "All +8% · strong ult"] },
    ultName: { focus: "Tactical Order", rage: "Berserk", wall: "Iron Wall", volley: "Volley", assault: "Assault", repair: "Repair", dragon: "Dragon Descent" },
  },
  ja: {
    title: "AI軍団戦争",
    "mode.campaign": "📖 物語", "mode.tower": "🗼 無限塔", "mode.daily": "📅 デイリー", "mode.boss": "🐲 ボス", "mode.turnbased": "⚔️ 戦術", "mode.arena": "🏟️ 闘技場",
    start: "▶ 戦闘開始", pause: "⏸ 一時停止", resume: "▶ 再開", auto: "⚔️ 自動狩り", autoOn: "⚔️ 自動 ON",
    reset: "↻ やり直し", retry: "再戦 ↻", cont: "続ける ▶", upgrade: "強化", gacha: "🎰 ガチャ 100", pkg: "💎 パック",
    buy: "購入", later: "後で", confirm: "確認",
    speed: "速度 {n}x", speedLock: "速度 1x 🔒",
    armyTitle: "🔵 自軍", armySub: "(ゴールドで購入 · −は90%返金)",
    sDeploy: "📖 チャプター{n} — 配置して ▶", sTower: "🗼 無限の塔 {n}階  (最高 {b}階)",
    sDaily: "📅 デイリー — クリアでボーナス💰", sDailyDone: "📅 本日クリア済み! 明日また ↩",
    sBoss: "🐲 ボスレイド — 巨大ボスを倒せ!", sFight: "⚔️ 交戦中 — AI自動戦闘", sStart: "軍を配置して ▶ 戦闘開始",
    rWin: "🏆 勝利!", rLose: "💀 敗北", rDraw: "⚖️ 引き分け", rChapter: "🏆 チャプタークリア!", rTower: "🏆 {n}階突破!", rBoss: "🏆 ボス撃破!", rDaily: "🏆 デイリークリア!",
    rwGold: "💰 +{n}", rwStreak: " · 🔥{n}連勝!", rwChapter: "📖 チャプター{n}解放!", rwTowerNext: "🗼 {n}階挑戦 (最高 {b})", rwDailyBonus: "💰 +{n} デイリーボーナス!", rwDailyDone: "本日の報酬は受取済み — 明日また", rwBoss: "💰 +{n} ボス報酬!",
    legend1: "🛸 ドローン 群れ·速·回避 · 🎯 射手 遠距離·狙撃 · 🛡️ ガーディアン 盾·防壁",
    legend2: "🤖 突撃兵 近接·突進 · 🧠 指揮官 最高知能·全軍強化 · 🐉 タイタン 伝説",
    legend3: "ティアが高いほどAIが賢く殲滅。ガチャで強化・伝説🐉解放。",
    spTitle: "💎 初心者パック", sp1: "⚡ 戦闘速度2x永久解放", sp2: "💰 ゴールド3,000即時", sp3: "📈 ゴールド獲得永久+20%", sp4: "🎰 10連ガチャ相当", spPrice: "一度きり · ¥160",
    tComingTb: "⚔️ ターン制戦術 — 近日公開!", tComingAr: "🏟️ PvP闘技場 — 近日公開!", tNoSwitch: "戦闘中はモード変更不可",
    tGoldShort: "ゴールド不足! {n}g必要", tBought: "🛒 購入 −{n}g", tSold: "💸 売却 +{n}g", tMaxUnit: "このユニット最大(12)",
    tAutoStart: "⚔️ 自動狩り開始 — 自動で戦う", tAutoStop: "自動狩り停止", tAutoRun: "⚔️ 自動狩り進行中…",
    tGachaUp: "ユニット+{n}強化", tTitan: "🐉 伝説タイタン解放!!", tDaily: "🎁 デイリー報酬+150ゴールド!", tIdle: "🌙 放置報酬 ({t}) +{n}ゴールド!",
    tStarter: "💎 スターターパック獲得! 速度2x +3000ゴールド", tOwned: "所持済み — 速度2x使用可能",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 強化! Lv{n}",
    heroes: { strategist: ["策略家", "全軍AI知能+1"], berserker: ["狂戦士", "全軍攻撃+15%"], warden: ["守護者", "全軍HP+20%"], ranger: ["射撃隊長", "ドローン·射手攻撃+30%"], mech: ["機甲司令", "突撃兵·ガーディアンHP+40%"], engineer: ["整備士", "全軍HP回復"], dragoon: ["竜騎士", "全軍+8% · 強力な奥義"] },
    ultName: { focus: "戦術指揮", rage: "狂暴化", wall: "鉄壁", volley: "一斉射撃", assault: "強襲", repair: "緊急修理", dragon: "竜の降臨" },
  },
  zh: {
    title: "AI军团战争",
    "mode.campaign": "📖 战役", "mode.tower": "🗼 无限塔", "mode.daily": "📅 每日", "mode.boss": "🐲 首领", "mode.turnbased": "⚔️ 战术", "mode.arena": "🏟️ 竞技场",
    start: "▶ 开始战斗", pause: "⏸ 暂停", resume: "▶ 继续", auto: "⚔️ 自动狩猎", autoOn: "⚔️ 自动开",
    reset: "↻ 重来", retry: "重试 ↻", cont: "继续 ▶", upgrade: "强化", gacha: "🎰 抽卡 100", pkg: "💎 礼包",
    buy: "购买", later: "稍后", confirm: "确定",
    speed: "速度 {n}x", speedLock: "速度 1x 🔒",
    armyTitle: "🔵 我的军团", armySub: "(用金币购买 · −退还90%)",
    sDeploy: "📖 第{n}章 — 部署后 ▶", sTower: "🗼 无限之塔 {n}层  (最高 {b}层)",
    sDaily: "📅 每日副本 — 通关得奖励金币💰", sDailyDone: "📅 今日已完成! 明天再来 ↩",
    sBoss: "🐲 首领突袭 — 击败巨型首领!", sFight: "⚔️ 交战中 — AI自动战斗", sStart: "部署军队并 ▶ 开始战斗",
    rWin: "🏆 胜利!", rLose: "💀 失败", rDraw: "⚖️ 平局", rChapter: "🏆 通关!", rTower: "🏆 突破{n}层!", rBoss: "🏆 击杀首领!", rDaily: "🏆 每日通关!",
    rwGold: "💰 +{n}", rwStreak: " · 🔥{n}连胜!", rwChapter: "📖 解锁第{n}章!", rwTowerNext: "🗼 挑战{n}层 (最高 {b})", rwDailyBonus: "💰 +{n} 每日奖励!", rwDailyDone: "今日奖励已领取 — 明天再来", rwBoss: "💰 +{n} 首领奖励!",
    legend1: "🛸 无人机 群体·快·闪避 · 🎯 射手 远程·狙击 · 🛡️ 守卫 坦克·护盾",
    legend2: "🤖 突击兵 近战·冲锋 · 🧠 指挥官 最高智能·全军增益 · 🐉 泰坦 传说",
    legend3: "等级越高AI越聪明能全灭。抽卡强化·解锁传说🐉。",
    spTitle: "💎 新手礼包", sp1: "⚡ 永久解锁2倍速度", sp2: "💰 立即3,000金币", sp3: "📈 金币获取永久+20%", sp4: "🎰 10连抽价值", spPrice: "仅一次 · ¥6",
    tComingTb: "⚔️ 回合制战术 — 即将推出!", tComingAr: "🏟️ PvP竞技场 — 即将推出!", tNoSwitch: "战斗中无法切换模式",
    tGoldShort: "金币不足! 需要{n}g", tBought: "🛒 购买 −{n}g", tSold: "💸 出售 +{n}g", tMaxUnit: "该单位已满(12)",
    tAutoStart: "⚔️ 自动狩猎开启 — 自动战斗", tAutoStop: "自动狩猎关闭", tAutoRun: "⚔️ 自动狩猎进行中…",
    tGachaUp: "单位+{n}强化", tTitan: "🐉 传说泰坦解锁!!", tDaily: "🎁 每日奖励+150金币!", tIdle: "🌙 挂机奖励 ({t}) +{n}金币!",
    tStarter: "💎 获得新手礼包! 2倍速度 +3000金币", tOwned: "已拥有 — 可用2倍速度",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 强化! Lv{n}",
    heroes: { strategist: ["策略家", "全军AI智能+1"], berserker: ["狂战士", "全军攻击+15%"], warden: ["守护者", "全军血量+20%"], ranger: ["射击队长", "无人机·射手攻击+30%"], mech: ["机甲司令", "突击兵·守卫血量+40%"], engineer: ["工程师", "全军回血"], dragoon: ["龙骑士", "全军+8% · 强力必杀"] },
    ultName: { focus: "战术指挥", rage: "狂暴", wall: "铁壁", volley: "齐射", assault: "强袭", repair: "紧急维修", dragon: "巨龙降临" },
  },
  hi: {
    title: "एआई सेना युद्ध",
    "mode.campaign": "📖 अभियान", "mode.tower": "🗼 मीनार", "mode.daily": "📅 दैनिक", "mode.boss": "🐲 बॉस", "mode.turnbased": "⚔️ रणनीति", "mode.arena": "🏟️ अखाड़ा",
    start: "▶ युद्ध शुरू", pause: "⏸ रोकें", resume: "▶ जारी", auto: "⚔️ ऑटो-शिकार", autoOn: "⚔️ ऑटो चालू",
    reset: "↻ रीसेट", retry: "फिर ↻", cont: "जारी ▶", upgrade: "अपग्रेड", gacha: "🎰 गाचा 100", pkg: "💎 पैक",
    buy: "खरीदें", later: "बाद में", confirm: "ठीक",
    speed: "गति {n}x", speedLock: "गति 1x 🔒",
    armyTitle: "🔵 मेरी सेना", armySub: "(गोल्ड से खरीदें · − 90% वापस)",
    sDeploy: "📖 अध्याय {n} — तैनात करें ▶", sTower: "🗼 मीनार मंज़िल {n}  (सर्वश्रेष्ठ {b})",
    sDaily: "📅 दैनिक — साफ़ करें, बोनस गोल्ड💰", sDailyDone: "📅 आज पूरा! कल फिर ↩",
    sBoss: "🐲 बॉस रेड — विशाल बॉस को हराएँ!", sFight: "⚔️ युद्ध में — AI स्वतः लड़ाई", sStart: "सेना तैनात करें और ▶ शुरू",
    rWin: "🏆 जीत!", rLose: "💀 हार", rDraw: "⚖️ बराबरी", rChapter: "🏆 अध्याय पूरा!", rTower: "🏆 मंज़िल {n} पार!", rBoss: "🏆 बॉस हारा!", rDaily: "🏆 दैनिक पूरा!",
    rwGold: "💰 +{n}", rwStreak: " · 🔥{n} जीत लगातार!", rwChapter: "📖 अध्याय {n} अनलॉक!", rwTowerNext: "🗼 मंज़िल {n} (सर्वश्रेष्ठ {b})", rwDailyBonus: "💰 +{n} दैनिक बोनस!", rwDailyDone: "आज का इनाम मिल चुका — कल फिर", rwBoss: "💰 +{n} बॉस इनाम!",
    legend1: "🛸 ड्रोन झुंड·तेज़·बचाव · 🎯 निशानेबाज़ दूर·स्नाइप · 🛡️ रक्षक टैंक·ढाल",
    legend2: "🤖 ब्रूज़र पास·धावा · 🧠 कमांडर सबसे चतुर·बूस्ट · 🐉 टाइटन पौराणिक",
    legend3: "ऊँचा टियर = होशियार AI = सफ़ाया। गाचा से अपग्रेड·🐉 अनलॉक।",
    spTitle: "💎 स्टार्टर पैक", sp1: "⚡ 2x गति हमेशा अनलॉक", sp2: "💰 3,000 गोल्ड तुरंत", sp3: "📈 गोल्ड लाभ हमेशा +20%", sp4: "🎰 10-पुल मूल्य", spPrice: "एक बार · ₹79",
    tComingTb: "⚔️ टर्न-आधारित — जल्द आ रहा!", tComingAr: "🏟️ PvP अखाड़ा — जल्द आ रहा!", tNoSwitch: "युद्ध में मोड नहीं बदल सकते",
    tGoldShort: "गोल्ड कम! {n}g चाहिए", tBought: "🛒 खरीदा −{n}g", tSold: "💸 बेचा +{n}g", tMaxUnit: "इस यूनिट की सीमा (12)",
    tAutoStart: "⚔️ ऑटो-शिकार चालू — खुद लड़ता है", tAutoStop: "ऑटो-शिकार बंद", tAutoRun: "⚔️ ऑटो-शिकार चल रहा…",
    tGachaUp: "यूनिट +{n} अपग्रेड", tTitan: "🐉 पौराणिक टाइटन अनलॉक!!", tDaily: "🎁 दैनिक इनाम +150 गोल्ड!", tIdle: "🌙 निष्क्रिय इनाम ({t}) +{n} गोल्ड!",
    tStarter: "💎 स्टार्टर पैक मिला! 2x गति +3000 गोल्ड", tOwned: "पहले से है — 2x गति उपलब्ध",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} अपग्रेड! Lv{n}",
    heroes: { strategist: ["रणनीतिकार", "पूरी सेना AI +1"], berserker: ["योद्धा", "पूरी सेना ATK +15%"], warden: ["रक्षक", "पूरी सेना HP +20%"], ranger: ["निशानेबाज़ नायक", "ड्रोन·निशानेबाज़ ATK +30%"], mech: ["मैक कमांडर", "ब्रूज़र·रक्षक HP +40%"], engineer: ["इंजीनियर", "पूरी सेना HP रिजेन"], dragoon: ["ड्रैगून", "पूरी सेना +8% · तेज़ अल्टी"] },
    ultName: { focus: "रणनीतिक आदेश", rage: "उन्माद", wall: "लौह दीवार", volley: "वॉली", assault: "हमला", repair: "मरम्मत", dragon: "ड्रैगन अवतरण" },
  },
  ru: {
    title: "Война ИИ-Легионов",
    "mode.campaign": "📖 Кампания", "mode.tower": "🗼 Башня", "mode.daily": "📅 Ежедн.", "mode.boss": "🐲 Босс", "mode.turnbased": "⚔️ Тактика", "mode.arena": "🏟️ Арена",
    start: "▶ В бой", pause: "⏸ Пауза", resume: "▶ Продолжить", auto: "⚔️ Автобой", autoOn: "⚔️ Авто ВКЛ",
    reset: "↻ Заново", retry: "Ещё раз ↻", cont: "Далее ▶", upgrade: "Улучшить", gacha: "🎰 Призыв 100", pkg: "💎 Набор",
    buy: "Купить", later: "Позже", confirm: "ОК",
    speed: "Скорость {n}x", speedLock: "Скорость 1x 🔒",
    armyTitle: "🔵 Мой легион", armySub: "(покупка за золото · − возврат 90%)",
    sDeploy: "📖 Глава {n} — расставьте и ▶", sTower: "🗼 Башня этаж {n}  (рекорд {b})",
    sDaily: "📅 Подземелье — пройди ради золота💰", sDailyDone: "📅 На сегодня всё! Завтра снова ↩",
    sBoss: "🐲 Рейд босса — победи гиганта!", sFight: "⚔️ В бою — ИИ сражается сам", sStart: "Расставьте армию и ▶ В бой",
    rWin: "🏆 Победа!", rLose: "💀 Поражение", rDraw: "⚖️ Ничья", rChapter: "🏆 Глава пройдена!", rTower: "🏆 Этаж {n} взят!", rBoss: "🏆 Босс повержен!", rDaily: "🏆 Подземелье пройдено!",
    rwGold: "💰 +{n}", rwStreak: " · 🔥{n} побед подряд!", rwChapter: "📖 Глава {n} открыта!", rwTowerNext: "🗼 Этаж {n} (рекорд {b})", rwDailyBonus: "💰 +{n} ежедневный бонус!", rwDailyDone: "Награда уже получена — завтра снова", rwBoss: "💰 +{n} награда за босса!",
    legend1: "🛸 Дрон рой·быстрый·уклон · 🎯 Стрелок даль·снайпер · 🛡️ Страж танк·щит",
    legend2: "🤖 Боец ближний·рывок · 🧠 Командир умнейший·бафф · 🐉 Титан легендарный",
    legend3: "Выше ранг = умнее ИИ = тотал. Призыв: улучшение·🐉.",
    spTitle: "💎 Набор новичка", sp1: "⚡ Скорость 2x навсегда", sp2: "💰 3,000 золота сразу", sp3: "📈 +20% золота навсегда", sp4: "🎰 10 призывов", spPrice: "Один раз · 99₽",
    tComingTb: "⚔️ Пошаговая тактика — скоро!", tComingAr: "🏟️ PvP Арена — скоро!", tNoSwitch: "Нельзя менять режим в бою",
    tGoldShort: "Мало золота! Нужно {n}", tBought: "🛒 Куплено −{n}", tSold: "💸 Продано +{n}", tMaxUnit: "Макс. для юнита (12)",
    tAutoStart: "⚔️ Автобой включён — сам сражается", tAutoStop: "Автобой выключен", tAutoRun: "⚔️ Автобой идёт…",
    tGachaUp: "Юниты +{n} улучшены", tTitan: "🐉 Легендарный Титан открыт!!", tDaily: "🎁 Ежедневная награда +150!", tIdle: "🌙 Награда за простой ({t}) +{n}!",
    tStarter: "💎 Набор новичка! Скорость 2x +3000", tOwned: "Уже есть — скорость 2x доступна",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} улучшен! Ур.{n}",
    heroes: { strategist: ["Стратег", "ИИ всех +1"], berserker: ["Берсерк", "Атака всех +15%"], warden: ["Страж", "HP всех +20%"], ranger: ["Командир стрелков", "Дрон·Стрелок атака +30%"], mech: ["Мех-командир", "Боец·Страж HP +40%"], engineer: ["Инженер", "Реген HP всех"], dragoon: ["Драгун", "Все +8% · мощный ульт"] },
    ultName: { focus: "Приказ", rage: "Ярость", wall: "Стена", volley: "Залп", assault: "Штурм", repair: "Ремонт", dragon: "Сошествие дракона" },
  },
};

// 설정 메뉴 문구
const SET = {
  ko: { setTitle: "설정", setLang: "언어", setSound: "사운드", setHaptic: "진동", setReset: "진행 초기화", setResetOk: "진행 초기화됨", langOk: "언어 변경됨", resetAsk: "정말 모든 진행을 초기화할까요?", evTitle: "이벤트", evAttend: "일일 출석 보상", evClaim: "출석 보상 받기", evMore: "더 많은 이벤트가 곧 추가됩니다", evDay: "{n}일차", evDone: "오늘 출석 완료! 내일 다시", tAttend: "🎁 {n}일차 출석 보상 획득!", shopTitle: "캐시 상점", shopNote: "실제 결제는 텔레그램 Stars 연동 예정" },
  en: { setTitle: "Settings", setLang: "Language", setSound: "Sound", setHaptic: "Haptics", setReset: "Reset progress", setResetOk: "Progress reset", langOk: "Language changed", resetAsk: "Reset all progress?", evTitle: "Events", evAttend: "Daily Check-in", evClaim: "Claim today", evMore: "More events coming soon", evDay: "Day {n}", evDone: "Checked in today! Back tomorrow", tAttend: "🎁 Day {n} check-in reward!", shopTitle: "Shop", shopNote: "Real payment via Telegram Stars coming soon" },
  ja: { setTitle: "設定", setLang: "言語", setSound: "サウンド", setHaptic: "振動", setReset: "進行リセット", setResetOk: "リセット完了", langOk: "言語を変更", resetAsk: "全ての進行をリセットしますか?", evTitle: "イベント", evAttend: "デイリーログイン", evClaim: "本日の報酬", evMore: "新イベント近日追加", evDay: "{n}日目", evDone: "本日ログイン済み! 明日また", tAttend: "🎁 {n}日目ログイン報酬獲得!", shopTitle: "ショップ", shopNote: "実決済はTelegram Stars対応予定" },
  zh: { setTitle: "设置", setLang: "语言", setSound: "声音", setHaptic: "震动", setReset: "重置进度", setResetOk: "已重置", langOk: "已切换语言", resetAsk: "确定要重置所有进度吗?", evTitle: "活动", evAttend: "每日签到", evClaim: "领取今日", evMore: "更多活动即将上线", evDay: "第{n}天", evDone: "今日已签到! 明天再来", tAttend: "🎁 第{n}天签到奖励!", shopTitle: "商店", shopNote: "实际支付将接入Telegram Stars" },
  hi: { setTitle: "सेटिंग", setLang: "भाषा", setSound: "ध्वनि", setHaptic: "कंपन", setReset: "प्रगति रीसेट", setResetOk: "रीसेट हो गया", langOk: "भाषा बदली", resetAsk: "सारी प्रगति रीसेट करें?", evTitle: "इवेंट", evAttend: "डेली चेक-इन", evClaim: "आज का इनाम", evMore: "और इवेंट जल्द", evDay: "दिन {n}", evDone: "आज चेक-इन हो गया! कल फिर", tAttend: "🎁 दिन {n} चेक-इन इनाम!", shopTitle: "स्टोर", shopNote: "जल्द Telegram Stars भुगतान" },
  ru: { setTitle: "Настройки", setLang: "Язык", setSound: "Звук", setHaptic: "Вибрация", setReset: "Сброс прогресса", setResetOk: "Прогресс сброшен", langOk: "Язык изменён", resetAsk: "Сбросить весь прогресс?", evTitle: "События", evAttend: "Ежедневный вход", evClaim: "Забрать", evMore: "Скоро новые события", evDay: "День {n}", evDone: "Вход засчитан! Завтра снова", tAttend: "🎁 Награда за день {n}!", shopTitle: "Магазин", shopNote: "Оплата через Telegram Stars скоро" },
};
for (const l in SET) Object.assign(I18N[l], SET[l]);

// 전략 상성 설명
const STRAT = {
  ko: { legend4: "⚔️ 상성: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3종↑ 편성 시너지" },
  en: { legend4: "⚔️ Counters: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3+ types = synergy" },
  ja: { legend4: "⚔️ 相性: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3種以上で連携" },
  zh: { legend4: "⚔️ 克制: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3种以上协同" },
  hi: { legend4: "⚔️ काउंटर: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3+ प्रकार सिनर्जी" },
  ru: { legend4: "⚔️ Контры: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3+ типа синергия" },
};
for (const l in STRAT) Object.assign(I18N[l], STRAT[l]);

let LANG = "ko";
function detectLang() {
  let code = "";
  try { code = (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user || {}).language_code || ""; } catch (e) {}
  if (!code) { try { code = (navigator.language || "en").toLowerCase(); } catch (e) { code = "en"; } }
  code = code.slice(0, 2);
  return LANGS.indexOf(code) >= 0 ? code : "en";
}
function setLang(l) { if (I18N[l]) { LANG = l; try { localStorage.setItem("daedalus_lang", l); } catch (e) {} } }
function t(key, p) {
  let s = (I18N[LANG] && I18N[LANG][key]) || (I18N.en[key]) || key;
  if (p) for (const k in p) s = s.replace("{" + k + "}", p[k]);
  return s;
}
function tHero(h) { return (I18N[LANG].heroes[h] || I18N.en.heroes[h] || [h, ""]); }
function tUlt(u) { return (I18N[LANG].ultName[u] || I18N.en.ultName[u] || u); }
// 초기 언어 결정
(function () { let saved = ""; try { saved = localStorage.getItem("daedalus_lang") || ""; } catch (e) {} LANG = (I18N[saved] ? saved : detectLang()); })();
