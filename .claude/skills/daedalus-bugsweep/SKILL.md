---
name: daedalus-bugsweep
description: 다이달로스 콘퀘스트 전수 버그검토. 신택스 게이트 + 다중 에이전트 병렬로 game.js 외 안전영역과 깊은 로직을 훑어 P0/P1/P2 분류 후 직접수정/모피어스위임 분기. "버그검토", "샅샅이 점검", 출시 전 sanity check 때 사용.
---

# 다이달로스 전수 버그검토 (bugsweep)

CPO 트리니티가 출시 품질을 지키는 표준 파이프라인. 오늘(2026-06-19) 실전 검증됨 — 보스크래시·확률불일치·결제보안 등 P0 다수 발견.

## 1. 신택스 게이트 (먼저, 결정적)
```bash
cd /Users/imhogyun/daedalus-conquest
for f in game.js units.js gear.js i18n.js lore.js pay-worker.js balance-sim.js; do node --check "$f" && echo "✅ $f" || echo "❌ $f"; done
```
파스 에러 = 출시 차단 P0. 통과해야 다음 단계.

## 2. 다중 에이전트 병렬 검토 (general-purpose 5종, 한 메시지에 동시 발사)
| 에이전트 | 영역 | 핵심 체크 |
|---|---|---|
| **A** | index↔game 정합 | on() 핸들러 id 존재 · event버그(craftGear류 — named fn이 첫인자 씀) · data-i18n 키 · $() null참조 · 죽은 버튼 |
| **B** | units/gear/lore 데이터 | 200종 카운트 · RARITY 정합 · **SSR trait 전투 구현여부(표시-실물)** · dead data · **SSR<N 전력역전** |
| **C** | i18n 키 정합 | t()호출 vs 정의 · 언어 불균형 · **법적 확률표 6언어** · 하드코딩 한국어 |
| **D** | game.js 로직 | 시너지/데일리/연출/세이브 엣지/**치트보안** (A·B·C·E 안 본 영역) |
| **E** | pay-worker 결제보안 | **데모grant · 금액위조 · 서버검증 · 멱등 · desc정합** |

각 에이전트 출력 형식: `[P0/P1/P2] 파일:라인 — 증상→원인→수정방향`. **근거 있는 것만, 추측 금지.** 안전영역(트리니티 직접수정) vs game.js(모피어스 위임) 표시.

## 3. 종합 + 분기
- **안전영역 버그**(pay-worker/units/gear/lore/SPEC) → 트리니티 **직접 수정** (영역분담 참조).
- **game.js/i18n 버그** → `daedalus-handoff` 스킬로 모피어스 **복붙 패치 위임**.
- **미꾸라지 체크**: 확률 코드=표시 100% · UR/EX 사기표시 없음 · minors 가드.

## 4. 검증
직접 수정분은 `node --check` + 가능하면 Playwright로 실제 동작 확인.


---
## [2026-07-21 Legion Upgrade Wave]
- **Dual track:** finance transparent / ent FOMO — never mix.
- **Pipe first:** cash pipe before compound capital.
- **Loop:** GOAL→DOER→CHECKER (loop-engineering skill).
- **CRO gate:** cro-growth-gate before seed/deploy.
- Cross: money-pipe-first · dual-track-finance-ent · legion-full-learning curriculum.

