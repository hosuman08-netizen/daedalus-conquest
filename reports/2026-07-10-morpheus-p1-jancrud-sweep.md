# 2026-07-10 Morpheus — p1 조잡함 전면 소탕 보고

## 무엇을
neo 지시("p1 조잡함 다 잡아, 전체 에이전트 풀가동")로 p1(다이달로스 정복) 품질 전면 감사+수정.
- **감사**: 8개 전문 렌즈 병렬(visual/ux/copy/juice/perf/economy/lore/consistency) → 75건 발견 → 45건으로 병합(P1 12).
- **수정**: 6개 파일 에이전트 병렬(game.js/style.css/i18n.js/lore.js/index.html/balance) → 31건 done.
- 런타임 QA(별도): p1 크래시 0 확인(조잡함은 폴리시 문제).

## 왜
게임이 "조잡"한 근본 3층: ①시각(골드 6종·메타바 과밀·레티나 흐림) ②피드백(재화 순간이동·FTUE 토스트 증발) ③콘텐츠(개발어 노출·로어 6언어 한국어·신화요소 0·heroScale 무한지수).

## 검증 결과(측정치)
- 백업 선행: `~/legion-backups/p1-before-jancrud-sweep-20260710-071402.tar.gz` (255K)
- **크래시 회귀 1건 검증에서 포착+수정**: CRIT_DMG가 game.js·gear.js 양쪽 top-level const 중복 선언 → classic script 공유스코프라 game.js 로드 전체 실패(게임 먹통). game.js 중복 선언 제거로 해소.
- 재검증: 로드순서 concat node --check OK, 크로스파일 중복 const 0, runtime-check 12개 코어 전부 🟢.
- 개별 문법 7개 파일 전부 OK.

## 대표 수정
- **레티나 선명**: 전투캔버스 DPR(≤3) 적용
- **골드 통일**: 흩어진 노랑 63+회 → --gold/-deep/-lite 3토큰
- **재화 count-up**: fmtNum(K/M) + 340ms 트윈
- **FTUE 토스트 큐**: 온보딩 메시지 증발 해소
- **밸런스**: heroScale 무한지수(1.65^lv, +1908%) → 완만곡선+캡12, 치명 ≤85% 캡
- **카피**: 개발어(var/Dalio window/total sync) 6언어 감정카피로
- **로어**: 6언어 파생 엔진 + 그리스신화(미궁/탈로스/이카로스/미노스) 앵커, 유닛-로어 정합
- **애니 절제**: 무한 애니 → 액션 CTA 3종만
- juice(confetti·mid-tier SFX·전력피드백 헬퍼), 승리 자동진행, 햅틱 중복 제거 등

## 다음 한 걸음
- 라이브 반영 = 재배포(push) → ⚠️**Sovereign 승인 필요**
- 실기기 시각 확인(레티나 선명·count-up)은 배포 후 neo

## ⚠️ 승인/보류
- **push 승인 필요**(비가역 외부행동)
- 보류(별건): h1 브랜드 위계(rank38, 디자인 방향=Trinity 결정), SSR 리빌 confetti 배선·일부 perf(rank14/43, 회귀마진), verify.sh 게이트 맹점(🟢 false-positive — 테스트 인프라 개선건)
