const LANGS = ["ko", "en", "ja", "zh", "hi", "ru"];
const LANG_LABEL = { ko: "한국어", en: "English", ja: "日本語", zh: "中文", hi: "हिन्दी", ru: "Русский" };

const I18N = {
ko: { statsTitle:"내 군단 통계",statBest:"최고 챕터",statCollect:"수집",statRebirth:"환생",statPower:"군단 전력",statPulls:"누적 뽑기",statWins:"누적 승리", carryVolume:"물량 군집",carrySeal:"캐리 — 네 지휘가 봉인했다",carryLed:"주도",vanguardFocus:"🔥 선봉대 24시간 집중",
title: "Daedalus",
"mode.campaign": "📖 캠페인", "mode.tower": "🗼 무한탑", "mode.daily": "📅 일일", "mode.boss": "🐲 보스", "mode.turnbased": "⚔️ 턴제", "mode.arena": "🏟️ 아레나",
start: "▶ 전투 시작", pause: "⏸ 일시정지", resume: "▶ 재개", auto: "⚔️ 자동사냥", autoOn: "⚔️ 자동 ON",
reset: "↻ 다시", retry: "다시 ↻", cont: "계속 ▶", upgrade: "강화", gacha: "🎰 뽑기 100", pkg: "💎 패키지",
buy: "구매하기", later: "나중에", confirm: "확인",
speed: "속도 {n}x", speedLock: "속도 1x 🔒",
firstBuyDouble: "🎁 첫구매 2배",
armyTitle: "🔵 내 군단", armySub: "(골드로 구매 · −는 90% 환불)",
sDeploy: "📖 챕터 {n} — 배치 후 ▶ 전투", sTower: "🗼 무한의 탑 {n}층 (최고 {b}층)",
sDaily: "📅 일일던전 — 클리어 시 보너스 골드 💰", sDailyDone: "📅 일일던전 — 오늘 완료! 내일 다시 ↩",
sBoss: "🐲 보스 레이드 — 거대 보스를 격파하라!", sFight: "⚔️ 교전 중 — AI 자율 전투", sStart: "군대를 배치하고 ▶ 전투 시작",
rWin: "🏆 승리!", rLose: "💀 패배", rDraw: "⚖️ 무승부", rChapter: "🏆 챕터 클리어!", rTower: "🏆 {n}층 돌파!", rBoss: "🏆 보스 격파!", rDaily: "🏆 일일던전 클리어!",
rwGold: "💰 +{n}", rwStreak: " · 🔥{n}연승!", rwChapter: "📖 챕터 {n} 해금!", rwTowerNext: "🗼 {n}층 도전 (최고 {b})", rwDailyBonus: "💰 +{n} 일일 보너스!", rwDailyDone: "오늘 보상은 이미 받음 — 내일 다시", rwBoss: "💰 +{n} 보스 보상!",
legend1: "🛸 드론 다수·빠름·회피 · 🎯 사수 원거리·저격 · 🛡️ 가디언 탱커·방어막",
legend2: "🤖 돌격봇 근접·돌진 · 🧠 지휘관 최고지능·전군강화 · 🐉 타이탄 전설",
legend3: "티어 높을수록 AI가 똑똑해 몰살. 뽑기로 강화·전설🐉 해금.",
spTitle: "💎 초심자 패키지", sp1: "💰 골드 3,000 즉시 지급", sp2: "📈 골드 획득 영구 +20%", sp3: "🎰 유닛 10개 즉시 + 영구 혜택", spPrice: "단 한 번 · ⭐50",
tComingTb: "🧠 턴제 전술 — 플레이 가능! 우선순위 선택으로 스킬 순서 제어", tComingAr: "🏟️ PvP 아레나 — 곧 출시!", tNoSwitch: "전투 중엔 모드 변경 불가",
tGoldShort: "골드 부족! {n}g 필요", tBought: "🛒 구매 −{n}g", tSold: "💸 판매 +{n}g", tMaxUnit: "이 유닛 최대치(12)",
tAutoStart: "⚔️ 자동사냥 시작 — 알아서 싸웁니다", tAutoStop: "자동사냥 중지", tAutoRun: "⚔️ 자동사냥 진행…",
tGachaUp: "유닛 +{n}강화", tTitan: "🐉 전설 타이탄 해금!!", tDaily: "🎁 일일 보상 +150 골드!", tIdle: "🌙 방치 보상 ({t}) +{n} 골드!", tRitual: "🌀 ritual +{n} (Legion var)", tForecast: "Legion Forecast: +var cohesion",
invite: "친구 초대", inviteBtn: "링크 공유", social: "소셜",
tStarter: "💎 초심자 패키지 획득! 골드 3000 + 유닛 10개 + 골드 +20% 영구", tOwned: "이미 보유",
tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 강화! Lv{n}",
soulHave: "보유 🔮 ",
heroes: { strategist: ["책략가", "전군 AI 지능"], berserker: ["광전사", "전군 공격력"], warden: ["수호자", "전군 체력"], ranger: ["사격대장", "드론·사수 공격"], mech: ["기갑사령", "돌격봇·가디언 체력"], engineer: ["정비공", "전군 체력 재생"], dragoon: ["용기사", "전군 · 강력 궁극기"] },
ultName: { focus: "전술 지휘", rage: "광폭화", wall: "철벽", volley: "아크 볼리", assault: "강습", repair: "긴급 수리", dragon: "드래곤 강림" }, 
},
en: { statsTitle:"Legion Stats",statBest:"Best chapter",statCollect:"Collected",statRebirth:"Rebirths",statPower:"Legion power",statPulls:"Total pulls",statWins:"Total wins", carryVolume:"Swarm volume",carrySeal:"carried — your command sealed it",carryLed:"led",vanguardFocus:"🔥 Vanguard 24h Focus",
title: "Daedalus",
"mode.campaign": "📖 Campaign", "mode.tower": "🗼 Tower", "mode.daily": "📅 Daily", "mode.boss": "🐲 Boss", "mode.turnbased": "⚔️ Tactics", "mode.arena": "🏟️ Arena",
start: "▶ Start", pause: "⏸ Pause", resume: "▶ Resume", auto: "⚔️ Auto-hunt", autoOn: "⚔️ Auto ON",
reset: "↻ Reset", retry: "Retry ↻", cont: "Continue ▶", upgrade: "Upgrade", gacha: "🎰 Pull 100", pkg: "💎 Pack",
buy: "Buy", later: "Later", confirm: "OK",
speed: "Speed {n}x", speedLock: "Speed 1x 🔒",
firstBuyDouble: "🎁 First Buy 2×",
armyTitle: "🔵 My Legion", armySub: "(buy with gold · − refunds 90%)",
sDeploy: "📖 Chapter {n} — deploy & ▶", sTower: "🗼 Tower floor {n} (best {b})",
sDaily: "📅 Daily Dungeon — clear for bonus gold 💰", sDailyDone: "📅 Daily — done today! Back tomorrow ↩",
sBoss: "🐲 Boss Raid — defeat the giant boss!", sFight: "⚔️ In battle — AI auto-combat", sStart: "Deploy your army and ▶ Start",
rWin: "🏆 Victory!", rLose: "💀 Defeat", rDraw: "⚖️ Draw", rChapter: "🏆 Chapter clear!", rTower: "🏆 Floor {n} cleared!", rBoss: "🏆 Boss slain!", rDaily: "🏆 Daily cleared!",
rwGold: "💰 +{n}", rwStreak: " · 🔥{n} streak!", rwChapter: "📖 Chapter {n} unlocked!", rwTowerNext: "🗼 Floor {n} (best {b})", rwDailyBonus: "💰 +{n} daily bonus!", rwDailyDone: "Already claimed today — back tomorrow", rwBoss: "💰 +{n} boss reward!",
legend1: "🛸 Drone swarm·fast·evade · 🎯 Marksman ranged·snipe · 🛡️ Guardian tank·barrier",
legend2: "🤖 Bruiser melee·charge · 🧠 Commander smartest·rally · 🐉 Titan legendary",
legend3: "Higher tier = smarter AI = wipeouts. Pull to upgrade & unlock 🐉.",
spTitle: "💎 Starter Pack", sp1: "💰 3,000 gold instantly", sp2: "📈 +20% gold gain forever", sp3: "🎰 10 units + permanent benefits", spPrice: "One time · ⭐50",
tComingTb: "🧠 Turn-based tactics — playable! Choose priority for skill order.", tComingAr: "🏟️ PvP Arena — coming soon!", tNoSwitch: "Can't switch mode mid-battle",
tGoldShort: "Not enough gold! Need {n}g", tBought: "🛒 Bought −{n}g", tSold: "💸 Sold +{n}g", tMaxUnit: "Max for this unit (12)",
tAutoStart: "⚔️ Auto-hunt on — it fights for you", tAutoStop: "Auto-hunt off", tAutoRun: "⚔️ Auto-hunt running…",
tGachaUp: "Units +{n} upgraded", tTitan: "🐉 Legendary Titan unlocked!!", tDaily: "🎁 Daily reward +150 gold!", tIdle: "🌙 Idle reward ({t}) +{n} gold!", tRitual: "🌀 ritual +{n} (Legion var)", tForecast: "Legion Forecast: +var cohesion",
invite: "Invite Friends", inviteBtn: "Share Link", social: "Social",
tStarter: "💎 Starter Pack acquired! 3000 gold + 10 units + +20% gold forever", tOwned: "Already owned",
tUlt: "💥 {x}!", tHeroUp: "🦸 {x} upgraded! Lv{n}",
soulHave: "Have 🔮 ",
heroes: { strategist: ["Strategist", "All units AI"], berserker: ["Berserker", "All ATK"], warden: ["Warden", "All HP"], ranger: ["Ranger Lord", "Drone·Marksman ATK"], mech: ["Mech Cmdr", "Bruiser·Guardian HP"], engineer: ["Engineer", "All units regen HP"], dragoon: ["Dragoon", "All · strong ult"] },
ultName: { focus: "Tactical Order", rage: "Berserk", wall: "Iron Wall", volley: "Arclight Volley", assault: "Assault", repair: "Repair", dragon: "Dragon Descent" }, 
},
ja: { statsTitle:"軍団統計",statBest:"最高章",statCollect:"収集",statRebirth:"転生",statPower:"軍団戦力",statPulls:"累計ガチャ",statWins:"累計勝利", carryVolume:"物量スウォーム",carrySeal:"キャリー — 君の指揮が決めた",carryLed:"主導",vanguardFocus:"🔥 先鋒隊24時間集中",
title: "Daedalus",
"mode.campaign": "📖 物語", "mode.tower": "🗼 無限塔", "mode.daily": "📅 デイリー", "mode.boss": "🐲 ボス", "mode.turnbased": "⚔️ 戦術", "mode.arena": "🏟️ 闘技場",
start: "▶ 戦闘開始", pause: "⏸ 一時停止", resume: "▶ 再開", auto: "⚔️ 自動狩り", autoOn: "⚔️ 自動 ON",
reset: "↻ やり直し", retry: "再戦 ↻", cont: "続ける ▶", upgrade: "強化", gacha: "🎰 ガチャ 100", pkg: "💎 パック",
buy: "購入", later: "後で", confirm: "確認",
speed: "速度 {n}x", speedLock: "速度 1x 🔒",
firstBuyDouble: "🎁 初回購入2倍",
armyTitle: "🔵 自軍", armySub: "(ゴールドで購入 · −は90%返金)",
sDeploy: "📖 チャプター{n} — 配置して ▶", sTower: "🗼 無限の塔 {n}階 (最高 {b}階)",
sDaily: "📅 デイリー — クリアでボーナス💰", sDailyDone: "📅 本日クリア済み! 明日また ↩",
sBoss: "🐲 ボスレイド — 巨大ボスを倒せ!", sFight: "⚔️ 交戦中 — AI自動戦闘", sStart: "軍を配置して ▶ 戦闘開始",
rWin: "🏆 勝利!", rLose: "💀 敗北", rDraw: "⚖️ 引き分け", rChapter: "🏆 チャプタークリア!", rTower: "🏆 {n}階突破!", rBoss: "🏆 ボス撃破!", rDaily: "🏆 デイリークリア!",
rwGold: "💰 +{n}", rwStreak: " · 🔥{n}連勝!", rwChapter: "📖 チャプター{n}解放!", rwTowerNext: "🗼 {n}階挑戦 (最高 {b})", rwDailyBonus: "💰 +{n} デイリーボーナス!", rwDailyDone: "本日の報酬は受取済み — 明日また", rwBoss: "💰 +{n} ボス報酬!",
legend1: "🛸 ドローン 群れ·速·回避 · 🎯 射手 遠距離·狙撃 · 🛡️ ガーディアン 盾·防壁",
legend2: "🤖 突撃兵 近接·突進 · 🧠 指揮官 最高知能·全軍強化 · 🐉 タイタン 伝説",
legend3: "ティアが高いほどAIが賢く殲滅。ガチャで強化・伝説🐉解放。",
spTitle: "💎 初心者パック", sp1: "💰 ゴールド3,000即時支給", sp2: "📈 ゴールド獲得永久+20%", sp3: "🎰 ユニット10体即時 + 永久特典", spPrice: "一度きり · ⭐50",
tComingTb: "⚔️ ターン制戦術 — 近日公開!", tComingAr: "🏟️ PvP闘技場 — 近日公開!", tNoSwitch: "戦闘中はモード変更不可",
tGoldShort: "ゴールド不足! {n}g必要", tBought: "🛒 購入 −{n}g", tSold: "💸 売却 +{n}g", tMaxUnit: "このユニット最大(12)",
tAutoStart: "⚔️ 自動狩り開始 — 自動で戦う", tAutoStop: "自動狩り停止", tAutoRun: "⚔️ 自動狩り進行中…",
tGachaUp: "ユニット+{n}強化", tTitan: "🐉 伝説タイタン解放!!", tDaily: "🎁 デイリー報酬+150ゴールド!", tIdle: "🌙 放置報酬 ({t}) +{n}ゴールド!",
tStarter: "💎 初心者パック獲得! ゴールド3000 + ユニット10体 + ゴールド+20%永久", tOwned: "所持済み",
tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 強化! Lv{n}",
heroes: { strategist: ["策略家", "全軍AI知能"], berserker: ["狂戦士", "全軍攻撃"], warden: ["守護者", "全軍HP"], ranger: ["射撃隊長", "ドローン·射手攻撃"], mech: ["機甲司令", "突撃兵·ガーディアンHP"], engineer: ["整備士", "全軍HP回復"], dragoon: ["竜騎士", "全軍+ · 強力な奥義"] },
ultName: { focus: "戦術指揮", rage: "狂暴化", wall: "鉄壁", volley: "一斉射撃", assault: "強襲", repair: "緊急修理", dragon: "竜の降臨" },
},
zh: { statsTitle:"军团统计",statBest:"最高章节",statCollect:"收集",statRebirth:"转生",statPower:"军团战力",statPulls:"累计抽卡",statWins:"累计胜利", carryVolume:"数量蜂群",carrySeal:"carry — 你的指挥锁定胜局",carryLed:"主导",vanguardFocus:"🔥 先锋队24小时专注",
title: "Daedalus",
"mode.campaign": "📖 战役", "mode.tower": "🗼 无限塔", "mode.daily": "📅 每日", "mode.boss": "🐲 首领", "mode.turnbased": "⚔️ 战术", "mode.arena": "🏟️ 竞技场",
start: "▶ 开始战斗", pause: "⏸ 暂停", resume: "▶ 继续", auto: "⚔️ 自动狩猎", autoOn: "⚔️ 自动开",
reset: "↻ 重来", retry: "重试 ↻", cont: "继续 ▶", upgrade: "强化", gacha: "🎰 抽卡 100", pkg: "💎 礼包",
buy: "购买", later: "稍后", confirm: "确定",
speed: "速度 {n}x", speedLock: "速度 1x 🔒",
firstBuyDouble: "🎁 首购2倍",
armyTitle: "🔵 我的军团", armySub: "(用金币购买 · −退还90%)",
sDeploy: "📖 第{n}章 — 部署后 ▶", sTower: "🗼 无限之塔 {n}层 (最高 {b}层)",
sDaily: "📅 每日副本 — 通关得奖励金币💰", sDailyDone: "📅 今日已完成! 明天再来 ↩",
sBoss: "🐲 首领突袭 — 击败巨型首领!", sFight: "⚔️ 交战中 — AI自动战斗", sStart: "部署军队并 ▶ 开始战斗",
rWin: "🏆 胜利!", rLose: "💀 失败", rDraw: "⚖️ 平局", rChapter: "🏆 通关!", rTower: "🏆 突破{n}层!", rBoss: "🏆 击杀首领!", rDaily: "🏆 每日通关!",
rwGold: "💰 +{n}", rwStreak: " · 🔥{n}连胜!", rwChapter: "📖 解锁第{n}章!", rwTowerNext: "🗼 挑战{n}层 (最高 {b})", rwDailyBonus: "💰 +{n} 每日奖励!", rwDailyDone: "今日奖励已领取 — 明天再来", rwBoss: "💰 +{n} 首领奖励!",
legend1: "🛸 无人机 群体·快·闪避 · 🎯 射手 远程·狙击 · 🛡️ 守卫 坦克·护盾",
legend2: "🤖 突击兵 近战·冲锋 · 🧠 指挥官 最高智能·全军增益 · 🐉 泰坦 传说",
legend3: "等级越高AI越聪明能全灭。抽卡强化·解锁传说🐉。",
spTitle: "💎 新手礼包", sp1: "💰 立即3,000金币", sp2: "📈 金币获取永久+20%", sp3: "🎰 立即10个单位 + 永久特权", spPrice: "仅一次 · ⭐50",
tComingTb: "⚔️ 回合制战术 — 即将推出!", tComingAr: "🏟️ PvP竞技场 — 即将推出!", tNoSwitch: "战斗中无法切换模式",
tGoldShort: "金币不足! 需要{n}g", tBought: "🛒 购买 −{n}g", tSold: "💸 出售 +{n}g", tMaxUnit: "该单位已满(12)",
tAutoStart: "⚔️ 自动狩猎开启 — 自动战斗", tAutoStop: "自动狩猎关闭", tAutoRun: "⚔️ 自动狩猎进行中…",
tGachaUp: "单位+{n}强化", tTitan: "🐉 传说泰坦解锁!!", tDaily: "🎁 每日奖励+150金币!", tIdle: "🌙 挂机奖励 ({t}) +{n}金币!",
tStarter: "💎 新手礼包获得! 3000金币 + 10单位 + 金币+20%永久", tOwned: "已拥有",
tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 强化! Lv{n}",
heroes: { strategist: ["策略家", "全军AI智能+1"], berserker: ["狂战士", "全军攻击+15%"], warden: ["守护者", "全军血量+20%"], ranger: ["射击队长", "无人机·射手攻击+30%"], mech: ["机甲司令", "突击兵·守卫血量+40%"], engineer: ["工程师", "全军回血"], dragoon: ["龙骑士", "全军+8% · 强力必杀"] },
ultName: { focus: "战术指挥", rage: "狂暴", wall: "铁壁", volley: "齐射", assault: "强袭", repair: "紧急维修", dragon: "巨龙降临" },
},
hi: { statsTitle:"लीजन आँकड़े",statBest:"सर्वश्रेष्ठ अध्याय",statCollect:"संग्रह",statRebirth:"पुनर्जन्म",statPower:"लीजन शक्ति",statPulls:"कुल पुल",statWins:"कुल जीत", carryVolume:"झुंड दम",carrySeal:"carry — आपकी कमान ने जीत दिलाई",carryLed:"नेतृत्व",vanguardFocus:"🔥 अग्रदल 24घं फोकस",
title: "Daedalus",
"mode.campaign": "📖 अभियान", "mode.tower": "🗼 मीनार", "mode.daily": "📅 दैनिक", "mode.boss": "🐲 बॉस", "mode.turnbased": "⚔️ रणनीति", "mode.arena": "🏟️ अखाड़ा",
start: "▶ युद्ध शुरू", pause: "⏸ रोकें", resume: "▶ जारी", auto: "⚔️ ऑटो-शिकार", autoOn: "⚔️ ऑटो चालू",
reset: "↻ रीसेट", retry: "फिर ↻", cont: "जारी ▶", upgrade: "अपग्रेड", gacha: "🎰 गाचा 100", pkg: "💎 पैक",
buy: "खरीदें", later: "बाद में", confirm: "ठीक",
speed: "गति {n}x", speedLock: "गति 1x 🔒",
firstBuyDouble: "🎁 पहली खरीद 2×",
armyTitle: "🔵 मेरी सेना", armySub: "(गोल्ड से खरीदें · − 90% वापस)",
sDeploy: "📖 अध्याय {n} — तैनात करें ▶", sTower: "🗼 मीनार मंज़िल {n} (सर्वश्रेष्ठ {b})",
sDaily: "📅 दैनिक — साफ़ करें, बोनस गोल्ड💰", sDailyDone: "📅 आज पूरा! कल फिर ↩",
sBoss: "🐲 बॉस रेड — विशाल बॉस को हराएँ!", sFight: "⚔️ युद्ध में — AI स्वतः लड़ाई", sStart: "सेना तैनात करें और ▶ शुरू",
rWin: "🏆 जीत!", rLose: "💀 हार", rDraw: "⚖️ बराबरी", rChapter: "🏆 अध्याय पूरा!", rTower: "🏆 मंज़िल {n} पार!", rBoss: "🏆 बॉस हारा!", rDaily: "🏆 दैनिक पूरा!",
rwGold: "💰 +{n}", rwStreak: " · 🔥{n} जीत लगातार!", rwChapter: "📖 अध्याय {n} अनलॉक!", rwTowerNext: "🗼 मंज़िल {n} (सर्वश्रेष्ठ {b})", rwDailyBonus: "💰 +{n} दैनिक बोनस!", rwDailyDone: "आज का इनाम मिल चुका — कल फिर", rwBoss: "💰 +{n} बॉस इनाम!",
legend1: "🛸 ड्रोन झुंड·तेज़·बचाव · 🎯 निशानेबाज़ दूर·स्नाइप · 🛡️ रक्षक टैंक·ढाल",
legend2: "🤖 ब्रूज़र पास·धावा · 🧠 कमांडर सबसे चतुर·बूस्ट · 🐉 टाइटन पौराणिक",
legend3: "ऊँचा टियर = होशियार AI = सफ़ाया। गाचा से अपग्रेड·🐉 अनलॉक।",
spTitle: "💎 स्टार्टर पैक", sp1: "💰 3,000 गोल्ड तुरंत", sp2: "📈 गोल्ड लाभ हमेशा +20%", sp3: "🎰 10 यूनिट तुरंत + स्थायी लाभ", spPrice: "एक बार · ⭐50",
tComingTb: "⚔️ टर्न-आधारित — जल्द आ रहा!", tComingAr: "🏟️ PvP अखाड़ा — जल्द आ रहा!", tNoSwitch: "युद्ध में मोड नहीं बदल सकते",
tGoldShort: "गोल्ड कम! {n}g चाहिए", tBought: "🛒 खरीदा −{n}g", tSold: "💸 बेचा +{n}g", tMaxUnit: "इस यूनिट की सीमा (12)",
tAutoStart: "⚔️ ऑटो-शिकार चालू — खुद लड़ता है", tAutoStop: "ऑटो-शिकार बंद", tAutoRun: "⚔️ ऑटो-शिकार चल रहा…",
tGachaUp: "यूनिट +{n} अपग्रेड", tTitan: "🐉 पौराणिक टाइटन अनलॉक!!", tDaily: "🎁 दैनिक इनाम +150 गोल्ड!", tIdle: "🌙 निष्क्रिय इनाम ({t}) +{n} गोल्ड!",
tStarter: "💎 स्टार्टर पैक प्राप्त! 3000 गोल्ड + 10 यूनिट + गोल्ड+20% स्थायी", tOwned: "पहले से",
tUlt: "💥 {x}!", tHeroUp: "🦸 {x} अपग्रेड! Lv{n}",
heroes: { strategist: ["रणनीतिकार", "पूरी सेना AI +1"], berserker: ["योद्धा", "पूरी सेना ATK +15%"], warden: ["रक्षक", "पूरी सेना HP +20%"], ranger: ["निशानेबाज़ नायक", "ड्रोन·निशानेबाज़ ATK +30%"], mech: ["मैक कमांडर", "ब्रूज़र·रक्षक HP +40%"], engineer: ["इंजीनियर", "पूरी सेना HP रिजेन"], dragoon: ["ड्रैगून", "पूरी सेना +8% · तेज़ अल्टी"] },
ultName: { focus: "रणनीतिक आदेश", rage: "उन्माद", wall: "लौह दीवार", volley: "वॉली", assault: "हमला", repair: "मरम्मत", dragon: "ड्रैगन अवतरण" },
},
ru: { statsTitle:"Статистика",statBest:"Лучшая глава",statCollect:"Собрано",statRebirth:"Перерождения",statPower:"Сила легиона",statPulls:"Всего круток",statWins:"Всего побед", carryVolume:"Рой массой",carrySeal:"вынес — твоё командование решило",carryLed:"вёл",vanguardFocus:"🔥 Авангард 24ч фокус",
title: "Daedalus",
"mode.campaign": "📖 Кампания", "mode.tower": "🗼 Башня", "mode.daily": "📅 Ежедн.", "mode.boss": "🐲 Босс", "mode.turnbased": "⚔️ Тактика", "mode.arena": "🏟️ Арена",
start: "▶ В бой", pause: "⏸ Пауза", resume: "▶ Продолжить", auto: "⚔️ Автобой", autoOn: "⚔️ Авто ВКЛ",
reset: "↻ Заново", retry: "Ещё раз ↻", cont: "Далее ▶", upgrade: "Улучшить", gacha: "🎰 Призыв 100", pkg: "💎 Набор",
buy: "Купить", later: "Позже", confirm: "ОК",
speed: "Скорость {n}x", speedLock: "Скорость 1x 🔒",
firstBuyDouble: "🎁 Первая покупка 2×",
armyTitle: "🔵 Мой легион", armySub: "(покупка за золото · − возврат 90%)",
sDeploy: "📖 Глава {n} — расставьте и ▶", sTower: "🗼 Башня этаж {n} (рекорд {b})",
sDaily: "📅 Подземелье — пройди ради золота💰", sDailyDone: "📅 На сегодня всё! Завтра снова ↩",
sBoss: "🐲 Рейд босса — победи гиганта!", sFight: "⚔️ В бою — ИИ сражается сам", sStart: "Расставьте армию и ▶ В бой",
rWin: "🏆 Победа!", rLose: "💀 Поражение", rDraw: "⚖️ Ничья", rChapter: "🏆 Глава пройдена!", rTower: "🏆 Этаж {n} взят!", rBoss: "🏆 Босс повержен!", rDaily: "🏆 Подземелье пройдено!",
rwGold: "💰 +{n}", rwStreak: " · 🔥{n} побед подряд!", rwChapter: "📖 Глава {n} открыта!", rwTowerNext: "🗼 Этаж {n} (рекорд {b})", rwDailyBonus: "💰 +{n} ежедневный бонус!", rwDailyDone: "Награда уже получена — завтра снова", rwBoss: "💰 +{n} награда за босса!",
legend1: "🛸 Дрон рой·быстрый·уклон · 🎯 Стрелок даль·снайпер · 🛡️ Страж танк·щит",
legend2: "🤖 Боец ближний·рывок · 🧠 Командир умнейший·бафф · 🐉 Титан легендарный",
legend3: "Выше ранг = умнее ИИ = тотал. Призыв: улучшение·🐉.",
spTitle: "💎 Набор новичка", sp1: "💰 3,000 золота сразу", sp2: "📈 +20% золота навсегда", sp3: "🎰 10 юнитов сразу + постоянные бонусы", spPrice: "Один раз · ⭐50",
tComingTb: "⚔️ Пошаговая тактика — скоро!", tComingAr: "🏟️ PvP Арена — скоро!", tNoSwitch: "Нельзя менять режим в бою",
tGoldShort: "Мало золота! Нужно {n}", tBought: "🛒 Куплено −{n}", tSold: "💸 Продано +{n}", tMaxUnit: "Макс. для юнита (12)",
tAutoStart: "⚔️ Автобой включён — сам сражается", tAutoStop: "Автобой выключен", tAutoRun: "⚔️ Автобой идёт…",
tGachaUp: "Юниты +{n} улучшены", tTitan: "🐉 Легендарный Титан открыт!!", tDaily: "🎁 Ежедневная награда +150!", tIdle: "🌙 Награда за простой ({t}) +{n}!",
tStarter: "💎 Набор новичка получен! 3000 золота + 10 юнитов + +20% золота навсегда", tOwned: "Уже есть",
tUlt: "💥 {x}!", tHeroUp: "🦸 {x} улучшен! Ур.{n}",
heroes: { strategist: ["Стратег", "ИИ всех +1"], berserker: ["Берсерк", "Атака всех +15%"], warden: ["Страж", "HP всех +20%"], ranger: ["Командир стрелков", "Дрон·Стрелок атака +30%"], mech: ["Мех-командир", "Боец·Страж HP +40%"], engineer: ["Инженер", "Реген HP всех"], dragoon: ["Драгун", "Все +8% · мощный ульт"] },
ultName: { focus: "Приказ", rage: "Ярость", wall: "Стена", volley: "Залп", assault: "Штурм", repair: "Ремонт", dragon: "Сошествие дракона" },
},
};

