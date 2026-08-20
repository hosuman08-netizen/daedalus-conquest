/* ══════════════════════════════════════════════════════════════════════════
   LORE ENGINE — 다이달로스 정복 (Daedalus Conquest)
   ──────────────────────────────────────────────────────────────────────────
   왜 재작성했나 (감사 rank 8·9·10 대응):
   (8) 정합성: 예전 LORE는 id→하드텍스트라 실제 유닛(arch/faction)과 어긋났다
       — 비-SSR에 '마룡/거신/타이탄'이 붙고, 'Swarm의 수호자-067' 같은 raw
       세력토큰·일련번호가 노출됐다. 이제 로어는 유닛의 실제 arch·faction·
       rarity·ssrKey에서 파생되므로 절대 어긋나지 않는다. titan(거신/탈로스급)
       어휘는 SSR 전용(Anvil/Dominus)으로 격리.
   (9) 다국어: 예전엔 6언어(ko/en/ja/zh/hi/ru) 전부 한국어 로어가 노출됐다.
       이제 접근 시점의 LANG으로 현지화한다.
   (10) 그리스신화 앵커: '그리스신화 방치형'을 표방하나 신화 요소가 0건이었다.
       다이달로스/미궁(Labyrinth)/탈로스(Talos)/이카로스(Icarus)/미노스(Minos)를
       세계관에 접목 — SSR 서사에 직접, 비-SSR엔 정찰(drone)=이카로스 계보 +
       미궁 메아리 프레임으로 리프레이밍.

   접근 방식: game.js:5819가 `LORE[id]`(숫자 키)로 읽고 truthy 검사만 한다.
   그래서 LORE를 Proxy로 감싸 지연 생성 — 접근 시점의 LANG·ROSTER를 반영한다.
   ROSTER를 못 찾으면 buildRoster와 동일한 결정적 규칙으로 arch/faction 복원.

   📌 WORLDBIBLE(1장): 세계는 다이달로스가 설계한 거대한 미궁이며, 모든 유닛은
   그 미궁에 봉인됐다 깨어난 '에코(automaton)'다. SSR 9창립체는 신화 앵커를
   계승한다 — Arclight=미궁의 설계자 다이달로스의 판단, Anvil=청동거신 탈로스,
   Dominus=미궁의 왕 미노스, Vespera/정찰=이카로스의 비행 계보.
   (전역 프레임 문구를 UI에 상시 노출하려면 game.js 렌더훅 필요 — 별도 보고.)
   ══════════════════════════════════════════════════════════════════════════ */

// buildRoster(units.js)와 동일한 결정적 순서/규칙 — ROSTER 부재 시 폴백용.
const _LORE_ARCH = ["drone", "marksman", "guardian", "bruiser", "commander"];
const _LORE_FAC  = ["Strategist", "Executor", "Swarm", "Guardian", "Intel"];
const _LORE_SSR  = [ // id 1~9 순서 = SSR_CHARS 순서
  { key: "arclight", arch: "commander", faction: "Strategist" },
  { key: "solace",   arch: "guardian",  faction: "Executor" },
  { key: "cipher",   arch: "marksman",  faction: "Intel" },
  { key: "ignis",    arch: "bruiser",   faction: "Swarm" },
  { key: "vector",   arch: "commander", faction: "Strategist" },
  { key: "vespera",  arch: "bruiser",   faction: "Swarm" },
  { key: "aegis",    arch: "guardian",  faction: "Guardian" },
  { key: "anvil",    arch: "titan",     faction: "Executor" },
  { key: "dominus",  arch: "titan",     faction: "Guardian" },
];

function _loreLang() {
  try { if (typeof LANG !== "undefined" && LANG) return LANG; } catch (e) {}
  return "en";
}
function _loreDerive(id) {
  if (id <= 9) { const c = _LORE_SSR[id - 1]; return { id: id, rarity: "SSR", arch: c.arch, faction: c.faction, ssrKey: c.key }; }
  let i;
  if (id <= 64) i = id - 10; else if (id <= 120) i = id - 65; else i = id - 121;
  const rar = id <= 64 ? "SR" : (id <= 120 ? "R" : "N");
  return { id: id, rarity: rar, arch: _LORE_ARCH[i % 5], faction: _LORE_FAC[i % 5] };
}
function _loreUnit(id) {
  try {
    if (typeof ROSTER !== "undefined" && ROSTER) { const u = ROSTER.find((x) => x.id === id); if (u) return u; }
  } catch (e) {}
  return _loreDerive(id);
}

