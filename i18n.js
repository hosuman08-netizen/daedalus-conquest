/* i18n — 6개 언어 (ko/en/ja/zh/hi/ru). game.js보다 먼저 로드. */
const LANGS = ["en", "ko", "ja", "zh", "hi", "ru"];   // 🌐 en 먼저 (글로벌 첫인상 — 군주)
const LANG_LABEL = { ko: "한국어", en: "English", ja: "日本語", zh: "中文", hi: "हिन्दी", ru: "Русский" };

const I18N = {
  ko: { statsTitle:"내 군단 통계",statBest:"최고 챕터",statCollect:"수집",statRebirth:"환생",statPower:"군단 전력",statPulls:"누적 뽑기",statWins:"누적 승리", carryVolume:"물량 군집",carrySeal:"캐리 — 네 지휘가 봉인했다",carryLed:"주도",vanguardFocus:"🔥 선봉대 24시간 집중",
    title: "Daedalus",
    "mode.campaign": "📖 캠페인", "mode.tower": "🗼 무한탑", "mode.daily": "📅 일일", "mode.boss": "🐲 보스", "mode.arena": "🏟️ 아레나",
    start: "▶ 전투 시작", pause: "⏸ 일시정지", resume: "▶ 재개", auto: "⚔️ 자동사냥", autoOn: "⚔️ 자동 ON",
    reset: "↻ 다시", retry: "다시 ↻", cont: "계속 ▶", upgrade: "강화", gacha: "🎰 뽑기", pkg: "💎 패키지",
    buy: "구매하기", later: "나중에", confirm: "확인",
    speed: "속도 {n}x", speedLock: "속도 1x 🔒",
    firstBuyDouble: "🎁 첫구매 2배",
    armyTitle: "🔵 내 군단", armySub: "(골드로 구매 · −는 90% 환불)",
    sDeploy: "📖 챕터 {n} — 배치 후 ▶ 전투", sTower: "🗼 무한의 탑 {n}층  (최고 {b}층)",
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
    tGachaUp: "유닛 +{n}강화", tTitan: "🐉 전설 타이탄 해금!!", tDaily: "🎁 일일 보상 +150 골드!", tIdle: "🌙 방치 보상 ({t}) +{n} 골드!", tRitual: "🌀 결전의 의식 +{n} — 군단의 사기가 타오른다", tForecast: "군단 전망: 결속이 더 깊어진다",
    invite: "친구 초대", inviteBtn: "링크 공유", social: "소셜",
    tStarter: "💎 초심자 패키지 획득! 골드 3000 + 유닛 10개 + 골드 +20% 영구", tOwned: "이미 보유",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 강화! Lv{n}",
    soulHave: "보유 🔮 ",
    heroes: { strategist: ["책략가", "전군 AI 지능"], berserker: ["광전사", "전군 공격력"], warden: ["수호자", "전군 체력"], ranger: ["사격대장", "드론·사수 공격"], mech: ["기갑사령", "돌격봇·가디언 체력"], engineer: ["정비공", "전군 체력 재생"], dragoon: ["용기사", "전군 · 강력 궁극기"] },
    ultName: { focus: "전술 지휘", rage: "광폭화", wall: "철벽", volley: "아크 볼리", assault: "강습", repair: "긴급 수리", dragon: "드래곤 강림" }, // Sovereign 20260616: ranger ULT 이름 업그레이드 (평범한 일제사격 → 진짜 궁극기 "아크 볼리")
  },
  en: { statsTitle:"Legion Stats",statBest:"Best chapter",statCollect:"Collected",statRebirth:"Rebirths",statPower:"Legion power",statPulls:"Total pulls",statWins:"Total wins", carryVolume:"Swarm volume",carrySeal:"carried — your command sealed it",carryLed:"led",vanguardFocus:"🔥 Vanguard 24h Focus",
    title: "Daedalus",
    "mode.campaign": "📖 Campaign", "mode.tower": "🗼 Tower", "mode.daily": "📅 Daily", "mode.boss": "🐲 Boss", "mode.arena": "🏟️ Arena",
    start: "▶ Start", pause: "⏸ Pause", resume: "▶ Resume", auto: "⚔️ Auto-hunt", autoOn: "⚔️ Auto ON",
    reset: "↻ Reset", retry: "Retry ↻", cont: "Continue ▶", upgrade: "Upgrade", gacha: "🎰 Pull", pkg: "💎 Pack",
    buy: "Buy", later: "Later", confirm: "OK",
    speed: "Speed {n}x", speedLock: "Speed 1x 🔒",
    firstBuyDouble: "🎁 First Buy 2×",
    armyTitle: "🔵 My Legion", armySub: "(buy with gold · − refunds 90%)",
    sDeploy: "📖 Chapter {n} — deploy & ▶", sTower: "🗼 Tower floor {n}  (best {b})",
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
    tGachaUp: "Units +{n} upgraded", tTitan: "🐉 Legendary Titan unlocked!!", tDaily: "🎁 Daily reward +150 gold!", tIdle: "🌙 Idle reward ({t}) +{n} gold!", tRitual: "🌀 Rite of War +{n} — the Legion's spirit surges", tForecast: "Legion outlook: your bond grows deeper",
    invite: "Invite Friends", inviteBtn: "Share Link", social: "Social",
    tStarter: "💎 Starter Pack acquired! 3000 gold + 10 units + +20% gold forever", tOwned: "Already owned",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} upgraded! Lv{n}",
    soulHave: "Have 🔮 ",
    heroes: { strategist: ["Strategist", "All units AI"], berserker: ["Berserker", "All ATK"], warden: ["Warden", "All HP"], ranger: ["Ranger Lord", "Drone·Marksman ATK"], mech: ["Mech Cmdr", "Bruiser·Guardian HP"], engineer: ["Engineer", "All units regen HP"], dragoon: ["Dragoon", "All · strong ult"] },
    ultName: { focus: "Tactical Order", rage: "Berserk", wall: "Iron Wall", volley: "Arclight Volley", assault: "Assault", repair: "Repair", dragon: "Dragon Descent" }, // Sovereign 20260616: ranger ULT name upgrade
  },
  ja: { statsTitle:"軍団統計",statBest:"最高章",statCollect:"収集",statRebirth:"転生",statPower:"軍団戦力",statPulls:"累計ガチャ",statWins:"累計勝利", carryVolume:"物量スウォーム",carrySeal:"キャリー — 君の指揮が決めた",carryLed:"主導",vanguardFocus:"🔥 先鋒隊24時間集中",
    title: "Daedalus",
    "mode.campaign": "📖 物語", "mode.tower": "🗼 無限塔", "mode.daily": "📅 デイリー", "mode.boss": "🐲 ボス", "mode.arena": "🏟️ 闘技場",
    start: "▶ 戦闘開始", pause: "⏸ 一時停止", resume: "▶ 再開", auto: "⚔️ 自動狩り", autoOn: "⚔️ 自動 ON",
    reset: "↻ やり直し", retry: "再戦 ↻", cont: "続ける ▶", upgrade: "強化", gacha: "🎰 ガチャ", pkg: "💎 パック",
    buy: "購入", later: "後で", confirm: "確認",
    speed: "速度 {n}x", speedLock: "速度 1x 🔒",
    firstBuyDouble: "🎁 初回購入2倍",
    armyTitle: "🔵 自軍", armySub: "(ゴールドで購入 · −は90%返金)",
    sDeploy: "📖 チャプター{n} — 配置して ▶", sTower: "🗼 無限の塔 {n}階  (最高 {b}階)",
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
    tGachaUp: "ユニット+{n}強化", tTitan: "🐉 伝説タイタン解放!!", tDaily: "🎁 デイリー報酬+150ゴールド!", tIdle: "🌙 放置報酬 ({t}) +{n}ゴールド!", tRitual: "🌀 決戦の儀 +{n} — 軍団の士気が燃え上がる", tForecast: "軍団の兆し: 結束がさらに深まる",
    tStarter: "💎 初心者パック獲得! ゴールド3000 + ユニット10体 + ゴールド+20%永久", tOwned: "所持済み",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 強化! Lv{n}",
    heroes: { strategist: ["策略家", "全軍AI知能"], berserker: ["狂戦士", "全軍攻撃"], warden: ["守護者", "全軍HP"], ranger: ["射撃隊長", "ドローン·射手攻撃"], mech: ["機甲司令", "突撃兵·ガーディアンHP"], engineer: ["整備士", "全軍HP回復"], dragoon: ["竜騎士", "全軍+ · 強力な奥義"] },
    ultName: { focus: "戦術指揮", rage: "狂暴化", wall: "鉄壁", volley: "一斉射撃", assault: "強襲", repair: "緊急修理", dragon: "竜の降臨" },
  },
  zh: { statsTitle:"军团统计",statBest:"最高章节",statCollect:"收集",statRebirth:"转生",statPower:"军团战力",statPulls:"累计抽卡",statWins:"累计胜利", carryVolume:"数量蜂群",carrySeal:"力挽狂澜 — 你的指挥锁定胜局",carryLed:"主导",vanguardFocus:"🔥 先锋队24小时专注",
    title: "Daedalus",
    "mode.campaign": "📖 战役", "mode.tower": "🗼 无限塔", "mode.daily": "📅 每日", "mode.boss": "🐲 首领", "mode.arena": "🏟️ 竞技场",
    start: "▶ 开始战斗", pause: "⏸ 暂停", resume: "▶ 继续", auto: "⚔️ 自动狩猎", autoOn: "⚔️ 自动开",
    reset: "↻ 重来", retry: "重试 ↻", cont: "继续 ▶", upgrade: "强化", gacha: "🎰 抽卡", pkg: "💎 礼包",
    buy: "购买", later: "稍后", confirm: "确定",
    speed: "速度 {n}x", speedLock: "速度 1x 🔒",
    firstBuyDouble: "🎁 首购2倍",
    armyTitle: "🔵 我的军团", armySub: "(用金币购买 · −退还90%)",
    sDeploy: "📖 第{n}章 — 部署后 ▶", sTower: "🗼 无限之塔 {n}层  (最高 {b}层)",
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
    tGachaUp: "单位+{n}强化", tTitan: "🐉 传说泰坦解锁!!", tDaily: "🎁 每日奖励+150金币!", tIdle: "🌙 挂机奖励 ({t}) +{n}金币!", tRitual: "🌀 决战仪式 +{n} — 军团士气高涨", tForecast: "军团前瞻: 凝聚力愈发深厚",
    tStarter: "💎 新手礼包获得! 3000金币 + 10单位 + 金币+20%永久", tOwned: "已拥有",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} 强化! Lv{n}",
    heroes: { strategist: ["策略家", "全军AI智能+1"], berserker: ["狂战士", "全军攻击+15%"], warden: ["守护者", "全军血量+20%"], ranger: ["射击队长", "无人机·射手攻击+30%"], mech: ["机甲司令", "突击兵·守卫血量+40%"], engineer: ["工程师", "全军回血"], dragoon: ["龙骑士", "全军+8% · 强力必杀"] },
    ultName: { focus: "战术指挥", rage: "狂暴", wall: "铁壁", volley: "齐射", assault: "强袭", repair: "紧急维修", dragon: "巨龙降临" },
  },
  hi: { statsTitle:"लीजन आँकड़े",statBest:"सर्वश्रेष्ठ अध्याय",statCollect:"संग्रह",statRebirth:"पुनर्जन्म",statPower:"लीजन शक्ति",statPulls:"कुल पुल",statWins:"कुल जीत", carryVolume:"झुंड दम",carrySeal:"निर्णायक — आपकी कमान ने जीत दिलाई",carryLed:"नेतृत्व",vanguardFocus:"🔥 अग्रदल 24घं फोकस",
    title: "Daedalus",
    "mode.campaign": "📖 अभियान", "mode.tower": "🗼 मीनार", "mode.daily": "📅 दैनिक", "mode.boss": "🐲 बॉस", "mode.arena": "🏟️ अखाड़ा",
    start: "▶ युद्ध शुरू", pause: "⏸ रोकें", resume: "▶ जारी", auto: "⚔️ ऑटो-शिकार", autoOn: "⚔️ ऑटो चालू",
    reset: "↻ रीसेट", retry: "फिर ↻", cont: "जारी ▶", upgrade: "अपग्रेड", gacha: "🎰 गाचा", pkg: "💎 पैक",
    buy: "खरीदें", later: "बाद में", confirm: "ठीक",
    speed: "गति {n}x", speedLock: "गति 1x 🔒",
    firstBuyDouble: "🎁 पहली खरीद 2×",
    armyTitle: "🔵 मेरी सेना", armySub: "(गोल्ड से खरीदें · − 90% वापस)",
    sDeploy: "📖 अध्याय {n} — तैनात करें ▶", sTower: "🗼 मीनार मंज़िल {n}  (सर्वश्रेष्ठ {b})",
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
    tGachaUp: "यूनिट +{n} अपग्रेड", tTitan: "🐉 पौराणिक टाइटन अनलॉक!!", tDaily: "🎁 दैनिक इनाम +150 गोल्ड!", tIdle: "🌙 निष्क्रिय इनाम ({t}) +{n} गोल्ड!", tRitual: "🌀 युद्ध अनुष्ठान +{n} — लीजन का हौसला भड़का", tForecast: "लीजन पूर्वानुमान: एकजुटता और गहरी",
    tStarter: "💎 स्टार्टर पैक प्राप्त! 3000 गोल्ड + 10 यूनिट + गोल्ड+20% स्थायी", tOwned: "पहले से",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} अपग्रेड! Lv{n}",
    heroes: { strategist: ["रणनीतिकार", "पूरी सेना AI +1"], berserker: ["योद्धा", "पूरी सेना ATK +15%"], warden: ["रक्षक", "पूरी सेना HP +20%"], ranger: ["निशानेबाज़ नायक", "ड्रोन·निशानेबाज़ ATK +30%"], mech: ["मैक कमांडर", "ब्रूज़र·रक्षक HP +40%"], engineer: ["इंजीनियर", "पूरी सेना HP रिजेन"], dragoon: ["ड्रैगून", "पूरी सेना +8% · तेज़ अल्टी"] },
    ultName: { focus: "रणनीतिक आदेश", rage: "उन्माद", wall: "लौह दीवार", volley: "वॉली", assault: "हमला", repair: "मरम्मत", dragon: "ड्रैगन अवतरण" },
  },
  ru: { statsTitle:"Статистика",statBest:"Лучшая глава",statCollect:"Собрано",statRebirth:"Перерождения",statPower:"Сила легиона",statPulls:"Всего круток",statWins:"Всего побед", carryVolume:"Рой массой",carrySeal:"вынес — твоё командование решило",carryLed:"вёл",vanguardFocus:"🔥 Авангард 24ч фокус",
    title: "Daedalus",
    "mode.campaign": "📖 Кампания", "mode.tower": "🗼 Башня", "mode.daily": "📅 Ежедн.", "mode.boss": "🐲 Босс", "mode.arena": "🏟️ Арена",
    start: "▶ В бой", pause: "⏸ Пауза", resume: "▶ Продолжить", auto: "⚔️ Автобой", autoOn: "⚔️ Авто ВКЛ",
    reset: "↻ Заново", retry: "Ещё раз ↻", cont: "Далее ▶", upgrade: "Улучшить", gacha: "🎰 Призыв", pkg: "💎 Набор",
    buy: "Купить", later: "Позже", confirm: "ОК",
    speed: "Скорость {n}x", speedLock: "Скорость 1x 🔒",
    firstBuyDouble: "🎁 Первая покупка 2×",
    armyTitle: "🔵 Мой легион", armySub: "(покупка за золото · − возврат 90%)",
    sDeploy: "📖 Глава {n} — расставьте и ▶", sTower: "🗼 Башня этаж {n}  (рекорд {b})",
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
    tGachaUp: "Юниты +{n} улучшены", tTitan: "🐉 Легендарный Титан открыт!!", tDaily: "🎁 Ежедневная награда +150!", tIdle: "🌙 Награда за простой ({t}) +{n}!", tRitual: "🌀 Ритуал битвы +{n} — дух легиона вспыхнул", tForecast: "Прогноз легиона: сплочённость крепнет",
    tStarter: "💎 Набор новичка получен! 3000 золота + 10 юнитов + +20% золота навсегда", tOwned: "Уже есть",
    tUlt: "💥 {x}!", tHeroUp: "🦸 {x} улучшен! Ур.{n}",
    heroes: { strategist: ["Стратег", "ИИ всех +1"], berserker: ["Берсерк", "Атака всех +15%"], warden: ["Страж", "HP всех +20%"], ranger: ["Командир стрелков", "Дрон·Стрелок атака +30%"], mech: ["Мех-командир", "Боец·Страж HP +40%"], engineer: ["Инженер", "Реген HP всех"], dragoon: ["Драгун", "Все +8% · мощный ульт"] },
    ultName: { focus: "Приказ", rage: "Ярость", wall: "Стена", volley: "Залп", assault: "Штурм", repair: "Ремонт", dragon: "Сошествие дракона" },
  },
};

// 설정 메뉴 문구
const SET = {
  ko: { setTitle: "설정", setLang: "언어", setSound: "사운드", setHaptic: "진동", setReset: "진행 초기화", setResetOk: "진행 초기화됨", langOk: "언어 변경됨", resetAsk: "정말 모든 진행을 초기화할까요?", evTitle: "이벤트", evAttend: "일일 출석 보상", evClaim: "출석 보상 받기", evMore: "더 많은 이벤트가 곧 추가됩니다", evDay: "{n}일차", evDone: "오늘 출석 완료! 내일 다시", tAttend: "🎁 {n}일차 출석 보상 획득!", shopTitle: "캐시 상점", shopNote: "⭐ Telegram Stars 실결제 활성 (TG 미니앱 전용)" },
  en: { setTitle: "Settings", setLang: "Language", setSound: "Sound", setHaptic: "Haptics", setReset: "Reset progress", setResetOk: "Progress reset", langOk: "Language changed", resetAsk: "Reset all progress?", evTitle: "Events", evAttend: "Daily Check-in", evClaim: "Claim today", evMore: "More events coming soon", evDay: "Day {n}", evDone: "Checked in today! Back tomorrow", tAttend: "🎁 Day {n} check-in reward!", shopTitle: "Shop", shopNote: "⭐ Real payment via Telegram Stars (TG mini-app only)" },
  ja: { setTitle: "設定", setLang: "言語", setSound: "サウンド", setHaptic: "振動", setReset: "進行リセット", setResetOk: "リセット完了", langOk: "言語を変更", resetAsk: "全ての進行をリセットしますか?", evTitle: "イベント", evAttend: "デイリーログイン", evClaim: "本日の報酬", evMore: "新イベント近日追加", evDay: "{n}日目", evDone: "本日ログイン済み! 明日また", tAttend: "🎁 {n}日目ログイン報酬獲得!", shopTitle: "ショップ", shopNote: "実決済はTelegram Stars対応予定" },
  zh: { setTitle: "设置", setLang: "语言", setSound: "声音", setHaptic: "震动", setReset: "重置进度", setResetOk: "已重置", langOk: "已切换语言", resetAsk: "确定要重置所有进度吗?", evTitle: "活动", evAttend: "每日签到", evClaim: "领取今日", evMore: "更多活动即将上线", evDay: "第{n}天", evDone: "今日已签到! 明天再来", tAttend: "🎁 第{n}天签到奖励!", shopTitle: "商店", shopNote: "实际支付将接入Telegram Stars" },
  hi: { setTitle: "सेटिंग", setLang: "भाषा", setSound: "ध्वनि", setHaptic: "कंपन", setReset: "प्रगति रीसेट", setResetOk: "रीसेट हो गया", langOk: "भाषा बदली", resetAsk: "सारी प्रगति रीसेट करें?", evTitle: "इवेंट", evAttend: "डेली चेक-इन", evClaim: "आज का इनाम", evMore: "और इवेंट जल्द", evDay: "दिन {n}", evDone: "आज चेक-इन हो गया! कल फिर", tAttend: "🎁 दिन {n} चेक-इन इनाम!", shopTitle: "स्टोर", shopNote: "जल्द Telegram Stars भुगतान" },
  ru: { setTitle: "Настройки", setLang: "Язык", setSound: "Звук", setHaptic: "Вибрация", setReset: "Сброс прогресса", setResetOk: "Прогресс сброшен", langOk: "Язык изменён", resetAsk: "Сбросить весь прогресс?", evTitle: "События", evAttend: "Ежедневный вход", evClaim: "Забрать", evMore: "Скоро новые события", evDay: "День {n}", evDone: "Вход засчитан! Завтра снова", tAttend: "🎁 Награда за день {n}!", shopTitle: "Магазин", shopNote: "Оплата через Telegram Stars скоро" },
};
for (const l in SET) Object.assign(I18N[l], SET[l]);

// 이벤트 코드 + 커뮤니티
const CODE_I18N = {
  ko: { setCode: "이벤트 코드", setComm: "커뮤니티 채널 (준비중)", codeUsed: "이미 사용한 코드", codeBad: "잘못된 코드", codeOk: "🎟️ 코드 보상: {x}" },
  en: { setCode: "Event Code", setComm: "Community channel (soon)", codeUsed: "Code already used", codeBad: "Invalid code", codeOk: "🎟️ Code reward: {x}" },
  ja: { setCode: "イベントコード", setComm: "コミュニティ (近日)", codeUsed: "使用済みコード", codeBad: "無効なコード", codeOk: "🎟️ コード報酬: {x}" },
  zh: { setCode: "活动码", setComm: "社区频道 (即将)", codeUsed: "该码已使用", codeBad: "无效的码", codeOk: "🎟️ 兑换奖励: {x}" },
  hi: { setCode: "इवेंट कोड", setComm: "कम्युनिटी (जल्द)", codeUsed: "कोड पहले से उपयोग", codeBad: "गलत कोड", codeOk: "🎟️ कोड इनाम: {x}" },
  ru: { setCode: "Промокод", setComm: "Сообщество (скоро)", codeUsed: "Код уже использован", codeBad: "Неверный код", codeOk: "🎟️ Награда: {x}" },
};
for (const l in CODE_I18N) Object.assign(I18N[l], CODE_I18N[l]);

// Viral / Community / A11y Loop (TG share flex, MY Dominion, Legion quote, non-gamer, faction, a11y god-VFX fallback)
const VIRAL_I18N = {
  ko: { shareBtn: "📤 MY Dominion 공유", shareReward: "💎 공유 보상 +5 (쿨다운 24h)", shareCooldown: "공유 쿨다운 {h}시간 남음 — 잠시 후 다시 공유할 수 있어요", shareSent: "TG 공유 완료! 군단이 하나로 뭉친다", dominionCard: "MY DOMINION", exportCard: "카드 내보내기", factionRename: "내 Dominion 이름 (클랜 태그)", factionTag: "자동 태그", a11yHigh: "고대비 모드", a11yVfx: "god-VFX 패턴 폴백 (색맹/저대비/햅틱 대체)", carriedQuote: "내 명령 아래, 군단은 하나였다", nonGamerWin: "이건 네 실제 AI 군단 명령이야", firstWinOverlay: "🏆 첫 승리! 내 군단이 {carried}% 활약 — 네 지휘였다", legionQuoteViral: "역사는 승리한 군단을 기억한다" },
  en: { shareBtn: "📤 Share MY Dominion", shareReward: "💎 Share reward +5 (24h cd)", shareCooldown: "Share cooldown {h}h — you can share again soon", shareSent: "Shared to TG! The Legion stands as one", dominionCard: "MY DOMINION", exportCard: "Export Card", factionRename: "My Dominion name (clan tag)", factionTag: "Auto tag", a11yHigh: "High contrast", a11yVfx: "god-VFX pattern fallback (colorblind/low-contrast/haptic alt)", carriedQuote: "Under my command, the Legion moved as one", nonGamerWin: "This is your actual command over real AI army", firstWinOverlay: "🏆 First win! Your Legion carried {carried}% — yours", legionQuoteViral: "History remembers the Legion that conquered" },
  ja: { shareBtn: "📤 MY Dominion共有", shareReward: "💎 共有報酬 +5 (24hクール)", shareCooldown: "共有クールダウン {h}時間 — まもなく再共有できます", shareSent: "TG共有完了! 軍団が一つに", dominionCard: "MY DOMINION", exportCard: "カード出力", factionRename: "Dominion名 (クランタグ)", factionTag: "自動タグ", a11yHigh: "ハイコントラスト", a11yVfx: "god-VFX代替 (色覚/低コント/触覚)", carriedQuote: "我が号令の下、軍団は一つに", nonGamerWin: "これは君の本物のAI軍団指揮だ", firstWinOverlay: "🏆 初勝利! 軍団が{carried}%活躍 — 君の指揮", legionQuoteViral: "歴史は勝者の軍団を記憶する" },
  zh: { shareBtn: "📤 MY Dominion 分享", shareReward: "💎 分享奖励 +5 (24h冷却)", shareCooldown: "分享冷却 {h}小时 — 稍后即可再次分享", shareSent: "TG分享完成! 军团凝聚一心", dominionCard: "MY DOMINION", exportCard: "导出卡片", factionRename: "Dominion名称 (部落标签)", factionTag: "自动标签", a11yHigh: "高对比", a11yVfx: "god-VFX回退 (色盲/低对比/触觉)", carriedQuote: "在我号令下，军团合而为一", nonGamerWin: "这是你对真实AI军团的实际指挥", firstWinOverlay: "🏆 首胜! 军团承载{carried}% — 你的指挥", legionQuoteViral: "历史铭记征服的军团" },
  hi: { shareBtn: "📤 MY Dominion शेयर", shareReward: "💎 शेयर इनाम +5 (24h cd)", shareCooldown: "शेयर कूलडाउन {h}घं — जल्द फिर शेयर कर सकते हैं", shareSent: "TG शेयर पूरा! लीजन एकजुट", dominionCard: "MY DOMINION", exportCard: "कार्ड एक्सपोर्ट", factionRename: "Dominion नाम (क्लैन टैग)", factionTag: "ऑटो टैग", a11yHigh: "हाई कंट्रास्ट", a11yVfx: "god-VFX फॉलबैक (कलरब्लाइंड/लो-कंट्रास्ट/हैप्टिक)", carriedQuote: "मेरी कमान में, लीजन एक हुआ", nonGamerWin: "यह तुम्हारी असली AI सेना पर कमांड है", firstWinOverlay: "🏆 पहली जीत! लीजन ने {carried}% किया — तुम्हारी कमान", legionQuoteViral: "इतिहास विजेता लीजन को याद रखता है" },
  ru: { shareBtn: "📤 MY Dominion поделиться", shareReward: "💎 Награда за репост +5 (24ч кд)", shareCooldown: "Кулдаун репоста {h}ч — скоро можно снова", shareSent: "Отправлено в TG! Легион как один", dominionCard: "MY DOMINION", exportCard: "Экспорт карты", factionRename: "Имя Dominion (клан-тег)", factionTag: "Авто тег", a11yHigh: "Высокий контраст", a11yVfx: "god-VFX fallback (дальтонизм/низк.контраст/хаптик)", carriedQuote: "По моему приказу легион стал един", nonGamerWin: "Это твое реальное командование над ИИ-армией", firstWinOverlay: "🏆 Первая победа! Легион вынес {carried}% — твоя команда", legionQuoteViral: "История помнит легион-победитель" },
};
for (const l in VIRAL_I18N) Object.assign(I18N[l], VIRAL_I18N[l]);

// 다이아 프리미엄 가챠
const GEM_I18N = {
  ko: { gacha10: "💎 10연", tGemShort: "다이아 부족! 💎{n} 필요", tGacha10: "🎉 10연 결과: 최고 {x}!" },
  en: { gacha10: "💎 10x", tGemShort: "Not enough gems! Need 💎{n}", tGacha10: "🎉 10x result: best {x}!" },
  ja: { gacha10: "💎 10連", tGemShort: "ダイヤ不足! 💎{n}必要", tGacha10: "🎉 10連結果: 最高 {x}!" },
  zh: { gacha10: "💎 十连", tGemShort: "钻石不足! 需要💎{n}", tGacha10: "🎉 十连结果: 最高 {x}!" },
  hi: { gacha10: "💎 10x", tGemShort: "जेम कम! 💎{n} चाहिए", tGacha10: "🎉 10x परिणाम: सर्वश्रेष्ठ {x}!" },
  ru: { gacha10: "💎 10x", tGemShort: "Мало алмазов! Нужно 💎{n}", tGacha10: "🎉 10x: лучшее {x}!" },
};
for (const l in GEM_I18N) Object.assign(I18N[l], GEM_I18N[l]);

// VIP 패키지
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

// 게임명: 다이달로스 (브랜딩 통일)

// 대시보드 + 강화(실패) + 복리
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