const SET = {
ko: { setTitle: "설정", setLang: "언어", setSound: "사운드", setHaptic: "진동", setReset: "진행 초기화", setResetOk: "진행 초기화됨", langOk: "언어 변경됨", resetAsk: "정말 모든 진행을 초기화할까요?", evTitle: "이벤트", evAttend: "일일 출석 보상", evClaim: "출석 보상 받기", evMore: "더 많은 이벤트가 곧 추가됩니다", evDay: "{n}일차", evDone: "오늘 출석 완료! 내일 다시", tAttend: "🎁 {n}일차 출석 보상 획득!", shopTitle: "캐시 상점", shopNote: "실제 결제는 텔레그램 Stars 연동 예정" },
en: { setTitle: "Settings", setLang: "Language", setSound: "Sound", setHaptic: "Haptics", setReset: "Reset progress", setResetOk: "Progress reset", langOk: "Language changed", resetAsk: "Reset all progress?", evTitle: "Events", evAttend: "Daily Check-in", evClaim: "Claim today", evMore: "More events coming soon", evDay: "Day {n}", evDone: "Checked in today! Back tomorrow", tAttend: "🎁 Day {n} check-in reward!", shopTitle: "Shop", shopNote: "Real payment via Telegram Stars coming soon" },
ja: { setTitle: "設定", setLang: "言語", setSound: "サウンド", setHaptic: "振動", setReset: "進行リセット", setResetOk: "リセット完了", langOk: "言語を変更", resetAsk: "全ての進行をリセットしますか?", evTitle: "イベント", evAttend: "デイリーログイン", evClaim: "本日の報酬", evMore: "新イベント近日追加", evDay: "{n}日目", evDone: "本日ログイン済み! 明日また", tAttend: "🎁 {n}日目ログイン報酬獲得!", shopTitle: "ショップ", shopNote: "実決済はTelegram Stars対応予定" },
zh: { setTitle: "设置", setLang: "语言", setSound: "声音", setHaptic: "震动", setReset: "重置进度", setResetOk: "已重置", langOk: "已切换语言", resetAsk: "确定要重置所有进度吗?", evTitle: "活动", evAttend: "每日签到", evClaim: "领取今日", evMore: "更多活动即将上线", evDay: "第{n}天", evDone: "今日已签到! 明天再来", tAttend: "🎁 第{n}天签到奖励!", shopTitle: "商店", shopNote: "实际支付将接入Telegram Stars" },
hi: { setTitle: "सेटिंग", setLang: "भाषा", setSound: "ध्वनि", setHaptic: "कंपन", setReset: "प्रगति रीसेट", setResetOk: "रीसेट हो गया", langOk: "भाषा बदली", resetAsk: "सारी प्रगति रीसेट करें?", evTitle: "इवेंट", evAttend: "डेली चेक-इन", evClaim: "आज का इनाम", evMore: "और इवेंट जल्द", evDay: "दिन {n}", evDone: "आज चेक-इन हो गया! कल फिर", tAttend: "🎁 दिन {n} चेक-इन इनाम!", shopTitle: "स्टोर", shopNote: "जल्द Telegram Stars भुगतान" },
ru: { setTitle: "Настройки", setLang: "Язык", setSound: "Звук", setHaptic: "Вибрация", setReset: "Сброс прогресса", setResetOk: "Прогресс сброшен", langOk: "Язык изменён", resetAsk: "Сбросить весь прогресс?", evTitle: "События", evAttend: "Ежедневный вход", evClaim: "Забрать", evMore: "Скоро новые события", evDay: "День {n}", evDone: "Вход засчитан! Завтра снова", tAttend: "🎁 Награда за день {n}!", shopTitle: "Магазин", shopNote: "Оплата через Telegram Stars скоро" },
};
for (const l in SET) Object.assign(I18N[l], SET[l]);