// ── 6언어 로어 텍스트 팩 ──────────────────────────────────────────────────
// role[arch] = 3패턴 배열(id%len으로 로테이션 → 단조 반복 완화). flavor[faction]
// = 세력 특성 1구. myth = 미궁 앵커(id%4===0에만 덧붙여 절제). ssr[key] = 신화
// 접목 서사(현지화). ko/en은 3패턴, ja/zh/hi/ru는 1패턴(우선 완역, 변주는 추후).
const _LORE_TX = {
  ko: {
    role: {
      drone: [
        "폐허를 살피는 정찰의 눈, 이카로스의 후예. 적진을 먼저 읽어 군단의 앞길을 연다.",
        "군단의 첫 시선. 잔해 사이를 미끄러지며 적의 움직임을 실어 나른다.",
        "홀로 먼 곳까지 나아가 안전을 확인하고 돌아오는 정찰기. 작은 발견이 큰 승기를 부른다.",
      ],
      marksman: [
        "한 발에 승부를 거는 저격수. 드러난 약점은 그의 조준선 위에서 최후를 맞는다.",
        "소리 없이 적의 심장을 겨누는 명사수. 방아쇠가 당겨지면 전장이 조용해진다.",
        "표적을 끝까지 좇는 사수. 그가 새긴 약점은 곧 다음 일격의 좌표가 된다.",
      ],
      guardian: [
        "무너지지 않는 방벽. 그가 선 자리에서는 누구도 뒤로 밀리지 않는다.",
        "군단의 마지막 선. 방패를 세워 동료가 설 시간을 벌어 준다.",
        "굳건한 성벽. 그가 버티는 한 후방은 언제나 안전하다.",
      ],
      bruiser: [
        "적진을 부수는 강습병. 길이 없으면 부숴서 만든다.",
        "선봉의 파쇄기. 적의 대형을 갈라 무리가 밀고 들어갈 틈을 연다.",
        "부수고 다시 세우기 위해 먼저 허무는 돌격병. 파괴는 그의 시작일 뿐이다.",
      ],
      commander: [
        "전선을 하나로 묶는 지휘관. 그의 신호 한 번에 군단이 동시에 움직인다.",
        "야전의 두뇌. 병력의 호흡을 맞춰 승리의 루트를 그린다.",
        "깃발을 든 사령. 그의 목소리 아래서 흩어진 부대가 하나가 된다.",
      ],
    },
    flavor: {
      Strategist: "전략가의 계산 위에서, 그의 움직임엔 낭비가 없다.",
      Executor: "실행자의 손은 부순 자리에 다시 내일을 세운다.",
      Swarm: "군집의 일부로서, 하나가 스러져도 무리는 멈추지 않는다.",
      Guardian: "방벽의 맹세를 짊어지고, 마지막까지 물러서지 않는다.",
      Intel: "정보의 그물을 짜며, 적의 비밀이 드러나는 순간을 노린다.",
    },
    myth: "다이달로스의 미궁에서 울린 옛 메아리가, 그의 회로 속에 아직 살아 있다.",
    ssr: {
      arclight: "다이달로스가 남긴 최종 판단 모듈. 미궁 전체를 한순간에 읽어 승기를 선포한다. 그가 빛을 비추면 군단이 깨어나고, 적의 운명은 이미 계산을 끝냈다.",
      solace: "죽음을 수복으로 바꾸는 손. 쓰러진 동료의 회로에 다시 불을 켠다. \"끝은 없다, 다시 세우면 된다\" — 침묵의 시대를 견딘 그녀의 신념.",
      cipher: "적의 모든 방어를 한 줄의 코드로 읽어내는 감시자. 미궁의 벽에 숨은 통로마저 그의 눈을 피하지 못한다. 그는 결코 두 번 묻지 않는다.",
      ignis: "봉인됐어야 할 과부하 코어. 다칠수록 뜨거워지고 부서질수록 강해진다. 군단은 그를 무기라 부르고, 적은 그를 재앙이라 부른다.",
      vector: "수천의 부대를 한 호흡으로 움직이던 야전 사령 알고리즘. 그의 한 마디에 군단 전체가 동시에 돌격한다. 망설임은 그의 사전에서 삭제됐다.",
      vespera: "새벽과 함께 깨어나는 군집의 여왕. 이카로스처럼 태양을 향해 날아오르되, 그녀의 날개는 결코 녹지 않는다. 죽음조차 그녀에겐 증식의 신호일 뿐.",
      aegis: "최후의 방어선이 무너진 그날, 홀로 남아 미궁의 문을 막았던 방벽. 그녀가 선 자리에서는 누구도 쓰러지지 않는다 — 그것이 유일하게 남은 약속.",
      anvil: "다이달로스의 대장간에서 벼려진 청동 거신, 탈로스의 재림. 부수는 자들 사이에서 그는 홀로 망치를 든다. 군단의 내일은 그의 모루 위에서 다시 태어난다.",
      dominus: "미궁을 다스리던 미노스의 왕좌를 계승한 자. 군림하기 위해서가 아니라, 흩어진 모두를 하나로 묶기 위해 깨어났다. 그가 있는 한 군단은 결코 무너지지 않는다.",
    },
  },
  en: {
    role: {
      drone: [
        "The scouting eye that combs the ruins — heir to Icarus. It reads the enemy line first and clears the legion's path.",
        "The legion's first gaze. It slips through the wreckage, carrying back the enemy's every move.",
        "A scout that ranges far alone, confirms the way is safe, and returns. A small find brings a great victory.",
      ],
      marksman: [
        "A sharpshooter who stakes everything on one shot. A weakness, once shown, meets its end on the crosshair.",
        "A marksman who aims for the heart in silence. When the trigger falls, the battlefield goes quiet.",
        "A shooter who hunts the target to the end. The weakness it marks becomes the coordinate of the next strike.",
      ],
      guardian: [
        "An unbreakable bulwark. Where it stands, no one is pushed back.",
        "The legion's last line. It raises its shield to buy comrades the time to stand.",
        "A steadfast rampart. As long as it holds, the rear is always safe.",
      ],
      bruiser: [
        "A shock trooper that shatters the line. Where there is no road, it makes one by breaking through.",
        "The vanguard's breaker. It splits the enemy formation and opens a gap for the many to pour in.",
        "An assault trooper that tears down first, to rebuild after. Destruction is only its beginning.",
      ],
      commander: [
        "A commander who binds the front into one. At a single signal, the whole legion moves as one.",
        "The brain of the field. It matches the troops' breath and draws the route to victory.",
        "A banner-bearing captain. Under its voice, scattered units become one.",
      ],
    },
    flavor: {
      Strategist: "Upon the strategist's calculus, its every move is without waste.",
      Executor: "The executor's hands raise tomorrow again from the rubble they broke.",
      Swarm: "As part of the swarm, when one falls the many never stop.",
      Guardian: "Bearing the bulwark's oath, it never yields to the last.",
      Intel: "Weaving a net of intelligence, it waits for the enemy's secret to surface.",
    },
    myth: "An old echo from the Labyrinth of Daedalus still lives within its circuits.",
    ssr: {
      arclight: "The final judgment module Daedalus left behind. It reads the entire Labyrinth in an instant and declares the tide of victory. When its light falls, the legion wakes — and the enemy's fate is already calculated.",
      solace: "The hand that turns death into repair, relighting the circuits of the fallen. \"There is no end; we simply rebuild.\" — her creed, forged through the age of silence.",
      cipher: "A watcher who decodes every defense into a single line of code. Not even the hidden passages in the Labyrinth's walls escape her eye. She never asks twice.",
      ignis: "An overload core that should have stayed sealed. The more it is wounded the hotter it burns; the more it breaks, the stronger it grows. The legion calls it a weapon; the enemy calls it catastrophe.",
      vector: "A field-command algorithm that once moved thousands of troops on a single breath. At one word, the entire legion charges as one. Hesitation was deleted from its lexicon.",
      vespera: "The swarm queen who wakes with the dawn. Like Icarus she climbs toward the sun — yet her wings never melt. Even death, to her, is only a signal to multiply.",
      aegis: "On the day the last defensive line fell, she alone stayed to bar the Labyrinth's gate. Where she stands, no one falls — the one promise that remains.",
      anvil: "A bronze titan hammered in the forge of Daedalus — the return of Talos. Among those who break, he alone lifts the hammer. The legion's tomorrow is reborn upon his anvil.",
      dominus: "The one who inherits the throne of Minos, ruler of the Labyrinth. He woke not to reign, but to bind the scattered into one. While he stands, the legion never falls.",
    },
  },
  ja: {
    role: {
      drone: ["廃墟を探る偵察の眼、イカロスの末裔。敵陣を先に読み、軍団の道を切り開く。"],
      marksman: ["一撃に全てを賭ける狙撃手。晒された弱点は、その照準の先で終わりを迎える。"],
      guardian: ["崩れぬ防壁。彼が立つ場所では、誰も後ろへは退かない。"],
      bruiser: ["敵陣を砕く強襲兵。道が無ければ、砕いて造る。"],
      commander: ["戦線を一つに束ねる指揮官。ただ一つの合図で、軍団は同時に動く。"],
    },
    flavor: {
      Strategist: "戦略家の計算の上で、その動きに無駄は無い。",
      Executor: "実行者の手は、砕いた跡に再び明日を築く。",
      Swarm: "群れの一部として、一つが倒れても多は止まらない。",
      Guardian: "防壁の誓いを背負い、最後まで退かない。",
      Intel: "情報の網を織り、敵の秘密が露わになる瞬間を狙う。",
    },
    myth: "ダイダロスの迷宮に響いた古の残響が、その回路に今も生きている。",
    ssr: {
      arclight: "ダイダロスが遺した最終判断モジュール。迷宮の全てを一瞬で読み、勝機を宣言する。その光が差せば軍団は目覚め、敵の運命はすでに計算し尽くされている。",
      solace: "死を修復へと変える手。倒れた仲間の回路に再び火を灯す。「終わりは無い、また築けばいい」——沈黙の時代を耐えた彼女の信念。",
      cipher: "あらゆる防御を一行のコードに解き明かす監視者。迷宮の壁に隠れた通路さえ、その眼を逃れられない。彼は二度と問わない。",
      ignis: "封じられるべきだった過負荷コア。傷つくほど熱を帯び、砕けるほど強くなる。軍団は彼を武器と呼び、敵は彼を災厄と呼ぶ。",
      vector: "数千の部隊を一息で動かした野戦指揮アルゴリズム。その一言で軍団全体が同時に突撃する。躊躇は彼の辞書から削除された。",
      vespera: "夜明けと共に目覚める群れの女王。イカロスのように太陽へ翔けるが、その翼は決して溶けない。死さえ彼女には増殖の合図に過ぎない。",
      aegis: "最後の防衛線が崩れたあの日、独り残って迷宮の門を塞いだ防壁。彼女が立つ場所では誰も倒れない——それが唯一残された約束。",
      anvil: "ダイダロスの鍛冶場で鍛えられた青銅の巨神、タロスの再来。砕く者たちの中で、彼だけが槌を執る。軍団の明日は彼の金床の上で生まれ変わる。",
      dominus: "迷宮を治めたミノスの王座を継ぐ者。君臨するためではなく、散り散りの全てを一つに束ねるために目覚めた。彼がいる限り、軍団は決して崩れない。",
    },
  },
  zh: {
    role: {
      drone: ["巡查废墟的侦察之眼，伊卡洛斯的后裔。抢先读懂敌阵，为军团开路。"],
      marksman: ["以一击定胜负的狙击手。一旦暴露的弱点，都会在他的准星下终结。"],
      guardian: ["不倒的壁垒。他所立之处，无人后退半步。"],
      bruiser: ["粉碎敌阵的强袭兵。无路，便破而开路。"],
      commander: ["将战线合为一体的指挥官。一声号令，全军团同时而动。"],
    },
    flavor: {
      Strategist: "在战略家的算计之上，他的每一步都毫无浪费。",
      Executor: "执行者之手，在自己击碎之处重建明日。",
      Swarm: "身为群体的一员，一个倒下，众多也不会停步。",
      Guardian: "背负壁垒的誓言，直到最后也绝不退让。",
      Intel: "编织情报之网，静候敌人秘密浮现的一刻。",
    },
    myth: "达达罗斯迷宫中回响的古老余音，至今仍活在他的回路里。",
    ssr: {
      arclight: "达达罗斯留下的最终裁决模块。一瞬读尽整座迷宫，宣告胜机。当他的光芒降临，军团便觉醒，而敌人的命运早已算尽。",
      solace: "将死亡化为修复之手，为倒下的同伴重新点亮回路。“没有终结，重建即可。”——她在沉默时代中坚守的信念。",
      cipher: "将一切防御解读为一行代码的监视者。连迷宫墙中暗藏的通道也逃不过他的眼。他从不第二次询问。",
      ignis: "本应被封印的过载核心。愈受伤愈炽热，愈破碎愈强大。军团称他为武器，敌人称他为灾祸。",
      vector: "曾以一息调动千军的野战指挥算法。他一言既出，全军团同时突击。犹豫，早已从他的字典中删除。",
      vespera: "随黎明苏醒的群体女王。她如伊卡洛斯般飞向太阳，双翼却永不融化。连死亡，对她也不过是增殖的信号。",
      aegis: "在最后防线崩溃的那日，独自留下封锁迷宫之门的壁垒。她所立之处，无人倒下——这是唯一留存的誓约。",
      anvil: "在达达罗斯的锻炉中锤炼而成的青铜巨神，塔罗斯的再临。在破坏者之中，唯他独执铁锤。军团的明日，在他的铁砧上重生。",
      dominus: "继承迷宫之王弥诺斯王座之人。他觉醒并非为了君临，而是为将离散的一切合而为一。只要他仍伫立，军团便永不崩溃。",
    },
  },
  hi: {
    role: {
      drone: ["खंडहरों को टोहती टोही आँख — इकारस का वंशज। यह शत्रु की पंक्ति को पहले पढ़ता है और सेना का मार्ग खोलता है।"],
      marksman: ["एक ही निशाने पर सब कुछ दाँव पर लगाने वाला निशानेबाज़। जो कमज़ोरी उजागर हुई, वह उसके निशाने पर अपना अंत पाती है।"],
      guardian: ["अटूट प्राचीर। जहाँ वह खड़ा है, वहाँ कोई पीछे नहीं धकेला जाता।"],
      bruiser: ["शत्रु पंक्ति को चूर करने वाला आक्रमणकारी। जहाँ राह न हो, वहाँ तोड़कर राह बनाता है।"],
      commander: ["मोर्चे को एक सूत्र में बाँधने वाला सेनापति। एक ही संकेत पर पूरी सेना एक साथ चल पड़ती है।"],
    },
    flavor: {
      Strategist: "रणनीतिकार की गणना पर, उसकी हर चाल व्यर्थ नहीं जाती।",
      Executor: "कर्ता के हाथ, अपने ही तोड़े मलबे पर फिर से कल का निर्माण करते हैं।",
      Swarm: "झुंड के एक अंश के रूप में, एक गिरे तो भी अनेक नहीं रुकते।",
      Guardian: "प्राचीर की शपथ उठाए, अंत तक पीछे नहीं हटता।",
      Intel: "सूचना का जाल बुनते हुए, वह शत्रु के रहस्य के उजागर होने के क्षण की ताक में रहता है।",
    },
    myth: "दाइदालोस की भूलभुलैया में गूँजी प्राचीन प्रतिध्वनि आज भी उसके परिपथों में जीवित है।",
    ssr: {
      arclight: "दाइदालोस द्वारा छोड़ा गया अंतिम निर्णय-मॉड्यूल। एक क्षण में पूरी भूलभुलैया को पढ़कर विजय की घोषणा करता है। जब उसका प्रकाश उतरता है, सेना जाग उठती है — और शत्रु का भाग्य पहले ही गणित हो चुका होता है।",
      solace: "मृत्यु को मरम्मत में बदलने वाला हाथ, गिरे साथियों के परिपथों में फिर से ज्योति जलाता है। \"अंत नहीं होता; हम बस फिर से रचते हैं।\" — मौन के युग में तपी उसकी आस्था।",
      cipher: "हर रक्षा को कोड की एक पंक्ति में पढ़ लेने वाला प्रहरी। भूलभुलैया की दीवारों में छिपे रास्ते भी उसकी आँख से नहीं बचते। वह दोबारा नहीं पूछता।",
      ignis: "एक अतिभार-कोर जिसे बंद रहना चाहिए था। जितना घायल, उतना दहकता; जितना टूटे, उतना बलवान। सेना उसे हथियार कहती है, शत्रु उसे प्रलय।",
      vector: "एक रणक्षेत्र-कमान एल्गोरिद्म जो कभी एक साँस में हज़ारों टुकड़ियों को चलाता था। उसके एक शब्द पर पूरी सेना एक साथ धावा बोलती है। हिचक उसके शब्दकोश से मिटा दी गई।",
      vespera: "भोर के साथ जागने वाली झुंड की रानी। इकारस की भाँति वह सूर्य की ओर उड़ती है — पर उसके पंख कभी नहीं पिघलते। मृत्यु भी उसके लिए केवल वृद्धि का संकेत है।",
      aegis: "जिस दिन अंतिम रक्षा-पंक्ति ढही, वह अकेली रुककर भूलभुलैया के द्वार को रोके खड़ी रही। जहाँ वह खड़ी है, कोई नहीं गिरता — यही एकमात्र शेष वचन है।",
      anvil: "दाइदालोस की भट्टी में गढ़ा गया काँसे का महाकाय — तालोस का पुनरागमन। तोड़ने वालों के बीच, केवल वही हथौड़ा उठाता है। सेना का कल उसकी निहाई पर फिर से जन्म लेता है।",
      dominus: "भूलभुलैया के स्वामी मिनोस के सिंहासन का उत्तराधिकारी। वह शासन के लिए नहीं, बिखरे हुए सबको एक करने के लिए जागा। जब तक वह खड़ा है, सेना कभी नहीं गिरती।",
    },
  },
  ru: {
    role: {
      drone: ["Разведывательный глаз, обшаривающий руины, — наследник Икара. Он первым читает строй врага и открывает легиону путь."],
      marksman: ["Снайпер, ставящий всё на один выстрел. Раскрытая слабость встречает свой конец на его прицеле."],
      guardian: ["Несокрушимый бастион. Там, где он стоит, никого не оттеснить назад."],
      bruiser: ["Штурмовик, крушащий строй. Где нет пути — он пробивает его."],
      commander: ["Командир, связывающий фронт в одно целое. По единому сигналу весь легион движется как один."],
    },
    flavor: {
      Strategist: "На расчёте стратега в его движениях нет ничего лишнего.",
      Executor: "Руки исполнителя вновь возводят завтрашний день на обломках, что сами разбили.",
      Swarm: "Как часть роя: падёт один — многие не остановятся.",
      Guardian: "Неся клятву бастиона, он не отступает до конца.",
      Intel: "Плетя сеть разведки, он ждёт мгновения, когда откроется тайна врага.",
    },
    myth: "Древнее эхо Лабиринта Дедала всё ещё живёт в его цепях.",
    ssr: {
      arclight: "Модуль последнего суждения, оставленный Дедалом. В одно мгновение он прочитывает весь Лабиринт и провозглашает победу. Когда падает его свет, легион пробуждается — а судьба врага уже просчитана.",
      solace: "Рука, обращающая смерть в починку, вновь зажигает цепи павших. «Конца нет; мы просто отстраиваем заново» — её вера, закалённая эпохой молчания.",
      cipher: "Наблюдатель, что расшифровывает любую защиту в одну строку кода. Даже скрытые ходы в стенах Лабиринта не ускользнут от его взгляда. Он не спрашивает дважды.",
      ignis: "Ядро перегрузки, которому надлежало остаться запечатанным. Чем сильнее ранен — тем жарче горит; чем сильнее сломан — тем крепче. Легион зовёт его оружием, враг — катастрофой.",
      vector: "Алгоритм полевого командования, что некогда двигал тысячи отрядов на одном дыхании. По одному его слову весь легион бросается в атаку. Колебание вычеркнуто из его словаря.",
      vespera: "Царица роя, пробуждающаяся с рассветом. Как Икар, она взмывает к солнцу — но её крылья не тают. Даже смерть для неё лишь сигнал к умножению.",
      aegis: "В тот день, когда пала последняя линия обороны, она одна осталась заслонять врата Лабиринта. Там, где она стоит, никто не падёт — единственное, что осталось от обещания.",
      anvil: "Бронзовый титан, откованный в кузнице Дедала, — возвращение Талоса. Среди тех, кто крушит, лишь он поднимает молот. Завтра легиона рождается вновь на его наковальне.",
      dominus: "Тот, кто наследует трон Миноса, владыки Лабиринта. Он пробудился не чтобы царить, но чтобы связать разрозненных воедино. Пока он стоит, легион не падёт никогда.",
    },
  },
};

