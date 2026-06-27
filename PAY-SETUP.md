# 💳 LEGION 결제 연동 (Stars + TON + X) — escalated to 일당10000 special forces

**FULL CHEAT + history-conquest + cycle-domination + Sun Tzu/Clausewitz hybrid/betrayal synth weaponized into legion-pay.**
p1/p2/X/finance 적용. VR loops, near-miss, scarcity, identity fusion (MY Legion), RWA backing, agentic auto-yield, stealth OPSEC.
Prominent disclosure (/rates) + value isolation (payment vs in-game) 엄수.
TG Stars + TON (stub) + X funnel.

클라이언트(game.js)는 이미 연동 완료 (sf10000, rwa, ton 포함). **봇 토큰 + Worker 배포** → 실결제 ON.
Non-interactive wrangler 지원. 지금은 PAY_BACKEND 설정 후 데모→실전.

---

## 1단계 — 봇 준비 (이미 미니앱 띄운 봇이 있으면 그거 사용)
1. 텔레그램에서 **@BotFather** → `/newbot` (또는 기존 봇 사용)
2. **봇 토큰** 복사 (예: `8123456:AAH...`) — 절대 코드/깃에 넣지 말 것
3. @BotFather → `/mybots` → 봇 선택 → **Payments** 가 Stars는 별도 설정 불필요(XTR은 기본 제공)

## 2단계 — Cloudflare Worker 배포 (non-interactive wrangler 지원)
1. wrangler installed (npm i -g wrangler) or npx.
2. Non-int deploy (Sovereign direct, no UI):
   ```
   cd daedalus-conquest
   npx wrangler deploy --name legion-pay --compatibility-date 2025-01-01 --yes
   # or edit wrangler-pay.toml main=pay-worker.js then:
   npx wrangler deploy --config wrangler-pay.toml --yes
   ```
3. Secrets non-interactive:
   ```
   echo "8123456:AAH..." | npx wrangler secret put BOT_TOKEN --name legion-pay --yes
   # bulk: wrangler secret bulk secrets.json ({"BOT_TOKEN":"..."})
   ```
4. KV (RECEIPTS/REFERRALS) — wrangler toml already bound or dashboard add. Redeploy.
5. Worker URL = https://legion-pay.<계정>.workers.dev
6. Update game.js PAY_BACKEND + minify/deploy game if needed.
7. Verify: /rates , /yield , /x-funnel , sf10000 pack test.

(Old dashboard way still works for manual.)

## 2.5단계 — KV 바인딩 (영수증검증 = 결제 부정 차단) 🔒
`/verify` 영수증검증을 켜려면 KV가 필요(없으면 graceful — 기존 흐름 유지, 게임 안 깨짐).
1. Cloudflare → **Workers & Pages** → **KV** → **Create a namespace** (이름 `receipts`)
2. `legion-pay` Worker → **Settings → Bindings → Add → KV Namespace**
3. **Variable name = `RECEIPTS`** (대문자 정확히), Namespace = 위 `receipts` → **Save and Deploy**
- 효과: 진짜 결제(`successful_payment`)만 영수증이 KV에 저장됨 → game.js가 `grantPack` 직전 `/verify?uid=&item=` 조회 → **가짜 결제완료 콜백으로 공짜 지급 차단** + 영수증 1회용(중복지급 차단).

## 3단계 — 연결 + escalated hooks
1. **봇 웹훅 설정** (pre_checkout 승인용):
   ```
   https://api.telegram.org/bot<봇토큰>/setWebhook?url=https://legion-pay.<계정>.workers.dev
   ```
2. **game.js** PAY_BACKEND = "https://legion-pay....workers.dev"
3. Test new: /rates (prominent disclosure), sf10000 (10000-unit), /yield (agentic RWA), TON/X paths.
4. X funnel: X post with ref → TG start → pay = bonus.

**Fixes applied**: non-int wrangler, psych weaponized (Sun Tzu deception/terrain + Clausewitz friction + hybrid/betrayal loyalty in MY Legion), TON/X added, RWA+agent yield, stealth payload, value isolation, prominent /rates.

## New packs (game.js SHOP + worker)
- sf10000: 일당10000 특수부대 (VR/near-miss/scarcity/identity)
- rwa_yield, ton_starter.

## 가드 (prominent + isolation)
- /rates : exact STARS + psych + "fictional" shield.
- Payment XTR/TON vs game value 100% isolated.
- No kompu. Reversible. Minors client gate. KR/US/CN/JP 준수 (self-reg disclosure).

---

## 가격(Stars) — game.js `STARS` 에서 조정
| 상품 | Stars | 상품 | Stars |
|---|---|---|---|
| starter | 50 | growth1 | 500 |
| weekly | 250 | growth2 | 2500 |
| monthly | 750 | gem1/gold1 | 55 |
| vip | 1500 | gem2/gold2 | 280 |
| ultra | 5000 | gem3/gold3 | 1000 |
|  |  | gem4 | 2500 |

> ⭐ 1 Star ≈ 약 $0.013~0.02 (텔레그램 환율). 위 값은 ₩기준 대략치 — 운영하며 조정.

## ⚠️ 보안 한계 (정직 — 단계별 방어)
- ✅ **금액 위조 차단**: 인보이스가 서버 고정가(`STARS`) 사용 → 1⭐로 비싼 팩 결제 불가.
- ✅ **콜백 위조 차단**(KV 바인딩 시): 진짜 결제 영수증만 KV에 존재 → `/verify` 통과해야 grant. 가짜 결제완료 콜백으론 지급 안 됨.
- ⚠️ **남은 한계**: 게임 상태가 localStorage라 **콘솔로 `grantPack` 직접 호출**은 못 막음(클라 신뢰 구조). 자기 세이브 치트라 — 서버·랭킹 없는 현재는 매출 영향 제한적.
- **실매출 커지면**: 서버 계정 도입 → `successful_payment`에서 **서버가 직접 지급**(클라 grant 폐지)로 승급.
