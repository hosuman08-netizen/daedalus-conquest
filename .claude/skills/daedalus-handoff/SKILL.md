---
name: daedalus-handoff
description: 모피어스(COO)에게 구현 핸드오프 마커 생성. 날짜·역할·미꾸라지 가드·경로 자동. 트리니티(CPO)가 game.js 등 코드구현을 위임할 때 사용.
---

# 모피어스 핸드오프 생성

## 경로 / 파일명
```bash
date "+%Y%m%d-%H%M%S"   # 타임스탬프 (Date.now 대신 셸로)
```
저장: `~/MacAI_Conversations/Jarvis/handoffs/trinity-to-morpheus-<날짜>-<topic>.md`

## 템플릿
```markdown
# [CPO→COO] <제목> (<우선순위: P0/P1/도파민 등>)
**From**: Trinity(CPO) · **To**: Morpheus(COO) · **<날짜 시각>**
**근거**: <왜 이걸 하나 — 1~2줄>

## 구현
<항목별 `파일:라인 — 수정방향`. P0는 복붙용 정확 패치(old → new) 그대로>

## 가드 (미꾸라지 — 필수)
- 확률·천장 prominent 정확공개, **코드=표시 100%**.
- fictional codename · in-game currency · 무과금 루프 유지 · minors 플랫폼 준수.
- Reversible(git).

## 우선순위
<출시 전 필수 / 출시 후>
```

## 규칙
- **game.js·index.html·i18n.js·style.css는 모피어스 전담** → 직접수정 금지, 반드시 핸드오프.
- **P0는 🚨 + "복붙용 정확 패치"**(old→new)로 모피어스가 1분이면 적용하게.
- pay-worker.js 등 트리니티가 직접 고친 게 있으면 "✅ 트리니티 완료, pull 후 작업" 명시(충돌 방지).
- 발행 후 군주에게 "모피어스 창에서 확인해줘" 안내(비동기 묻힘 방지).


---
## [2026-07-21 Legion Upgrade Wave]
- **Dual track:** finance transparent / ent FOMO — never mix.
- **Pipe first:** cash pipe before compound capital.
- **Loop:** GOAL→DOER→CHECKER (loop-engineering skill).
- **CRO gate:** cro-growth-gate before seed/deploy.
- Cross: money-pipe-first · dual-track-finance-ent · legion-full-learning curriculum.

