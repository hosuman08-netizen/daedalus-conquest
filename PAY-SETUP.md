# 💳 LEGION 결제 연동 (Telegram Stars) — 셋업 가이드

클라이언트(game.js)는 이미 연동 완료. **봇 토큰 + Worker 배포** 3단계만 군주가 하면 실결제가 켜진다.
지금은 `PAY_BACKEND=""` 라서 **데모 지급**(누르면 바로 받음) 상태.

---

## 1단계 — 봇 준비 (이미 미니앱 띄운 봇이 있으면 그거 사용)
1. 텔레그램에서 **@BotFather** → `/newbot` (또는 기존 봇 사용)
2. **봇 토큰** 복사 (예: `8123456:AAH...`) — 절대 코드/깃에 넣지 말 것
3. @BotFather → `/mybots` → 봇 선택 → **Payments** 가 Stars는 별도 설정 불필요(XTR은 기본 제공)

## 2단계 — Cloudflare Worker 배포 (무료)
1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**
2. 이름 `legion-pay` → 배포 후 **Edit code**
3. `pay-worker.js` 내용을 통째로 붙여넣고 **Deploy**
4. **Settings → Variables and Secrets → Add → Secret**
   - 이름 `BOT_TOKEN`, 값 = 1단계 봇 토큰 → Save & Deploy
5. Worker URL 복사 (예: `https://legion-pay.<계정>.workers.dev`)

## 3단계 — 연결
1. **봇 웹훅 설정** (pre_checkout 승인용 — 안 하면 결제 실패):
   브라우저에 한 줄 입력(토큰·URL 본인 것으로):
   ```
   https://api.telegram.org/bot<봇토큰>/setWebhook?url=https://legion-pay.<계정>.workers.dev
   ```
   `{"ok":true}` 뜨면 성공.
2. **game.js** 맨 위 결제 블록에서:
   ```js
   const PAY_BACKEND = "https://legion-pay.<계정>.workers.dev";
   ```
   (빈 문자열 → Worker URL 로 교체) 후 배포(git push).

끝. 이제 상점에서 누르면 진짜 Stars 결제창이 뜬다.

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

## ⚠️ 보안 한계 (정직)
게임 상태가 브라우저 localStorage(서버 계정 없음)라, **최종 지급은 클라이언트가** 한다.
즉 마음먹으면 결제 없이도 로컬 재화 조작이 가능(원래부터 그런 구조).
**실매출 규모가 커지면** 서버 계정 도입 → `successful_payment` 웹훅에서 **서버가 지급**하도록 승급 필요.
그 전까진 "결제는 정상 작동하되 부정도 가능" 수준으로 이해하고 운영.