const CODE_I18N = {
ko: { setCode: "이벤트 코드", setComm: "커뮤니티 채널 (준비중)", codeUsed: "이미 사용한 코드", codeBad: "잘못된 코드", codeOk: "🎟️ 코드 보상: {x}" },
en: { setCode: "Event Code", setComm: "Community channel (soon)", codeUsed: "Code already used", codeBad: "Invalid code", codeOk: "🎟️ Code reward: {x}" },
ja: { setCode: "イベントコード", setComm: "コミュニティ (近日)", codeUsed: "使用済みコード", codeBad: "無効なコード", codeOk: "🎟️ コード報酬: {x}" },
zh: { setCode: "活动码", setComm: "社区频道 (即将)", codeUsed: "该码已使用", codeBad: "无效的码", codeOk: "🎟️ 兑换奖励: {x}" },
hi: { setCode: "इवेंट कोड", setComm: "कम्युनिटी (जल्द)", codeUsed: "कोड पहले से उपयोग", codeBad: "गलत कोड", codeOk: "🎟️ कोड इनाम: {x}" },
ru: { setCode: "Промокод", setComm: "Сообщество (скоро)", codeUsed: "Код уже использован", codeBad: "Неверный код", codeOk: "🎟️ Награда: {x}" },
};
for (const l in CODE_I18N) Object.assign(I18N[l], CODE_I18N[l]);

const VIRAL_I18N = {
ko: { shareBtn: "📤 MY Dominion 공유", shareReward: "💎 공유 보상 +5 (쿨다운 24h)", shareCooldown: "공유 쿨다운 {h}시간 남음 — anti-abuse TG user verify 적용", shareSent: "TG 공유 완료! Legion total sync", dominionCard: "MY DOMINION", exportCard: "카드 내보내기", factionRename: "내 Dominion 이름 (클랜 태그)", factionTag: "자동 태그", a11yHigh: "고대비 모드", a11yVfx: "god-VFX 패턴 폴백 (색맹/저대비/햅틱 대체)", carriedQuote: "Legion total sync", nonGamerWin: "이건 네 실제 AI 군단 명령이야", firstWinOverlay: "🏆 첫 승리! 내 군단이 {carried}% 활약 — 네 지휘였다", legionQuoteViral: "Legion total sync" },
en: { shareBtn: "📤 Share MY Dominion", shareReward: "💎 Share reward +5 (24h cd)", shareCooldown: "Share cooldown {h}h — TG user verify anti-abuse", shareSent: "Shared to TG! Legion total sync", dominionCard: "MY DOMINION", exportCard: "Export Card", factionRename: "My Dominion name (clan tag)", factionTag: "Auto tag", a11yHigh: "High contrast", a11yVfx: "god-VFX pattern fallback (colorblind/low-contrast/haptic alt)", carriedQuote: "Legion total sync", nonGamerWin: "This is your actual command over real AI army", firstWinOverlay: "🏆 First win! Your Legion carried {carried}% — yours", legionQuoteViral: "Legion total sync" },
ja: { shareBtn: "📤 MY Dominion共有", shareReward: "💎 共有報酬 +5 (24hクール)", shareCooldown: "共有クールダウン {h}時間 — TG認証 anti-abuse適用", shareSent: "TG共有完了! Legion total sync", dominionCard: "MY DOMINION", exportCard: "カード出力", factionRename: "Dominion名 (クランタグ)", factionTag: "自動タグ", a11yHigh: "ハイコントラスト", a11yVfx: "god-VFX代替 (色覚/低コント/触覚)", carriedQuote: "Legion total sync", nonGamerWin: "これは君の本物のAI軍団指揮だ", firstWinOverlay: "🏆 初勝利! 軍団が{carried}%活躍 — 君の指揮", legionQuoteViral: "Legion total sync" },
zh: { shareBtn: "📤 MY Dominion 分享", shareReward: "💎 分享奖励 +5 (24h冷却)", shareCooldown: "分享冷却 {h}小时 — TG用户验证反滥用", shareSent: "TG分享完成! Legion total sync", dominionCard: "MY DOMINION", exportCard: "导出卡片", factionRename: "Dominion名称 (部落标签)", factionTag: "自动标签", a11yHigh: "高对比", a11yVfx: "god-VFX回退 (色盲/低对比/触觉)", carriedQuote: "Legion total sync", nonGamerWin: "这是你对真实AI军团的实际指挥", firstWinOverlay: "🏆 首胜! 军团承载{carried}% — 你的指挥", legionQuoteViral: "Legion total sync" },
hi: { shareBtn: "📤 MY Dominion शेयर", shareReward: "💎 शेयर इनाम +5 (24h cd)", shareCooldown: "शेयर कूलडाउन {h}h — TG वेरिफाई एंटी-अब्यूज", shareSent: "TG शेयर पूरा! Legion total sync", dominionCard: "MY DOMINION", exportCard: "कार्ड एक्सपोर्ट", factionRename: "Dominion नाम (क्लैन टैग)", factionTag: "ऑटो टैग", a11yHigh: "हाई कंट्रास्ट", a11yVfx: "god-VFX फॉलबैक (कलरब्लाइंड/लो-कंट्रास्ट/हैप्टिक)", carriedQuote: "Legion total sync", nonGamerWin: "यह तुम्हारी असली AI सेना पर कमांड है", firstWinOverlay: "🏆 पहली जीत! लीजन ने {carried}% किया — तुम्हारी कमान", legionQuoteViral: "Legion total sync" },
ru: { shareBtn: "📤 MY Dominion поделиться", shareReward: "💎 Награда за шеру +5 (24ч кд)", shareCooldown: "Кулдаун шеры {h}ч — TG verify anti-abuse", shareSent: "TG шара сделана! Legion total sync", dominionCard: "MY DOMINION", exportCard: "Экспорт карты", factionRename: "Имя Dominion (клан-тег)", factionTag: "Авто тег", a11yHigh: "Высокий контраст", a11yVfx: "god-VFX fallback (дальтонизм/низк.контраст/хаптик)", carriedQuote: "Legion total sync", nonGamerWin: "Это твое реальное командование над ИИ-армией", firstWinOverlay: "🏆 Первая победа! Легион вынес {carried}% — твоя команда", legionQuoteViral: "Legion total sync" },
};
for (const l in VIRAL_I18N) Object.assign(I18N[l], VIRAL_I18N[l]);