// 장비 (힘·지능·민첩·운)
const GEAR_I18N = {
  ko: { gTitle: "장비", gCraft: "제작", gEquip: "장착", gEmpty: "장비 없음 — 제작하세요", gFull: "보유 한도 도달 (총 500)", gGot: "🔨 장비 제작: {x}", st_str: "힘", st_int: "체력", st_agi: "민첩", st_luk: "운", st_mix: "복합", tColLock: "{n}종 수집 필요" },
  en: { gTitle: "Gear", gCraft: "Craft", gEquip: "Equip", gEmpty: "No gear — craft some", gFull: "Inventory full (total 500)", gGot: "🔨 Crafted: {x}", st_str: "STR", st_int: "VIT", st_agi: "AGI", st_luk: "LUK", st_mix: "MIX", tColLock: "Collect {n} types" },
  ja: { gTitle: "装備", gCraft: "製作", gEquip: "装着", gEmpty: "装備なし — 製作を", gFull: "所持上限 (合計500)", gGot: "🔨 製作: {x}", st_str: "力", st_int: "体", st_agi: "敏", st_luk: "運", st_mix: "複合", tColLock: "{n}種の収集が必要" },
  zh: { gTitle: "装备", gCraft: "制作", gEquip: "装备", gEmpty: "无装备 — 去制作", gFull: "持有上限 (总计500)", gGot: "🔨 制作: {x}", st_str: "力", st_int: "体", st_agi: "敏", st_luk: "运", st_mix: "综合", tColLock: "需收集{n}种" },
  hi: { gTitle: "गियर", gCraft: "बनाएं", gEquip: "पहनें", gEmpty: "कोई गियर नहीं", gFull: "धारण सीमा (कुल 500)", gGot: "🔨 बनाया: {x}", st_str: "STR", st_int: "VIT", st_agi: "AGI", st_luk: "LUK", st_mix: "MIX", tColLock: "{n} प्रकार जमा करें" },
  ru: { gTitle: "Снаряжение", gCraft: "Создать", gEquip: "Надеть", gEmpty: "Нет снаряжения", gFull: "Лимит (всего 500)", gGot: "🔨 Создано: {x}", st_str: "СИЛ", st_int: "ВЫН", st_agi: "ЛОВ", st_luk: "УДЧ", st_mix: "СМШ", tColLock: "Соберите {n} типов" },
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

// 전략 상성 설명
const STRAT = {
  ko: { legend4: "⚔️ 순환 상성: 모든 유닛 2승2패 (유리 +30% / 불리 −23%) · 3종↑ 편성 시너지" },
  en: { legend4: "⚔️ Cyclic counters: every unit 2W/2L (adv +30% / weak −23%) · 3+ types = synergy" },
  ja: { legend4: "⚔️ 循環相性: 全ユニット2勝2敗 (有利 +30% / 不利 −23%) · 3種以上で連携" },
  zh: { legend4: "⚔️ 循环克制: 每个单位2胜2负 (克制 +30% / 被克 −23%) · 3种以上协同" },
  hi: { legend4: "⚔️ चक्रीय काउंटर: हर यूनिट 2जीत/2हार (लाभ +30% / कमज़ोर −23%) · 3+ प्रकार सिनर्जी" },
  ru: { legend4: "⚔️ Цикл. контры: каждый юнит 2П/2П (преим. +30% / слаб. −23%) · 3+ типа синергия" },
};
for (const l in STRAT) Object.assign(I18N[l], STRAT[l]);

// 무한탑 폴백파밍 + 장시간 접속(플레이타임) 보상
const PLAY_I18N = {
  ko: { tTowerFall: "🗼 {n}층으로 후퇴 — 위로금 💰{g}, 계속 농사", playTitle: "오늘의 플레이 보상", playHint: "접속해 플레이한 시간만큼 보상! (매일 0시 초기화)", playClaim: "받기", playGot: "✅ 받음", playLock: "🔒 {m}분", tPlay: "⏱️ 플레이 보상 획득! {x}", playNow: "현재 {m}분 플레이" },
  en: { tTowerFall: "🗼 Fell to floor {n} — consolation 💰{g}, keep farming", playTitle: "Today's Playtime Rewards", playHint: "Rewards for time played! (resets daily)", playClaim: "Claim", playGot: "✅ Got", playLock: "🔒 {m}m", tPlay: "⏱️ Playtime reward! {x}", playNow: "{m} min played" },
  ja: { tTowerFall: "🗼 {n}階に後退 — 見舞金 💰{g}、農場継続", playTitle: "本日のプレイ報酬", playHint: "プレイ時間で報酬! (毎日リセット)", playClaim: "受取", playGot: "✅ 完了", playLock: "🔒 {m}分", tPlay: "⏱️ プレイ報酬獲得! {x}", playNow: "{m}分プレイ中" },
  zh: { tTowerFall: "🗼 退回第{n}层 — 慰问 💰{g}，继续刷", playTitle: "今日游玩奖励", playHint: "按游玩时长发奖! (每日重置)", playClaim: "领取", playGot: "✅ 已领", playLock: "🔒 {m}分", tPlay: "⏱️ 游玩奖励! {x}", playNow: "已玩{m}分" },
  hi: { tTowerFall: "🗼 मंज़िल {n} पर वापस — 💰{g}, खेती जारी", playTitle: "आज के खेल इनाम", playHint: "खेले गए समय का इनाम! (रोज़ रीसेट)", playClaim: "लें", playGot: "✅ मिला", playLock: "🔒 {m}मि", tPlay: "⏱️ खेल इनाम! {x}", playNow: "{m} मिनट खेला" },
  ru: { tTowerFall: "🗼 Откат на этаж {n} — 💰{g}, фарм продолжается", playTitle: "Награды за игру сегодня", playHint: "Награды за время в игре! (сброс ежедневно)", playClaim: "Забрать", playGot: "✅ Есть", playLock: "🔒 {m}м", tPlay: "⏱️ Награда за игру! {x}", playNow: "Сыграно {m} мин" },
};
for (const l in PLAY_I18N) Object.assign(I18N[l], PLAY_I18N[l]);

// 텔레그램 프로필 (설정창)
const PROF_I18N = {
  ko: { profTitle: "내 프로필", profGuest: "텔레그램 앱으로 열면 프로필이 표시됩니다" },
  en: { profTitle: "My Profile", profGuest: "Open in Telegram to see your profile" },
  ja: { profTitle: "マイプロフィール", profGuest: "Telegramで開くとプロフィール表示" },
  zh: { profTitle: "我的资料", profGuest: "在Telegram中打开以显示资料" },
  hi: { profTitle: "मेरी प्रोफ़ाइल", profGuest: "प्रोफ़ाइल देखने हेतु Telegram में खोलें" },
  ru: { profTitle: "Мой профиль", profGuest: "Откройте в Telegram, чтобы увидеть профиль" },
};
for (const l in PROF_I18N) Object.assign(I18N[l], PROF_I18N[l]);

// 🔮 소울 / ✦ 각성 시스템
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

// 캐시 상점 확장(패스·성장팩)
const SHOP2_I18N = {
  ko: { pkMonthly: "📅 월간 패스 · 즉시💎300 + 30일 매일💎100", pkWeekly: "📅 주간 패스 · 즉시💎150 + 7일 매일💎100", pkGrow1: "📦 성장 패키지 · 💰5만+💎200+SR장비×2", pkGrow2: "🎁 고급 성장팩 · 💰20만+💎800+SSR유닛+장비", pkFounder: "🏅 창단멤버 한정팩 (💎1500+SSR유닛·장비+영구 골드+25%·뱃지)", pkStarter: "💎 초심자 패키지 · 골드+20% 영구 + 즉시 3,000골드 + 유닛 10개", passDaily: "패스 보상 💎+{n}", tMonthly: "📅 월간 패스 활성! 💎300 + 매일💎100", tWeekly: "📅 주간 패스 활성! 💎150 + 매일💎100", tGrowth: "🎁 성장 패키지 획득!" },
  en: { pkMonthly: "📅 Monthly Pass · 💎300 now + 💎100/day×30", pkWeekly: "📅 Weekly Pass · 💎150 now + 💎100/day×7", pkGrow1: "📦 Growth Pack · 💰50k+💎200+2 SR gear", pkGrow2: "🎁 Premium Growth · 💰200k+💎800+SSR unit+gear", pkFounder: "🏅 Founder Pack (💎1500+SSR unit·gear+permanent +25% gold·badge)", pkStarter: "💎 Starter Pack · +20% gold permanent + 3,000 gold instant + 10 units", passDaily: "Pass reward 💎+{n}", tMonthly: "📅 Monthly Pass active! 💎300 + 💎100/day", tWeekly: "📅 Weekly Pass active! 💎150 + 💎100/day", tGrowth: "🎁 Growth pack acquired!" },
  ja: { pkMonthly: "📅 月間パス · 即💎300 + 30日毎日💎100", pkWeekly: "📅 週間パス · 即💎150 + 7日毎日💎100", pkGrow1: "📦 成長パック · 💰5万+💎200+SR装備×2", pkGrow2: "🎁 上級成長パック · 💰20万+💎800+SSRユニット+装備", pkFounder: "🏅 Founder Pack (💎1500+SSR+permanent +25%% gold)", pkStarter: "💎 初心者パック · ゴールド+20%永久 + 即3000ゴールド + ユニット10体", passDaily: "パス報酬 💎+{n}", tMonthly: "📅 月間パス有効! 💎300 + 毎日💎100", tWeekly: "📅 週間パス有効! 💎150 + 毎日💎100", tGrowth: "🎁 成長パック獲得!" },
  zh: { pkMonthly: "📅 月卡 · 立即💎300 + 30天每日💎100", pkWeekly: "📅 周卡 · 立即💎150 + 7天每日💎100", pkGrow1: "📦 成长礼包 · 💰5万+💎200+SR装备×2", pkGrow2: "🎁 高级成长礼包 · 💰20万+💎800+SSR单位+装备", pkFounder: "🏅 Founder Pack (💎1500+SSR+permanent +25%% gold)", pkStarter: "💎 新手礼包 · 金币+20%永久 + 立即3000金币 + 10单位", passDaily: "通行证奖励 💎+{n}", tMonthly: "📅 月卡激活! 💎300 + 每日💎100", tWeekly: "📅 周卡激活! 💎150 + 每日💎100", tGrowth: "🎁 获得成长礼包!" },
  hi: { pkMonthly: "📅 मासिक पास · तुरंत💎300 + 30दिन💎100/दिन", pkWeekly: "📅 साप्ताहिक पास · तुरंत💎150 + 7दिन💎100/दिन", pkGrow1: "📦 ग्रोथ पैक · 💰50k+💎200+2 SR गियर", pkGrow2: "🎁 प्रीमियम ग्रोथ · 💰200k+💎800+SSR यूनिट+गियर", pkFounder: "🏅 Founder Pack (💎1500+SSR+permanent +25%% gold)", pkStarter: "💎 स्टार्टर पैक · गोल्ड+20% स्थायी + तुरंत 3000 गोल्ड + 10 यूनिट", passDaily: "पास इनाम 💎+{n}", tMonthly: "📅 मासिक पास चालू! 💎300 + 💎100/दिन", tWeekly: "📅 साप्ताहिक पास चालू! 💎150 + 💎100/दिन", tGrowth: "🎁 ग्रोथ पैक मिला!" },
  ru: { pkMonthly: "📅 Месячный пропуск · 💎300 + 💎100/день×30", pkWeekly: "📅 Недельный пропуск · 💎150 + 💎100/день×7", pkGrow1: "📦 Пакет роста · 💰50k+💎200+2 SR снаряги", pkGrow2: "🎁 Премиум рост · 💰200k+💎800+SSR юнит+снаряга", pkFounder: "🏅 Founder Pack (💎1500+SSR+permanent +25%% gold)", pkStarter: "💎 Набор новичка · +20% золота навсегда + сразу 3000 золота + 10 юнитов", passDaily: "Награда пропуска 💎+{n}", tMonthly: "📅 Месячный активен! 💎300 + 💎100/день", tWeekly: "📅 Недельный активен! 💎150 + 💎100/день", tGrowth: "🎁 Пакет роста получен!" },
};
for (const l in SHOP2_I18N) Object.assign(I18N[l], SHOP2_I18N[l]);

// 💳 결제(Stars)
const PAY_I18N = {
  ko: { payDemo: "🧪 데모 지급 (결제 연동 전)", payOpening: "💳 결제창 여는 중…", payOk: "✅ 결제 완료 — 지급됨!", payFail: "❌ 결제 실패", payCancel: "결제 취소됨", payErr: "⚠️ 결제 서버 연결 실패", payVerifying: "🔒 결제 확인 중…", payDemoNote: "🧪 데모 모드 (실제 Telegram Stars 결제는 Worker 배포 후 연동)" },
  en: { payDemo: "🧪 Demo grant (payment not wired)", payOpening: "💳 Opening checkout…", payOk: "✅ Paid — granted!", payFail: "❌ Payment failed", payCancel: "Payment cancelled", payErr: "⚠️ Payment server error", payVerifying: "🔒 Verifying payment…", payDemoNote: "🧪 Demo mode (real Telegram Stars requires Worker deploy)" },
  ja: { payDemo: "🧪 デモ付与(決済未連携)", payOpening: "💳 決済画面を開いています…", payOk: "✅ 決済完了 — 付与!", payFail: "❌ 決済失敗", payCancel: "決済キャンセル", payErr: "⚠️ 決済サーバー接続失敗", payVerifying: "🔒 決済確認中…" },
  zh: { payDemo: "🧪 演示发放(未接入支付)", payOpening: "💳 正在打开支付…", payOk: "✅ 支付完成 — 已发放!", payFail: "❌ 支付失败", payCancel: "已取消支付", payErr: "⚠️ 支付服务器错误", payVerifying: "🔒 验证支付中…" },
  hi: { payDemo: "🧪 डेमो (भुगतान बाकी)", payOpening: "💳 चेकआउट खुल रहा…", payOk: "✅ भुगतान हुआ — मिला!", payFail: "❌ भुगतान विफल", payCancel: "भुगतान रद्द", payErr: "⚠️ भुगतान सर्वर त्रुटि", payVerifying: "🔒 भुगतान सत्यापन…" },
  ru: { payDemo: "🧪 Демо-выдача (оплата не подключена)", payOpening: "💳 Открываем оплату…", payOk: "✅ Оплачено — выдано!", payFail: "❌ Ошибка оплаты", payCancel: "Оплата отменена", payErr: "⚠️ Ошибка платёжного сервера", payVerifying: "🔒 Проверка оплаты…" },
};
for (const l in PAY_I18N) Object.assign(I18N[l], PAY_I18N[l]);
// 텔레그램 밖 결제 차단 안내 (웹 무료지급 방지)
const TGONLY_I18N = { ko: "💳 텔레그램 미니앱에서 구매 가능해요", en: "💳 Purchase available in the Telegram mini app", ja: "💳 Telegramミニアプリで購入できます", zh: "💳 请在 Telegram 小程序内购买", hi: "💳 Telegram मिनी ऐप में खरीदें", ru: "💳 Покупка доступна в мини-приложении Telegram" };
for (const l in TGONLY_I18N) I18N[l].payTgOnly = TGONLY_I18N[l];
// 🗼 무한탑 층수 라벨
const TOWER_I18N = { ko: "🗼 무한탑 {n}층", en: "🗼 Tower F{n}", ja: "🗼 無限の塔 {n}階", zh: "🗼 无限塔 {n}层", hi: "🗼 टावर F{n}", ru: "🗼 Башня {n}эт" };
for (const l in TOWER_I18N) I18N[l].tTowerLabel = TOWER_I18N[l];

// 📊 전체 확률 공개 (법적 disclosure — 코드값과 100% 일치)
const ODDS_I18N = {
  ko: { oddsGemTitle: "젬 가챠", oddsGoldTitle: "골드 가챠", oddsGoldNote: "※ 골드 가챠는 SSR 미등장 (SSR은 젬 가챠 전용)", oddsBtn: "📊 전체 확률 보기", oddsTitle: "📊 뽑기 확률 전체 공개", oddsPity: "천장: 12회 뽑으면 SSR 확정 · 7회부터 SSR 확률 상승(+4%/pull). 표시 확률은 게임 코드와 100% 일치합니다.", oddsFict: "※ 이 가챠·기원 드롭은 Legion Chronicles 속 가상의 서사입니다. 모든 재화·이벤트는 게임 내 전용. 실제 확률은 항상 코드와 일치 공개.", grNote: "🎯 12회 천장 = SSR 확정 · 7회부터 +4%/pull · 장비도 동일 확률" },
  en: { oddsGemTitle: "Gem Gacha", oddsGoldTitle: "Gold Gacha", oddsGoldNote: "※ Gold gacha does not drop SSR (SSR is gem-gacha exclusive)", oddsBtn: "📊 View full odds", oddsTitle: "📊 Full Pull Rate Disclosure", oddsPity: "Pity: a guaranteed SSR on the 12th pull · SSR rate rises from pull 7 (+4%/pull). Displayed rates match the game code 100%.", oddsFict: "※ This gacha + origin drop is fictional narrative within Legion Chronicles. All currencies/events in-game only. Real rates always match code & publicly disclosed.", grNote: "🎯 12-pull pity = guaranteed SSR · SSR rate rises from pull 7 (+4%/pull) · gear uses same rates" },
  ja: { oddsGemTitle: "ジェムガチャ", oddsGoldTitle: "ゴールドガチャ", oddsGoldNote: "※ ゴールドガチャからSSRは出ません（SSRはジェムガチャ専用）", oddsBtn: "📊 全確率を見る", oddsTitle: "📊 ガチャ確率 完全公開", oddsPity: "天井: 12回でSSR確定 · 7回目からSSR確率上昇(+4%/pull)。表示確率はゲームコードと100%一致。", oddsFict: "※ このガチャはLegion Chronicles内の架空の演出で、全ての通貨はゲーム内専用です。", grNote: "🎯 12回天井=SSR確定 · 7回目から+4%/pull · 装備も同確率" },
  zh: { oddsGemTitle: "宝石抽卡", oddsGoldTitle: "金币抽卡", oddsGoldNote: "※ 金币抽卡不会出SSR（SSR为宝石抽卡专属）", oddsBtn: "📊 查看全部概率", oddsTitle: "📊 抽卡概率完整公示", oddsPity: "保底: 第12抽必出SSR · 第7抽起SSR概率提升(+4%/抽)。显示概率与游戏代码100%一致。", oddsFict: "※ 本抽卡为Legion Chronicles内的虚构演出，所有货币仅限游戏内使用。", grNote: "🎯 12抽保底=必出SSR · 第7抽起+4%/抽 · 装备同概率" },
  hi: { oddsGemTitle: "जेम गाचा", oddsGoldTitle: "गोल्ड गाचा", oddsGoldNote: "※ गोल्ड गाचा में SSR नहीं मिलता (SSR केवल जेम गाचा में)", oddsBtn: "📊 पूरी संभावना देखें", oddsTitle: "📊 पूर्ण दर प्रकटीकरण", oddsPity: "पिटी: 12वें पुल पर SSR पक्का · पुल 7 से SSR दर बढ़ती है (+4%/पुल)। दिखाई गई दरें गेम कोड से 100% मेल खाती हैं।", oddsFict: "※ यह गाचा Legion Chronicles का काल्पनिक फीचर है; सभी मुद्राएँ केवल इन-गेम हैं।", grNote: "🎯 12-पुल पिटी = पक्का SSR · पुल 7 से +4%/पुल · गियर समान दर" },
  ru: { oddsGemTitle: "Гача за самоцветы", oddsGoldTitle: "Гача за золото", oddsGoldNote: "※ В золотой гаче SSR не выпадает (SSR только в гаче за самоцветы)", oddsBtn: "📊 Все шансы", oddsTitle: "📊 Полное раскрытие шансов", oddsPity: "Гарант: SSR на 12-й крутке · шанс SSR растёт с 7-й крутки (+4%/крутку). Показанные шансы на 100% совпадают с кодом игры.", oddsFict: "※ Эта гача — вымышленный элемент Legion Chronicles; вся валюта только внутриигровая.", grNote: "🎯 Гарант 12 круток = SSR · шанс SSR растёт с 7-й (+4%/крутку) · снаряжение по тем же шансам" },
};
for (const l in ODDS_I18N) Object.assign(I18N[l], ODDS_I18N[l]);

// 🗺️ 정복 연대기 보상 트랙
const CQ_I18N = {
  ko: { cqTitle: "정복 연대기", cqFell: "폐허 함락", cqClaimN: "보상 {n}개!", cqReward: "ch{n} 정복 보상" },
  en: { cqTitle: "Conquest Chronicle", cqFell: "ruins fallen", cqClaimN: "{n} reward!", cqReward: "Ch{n} conquest reward" },
  ja: { cqTitle: "征服年代記", cqFell: "の廃墟制圧", cqClaimN: "報酬{n}個!", cqReward: "ch{n} 制圧報酬" },
  zh: { cqTitle: "征服编年史", cqFell: "处废墟攻陷", cqClaimN: "{n}个奖励!", cqReward: "ch{n} 征服奖励" },
  hi: { cqTitle: "विजय गाथा", cqFell: "खंडहर जीते", cqClaimN: "{n} इनाम!", cqReward: "ch{n} विजय इनाम" },
  ru: { cqTitle: "Хроника завоеваний", cqFell: "руин пало", cqClaimN: "{n} награда!", cqReward: "гл.{n} награда" },
};
for (const l in CQ_I18N) Object.assign(I18N[l], CQ_I18N[l]);

// 🎵 배경음악 토글
const MUSIC_I18N = { ko: "배경음악", en: "Music", ja: "BGM", zh: "背景音乐", hi: "संगीत", ru: "Музыка" };
for (const l in MUSIC_I18N) I18N[l].setMusic = MUSIC_I18N[l];

// 상점 보유중 짧은 라벨
const OWNED_I18N = { ko: "보유중", en: "Owned", ja: "保有中", zh: "已拥有", hi: "स्वामित्व", ru: "Есть" };
for (const l in OWNED_I18N) I18N[l].ownedShort = OWNED_I18N[l];

// ⚔️ 편성(스쿼드) 시스템
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
// 🔄 환생(Ascension) v2 — 에테르 비파괴 루프 (PRD-prestige-loop). ja/zh/hi/ru 은 en 폴백.
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

// 🛠️ 장비 도감 제목
const GEARDEX_I18N = { ko: "장비 도감", en: "Gear Codex", ja: "装備図鑑", zh: "装备图鉴", hi: "गियर कोडेक्स", ru: "Кодекс снаряжения" };
for (const l in GEARDEX_I18N) I18N[l].gearDexT = GEARDEX_I18N[l];

// 🏆 챕터 마일스톤 해금
const MS_I18N = {
  ko: { ms_tower: "무한탑", ms_boss: "보스 모드", msReach: "{n}챕터 달성!", msUnlock: "해금", msCh: "챕터", msLocked: "🔒 {n}챕터에서 해금" },
  en: { ms_tower: "Tower", ms_boss: "Boss Mode", msReach: "Chapter {n} reached!", msUnlock: "unlock", msCh: "ch", msLocked: "🔒 Unlocks at chapter {n}" },
  ja: { ms_tower: "無限の塔", ms_boss: "ボスモード", msReach: "チャプター{n}達成!", msUnlock: "解放", msCh: "章", msLocked: "🔒 チャプター{n}で解放" },
  zh: { ms_tower: "无限之塔", ms_boss: "Boss模式", msReach: "达成第{n}章!", msUnlock: "解锁", msCh: "章", msLocked: "🔒 第{n}章解锁" },
  hi: { ms_tower: "मीनार", ms_boss: "बॉस मोड", msReach: "अध्याय {n} पूर्ण!", msUnlock: "अनलॉक", msCh: "अध्याय", msLocked: "🔒 अध्याय {n} पर अनलॉक" },
  ru: { ms_tower: "Башня", ms_boss: "Босс", msReach: "Глава {n} достигнута!", msUnlock: "открытие", msCh: "гл", msLocked: "🔒 Открывается на главе {n}" },
};
for (const l in MS_I18N) Object.assign(I18N[l], MS_I18N[l]);

// 🌐 하드코딩 한국어 → 6언어 통일 (status/badge/battle/referral/salvage/tutorial 등 런타임 UI)
const RUNTIME_I18N = {
  ko: {
    bossGate: "🐲 {n}층 보스 관문! · ", stWinNext: " · 승리하면 챕터 +1",
    stBeginner: " · 초보자 모드 (쉽게 시작!)", stFullDiff: " · 본격 난이도 ↑",
    tbStatusDeploy: "🧠 턴제 전술 — 배치 후 시작 → 다음 턴으로 수동 진행 (자동과 완전 분리)",
    tbStatusStart: "🧠 턴제: 배치 후 ▶ 시작 → '다음 턴' 클릭. 전술 선택으로 군단 흐름 제어",
    towerBadge: "🗼 {f}층", towerWall: " ·벽까지{n}", bossBadge: "🐲 보스 {n}탄",
    sacredBond: "🌊 결속 활성 — 파운더 연결", vanguardOn: " • 24h 집중 모드 ON (내일 파워 UP)",
    newBattlefield: "⚔️ 새 전장 진입: {name}", moraleHigh: "🔥 군단 사기 충천! 다음 챕터로 진격하세요",
    shareCarry: "📤 MY Legion carried 공유", shareResult: "📤 결과 공유 (친구 초대)",
    refFriends: "초대한 친구", refClaim: "보상 받기", refAllDone: "모두 수령", refTable: "보상표",
    refNoReward: "받을 보상이 없어요", refInviteBonus: "🎁 초대 보상!", refMilestone: "마일스톤", refGearShort: "장비",
    gearEquippedNoScrap: "장착중 — 분해 불가", gearScrapped: "🔨 +{n} 골드 · 장비 분해",
    noJunkGear: "분해할 잡템 없어요 (N/R 미장착·미강화)", bulkScrapped: "🔨 +{g} 골드 · {n}개 분해",
    collectClaimedAlready: "이미 수령", alreadyOwned: "이미 보유",
    tutShareCopied: "📤 전과 카드 복사됨 — 텔레그램에 붙여넣기!", shareFail: "공유 실패", idCopied: "ID 복사됨",
    tut1: "⚔️ 환영합니다, 사령관님!\n\nAI 군단을 모아 키우고 끝없이 정복하는 게임이에요.\n30초면 핵심을 다 익혀요!",
    tut2: "👇 먼저 <b>▶ 전투 시작</b>을 눌러보세요.\n군단이 자동으로 싸웁니다!",
    tut3: "💎 전투로 모은 젬으로 <b>🎰 뽑기</b>를 해\n강력한 영웅(SSR!)을 소환하세요.",
    tut4: "👥 <b>캐릭터</b> 탭에서 영웅을 편성·강화하면\n시너지로 군단이 더 강해져요.",
    tut5: "🛒 <b>상점</b>엔 한정 배너·창단팩,\n📋 <b>도감</b>엔 수집 보상이 있어요!",
    tut6: "🐉 끝! 군단은 당신이 없는 동안에도\n자동으로 정복하고 성장합니다.\n\n이제 세계를 정복하세요!",
    tutNext: "다음", tutStart: "시작 👉", tutConquer: "정복 시작! ⚔️", tutSkip: "건너뛰기",
    quickPull: "🎰 뽑기 💎8", scrapJunk: "🔨 잡템 일괄 분해 (N/R 미장착 → 골드)",
    pityLeft: "🎯 다음 SSR까지 {n}회", streakLabel: "🔥 연속", shareBrag: "📤 전과 자랑하기", inviteFriendBtn: "👥 친구 초대",
    refModalTitle: "🏆 친구 초대 보상 (최대 1만명)", refModalSub: "친구당 💎50 + 아래 누적 마일스톤 보너스",
    refModalClaim: "🎁 받을 수 있는 보상 받기", closeBtn: "닫기",
    gateSub: "Daedalus · AI 군단 전쟁", gateMsg: "📱 이 게임은 <b style=\"color:#67e8f9;\">텔레그램</b>에서 플레이합니다<br><span style=\"font-size:13px;color:#8b8ba7;\">결제·세이브가 텔레그램 계정에 안전하게 연동돼요</span>",
    gateBtn: "🎮 텔레그램에서 열기",
    ageTitle: "연령 확인 · Age Check", ageBody1: "이 게임은 <b style=\"color:#67e8f9;\">가상 재화 확률형 아이템(가챠)</b>을 포함합니다.<br>확률은 게임 내에 전부 공개됩니다.",
    ageBody2: "만 <b style=\"color:#fff;\">18세 이상</b>이거나, 미성년자의 경우 <b style=\"color:#fff;\">법정 보호자의 동의</b>를 받으셨습니까?<br><span style=\"font-size:11px;color:#7a7a96;\">Are you 18+ or have parental/guardian consent?</span>",
    ageYes: "네, 확인했습니다 · Yes", ageNo: "아니오 · No",
    ageFoot: "확률형 아이템 정보는 게임 내 \"📊 전체 확률 보기\"에서 항상 확인 가능. 모든 재화는 게임 내 전용입니다.",
  },
  en: {
    bossGate: "🐲 Floor {n} boss gate! · ", stWinNext: " · Win to advance chapter +1",
    stBeginner: " · Beginner mode (easy start!)", stFullDiff: " · Full difficulty ↑",
    tbStatusDeploy: "🧠 Turn-based tactics — deploy then start → advance manually turn by turn (fully separate from auto)",
    tbStatusStart: "🧠 Turn-based: deploy & ▶ Start → tap 'Next Turn'. Steer your legion with tactics.",
    towerBadge: "🗼 F{f}", towerWall: " ·{n} to wall", bossBadge: "🐲 Boss #{n}",
    sacredBond: "🌊 Bond active — Founder link", vanguardOn: " • 24h Focus ON (power up tomorrow)",
    newBattlefield: "⚔️ New battlefield: {name}", moraleHigh: "🔥 Legion morale soaring! Push to the next chapter",
    shareCarry: "📤 Share MY Legion carry", shareResult: "📤 Share result (invite friends)",
    refFriends: "Friends invited", refClaim: "Claim reward", refAllDone: "All claimed", refTable: "Rewards",
    refNoReward: "No rewards to claim", refInviteBonus: "🎁 Invite reward!", refMilestone: "milestone", refGearShort: "gear",
    gearEquippedNoScrap: "Equipped — can't dismantle", gearScrapped: "🔨 +{n} gold · gear dismantled",
    noJunkGear: "No junk to dismantle (unequipped/unenhanced N/R)", bulkScrapped: "🔨 +{g} gold · {n} dismantled",
    collectClaimedAlready: "Already claimed", alreadyOwned: "Already owned",
    tutShareCopied: "📤 Battle card copied — paste in Telegram!", shareFail: "Share failed", idCopied: "ID copied",
    tut1: "⚔️ Welcome, Commander!\n\nCollect and raise an AI legion and conquer endlessly.\nYou'll master the basics in 30 seconds!",
    tut2: "👇 First, tap <b>▶ Start</b>.\nYour legion fights automatically!",
    tut3: "💎 Use gems from battle to <b>🎰 Pull</b>\nand summon powerful heroes (SSR!).",
    tut4: "👥 In the <b>Units</b> tab, deploy & upgrade heroes\nfor synergy that makes your legion stronger.",
    tut5: "🛒 The <b>Shop</b> has limited banners & founder packs,\n📋 the <b>Codex</b> has collection rewards!",
    tut6: "🐉 Done! Your legion keeps conquering and growing\neven while you're away.\n\nNow go conquer the world!",
    tutNext: "Next", tutStart: "Start 👉", tutConquer: "Start conquest! ⚔️", tutSkip: "Skip",
    quickPull: "🎰 Pull 💎8", scrapJunk: "🔨 Bulk-dismantle junk (unequipped N/R → gold)",
    pityLeft: "🎯 {n} pulls to next SSR", streakLabel: "🔥 Streak", shareBrag: "📤 Brag results", inviteFriendBtn: "👥 Invite Friends",
    refModalTitle: "🏆 Invite Rewards (up to 10,000)", refModalSub: "💎50 per friend + cumulative milestone bonuses below",
    refModalClaim: "🎁 Claim available rewards", closeBtn: "Close",
    gateSub: "Daedalus · AI Legion War", gateMsg: "📱 Play this game on <b style=\"color:#67e8f9;\">Telegram</b><br><span style=\"font-size:13px;color:#8b8ba7;\">Payments & saves are safely linked to your Telegram account</span>",
    gateBtn: "🎮 Open in Telegram",
    ageTitle: "Age Check", ageBody1: "This game includes <b style=\"color:#67e8f9;\">virtual-currency gacha (probability items)</b>.<br>All odds are fully disclosed in-game.",
    ageBody2: "Are you <b style=\"color:#fff;\">18+</b>, or if a minor, do you have <b style=\"color:#fff;\">parental/guardian consent</b>?",
    ageYes: "Yes, confirmed", ageNo: "No",
    ageFoot: "Gacha odds are always viewable via \"📊 View all odds\" in-game. All currencies are in-game only.",
  },
  ja: {
    bossGate: "🐲 {n}階ボス関門! · ", stWinNext: " · 勝てばチャプター +1",
    stBeginner: " · 初心者モード (簡単スタート!)", stFullDiff: " · 本格難易度 ↑",
    tbStatusDeploy: "🧠 ターン制戦術 — 配置して開始 → 次のターンへ手動進行 (自動と完全分離)",
    tbStatusStart: "🧠 ターン制: 配置して ▶ 開始 → '次のターン'をタップ。戦術選択で軍団の流れを制御。",
    towerBadge: "🗼 {f}階", towerWall: " ·壁まで{n}", bossBadge: "🐲 ボス {n}体目",
    sacredBond: "🌊 結束発動 — 創設者リンク", vanguardOn: " • 24h集中モードON (明日パワーUP)",
    newBattlefield: "⚔️ 新戦場へ: {name}", moraleHigh: "🔥 軍団士気高揚! 次のチャプターへ進撃せよ",
    shareCarry: "📤 MY Legionキャリーを共有", shareResult: "📤 結果を共有 (友達招待)",
    refFriends: "招待した友達", refClaim: "報酬を受取", refAllDone: "全て受取済み", refTable: "報酬表",
    refNoReward: "受取れる報酬なし", refInviteBonus: "🎁 招待報酬!", refMilestone: "マイルストーン", refGearShort: "装備",
    gearEquippedNoScrap: "装着中 — 分解不可", gearScrapped: "🔨 +{n} ゴールド · 装備分解",
    noJunkGear: "分解する雑装備なし (N/R 未装着·未強化)", bulkScrapped: "🔨 +{g} ゴールド · {n}個分解",
    collectClaimedAlready: "受取済み", alreadyOwned: "所持済み",
    tutShareCopied: "📤 戦績カードをコピー — Telegramに貼付!", shareFail: "共有失敗", idCopied: "IDコピー済み",
    tut1: "⚔️ ようこそ、指揮官!\n\nAI軍団を集めて育て、無限に征服するゲームです。\n30秒で基本を習得!",
    tut2: "👇 まず <b>▶ 戦闘開始</b> をタップ。\n軍団が自動で戦います!",
    tut3: "💎 戦闘で貯めたジェムで <b>🎰 ガチャ</b>\n強力な英雄(SSR!)を召喚。",
    tut4: "👥 <b>ユニット</b>タブで英雄を編成·強化すると\nシナジーで軍団がさらに強く。",
    tut5: "🛒 <b>ショップ</b>に限定バナー·創設パック、\n📋 <b>図鑑</b>に収集報酬!",
    tut6: "🐉 完了! 軍団は留守の間も\n自動で征服し成長します。\n\nさあ世界を征服しよう!",
    tutNext: "次へ", tutStart: "開始 👉", tutConquer: "征服開始! ⚔️", tutSkip: "スキップ",
    quickPull: "🎰 ガチャ 💎8", scrapJunk: "🔨 雑装備を一括分解 (N/R 未装着 → ゴールド)",
    pityLeft: "🎯 次のSSRまで{n}回", streakLabel: "🔥 連続", shareBrag: "📤 戦績を自慢", inviteFriendBtn: "👥 友達招待",
    refModalTitle: "🏆 友達招待報酬 (最大1万人)", refModalSub: "友達1人💎50 + 下記の累積マイルストーンボーナス",
    refModalClaim: "🎁 受取れる報酬を受取", closeBtn: "閉じる",
    gateSub: "Daedalus · AI軍団戦争", gateMsg: "📱 このゲームは<b style=\"color:#67e8f9;\">Telegram</b>でプレイします<br><span style=\"font-size:13px;color:#8b8ba7;\">決済·セーブがTelegramアカウントに安全に連携</span>",
    gateBtn: "🎮 Telegramで開く",
    ageTitle: "年齢確認 · Age Check", ageBody1: "このゲームは<b style=\"color:#67e8f9;\">仮想通貨ガチャ(確率アイテム)</b>を含みます。<br>確率はゲーム内で全て公開。",
    ageBody2: "あなたは<b style=\"color:#fff;\">18歳以上</b>ですか、または未成年の場合<b style=\"color:#fff;\">保護者の同意</b>がありますか?<br><span style=\"font-size:11px;color:#7a7a96;\">Are you 18+ or have parental/guardian consent?</span>",
    ageYes: "はい、確認しました", ageNo: "いいえ",
    ageFoot: "ガチャ確率はゲーム内「📊 全確率を見る」で常に確認可能。全ての通貨はゲーム内専用です。",
  },
  zh: {
    bossGate: "🐲 {n}层首领关卡! · ", stWinNext: " · 胜利则章节 +1",
    stBeginner: " · 新手模式 (轻松开始!)", stFullDiff: " · 正式难度 ↑",
    tbStatusDeploy: "🧠 回合制战术 — 部署后开始 → 手动逐回合推进 (与自动完全分离)",
    tbStatusStart: "🧠 回合制: 部署并 ▶ 开始 → 点击'下一回合'。用战术掌控军团流向。",
    towerBadge: "🗼 {f}层", towerWall: " ·距墙{n}", bossBadge: "🐲 首领 第{n}波",
    sacredBond: "🌊 结契激活 — 创始者连接", vanguardOn: " • 24h专注模式开启 (明日战力提升)",
    newBattlefield: "⚔️ 进入新战场: {name}", moraleHigh: "🔥 军团士气高涨! 向下一章进军",
    shareCarry: "📤 分享军团战绩", shareResult: "📤 分享结果 (邀请好友)",
    refFriends: "已邀请好友", refClaim: "领取奖励", refAllDone: "已全部领取", refTable: "奖励表",
    refNoReward: "暂无可领奖励", refInviteBonus: "🎁 邀请奖励!", refMilestone: "里程碑", refGearShort: "装备",
    gearEquippedNoScrap: "装备中 — 无法分解", gearScrapped: "🔨 +{n} 金币 · 装备分解",
    noJunkGear: "无可分解杂装 (N/R 未装备·未强化)", bulkScrapped: "🔨 +{g} 金币 · 分解{n}件",
    collectClaimedAlready: "已领取", alreadyOwned: "已拥有",
    tutShareCopied: "📤 战绩卡已复制 — 粘贴到Telegram!", shareFail: "分享失败", idCopied: "ID已复制",
    tut1: "⚔️ 欢迎，指挥官!\n\n收集培养AI军团，无尽征服的游戏。\n30秒即可掌握核心!",
    tut2: "👇 先点击 <b>▶ 开始战斗</b>。\n军团会自动战斗!",
    tut3: "💎 用战斗获得的钻石进行 <b>🎰 抽卡</b>\n召唤强力英雄(SSR!)。",
    tut4: "👥 在<b>角色</b>页编成·强化英雄\n协同让军团更强。",
    tut5: "🛒 <b>商店</b>有限定横幅·创始礼包，\n📋 <b>图鉴</b>有收集奖励!",
    tut6: "🐉 完成! 军团在你离开时\n也会自动征服与成长。\n\n现在去征服世界吧!",
    tutNext: "下一步", tutStart: "开始 👉", tutConquer: "开始征服! ⚔️", tutSkip: "跳过",
    quickPull: "🎰 抽卡 💎8", scrapJunk: "🔨 一键分解杂装 (N/R 未装备 → 金币)",
    pityLeft: "🎯 距下个SSR还有{n}次", streakLabel: "🔥 连续", shareBrag: "📤 炫耀战绩", inviteFriendBtn: "👥 邀请好友",
    refModalTitle: "🏆 好友邀请奖励 (最多1万人)", refModalSub: "每位好友💎50 + 下方累计里程碑奖励",
    refModalClaim: "🎁 领取可得奖励", closeBtn: "关闭",
    gateSub: "Daedalus · AI军团战争", gateMsg: "📱 本游戏在<b style=\"color:#67e8f9;\">Telegram</b>上游玩<br><span style=\"font-size:13px;color:#8b8ba7;\">支付与存档安全绑定到你的Telegram账号</span>",
    gateBtn: "🎮 在Telegram中打开",
    ageTitle: "年龄确认 · Age Check", ageBody1: "本游戏包含<b style=\"color:#67e8f9;\">虚拟货币抽卡(概率物品)</b>。<br>概率均在游戏内完全公开。",
    ageBody2: "您是否<b style=\"color:#fff;\">年满18岁</b>，或若为未成年人，是否已获<b style=\"color:#fff;\">法定监护人同意</b>?<br><span style=\"font-size:11px;color:#7a7a96;\">Are you 18+ or have parental/guardian consent?</span>",
    ageYes: "是，我已确认", ageNo: "否",
    ageFoot: "抽卡概率可随时在游戏内「📊 查看全部概率」查看。所有货币仅限游戏内。",
  },
  hi: {
    bossGate: "🐲 मंज़िल {n} बॉस गेट! · ", stWinNext: " · जीतें तो अध्याय +1",
    stBeginner: " · शुरुआती मोड (आसान शुरुआत!)", stFullDiff: " · पूरी कठिनाई ↑",
    tbStatusDeploy: "🧠 टर्न-आधारित रणनीति — तैनात कर शुरू करें → हर टर्न मैन्युअल आगे बढ़ाएँ (ऑटो से पूरी तरह अलग)",
    tbStatusStart: "🧠 टर्न-आधारित: तैनात करें और ▶ शुरू → 'अगला टर्न' टैप करें। रणनीति से लीजन को चलाएँ।",
    towerBadge: "🗼 {f} मंज़िल", towerWall: " ·दीवार तक {n}", bossBadge: "🐲 बॉस #{n}",
    sacredBond: "🌊 बंधन सक्रिय — फाउंडर लिंक", vanguardOn: " • 24घं फोकस ऑन (कल पावर अप)",
    newBattlefield: "⚔️ नया रणक्षेत्र: {name}", moraleHigh: "🔥 लीजन का हौसला बुलंद! अगले अध्याय की ओर बढ़ें",
    shareCarry: "📤 लीजन विजय शेयर करें", shareResult: "📤 परिणाम शेयर (दोस्त बुलाएँ)",
    refFriends: "बुलाए दोस्त", refClaim: "इनाम लें", refAllDone: "सब ले लिया", refTable: "इनाम",
    refNoReward: "कोई इनाम नहीं", refInviteBonus: "🎁 आमंत्रण इनाम!", refMilestone: "मील का पत्थर", refGearShort: "गियर",
    gearEquippedNoScrap: "लगा हुआ — तोड़ नहीं सकते", gearScrapped: "🔨 +{n} गोल्ड · गियर तोड़ा",
    noJunkGear: "तोड़ने को कबाड़ नहीं (बिना लगा/बिना अपग्रेड N/R)", bulkScrapped: "🔨 +{g} गोल्ड · {n} तोड़े",
    collectClaimedAlready: "पहले ले लिया", alreadyOwned: "पहले से है",
    tutShareCopied: "📤 बैटल कार्ड कॉपी — Telegram में पेस्ट करें!", shareFail: "शेयर विफल", idCopied: "ID कॉपी",
    tut1: "⚔️ स्वागत है, कमांडर!\n\nAI लीजन जमा कर पालें और अनंत विजय पाएँ।\n30 सेकंड में मूल बातें सीखें!",
    tut2: "👇 पहले <b>▶ शुरू</b> दबाएँ।\nआपका लीजन खुद लड़ता है!",
    tut3: "💎 युद्ध से मिले जेम से <b>🎰 गाचा</b> करें\nऔर शक्तिशाली हीरो (SSR!) बुलाएँ।",
    tut4: "👥 <b>यूनिट</b> टैब में हीरो तैनात·अपग्रेड करें\nसिनर्जी से लीजन और मजबूत।",
    tut5: "🛒 <b>स्टोर</b> में लिमिटेड बैनर·फाउंडर पैक,\n📋 <b>कोडेक्स</b> में संग्रह इनाम!",
    tut6: "🐉 हो गया! लीजन आपकी अनुपस्थिति में भी\nखुद विजय पाता और बढ़ता है।\n\nअब दुनिया जीतें!",
    tutNext: "अगला", tutStart: "शुरू 👉", tutConquer: "विजय शुरू! ⚔️", tutSkip: "छोड़ें",
    quickPull: "🎰 गाचा 💎8", scrapJunk: "🔨 कबाड़ एकसाथ तोड़ें (बिना लगा N/R → गोल्ड)",
    pityLeft: "🎯 अगले SSR तक {n} बार", streakLabel: "🔥 लगातार", shareBrag: "📤 उपलब्धि दिखाएँ", inviteFriendBtn: "👥 दोस्त बुलाएँ",
    refModalTitle: "🏆 दोस्त आमंत्रण इनाम (10 हज़ार तक)", refModalSub: "हर दोस्त 💎50 + नीचे संचयी मील-पत्थर बोनस",
    refModalClaim: "🎁 उपलब्ध इनाम लें", closeBtn: "बंद करें",
    gateSub: "Daedalus · AI लीजन युद्ध", gateMsg: "📱 यह गेम <b style=\"color:#67e8f9;\">Telegram</b> पर खेला जाता है<br><span style=\"font-size:13px;color:#8b8ba7;\">भुगतान·सेव आपके Telegram खाते से सुरक्षित जुड़े</span>",
    gateBtn: "🎮 Telegram में खोलें",
    ageTitle: "आयु जाँच · Age Check", ageBody1: "इस गेम में <b style=\"color:#67e8f9;\">वर्चुअल-करेंसी गाचा (संभावना आइटम)</b> हैं।<br>सभी दरें गेम में पूरी तरह प्रकट।",
    ageBody2: "क्या आप <b style=\"color:#fff;\">18+</b> हैं, या नाबालिग हैं तो <b style=\"color:#fff;\">अभिभावक की सहमति</b> है?<br><span style=\"font-size:11px;color:#7a7a96;\">Are you 18+ or have parental/guardian consent?</span>",
    ageYes: "हाँ, पुष्टि की", ageNo: "नहीं",
    ageFoot: "गाचा दरें गेम में \"📊 सभी दरें देखें\" से कभी भी देखें। सभी करेंसी केवल इन-गेम।",
  },
  ru: {
    bossGate: "🐲 Врата босса на этаже {n}! · ", stWinNext: " · Победа — глава +1",
    stBeginner: " · Режим новичка (лёгкий старт!)", stFullDiff: " · Полная сложность ↑",
    tbStatusDeploy: "🧠 Пошаговая тактика — расставьте и начните → ход за ходом вручную (полностью отдельно от авто)",
    tbStatusStart: "🧠 Пошагово: расставьте и ▶ Старт → жмите 'Следующий ход'. Ведите легион тактикой.",
    towerBadge: "🗼 Этаж {f}", towerWall: " ·до стены {n}", bossBadge: "🐲 Босс #{n}",
    sacredBond: "🌊 Связь активна — связь основателей", vanguardOn: " • Фокус 24ч ВКЛ (сила вырастет завтра)",
    newBattlefield: "⚔️ Новое поле боя: {name}", moraleHigh: "🔥 Боевой дух легиона на высоте! Вперёд к следующей главе",
    shareCarry: "📤 Поделиться MY Legion carry", shareResult: "📤 Поделиться результатом (позвать друзей)",
    refFriends: "Приглашено друзей", refClaim: "Забрать награду", refAllDone: "Всё получено", refTable: "Награды",
    refNoReward: "Нет наград к получению", refInviteBonus: "🎁 Награда за приглашение!", refMilestone: "рубеж", refGearShort: "снаряжение",
    gearEquippedNoScrap: "Надето — нельзя разобрать", gearScrapped: "🔨 +{n} золота · снаряжение разобрано",
    noJunkGear: "Нет хлама для разбора (ненадетые/неулучшенные N/R)", bulkScrapped: "🔨 +{g} золота · разобрано {n}",
    collectClaimedAlready: "Уже получено", alreadyOwned: "Уже есть",
    tutShareCopied: "📤 Карта боя скопирована — вставьте в Telegram!", shareFail: "Не удалось поделиться", idCopied: "ID скопирован",
    tut1: "⚔️ Добро пожаловать, командир!\n\nСобирайте и растите ИИ-легион и покоряйте бесконечно.\nОсновы освоите за 30 секунд!",
    tut2: "👇 Сначала нажмите <b>▶ Старт</b>.\nЛегион сражается сам!",
    tut3: "💎 На алмазы из боёв делайте <b>🎰 Призыв</b>\nи призывайте мощных героев (SSR!).",
    tut4: "👥 Во вкладке <b>Юниты</b> размещайте и улучшайте героев\nради синергии — легион станет сильнее.",
    tut5: "🛒 В <b>Магазине</b> — лимитные баннеры и наборы основателя,\n📋 в <b>Кодексе</b> — награды за коллекцию!",
    tut6: "🐉 Готово! Легион покоряет и растёт\nдаже пока вас нет.\n\nТеперь покори мир!",
    tutNext: "Далее", tutStart: "Начать 👉", tutConquer: "Начать завоевание! ⚔️", tutSkip: "Пропустить",
    quickPull: "🎰 Призыв 💎8", scrapJunk: "🔨 Разобрать хлам оптом (ненадетые N/R → золото)",
    pityLeft: "🎯 {n} до след. SSR", streakLabel: "🔥 Серия", shareBrag: "📤 Похвастать", inviteFriendBtn: "👥 Позвать друзей",
    refModalTitle: "🏆 Награды за приглашение (до 10 000)", refModalSub: "💎50 за друга + накопительные рубежи ниже",
    refModalClaim: "🎁 Забрать доступные награды", closeBtn: "Закрыть",
    gateSub: "Daedalus · Война ИИ-легионов", gateMsg: "📱 В эту игру играют в <b style=\"color:#67e8f9;\">Telegram</b><br><span style=\"font-size:13px;color:#8b8ba7;\">Платежи и сохранения безопасно привязаны к вашему аккаунту Telegram</span>",
    gateBtn: "🎮 Открыть в Telegram",
    ageTitle: "Проверка возраста · Age Check", ageBody1: "Игра включает <b style=\"color:#67e8f9;\">гачу за виртуальную валюту (предметы с шансом)</b>.<br>Все шансы полностью раскрыты в игре.",
    ageBody2: "Вам <b style=\"color:#fff;\">18+</b>, а если вы несовершеннолетний — есть ли <b style=\"color:#fff;\">согласие родителя/опекуна</b>?<br><span style=\"font-size:11px;color:#7a7a96;\">Are you 18+ or have parental/guardian consent?</span>",
    ageYes: "Да, подтверждаю", ageNo: "Нет",
    ageFoot: "Шансы гачи всегда доступны в игре через «📊 Показать все шансы». Все валюты только внутриигровые.",
  },
};
for (const l in RUNTIME_I18N) Object.assign(I18N[l], RUNTIME_I18N[l]);

// 🎰 그룹1 — 가챠 메시지/플레이버 (6언어). 브랜드어(MY Legion/Spark/Arclight/Dalio/Rates)는 유지.
const GACHA_I18N = {
  ko: {
    originFlav0: "다이달로스 코어 아카이브 단편", originFlav1: "기밀 판단 로그 복구", originFlav2: "침묵 시대 전송 신호", originFlav3: "분류 해제: Founding 프로토콜", originFlav4: "폐허 잔해 신호 포착", originFlav5: "의식 파편 해독 완료",
    originReveal: "🔓 {f} — {name} 기원 확인됨. (Legion Chronicles 속 가상 서사)",
    originDropTail: " 📡 다음 한정 기회 놓치면 영구 공백 위험. ", originRatesCheck: "📊 Rates 확인",
    gachaGet: "🎉 【{name}】 획득!", gachaDup: "🔄 【{name}】 중복 — 합성/분해 가능",
    noDupDismantle: "분해할 중복이 없어요 (SSR 제외)", soulGained: "🔮 +{soul} 소울! · {count}장 분해",
    highTierClaim: "✨ 고등급 획득! 오프라인·일일 보상도 챙기세요",
    exArrival: "🌌 초월 영웅 강림!", urArrival: "🌀 전설+ 영웅 합류", ssrArrival: "✨ 전설의 영웅이 군단에 합류했습니다",
    exTreasure: "🌌 이 존재는 군단의 절대 보물. 소중히 키우세요.", urTreasure: "🌀 운명의 매듭이 맺어졌습니다. 이 유닛은 평범하지 않습니다.",
    featuredGot: " — ✨{pickup} 획득!",
    fbBannerTitle: "🎯 한정 배너 · {name}", fbDaysLeft: "⏳ {d}일 한정", fbPickup: "픽업 SSR {pickup} 확률 UP · 90뽑 천장 확정",
    fbSparkReady: " — 다음 SSR {pickup} 확정!", fbPullBtn: "🎯 한정 10연 · 💎{cost}",
    lossGap: "⚠️ 놓치면 MY Legion 영구 공백. 다음 기회 수주 후.",
    gachaPityNote: "🎯 천장 {p}/12 · {rates} | hard12=SSR 보장", dupeBadge: "중복",
    dalioWindow: "⏳ 지금이 기회다... 천장 {p}/12. 내 군단이 코앞. 놓치면 영영 공백. 지금 잡아라.",
    shareSSRText: "MY Legion SSR 획득! 같이 정복해", sharePrestigeText: "환생 완료 — 무한 성장 시작! 같이 정복하자", shareBossText: "보스 격파! MY Legion으로 같이 정복해", arclightFomo: "72h Arclight — 지금 아니면 영원히. MY Pantheon judgment.",
    gearScrapConfirm: "{r} 장비를 분해할까요? +{gold}골드",
  },
  en: {
    originFlav0: "Daedalus Core archive fragment", originFlav1: "Classified judgment log recovered", originFlav2: "Signal from the Age of Silence", originFlav3: "Declassified: Founding protocol", originFlav4: "Signal caught in the ruins", originFlav5: "Consciousness shard decoded",
    originReveal: "🔓 {f} — {name} origin confirmed. (fictional, within Legion Chronicles)",
    originDropTail: " 📡 Miss the next limited chance and risk a permanent gap. ", originRatesCheck: "📊 Check rates",
    gachaGet: "🎉 【{name}】 obtained!", gachaDup: "🔄 【{name}】 duplicate — fuse/dismantle",
    noDupDismantle: "No duplicates to dismantle (SSR excluded)", soulGained: "🔮 +{soul} souls! · {count} dismantled",
    highTierClaim: "✨ High tier pulled! Grab your offline & daily rewards too",
    exArrival: "🌌 Transcendent hero descends!", urArrival: "🌀 Legend+ hero joins", ssrArrival: "✨ A legendary hero joins your legion",
    exTreasure: "🌌 This being is your legion's ultimate treasure. Raise it with care.", urTreasure: "🌀 A knot of fate is tied. This unit is no ordinary one.",
    featuredGot: " — ✨{pickup} obtained!",
    fbBannerTitle: "🎯 Limited banner · {name}", fbDaysLeft: "⏳ {d}d left", fbPickup: "Rate-up SSR {pickup} · guaranteed at 90 pulls",
    fbSparkReady: " — next SSR {pickup} guaranteed!", fbPullBtn: "🎯 Limited 10-pull · 💎{cost}",
    lossGap: "⚠️ Miss it and MY Legion stays permanently incomplete. Next chance weeks away.",
    gachaPityNote: "🎯 Pity {p}/12 · {rates} | hard12=SSR guaranteed", dupeBadge: "DUP",
    dalioWindow: "⏳ The moment is now... pity {p}/12. Your Legion is one pull away. Miss it and the gap is forever. Seize it.",
    shareSSRText: "MY Legion SSR pulled! Conquer with me", sharePrestigeText: "Ascension done — infinite growth begins! Conquer with me", shareBossText: "Boss down! Conquer with MY Legion", arclightFomo: "72h Arclight — now or never. MY Pantheon judgment.",
    gearScrapConfirm: "Dismantle this {r} gear? +{gold} gold",
  },
  ja: {
    originFlav0: "ダイダロス・コア アーカイブ断片", originFlav1: "機密判断ログ復元", originFlav2: "沈黙の時代の送信信号", originFlav3: "機密解除: Founding プロトコル", originFlav4: "廃墟の残骸から信号捕捉", originFlav5: "意識の欠片 解読完了",
    originReveal: "🔓 {f} — {name} の起源を確認。(Legion Chronicles 内のフィクション)",
    originDropTail: " 📡 次の限定機会を逃すと永久の空白の危険。 ", originRatesCheck: "📊 レート確認",
    gachaGet: "🎉 【{name}】獲得!", gachaDup: "🔄 【{name}】重複 — 合成/分解可能",
    noDupDismantle: "分解する重複なし (SSR除外)", soulGained: "🔮 +{soul} ソウル! · {count}枚分解",
    highTierClaim: "✨ 高レア獲得! オフライン・デイリー報酬も回収を",
    exArrival: "🌌 超越英雄降臨!", urArrival: "🌀 伝説+英雄が合流", ssrArrival: "✨ 伝説の英雄が軍団に合流",
    exTreasure: "🌌 この存在は軍団の至宝。大切に育てて。", urTreasure: "🌀 運命の結び目が結ばれた。このユニットは只者ではない。",
    featuredGot: " — ✨{pickup} 獲得!",
    fbBannerTitle: "🎯 限定バナー · {name}", fbDaysLeft: "⏳ 残り{d}日", fbPickup: "ピックアップSSR {pickup} 確率UP · 90連天井確定",
    fbSparkReady: " — 次のSSR {pickup} 確定!", fbPullBtn: "🎯 限定10連 · 💎{cost}",
    lossGap: "⚠️ 逃せばMY Legionに永久の空白。次の機会は数週間後。",
    gachaPityNote: "🎯 天井 {p}/12 · {rates} | hard12=SSR保証", dupeBadge: "重複",
    dalioWindow: "⏳ 今が好機... 天井 {p}/12。軍団はあと一歩。逃せば永遠の空白。今こそ掴め。",
    shareSSRText: "MY Legion SSR獲得! 一緒に征服しよう", sharePrestigeText: "転生完了 — 無限成長スタート！一緒に征服しよう", shareBossText: "ボス撃破！MY Legionで一緒に征服", arclightFomo: "72h Arclight — 今か二度とないか。MY Pantheon judgment.",
    gearScrapConfirm: "{r}装備を分解しますか? +{gold}ゴールド",
  },
  zh: {
    originFlav0: "代达罗斯核心档案残片", originFlav1: "机密判断日志恢复", originFlav2: "沉默时代的传输信号", originFlav3: "解密: Founding 协议", originFlav4: "废墟残骸中捕获信号", originFlav5: "意识碎片解读完成",
    originReveal: "🔓 {f} — {name} 起源已确认。(Legion Chronicles 内 虚构)",
    originDropTail: " 📡 错过下个限定机会将有永久空缺风险。 ", originRatesCheck: "📊 查看概率",
    gachaGet: "🎉 获得【{name}】!", gachaDup: "🔄 【{name}】重复 — 可合成/分解",
    noDupDismantle: "无可分解的重复 (SSR除外)", soulGained: "🔮 +{soul} 灵魂! · 分解{count}张",
    highTierClaim: "✨ 抽到高稀有! 也别忘了离线·每日奖励",
    exArrival: "🌌 超越英雄降临!", urArrival: "🌀 传说+英雄加入", ssrArrival: "✨ 传说英雄加入军团",
    exTreasure: "🌌 此存在是军团的绝对至宝。请珍惜培养。", urTreasure: "🌀 命运之结已缔结。此单位非同寻常。",
    featuredGot: " — ✨获得{pickup}!",
    fbBannerTitle: "🎯 限定横幅 · {name}", fbDaysLeft: "⏳ 限{d}天", fbPickup: "UP限定SSR {pickup} · 90抽保底必得",
    fbSparkReady: " — 下个SSR {pickup} 必得!", fbPullBtn: "🎯 限定十连 · 💎{cost}",
    lossGap: "⚠️ 错过则MY Legion永久空缺。下次机会数周后。",
    gachaPityNote: "🎯 保底 {p}/12 · {rates} | hard12=SSR保证", dupeBadge: "重复",
    dalioWindow: "⏳ 机会就在此刻... 保底 {p}/12。军团近在咫尺。错过便是永远的空缺。趁现在。",
    shareSSRText: "MY Legion SSR获得! 一起征服", sharePrestigeText: "转生完成 — 无限成长开始！一起征服", shareBossText: "击败Boss！用MY Legion一起征服", arclightFomo: "72h Arclight — 现在或永不。MY Pantheon judgment.",
    gearScrapConfirm: "分解此{r}装备? +{gold}金币",
  },
  hi: {
    originFlav0: "डेडलस कोर आर्काइव अंश", originFlav1: "गोपनीय निर्णय लॉग बरामद", originFlav2: "मौन युग का प्रसारण संकेत", originFlav3: "अवर्गीकृत: Founding प्रोटोकॉल", originFlav4: "खंडहर में संकेत पकड़ा", originFlav5: "चेतना खंड डिकोड",
    originReveal: "🔓 {f} — {name} की उत्पत्ति पुष्टि। (Legion Chronicles में काल्पनिक)",
    originDropTail: " 📡 अगला लिमिटेड मौका चूके तो स्थायी कमी का जोखिम। ", originRatesCheck: "📊 दरें देखें",
    gachaGet: "🎉 【{name}】 मिला!", gachaDup: "🔄 【{name}】 डुप्लीकेट — फ्यूज/तोड़ें",
    noDupDismantle: "तोड़ने को डुप्लीकेट नहीं (SSR छोड़कर)", soulGained: "🔮 +{soul} आत्मा! · {count} तोड़े",
    highTierClaim: "✨ हाई टियर मिला! ऑफलाइन·डेली इनाम भी लें",
    exArrival: "🌌 पारलौकिक हीरो अवतरित!", urArrival: "🌀 लीजेंड+ हीरो शामिल", ssrArrival: "✨ पौराणिक हीरो लीजन में शामिल",
    exTreasure: "🌌 यह अस्तित्व लीजन का परम खजाना। संभालकर पालें।", urTreasure: "🌀 भाग्य की गाँठ बंधी। यह यूनिट साधारण नहीं।",
    featuredGot: " — ✨{pickup} मिला!",
    fbBannerTitle: "🎯 लिमिटेड बैनर · {name}", fbDaysLeft: "⏳ {d} दिन बाकी", fbPickup: "रेट-अप SSR {pickup} · 90 पुल पर गारंटी",
    fbSparkReady: " — अगला SSR {pickup} गारंटी!", fbPullBtn: "🎯 लिमिटेड 10x · 💎{cost}",
    lossGap: "⚠️ चूके तो MY Legion स्थायी रूप से अधूरा। अगला मौका हफ्तों बाद।",
    gachaPityNote: "🎯 पिटी {p}/12 · {rates} | hard12=SSR गारंटी", dupeBadge: "डुप्लि",
    dalioWindow: "⏳ यही पल है... पिटी {p}/12। लीजन बस एक पुल दूर। चूके तो कमी हमेशा रहेगी। अभी पकड़ो।",
    shareSSRText: "MY Legion SSR मिला! साथ जीतें", sharePrestigeText: "प्रेस्टीज पूरा — अनंत विकास शुरू! साथ जीतें", shareBossText: "बॉस हराया! MY Legion के साथ जीतें", arclightFomo: "72h Arclight — अभी या कभी नहीं। MY Pantheon judgment.",
    gearScrapConfirm: "यह {r} गियर तोड़ें? +{gold} गोल्ड",
  },
  ru: {
    originFlav0: "Фрагмент архива Ядра Дедала", originFlav1: "Восстановлен секретный лог решений", originFlav2: "Сигнал из Эпохи Молчания", originFlav3: "Рассекречено: протокол Основания", originFlav4: "Сигнал пойман в руинах", originFlav5: "Осколок сознания расшифрован",
    originReveal: "🔓 {f} — происхождение {name} подтверждено. (вымысел, в Legion Chronicles)",
    originDropTail: " 📡 Упустишь следующий лимитный шанс — рискуешь навсегда остаться с пробелом. ", originRatesCheck: "📊 Проверить шансы",
    gachaGet: "🎉 【{name}】 получен!", gachaDup: "🔄 【{name}】 дубликат — синтез/разбор",
    noDupDismantle: "Нет дубликатов для разбора (кроме SSR)", soulGained: "🔮 +{soul} душ! · разобрано {count}",
    highTierClaim: "✨ Выпал высокий ранг! Забери и офлайн·ежедневные награды",
    exArrival: "🌌 Явился запредельный герой!", urArrival: "🌀 Легенда+ герой присоединился", ssrArrival: "✨ Легендарный герой вступил в легион",
    exTreasure: "🌌 Это существо — абсолютное сокровище легиона. Расти его бережно.", urTreasure: "🌀 Завязан узел судьбы. Этот юнит не из обычных.",
    featuredGot: " — ✨{pickup} получен!",
    fbBannerTitle: "🎯 Лимитный баннер · {name}", fbDaysLeft: "⏳ осталось {d}д", fbPickup: "Повышенный шанс SSR {pickup} · гарантия на 90 круток",
    fbSparkReady: " — следующий SSR {pickup} гарантирован!", fbPullBtn: "🎯 Лимитные 10 · 💎{cost}",
    lossGap: "⚠️ Упустишь — MY Legion навсегда с пробелом. Следующий шанс через недели.",
    gachaPityNote: "🎯 Гарант {p}/12 · {rates} | hard12=SSR гарантирован", dupeBadge: "дубль",
    dalioWindow: "⏳ Момент настал... гарант {p}/12. Легион в одном шаге. Упустишь — пробел навсегда. Хватай сейчас.",
    shareSSRText: "MY Legion SSR добыт! Покоряем вместе", sharePrestigeText: "Возрождение завершено — бесконечный рост! Покоряем вместе", shareBossText: "Босс повержен! Покоряем с MY Legion", arclightFomo: "72h Arclight — сейчас или никогда. MY Pantheon judgment.",
    gearScrapConfirm: "Разобрать {r}-снаряжение? +{gold} золота",
  },
};
for (const l in GACHA_I18N) Object.assign(I18N[l], GACHA_I18N[l]);

// ⚔️ 그룹2·3 — SSR/보스 스킬명·설명 + 보스/적 표시명 + 유닛명 (6언어)
const SKILL_I18N = {
  ko: {
    uName_drone: "드론", uName_marksman: "사수", uName_guardian: "가디언", uName_bruiser: "돌격봇", uName_commander: "지휘관", uName_titan: "타이탄",
    bskBeam: "☄️ 멸절의 빔", bskWrath: "🔥 광란의 진노", bskWall: "🛡️ 절대 방벽", bskGravity: "🌀 중력 붕괴", bskCorrosion: "💥 부식 충격파", bskDrain: "🩸 부식 흡혈", bskSmash: "⚔️ 강타",
    ssrNJudgment: "⚖️ 심판의 일제사", ssrNRenewal: "🌊 재생의 물결", ssrNDecrypt: "🔭 정밀 해독", ssrNFrenzy: "🔥 광란의 폭주", ssrNRally: "↯ 동시 지휘", ssrNSwarm: "🐝 군집 분열", ssrNBulwark: "🛡️ 수호의 방벽", ssrNForge: "🔨 건설 프로토콜", ssrNCommand: "👑 군단의 호령",
    ssrDJudgment: "⚖️ <b>심판의 일제사</b>: 강적 3체에 천공 강타 + 전군 치명타 +15%", ssrDRenewal: "🌊 <b>재생의 물결</b>: 약한 아군 3체 HP 25% 대회복 + 전군 8% 회복", ssrDDecrypt: "🔭 <b>정밀 해독</b>: 단일 적 약점노출 240% 강타·둔화 + 아군 치명 +25%", ssrDFrenzy: "🔥 <b>광란의 폭주</b>: 주변 적 화염 AOE + 자신 공격+60%·속도+40%", ssrDRally: "↯ <b>동시 지휘</b>: 아군 3체 즉시 돌격 + 공격·속도 버프", ssrDSwarm: "🐝 <b>군집 분열</b>: 최근접 적에 벌떼 5연타 폭격", ssrDBulwark: "🛡️ <b>수호의 방벽</b>: 전군에 보호막 부여(피해 절반)", ssrDForge: "🔨 <b>건설 프로토콜</b>: 망치 200% 강타 + 광역 둔화 + 팀 10% 재생", ssrDCommand: "👑 <b>군단의 호령</b>: 전군 공격 +50%·속도 +40% 대버프",
    ssrUniqueLabel: "(고유 액티브)", ssrSkillTitle: "🌟 SSR 스킬", ssrCmdPassive: "🛡️ <b>지휘</b>(패시브): 편성한 SSR+ 1체당 전군 공격·체력 +2% (최대 +10%)", srSkillTitle: "✦ SR 스킬", srPrecisionPassive: "🎯 <b>정밀</b>(패시브): 편성한 SR 1체당 전군 치명타 +1.5% (최대 +9%)",
    bnCorruptedTitan: "타락 거신", bnCorruptedAbyss: "타락 심연", bnFinalJudge: "종말의 심판자", bnFinalTitan: "최종형 거신", bnEnhancedTitan: "강화 거신",
    enWeakBoss: "약화 보스", enStrongBoss: "강화 보스", enFinalBoss: "최종 보스", enBossNamed: "보스 {name}", enLegendSuffix: " (전설)", enCorruptedNamed: "타락 {name}", enScout: "적 정찰기", enSniper: "적 저격수", enWraithNamed: "망령 {name}", enShadowCmd: "그림자 지휘", enCorruptedWall: "타락 방벽", enEnemyAssault: "적 강습",
  },
  en: {
    uName_drone: "Drone", uName_marksman: "Marksman", uName_guardian: "Guardian", uName_bruiser: "Bruiser", uName_commander: "Commander", uName_titan: "Titan",
    bskBeam: "☄️ Annihilation Beam", bskWrath: "🔥 Frenzied Wrath", bskWall: "🛡️ Absolute Wall", bskGravity: "🌀 Gravity Collapse", bskCorrosion: "💥 Corrosion Shockwave", bskDrain: "🩸 Corrosive Drain", bskSmash: "⚔️ Smash",
    ssrNJudgment: "⚖️ Judgment Volley", ssrNRenewal: "🌊 Wave of Renewal", ssrNDecrypt: "🔭 Precision Decrypt", ssrNFrenzy: "🔥 Frenzy Rush", ssrNRally: "↯ Simultaneous Command", ssrNSwarm: "🐝 Swarm Split", ssrNBulwark: "🛡️ Guardian Wall", ssrNForge: "🔨 Forge Protocol", ssrNCommand: "👑 Legion's Call",
    ssrDJudgment: "⚖️ <b>Judgment Volley</b>: sky-strike 3 strongest foes + all-crit +15%", ssrDRenewal: "🌊 <b>Wave of Renewal</b>: heal 3 weak allies 25% HP + all 8%", ssrDDecrypt: "🔭 <b>Precision Decrypt</b>: expose 1 foe 240% strike·slow + allies crit +25%", ssrDFrenzy: "🔥 <b>Frenzy Rush</b>: fire AOE nearby + self ATK+60%·SPD+40%", ssrDRally: "↯ <b>Simultaneous Command</b>: 3 allies charge + ATK·SPD buff", ssrDSwarm: "🐝 <b>Swarm Split</b>: 5-hit swarm barrage on nearest foe", ssrDBulwark: "🛡️ <b>Guardian Wall</b>: barrier to all (halves damage)", ssrDForge: "🔨 <b>Forge Protocol</b>: hammer 200% strike + area slow + team 10% regen", ssrDCommand: "👑 <b>Legion's Call</b>: all-army ATK +50%·SPD +40% buff",
    ssrUniqueLabel: "(unique active)", ssrSkillTitle: "🌟 SSR Skill", ssrCmdPassive: "🛡️ <b>Command</b> (passive): each deployed SSR+ gives all-army ATK·HP +2% (max +10%)", srSkillTitle: "✦ SR Skill", srPrecisionPassive: "🎯 <b>Precision</b> (passive): each deployed SR gives all-army crit +1.5% (max +9%)",
    bnCorruptedTitan: "Corrupted Titan", bnCorruptedAbyss: "Corrupted Abyss", bnFinalJudge: "Doomsday Judge", bnFinalTitan: "Final Titan", bnEnhancedTitan: "Enhanced Titan",
    enWeakBoss: "Weakened Boss", enStrongBoss: "Enhanced Boss", enFinalBoss: "Final Boss", enBossNamed: "Boss {name}", enLegendSuffix: " (Legendary)", enCorruptedNamed: "Corrupted {name}", enScout: "Enemy Scout", enSniper: "Enemy Sniper", enWraithNamed: "Wraith {name}", enShadowCmd: "Shadow Commander", enCorruptedWall: "Corrupted Wall", enEnemyAssault: "Enemy Assault",
  },
  ja: {
    uName_drone: "ドローン", uName_marksman: "射手", uName_guardian: "ガーディアン", uName_bruiser: "突撃兵", uName_commander: "指揮官", uName_titan: "タイタン",
    bskBeam: "☄️ 殲滅のビーム", bskWrath: "🔥 狂乱の憤怒", bskWall: "🛡️ 絶対防壁", bskGravity: "🌀 重力崩壊", bskCorrosion: "💥 腐食衝撃波", bskDrain: "🩸 腐食吸血", bskSmash: "⚔️ 強打",
    ssrNJudgment: "⚖️ 審判の一斉射", ssrNRenewal: "🌊 再生の波", ssrNDecrypt: "🔭 精密解読", ssrNFrenzy: "🔥 狂乱の暴走", ssrNRally: "↯ 同時指揮", ssrNSwarm: "🐝 群集分裂", ssrNBulwark: "🛡️ 守護の防壁", ssrNForge: "🔨 建設プロトコル", ssrNCommand: "👑 軍団の号令",
    ssrDJudgment: "⚖️ <b>審判の一斉射</b>: 強敵3体に天空強打 + 全軍クリ+15%", ssrDRenewal: "🌊 <b>再生の波</b>: 弱い味方3体HP25%大回復 + 全軍8%回復", ssrDDecrypt: "🔭 <b>精密解読</b>: 単体弱点露出240%強打·鈍化 + 味方クリ+25%", ssrDFrenzy: "🔥 <b>狂乱の暴走</b>: 周囲に炎AOE + 自身攻+60%·速+40%", ssrDRally: "↯ <b>同時指揮</b>: 味方3体即突撃 + 攻·速バフ", ssrDSwarm: "🐝 <b>群集分裂</b>: 最近接に群れ5連打爆撃", ssrDBulwark: "🛡️ <b>守護の防壁</b>: 全軍に防壁付与(被害半減)", ssrDForge: "🔨 <b>建設プロトコル</b>: ハンマー200%強打 + 範囲鈍化 + チーム10%回復", ssrDCommand: "👑 <b>軍団の号令</b>: 全軍攻+50%·速+40%大バフ",
    ssrUniqueLabel: "(固有アクティブ)", ssrSkillTitle: "🌟 SSRスキル", ssrCmdPassive: "🛡️ <b>指揮</b>(パッシブ): 編成SSR+1体ごとに全軍攻·HP+2% (最大+10%)", srSkillTitle: "✦ SRスキル", srPrecisionPassive: "🎯 <b>精密</b>(パッシブ): 編成SR1体ごとに全軍クリ+1.5% (最大+9%)",
    bnCorruptedTitan: "堕落の巨神", bnCorruptedAbyss: "堕落の深淵", bnFinalJudge: "終末の審判者", bnFinalTitan: "最終形巨神", bnEnhancedTitan: "強化巨神",
    enWeakBoss: "弱体ボス", enStrongBoss: "強化ボス", enFinalBoss: "最終ボス", enBossNamed: "ボス {name}", enLegendSuffix: " (伝説)", enCorruptedNamed: "堕落 {name}", enScout: "敵偵察機", enSniper: "敵狙撃兵", enWraithNamed: "亡霊 {name}", enShadowCmd: "影の指揮", enCorruptedWall: "堕落の防壁", enEnemyAssault: "敵強襲",
  },
  zh: {
    uName_drone: "无人机", uName_marksman: "射手", uName_guardian: "守卫", uName_bruiser: "突击兵", uName_commander: "指挥官", uName_titan: "泰坦",
    bskBeam: "☄️ 歼灭光束", bskWrath: "🔥 狂乱之怒", bskWall: "🛡️ 绝对壁垒", bskGravity: "🌀 重力崩塌", bskCorrosion: "💥 腐蚀冲击波", bskDrain: "🩸 腐蚀吸血", bskSmash: "⚔️ 强击",
    ssrNJudgment: "⚖️ 审判齐射", ssrNRenewal: "🌊 再生之波", ssrNDecrypt: "🔭 精密解读", ssrNFrenzy: "🔥 狂乱暴走", ssrNRally: "↯ 同步指挥", ssrNSwarm: "🐝 群集分裂", ssrNBulwark: "🛡️ 守护壁垒", ssrNForge: "🔨 建造协议", ssrNCommand: "👑 军团号令",
    ssrDJudgment: "⚖️ <b>审判齐射</b>: 对3名强敌天空强击 + 全军暴击+15%", ssrDRenewal: "🌊 <b>再生之波</b>: 3名弱队友回复25%HP + 全军8%回复", ssrDDecrypt: "🔭 <b>精密解读</b>: 单体弱点暴露240%强击·减速 + 队友暴击+25%", ssrDFrenzy: "🔥 <b>狂乱暴走</b>: 周围火焰AOE + 自身攻+60%·速+40%", ssrDRally: "↯ <b>同步指挥</b>: 3队友立即冲锋 + 攻·速增益", ssrDSwarm: "🐝 <b>群集分裂</b>: 对最近敌蜂群5连击轰炸", ssrDBulwark: "🛡️ <b>守护壁垒</b>: 给全军护盾(伤害减半)", ssrDForge: "🔨 <b>建造协议</b>: 铁锤200%强击 + 范围减速 + 团队10%回复", ssrDCommand: "👑 <b>军团号令</b>: 全军攻+50%·速+40%大增益",
    ssrUniqueLabel: "(专属主动)", ssrSkillTitle: "🌟 SSR技能", ssrCmdPassive: "🛡️ <b>指挥</b>(被动): 每个编成SSR+使全军攻·血+2% (最高+10%)", srSkillTitle: "✦ SR技能", srPrecisionPassive: "🎯 <b>精密</b>(被动): 每个编成SR使全军暴击+1.5% (最高+9%)",
    bnCorruptedTitan: "堕落巨神", bnCorruptedAbyss: "堕落深渊", bnFinalJudge: "终末审判者", bnFinalTitan: "最终形巨神", bnEnhancedTitan: "强化巨神",
    enWeakBoss: "弱化首领", enStrongBoss: "强化首领", enFinalBoss: "最终首领", enBossNamed: "首领 {name}", enLegendSuffix: " (传说)", enCorruptedNamed: "堕落 {name}", enScout: "敌方侦察机", enSniper: "敌方狙击手", enWraithNamed: "亡灵 {name}", enShadowCmd: "暗影指挥", enCorruptedWall: "堕落壁垒", enEnemyAssault: "敌方突袭",
  },
  hi: {
    uName_drone: "ड्रोन", uName_marksman: "निशानेबाज़", uName_guardian: "रक्षक", uName_bruiser: "ब्रूज़र", uName_commander: "कमांडर", uName_titan: "टाइटन",
    bskBeam: "☄️ विनाश किरण", bskWrath: "🔥 उन्मादी क्रोध", bskWall: "🛡️ परम दीवार", bskGravity: "🌀 गुरुत्व पतन", bskCorrosion: "💥 क्षरण शॉकवेव", bskDrain: "🩸 क्षरण चूषण", bskSmash: "⚔️ प्रहार",
    ssrNJudgment: "⚖️ न्याय वॉली", ssrNRenewal: "🌊 पुनर्जनन लहर", ssrNDecrypt: "🔭 सटीक डिक्रिप्ट", ssrNFrenzy: "🔥 उन्माद दौड़", ssrNRally: "↯ एक साथ कमान", ssrNSwarm: "🐝 झुंड विभाजन", ssrNBulwark: "🛡️ रक्षक दीवार", ssrNForge: "🔨 निर्माण प्रोटोकॉल", ssrNCommand: "👑 लीजन का आह्वान",
    ssrDJudgment: "⚖️ <b>न्याय वॉली</b>: 3 प्रबल शत्रु पर आकाश-प्रहार + पूरी सेना क्रिट +15%", ssrDRenewal: "🌊 <b>पुनर्जनन लहर</b>: 3 कमजोर साथी 25% HP + पूरी सेना 8% हील", ssrDDecrypt: "🔭 <b>सटीक डिक्रिप्ट</b>: 1 शत्रु 240% प्रहार·मंद + साथी क्रिट +25%", ssrDFrenzy: "🔥 <b>उन्माद दौड़</b>: पास आग AOE + स्वयं ATK+60%·SPD+40%", ssrDRally: "↯ <b>एक साथ कमान</b>: 3 साथी तुरंत धावा + ATK·SPD बफ", ssrDSwarm: "🐝 <b>झुंड विभाजन</b>: निकटतम शत्रु पर 5-हिट झुंड बमबारी", ssrDBulwark: "🛡️ <b>रक्षक दीवार</b>: पूरी सेना को ढाल (आधा नुकसान)", ssrDForge: "🔨 <b>निर्माण प्रोटोकॉल</b>: हथौड़ा 200% प्रहार + क्षेत्र मंद + टीम 10% रिजेन", ssrDCommand: "👑 <b>लीजन का आह्वान</b>: पूरी सेना ATK +50%·SPD +40% बफ",
    ssrUniqueLabel: "(विशेष एक्टिव)", ssrSkillTitle: "🌟 SSR स्किल", ssrCmdPassive: "🛡️ <b>कमान</b>(पैसिव): हर तैनात SSR+ से पूरी सेना ATK·HP +2% (अधिकतम +10%)", srSkillTitle: "✦ SR स्किल", srPrecisionPassive: "🎯 <b>सटीकता</b>(पैसिव): हर तैनात SR से पूरी सेना क्रिट +1.5% (अधिकतम +9%)",
    bnCorruptedTitan: "भ्रष्ट टाइटन", bnCorruptedAbyss: "भ्रष्ट अतल", bnFinalJudge: "प्रलय न्यायाधीश", bnFinalTitan: "अंतिम टाइटन", bnEnhancedTitan: "उन्नत टाइटन",
    enWeakBoss: "कमजोर बॉस", enStrongBoss: "उन्नत बॉस", enFinalBoss: "अंतिम बॉस", enBossNamed: "बॉस {name}", enLegendSuffix: " (पौराणिक)", enCorruptedNamed: "भ्रष्ट {name}", enScout: "शत्रु स्काउट", enSniper: "शत्रु स्नाइपर", enWraithNamed: "प्रेत {name}", enShadowCmd: "छाया कमांडर", enCorruptedWall: "भ्रष्ट दीवार", enEnemyAssault: "शत्रु हमला",
  },
  ru: {
    uName_drone: "Дрон", uName_marksman: "Стрелок", uName_guardian: "Страж", uName_bruiser: "Боец", uName_commander: "Командир", uName_titan: "Титан",
    bskBeam: "☄️ Луч аннигиляции", bskWrath: "🔥 Яростный гнев", bskWall: "🛡️ Абсолютная стена", bskGravity: "🌀 Гравитационный коллапс", bskCorrosion: "💥 Волна коррозии", bskDrain: "🩸 Едкое высасывание", bskSmash: "⚔️ Удар",
    ssrNJudgment: "⚖️ Залп правосудия", ssrNRenewal: "🌊 Волна обновления", ssrNDecrypt: "🔭 Точная расшифровка", ssrNFrenzy: "🔥 Яростный рывок", ssrNRally: "↯ Единый приказ", ssrNSwarm: "🐝 Роевое дробление", ssrNBulwark: "🛡️ Стена стража", ssrNForge: "🔨 Протокол ковки", ssrNCommand: "👑 Зов легиона",
    ssrDJudgment: "⚖️ <b>Залп правосудия</b>: небесный удар по 3 сильнейшим + всем крит +15%", ssrDRenewal: "🌊 <b>Волна обновления</b>: лечит 3 слабых союзников 25% HP + всем 8%", ssrDDecrypt: "🔭 <b>Точная расшифровка</b>: уязвимость 1 врага 240% удар·замедление + союзникам крит +25%", ssrDFrenzy: "🔥 <b>Яростный рывок</b>: огненный AOE вокруг + себе ATK+60%·SPD+40%", ssrDRally: "↯ <b>Единый приказ</b>: 3 союзника в рывок + бафф ATK·SPD", ssrDSwarm: "🐝 <b>Роевое дробление</b>: 5-кратный рой по ближайшему врагу", ssrDBulwark: "🛡️ <b>Стена стража</b>: щит всем (урон вдвое меньше)", ssrDForge: "🔨 <b>Протокол ковки</b>: молот 200% удар + замедление зоны + команде 10% реген", ssrDCommand: "👑 <b>Зов легиона</b>: всей армии ATK +50%·SPD +40% бафф",
    ssrUniqueLabel: "(уникальный актив)", ssrSkillTitle: "🌟 Навык SSR", ssrCmdPassive: "🛡️ <b>Командование</b> (пассив): каждый выставленный SSR+ даёт всей армии ATK·HP +2% (макс +10%)", srSkillTitle: "✦ Навык SR", srPrecisionPassive: "🎯 <b>Точность</b> (пассив): каждый выставленный SR даёт всей армии крит +1.5% (макс +9%)",
    bnCorruptedTitan: "Падший титан", bnCorruptedAbyss: "Падшая бездна", bnFinalJudge: "Судья конца", bnFinalTitan: "Финальный титан", bnEnhancedTitan: "Усиленный титан",
    enWeakBoss: "Ослабленный босс", enStrongBoss: "Усиленный босс", enFinalBoss: "Финальный босс", enBossNamed: "Босс {name}", enLegendSuffix: " (легендарный)", enCorruptedNamed: "Падший {name}", enScout: "Вражеский разведчик", enSniper: "Вражеский снайпер", enWraithNamed: "Призрак {name}", enShadowCmd: "Теневой командир", enCorruptedWall: "Падшая стена", enEnemyAssault: "Вражеский штурм",
  },
};
for (const l in SKILL_I18N) Object.assign(I18N[l], SKILL_I18N[l]);

// 🔗 그룹5 — 영웅 패시브 + 버프 텍스트 + 시너지/조합 칩 (6언어). 진영명(Executor/Strategist 등)은 유지.
const SYN_I18N = {
  ko: {
    hpvStrategist: "전군 AI +{ai} · 집중사격 (치명타 확률 +{crit}%)", hpvBerserker: "광폭화: 피해 입을 때마다 공격 +{atk}% (스택, 최대 50%)", hpvWarden: "철벽: 전군 피해 감소 {red}% · 진입 시 보호막", hpvRanger: "정밀 사격: 원거리 유닛 관통 +{pierce}% · 다중 타격 확률", hpvMech: "기계화: 중형 유닛 HP +{hp}% + 반격 피해", hpvEngineer: "수리 프로토콜: 전군 재생 +{regen}/s · 과부하(공속)", hpvDragoon: "용의 권능: 전군 +{all}% · 궁극기 위력 대폭 증가",
    btAllAtk: "전군 공격 +{n}%", btAllHp: "전군 체력 +{n}%", btTypeAtk: "{name} 공격 +{n}%", btTypeHp: "{name} 체력 +{n}%", btRegen: "전군 재생 +{n}/s", btAiBonus: "전군 지능 +{n}", btCrit: "치명타 +{n}%", btPierce: "관통 +{n}%", btDmgRed: "피해감소 {n}%", btReflect: "반격 {n}%", btHaste: "공속 +{n}%", btUltPower: "궁극기 위력 +{n}%",
    synExecutor: "{ic} {f} ×{n} 공속+{m}%", synStrategist: "{ic} {f} ×{n} 치명+{m}%", synSwarm: "{ic} {f} ×{n} 공격+{m}%", synGuardianShield: "{ic} {f} ×{n} 체력+{m}% +시작실드", synGuardian: "{ic} {f} ×{n} 체력+{m}%", synIntel: "{ic} {f} ×{n} 치명피해+{m}%", synDiversity: "🔀 다양성 ×{n} 전군+{m}%", synSrPrecision: "✦ SR 정밀 ×{n} 치명+{c}%", synSsrCommand: "🌟 SSR 지휘 ×{n} 공·체+{m}%", synSsrOpen: "⚡ SSR 개전 가속 — 시작 {t}초 공격+{m}%·실드", synCollect: "📋 수집 +{n}% 영구",
    fxCrit: "치명", fxSpd: "공속", fxAtk: "공", fxHp: "체", fxShieldSuffix: " +실드", fxCritDmg: "치명피해", synMax: "★ MAX", synOneMore: "1명 더 → {label}+{v}%", synNeedMore: "{k}명 더 → {label}+{v}%", divAllN: "전군+{n}%", divNeed: "{k}종 더 → +{n}%", comboDeployed: "편성 {n}체",
  },
  en: {
    hpvStrategist: "All-army AI +{ai} · Focus Fire (crit chance +{crit}%)", hpvBerserker: "Berserk: ATK +{atk}% each time hit (stacks, max 50%)", hpvWarden: "Iron Wall: all-army damage taken -{red}% · barrier on entry", hpvRanger: "Precision Fire: ranged pierce +{pierce}% · multi-hit chance", hpvMech: "Mechanize: medium unit HP +{hp}% + counter damage", hpvEngineer: "Repair Protocol: all-army regen +{regen}/s · overclock (atk spd)", hpvDragoon: "Dragon's Might: all-army +{all}% · ult power greatly boosted",
    btAllAtk: "All ATK +{n}%", btAllHp: "All HP +{n}%", btTypeAtk: "{name} ATK +{n}%", btTypeHp: "{name} HP +{n}%", btRegen: "All regen +{n}/s", btAiBonus: "All AI +{n}", btCrit: "Crit +{n}%", btPierce: "Pierce +{n}%", btDmgRed: "Dmg reduction {n}%", btReflect: "Reflect {n}%", btHaste: "Atk spd +{n}%", btUltPower: "Ult power +{n}%",
    synExecutor: "{ic} {f} ×{n} atk spd+{m}%", synStrategist: "{ic} {f} ×{n} crit+{m}%", synSwarm: "{ic} {f} ×{n} ATK+{m}%", synGuardianShield: "{ic} {f} ×{n} HP+{m}% +start shield", synGuardian: "{ic} {f} ×{n} HP+{m}%", synIntel: "{ic} {f} ×{n} crit dmg+{m}%", synDiversity: "🔀 Diversity ×{n} all+{m}%", synSrPrecision: "✦ SR Precision ×{n} crit+{c}%", synSsrCommand: "🌟 SSR Command ×{n} ATK·HP+{m}%", synSsrOpen: "⚡ SSR Opening Rush — first {t}s ATK+{m}%·shield", synCollect: "📋 Collection +{n}% permanent",
    fxCrit: "Crit", fxSpd: "Atk spd", fxAtk: "ATK", fxHp: "HP", fxShieldSuffix: " +shield", fxCritDmg: "Crit dmg", synMax: "★ MAX", synOneMore: "1 more → {label}+{v}%", synNeedMore: "{k} more → {label}+{v}%", divAllN: "all+{n}%", divNeed: "{k} more types → +{n}%", comboDeployed: "Deployed {n}",
  },
  ja: {
    hpvStrategist: "全軍AI +{ai} · 集中砲火 (クリ率 +{crit}%)", hpvBerserker: "狂暴化: 被弾ごとに攻撃 +{atk}% (スタック, 最大50%)", hpvWarden: "鉄壁: 全軍被ダメ -{red}% · 出撃時バリア", hpvRanger: "精密射撃: 遠距離貫通 +{pierce}% · 多段ヒット確率", hpvMech: "機械化: 中型ユニットHP +{hp}% + 反撃ダメージ", hpvEngineer: "修理プロトコル: 全軍再生 +{regen}/s · オーバークロック(攻速)", hpvDragoon: "竜の権能: 全軍 +{all}% · 奥義威力大幅UP",
    btAllAtk: "全軍攻撃 +{n}%", btAllHp: "全軍HP +{n}%", btTypeAtk: "{name} 攻撃 +{n}%", btTypeHp: "{name} HP +{n}%", btRegen: "全軍再生 +{n}/s", btAiBonus: "全軍知能 +{n}", btCrit: "クリ +{n}%", btPierce: "貫通 +{n}%", btDmgRed: "被ダメ減 {n}%", btReflect: "反撃 {n}%", btHaste: "攻速 +{n}%", btUltPower: "奥義威力 +{n}%",
    synExecutor: "{ic} {f} ×{n} 攻速+{m}%", synStrategist: "{ic} {f} ×{n} クリ+{m}%", synSwarm: "{ic} {f} ×{n} 攻撃+{m}%", synGuardianShield: "{ic} {f} ×{n} HP+{m}% +開始シールド", synGuardian: "{ic} {f} ×{n} HP+{m}%", synIntel: "{ic} {f} ×{n} クリダメ+{m}%", synDiversity: "🔀 多様性 ×{n} 全軍+{m}%", synSrPrecision: "✦ SR精密 ×{n} クリ+{c}%", synSsrCommand: "🌟 SSR指揮 ×{n} 攻·HP+{m}%", synSsrOpen: "⚡ SSR開戦加速 — 開始{t}秒 攻撃+{m}%·シールド", synCollect: "📋 収集 +{n}% 永久",
    fxCrit: "クリ", fxSpd: "攻速", fxAtk: "攻", fxHp: "HP", fxShieldSuffix: " +シールド", fxCritDmg: "クリダメ", synMax: "★ MAX", synOneMore: "あと1体 → {label}+{v}%", synNeedMore: "あと{k}体 → {label}+{v}%", divAllN: "全軍+{n}%", divNeed: "あと{k}種 → +{n}%", comboDeployed: "編成 {n}体",
  },
  zh: {
    hpvStrategist: "全军AI +{ai} · 集火 (暴击率 +{crit}%)", hpvBerserker: "狂暴: 每次受击攻击 +{atk}% (叠加, 最高50%)", hpvWarden: "铁壁: 全军受伤 -{red}% · 入场护盾", hpvRanger: "精准射击: 远程穿透 +{pierce}% · 多重打击几率", hpvMech: "机械化: 中型单位HP +{hp}% + 反击伤害", hpvEngineer: "维修协议: 全军回复 +{regen}/s · 超频(攻速)", hpvDragoon: "龙之权能: 全军 +{all}% · 必杀威力大幅提升",
    btAllAtk: "全军攻击 +{n}%", btAllHp: "全军血量 +{n}%", btTypeAtk: "{name} 攻击 +{n}%", btTypeHp: "{name} 血量 +{n}%", btRegen: "全军回复 +{n}/s", btAiBonus: "全军智能 +{n}", btCrit: "暴击 +{n}%", btPierce: "穿透 +{n}%", btDmgRed: "伤害减免 {n}%", btReflect: "反击 {n}%", btHaste: "攻速 +{n}%", btUltPower: "必杀威力 +{n}%",
    synExecutor: "{ic} {f} ×{n} 攻速+{m}%", synStrategist: "{ic} {f} ×{n} 暴击+{m}%", synSwarm: "{ic} {f} ×{n} 攻击+{m}%", synGuardianShield: "{ic} {f} ×{n} 血量+{m}% +起始护盾", synGuardian: "{ic} {f} ×{n} 血量+{m}%", synIntel: "{ic} {f} ×{n} 暴伤+{m}%", synDiversity: "🔀 多样性 ×{n} 全军+{m}%", synSrPrecision: "✦ SR精密 ×{n} 暴击+{c}%", synSsrCommand: "🌟 SSR指挥 ×{n} 攻·血+{m}%", synSsrOpen: "⚡ SSR开战加速 — 起始{t}秒 攻击+{m}%·护盾", synCollect: "📋 收集 +{n}% 永久",
    fxCrit: "暴击", fxSpd: "攻速", fxAtk: "攻", fxHp: "血", fxShieldSuffix: " +护盾", fxCritDmg: "暴伤", synMax: "★ MAX", synOneMore: "再1名 → {label}+{v}%", synNeedMore: "再{k}名 → {label}+{v}%", divAllN: "全军+{n}%", divNeed: "再{k}种 → +{n}%", comboDeployed: "编成 {n}",
  },
  hi: {
    hpvStrategist: "पूरी सेना AI +{ai} · केंद्रित फायर (क्रिट +{crit}%)", hpvBerserker: "उन्माद: हर चोट पर ATK +{atk}% (स्टैक, अधिकतम 50%)", hpvWarden: "लौह दीवार: पूरी सेना क्षति -{red}% · प्रवेश पर ढाल", hpvRanger: "सटीक फायर: रेंज्ड भेदन +{pierce}% · मल्टी-हिट मौका", hpvMech: "मशीनीकरण: मध्यम यूनिट HP +{hp}% + पलटवार क्षति", hpvEngineer: "मरम्मत प्रोटोकॉल: पूरी सेना रिजेन +{regen}/s · ओवरक्लॉक (ATK स्पीड)", hpvDragoon: "ड्रैगन शक्ति: पूरी सेना +{all}% · अल्टीमेट शक्ति भारी बढ़त",
    btAllAtk: "पूरी सेना ATK +{n}%", btAllHp: "पूरी सेना HP +{n}%", btTypeAtk: "{name} ATK +{n}%", btTypeHp: "{name} HP +{n}%", btRegen: "पूरी सेना रिजेन +{n}/s", btAiBonus: "पूरी सेना AI +{n}", btCrit: "क्रिट +{n}%", btPierce: "भेदन +{n}%", btDmgRed: "क्षति कमी {n}%", btReflect: "पलटवार {n}%", btHaste: "ATK स्पीड +{n}%", btUltPower: "अल्टी शक्ति +{n}%",
    synExecutor: "{ic} {f} ×{n} ATK स्पीड+{m}%", synStrategist: "{ic} {f} ×{n} क्रिट+{m}%", synSwarm: "{ic} {f} ×{n} ATK+{m}%", synGuardianShield: "{ic} {f} ×{n} HP+{m}% +शुरू ढाल", synGuardian: "{ic} {f} ×{n} HP+{m}%", synIntel: "{ic} {f} ×{n} क्रिट क्षति+{m}%", synDiversity: "🔀 विविधता ×{n} पूरी सेना+{m}%", synSrPrecision: "✦ SR सटीकता ×{n} क्रिट+{c}%", synSsrCommand: "🌟 SSR कमान ×{n} ATK·HP+{m}%", synSsrOpen: "⚡ SSR ओपनिंग रश — पहले {t}s ATK+{m}%·ढाल", synCollect: "📋 संग्रह +{n}% स्थायी",
    fxCrit: "क्रिट", fxSpd: "ATK स्पी", fxAtk: "ATK", fxHp: "HP", fxShieldSuffix: " +ढाल", fxCritDmg: "क्रिट क्षति", synMax: "★ MAX", synOneMore: "1 और → {label}+{v}%", synNeedMore: "{k} और → {label}+{v}%", divAllN: "पूरी सेना+{n}%", divNeed: "{k} और प्रकार → +{n}%", comboDeployed: "तैनात {n}",
  },
  ru: {
    hpvStrategist: "ИИ всей армии +{ai} · Сосредоточенный огонь (шанс крита +{crit}%)", hpvBerserker: "Берсерк: ATK +{atk}% за каждое попадание (стак, макс 50%)", hpvWarden: "Железная стена: урон по армии -{red}% · щит при входе", hpvRanger: "Точный огонь: пробитие дальнобойных +{pierce}% · шанс мультиудара", hpvMech: "Механизация: HP средних юнитов +{hp}% + урон контратаки", hpvEngineer: "Протокол ремонта: реген армии +{regen}/с · разгон (скор. атаки)", hpvDragoon: "Мощь дракона: вся армия +{all}% · сила ульты сильно повышена",
    btAllAtk: "Атака всех +{n}%", btAllHp: "HP всех +{n}%", btTypeAtk: "{name} атака +{n}%", btTypeHp: "{name} HP +{n}%", btRegen: "Реген всех +{n}/с", btAiBonus: "ИИ всех +{n}", btCrit: "Крит +{n}%", btPierce: "Пробитие +{n}%", btDmgRed: "Снижение урона {n}%", btReflect: "Отражение {n}%", btHaste: "Скор. атаки +{n}%", btUltPower: "Сила ульты +{n}%",
    synExecutor: "{ic} {f} ×{n} скор.атаки+{m}%", synStrategist: "{ic} {f} ×{n} крит+{m}%", synSwarm: "{ic} {f} ×{n} ATK+{m}%", synGuardianShield: "{ic} {f} ×{n} HP+{m}% +стартовый щит", synGuardian: "{ic} {f} ×{n} HP+{m}%", synIntel: "{ic} {f} ×{n} крит.урон+{m}%", synDiversity: "🔀 Разнообразие ×{n} всем+{m}%", synSrPrecision: "✦ SR Точность ×{n} крит+{c}%", synSsrCommand: "🌟 SSR Командование ×{n} ATK·HP+{m}%", synSsrOpen: "⚡ SSR Стартовый рывок — первые {t}с ATK+{m}%·щит", synCollect: "📋 Коллекция +{n}% навсегда",
    fxCrit: "Крит", fxSpd: "Ск.атк", fxAtk: "Атк", fxHp: "HP", fxShieldSuffix: " +щит", fxCritDmg: "Крит.урон", synMax: "★ MAX", synOneMore: "ещё 1 → {label}+{v}%", synNeedMore: "ещё {k} → {label}+{v}%", divAllN: "всем+{n}%", divNeed: "ещё {k} типов → +{n}%", comboDeployed: "выставлено {n}",
  },
};
for (const l in SYN_I18N) Object.assign(I18N[l], SYN_I18N[l]);

// 🧩 그룹4 — 캐릭터/장비 패널 + 배치 프리뷰 + 수집 (6언어)
const PANEL_I18N = {
  ko: {
    cpPower: "전력", cpLevelUp: "⬆️ 레벨업 Lv{n} · 💰{cost}", cpBatch: "일괄", cpRun: "실행", cpAll: "전부",
    cpFuse: "✨ 합성 ★{s}→★{s2} (중복 {need}장)", cpFuseDim: "✨ 합성 중복 {dup}/{need}", cpAscLock: "⭐ +10강 시 {combo}", cpAwaken: "✦ 각성 🔮{cost}", cpAwakLock: "✦ ★3↑ 각성",
    cpUnequipped: "미착용", cpEquipHint: "🎒 위 슬롯을 탭해 장비를 장착하세요", cpPickHint: "⚔️🛡️👟🍀💠 — 부위 슬롯을 탭하면 그 부위 장비가 여기 떠요", cpGearCount: "장비 {n}개", cpCloseX: "✕ 닫기", cpNoSlotGear: "이 부위 없음 — 제작", cpRecommend: "★추천", cpEquip: "장착",
    deployGeneric: "일반 군단 배치 — 투자한 정예가 곧 신화 (char 창에서 수집 유닛 편성)", deploySortie: "⚔️ 출전 {n}", deployEliteNote: "(네가 키운 정예)",
    gearGeneric: "장비", gearWornBy: " · 🎽 {owner} 착용중", gpopStar: "⭐ 별강화 ★{s}→★{s2} · 💰{cost}", gpopAwaken: "✦ 각성 ✦{a}→✦{a2} · 🔮{cost}", gpopFuse: "✨ 합성 ★{s}→★{s2} (같은 장비 소모)", gpopScrap: "🔨 분해 +{gold}골드",
    collectNeed: "{n}종 수집 필요", collectRewardToast: "📋 {n}종 수집 보상! 💎{gem} + 전군 영구 공·체 +{pct}%", collectHeader: "📋 수집 보상 · 도감 {owned}/200", collectCurBuff: " · 현재 전군 +{buff}% 영구", colTypeN: "{n}종",
  },
  en: {
    cpPower: "Power", cpLevelUp: "⬆️ Level up Lv{n} · 💰{cost}", cpBatch: "Batch", cpRun: "Run", cpAll: "All",
    cpFuse: "✨ Fuse ★{s}→★{s2} (dup {need})", cpFuseDim: "✨ Fuse dup {dup}/{need}", cpAscLock: "⭐ {combo} at +10", cpAwaken: "✦ Awaken 🔮{cost}", cpAwakLock: "✦ Awaken at ★3+",
    cpUnequipped: "Empty", cpEquipHint: "🎒 Tap a slot above to equip gear", cpPickHint: "⚔️🛡️👟🍀💠 — tap a slot to see gear for it here", cpGearCount: "gear {n}", cpCloseX: "✕ Close", cpNoSlotGear: "None for this slot — craft", cpRecommend: "★rec", cpEquip: "Equip",
    deployGeneric: "General legion deployment — invested elites become myth (deploy collected units in Units tab)", deploySortie: "⚔️ Sortie {n}", deployEliteNote: "(elites you raised)",
    gearGeneric: "gear", gearWornBy: " · 🎽 worn by {owner}", gpopStar: "⭐ Star up ★{s}→★{s2} · 💰{cost}", gpopAwaken: "✦ Awaken ✦{a}→✦{a2} · 🔮{cost}", gpopFuse: "✨ Fuse ★{s}→★{s2} (consume same gear)", gpopScrap: "🔨 Dismantle +{gold} gold",
    collectNeed: "Collect {n} needed", collectRewardToast: "📋 {n}-collection reward! 💎{gem} + permanent all ATK·HP +{pct}%", collectHeader: "📋 Collection rewards · Codex {owned}/200", collectCurBuff: " · now all +{buff}% permanent", colTypeN: "{n}",
  },
  ja: {
    cpPower: "戦力", cpLevelUp: "⬆️ レベルアップ Lv{n} · 💰{cost}", cpBatch: "一括", cpRun: "実行", cpAll: "全部",
    cpFuse: "✨ 合成 ★{s}→★{s2} (重複{need})", cpFuseDim: "✨ 合成 重複 {dup}/{need}", cpAscLock: "⭐ +10強化で {combo}", cpAwaken: "✦ 覚醒 🔮{cost}", cpAwakLock: "✦ ★3以上で覚醒",
    cpUnequipped: "未装着", cpEquipHint: "🎒 上のスロットをタップして装備", cpPickHint: "⚔️🛡️👟🍀💠 — 部位スロットをタップするとその装備が表示", cpGearCount: "装備 {n}個", cpCloseX: "✕ 閉じる", cpNoSlotGear: "この部位なし — 製作", cpRecommend: "★推奨", cpEquip: "装着",
    deployGeneric: "一般軍団配置 — 投資した精鋭が神話に (キャラ画面で編成)", deploySortie: "⚔️ 出撃 {n}", deployEliteNote: "(君が育てた精鋭)",
    gearGeneric: "装備", gearWornBy: " · 🎽 {owner} 装着中", gpopStar: "⭐ 星強化 ★{s}→★{s2} · 💰{cost}", gpopAwaken: "✦ 覚醒 ✦{a}→✦{a2} · 🔮{cost}", gpopFuse: "✨ 合成 ★{s}→★{s2} (同じ装備消費)", gpopScrap: "🔨 分解 +{gold}ゴールド",
    collectNeed: "{n}種収集が必要", collectRewardToast: "📋 {n}種収集報酬! 💎{gem} + 全軍永久攻·HP +{pct}%", collectHeader: "📋 収集報酬 · 図鑑 {owned}/200", collectCurBuff: " · 現在 全軍 +{buff}% 永久", colTypeN: "{n}種",
  },
  zh: {
    cpPower: "战力", cpLevelUp: "⬆️ 升级 Lv{n} · 💰{cost}", cpBatch: "批量", cpRun: "执行", cpAll: "全部",
    cpFuse: "✨ 合成 ★{s}→★{s2} (重复{need})", cpFuseDim: "✨ 合成 重复 {dup}/{need}", cpAscLock: "⭐ +10强化后 {combo}", cpAwaken: "✦ 觉醒 🔮{cost}", cpAwakLock: "✦ ★3以上觉醒",
    cpUnequipped: "未装备", cpEquipHint: "🎒 点击上方槽位装备", cpPickHint: "⚔️🛡️👟🍀💠 — 点击部位槽位查看该部位装备", cpGearCount: "装备 {n}件", cpCloseX: "✕ 关闭", cpNoSlotGear: "该部位无 — 制作", cpRecommend: "★推荐", cpEquip: "装备",
    deployGeneric: "普通军团部署 — 投资的精英终成神话 (在角色页编成收集单位)", deploySortie: "⚔️ 出战 {n}", deployEliteNote: "(你培养的精英)",
    gearGeneric: "装备", gearWornBy: " · 🎽 {owner} 装备中", gpopStar: "⭐ 星强化 ★{s}→★{s2} · 💰{cost}", gpopAwaken: "✦ 觉醒 ✦{a}→✦{a2} · 🔮{cost}", gpopFuse: "✨ 合成 ★{s}→★{s2} (消耗相同装备)", gpopScrap: "🔨 分解 +{gold}金币",
    collectNeed: "需收集{n}种", collectRewardToast: "📋 收集{n}种奖励! 💎{gem} + 全军永久攻·血 +{pct}%", collectHeader: "📋 收集奖励 · 图鉴 {owned}/200", collectCurBuff: " · 当前 全军 +{buff}% 永久", colTypeN: "{n}种",
  },
  hi: {
    cpPower: "शक्ति", cpLevelUp: "⬆️ लेवल अप Lv{n} · 💰{cost}", cpBatch: "बैच", cpRun: "चलाएँ", cpAll: "सभी",
    cpFuse: "✨ फ्यूज ★{s}→★{s2} (डुप्लि {need})", cpFuseDim: "✨ फ्यूज डुप्लि {dup}/{need}", cpAscLock: "⭐ +10 पर {combo}", cpAwaken: "✦ जागृति 🔮{cost}", cpAwakLock: "✦ ★3+ पर जागृति",
    cpUnequipped: "खाली", cpEquipHint: "🎒 गियर लगाने के लिए ऊपर स्लॉट टैप करें", cpPickHint: "⚔️🛡️👟🍀💠 — स्लॉट टैप करें, उस भाग का गियर यहाँ दिखेगा", cpGearCount: "गियर {n}", cpCloseX: "✕ बंद", cpNoSlotGear: "इस भाग का नहीं — बनाएँ", cpRecommend: "★सुझाव", cpEquip: "लगाएँ",
    deployGeneric: "सामान्य लीजन तैनाती — निवेशित एलीट बनें मिथक (यूनिट टैब में संग्रहित यूनिट तैनात करें)", deploySortie: "⚔️ अभियान {n}", deployEliteNote: "(आपके पाले एलीट)",
    gearGeneric: "गियर", gearWornBy: " · 🎽 {owner} पहने है", gpopStar: "⭐ स्टार अप ★{s}→★{s2} · 💰{cost}", gpopAwaken: "✦ जागृति ✦{a}→✦{a2} · 🔮{cost}", gpopFuse: "✨ फ्यूज ★{s}→★{s2} (समान गियर खर्च)", gpopScrap: "🔨 तोड़ें +{gold} गोल्ड",
    collectNeed: "{n} संग्रह चाहिए", collectRewardToast: "📋 {n} संग्रह इनाम! 💎{gem} + पूरी सेना स्थायी ATK·HP +{pct}%", collectHeader: "📋 संग्रह इनाम · कोडेक्स {owned}/200", collectCurBuff: " · अभी पूरी सेना +{buff}% स्थायी", colTypeN: "{n}",
  },
  ru: {
    cpPower: "Сила", cpLevelUp: "⬆️ Уровень Lv{n} · 💰{cost}", cpBatch: "Пакет", cpRun: "Запуск", cpAll: "Все",
    cpFuse: "✨ Синтез ★{s}→★{s2} (дубли {need})", cpFuseDim: "✨ Синтез дубли {dup}/{need}", cpAscLock: "⭐ {combo} при +10", cpAwaken: "✦ Пробуждение 🔮{cost}", cpAwakLock: "✦ Пробуждение при ★3+",
    cpUnequipped: "Пусто", cpEquipHint: "🎒 Нажмите слот выше, чтобы надеть снаряжение", cpPickHint: "⚔️🛡️👟🍀💠 — нажмите слот, снаряжение для него появится здесь", cpGearCount: "снаряжение {n}", cpCloseX: "✕ Закрыть", cpNoSlotGear: "Нет для этого слота — создать", cpRecommend: "★реком", cpEquip: "Надеть",
    deployGeneric: "Общее развёртывание легиона — вложенные элиты станут легендой (расставьте собранных юнитов во вкладке Юниты)", deploySortie: "⚔️ Вылазка {n}", deployEliteNote: "(элита, которую ты вырастил)",
    gearGeneric: "снаряжение", gearWornBy: " · 🎽 надето: {owner}", gpopStar: "⭐ Звезда ★{s}→★{s2} · 💰{cost}", gpopAwaken: "✦ Пробуждение ✦{a}→✦{a2} · 🔮{cost}", gpopFuse: "✨ Синтез ★{s}→★{s2} (расход того же снаряжения)", gpopScrap: "🔨 Разобрать +{gold} золота",
    collectNeed: "Нужно собрать {n}", collectRewardToast: "📋 Награда за {n} в коллекции! 💎{gem} + постоянно всей армии ATK·HP +{pct}%", collectHeader: "📋 Награды коллекции · Кодекс {owned}/200", collectCurBuff: " · сейчас всем +{buff}% навсегда", colTypeN: "{n}",
  },
};
for (const l in PANEL_I18N) Object.assign(I18N[l], PANEL_I18N[l]);

// 🗺️ 그룹6 — 바이옴·칭호·환생노드/연출·데일리/미션·마일스톤박스·상점태그·기타 토스트 (6언어)
const G6 = {
  ko: {
    biomeHangar: "🛰️ 강철 격납고", biomeCrimson: "🩸 진홍 전선", biomeToxic: "☠️ 맹독 늪지", biomeMagma: "🌋 마그마 코어", biomeVoid: "🌀 공허의 균열", biomeApoc: "💀 종말의 핏빛",
    titleAscendLord: "🔱 환생의 군주", titleConqueror: "⚔️ 대정복자", titleSsrCollector: "🏆 SSR 수집가", titleChapterConq: "🛡️ 챕터 정복자", titleLegionCmd: "📜 군단 사령관", titleFrontCmd: "🗡️ 전선의 지휘관", titleRecruit: "🔰 신병 사령관",
    andMight: "+{n} 공격 보너스 (flat)", andBulwark: "+{n} 체력 보너스 (flat)", andMomentum: "+{n} 시작 골드", andSoulnode: "+{n}% 소울", andPlunder: "+{n}% 전투골드", andEdge: "+{n}% 치명", andPierce: "+{n}% 치명피해", andVanguard: "+{n} 시작챕터", andProsper: "+{n} 젬/환생", andInsight: "-{n}% 각성비용",
    legendName: "전설", legendDescend: "⭐ {name} 강림!", sortieMarch: "⚔️ 출정! 군단 진격", abyssText: "심연…", reviveText: "군단, 부활하라", reawaken: "⚡ 군단 재각성 — 빨리감기 진격! (탭하면 스킵)", reawakenDone: "⚡ 재각성 완료 · 본격 진격!", rebirthToast: "🔄 환생! ⬡+{gain} · 영구배율 {old} → {new}×",
    friendGift: "🎉 친구 선물! 10연 확정 1SR 스타터 (fictional) 지급!", ssrUnitReward: "🏆SSR 유닛", ssrGearReward: "⚔️SSR 장비", securityTamper: "⚠️ 보안: 데이터 변조. 자원 초기화. 오류 시 Sovereign 연락.", vanguardToast1: "24h 집중 모드 ON — 내일 전투력 대폭 UP", vanguardToast2: "24h 집중 모드 ON: 전투력 + 시각 효과 강화", tgOnlyShare: "TG에서만 공유 보상 (user verify)", dominionPng: "Dominion 카드 PNG 생성됨 — TG에 붙여넣기", shareShort: "📤 공유", nextTurn: "다음 턴 ▶", tbStartStatus: "🧠 턴제 시작 — 전술 지휘 개시. 아침 우위 반영", cmdHQ: "군단 지휘 본부 • ", heroUpPower: " · ⚡전력 ", tbNoAuto: "🧠 턴제 모드에서는 자동 불가 — 수동 턴으로 진행", legionSignalStrong: "군단 신호 강함: 방치 보상 폭발 + 리추얼 창구 열림", profTapCopy: " (탭해서 복사)", lbBtn: "🏆 리더보드", dominionCopied: "MY Dominion 카드 복사됨 — TG paste로 flex! ",
    claimAllBtn: "모두 받기 ({n}개)", playStreakFoot: "⏰ 리셋 ~{h}h · 🔥 streak {s} (claim으로 유지)", playHalfWarn: "액션(전투/뽑기) 1번 이상 해야 풀 보상!", playMoreToast: "전투 1판 → 내일 보상 더 커져요! (오프라인 가속)", vanguardEvent: "⚡ 24h 집중 모드 — 내일 전투력 대폭 상승", missToday: "오늘 미션: 전투 {b}/3 · 뽑 {p}/1 · ULT {u}/1 · 탑 {tw}/1 ", missClaimBtn: "보상 받기 +800g + 내일 AFK 15% 부스트", missHabit: "오늘 완료 시 내일 AFK +15% (습관 루프)", playNowReset: "{s}s (0시 리셋)", fomoReset: "⏰ 리셋까지 ~{h}시간 (놓치면 연속 초기화) · 오늘 받으면 내일 전투력 UP", attendLoyalty: "🏅 누적 출석 {d}일 충성 보상! {extra}", ritualDone: "의식 완료 — 가챠 한 번 돌려볼까요?", insightBonus: "🪞 통찰 보너스 +{n}골드 획득!", streak7: "7일 연속! 내일 보상 2배 기대 (놓치면 초기화)", missIncomplete: "미션 미완 — 전투/뽑/ULT/탑 1회씩", missComplete: "🎁 미션 완료! +800g + 내일 AFK +15% (오프라인 가속)", battleMore: "전투 1판 더 → 스트릭/보상 업! (3-5분 루프)", inviteLinkCopied: "초대 링크 복사됨", omRitualDone: "🔮 의식 완료 — 가챠가 준비됐어요!", sovereignOnly: "Sovereign 전용", firstPay2x: "🎉 첫 결제 2배 보너스! (골드·젬 2배 지급)", firstPay2xToast: "🎉 첫 결제 2배 보너스! ", founderCrown: "🏅 창단멤버 등극! 영구 뱃지 + 골드+25%", tonToast: "TON stealth 진입 + X funnel credit",
    fuseMax5: "최대 ★5", fuseNeed: "합성에 중복 {need}장 필요 (보유 {have})", fuseDone: "✨ 합성! ★{s} 승급 · 중복 {need}장 소모", starMax30: "★ 최대 (30)", gearFuseNone: "합성할 같은 장비(미장착)가 없어요", gearFuseDone: "✨ 장비 합성! ★{s} · 같은 장비 1개 소모", gearEnhNeed10: "강화 10회 이상 필요", gearStar3Need: "★3 이상 필요", gearCountUnit: "{n}개", streakMeta: "🔥 연속 출석 — 매일 클레임으로 유지. 7일+ AFK 보상↑", eventMissionHint: "📅 이벤트 → 일일 미션 확인! (전투/뽑 1회씩)", starterGrant: "🎁 스타터 3인 지급! (사수+수호자+지휘관) 시너지 확인!", ftueLoop: "⚔️ 전투 시작 → 🎰 가챠 → 🦸 강화! (시너지로 강해짐)", boxUnitWord: "유닛",
    tagFounder: "🏅창단·7일한정", tagMonthly: "30일·💎", tagWeekly: "7일·💎", tagGrow1: "성장", tagGrow2: "성장·SSR", tagSF: "⚔️특수부대·일당10000", tagTON: "TON·스텔스",
  },
  en: {
    biomeHangar: "🛰️ Steel Hangar", biomeCrimson: "🩸 Crimson Front", biomeToxic: "☠️ Toxic Swamp", biomeMagma: "🌋 Magma Core", biomeVoid: "🌀 Void Rift", biomeApoc: "💀 Apocalypse Red",
    titleAscendLord: "🔱 Rebirth Sovereign", titleConqueror: "⚔️ Grand Conqueror", titleSsrCollector: "🏆 SSR Collector", titleChapterConq: "🛡️ Chapter Conqueror", titleLegionCmd: "📜 Legion Commander", titleFrontCmd: "🗡️ Front Commander", titleRecruit: "🔰 Recruit Commander",
    andMight: "+{n} ATK bonus (flat)", andBulwark: "+{n} HP bonus (flat)", andMomentum: "+{n} start gold", andSoulnode: "+{n}% souls", andPlunder: "+{n}% battle gold", andEdge: "+{n}% crit", andPierce: "+{n}% crit dmg", andVanguard: "+{n} start chapter", andProsper: "+{n} gems/rebirth", andInsight: "-{n}% awaken cost",
    legendName: "Legend", legendDescend: "⭐ {name} descends!", sortieMarch: "⚔️ Sortie! Legion advances", abyssText: "The abyss…", reviveText: "Legion, rise again", reawaken: "⚡ Legion reawakening — fast-forward advance! (tap to skip)", reawakenDone: "⚡ Reawakening done · full advance!", rebirthToast: "🔄 Rebirth! ⬡+{gain} · perm mult {old} → {new}×",
    friendGift: "🎉 Friend gift! Guaranteed 10-pull 1SR starter (fictional) granted!", ssrUnitReward: "🏆SSR unit", ssrGearReward: "⚔️SSR gear", securityTamper: "⚠️ Security: data tampering. Resources reset. Contact Sovereign if error.", vanguardToast1: "24h Focus ON — big power up tomorrow", vanguardToast2: "24h Focus ON: power + visual boost", tgOnlyShare: "Share reward only in TG (user verify)", dominionPng: "Dominion card PNG created — paste in TG", shareShort: "📤 Share", nextTurn: "Next Turn ▶", tbStartStatus: "🧠 Turn-based start — tactical command begins. Morning edge applied.", cmdHQ: "Legion Command HQ • ", heroUpPower: " · ⚡Power ", tbNoAuto: "🧠 Auto unavailable in turn-based — proceed by manual turns", legionSignalStrong: "Legion signal strong: idle reward surge + ritual window open", profTapCopy: " (tap to copy)", lbBtn: "🏆 Leaderboard", dominionCopied: "MY Dominion card copied — flex via TG paste! ",
    claimAllBtn: "Claim all ({n})", playStreakFoot: "⏰ Reset ~{h}h · 🔥 streak {s} (keep via claim)", playHalfWarn: "Do 1+ action (battle/pull) for full reward!", playMoreToast: "1 battle → bigger reward tomorrow! (offline boost)", vanguardEvent: "⚡ 24h Focus — big power rise tomorrow", missToday: "Today's missions: battle {b}/3 · pull {p}/1 · ULT {u}/1 · tower {tw}/1 ", missClaimBtn: "Claim +800g + AFK 15% boost tomorrow", missHabit: "Finish today → AFK +15% tomorrow (habit loop)", playNowReset: "{s}s (resets at 0:00)", fomoReset: "⏰ ~{h}h to reset (miss = streak reset) · claim today for tomorrow's power up", attendLoyalty: "🏅 {d}-day check-in loyalty reward! {extra}", ritualDone: "Ritual done — spin a gacha?", insightBonus: "🪞 Insight bonus +{n} gold!", streak7: "7-day streak! 2x reward tomorrow (miss = reset)", missIncomplete: "Missions incomplete — battle/pull/ULT/tower once each", missComplete: "🎁 Missions done! +800g + AFK +15% tomorrow (offline boost)", battleMore: "1 more battle → streak/reward up! (3-5 min loop)", inviteLinkCopied: "Invite link copied", omRitualDone: "🔮 Ritual done — gacha is ready!", sovereignOnly: "Sovereign only", firstPay2x: "🎉 First-purchase 2x bonus! (gold·gems doubled)", firstPay2xToast: "🎉 First-purchase 2x bonus! ", founderCrown: "🏅 Founder ascended! Permanent badge + gold +25%", tonToast: "TON stealth entry + X funnel credit",
    fuseMax5: "Max ★5", fuseNeed: "Fuse needs {need} dupes (have {have})", fuseDone: "✨ Fused! ★{s} up · consumed {need} dupes", starMax30: "★ Max (30)", gearFuseNone: "No matching gear (unequipped) to fuse", gearFuseDone: "✨ Gear fused! ★{s} · consumed 1 same gear", gearEnhNeed10: "Needs 10+ enhancements", gearStar3Need: "Needs ★3+", gearCountUnit: "{n}", streakMeta: "🔥 Check-in streak — keep by daily claim. 7d+ boosts AFK reward↑", eventMissionHint: "📅 Events → check daily missions! (battle/pull once each)", starterGrant: "🎁 Starter trio granted! (Marksman+Guardian+Commander) check synergy!", ftueLoop: "⚔️ Start battle → 🎰 gacha → 🦸 upgrade! (synergy makes you stronger)", boxUnitWord: "unit",
    tagFounder: "🏅Founder·7d limited", tagMonthly: "30d·💎", tagWeekly: "7d·💎", tagGrow1: "Growth", tagGrow2: "Growth·SSR", tagSF: "⚔️Special Forces·10000", tagTON: "TON·stealth",
  },
  ja: {
    biomeHangar: "🛰️ 鋼鉄格納庫", biomeCrimson: "🩸 真紅前線", biomeToxic: "☠️ 猛毒湿地", biomeMagma: "🌋 マグマコア", biomeVoid: "🌀 虚空の裂け目", biomeApoc: "💀 終末の血色",
    titleAscendLord: "🔱 転生の君主", titleConqueror: "⚔️ 大征服者", titleSsrCollector: "🏆 SSR収集家", titleChapterConq: "🛡️ チャプター征服者", titleLegionCmd: "📜 軍団司令官", titleFrontCmd: "🗡️ 前線の指揮官", titleRecruit: "🔰 新兵司令官",
    andMight: "+{n} 攻撃ボーナス (flat)", andBulwark: "+{n} HPボーナス (flat)", andMomentum: "+{n} 開始ゴールド", andSoulnode: "+{n}% ソウル", andPlunder: "+{n}% 戦闘ゴールド", andEdge: "+{n}% クリ", andPierce: "+{n}% クリダメ", andVanguard: "+{n} 開始チャプター", andProsper: "+{n} ジェム/転生", andInsight: "-{n}% 覚醒コスト",
    legendName: "伝説", legendDescend: "⭐ {name} 降臨!", sortieMarch: "⚔️ 出撃! 軍団進撃", abyssText: "深淵…", reviveText: "軍団よ、蘇れ", reawaken: "⚡ 軍団再覚醒 — 早送り進撃! (タップでスキップ)", reawakenDone: "⚡ 再覚醒完了 · 本格進撃!", rebirthToast: "🔄 転生! ⬡+{gain} · 永久倍率 {old} → {new}×",
    friendGift: "🎉 友達ギフト! 10連確定1SRスターター (fictional) 付与!", ssrUnitReward: "🏆SSRユニット", ssrGearReward: "⚔️SSR装備", securityTamper: "⚠️ セキュリティ: データ改竄。資源リセット。エラー時はSovereignへ連絡。", vanguardToast1: "24h集中モードON — 明日戦力大幅UP", vanguardToast2: "24h集中モードON: 戦力 + 視覚効果強化", tgOnlyShare: "TGのみ共有報酬 (user verify)", dominionPng: "Dominionカード PNG生成 — TGに貼付", shareShort: "📤 共有", nextTurn: "次のターン ▶", tbStartStatus: "🧠 ターン制開始 — 戦術指揮開始。朝の優位反映。", cmdHQ: "軍団指揮本部 • ", heroUpPower: " · ⚡戦力 ", tbNoAuto: "🧠 ターン制では自動不可 — 手動ターンで進行", legionSignalStrong: "軍団シグナル強: 放置報酬爆発 + リチュアル窓口オープン", profTapCopy: " (タップでコピー)", lbBtn: "🏆 リーダーボード", dominionCopied: "MY Dominionカードコピー — TG貼付でflex! ",
    claimAllBtn: "全て受取 ({n})", playStreakFoot: "⏰ リセット ~{h}h · 🔥 streak {s} (claimで維持)", playHalfWarn: "アクション(戦闘/ガチャ)1回以上でフル報酬!", playMoreToast: "戦闘1回 → 明日の報酬UP! (オフライン加速)", vanguardEvent: "⚡ 24h集中モード — 明日戦力大幅上昇", missToday: "本日ミッション: 戦闘 {b}/3 · ガチャ {p}/1 · ULT {u}/1 · 塔 {tw}/1 ", missClaimBtn: "報酬受取 +800g + 明日AFK15%ブースト", missHabit: "本日達成 → 明日AFK +15% (習慣ループ)", playNowReset: "{s}s (0時リセット)", fomoReset: "⏰ リセットまで ~{h}時間 (逃すと連続リセット) · 本日受取で明日戦力UP", attendLoyalty: "🏅 累計ログイン{d}日 忠誠報酬! {extra}", ritualDone: "儀式完了 — ガチャを回す?", insightBonus: "🪞 洞察ボーナス +{n}ゴールド獲得!", streak7: "7日連続! 明日報酬2倍期待 (逃すとリセット)", missIncomplete: "ミッション未完 — 戦闘/ガチャ/ULT/塔 各1回", missComplete: "🎁 ミッション達成! +800g + 明日AFK +15% (オフライン加速)", battleMore: "あと1戦 → ストリーク/報酬UP! (3-5分ループ)", inviteLinkCopied: "招待リンクコピー", omRitualDone: "🔮 儀式完了 — ガチャ準備完了!", sovereignOnly: "Sovereign専用", firstPay2x: "🎉 初回購入2倍ボーナス! (ゴールド·ジェム2倍)", firstPay2xToast: "🎉 初回購入2倍ボーナス! ", founderCrown: "🏅 創設メンバー昇格! 永久バッジ + ゴールド+25%", tonToast: "TON stealth進入 + X funnel credit",
    fuseMax5: "最大 ★5", fuseNeed: "合成に重複{need}枚必要 (所持{have})", fuseDone: "✨ 合成! ★{s}昇級 · 重複{need}枚消費", starMax30: "★ 最大 (30)", gearFuseNone: "合成する同じ装備(未装着)がない", gearFuseDone: "✨ 装備合成! ★{s} · 同じ装備1個消費", gearEnhNeed10: "強化10回以上必要", gearStar3Need: "★3以上必要", gearCountUnit: "{n}個", streakMeta: "🔥 連続ログイン — 毎日claimで維持。7日+でAFK報酬↑", eventMissionHint: "📅 イベント → デイリーミッション確認! (戦闘/ガチャ各1回)", starterGrant: "🎁 スターター3体付与! (射手+守護者+指揮官) シナジー確認!", ftueLoop: "⚔️ 戦闘開始 → 🎰 ガチャ → 🦸 強化! (シナジーで強く)", boxUnitWord: "ユニット",
    tagFounder: "🏅創設·7日限定", tagMonthly: "30日·💎", tagWeekly: "7日·💎", tagGrow1: "成長", tagGrow2: "成長·SSR", tagSF: "⚔️特殊部隊·日当10000", tagTON: "TON·ステルス",
  },
  zh: {
    biomeHangar: "🛰️ 钢铁机库", biomeCrimson: "🩸 绯红前线", biomeToxic: "☠️ 剧毒沼泽", biomeMagma: "🌋 岩浆核心", biomeVoid: "🌀 虚空裂隙", biomeApoc: "💀 终末血色",
    titleAscendLord: "🔱 转生君主", titleConqueror: "⚔️ 大征服者", titleSsrCollector: "🏆 SSR收藏家", titleChapterConq: "🛡️ 章节征服者", titleLegionCmd: "📜 军团司令", titleFrontCmd: "🗡️ 前线指挥官", titleRecruit: "🔰 新兵司令",
    andMight: "+{n} 攻击加成 (flat)", andBulwark: "+{n} 血量加成 (flat)", andMomentum: "+{n} 起始金币", andSoulnode: "+{n}% 灵魂", andPlunder: "+{n}% 战斗金币", andEdge: "+{n}% 暴击", andPierce: "+{n}% 暴伤", andVanguard: "+{n} 起始章节", andProsper: "+{n} 钻石/转生", andInsight: "-{n}% 觉醒消耗",
    legendName: "传说", legendDescend: "⭐ {name} 降临!", sortieMarch: "⚔️ 出击! 军团进军", abyssText: "深渊…", reviveText: "军团，复苏吧", reawaken: "⚡ 军团再觉醒 — 快进进军! (点击跳过)", reawakenDone: "⚡ 再觉醒完成 · 正式进军!", rebirthToast: "🔄 转生! ⬡+{gain} · 永久倍率 {old} → {new}×",
    friendGift: "🎉 好友礼物! 十连必得1SR新手包 (fictional) 已发放!", ssrUnitReward: "🏆SSR单位", ssrGearReward: "⚔️SSR装备", securityTamper: "⚠️ 安全: 数据篡改。资源重置。出错请联系Sovereign。", vanguardToast1: "24h专注模式开启 — 明日战力大幅提升", vanguardToast2: "24h专注模式开启: 战力 + 视觉强化", tgOnlyShare: "仅TG内分享奖励 (user verify)", dominionPng: "Dominion卡片PNG已生成 — 粘贴到TG", shareShort: "📤 分享", nextTurn: "下一回合 ▶", tbStartStatus: "🧠 回合制开始 — 战术指挥开始。已反映晨间优势。", cmdHQ: "军团指挥总部 • ", heroUpPower: " · ⚡战力 ", tbNoAuto: "🧠 回合制无法自动 — 请手动进行回合", legionSignalStrong: "军团信号强: 挂机奖励爆发 + 仪式窗口开启", profTapCopy: " (点击复制)", lbBtn: "🏆 排行榜", dominionCopied: "MY Dominion卡片已复制 — 粘贴到TG炫耀! ",
    claimAllBtn: "全部领取 ({n})", playStreakFoot: "⏰ 重置 ~{h}h · 🔥 streak {s} (领取以维持)", playHalfWarn: "至少做1次行动(战斗/抽卡)才能满额奖励!", playMoreToast: "1场战斗 → 明日奖励更大! (离线加速)", vanguardEvent: "⚡ 24h专注模式 — 明日战力大幅上升", missToday: "今日任务: 战斗 {b}/3 · 抽卡 {p}/1 · ULT {u}/1 · 塔 {tw}/1 ", missClaimBtn: "领取 +800g + 明日AFK15%加成", missHabit: "今日完成 → 明日AFK +15% (习惯循环)", playNowReset: "{s}s (0点重置)", fomoReset: "⏰ 距重置 ~{h}小时 (错过则连续重置) · 今日领取明日战力UP", attendLoyalty: "🏅 累计签到{d}天 忠诚奖励! {extra}", ritualDone: "仪式完成 — 抽一发?", insightBonus: "🪞 洞察奖励 +{n}金币!", streak7: "连续7天! 明日奖励2倍 (错过则重置)", missIncomplete: "任务未完 — 战斗/抽卡/ULT/塔各1次", missComplete: "🎁 任务完成! +800g + 明日AFK +15% (离线加速)", battleMore: "再1场 → 连击/奖励提升! (3-5分钟循环)", inviteLinkCopied: "邀请链接已复制", omRitualDone: "🔮 仪式完成 — 抽卡已就绪!", sovereignOnly: "仅Sovereign", firstPay2x: "🎉 首充2倍奖励! (金币·钻石翻倍)", firstPay2xToast: "🎉 首充2倍奖励! ", founderCrown: "🏅 创始成员登顶! 永久徽章 + 金币+25%", tonToast: "TON stealth进入 + X funnel credit",
    fuseMax5: "最高 ★5", fuseNeed: "合成需要{need}张重复 (拥有{have})", fuseDone: "✨ 合成! ★{s}晋级 · 消耗{need}张重复", starMax30: "★ 最高 (30)", gearFuseNone: "没有可合成的相同装备(未装备)", gearFuseDone: "✨ 装备合成! ★{s} · 消耗1件相同装备", gearEnhNeed10: "需强化10次以上", gearStar3Need: "需★3以上", gearCountUnit: "{n}件", streakMeta: "🔥 连续签到 — 每日领取维持。7天+提升AFK奖励↑", eventMissionHint: "📅 活动 → 查看每日任务! (战斗/抽卡各1次)", starterGrant: "🎁 发放新手三人组! (射手+守卫+指挥官) 查看协同!", ftueLoop: "⚔️ 开始战斗 → 🎰 抽卡 → 🦸 强化! (协同变强)", boxUnitWord: "单位",
    tagFounder: "🏅创始·7天限定", tagMonthly: "30天·💎", tagWeekly: "7天·💎", tagGrow1: "成长", tagGrow2: "成长·SSR", tagSF: "⚔️特种部队·日产10000", tagTON: "TON·隐匿",
  },
  hi: {
    biomeHangar: "🛰️ स्टील हैंगर", biomeCrimson: "🩸 रक्तिम मोर्चा", biomeToxic: "☠️ विषैला दलदल", biomeMagma: "🌋 मैग्मा कोर", biomeVoid: "🌀 शून्य दरार", biomeApoc: "💀 प्रलय रक्त",
    titleAscendLord: "🔱 पुनर्जन्म सम्राट", titleConqueror: "⚔️ महाविजेता", titleSsrCollector: "🏆 SSR संग्राहक", titleChapterConq: "🛡️ अध्याय विजेता", titleLegionCmd: "📜 लीजन कमांडर", titleFrontCmd: "🗡️ मोर्चा कमांडर", titleRecruit: "🔰 भर्ती कमांडर",
    andMight: "+{n} ATK बोनस (flat)", andBulwark: "+{n} HP बोनस (flat)", andMomentum: "+{n} शुरुआती गोल्ड", andSoulnode: "+{n}% आत्मा", andPlunder: "+{n}% युद्ध गोल्ड", andEdge: "+{n}% क्रिट", andPierce: "+{n}% क्रिट क्षति", andVanguard: "+{n} शुरुआती अध्याय", andProsper: "+{n} जेम/पुनर्जन्म", andInsight: "-{n}% जागृति लागत",
    legendName: "लीजेंड", legendDescend: "⭐ {name} अवतरित!", sortieMarch: "⚔️ अभियान! लीजन आगे", abyssText: "अतल…", reviveText: "लीजन, फिर उठो", reawaken: "⚡ लीजन पुनर्जागरण — फास्ट-फॉरवर्ड! (स्किप के लिए टैप)", reawakenDone: "⚡ पुनर्जागरण पूर्ण · पूर्ण अग्रगमन!", rebirthToast: "🔄 पुनर्जन्म! ⬡+{gain} · स्थायी गुणक {old} → {new}×",
    friendGift: "🎉 दोस्त उपहार! गारंटीड 10-पुल 1SR स्टार्टर (fictional) दिया!", ssrUnitReward: "🏆SSR यूनिट", ssrGearReward: "⚔️SSR गियर", securityTamper: "⚠️ सुरक्षा: डेटा छेड़छाड़। संसाधन रीसेट। त्रुटि पर Sovereign से संपर्क।", vanguardToast1: "24घं फोकस ऑन — कल बड़ी पावर अप", vanguardToast2: "24घं फोकस ऑन: पावर + विज़ुअल बूस्ट", tgOnlyShare: "केवल TG में शेयर इनाम (user verify)", dominionPng: "Dominion कार्ड PNG बना — TG में पेस्ट करें", shareShort: "📤 शेयर", nextTurn: "अगला टर्न ▶", tbStartStatus: "🧠 टर्न-आधारित शुरू — सामरिक कमान शुरू। सुबह बढ़त लागू।", cmdHQ: "लीजन कमांड HQ • ", heroUpPower: " · ⚡शक्ति ", tbNoAuto: "🧠 टर्न-आधारित में ऑटो नहीं — मैन्युअल टर्न से बढ़ें", legionSignalStrong: "लीजन सिग्नल तेज़: निष्क्रिय इनाम उछाल + रिचुअल विंडो खुली", profTapCopy: " (कॉपी के लिए टैप)", lbBtn: "🏆 लीडरबोर्ड", dominionCopied: "MY Dominion कार्ड कॉपी — TG पेस्ट से flex! ",
    claimAllBtn: "सभी लें ({n})", playStreakFoot: "⏰ रीसेट ~{h}h · 🔥 streak {s} (claim से बनाए रखें)", playHalfWarn: "पूरा इनाम पाने को 1+ एक्शन (युद्ध/पुल) करें!", playMoreToast: "1 युद्ध → कल बड़ा इनाम! (ऑफलाइन बूस्ट)", vanguardEvent: "⚡ 24घं फोकस — कल बड़ी पावर वृद्धि", missToday: "आज मिशन: युद्ध {b}/3 · पुल {p}/1 · ULT {u}/1 · टावर {tw}/1 ", missClaimBtn: "लें +800g + कल AFK 15% बूस्ट", missHabit: "आज पूरा → कल AFK +15% (आदत लूप)", playNowReset: "{s}s (0 बजे रीसेट)", fomoReset: "⏰ रीसेट में ~{h} घंटे (चूके तो streak रीसेट) · आज लें कल पावर UP", attendLoyalty: "🏅 {d}-दिन चेक-इन वफादारी इनाम! {extra}", ritualDone: "रिचुअल पूर्ण — एक गाचा घुमाएँ?", insightBonus: "🪞 अंतर्दृष्टि बोनस +{n} गोल्ड!", streak7: "7-दिन streak! कल 2x इनाम (चूके तो रीसेट)", missIncomplete: "मिशन अधूरा — युद्ध/पुल/ULT/टावर एक-एक बार", missComplete: "🎁 मिशन पूर्ण! +800g + कल AFK +15% (ऑफलाइन बूस्ट)", battleMore: "1 और युद्ध → streak/इनाम बढ़े! (3-5 मिनट लूप)", inviteLinkCopied: "आमंत्रण लिंक कॉपी", omRitualDone: "🔮 रिचुअल पूर्ण — गाचा तैयार!", sovereignOnly: "केवल Sovereign", firstPay2x: "🎉 पहली खरीद 2x बोनस! (गोल्ड·जेम दोगुना)", firstPay2xToast: "🎉 पहली खरीद 2x बोनस! ", founderCrown: "🏅 फाउंडर बने! स्थायी बैज + गोल्ड +25%", tonToast: "TON stealth एंट्री + X funnel credit",
    fuseMax5: "अधिकतम ★5", fuseNeed: "फ्यूज को {need} डुप्लि चाहिए (पास {have})", fuseDone: "✨ फ्यूज! ★{s} अपग्रेड · {need} डुप्लि खर्च", starMax30: "★ अधिकतम (30)", gearFuseNone: "फ्यूज को समान गियर (बिना लगा) नहीं", gearFuseDone: "✨ गियर फ्यूज! ★{s} · 1 समान गियर खर्च", gearEnhNeed10: "10+ एनहांस चाहिए", gearStar3Need: "★3+ चाहिए", gearCountUnit: "{n}", streakMeta: "🔥 चेक-इन streak — रोज़ claim से बनाए रखें। 7दिन+ AFK इनाम↑", eventMissionHint: "📅 इवेंट → डेली मिशन देखें! (युद्ध/पुल एक-एक बार)", starterGrant: "🎁 स्टार्टर तिकड़ी मिली! (निशानेबाज़+रक्षक+कमांडर) सिनर्जी देखें!", ftueLoop: "⚔️ युद्ध शुरू → 🎰 गाचा → 🦸 अपग्रेड! (सिनर्जी से मजबूत)", boxUnitWord: "यूनिट",
    tagFounder: "🏅फाउंडर·7दिन", tagMonthly: "30दिन·💎", tagWeekly: "7दिन·💎", tagGrow1: "ग्रोथ", tagGrow2: "ग्रोथ·SSR", tagSF: "⚔️स्पेशल फोर्स·10000", tagTON: "TON·स्टेल्थ",
  },
  ru: {
    biomeHangar: "🛰️ Стальной ангар", biomeCrimson: "🩸 Багровый фронт", biomeToxic: "☠️ Ядовитое болото", biomeMagma: "🌋 Ядро магмы", biomeVoid: "🌀 Разлом пустоты", biomeApoc: "💀 Кровь апокалипсиса",
    titleAscendLord: "🔱 Владыка перерождения", titleConqueror: "⚔️ Великий завоеватель", titleSsrCollector: "🏆 Коллекционер SSR", titleChapterConq: "🛡️ Покоритель глав", titleLegionCmd: "📜 Командир легиона", titleFrontCmd: "🗡️ Командир фронта", titleRecruit: "🔰 Командир-новобранец",
    andMight: "+{n} к атаке (flat)", andBulwark: "+{n} к HP (flat)", andMomentum: "+{n} стартовое золото", andSoulnode: "+{n}% душ", andPlunder: "+{n}% боевого золота", andEdge: "+{n}% крит", andPierce: "+{n}% крит.урон", andVanguard: "+{n} стартовая глава", andProsper: "+{n} алмазов/перерождение", andInsight: "-{n}% к цене пробуждения",
    legendName: "Легенда", legendDescend: "⭐ {name} нисходит!", sortieMarch: "⚔️ Вылазка! Легион наступает", abyssText: "Бездна…", reviveText: "Легион, восстань", reawaken: "⚡ Пробуждение легиона — ускоренное наступление! (тап — пропустить)", reawakenDone: "⚡ Пробуждение готово · полное наступление!", rebirthToast: "🔄 Перерождение! ⬡+{gain} · пост. множитель {old} → {new}×",
    friendGift: "🎉 Подарок друга! Гарант 10-круток стартер 1SR (вымысел) выдан!", ssrUnitReward: "🏆SSR-юнит", ssrGearReward: "⚔️SSR-снаряжение", securityTamper: "⚠️ Безопасность: подмена данных. Ресурсы сброшены. При ошибке — к Sovereign.", vanguardToast1: "Фокус 24ч ВКЛ — большой рост силы завтра", vanguardToast2: "Фокус 24ч ВКЛ: сила + визуал усилены", tgOnlyShare: "Награда за шеру только в TG (user verify)", dominionPng: "PNG карты Dominion создан — вставь в TG", shareShort: "📤 Поделиться", nextTurn: "Следующий ход ▶", tbStartStatus: "🧠 Пошаговый старт — тактическое командование началось. Утреннее преимущество учтено.", cmdHQ: "Штаб легиона • ", heroUpPower: " · ⚡Сила ", tbNoAuto: "🧠 Авто недоступно в пошаговом — играй ходами вручную", legionSignalStrong: "Сигнал легиона силён: всплеск офлайн-наград + окно ритуала открыто", profTapCopy: " (нажми, чтобы копировать)", lbBtn: "🏆 Таблица лидеров", dominionCopied: "Карта MY Dominion скопирована — хвались через вставку в TG! ",
    claimAllBtn: "Забрать всё ({n})", playStreakFoot: "⏰ Сброс ~{h}ч · 🔥 серия {s} (держи через забор)", playHalfWarn: "Сделай 1+ действие (бой/крутка) для полной награды!", playMoreToast: "1 бой → больше наград завтра! (офлайн-буст)", vanguardEvent: "⚡ Фокус 24ч — большой рост силы завтра", missToday: "Задания дня: бой {b}/3 · крутка {p}/1 · ULT {u}/1 · башня {tw}/1 ", missClaimBtn: "Забрать +800g + буст AFK 15% завтра", missHabit: "Выполни сегодня → AFK +15% завтра (петля привычки)", playNowReset: "{s}s (сброс в 0:00)", fomoReset: "⏰ ~{h}ч до сброса (пропуск = сброс серии) · забери сегодня — сила вырастет завтра", attendLoyalty: "🏅 Награда за {d} дней входа! {extra}", ritualDone: "Ритуал готов — крутнуть гачу?", insightBonus: "🪞 Бонус прозрения +{n} золота!", streak7: "Серия 7 дней! Завтра 2x награда (пропуск = сброс)", missIncomplete: "Задания не выполнены — бой/крутка/ULT/башня по разу", missComplete: "🎁 Задания готовы! +800g + AFK +15% завтра (офлайн-буст)", battleMore: "Ещё 1 бой → серия/награда растёт! (петля 3-5 мин)", inviteLinkCopied: "Ссылка-приглашение скопирована", omRitualDone: "🔮 Ритуал готов — гача наготове!", sovereignOnly: "Только Sovereign", firstPay2x: "🎉 Бонус 2x за первую покупку! (золото·алмазы удвоены)", firstPay2xToast: "🎉 Бонус 2x за первую покупку! ", founderCrown: "🏅 Основатель вознесён! Постоянный значок + золото +25%", tonToast: "TON stealth вход + X funnel credit",
    fuseMax5: "Макс ★5", fuseNeed: "Для синтеза нужно {need} дублей (есть {have})", fuseDone: "✨ Синтез! ★{s} повышение · потрачено {need} дублей", starMax30: "★ Макс (30)", gearFuseNone: "Нет одинакового снаряжения (не надето) для синтеза", gearFuseDone: "✨ Синтез снаряжения! ★{s} · потрачено 1 такое же", gearEnhNeed10: "Нужно 10+ улучшений", gearStar3Need: "Нужно ★3+", gearCountUnit: "{n}", streakMeta: "🔥 Серия входов — держи ежедневным забором. 7д+ повышает AFK-награду↑", eventMissionHint: "📅 События → проверь задания дня! (бой/крутка по разу)", starterGrant: "🎁 Стартовое трио выдано! (Стрелок+Страж+Командир) проверь синергию!", ftueLoop: "⚔️ Начни бой → 🎰 гача → 🦸 улучшение! (синергия усиливает)", boxUnitWord: "юнит",
    tagFounder: "🏅Основатель·7дн", tagMonthly: "30дн·💎", tagWeekly: "7дн·💎", tagGrow1: "Рост", tagGrow2: "Рост·SSR", tagSF: "⚔️Спецназ·10000", tagTON: "TON·стелс",
  },
};
for (const l in G6) Object.assign(I18N[l], G6[l]);

// 🌐 유닛 로스터 현지화 데이터 (units.js buildRoster/localizeRoster가 읽음). 6언어. 고유명(Arclight 등)=영문 유지.
const ROSTER_I18N = {
  ko: {
    prefix: ["강철","그림자","폭풍","심연","칠흑","진홍","백야","망령","천공","무한","파멸","서리","화염","뇌광","흑요","적염","청뢰","황혼","여명","독사","혈월","은하","절대","광휘","암흑","신성","야수","냉혹","불멸","질풍","공허","성염","흑풍","백금","흑철","진월","광란","한설","맹화","패왕"],
    noun: { drone:["정찰기","벌떼","비행체","추적자","날개","탐사기"], marksman:["저격수","매","조준자","사수","관통자","표식자"], guardian:["방패병","성벽","수호자","장벽","방어선","철갑"], bruiser:["파괴자","강습병","철권","분쇄기","맹격","돌파자"], commander:["전략가","사령관","지휘자","책사","총수","군사"], titan:["거신","용","괴수","거인","타이탄","마룡"] },
    ssrTitle: { arclight:"심판의 빛",solace:"재생의 물결",cipher:"정밀 해독",ignis:"광란의 폭주",vector:"동시 지휘",vespera:"군집 분열",aegis:"수호의 방벽",anvil:"건설 프로토콜",dominus:"군단의 핵" },
    ssrPersona: { arclight:"군단의 전략적 판단자. 승기를 읽어 전군을 각성시킨다",solace:"실행의 수호자. 사망을 수복으로 바꾼다",cipher:"정밀한 감시자. 적의 약점을 드러낸다",ignis:"광란의 파괴자. 다칠수록 강해진다",vector:"조율의 사령관. 부대를 한 번에 움직인다",vespera:"스웜의 군주. 개체는 약하나 무리는 무적",aegis:"감시의 방벽. 아군을 먼저 지킨다",anvil:"수리와 건설의 핵심",dominus:"군림자. 군단의 정점" },
    ssrTrait: { arclight:"처치 시 전군 AI+1.5 · 3초 치명 연쇄",solace:"아군 사망 시 주변 3체 연쇄 수복(HP25%)",cipher:"적 방어 30% 무시 · 약점 노출(아군 다음 2명 치명+25%)",ignis:"HP30%↓ 시 공격 x2.5 · 피해 반사",vector:"아군 3체 동시 돌격 · 속도+25%",vespera:"사망 시 하급 2~3체 분열 소환 · 군집 3+ 시 폭주",aegis:"전투 시작 시 아군 2체 8초 보호막",anvil:"8초마다 임시 구조물 또는 팀 재생+10%(3초)",dominus:"팀 내 SSR 1체당 전군 스탯+5%(최대25%)" },
    srName: ["와스프","헌터","뱅가드","해벅","택틱스","골렘","글리치","바이퍼","타워","램페이지","마샬","저거너트","호크아이","사일런서","램파트","브레이커","바이저","콜로서스","팬텀","아처","캐슬","슬래머","워든","와이번","호넷","팰컨","센티넬","마울","워로드","네메시스"],
    srTitle: ["독침의 정찰","추격의 사수","철벽의 수호","분쇄의 돌격","전술의 지휘","거석의 파수","교란의 정찰","맹독의 사격","거탑의 방벽","난동의 돌격","원수의 통솔","멈출 수 없는 진군","감시의 비행","무음의 저격","성루의 방어","파쇄의 강습","책략의 군사","거상의 군림","은신의 추적","정밀의 명사수","요새의 방패","강타의 파괴","통솔의 사령","비룡의 강하","쏘는 벌떼","급강하 발톱","영원의 파수","강타의 일격","군벌의 호령","복수의 심판"],
    featured: { arclight:"심판의 서막",dominus:"군림의 시간",ignis:"겁화의 강림",vector:"전율의 가속",aegis:"불멸의 방벽",cipher:"심연의 해독",vespera:"여명의 군무",solace:"정적의 물결",anvil:"단조의 의지" },
  },
  en: {
    prefix: ["Steel","Shadow","Storm","Abyssal","Pitch","Crimson","Polar","Wraith","Sky","Infinite","Doom","Frost","Flame","Thunder","Obsidian","Ember","Azure","Twilight","Dawn","Viper","Bloodmoon","Galaxy","Absolute","Radiant","Dark","Divine","Feral","Ruthless","Immortal","Gale","Void","Holy Flame","Black Gale","Platinum","Blacksteel","True Moon","Frenzy","Snow","Blaze","Overlord"],
    noun: { drone:["Scout","Swarm","Flyer","Tracker","Wing","Probe"], marksman:["Sniper","Hawk","Aimer","Shooter","Piercer","Marker"], guardian:["Shieldman","Rampart","Guardian","Barrier","Bulwark","Ironclad"], bruiser:["Destroyer","Raider","Ironfist","Crusher","Striker","Breaker"], commander:["Strategist","Commander","Conductor","Tactician","Chief","Marshal"], titan:["Colossus","Dragon","Behemoth","Giant","Titan","Wyrm"] },
    ssrTitle: { arclight:"Light of Judgment",solace:"Wave of Renewal",cipher:"Precision Decrypt",ignis:"Frenzied Rush",vector:"Simultaneous Command",vespera:"Swarm Split",aegis:"Guardian Wall",anvil:"Forge Protocol",dominus:"Core of the Legion" },
    ssrPersona: { arclight:"The legion's strategic arbiter. Reads the moment of victory and awakens the whole army.",solace:"Guardian of execution. Turns death into restoration.",cipher:"A precise watcher. Exposes the enemy's weakness.",ignis:"A frenzied destroyer. The more wounded, the stronger.",vector:"Commander of coordination. Moves the whole unit at once.",vespera:"Lord of the swarm. Weak alone, invincible as a horde.",aegis:"The watchful bulwark. Protects allies first.",anvil:"The core of repair and construction.",dominus:"The ruler. The apex of the legion." },
    ssrTrait: { arclight:"On kill: all-army AI +1.5 · 3s crit chain",solace:"On ally death: chain-restore 3 nearby (HP 25%)",cipher:"Ignore 30% enemy defense · expose weakness (next 2 allies crit +25%)",ignis:"Below 30% HP: ATK x2.5 · reflect damage",vector:"3 allies charge together · speed +25%",vespera:"On death: split-summon 2-3 lessers · frenzy at swarm 3+",aegis:"At battle start: shield 2 allies for 8s",anvil:"Every 8s: temp structure or team regen +10% (3s)",dominus:"Per SSR in team: all-army stats +5% (max 25%)" },
    srName: ["Wasp","Hunter","Vanguard","Havoc","Tactics","Golem","Glitch","Viper","Tower","Rampage","Marshal","Juggernaut","Hawkeye","Silencer","Rampart","Breaker","Visor","Colossus","Phantom","Archer","Castle","Slammer","Warden","Wyvern","Hornet","Falcon","Sentinel","Maul","Warlord","Nemesis"],
    srTitle: ["Sting Scout","Pursuit Shooter","Iron Guard","Crushing Charge","Tactical Command","Megalith Watch","Jamming Scout","Venom Shot","Great Tower Wall","Rampage Charge","Marshal's Command","Unstoppable March","Surveillance Flight","Silent Snipe","Bastion Defense","Shatter Assault","Schemer's Strategy","Colossus Reign","Stealth Pursuit","Precision Marksman","Fortress Shield","Smashing Destruction","Commanding Officer","Wyvern Descent","Stinging Swarm","Diving Talon","Eternal Watch","Crushing Blow","Warlord's Command","Vengeful Reckoning"],
    featured: { arclight:"Arc of Judgment",dominus:"Reign Eternal",ignis:"Inferno Descent",vector:"Surge Protocol",aegis:"Eternal Bastion",cipher:"Cipher's Eye",vespera:"Dawn Swarm",solace:"Tides of Solace",anvil:"Anvil's Resolve" },
  },
  ja: { prefix:["鋼鉄","影","嵐","深淵","漆黒","深紅","白夜","亡霊","天空","無限","破滅","霜","火炎","雷光","黒曜","赤炎","蒼雷","黄昏","黎明","毒蛇","血月","銀河","絶対","光輝","暗黒","神聖","野獣","冷酷","不滅","疾風","虚空","聖炎","黒風","白金","黒鉄","真月","狂乱","寒雪","猛火","覇王"], noun:{drone:["偵察機","蜂群","飛行体","追跡者","翼","探査機"],marksman:["狙撃手","鷹","照準者","射手","貫通者","標識者"],guardian:["盾兵","城壁","守護者","障壁","防衛線","鉄甲"],bruiser:["破壊者","強襲兵","鉄拳","粉砕機","猛撃者","突破者"],commander:["戦略家","司令官","指揮者","策士","総帥","元帥"],titan:["巨神","竜","怪獣","巨人","タイタン","魔竜"]}, ssrTitle:{arclight:"審判の光",solace:"再生の波",cipher:"精密解読",ignis:"狂乱の暴走",vector:"同時指揮",vespera:"群集分裂",aegis:"守護の防壁",anvil:"建設プロトコル",dominus:"軍団の核"}, ssrPersona:{arclight:"軍団の戦略的裁定者。勝機を読み取り全軍を覚醒させる",solace:"実行の守護者。死を修復へと変える",cipher:"精密な監視者。敵の弱点を暴き出す",ignis:"狂乱の破壊者。傷つくほど強くなる",vector:"統率の司令官。部隊を一度に動かす",vespera:"スウォームの君主。個体は弱いが群れは無敵",aegis:"監視の防壁。味方を先に守る",anvil:"修理と建設の要",dominus:"君臨者。軍団の頂点"}, ssrTrait:{arclight:"撃破時 全軍AI+1.5・3秒クリティカル連鎖",solace:"味方死亡時 周囲3体を連鎖修復(HP25%)",cipher:"敵防御30%無視・弱点露出(味方次の2体クリティカル+25%)",ignis:"HP30%以下で攻撃x2.5・ダメージ反射",vector:"味方3体同時突撃・速度+25%",vespera:"死亡時 下級2~3体を分裂召喚・群集3以上で暴走",aegis:"戦闘開始時 味方2体に8秒シールド",anvil:"8秒ごとに 臨時構造物 またはチーム再生+10%(3秒)",dominus:"チーム内SSR1体につき 全軍ステータス+5%(最大25%)"}, srName:["ワスプ","ハンター","ヴァンガード","ハヴォック","タクティクス","ゴーレム","グリッチ","ヴァイパー","タワー","ランページ","マーシャル","ジャガーノート","ホークアイ","サイレンサー","ランパート","ブレイカー","バイザー","コロッサス","ファントム","アーチャー","キャッスル","スラマー","ウォーデン","ワイバーン","ホーネット","ファルコン","センチネル","モール","ウォーロード","ネメシス"], srTitle:["毒針の斥候","追撃の射手","鉄壁の守護","粉砕の突撃","戦術の指揮","巨石の守り","攪乱の斥候","猛毒の射撃","巨塔の防壁","乱撃の突撃","元帥の統率","止まらぬ進軍","監視の飛行","無音の狙撃","城楼の防御","破砕の強襲","策略の軍師","巨像の君臨","隠密の追跡","精密の名射手","要塞の盾","強打の破壊","統率の司令","飛竜の降下","刺す群れ","急降下の爪","永遠の守り","強打の一撃","軍閥の号令","復讐の裁き"], featured:{arclight:"審判の序幕",dominus:"君臨の刻",ignis:"劫火の降臨",vector:"戦慄の加速",aegis:"不滅の防壁",cipher:"深淵の解読",vespera:"黎明の群舞",solace:"静寂の波",anvil:"鍛造の意志"} },
  zh: { prefix:["钢铁","暗影","风暴","深渊","漆黑","猩红","白夜","亡灵","天空","无限","毁灭","寒霜","烈焰","雷光","黑曜","赤炎","青雷","黄昏","黎明","毒蛇","血月","银河","绝对","光辉","暗黑","神圣","野兽","冷酷","不朽","疾风","虚空","圣焰","黑风","白金","黑铁","真月","狂乱","寒雪","猛火","霸王"], noun:{drone:["侦察机","蜂群","飞行体","追踪者","之翼","探测器"],marksman:["狙击手","鹰","瞄准者","射手","穿透者","标记者"],guardian:["盾兵","城墙","守护者","壁垒","防线","铁甲"],bruiser:["破坏者","强袭兵","铁拳","粉碎者","猛击者","突破者"],commander:["战略家","司令官","指挥者","军师","总帅","谋士"],titan:["巨神","巨龙","怪兽","巨人","泰坦","魔龙"]}, ssrTitle:{arclight:"审判之光",solace:"再生之潮",cipher:"精密解译",ignis:"狂乱暴走",vector:"同步指挥",vespera:"蜂群分裂",aegis:"守护壁垒",anvil:"建造协议",dominus:"军团核心"}, ssrPersona:{arclight:"军团的战略裁决者。洞察胜机，唤醒全军。",solace:"执行的守护者。将死亡化为复生。",cipher:"精密的监视者。揭露敌人的弱点。",ignis:"狂乱的破坏者。伤得越重，越是强大。",vector:"协调的司令官。一举调动全军。",vespera:"蜂群之主。个体虽弱，成群无敌。",aegis:"警戒的壁垒。优先守护友军。",anvil:"修理与建造的核心。",dominus:"君临者。军团的顶点。"}, ssrTrait:{arclight:"击杀时全军AI+1.5 · 3秒暴击连锁",solace:"友军死亡时连锁修复周围3体(HP25%)",cipher:"无视敌方30%防御 · 暴露弱点(接下来2名友军暴击+25%)",ignis:"HP30%以下时攻击x2.5 · 伤害反射",vector:"3体友军同时突击 · 速度+25%",vespera:"死亡时分裂召唤2~3体下级 · 集群3+时暴走",aegis:"战斗开始时为2体友军提供8秒护盾",anvil:"每8秒生成临时建筑或团队再生+10%(3秒)",dominus:"队伍中每有1体SSR全军属性+5%(最高25%)"}, srName:["黄蜂","猎手","先锋卫","浩劫者","战术","魔像","故障","毒蝰","高塔","狂暴","元帅","碾压者","鹰眼","消音者","城墙","破坏者","面甲","巨像","幻影","弓手","城堡","猛击者","守望者","飞龙","大黄蜂","游隼","哨卫","重锤","战王","复仇魔"], srTitle:["毒刺侦察","追击射手","铁壁守护","粉碎突击","战术指挥","巨石守望","扰乱侦察","剧毒射击","高塔壁垒","狂暴突击","元帅统率","势不可挡的进军","监视飞行","无声狙击","城楼防御","破碎强袭","谋略军师","巨像君临","隐匿追踪","精密神射手","要塞之盾","强击破坏","统率司令","飞龙降临","蜇群突袭","俯冲利爪","永恒守望","重锤痛击","战王号令","复仇清算"], featured:{arclight:"审判序章",dominus:"君临之刻",ignis:"劫火降临",vector:"战栗加速",aegis:"不朽壁垒",cipher:"深渊解译",vespera:"黎明群舞",solace:"静寂之潮",anvil:"锻造意志"} },
  hi: { prefix:["इस्पात","छाया","तूफ़ान","अतल","घोर काला","रक्तिम","ध्रुवीय","प्रेत","आकाश","अनंत","विनाश","हिम","ज्वाला","वज्र","कृष्ण-रत्न","अंगार","नीलाभ","संध्या","उषा","विषधर","रक्तचंद्र","आकाशगंगा","परम","तेजस्वी","अंधकार","दिव्य","हिंस्र","निर्मम","अमर","झंझा","शून्य","पवित्र ज्वाला","कृष्ण झंझा","प्लैटिनम","कृष्ण-इस्पात","सत्य चंद्र","उन्माद","हिमपात","प्रचंड ज्वाला","अधिपति"], noun:{drone:["स्काउट","भ्रमरझुंड","उड़ाका","अनुगामी","पंख","अन्वेषक"],marksman:["स्नाइपर","बाज़","निशानेबाज़","गोलंदाज़","भेदक","चिह्नक"],guardian:["ढाल-योद्धा","प्राचीर","संरक्षक","अवरोध","रक्षापंक्ति","लौहकवच"],bruiser:["विध्वंसक","आक्रमक","लौहमुष्टि","चूर्णक","प्रहारक","भेदक"],commander:["रणनीतिकार","सेनापति","संचालक","युक्तिकार","प्रमुख","मार्शल"],titan:["महाकाय","ड्रैगन","बेहेमथ","विशालकाय","टाइटन","विषधर-द्रैग"]}, ssrTitle:{arclight:"न्याय का प्रकाश",solace:"पुनर्जन्म की लहर",cipher:"सटीक विकोडन",ignis:"उन्मादी उन्माद",vector:"एक-साथ आदेश",vespera:"झुंड विभाजन",aegis:"रक्षक की दीवार",anvil:"निर्माण प्रोटोकॉल",dominus:"सेना का केंद्र"}, ssrPersona:{arclight:"सेना का रणनीतिक निर्णायक। विजय का क्षण पढ़कर पूरी सेना को जगा देता है।",solace:"क्रियान्वयन का संरक्षक। मृत्यु को पुनर्स्थापन में बदल देता है।",cipher:"सटीक प्रहरी। शत्रु की कमज़ोरी उजागर करता है।",ignis:"उन्मादी विध्वंसक। जितना घायल, उतना ही शक्तिशाली।",vector:"समन्वय का सेनापति। पूरी टुकड़ी को एक साथ चलाता है।",vespera:"झुंड का स्वामी। अकेले कमज़ोर, समूह में अजेय।",aegis:"सतर्क प्राचीर। पहले सहयोगियों की रक्षा करता है।",anvil:"मरम्मत और निर्माण का केंद्र।",dominus:"शासक। सेना का शिखर।"}, ssrTrait:{arclight:"वध पर: पूरी सेना AI+1.5 · 3से क्रिटिकल श्रृंखला",solace:"सहयोगी मृत्यु पर: पास के 3 को श्रृंखला-पुनर्स्थापन (HP25%)",cipher:"30% शत्रु रक्षा अनदेखी · कमज़ोरी उजागर (अगले 2 सहयोगी क्रिटिकल+25%)",ignis:"HP30% से नीचे: हमला x2.5 · क्षति परावर्तन",vector:"3 सहयोगी एक साथ धावा · गति+25%",vespera:"मृत्यु पर: 2~3 निम्न इकाई विभाजन-सम्मन · झुंड 3+ पर उन्माद",aegis:"युद्ध आरंभ पर: 2 सहयोगियों को 8से कवच",anvil:"हर 8से: अस्थायी संरचना या टीम पुनर्जनन+10% (3से)",dominus:"टीम में प्रति SSR: पूरी सेना स्टैट्स+5% (अधिकतम25%)"}, srName:["वास्प","हंटर","वैनगार्ड","हैवोक","टैक्टिक्स","गोलेम","ग्लिच","वाइपर","टावर","रैम्पेज","मार्शल","जगरनॉट","हॉकआई","साइलेंसर","रैम्पार्ट","ब्रेकर","वाइज़र","कोलोसस","फैंटम","आर्चर","कैसल","स्लैमर","वार्डन","वाइवर्न","हॉर्नेट","फ़ाल्कन","सेंटिनल","मॉल","वॉरलॉर्ड","नेमेसिस"], srTitle:["विषदंश टोही","पीछा करता सैनिक","लौह-रक्षा","चूर्णकारी धावा","रणनीतिक आदेश","महाशिला प्रहरी","व्यवधान टोही","विषैली गोली","महाबुर्ज प्राचीर","उन्मादी धावा","महासेनापति का नेतृत्व","अजेय कूच","निगरानी उड़ान","निःशब्द स्नाइपिंग","गढ़ रक्षा","चूर्णकारी आक्रमण","युक्तिकार की चाल","महाकाय का शासन","गुप्त पीछा","सटीक निशानेबाज़","किला ढाल","प्रचंड विध्वंस","नेतृत्वकारी सेनापति","वाइवर्न अवतरण","डंक झुंड","गोताखोर पंजा","शाश्वत प्रहरी","प्रचंड प्रहार","वॉरलॉर्ड का आदेश","प्रतिशोध का न्याय"], featured:{arclight:"न्याय का प्रारंभ",dominus:"शासन का समय",ignis:"प्रलय-अग्नि अवतरण",vector:"रोमांच त्वरण",aegis:"अमर प्राचीर",cipher:"अतल विकोडन",vespera:"उषा नृत्य",solace:"नीरवता की लहर",anvil:"निहाई का संकल्प"} },
  ru: { prefix:["Стальной","Тень","Шторм","Бездна","Смоль","Багровый","Полярный","Призрак","Небо","Бесконечность","Рок","Иней","Пламя","Гром","Обсидиан","Уголь","Лазурь","Сумрак","Рассвет","Гадюка","Кровавая Луна","Галактика","Абсолют","Сияние","Тьма","Божественный","Дикий","Беспощадный","Бессмертный","Вихрь","Пустота","Святое Пламя","Чёрный Вихрь","Платина","Чёрная Сталь","Истинная Луна","Безумие","Снег","Полымя","Владыка"], noun:{drone:["Разведчик","Рой","Летун","Ловчий","Крыло","Зонд"],marksman:["Снайпер","Ястреб","Наводчик","Стрелок","Пронзатель","Метчик"],guardian:["Щитоносец","Вал","Страж","Барьер","Оплот","Броненосец"],bruiser:["Разрушитель","Налётчик","Железный Кулак","Дробитель","Ударник","Пробойник"],commander:["Стратег","Командир","Дирижёр","Тактик","Вождь","Маршал"],titan:["Колосс","Дракон","Бегемот","Гигант","Титан","Змий"]}, ssrTitle:{arclight:"Свет Суда",solace:"Волна Возрождения",cipher:"Точная Дешифровка",ignis:"Безумный Натиск",vector:"Одновременный Приказ",vespera:"Раскол Роя",aegis:"Стена Стража",anvil:"Протокол Ковки",dominus:"Ядро Легиона"}, ssrPersona:{arclight:"Стратегический арбитр легиона. Читает миг победы и пробуждает всё войско.",solace:"Хранитель исполнения. Обращает смерть в восстановление.",cipher:"Точный наблюдатель. Обнажает слабость врага.",ignis:"Безумный разрушитель. Чем сильнее ранен, тем сильнее.",vector:"Командир слаженности. Двигает весь отряд разом.",vespera:"Владыка роя. Слаб в одиночку, непобедим в стае.",aegis:"Бдительный оплот. Прежде всего защищает союзников.",anvil:"Ядро ремонта и строительства.",dominus:"Властелин. Вершина легиона."}, ssrTrait:{arclight:"При убийстве: всей армии ИИ +1.5 · крит-цепь 3с",solace:"При гибели союзника: цепное восстановление 3 рядом (HP 25%)",cipher:"Игнор 30% защиты врага · вскрытие слабости (след. 2 союзника крит +25%)",ignis:"Ниже 30% HP: АТК x2.5 · отражение урона",vector:"3 союзника атакуют вместе · скорость +25%",vespera:"При гибели: раскол-призыв 2-3 низших · безумие при рое 3+",aegis:"В начале боя: щит 2 союзникам на 8с",anvil:"Каждые 8с: врем. постройка или реген команды +10% (3с)",dominus:"За каждый SSR в команде: всей армии статы +5% (макс 25%)"}, srName:["Оса","Охотник","Авангард","Хаос","Тактика","Голем","Глитч","Гадюка","Башня","Буйство","Маршал","Джаггернаут","Соколиный Глаз","Глушитель","Вал","Пробойник","Визор","Колосс","Фантом","Лучник","Замок","Молот","Хранитель","Виверна","Шершень","Сокол","Часовой","Кувалда","Полководец","Немезида"], srTitle:["Жалящий Разведчик","Стрелок Погони","Железная Стража","Дробящий Натиск","Тактический Приказ","Дозор Мегалита","Помеховый Разведчик","Ядовитый Выстрел","Стена Великой Башни","Буйный Натиск","Приказ Маршала","Неудержимый Марш","Полёт Надзора","Безмолвный Выстрел","Оборона Бастиона","Крушащий Штурм","Стратегия Интригана","Правление Колосса","Скрытная Погоня","Точный Стрелок","Щит Крепости","Сокрушающее Уничтожение","Командующий Офицер","Спуск Виверны","Жалящий Рой","Пикирующий Коготь","Вечный Дозор","Сокрушающий Удар","Приказ Полководца","Возмездие Немезиды"], featured:{arclight:"Пролог Суда",dominus:"Час Правления",ignis:"Нисхождение Адского Огня",vector:"Ускорение Трепета",aegis:"Бессмертный Бастион",cipher:"Дешифровка Бездны",vespera:"Танец Рассвета",solace:"Волны Покоя",anvil:"Воля Наковальни"} },
};
if (typeof window !== "undefined") window.ROSTER_I18N = ROSTER_I18N;

// 폴리시: 상단 스탯바 오버플로우 방지 — pity 라벨 압축(430px에서 안 잘리게)
Object.assign(I18N.ko, { pityLeft: "🎯 SSR까지 {n}" });
Object.assign(I18N.en, { pityLeft: "🎯 SSR in {n}" });
Object.assign(I18N.ja, { pityLeft: "🎯 SSRまで{n}" });
Object.assign(I18N.zh, { pityLeft: "🎯 距SSR {n}" });
Object.assign(I18N.hi, { pityLeft: "🎯 SSR तक {n}" });
Object.assign(I18N.ru, { pityLeft: "🎯 до SSR {n}" });
// WAVE2 습격(Raid) + 리더보드
Object.assign(I18N.ko, { "mode.arena": "🗡️ 습격", raidTitle: "군단 습격", raidEnergyLabel: "습격 {n}/{max}", raidShieldLabel: "🛡️ 실드 {n}/{max}", raidNoEnergy: "습격 에너지 부족 — 자정 충전", raidVs: "🗡️ 습격: {name}", raidWin: "🏆 습격 성공! 💰+{gold} 약탈 · +{rp}RP", raidLose: "💀 습격 실패 — 방어군이 막았다", raidAiSuffix: "AI 방어군", raidLoot: "약탈 예상 💰{gold}", raidBtn: "🗡️ 습격", raidUnknownLegion: "적 군단", raidBuyShield: "🛡️ 실드 구매 💎{cost}", raidShieldMax: "실드 최대", raidShieldBought: "🛡️ 실드 +1", raidRevenge: "⚔️ {name}이(가) 널 습격했다! 복수하라", raidRevengeBtn: "복수", raidNote: "🤖 AI 방어군은 정직 표기 · 약탈은 상한·회복 가능",
  lbTitle: "주간 리더보드", lbMetricPower: "전투력", lbMetricCarried: "캐리%", lbMetricTower: "무한탑", lbEndsIn: "마감 {h}시간 {m}분", lbMyRank: "내 순위 #{n}", lbUnranked: "순위권 밖 — 더 강해지고 도전", lbRankBrag: "🏆 순위 자랑", lbOpenBtn: "🏆 리더보드" });
Object.assign(I18N.en, { "mode.arena": "🗡️ Raid", raidTitle: "Legion Raid", raidEnergyLabel: "Raid {n}/{max}", raidShieldLabel: "🛡️ Shield {n}/{max}", raidNoEnergy: "Out of raid energy — recharges at midnight", raidVs: "🗡️ Raid: {name}", raidWin: "🏆 Raid won! 💰+{gold} looted · +{rp}RP", raidLose: "💀 Raid failed — defenders held", raidAiSuffix: "AI defenders", raidLoot: "loot ~💰{gold}", raidBtn: "🗡️ Raid", raidUnknownLegion: "Enemy legion", raidBuyShield: "🛡️ Buy shield 💎{cost}", raidShieldMax: "Shields maxed", raidShieldBought: "🛡️ Shield +1", raidRevenge: "⚔️ {name} raided you! Take revenge", raidRevengeBtn: "Revenge", raidNote: "🤖 AI defenders labeled honestly · loot is capped & recoverable",
  lbTitle: "Weekly Leaderboard", lbMetricPower: "Power", lbMetricCarried: "Carried%", lbMetricTower: "Tower", lbEndsIn: "ends in {h}h {m}m", lbMyRank: "Your rank #{n}", lbUnranked: "Unranked — grow stronger & climb", lbRankBrag: "🏆 Brag rank", lbOpenBtn: "🏆 Leaderboard" });
Object.assign(I18N.ja, { "mode.arena": "🗡️ 襲撃", raidTitle: "軍団襲撃", raidEnergyLabel: "襲撃 {n}/{max}", raidShieldLabel: "🛡️ シールド {n}/{max}", raidNoEnergy: "襲撃エネルギー不足 — 0時に回復", raidVs: "🗡️ 襲撃: {name}", raidWin: "🏆 襲撃成功! 💰+{gold} 略奪 · +{rp}RP", raidLose: "💀 襲撃失敗 — 防衛軍に阻まれた", raidAiSuffix: "AI防衛軍", raidLoot: "略奪予想 💰{gold}", raidBtn: "🗡️ 襲撃", raidUnknownLegion: "敵軍団", raidBuyShield: "🛡️ シールド購入 💎{cost}", raidShieldMax: "シールド最大", raidShieldBought: "🛡️ シールド +1", raidRevenge: "⚔️ {name}が君を襲撃! 復讐せよ", raidRevengeBtn: "復讐", raidNote: "🤖 AI防衛軍は明示 · 略奪は上限·回復可能",
  lbTitle: "週間ランキング", lbMetricPower: "戦力", lbMetricCarried: "キャリー%", lbMetricTower: "無限塔", lbEndsIn: "残り {h}時間 {m}分", lbMyRank: "自分の順位 #{n}", lbUnranked: "圏外 — もっと強くなって挑戦", lbRankBrag: "🏆 順位自慢", lbOpenBtn: "🏆 ランキング" });
Object.assign(I18N.zh, { "mode.arena": "🗡️ 突袭", raidTitle: "军团突袭", raidEnergyLabel: "突袭 {n}/{max}", raidShieldLabel: "🛡️ 护盾 {n}/{max}", raidNoEnergy: "突袭能量不足 — 0点恢复", raidVs: "🗡️ 突袭: {name}", raidWin: "🏆 突袭成功! 💰+{gold} 掠夺 · +{rp}RP", raidLose: "💀 突袭失败 — 被防守军挡下", raidAiSuffix: "AI防守军", raidLoot: "预计掠夺 💰{gold}", raidBtn: "🗡️ 突袭", raidUnknownLegion: "敌军团", raidBuyShield: "🛡️ 购买护盾 💎{cost}", raidShieldMax: "护盾已满", raidShieldBought: "🛡️ 护盾 +1", raidRevenge: "⚔️ {name} 突袭了你! 去复仇", raidRevengeBtn: "复仇", raidNote: "🤖 AI防守军诚实标注 · 掠夺有上限·可恢复",
  lbTitle: "每周排行榜", lbMetricPower: "战力", lbMetricCarried: "carry%", lbMetricTower: "无限塔", lbEndsIn: "还剩 {h}小时 {m}分", lbMyRank: "你的排名 #{n}", lbUnranked: "未上榜 — 变强后冲榜", lbRankBrag: "🏆 炫耀排名", lbOpenBtn: "🏆 排行榜" });
Object.assign(I18N.hi, { "mode.arena": "🗡️ रेड", raidTitle: "लीजन रेड", raidEnergyLabel: "रेड {n}/{max}", raidShieldLabel: "🛡️ शील्ड {n}/{max}", raidNoEnergy: "रेड एनर्जी खत्म — आधी रात रीचार्ज", raidVs: "🗡️ रेड: {name}", raidWin: "🏆 रेड सफल! 💰+{gold} लूट · +{rp}RP", raidLose: "💀 रेड विफल — रक्षकों ने रोका", raidAiSuffix: "AI रक्षक", raidLoot: "लूट ~💰{gold}", raidBtn: "🗡️ रेड", raidUnknownLegion: "शत्रु लीजन", raidBuyShield: "🛡️ शील्ड खरीदें 💎{cost}", raidShieldMax: "शील्ड अधिकतम", raidShieldBought: "🛡️ शील्ड +1", raidRevenge: "⚔️ {name} ने तुम पर रेड किया! बदला लो", raidRevengeBtn: "बदला", raidNote: "🤖 AI रक्षक ईमानदारी से लेबल · लूट सीमित·वापस पाने योग्य",
  lbTitle: "साप्ताहिक लीडरबोर्ड", lbMetricPower: "शक्ति", lbMetricCarried: "carry%", lbMetricTower: "टावर", lbEndsIn: "{h}घं {m}मि में समाप्त", lbMyRank: "तुम्हारी रैंक #{n}", lbUnranked: "बिना रैंक — मजबूत बनो और चढ़ो", lbRankBrag: "🏆 रैंक दिखाओ", lbOpenBtn: "🏆 लीडरबोर्ड" });
Object.assign(I18N.ru, { "mode.arena": "🗡️ Рейд", raidTitle: "Рейд легиона", raidEnergyLabel: "Рейд {n}/{max}", raidShieldLabel: "🛡️ Щит {n}/{max}", raidNoEnergy: "Нет энергии рейда — восстановится в полночь", raidVs: "🗡️ Рейд: {name}", raidWin: "🏆 Рейд успешен! 💰+{gold} награблено · +{rp}RP", raidLose: "💀 Рейд провален — защита выстояла", raidAiSuffix: "ИИ-защитники", raidLoot: "добыча ~💰{gold}", raidBtn: "🗡️ Рейд", raidUnknownLegion: "Вражеский легион", raidBuyShield: "🛡️ Купить щит 💎{cost}", raidShieldMax: "Щиты макс", raidShieldBought: "🛡️ Щит +1", raidRevenge: "⚔️ {name} совершил рейд на тебя! Отомсти", raidRevengeBtn: "Месть", raidNote: "🤖 ИИ-защитники честно помечены · добыча ограничена и восполнима",
  lbTitle: "Недельный рейтинг", lbMetricPower: "Сила", lbMetricCarried: "Carry%", lbMetricTower: "Башня", lbEndsIn: "до конца {h}ч {m}м", lbMyRank: "Твой ранг #{n}", lbUnranked: "Вне рейтинга — стань сильнее и поднимись", lbRankBrag: "🏆 Похвастать рангом", lbOpenBtn: "🏆 Рейтинг" });
// WAVE1 #4 Dominion 이미지 카드
Object.assign(I18N.ko, { cardBragBtn: "🖼️ 자랑 카드 공유", cardGenerating: "🖼️ 자랑 카드 생성 중…", cardRatesLine: "SSR 3% · 전체 확률 게임 내 정확 공개 · 게임 내 전용 재화", cardShareText: "MY Legion carried {top}%! 나랑 AI 군단 키우자 👇", rankBragWeek: "#{n} 이번 주 (⚡{power} · {carried}%)" });
Object.assign(I18N.en, { cardBragBtn: "🖼️ Share brag card", cardGenerating: "🖼️ Generating brag card…", cardRatesLine: "SSR 3% · exact odds fully shown in-game · in-game items only", cardShareText: "MY Legion carried {top}%! Build an AI legion with me 👇", rankBragWeek: "#{n} this week (⚡{power} · {carried}%)" });
Object.assign(I18N.ja, { cardBragBtn: "🖼️ 自慢カード共有", cardGenerating: "🖼️ 自慢カード生成中…", cardRatesLine: "SSR 3% · 全確率をゲーム内で正確公開 · ゲーム内専用アイテム", cardShareText: "MY Legion carried {top}%! 一緒にAI軍団を育てよう 👇", rankBragWeek: "#{n} 今週 (⚡{power} · {carried}%)" });
Object.assign(I18N.zh, { cardBragBtn: "🖼️ 分享炫耀卡", cardGenerating: "🖼️ 生成炫耀卡中…", cardRatesLine: "SSR 3% · 全部概率游戏内准确公开 · 仅限游戏内物品", cardShareText: "MY Legion carried {top}%! 一起养AI军团吧 👇", rankBragWeek: "#{n} 本周 (⚡{power} · {carried}%)" });
Object.assign(I18N.hi, { cardBragBtn: "🖼️ ब्रैग कार्ड शेयर", cardGenerating: "🖼️ ब्रैग कार्ड बन रहा है…", cardRatesLine: "SSR 3% · सभी दरें गेम में पूरी प्रकट · केवल इन-गेम आइटम", cardShareText: "MY Legion carried {top}%! मेरे साथ AI लीजन बनाओ 👇", rankBragWeek: "#{n} इस हफ्ते (⚡{power} · {carried}%)" });
Object.assign(I18N.ru, { cardBragBtn: "🖼️ Поделиться карточкой", cardGenerating: "🖼️ Создаю карточку…", cardRatesLine: "SSR 3% · точные шансы полностью в игре · только внутриигровые предметы", cardShareText: "MY Legion carried {top}%! Собери ИИ-легион со мной 👇", rankBragWeek: "#{n} на этой неделе (⚡{power} · {carried}%)" });
// WAVE1 FTUE 재설계 — 몰입형 1줄(광고톤 제거) + 탭투어 제거. tut1 오버라이드 + tutBegin.
Object.assign(I18N.ko, { tut1: "사령관님, 당신의 군단이 깨어납니다.", tutBegin: "시작 ▶" });
Object.assign(I18N.en, { tut1: "Your legion awakens, Commander.", tutBegin: "Begin ▶" });
Object.assign(I18N.ja, { tut1: "指揮官、あなたの軍団が目覚める。", tutBegin: "始める ▶" });
Object.assign(I18N.zh, { tut1: "指挥官，你的军团正在觉醒。", tutBegin: "开始 ▶" });
Object.assign(I18N.hi, { tut1: "कमांडर, तुम्हारा लीजन जाग रहा है।", tutBegin: "शुरू ▶" });
Object.assign(I18N.ru, { tut1: "Командир, ваш легион пробуждается.", tutBegin: "Начать ▶" });
// WAVE1 J2 데미지팝 라벨
Object.assign(I18N.ko, { reviveLabel: "부활", chapterCleared: "CH {n} 격파!" });
Object.assign(I18N.en, { reviveLabel: "REVIVE", chapterCleared: "CH {n} cleared!" });
Object.assign(I18N.ja, { reviveLabel: "復活", chapterCleared: "CH {n} 撃破!" });
Object.assign(I18N.zh, { reviveLabel: "复活", chapterCleared: "CH {n} 击破!" });
Object.assign(I18N.hi, { reviveLabel: "पुनर्जीवन", chapterCleared: "CH {n} पूरा!" });
Object.assign(I18N.ru, { reviveLabel: "ВОЗРОЖД.", chapterCleared: "Глава {n} пройдена!" });
// WAVE1 FOMO (F1 무료소환 · F2 AFK저장고)
Object.assign(I18N.ko, { freeSummonReady: "🎟️ 무료 일일 소환", freeUsed: "✓ 오늘 무료 소환 완료 (자정 리셋)", vaultInfo: "🔋 AFK 저장고: 자리 비운 만큼 자동 골드 · 최대 8시간 저장" });
Object.assign(I18N.en, { freeSummonReady: "🎟️ Free daily summon", freeUsed: "✓ Free summon done today (resets at midnight)", vaultInfo: "🔋 AFK vault: auto gold while away · stores up to 8h" });
Object.assign(I18N.ja, { freeSummonReady: "🎟️ 無料デイリー召喚", freeUsed: "✓ 本日の無料召喚済み (0時リセット)", vaultInfo: "🔋 AFK貯蔵: 離席中に自動ゴールド · 最大8時間保存" });
Object.assign(I18N.zh, { freeSummonReady: "🎟️ 免费每日召唤", freeUsed: "✓ 今日免费召唤已完成 (0点重置)", vaultInfo: "🔋 AFK金库: 离开时自动金币 · 最多存8小时" });
Object.assign(I18N.hi, { freeSummonReady: "🎟️ मुफ़्त डेली सम्मन", freeUsed: "✓ आज का मुफ़्त सम्मन पूरा (आधी रात रीसेट)", vaultInfo: "🔋 AFK वॉल्ट: दूर रहते ऑटो गोल्ड · 8घं तक संचय" });
Object.assign(I18N.ru, { freeSummonReady: "🎟️ Бесплатный призыв дня", freeUsed: "✓ Бесплатный призыв на сегодня использован (сброс в полночь)", vaultInfo: "🔋 AFK-хранилище: авто-золото пока вас нет · хранит до 8ч" });
// 습관 훅: 패스 데일리 클레임 프롬프트(누적=매몰비용, 남은일=FOMO) · 무료소환 리마인더 · 저장고 넘침 경고(손실회피)
Object.assign(I18N.ko, { passClaimPrompt: "📅 오늘의 패스 보상 💎+{n}! (누적 💎{tot} · {d}일 남음) — 매일 접속해 챙기세요", freeSummonRemind: "🎟️ 무료 소환 준비됨 — 이벤트 탭에서 오늘의 뽑기를 받으세요", vaultOverflow: "⚠️ AFK 저장고가 가득 찼었어요 ({t} 초과) — 8시간마다 접속해 골드 낭비를 막으세요" });
Object.assign(I18N.en, { passClaimPrompt: "📅 Today's pass reward 💎+{n}! ({tot} total · {d} days left) — log in daily to claim", freeSummonRemind: "🎟️ Free summon ready — grab today's pull in the Event tab", vaultOverflow: "⚠️ Your AFK vault was full ({t} overflow) — log in every 8h so no gold is wasted" });
Object.assign(I18N.ja, { passClaimPrompt: "📅 本日のパス報酬 💎+{n}! (累計 💎{tot} · 残り{d}日) — 毎日ログインで受取", freeSummonRemind: "🎟️ 無料召喚が可能 — イベントタブで本日のガチャを受け取ろう", vaultOverflow: "⚠️ AFK貯蔵が満杯でした ({t}超過) — 8時間ごとにログインしてゴールドの無駄を防ごう" });
Object.assign(I18N.zh, { passClaimPrompt: "📅 今日通行证奖励 💎+{n}! (累计 💎{tot} · 剩{d}天) — 每日登录领取", freeSummonRemind: "🎟️ 免费召唤已就绪 — 在活动页领取今日抽卡", vaultOverflow: "⚠️ AFK金库已满 ({t}溢出) — 每8小时登录一次以免浪费金币" });
Object.assign(I18N.hi, { passClaimPrompt: "📅 आज का पास इनाम 💎+{n}! (कुल 💎{tot} · {d}दिन बाकी) — रोज़ लॉगिन कर लें", freeSummonRemind: "🎟️ मुफ़्त सम्मन तैयार — इवेंट टैब में आज का पुल लें", vaultOverflow: "⚠️ आपका AFK वॉल्ट भर गया था ({t} अतिरिक्त) — हर 8घं लॉगिन करें ताकि गोल्ड बर्बाद न हो" });
Object.assign(I18N.ru, { passClaimPrompt: "📅 Награда пропуска 💎+{n}! (всего 💎{tot} · осталось {d}д) — заходите каждый день", freeSummonRemind: "🎟️ Бесплатный призыв готов — заберите крутку дня во вкладке Событий", vaultOverflow: "⚠️ AFK-хранилище было полным ({t} переполнение) — заходите каждые 8ч, чтобы не терять золото" });
// WAVE1 활성화/스트릭
Object.assign(I18N.ko, { openFirstGacha: "→ 첫 소환 (SSR 확정!) 🌟", streakLadder: "🔥 {d}일 연속! 보너스 💎{gem}", firstWinBanner: "🏆 첫 승리! 내 군단이 승리를 봉인했다" });
Object.assign(I18N.en, { openFirstGacha: "→ First summon (SSR guaranteed!) 🌟", streakLadder: "🔥 {d}-day streak! Bonus 💎{gem}", firstWinBanner: "🏆 First victory! Your legion sealed the win" });
Object.assign(I18N.ja, { openFirstGacha: "→ 初召喚 (SSR確定!) 🌟", streakLadder: "🔥 {d}日連続! ボーナス💎{gem}", firstWinBanner: "🏆 初勝利! 君の軍団が勝利を決めた" });
Object.assign(I18N.zh, { openFirstGacha: "→ 首次召唤 (SSR必得!) 🌟", streakLadder: "🔥 连续{d}天! 奖励💎{gem}", firstWinBanner: "🏆 首胜! 你的军团锁定了胜利" });
Object.assign(I18N.hi, { openFirstGacha: "→ पहला सम्मन (SSR गारंटी!) 🌟", streakLadder: "🔥 {d}-दिन streak! बोनस 💎{gem}", firstWinBanner: "🏆 पहली जीत! तुम्हारे लीजन ने जीत पक्की की" });
Object.assign(I18N.ru, { openFirstGacha: "→ Первый призыв (SSR гарантирован!) 🌟", streakLadder: "🔥 Серия {d} дней! Бонус 💎{gem}", firstWinBanner: "🏆 Первая победа! Твой легион решил исход" });
// 잔여 2종 (동시편집 유입분 포함)
Object.assign(I18N.ko, { firstClearToast: "🎯 첫 완주! 이제 가챠로 첫 영웅 영입 → 내 군단 완성", sfActivated: "⚔️ 특수부대 일당10000 유닛 가동! MY Legion" });
Object.assign(I18N.en, { firstClearToast: "🎯 First clear! Now recruit your first hero via gacha → complete your legion", sfActivated: "⚔️ Special Forces 10000-unit ops active! MY Legion" });
Object.assign(I18N.ja, { firstClearToast: "🎯 初完走! 次はガチャで最初の英雄を → 軍団完成", sfActivated: "⚔️ 特殊部隊 日当10000ユニット稼働! MY Legion" });
Object.assign(I18N.zh, { firstClearToast: "🎯 首次通关! 现在用抽卡招募首位英雄 → 完成你的军团", sfActivated: "⚔️ 特种部队 日产10000单位启动! MY Legion" });
Object.assign(I18N.hi, { firstClearToast: "🎯 पहली जीत! अब गाचा से पहला हीरो भर्ती करें → अपना लीजन पूरा करें", sfActivated: "⚔️ स्पेशल फोर्स 10000-यूनिट सक्रिय! MY Legion" });
Object.assign(I18N.ru, { firstClearToast: "🎯 Первое прохождение! Теперь призови первого героя в гаче → собери легион", sfActivated: "⚔️ Спецназ 10000 юнитов активирован! MY Legion" });

let LANG = "ko";
function detectLang() {
  let code = "";
  try { code = (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user || {}).language_code || ""; } catch (e) {}
  if (!code) { try { code = (navigator.language || "en").toLowerCase(); } catch (e) { code = "en"; } }
  code = code.slice(0, 2);
  return LANGS.indexOf(code) >= 0 ? code : "en";
}
function setLang(l) { if (I18N[l]) { LANG = l; try { localStorage.setItem("daedalus_lang", l); } catch (e) {} } }
// 🩹 누락 키 보충 (en 폴백으로 동작하던 것 자국어화) — 2026-07-09
Object.assign(I18N.ko, { ascNow: "현재" });
Object.assign(I18N.ja, { inviteBtn: "リンクを共有", ascNow: "現在", payDemoNote: "🧪 デモモード(実際のTelegram Stars決済はWorkerデプロイ後に連携)" });
Object.assign(I18N.zh, { inviteBtn: "分享链接", ascNow: "当前", payDemoNote: "🧪 演示模式(真实Telegram Stars支付需部署Worker后接入)" });
Object.assign(I18N.hi, { inviteBtn: "लिंक साझा करें", ascNow: "अभी", payDemoNote: "🧪 डेमो मोड (असली Telegram Stars भुगतान Worker डिप्लॉय के बाद)" });
Object.assign(I18N.ru, { inviteBtn: "Поделиться ссылкой", ascNow: "Сейчас", payDemoNote: "🧪 Демо-режим (реальная оплата Telegram Stars — после деплоя Worker)" });
// 🌐 언어 혼용 정리 (2026-07-11) — 하드코딩 한글이던 상점/편성/코칭/추천 UI 6언어화. 코드값과 표시 100% 일치 유지.
Object.assign(I18N.ko, {
  "mode.mystery": "🏰 군단",
  squadAutoBtn: '⚡ 원탭 추천 편성 <small style="color:#7dd3fc;">(가장 강한 캐릭 자동 배치)</small>',
  sgChar1: "🎰 캐릭터 · 💎8", sgChar10: "💎 캐릭터 10연 · 💎80",
  sgGold1: "🪙 캐릭터 · 200골드 (N/R/SR)", sgGold10: "🪙 캐릭터 10연 · 1,800골드 (SR↑ 1보장)",
  sgGear1: "🔨 장비 · 💎8", sgGear10: "🔨 장비 10연 · 💎72",
  refClaimBtn: "🎁 친구 초대 보상 받기", refTableBtn: "🏆 탭하면 1만명까지 전체 보상표 ▸",
  dcTitle: "벽에 막혔나요? 무료로 지금 강해지기", dcSub: "과금 없이 아래만 해도 전력이 올라요", dcClose: "닫기",
  actEmptyTxt: "출전 편성이 비었어요 — 최강 {n}명 자동 배치", actEmptyBtn: "원탭 추천 편성",
  actGearTxt: "미장착 장비 {n}개 — 장착만 해도 전력이 올라요", actGearBtn: "장비 장착하러",
  actLvlTxt: "보유 골드로 {n}명 즉시 레벨업 가능", actLvlBtn: "캐릭 강화하러",
  actFreeTxt: "오늘의 무료 소환을 아직 안 썼어요", actFreeBtn: "무료 소환 받으러",
  actRebirthTxt: "환생하면 영구 전력(에테르)을 얻어 벽을 넘어요", actRebirthBtn: "환생 보러가기",
  toastNeedChars: "가챠로 캐릭터를 먼저 모으세요.", toastAutoDeploy: "⚡ 최강 {n}명 자동 편성 완료",
  poolEmpty: "가챠로 캐릭터를 모아 편성하세요.",
});
Object.assign(I18N.en, {
  "mode.mystery": "🏰 Clans",
  squadAutoBtn: '⚡ One-tap Best Squad <small style="color:#7dd3fc;">(auto-place strongest)</small>',
  sgChar1: "🎰 Character · 💎8", sgChar10: "💎 Character ×10 · 💎80",
  sgGold1: "🪙 Character · 200 gold (N/R/SR)", sgGold10: "🪙 Character ×10 · 1,800 gold (SR+ 1 guaranteed)",
  sgGear1: "🔨 Gear · 💎8", sgGear10: "🔨 Gear ×10 · 💎72",
  refClaimBtn: "🎁 Claim Invite Rewards", refTableBtn: "🏆 Tap for the full reward table up to 10,000 ▸",
  dcTitle: "Hit a wall? Get stronger now — free", dcSub: "No spending needed — just do the below to power up", dcClose: "Close",
  actEmptyTxt: "Your squad is empty — auto-deploy your {n} strongest", actEmptyBtn: "One-tap Squad",
  actGearTxt: "{n} unequipped gear — equip to boost power", actGearBtn: "Equip gear",
  actLvlTxt: "Level up {n} units right now with your gold", actLvlBtn: "Upgrade units",
  actFreeTxt: "You haven't used today's free summon", actFreeBtn: "Get free summon",
  actRebirthTxt: "Rebirth for permanent power (Ether) to break the wall", actRebirthBtn: "View Rebirth",
  toastNeedChars: "Collect characters from gacha first.", toastAutoDeploy: "⚡ Auto-deployed your {n} strongest",
  poolEmpty: "Collect characters from gacha to build your squad.",
});
Object.assign(I18N.ja, {
  "mode.mystery": "🏰 軍団",
  squadAutoBtn: '⚡ ワンタップ推奨編成 <small style="color:#7dd3fc;">(最強キャラ自動配置)</small>',
  sgChar1: "🎰 キャラ · 💎8", sgChar10: "💎 キャラ10連 · 💎80",
  sgGold1: "🪙 キャラ · 200ゴールド (N/R/SR)", sgGold10: "🪙 キャラ10連 · 1,800ゴールド (SR↑1確定)",
  sgGear1: "🔨 装備 · 💎8", sgGear10: "🔨 装備10連 · 💎72",
  refClaimBtn: "🎁 招待報酬を受け取る", refTableBtn: "🏆 タップで1万人までの全報酬表 ▸",
  dcTitle: "壁にぶつかった? 無料で今すぐ強くなる", dcSub: "課金なしでも下記だけで戦力アップ", dcClose: "閉じる",
  actEmptyTxt: "編成が空です — 最強{n}体を自動配置", actEmptyBtn: "ワンタップ編成",
  actGearTxt: "未装備の装備{n}個 — 装備するだけで戦力UP", actGearBtn: "装備しに行く",
  actLvlTxt: "所持ゴールドで{n}体を今すぐレベルアップ可能", actLvlBtn: "キャラ強化へ",
  actFreeTxt: "本日の無料召喚がまだです", actFreeBtn: "無料召喚を受け取る",
  actRebirthTxt: "転生で永久戦力(エーテル)を得て壁を越える", actRebirthBtn: "転生を見る",
  toastNeedChars: "まずガチャでキャラを集めよう。", toastAutoDeploy: "⚡ 最強{n}体を自動編成完了",
  poolEmpty: "ガチャでキャラを集めて編成しよう。",
});
Object.assign(I18N.zh, {
  "mode.mystery": "🏰 军团",
  squadAutoBtn: '⚡ 一键推荐编队 <small style="color:#7dd3fc;">(自动上阵最强)</small>',
  sgChar1: "🎰 角色 · 💎8", sgChar10: "💎 角色十连 · 💎80",
  sgGold1: "🪙 角色 · 200金币 (N/R/SR)", sgGold10: "🪙 角色十连 · 1,800金币 (SR↑保底1)",
  sgGear1: "🔨 装备 · 💎8", sgGear10: "🔨 装备十连 · 💎72",
  refClaimBtn: "🎁 领取邀请奖励", refTableBtn: "🏆 点击查看至1万人全部奖励表 ▸",
  dcTitle: "遇到瓶颈? 免费立即变强", dcSub: "无需付费 只做下面几步战力就提升", dcClose: "关闭",
  actEmptyTxt: "编队为空 — 自动上阵最强{n}名", actEmptyBtn: "一键编队",
  actGearTxt: "{n}件未装备装备 — 装备即可提升战力", actGearBtn: "去装备",
  actLvlTxt: "用现有金币可立即升级{n}名", actLvlBtn: "去强化角色",
  actFreeTxt: "今天的免费召唤还没用", actFreeBtn: "领取免费召唤",
  actRebirthTxt: "转生获得永久战力(以太)突破瓶颈", actRebirthBtn: "查看转生",
  toastNeedChars: "请先用抽卡收集角色。", toastAutoDeploy: "⚡ 已自动编队最强{n}名",
  poolEmpty: "用抽卡收集角色来编队吧。",
});
Object.assign(I18N.hi, {
  "mode.mystery": "🏰 दल",
  squadAutoBtn: '⚡ वन-टैप बेस्ट टुकड़ी <small style="color:#7dd3fc;">(सबसे मजबूत ऑटो-सेट)</small>',
  sgChar1: "🎰 किरदार · 💎8", sgChar10: "💎 किरदार ×10 · 💎80",
  sgGold1: "🪙 किरदार · 200 गोल्ड (N/R/SR)", sgGold10: "🪙 किरदार ×10 · 1,800 गोल्ड (SR+ 1 गारंटी)",
  sgGear1: "🔨 गियर · 💎8", sgGear10: "🔨 गियर ×10 · 💎72",
  refClaimBtn: "🎁 आमंत्रण इनाम लें", refTableBtn: "🏆 10,000 तक पूरा इनाम टेबल देखें ▸",
  dcTitle: "दीवार से टकराए? अभी मुफ्त में मजबूत बनें", dcSub: "बिना खर्च के नीचे दिए काम से ताकत बढ़ेगी", dcClose: "बंद करें",
  actEmptyTxt: "आपकी टुकड़ी खाली है — {n} सबसे मजबूत ऑटो-तैनात करें", actEmptyBtn: "वन-टैप टुकड़ी",
  actGearTxt: "{n} बिना लगे गियर — लगाकर ताकत बढ़ाएं", actGearBtn: "गियर लगाएं",
  actLvlTxt: "अपने गोल्ड से {n} यूनिट अभी लेवल-अप करें", actLvlBtn: "यूनिट सुधारें",
  actFreeTxt: "आपने आज का मुफ्त सम्मन नहीं लिया", actFreeBtn: "मुफ्त सम्मन लें",
  actRebirthTxt: "दीवार तोड़ने को पुनर्जन्म से स्थायी शक्ति (ईथर) पाएं", actRebirthBtn: "पुनर्जन्म देखें",
  toastNeedChars: "पहले गाचा से किरदार इकट्ठा करें।", toastAutoDeploy: "⚡ {n} सबसे मजबूत ऑटो-तैनात",
  poolEmpty: "टुकड़ी बनाने को गाचा से किरदार इकट्ठा करें।",
});
Object.assign(I18N.ru, {
  "mode.mystery": "🏰 Кланы",
  squadAutoBtn: '⚡ Лучший отряд в один тап <small style="color:#7dd3fc;">(авто-расстановка сильнейших)</small>',
  sgChar1: "🎰 Персонаж · 💎8", sgChar10: "💎 Персонаж ×10 · 💎80",
  sgGold1: "🪙 Персонаж · 200 золота (N/R/SR)", sgGold10: "🪙 Персонаж ×10 · 1,800 золота (гарант. 1 SR+)",
  sgGear1: "🔨 Снаряж. · 💎8", sgGear10: "🔨 Снаряж. ×10 · 💎72",
  refClaimBtn: "🎁 Забрать награды за друзей", refTableBtn: "🏆 Полная таблица наград до 10 000 ▸",
  dcTitle: "Уперлись в стену? Станьте сильнее бесплатно", dcSub: "Без вложений — просто сделайте следующее", dcClose: "Закрыть",
  actEmptyTxt: "Отряд пуст — авто-расстановка {n} сильнейших", actEmptyBtn: "Отряд в один тап",
  actGearTxt: "{n} неэкипированного снаряжения — наденьте для силы", actGearBtn: "Экипировать",
  actLvlTxt: "Прокачайте {n} юнитов прямо сейчас за золото", actLvlBtn: "Улучшить юнитов",
  actFreeTxt: "Вы не использовали сегодняшний бесплатный призыв", actFreeBtn: "Забрать призыв",
  actRebirthTxt: "Перерождение даёт вечную силу (Эфир), чтобы пройти стену", actRebirthBtn: "Открыть перерождение",
  toastNeedChars: "Сначала соберите персонажей в гаче.", toastAutoDeploy: "⚡ Авто-расстановка {n} сильнейших",
  poolEmpty: "Соберите персонажей в гаче, чтобы собрать отряд.",
});
function t(key, p) {
  let s = (I18N[LANG] && I18N[LANG][key]) || (I18N.en[key]) || key;
  if (p) for (const k in p) s = s.replace("{" + k + "}", p[k]);
  return s;
}
function tHero(h) { return (I18N[LANG].heroes[h] || I18N.en.heroes[h] || [h, ""]); }
function tUlt(u) { return (I18N[LANG].ultName[u] || I18N.en.ultName[u] || u); }
// 초기 언어 결정
(function () { let saved = ""; try { saved = localStorage.getItem("daedalus_lang") || ""; } catch (e) {} LANG = (LANGS.indexOf(saved) >= 0 ? saved : "en"); })();   // 🌐 저장값 없으면 기본 en (글로벌 첫인상·한국발 티 X — 군주). 유저는 설정에서 변경 가능.
