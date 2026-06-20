# SPEC: 유닛 상성 재설계 — 사다리 → 순환 (titan OP / drone 쓰레기 해결)

> CPO 트리니티 · 구현: 상성표 위치에 따라 (units.js=트리니티 / game.js 전투배율=모피어스) · 검증: 트리니티(balance-sim)
> **발단**: balance-sim — 현 상성이 **일방 사다리**(drone<marksman<guardian<bruiser<commander<titan)라 **titan 5승 무상성 OP / drone 0승 쓰레기.**

## 문제 (검증됨)
```
              승/5
   drone        0/5   ← 쓰레기(아무도 못 이김)
   marksman     1/5
   guardian     2/5
   bruiser      3/5
   commander    4/5
   titan        5/5   ← 무상성 OP(다 이김)
```
- 사다리 구조 = titan만 키우면 정답(메타 붕괴) + drone 무가치. 수집·편성 다양성 죽음.

## 해결: 순환 상성 (가위바위보 — 각 유닛 2~3승)
- **각 archetype이 이기는 것 + 지는 것 둘 다 갖게** → 무상성/쓰레기 제거.
- 예시 고리(역할 기반): `drone(기동) > guardian(둔중) > marksman(근접약) > ... > drone` 순환 + 역할 상성(기동>중장>원거리>기동).
- 목표: **모든 유닛 2~3승**(±1). titan도 약점(예: drone 기동에 취약), drone도 강점(예: titan 농락).

## 구현
1. 상성표/배율 위치 확인: `units.js` 상성 데이터면 트리니티, `game.js` dmg 상성배율이면 모피어스.
2. 순환 상성 매트릭스로 교체 + dmg 계산에 상성배율(예: 유리 ×1.3 / 불리 ×0.77).

## 검증 (트리니티)
- balance-sim 재실행 → **상성 매트릭스 각 유닛 2~3승**인지 + 가성비(타이탄 제외 평균 ±30%) 유지.

## 형태 고정
사다리 → 순환 상성(각 2~3승). 무상성·0승 유닛 제거. 배율·고리는 시뮬조정.