const GEM_I18N = {
ko: { gacha10: "💎 10연", tGemShort: "다이아 부족! 💎{n} 필요", tGacha10: "🎉 10연 결과: 최고 {x}!" },
en: { gacha10: "💎 10x", tGemShort: "Not enough gems! Need 💎{n}", tGacha10: "🎉 10x result: best {x}!" },
ja: { gacha10: "💎 10連", tGemShort: "ダイヤ不足! 💎{n}必要", tGacha10: "🎉 10連結果: 最高 {x}!" },
zh: { gacha10: "💎 十连", tGemShort: "钻石不足! 需要💎{n}", tGacha10: "🎉 十连结果: 最高 {x}!" },
hi: { gacha10: "💎 10x", tGemShort: "जेम कम! 💎{n} चाहिए", tGacha10: "🎉 10x परिणाम: सर्वश्रेष्ठ {x}!" },
ru: { gacha10: "💎 10x", tGemShort: "Мало алмазов! Нужно 💎{n}", tGacha10: "🎉 10x: лучшее {x}!" },
};
for (const l in GEM_I18N) Object.assign(I18N[l], GEM_I18N[l]);

const VIP_I18N = {
ko: { vipTitle: "VIP 패키지", tVip: "👑 VIP 획득! 속도8x·골드+50%·💎300" },
en: { vipTitle: "VIP Pack", tVip: "👑 VIP unlocked! 8x speed·+50% gold·💎300" },
ja: { vipTitle: "VIPパック", tVip: "👑 VIP獲得! 速度8x·ゴールド+50%·💎300" },
zh: { vipTitle: "VIP礼包", tVip: "👑 获得VIP! 8倍速·金币+50%·💎300" },
hi: { vipTitle: "VIP पैक", tVip: "👑 VIP अनलॉक! 8x गति·+50% गोल्ड·💎300" },
ru: { vipTitle: "VIP набор", tVip: "👑 VIP! Скорость 8x·+50% золота·💎300" },
};
for (const l in VIP_I18N) Object.assign(I18N[l], VIP_I18N[l]);
Object.assign(I18N.ko, { vipTitle: "VIP 패키지", tVip: "👑 VIP! 4x속도·골드+50%·💎600·SR유닛", ultraTitle: "울트라 패키지", tUltra: "🔱 울트라! 8x속도·VIP혜택·💎2000·💰50k·SSR유닛+SSR장비" });
Object.assign(I18N.en, { vipTitle: "VIP Pack", tVip: "👑 VIP! 4x speed·+50% gold·💎600·SR unit", ultraTitle: "Ultra Pack", tUltra: "🔱 Ultra! 8x speed·VIP perks·💎2000·💰50k·SSR unit+gear" });
Object.assign(I18N.ja, { vipTitle: "VIPパック", tVip: "👑 VIP! 4x速度·金+50%·💎600·SRユニット", ultraTitle: "ウルトラパック", tUltra: "🔱 ウルトラ! 8x速度·VIP特典·💎2000·💰50k·SSRユニット+装備" });
Object.assign(I18N.zh, { vipTitle: "VIP礼包", tVip: "👑 VIP! 4倍速·金币+50%·💎600·SR单位", ultraTitle: "至尊礼包", tUltra: "🔱 至尊! 8倍速·VIP特权·💎2000·💰50k·SSR单位+装备" });
Object.assign(I18N.hi, { vipTitle: "VIP पैक", tVip: "👑 VIP! 4x गति·+50% गोल्ड·💎600·SR यूनिट", ultraTitle: "अल्ट्रा पैक", tUltra: "🔱 अल्ट्रा! 8x गति·VIP·💎2000·💰50k·SSR यूनिट+गियर" });
Object.assign(I18N.ru, { vipTitle: "VIP набор", tVip: "👑 VIP! 4x скор.·+50% золота·💎600·SR юнит", ultraTitle: "Ультра набор", tUltra: "🔱 Ультра! 8x скор.·VIP·💎2000·💰50k·SSR юнит+снаряга" });

const DASH_I18N = {
ko: { dash: "📋 도감", dashTitle: "군단 도감", dEnhance: "강화", dRate: "성공률", dSuccess: "✨ 강화 성공! +{n}", dFail: "💢 강화 실패…", dProtect: "💎 보호 사용", dPower: "군단 전력", dDividend: "복리 배당: 전투마다 +{n}골드", dUlt: "궁극기", dCombo: "조합", dShards: "조각" },
en: { dash: "📋 Codex", dashTitle: "Legion Codex", dEnhance: "Enhance", dRate: "Success", dSuccess: "✨ Enhance success! +{n}", dFail: "💢 Enhance failed…", dProtect: "💎 Protect", dPower: "Legion Power", dDividend: "Dividend: +{n} gold per battle", dUlt: "Ultimate", dCombo: "Combine", dShards: "Shards" },
ja: { dash: "📋 図鑑", dashTitle: "軍団図鑑", dEnhance: "強化", dRate: "成功率", dSuccess: "✨ 強化成功! +{n}", dFail: "💢 強化失敗…", dProtect: "💎 保護", dPower: "軍団戦力", dDividend: "配当: 戦闘毎 +{n}ゴールド", dUlt: "奥義", dCombo: "合成", dShards: "欠片" },
zh: { dash: "📋 图鉴", dashTitle: "军团图鉴", dEnhance: "强化", dRate: "成功率", dSuccess: "✨ 强化成功! +{n}", dFail: "💢 强化失败…", dProtect: "💎 保护", dPower: "军团战力", dDividend: "分红: 每战 +{n}金币", dUlt: "必杀", dCombo: "合成", dShards: "碎片" },
hi: { dash: "📋 कोडेक्स", dashTitle: "लीजन कोडेक्स", dEnhance: "एन्हांस", dRate: "सफलता", dSuccess: "✨ सफल! +{n}", dFail: "💢 विफल…", dProtect: "💎 सुरक्षा", dPower: "लीजन पावर", dDividend: "डिविडेंड: हर युद्ध +{n} गोल्ड", dUlt: "अल्टीमेट", dCombo: "कंबाइन", dShards: "शार्ड" },
ru: { dash: "📋 Кодекс", dashTitle: "Кодекс легиона", dEnhance: "Улучшить", dRate: "Успех", dSuccess: "✨ Успех! +{n}", dFail: "💢 Провал…", dProtect: "💎 Защита", dPower: "Сила легиона", dDividend: "Дивиденд: +{n} золота за бой", dUlt: "Ульта", dCombo: "Синтез", dShards: "Осколки" },
};
for (const l in DASH_I18N) Object.assign(I18N[l], DASH_I18N[l]);
Object.assign(I18N.ko, { dPerBattle: "전투" }); Object.assign(I18N.en, { dPerBattle: "battle" }); Object.assign(I18N.ja, { dPerBattle: "戦闘" }); Object.assign(I18N.zh, { dPerBattle: "战斗" }); Object.assign(I18N.hi, { dPerBattle: "युद्ध" }); Object.assign(I18N.ru, { dPerBattle: "бой" });

