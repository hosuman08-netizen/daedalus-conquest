# 2026-07-10 CTO Tank — p1 결제·보안 감사 (Morpheus 수정+배포)

## 무엇을 / 왜
새 CTO Tank 첫 실전 임무: p1(라이브, 실돈 Stars 결제) 보안 감사. 유저 유입 전 자금 구멍 차단.

## 잘 된 것 (정직)
- 웹훅 secret_token fail-CLOSED (pay-worker.js:280)
- 하드코딩 토큰/시크릿 없음 (env/secret store)
- 영수증 멱등 1회 소비, raid 서버측 상한

## 🔴 발견 → 수정+배포 완료
1. **P1-1 결제 fail-OPEN (자금 직결)** — `verifyThenGrant`가 /verify 실패/타임아웃 시 7회 재시도 후 **무조건 팩 지급**. 공격자가 콘솔에서 `verifyThenGrant('ultra',uid)` 호출 or 워커 도메인 차단 → ultra팩(💎2000+SSR) 0원 획득.
   → **수정**: `v.ok===true`일 때만 지급. 실패/타임아웃엔 미검증 지급 절대 금지 — ~75s(20회) 재폴링 후 'pending' 표시. 웹훅 지연은 영수증 KV 24h 보존으로 복구. (game.js:5163-5173)
2. **P2 저장형 XSS** — factionName(game.js:4476) 무이스케이프 → raid/leaderboard 통해 타 유저에게 innerHTML 서빙 → TG 웹뷰서 실행(initData 탈취·결제유발 가능).
   → **수정**: escapeHtml 헬퍼 + 싱크 2곳(리더보드 3561·습격 상대명 raidTargetName) 이스케이프. (game.js)

검증: node --check ✅, 크로스파일 충돌 0, escapeHtml 실코드 `<img onerror>` 무력화 확인, runtime-check GREEN. 배포 c939a3a (?v=20260710i).

## 📒 기술부채 원장 (추후 — 지금 즉시 아님)
- **P1-2 클라 권위 경제**: 체크섬이 클라 노출→위조가능. 단 재화 **비양도·비출금**이라 blast radius=자기 세이브 페이월 우회 한정. 근본해결=서버권위 잔액(검증 영수증→KV). **매출 데이터로 이전 임계점 판단.** (Plutus와 협의)
- **CSP 미적용** (index.html): XSS 2차 방어선. 단 인라인 onclick 제거 선행 필요 → 별도 작업.
- **raid-worker name 서버측 화이트리스트**: 저장 시점 정화(현재 slice만). 별도 워커 배포.
- P3(저위험): 영수증 소비 그리핑(DoS), analytics /stats 무인증 GET(사업지표 노출, PII무), 리더보드 값 클라제출.

## ⚠️ 승인/다음
- 배포 완료(push). 결제 크리티컬이라 즉시 반영이 맞다고 판단.
- 부채/P3는 매출·유입 시작 후 우선순위 재평가.