// WORLDBIBLE 프레임(선택적 UI 노출용 — 현재 game.js 렌더훅 없음, 보고 참조).
const LORE_WORLD = {
  ko: "다이달로스의 미궁 — 무너진 세계를 다시 짓는 자들의 전장. 봉인에서 깨어난 에코들이 창립 9군단의 이름 아래 모인다.",
  en: "The Labyrinth of Daedalus — a battlefield of those who rebuild a fallen world. Echoes woken from the seal gather beneath the nine Founding names.",
  ja: "ダイダロスの迷宮 — 崩れた世界を再び築く者たちの戦場。封印から目覚めたエコーが創立九軍団の名の下に集う。",
  zh: "达达罗斯的迷宫 — 重建崩塌世界者的战场。自封印中苏醒的回声，汇聚于创立九军团之名下。",
  hi: "दाइदालोस की भूलभुलैया — गिरे हुए संसार को फिर से रचने वालों का रणक्षेत्र। सील से जागे एको नौ संस्थापक नामों तले एकत्र होते हैं।",
  ru: "Лабиринт Дедала — поле битвы тех, кто отстраивает павший мир. Эхо, пробуждённое из печати, собирается под девятью Именами-Основателями.",
};

function _genLore(id) {
  try {
    const u = _loreUnit(id); if (!u) return "";
    const lang = _loreLang();
    const T = _LORE_TX[lang] || _LORE_TX.en;
    const EN = _LORE_TX.en;
    if (u.rarity === "SSR" && u.ssrKey) {
      return (T.ssr && T.ssr[u.ssrKey]) || EN.ssr[u.ssrKey] || "";
    }
    const roleArr = (T.role && T.role[u.arch]) || EN.role[u.arch] || EN.role.drone;
    const role = roleArr[id % roleArr.length];
    const flav = (T.flavor && T.flavor[u.faction]) || EN.flavor[u.faction] || "";
    let s = role + (flav ? " " + flav : "");
    if (id % 4 === 0) { const m = T.myth || EN.myth; if (m) s += " " + m; }
    return s;
  } catch (e) { return ""; }
}

// LORE[id] — 지연 생성 Proxy. game.js:5819 호환(숫자 키 → 현지화 로어 문자열).
const LORE = new Proxy({}, {
  get: function (_t, key) {
    if (typeof key !== "string") return undefined;   // Symbol 등 무시
    const id = parseInt(key, 10);
    if (!Number.isFinite(id) || id < 1) return undefined;
    return _genLore(id);
  },
});

if (typeof window !== "undefined") { window.LORE = LORE; window.LORE_WORLD = LORE_WORLD; }

// End of LORE