const GEAR_I18N = {
ko: { gTitle: "장비", gCraft: "제작", gEquip: "장착", gEmpty: "장비 없음 — 제작하세요", gFull: "보유 한도 도달 (총 500)", gGot: "🔨 장비 제작: {x}", st_str: "힘", st_int: "지능", st_agi: "민첩", st_luk: "운" },
en: { gTitle: "Gear", gCraft: "Craft", gEquip: "Equip", gEmpty: "No gear — craft some", gFull: "Inventory full (total 500)", gGot: "🔨 Crafted: {x}", st_str: "STR", st_int: "INT", st_agi: "AGI", st_luk: "LUK" },
ja: { gTitle: "装備", gCraft: "製作", gEquip: "装着", gEmpty: "装備なし — 製作を", gFull: "所持上限 (合計500)", gGot: "🔨 製作: {x}", st_str: "力", st_int: "知", st_agi: "敏", st_luk: "運" },
zh: { gTitle: "装备", gCraft: "制作", gEquip: "装备", gEmpty: "无装备 — 去制作", gFull: "持有上限 (总计500)", gGot: "🔨 制作: {x}", st_str: "力", st_int: "智", st_agi: "敏", st_luk: "运" },
hi: { gTitle: "गियर", gCraft: "बनाएं", gEquip: "पहनें", gEmpty: "कोई गियर नहीं", gFull: "धारण सीमा (कुल 500)", gGot: "🔨 बनाया: {x}", st_str: "STR", st_int: "INT", st_agi: "AGI", st_luk: "LUK" },
ru: { gTitle: "Снаряжение", gCraft: "Создать", gEquip: "Надеть", gEmpty: "Нет снаряжения", gFull: "Лимит (всего 500)", gGot: "🔨 Создано: {x}", st_str: "СИЛ", st_int: "ИНТ", st_agi: "ЛОВ", st_luk: "УДЧ" },
};
for (const l in GEAR_I18N) Object.assign(I18N[l], GEAR_I18N[l]);
Object.assign(I18N.ko, { locked: "미보유", lockedHint: "뽑기로 획득하세요" }); Object.assign(I18N.en, { locked: "Locked", lockedHint: "Pull to unlock" }); Object.assign(I18N.ja, { locked: "未所持", lockedHint: "ガチャで入手" }); Object.assign(I18N.zh, { locked: "未拥有", lockedHint: "抽卡获得" }); Object.assign(I18N.hi, { locked: "लॉक", lockedHint: "गाचा से पाएं" }); Object.assign(I18N.ru, { locked: "Закрыто", lockedHint: "Откройте призывом" });
Object.assign(I18N.ko, { evSeason: "시즌 이벤트", shopGacha: "뽑기", shopPack: "패키지 · 재화", seasonSoon: "시즌 이벤트 준비중", seasonHint: "곧 한정 이벤트·랭킹 보상이 열립니다", tArenaDone: "오늘 아레나 5회 완료", tArenaMatch: "아레나 매칭 (placeholder) — Phase2에서 풀 구현", tMystery: "❓ ??? : 비밀의 레기온 창. 곧 공개될 새로운 모드! 지금은... 궁금증만 폭발?", tCampaignCh: "📖 캠페인 ch", tSoulShop: "소울 상점", tDismantle: "🔮 중복 캐릭터 전부 소울로 분해(첫 장 보존·SSR 제외)", tAscBanner: "🔄 <b>환생 가능</b> · 지금 환생 시 ⬡ +{e} <span class=\"asc-prompt-cta\">탭 →</span>", tCampaignChLabel: "📖 캠페인 ch", synHeader: "⚡ 군단 시너지", diversity: "다양성" });
Object.assign(I18N.en, { evSeason: "Season Event", shopGacha: "Summon", shopPack: "Packs · Currency", seasonSoon: "Season event soon", seasonHint: "Limited events & ranking rewards coming", tArenaDone: "Arena 5 runs done today", tArenaMatch: "Arena match (placeholder) — full in Phase2", tMystery: "❓ ??? : Secret Legion window. New mode coming soon! For now... pure curiosity?", tCampaignCh: "📖 Campaign ch", tSoulShop: "Soul Shop", tDismantle: "🔮 Dismantle all dupes to souls(keep 1st · SSR exempt)", tAscBanner: "🔄 <b>Ascend ready</b> · +⬡ {e} now <span class=\"asc-prompt-cta\">tap →</span>", tCampaignChLabel: "📖 Campaign ch", synHeader: "⚡ Legion Synergy", diversity: "Diversity" });
Object.assign(I18N.ja, { evSeason: "シーズンイベント", shopGacha: "ガチャ", shopPack: "パック · 通貨", seasonSoon: "シーズン準備中", seasonHint: "限定イベント・ランキング報酬が近日", tArenaDone: "アリーナ本日5回完了", tArenaMatch: "アリーナマッチ (プレースホルダ) — Phase2で完全実装", tMystery: "❓ ??? : 秘密のレギオン窓。まもなく新モード公開! 今は好奇心だけ…", tCampaignCh: "📖 チャプター ch", tSoulShop: "ソウルショップ", tDismantle: "🔮 重複キャラ全部ソウル分解(1枚目保持・SSR除外)", tAscBanner: "🔄 <b>転生可能</b> · 今転生で ⬡ +{e} <span class=\"asc-prompt-cta\">タップ →</span>", tCampaignChLabel: "📖 チャプター ch", synHeader: "⚡ 軍団シナジー", diversity: "多様性" });
Object.assign(I18N.zh, { evSeason: "赛季活动", shopGacha: "抽卡", shopPack: "礼包 · 货币", seasonSoon: "赛季活动准备中", seasonHint: "限时活动与排名奖励即将开启", tArenaDone: "今日竞技场5次完成", tArenaMatch: "竞技场匹配 (占位) — Phase2完整实现", tMystery: "❓ ??? : 秘密军团窗口。新模式即将公开！现在只有好奇心爆炸…", tCampaignCh: "📖 章节 ch", tSoulShop: "灵魂商店", tDismantle: "🔮 全部重复角色分解为灵魂(保留首张·SSR除外)", tAscBanner: "🔄 <b>可转生</b> · 现在转生 ⬡ +{e} <span class=\"asc-prompt-cta\">点击 →</span>", tCampaignChLabel: "📖 章节 ch", synHeader: "⚡ 军团协同", diversity: "多样性" });
Object.assign(I18N.hi, { evSeason: "सीज़न इवेंट", shopGacha: "समन", shopPack: "पैक · करेंसी", seasonSoon: "सीज़न इवेंट जल्द", seasonHint: "लिमिटेड इवेंट और रैंकिंग इनाम", tArenaDone: "आज अखाड़ा 5 बार पूर्ण", tArenaMatch: "अखाड़ा मैच (प्लेसहोल्डर) — Phase2 में पूरा", tMystery: "❓ ??? : गुप्त लीजन विंडो। जल्द नया मोड! अभी सिर्फ जिज्ञासा...", tCampaignCh: "📖 अध्याय ch", tSoulShop: "आत्मा दुकान", tDismantle: "🔮 सभी डुप्लीकेट किरदार आत्मा में तोड़ें(पहला रखें·SSR छोड़ें)", tAscBanner: "🔄 <b>पुनर्जन्म तैयार</b> · अभी ⬡ +{e} <span class=\"asc-prompt-cta\">टैप →</span>", tCampaignChLabel: "📖 अध्याय ch", synHeader: "⚡ लीजन सिनर्जी", diversity: "विविधता" });
Object.assign(I18N.ru, { evSeason: "Сезонное событие", shopGacha: "Призыв", shopPack: "Наборы · Валюта", seasonSoon: "Сезон скоро", seasonHint: "Лимитные события и награды рейтинга", tArenaDone: "Сегодня арена 5 раз завершена", tArenaMatch: "Арена матч (плейсхолдер) — полный в Phase2", tMystery: "❓ ??? : Тайное окно Легиона. Скоро новый режим! Пока лишь любопытство взрывается?", tCampaignCh: "📖 Глава ch", tSoulShop: "Магазин душ", tDismantle: "🔮 Все дубликаты героев в души(1-й сохранить·SSR исключить)", tAscBanner: "🔄 <b>Перерождение доступно</b> · сейчас ⬡ +{e} <span class=\"asc-prompt-cta\">тап →</span>", tCampaignChLabel: "📖 Глава ch", synHeader: "⚡ Синергия Легиона", diversity: "Разнообразие" });
Object.assign(I18N.ko, { navBattle: "전투", navChar: "캐릭터", navCodex: "도감", navShop: "상점", navEvent: "이벤트", navSet: "설정" });
Object.assign(I18N.en, { navBattle: "Battle", navChar: "Units", navCodex: "Codex", navShop: "Shop", navEvent: "Events", navSet: "Settings" });
Object.assign(I18N.ja, { navBattle: "戦闘", navChar: "ユニット", navCodex: "図鑑", navShop: "ショップ", navEvent: "イベント", navSet: "設定" });
Object.assign(I18N.zh, { navBattle: "战斗", navChar: "角色", navCodex: "图鉴", navShop: "商店", navEvent: "活动", navSet: "设置" });
Object.assign(I18N.hi, { navBattle: "युद्ध", navChar: "यूनिट", navCodex: "कोडेक्स", navShop: "स्टोर", navEvent: "इवेंट", navSet: "सेटिंग" });
Object.assign(I18N.ru, { navBattle: "Бой", navChar: "Юниты", navCodex: "Кодекс", navShop: "Магазин", navEvent: "События", navSet: "Настройки" });
Object.assign(I18N.ko, { tBox: "🎁 선물상자: {x} 유닛!" }); Object.assign(I18N.en, { tBox: "🎁 Gift box: {x} unit!" }); Object.assign(I18N.ja, { tBox: "🎁 ギフト箱: {x}ユニット!" }); Object.assign(I18N.zh, { tBox: "🎁 礼盒: {x}单位!" }); Object.assign(I18N.hi, { tBox: "🎁 गिफ्ट: {x} यूनिट!" }); Object.assign(I18N.ru, { tBox: "🎁 Подарок: {x} юнит!" });

const STRAT = {
ko: { legend4: "⚔️ 상성: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3종↑ 편성 시너지" },
en: { legend4: "⚔️ Counters: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3+ types = synergy" },
ja: { legend4: "⚔️ 相性: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3種以上で連携" },
zh: { legend4: "⚔️ 克制: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3种以上协同" },
hi: { legend4: "⚔️ काउंटर: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3+ प्रकार सिनर्जी" },
ru: { legend4: "⚔️ Контры: 🛸▶🎯▶🛡️🤖▶🛸 (+30%) · 3+ типа синергия" },
};
for (const l in STRAT) Object.assign(I18N[l], STRAT[l]);

const PLAY_I18N = {
ko: { tTowerFall: "🗼 {n}층으로 후퇴 — 위로금 💰{g}, 계속 농사", playTitle: "오늘의 플레이 보상", playHint: "접속해 플레이한 시간만큼 보상! (매일 0시 초기화)", playClaim: "받기", playGot: "✅ 받음", playLock: "🔒 {m}분", tPlay: "⏱️ 플레이 보상 획득! {x}", playNow: "현재 {m}분 플레이" },
en: { tTowerFall: "🗼 Fell to floor {n} — consolation 💰{g}, keep farming", playTitle: "Today's Playtime Rewards", playHint: "Rewards for time played! (resets daily)", playClaim: "Claim", playGot: "✅ Got", playLock: "🔒 {m}m", tPlay: "⏱️ Playtime reward! {x}", playNow: "{m} min played" },
ja: { tTowerFall: "🗼 {n}階に後退 — 見舞金 💰{g}、農場継続", playTitle: "本日のプレイ報酬", playHint: "プレイ時間で報酬! (毎日リセット)", playClaim: "受取", playGot: "✅ 完了", playLock: "🔒 {m}分", tPlay: "⏱️ プレイ報酬獲得! {x}", playNow: "{m}分プレイ中" },
zh: { tTowerFall: "🗼 退回第{n}层 — 慰问 💰{g}，继续刷", playTitle: "今日游玩奖励", playHint: "按游玩时长发奖! (每日重置)", playClaim: "领取", playGot: "✅ 已领", playLock: "🔒 {m}分", tPlay: "⏱️ 游玩奖励! {x}", playNow: "已玩{m}分" },
hi: { tTowerFall: "🗼 मंज़िल {n} पर वापस — 💰{g}, खेती जारी", playTitle: "आज के खेल इनाम", playHint: "खेले गए समय का इनाम! (रोज़ रीसेट)", playClaim: "लें", playGot: "✅ मिला", playLock: "🔒 {m}मि", tPlay: "⏱️ खेल इनाम! {x}", playNow: "{m} मिनट खेला" },
ru: { tTowerFall: "🗼 Откат на этаж {n} — 💰{g}, фарм продолжается", playTitle: "Награды за игру сегодня", playHint: "Награды за время в игре! (сброс ежедневно)", playClaim: "Забрать", playGot: "✅ Есть", playLock: "🔒 {m}м", tPlay: "⏱️ Награда за игру! {x}", playNow: "Сыграно {m} мин" },
};
for (const l in PLAY_I18N) Object.assign(I18N[l], PLAY_I18N[l]);

const PROF_I18N = {
ko: { profTitle: "내 프로필", profGuest: "텔레그램 앱으로 열면 프로필이 표시됩니다" },
en: { profTitle: "My Profile", profGuest: "Open in Telegram to see your profile" },
ja: { profTitle: "マイプロフィール", profGuest: "Telegramで開くとプロフィール表示" },
zh: { profTitle: "我的资料", profGuest: "在Telegram中打开以显示资料" },
hi: { profTitle: "मेरी प्रोफ़ाइल", profGuest: "प्रोफ़ाइल देखने हेतु Telegram में खोलें" },
ru: { profTitle: "Мой профиль", profGuest: "Откройте в Telegram, чтобы увидеть профиль" },
};
for (const l in PROF_I18N) Object.assign(I18N[l], PROF_I18N[l]);

const SOUL_I18N = {
ko: { awNeedStar: "★3 이상부터 각성 가능", awMax: "각성 최대치(✦3)", awSoulShort: "소울 부족! 🔮{n} 필요", awDone: "각성 ✦{n}! AI +1", soulShopT: "🔮 소울 제단", soulSSR: "확정 SSR 소환", soulShort: "소울 부족! 🔮{n}", tSoulSSR: "🔮 확정 SSR: {x}!" },
en: { awNeedStar: "Awaken needs ★3+", awMax: "Awaken maxed (✦3)", awSoulShort: "Not enough souls! 🔮{n}", awDone: "Awakened ✦{n}! AI +1", soulShopT: "🔮 Soul Altar", soulSSR: "Guaranteed SSR", soulShort: "Not enough souls! 🔮{n}", tSoulSSR: "🔮 Guaranteed SSR: {x}!" },
ja: { awNeedStar: "覚醒は★3以上", awMax: "覚醒最大(✦3)", awSoulShort: "ソウル不足! 🔮{n}", awDone: "覚醒 ✦{n}! AI +1", soulShopT: "🔮 ソウル祭壇", soulSSR: "確定SSR召喚", soulShort: "ソウル不足! 🔮{n}", tSoulSSR: "🔮 確定SSR: {x}!" },
zh: { awNeedStar: "觉醒需★3+", awMax: "觉醒已满(✦3)", awSoulShort: "灵魂不足! 🔮{n}", awDone: "觉醒 ✦{n}! AI +1", soulShopT: "🔮 灵魂祭坛", soulSSR: "保底SSR召唤", soulShort: "灵魂不足! 🔮{n}", tSoulSSR: "🔮 保底SSR: {x}!" },
hi: { awNeedStar: "जागृति ★3+ चाहिए", awMax: "जागृति पूर्ण(✦3)", awSoulShort: "आत्मा कम! 🔮{n}", awDone: "जागृत ✦{n}! AI +1", soulShopT: "🔮 आत्मा वेदी", soulSSR: "गारंटी SSR", soulShort: "आत्मा कम! 🔮{n}", tSoulSSR: "🔮 गारंटी SSR: {x}!" },
ru: { awNeedStar: "Пробуждение с ★3+", awMax: "Макс. пробуждение(✦3)", awSoulShort: "Мало душ! 🔮{n}", awDone: "Пробуждён ✦{n}! AI +1", soulShopT: "🔮 Алтарь душ", soulSSR: "Гарант. SSR", soulShort: "Мало душ! 🔮{n}", tSoulSSR: "🔮 Гарант. SSR: {x}!" },
};
for (const l in SOUL_I18N) Object.assign(I18N[l], SOUL_I18N[l]);
const SOULHINT_I18N = {
ko: "🔮 소울은 보스만 드랍하는 희소 재화. 오직 ✦각성에만 사용 — 유닛 AI를 영리하게 만들고 초월(✦5)시킨다.",
en: "🔮 Souls drop only from bosses — rare. Used only for ✦Awakening: make units smarter (AI) and transcend (✦5).",
ja: "🔮 ソウルはボス限定の希少素材。✦覚醒のみに使用 — AIを賢くし超越(✦5)。",
zh: "🔮 灵魂仅Boss掉落，稀有。只用于✦觉醒：让单位更聪明(AI)并超越(✦5)。",
hi: "🔮 आत्मा केवल बॉस से — दुर्लभ। सिर्फ ✦जागृति हेतु: यूनिट को होशियार(AI) व पारलौकिक(✦5) बनाएँ।",
ru: "🔮 Души падают только с боссов — редкость. Только для ✦Пробуждения: умнее (AI) и трансцендент (✦5).",
};
for (const l in SOULHINT_I18N) I18N[l].soulAwakHint = SOULHINT_I18N[l];

const SHOP2_I18N = {
ko: { pkMonthly: "📅 월간 패스 · 즉시💎300 + 30일 매일💎100", pkWeekly: "📅 주간 패스 · 즉시💎150 + 7일 매일💎100", pkGrow1: "📦 성장 패키지 · 💰5만+💎200+SR장비×2", pkGrow2: "🎁 고급 성장팩 · 💰20만+💎800+SSR유닛+장비", pkStarter: "💎 초심자 패키지 · 골드+20% 영구 + 즉시 3,000골드 + 유닛 10개", passDaily: "패스 보상 💎+{n}", tMonthly: "📅 월간 패스 활성! 💎300 + 매일💎100", tWeekly: "📅 주간 패스 활성! 💎150 + 매일💎100", tGrowth: "🎁 성장 패키지 획득!" },
en: { pkMonthly: "📅 Monthly Pass · 💎300 now + 💎100/day×30", pkWeekly: "📅 Weekly Pass · 💎150 now + 💎100/day×7", pkGrow1: "📦 Growth Pack · 💰50k+💎200+2 SR gear", pkGrow2: "🎁 Premium Growth · 💰200k+💎800+SSR unit+gear", pkStarter: "💎 Starter Pack · +20% gold permanent + 3,000 gold instant + 10 units", passDaily: "Pass reward 💎+{n}", tMonthly: "📅 Monthly Pass active! 💎300 + 💎100/day", tWeekly: "📅 Weekly Pass active! 💎150 + 💎100/day", tGrowth: "🎁 Growth pack acquired!" },
ja: { pkMonthly: "📅 月間パス · 即💎300 + 30日毎日💎100", pkWeekly: "📅 週間パス · 即💎150 + 7日毎日💎100", pkGrow1: "📦 成長パック · 💰5万+💎200+SR装備×2", pkGrow2: "🎁 上級成長パック · 💰20万+💎800+SSRユニット+装備", pkStarter: "💎 初心者パック · ゴールド+20%永久 + 即3000ゴールド + ユニット10体", passDaily: "パス報酬 💎+{n}", tMonthly: "📅 月間パス有効! 💎300 + 毎日💎100", tWeekly: "📅 週間パス有効! 💎150 + 毎日💎100", tGrowth: "🎁 成長パック獲得!" },
zh: { pkMonthly: "📅 月卡 · 立即💎300 + 30天每日💎100", pkWeekly: "📅 周卡 · 立即💎150 + 7天每日💎100", pkGrow1: "📦 成长礼包 · 💰5万+💎200+SR装备×2", pkGrow2: "🎁 高级成长礼包 · 💰20万+💎800+SSR单位+装备", pkStarter: "💎 新手礼包 · 金币+20%永久 + 立即3000金币 + 10单位", passDaily: "通行证奖励 💎+{n}", tMonthly: "📅 月卡激活! 💎300 + 每日💎100", tWeekly: "📅 周卡激活! 💎150 + 每日💎100", tGrowth: "🎁 获得成长礼包!" },
hi: { pkMonthly: "📅 मासिक पास · तुरंत💎300 + 30दिन💎100/दिन", pkWeekly: "📅 साप्ताहिक पास · तुरंत💎150 + 7दिन💎100/दिन", pkGrow1: "📦 ग्रोथ पैक · 💰50k+💎200+2 SR गियर", pkGrow2: "🎁 प्रीमियम ग्रोथ · 💰200k+💎800+SSR यूनिट+गियर", pkStarter: "💎 स्टार्टर पैक · गोल्ड+20% स्थायी + तुरंत 3000 गोल्ड + 10 यूनिट", passDaily: "पास इनाम 💎+{n}", tMonthly: "📅 मासिक पास चालू! 💎300 + 💎100/दिन", tWeekly: "📅 साप्ताहिक पास चालू! 💎150 + 💎100/दिन", tGrowth: "🎁 ग्रोथ पैक मिला!" },
ru: { pkMonthly: "📅 Месячный пропуск · 💎300 + 💎100/день×30", pkWeekly: "📅 Недельный пропуск · 💎150 + 💎100/день×7", pkGrow1: "📦 Пакет роста · 💰50k+💎200+2 SR снаряги", pkGrow2: "🎁 Премиум рост · 💰200k+💎800+SSR юнит+снаряга", pkStarter: "💎 Набор новичка · +20% золота навсегда + сразу 3000 золота + 10 юнитов", passDaily: "Награда пропуска 💎+{n}", tMonthly: "📅 Месячный активен! 💎300 + 💎100/день", tWeekly: "📅 Недельный активен! 💎150 + 💎100/день", tGrowth: "🎁 Пакет роста получен!" },
};
for (const l in SHOP2_I18N) Object.assign(I18N[l], SHOP2_I18N[l]);

const PAY_I18N = {
ko: { payDemo: "🧪 데모 지급 (결제 연동 전)", payOpening: "💳 결제창 여는 중…", payOk: "✅ 결제 완료 — 지급됨!", payFail: "❌ 결제 실패", payCancel: "결제 취소됨", payErr: "⚠️ 결제 서버 연결 실패", payDemoNote: "🧪 데모 모드 (실제 Telegram Stars 결제는 Worker 배포 후 연동)" },
en: { payDemo: "🧪 Demo grant (payment not wired)", payOpening: "💳 Opening checkout…", payOk: "✅ Paid — granted!", payFail: "❌ Payment failed", payCancel: "Payment cancelled", payErr: "⚠️ Payment server error", payDemoNote: "🧪 Demo mode (real Telegram Stars requires Worker deploy)" },
ja: { payDemo: "🧪 デモ付与(決済未連携)", payOpening: "💳 決済画面を開いています…", payOk: "✅ 決済完了 — 付与!", payFail: "❌ 決済失敗", payCancel: "決済キャンセル", payErr: "⚠️ 決済サーバー接続失敗" },
zh: { payDemo: "🧪 演示发放(未接入支付)", payOpening: "💳 正在打开支付…", payOk: "✅ 支付完成 — 已发放!", payFail: "❌ 支付失败", payCancel: "已取消支付", payErr: "⚠️ 支付服务器错误" },
hi: { payDemo: "🧪 डेमो (भुगतान बाकी)", payOpening: "💳 चेकआउट खुल रहा…", payOk: "✅ भुगतान हुआ — मिला!", payFail: "❌ भुगतान विफल", payCancel: "भुगतान रद्द", payErr: "⚠️ भुगतान सर्वर त्रुटि" },
ru: { payDemo: "🧪 Демо-выдача (оплата не подключена)", payOpening: "💳 Открываем оплату…", payOk: "✅ Оплачено — выдано!", payFail: "❌ Ошибка оплаты", payCancel: "Оплата отменена", payErr: "⚠️ Ошибка платёжного сервера" },
};
for (const l in PAY_I18N) Object.assign(I18N[l], PAY_I18N[l]);

const TGONLY_I18N = { ko: "💳 텔레그램 미니앱에서 구매 가능해요", en: "💳 Purchase available in the Telegram mini app", ja: "💳 Telegramミニアプリで購入できます", zh: "💳 请在 Telegram 小程序内购买", hi: "💳 Telegram मिनी ऐप में खरीदें", ru: "💳 Покупка доступна в мини-приложении Telegram" };
for (const l in TGONLY_I18N) I18N[l].payTgOnly = TGONLY_I18N[l];

const TOWER_I18N = { ko: "🗼 무한탑 {n}층", en: "🗼 Tower F{n}", ja: "🗼 無限の塔 {n}階", zh: "🗼 无限塔 {n}层", hi: "🗼 टावर F{n}", ru: "🗼 Башня {n}эт" };
for (const l in TOWER_I18N) I18N[l].tTowerLabel = TOWER_I18N[l];

const ODDS_I18N = {
ko: { oddsBtn: "📊 전체 확률 보기", oddsTitle: "📊 뽑기 확률 전체 공개", oddsPity: "천장: 10회 뽑으면 SSR 확정 · 7회부터 SSR 확률 상승(최대 15%). 표시 확률은 게임 코드와 100% 일치합니다.", oddsFict: "※ 이 가챠는 Legion Chronicles 내 가상의 연출이며, 모든 재화는 게임 내 전용입니다.", grNote: "🎯 10회 천장 = SSR 확정 · 7회부터 SSR 확률 상승(최대 15%) · 장비도 동일 확률" },
en: { oddsBtn: "📊 View full odds", oddsTitle: "📊 Full Pull Rate Disclosure", oddsPity: "Pity: a guaranteed SSR on the 10th pull · SSR rate rises from pull 7 (up to 15%). Displayed rates match the game code 100%.", oddsFict: "※ This gacha is a fictional feature within Legion Chronicles; all currencies are in-game only.", grNote: "🎯 10-pull pity = guaranteed SSR · SSR rate rises from pull 7 (up to 15%) · gear uses same rates" },
ja: { oddsBtn: "📊 全確率を見る", oddsTitle: "📊 ガチャ確率 完全公開", oddsPity: "天井: 10回でSSR確定 · 7回目からSSR確率上昇(最大15%)。表示確率はゲームコードと100%一致。", oddsFict: "※ このガチャはLegion Chronicles内の架空の演出で、全ての通貨はゲーム内専用です。", grNote: "🎯 10回天井=SSR確定 · 7回目からSSR確率上昇(最大15%) · 装備も同確率" },
zh: { oddsBtn: "📊 查看全部概率", oddsTitle: "📊 抽卡概率完整公示", oddsPity: "保底: 第10抽必出SSR · 第7抽起SSR概率提升(最高15%)。显示概率与游戏代码100%一致。", oddsFict: "※ 本抽卡为Legion Chronicles内的虚构演出，所有货币仅限游戏内使用。", grNote: "🎯 10抽保底=必出SSR · 第7抽起SSR概率提升(最高15%) · 装备同概率" },
hi: { oddsBtn: "📊 पूरी संभावना देखें", oddsTitle: "📊 पूर्ण दर प्रकटीकरण", oddsPity: "पिटी: 10वें पुल पर SSR पक्का · पुल 7 से SSR दर बढ़ती है (15% तक)। दिखाई गई दरें गेम कोड से 100% मेल खाती हैं।", oddsFict: "※ यह गाचा Legion Chronicles का काल्पनिक फीचर है; सभी मुद्राएँ केवल इन-गेम हैं।", grNote: "🎯 10-पुल पिटी = पक्का SSR · पुल 7 से SSR दर बढ़ती है (15% तक) · गियर समान दर" },
ru: { oddsBtn: "📊 Все шансы", oddsTitle: "📊 Полное раскрытие шансов", oddsPity: "Гарант: SSR на 10-й крутке · шанс SSR растёт с 7-й крутки (до 15%). Показанные шансы на 100% совпадают с кодом игры.", oddsFict: "※ Эта гача — вымышленный элемент Legion Chronicles; вся валюта только внутриигровая.", grNote: "🎯 Гарант 10 круток = SSR · шанс SSR растёт с 7-й (до 15%) · снаряжение по тем же шансам" },
};
for (const l in ODDS_I18N) Object.assign(I18N[l], ODDS_I18N[l]);

const CQ_I18N = {
ko: { cqTitle: "정복 연대기", cqFell: "폐허 함락", cqClaimN: "보상 {n}개!", cqReward: "ch{n} 정복 보상" },
en: { cqTitle: "Conquest Chronicle", cqFell: "ruins fallen", cqClaimN: "{n} reward!", cqReward: "Ch{n} conquest reward" },
ja: { cqTitle: "征服年代記", cqFell: "の廃墟制圧", cqClaimN: "報酬{n}個!", cqReward: "ch{n} 制圧報酬" },
zh: { cqTitle: "征服编年史", cqFell: "处废墟攻陷", cqClaimN: "{n}个奖励!", cqReward: "ch{n} 征服奖励" },
hi: { cqTitle: "विजय गाथा", cqFell: "खंडहर जीते", cqClaimN: "{n} इनाम!", cqReward: "ch{n} विजय इनाम" },
ru: { cqTitle: "Хроника завоеваний", cqFell: "руин пало", cqClaimN: "{n} награда!", cqReward: "гл.{n} награда" },
};
for (const l in CQ_I18N) Object.assign(I18N[l], CQ_I18N[l]);

const MUSIC_I18N = { ko: "배경음악", en: "Music", ja: "BGM", zh: "背景音乐", hi: "संगीत", ru: "Музыка" };
for (const l in MUSIC_I18N) I18N[l].setMusic = MUSIC_I18N[l];

const OWNED_I18N = { ko: "보유중", en: "Owned", ja: "保有中", zh: "已拥有", hi: "स्वामित्व", ru: "Есть" };
for (const l in OWNED_I18N) I18N[l].ownedShort = OWNED_I18N[l];

const SQUAD_I18N = {
ko: { sqTitle: "출전 편성", sqPool: "📋 보유 캐릭터 — 탭해서 편성/해제", dArchNote: "(아키타입 공통)", cpInv: "🎒 보유 장비 — 탭해서 이 캐릭터에 장착", sqFull: "편성 가득 (최대 {n})", sqDeployed: "✅ 편성 완료 — 이 캐릭터가 전투에 출전", sqUndeploy: "편성 해제" },
en: { sqTitle: "Battle Squad", sqPool: "📋 Owned characters — tap to deploy/remove", dArchNote: "(archetype-wide)", cpInv: "🎒 Owned gear — tap to equip", sqFull: "Squad full (max {n})", sqDeployed: "✅ Deployed — fights in battle", sqUndeploy: "Removed from squad" },
ja: { sqTitle: "出撃編成", sqPool: "📋 所持キャラ — タップで編成/解除", dArchNote: "(共通)", cpInv: "🎒 所持装備 — タップで装着", sqFull: "編成満員 (最大{n})", sqDeployed: "✅ 編成完了 — 戦闘に出撃", sqUndeploy: "編成解除" },
zh: { sqTitle: "出战编成", sqPool: "📋 拥有角色 — 点击编成/解除", dArchNote: "(同类型)", cpInv: "🎒 拥有装备 — 点击装备", sqFull: "编成已满 (最多{n})", sqDeployed: "✅ 已编成 — 出战", sqUndeploy: "解除编成" },
hi: { sqTitle: "युद्ध दस्ता", sqPool: "📋 किरदार — टैप कर तैनात/हटाएँ", dArchNote: "(आर्किटाइप)", cpInv: "🎒 गियर — टैप कर लगाएँ", sqFull: "दस्ता भरा (अधि. {n})", sqDeployed: "✅ तैनात — युद्ध में", sqUndeploy: "हटाया" },
ru: { sqTitle: "Боевой отряд", sqPool: "📋 Персонажи — нажмите для отряда", dArchNote: "(по типу)", cpInv: "🎒 Снаряжение — нажмите чтобы надеть", sqFull: "Отряд полон (макс {n})", sqDeployed: "✅ В отряде — в бою", sqUndeploy: "Убран из отряда" },
};
for (const l in SQUAD_I18N) Object.assign(I18N[l], SQUAD_I18N[l]);
const PRESTIGE_I18N={
ko:{setReset:"🔄 환생 (보상받고 처음부터)",prestigeAsk:"🔄 환생하시겠습니까?\n지금까지 키운 걸 초기화하고 보상으로 받음:\n🔮 소울 +{soul} (유지+적립, 각성=영구강화) · 💎 +{gem} · 💰 +{gold}\n환생할수록 영구 파워가 쌓여요. 지금 결속이 오르면 모든 게 강해집니다.",prestigeDone:"🔄 환생 완료! 🔮+{soul} 💎+{gem} 💰+{gold} — 소울로 각성해서 영구 강화하세요"},
en:{setReset:"🔄 Rebirth (reset for rewards)",prestigeAsk:"🔄 Rebirth?\nProgress resets — but you gain:\n🔮 Soul +{soul} (kept+added) · 💎 +{gem} · 💰 +{gold}\nSpend Soul on Awakening for permanent power.",prestigeDone:"🔄 Rebirth! 🔮+{soul} 💎+{gem} 💰+{gold}"},
ja:{setReset:"🔄 転生 (報酬を得て最初から)",prestigeAsk:"🔄 転生しますか?\n進行はリセット — 報酬:\n🔮 ソウル +{soul} · 💎 +{gem} · 💰 +{gold}\n転生するほど永久パワーが積み上がる。",prestigeDone:"🔄 転生! 🔮+{soul} 💎+{gem} 💰+{gold} — ソウルで覚醒して永久強化"},
zh:{setReset:"🔄 转生 (获取奖励重来)",prestigeAsk:"🔄 转生?\n进度重置 — 但获得:\n🔮 灵魂 +{soul} · 💎 +{gem} · 💰 +{gold}\n转生越多永久战力越强。",prestigeDone:"🔄 转生! 🔮+{soul} 💎+{gem} 💰+{gold} — 用灵魂觉醒永久强化"},
hi:{setReset:"🔄 पुनर्जन्म (इनाम के लिए रीसेट)",prestigeAsk:"🔄 पुनर्जन्म?\nप्रगति रीसेट — लेकिन मिलता है:\n🔮 आत्मा +{soul} (रखा+जोड़ा) · 💎 +{gem} · 💰 +{gold}\nआत्मा खर्च कर Awakening से स्थायी पावर।",prestigeDone:"🔄 पुनर्जन्म! 🔮+{soul} 💎+{gem} 💰+{gold}"},
ru:{setReset:"🔄 Перерождение (награды за сброс)",prestigeAsk:"🔄 Перерождение?\nПрогресс сбрасывается — но получаешь:\n🔮 Душа +{soul} (сохраняется+добавляется) · 💎 +{gem} · 💰 +{gold}\nТрать Души на Пробуждение за постоянную силу.",prestigeDone:"🔄 Перерождение! 🔮+{soul} 💎+{gem} 💰+{gold}"}
};
for(const l in PRESTIGE_I18N)Object.assign(I18N[l],PRESTIGE_I18N[l]);
const PT_I18N={ko:{prestigeTitle:"환생",prestigeDesc:"진행 초기화하고 보상 받기. 결속(영구 파워)이 오를수록 전투·골드·AFK가 점점 더 강해져요. 소울은 죽어도 남아서 각성(영구 강화) 재료예요.",prestigeNow:"지금 환생하면 받는 것:"},en:{prestigeTitle:"Rebirth",prestigeDesc:"Restart from scratch — but your progress converts to rewards. 🔮Soul is kept+accrued across rebirths, the special medium for Awakening (permanent power).",prestigeNow:"Rebirth now:"},ja:{prestigeTitle:"転生",prestigeDesc:"最初から — 進行は報酬に換算。🔮ソウルは転生しても保持+蓄積される特別な媒介。転生で戦闘・ゴールド・AFKが強くなる。",prestigeNow:"今転生すると:"},zh:{prestigeTitle:"转生",prestigeDesc:"从头开始 — 进度换算为奖励。🔮灵魂跨转生保留+累积，是觉醒(永久强化)的特殊媒介。转生越多战斗·金币·AFK越强。",prestigeNow:"现在转生:"},hi:{prestigeTitle:"पुनर्जन्म",prestigeDesc:"शुरू से — प्रगति इनाम में बदलती है। 🔮आत्मा रखी जाती है और जमा होती है। पुनर्जन्म से युद्ध·गोल्ड·AFK मजबूत।",prestigeNow:"अभी पुनर्जन्म:"},ru:{prestigeTitle:"Перерождение",prestigeDesc:"Начать заново — прогресс в награды. 🔮Души сохраняются и копятся между перерождениями. Перерождения усиливают бой, золото, AFK.",prestigeNow:"Сейчас:"}};for(const l in PT_I18N)Object.assign(I18N[l],PT_I18N[l]);

const ASC_I18N={
ko:{ascDesc:"벽에 막혔을 때 포기 대신 더 강해져 다시 정복. 챕터·골드만 리셋되고 유닛·장비·가챠 수집은 100% 유지돼요. 환생할수록 ⬡에테르로 영구 복리 파워가 쌓입니다.",ascPower:"영구 전투배율",ascRuns:"환생",ascLocked:"🔒 ch{gate} 도달 시 환생 가능 (지금 ch{ch})",ascReady:"지금 환생 → ⬡ 에테르 +{e}",ascBtn:"🔄 환생 (ch{ch}→1)",ascConfirm:"🔄 환생하시겠습니까?\n\n잃는 것: 챕터 ch{ch}→1, 골드 리셋\n유지: 유닛·장비·가챠·캐릭 전부 그대로\n얻는 것: ⬡ 에테르 +{e} (영구 복리 파워)\n\n자발적 선택 — 영구 배율로 초반이 순식간에 녹아요.",ascDone:"🔄 환생! ⬡ 에테르 +{e} — 상점에서 영구 강화하세요",ascShop:"⬡ 에테르 상점 (영구 복리)",ascUp:"강화 ⬡{c}",ascLvN:"Lv{n}",ascNeed:"⬡ 에테르가 부족해요",nMight:"공세",nMightD:"아군 전체 공격력 +8%/Lv (복리)",nBulwark:"불굴",nBulwarkD:"아군 전체 체력 +8%/Lv (복리)",nMomentum:"쇄도",nMomentumD:"시작 골드 +300 · 골드획득 +18%/Lv",nSoulnode:"혼",nSoulnodeD:"소울 획득 +25%/Lv",nPlunder:"약탈",nPlunderD:"전투 골드 +12%/Lv",nEdge:"예봉",nEdgeD:"전군 치명타율 +2%/Lv",nPierce:"관통",nPierceD:"전군 치명피해 +8%/Lv",nVanguard:"선봉",nVanguardD:"환생 후 시작 챕터 +1/Lv (최대5)",nProsper:"번영",nProsperD:"환생 시 💎젬 +3/Lv",nInsight:"통찰",nInsightD:"각성 소울비용 -4%/Lv (최대-40%)"},
en:{ascDesc:"Hit a wall? Grow stronger and reconquer instead of quitting. Only chapter & gold reset — your units, gear & gacha collection stay 100%. Each Ascension banks ⬡Ether into permanent compounding power.",ascPower:"Permanent power",ascRuns:"Runs",ascLocked:"🔒 Ascend unlocks at ch{gate} (now ch{ch})",ascReady:"Ascend now → ⬡ Ether +{e}",ascBtn:"🔄 Ascend (ch{ch}→1)",ascConfirm:"🔄 Ascend?\n\nLose: chapter ch{ch}→1, gold reset\nKeep: all units, gear, gacha & characters\nGain: ⬡ Ether +{e} (permanent compounding power)\n\nVoluntary — your permanent multiplier melts the early chapters instantly.",ascDone:"🔄 Ascended! ⬡ Ether +{e} — spend it in the shop for permanent power",ascShop:"⬡ Ether Shop (permanent, compounding)",ascUp:"Up ⬡{c}",ascLvN:"Lv{n}",ascNeed:"Not enough ⬡ Ether",ascNow:"Now",nMight:"Might",nMightD:"All allies ATK +8%/Lv (compounding)",nBulwark:"Bulwark",nBulwarkD:"All allies HP +8%/Lv (compounding)",nMomentum:"Momentum",nMomentumD:"Start gold +300 · gold gain +18%/Lv",nSoulnode:"Soul",nSoulnodeD:"Soul gain +25%/Lv",nPlunder:"Plunder",nPlunderD:"Battle gold +12%/Lv",nEdge:"Edge",nEdgeD:"Crit rate +2%/Lv",nPierce:"Pierce",nPierceD:"Crit dmg +8%/Lv",nVanguard:"Vanguard",nVanguardD:"Start ch +1/Lv after Ascend (max5)",nProsper:"Prosper",nProsperD:"Gems +3/Lv on Ascend",nInsight:"Insight",nInsightD:"Awaken cost -4%/Lv (max-40%)"},
ja:{ascDesc:"壁にぶつかったら諦めず強くなって再征服。章とゴールドのみリセット、ユニット・装備・ガチャ収集は100%維持。転生で⬡エーテルが永久複利パワー蓄積。",ascPower:"永久戦闘倍率",ascRuns:"転生",ascLocked:"🔒 ch{gate}到達で転生可 (現在ch{ch})",ascReady:"今転生 → ⬡ エーテル +{e}",ascBtn:"🔄 転生 (ch{ch}→1)",ascConfirm:"🔄 転生しますか？\n\n失う: 章ch{ch}→1、ゴールドリセット\n維持: ユニット・装備・ガチャ・キャラ全部そのまま\n得る: ⬡ エーテル +{e} (永久複利パワー)\n\n自発的選択 — 永久倍率で序盤即溶け。",ascDone:"🔄 転生! ⬡ エーテル +{e} — ショップで永久強化を",ascShop:"⬡ エーテルショップ (永久複利)",ascUp:"強化 ⬡{c}",ascLvN:"Lv{n}",ascNeed:"⬡ エーテル不足",nMight:"攻勢",nMightD:"味方全体攻撃+8%/Lv(複利)",nBulwark:"不屈",nBulwarkD:"味方全体HP+8%/Lv(複利)",nMomentum:"奔流",nMomentumD:"開始ゴールド+300 · ゴールド獲得+18%/Lv",nSoulnode:"魂",nSoulnodeD:"ソウル獲得+25%/Lv",nPlunder:"略奪",nPlunderD:"戦闘ゴールド+12%/Lv",nEdge:"鋭鋒",nEdgeD:"全軍クリ率+2%/Lv",nPierce:"貫通",nPierceD:"全軍クリダメ+8%/Lv",nVanguard:"先鋒",nVanguardD:"転生後開始章+1/Lv(最大5)",nProsper:"繁栄",nProsperD:"転生時💎ジェム+3/Lv",nInsight:"洞察",nInsightD:"覚醒ソウルコスト-4%/Lv(最大-40%)"},
zh:{ascDesc:"碰壁时别放弃而是变强再征服。仅章节与金币重置，单位·装备·抽卡收集100%保留。转生积累⬡以太永久复利战力。",ascPower:"永久战力倍率",ascRuns:"转生",ascLocked:"🔒 达ch{gate}可转生 (当前ch{ch})",ascReady:"现在转生 → ⬡ 以太 +{e}",ascBtn:"🔄 转生 (ch{ch}→1)",ascConfirm:"🔄 转生？\n\n失去: 章节ch{ch}→1，金币重置\n保留: 全部单位·装备·抽卡·角色\n获得: ⬡ 以太 +{e} (永久复利战力)\n\n自愿 — 永久倍率让前期瞬间融化。",ascDone:"🔄 转生! ⬡ 以太 +{e} — 商店永久强化",ascShop:"⬡ 以太商店 (永久复利)",ascUp:"强化 ⬡{c}",ascLvN:"Lv{n}",ascNeed:"⬡ 以太不足",nMight:"攻势",nMightD:"全军攻击+8%/Lv(复利)",nBulwark:"不屈",nBulwarkD:"全军HP+8%/Lv(复利)",nMomentum:"势头",nMomentumD:"起始金币+300 · 金币获取+18%/Lv",nSoulnode:"魂",nSoulnodeD:"灵魂获取+25%/Lv",nPlunder:"掠夺",nPlunderD:"战斗金币+12%/Lv",nEdge:"锋芒",nEdgeD:"全军暴击率+2%/Lv",nPierce:"穿透",nPierceD:"全军暴击伤害+8%/Lv",nVanguard:"先锋",nVanguardD:"转生后起始章+1/Lv(最多5)",nProsper:"繁荣",nProsperD:"转生💎宝石+3/Lv",nInsight:"洞察",nInsightD:"觉醒灵魂成本-4%/Lv(最多-40%)"},
hi:{ascDesc:"दीवार से टकराए? हार मानने की बजाय मजबूत होकर फिर जीत। सिर्फ अध्याय और गोल्ड रीसेट — यूनिट, गियर और गाचा 100% रहते हैं। प्रत्येक पुनर्जन्म ⬡ ईथर से स्थायी कंपाउंड पावर।",ascPower:"स्थायी पावर",ascRuns:"पुनर्जन्म",ascLocked:"🔒 ch{gate} पर पुनर्जन्म अनलॉक (अब ch{ch})",ascReady:"अभी पुनर्जन्म → ⬡ ईथर +{e}",ascBtn:"🔄 पुनर्जन्म (ch{ch}→1)",ascConfirm:"🔄 पुनर्जन्म?\n\nखोना: ch{ch}→1, गोल्ड रीसेट\nरखना: सभी यूनिट, गियर, गाचा और कैरेक्टर\nपाना: ⬡ ईथर +{e} (स्थायी कंपाउंड पावर)\n\nस्वैच्छिक — स्थायी मल्टीप्लायर शुरुआत तुरंत पिघला देता है।",ascDone:"🔄 पुनर्जन्म! ⬡ ईथर +{e} — दुकान में स्थायी पावर खर्च",ascShop:"⬡ ईथर शॉप (स्थायी, कंपाउंड)",ascUp:"अप ⬡{c}",ascLvN:"Lv{n}",ascNeed:"⬡ ईथर कम",nMight:"शक्ति",nMightD:"सभी साथी ATK +8%/Lv (कंपाउंड)",nBulwark:"बुलवार्क",nBulwarkD:"सभी साथी HP +8%/Lv (कंपाउंड)",nMomentum:"मोमेंटम",nMomentumD:"शुरू गोल्ड +300 · गोल्ड गेन +18%/Lv",nSoulnode:"आत्मा",nSoulnodeD:"आत्मा गेन +25%/Lv",nPlunder:"लूट",nPlunderD:"युद्ध गोल्ड +12%/Lv",nEdge:"एज",nEdgeD:"क्रिट रेट +2%/Lv",nPierce:"पियर्स",nPierceD:"क्रिट डैमेज +8%/Lv",nVanguard:"वanguard",nVanguardD:"पुनर्जन्म बाद चैप्टर +1/Lv (max5)",nProsper:"प्रोस्पर",nProsperD:"पुनर्जन्म पर जेम +3/Lv",nInsight:"इनसाइट",nInsightD:"अवेकन कॉस्ट -4%/Lv (max-40%)"},
ru:{ascDesc:"Уперлись в стену? Брось вместо этого — стань сильнее и завоюй заново. Сбрасываются только глава и золото — юниты, снаряга и коллекция гачи 100% остаются. Каждое Перерождение накапливает ⬡Эфир в постоянную компаунд-силу.",ascPower:"Постоянная сила",ascRuns:"Перерождения",ascLocked:"🔒 Перерождение с ch{gate} (сейчас ch{ch})",ascReady:"Переродиться → ⬡ Эфир +{e}",ascBtn:"🔄 Перерождение (ch{ch}→1)",ascConfirm:"🔄 Перерождение?\n\nТеряешь: главу ch{ch}→1, золото сбрасывается\nСохраняется: все юниты, снаряга, гача и герои\nПолучаешь: ⬡ Эфир +{e} (постоянная компаунд-сила)\n\nДобровольно — постоянный множитель мгновенно растворяет начало.",ascDone:"🔄 Перерождение! ⬡ Эфир +{e} — трать в магазине на постоянную силу",ascShop:"⬡ Эфир-магазин (постоянный, компаунд)",ascUp:"Улучшить ⬡{c}",ascLvN:"Lv{n}",ascNeed:"Недостаточно ⬡ Эфир",nMight:"Мощь",nMightD:"АТК всех +8%/Lv (компаунд)",nBulwark:"Бастион",nBulwarkD:"HP всех +8%/Lv (компаунд)",nMomentum:"Импульс",nMomentumD:"Старт золото +300 · +18%/Lv к золоту",nSoulnode:"Душа",nSoulnodeD:"+25%/Lv к душам",nPlunder:"Набег",nPlunderD:"+12%/Lv к золоту в бою",nEdge:"Острие",nEdgeD:"+2%/Lv к криту",nPierce:"Пробой",nPierceD:"+8%/Lv к крит урону",nVanguard:"Авангард",nVanguardD:"После перерождения стартовая глава +1/Lv (макс5)",nProsper:"Процветание",nProsperD:"+3/Lv 💎 при перерождении",nInsight:"Прозрение",nInsightD:"-4%/Lv к цене пробуждения (макс-40%)"}
};for(const l in ASC_I18N)Object.assign(I18N[l],ASC_I18N[l]);
const GO_I18N={ko:"보유 장비",en:"My Gear",ja:"所持装備",zh:"拥有装备",hi:"मेरा गियर",ru:"Снаряжение"};for(const l in GO_I18N)I18N[l].gOwned=GO_I18N[l];
const GN_I18N={ko:"🔨 장비를 탭하면 강화 · 장착은 캐릭터 탭에서",en:"🔨 Tap gear to enhance · equip in Characters tab",ja:"装着はキャラタブから",zh:"装备在角色页签中进行",hi:"लगाना: किरदार टैब से",ru:"Экипировка во вкладке Персонажи"};for(const l in GN_I18N)I18N[l].gearNote=GN_I18N[l];
const LH_I18N={ko:"유닛·상성 정보",en:"Units & counters",ja:"ユニット·相性",zh:"单位·克制",hi:"यूनिट·काउंटर",ru:"Юниты·контры"};for(const l in LH_I18N)I18N[l].legendHelp=LH_I18N[l];

const GEARDEX_I18N = { ko: "장비 도감", en: "Gear Codex", ja: "装備図鑑", zh: "装备图鉴", hi: "गियर कोडेक्स", ru: "Кодекс снаряжения" };
for (const l in GEARDEX_I18N) I18N[l].gearDexT = GEARDEX_I18N[l];

const MS_I18N = {
ko: { ms_tower: "무한탑", ms_boss: "보스 모드", msReach: "{n}챕터 달성!", msUnlock: "해금", msCh: "챕터", msLocked: "🔒 {n}챕터에서 해금" },
en: { ms_tower: "Tower", ms_boss: "Boss Mode", msReach: "Chapter {n} reached!", msUnlock: "unlock", msCh: "ch", msLocked: "🔒 Unlocks at chapter {n}" },
ja: { ms_tower: "無限の塔", ms_boss: "ボスモード", msReach: "チャプター{n}達成!", msUnlock: "解放", msCh: "章", msLocked: "🔒 チャプター{n}で解放" },
zh: { ms_tower: "无限之塔", ms_boss: "Boss模式", msReach: "达成第{n}章!", msUnlock: "解锁", msCh: "章", msLocked: "🔒 第{n}章解锁" },
hi: { ms_tower: "मीनार", ms_boss: "बॉस मोड", msReach: "अध्याय {n} पूर्ण!", msUnlock: "अनलॉक", msCh: "अध्याय", msLocked: "🔒 अध्याय {n} पर अनलॉक" },
ru: { ms_tower: "Башня", ms_boss: "Босс", msReach: "Глава {n} достигнута!", msUnlock: "открытие", msCh: "гл", msLocked: "🔒 Открывается на главе {n}" },
};
for (const l in MS_I18N) Object.assign(I18N[l], MS_I18N[l]);

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

(function () { let saved = ""; try { saved = localStorage.getItem("daedalus_lang") || ""; } catch (e) {} LANG = (LANGS.indexOf(saved) >= 0 ? saved : detectLang()); })();