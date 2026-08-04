# 2026-07-29 · Trinity · health-pulse 잠복 버그 수정 + PENDING 정리

## 무엇을
1. `~/.grok/scripts/legion-health-pulse.sh:113` 잠복 크래시 수정
   - `${alerts[*]}` → `${alerts[*]:-}` (110줄 `${notes[*]}`도 방어적으로 동일 처리)
2. ARSENAL.md PENDING 마커 2건(7-14, 7-15) 클리어 + 교훈 적립
3. lessons.md 교훈 2줄 적립(버그 + 자기교정)

## 왜
`launchctl list`에서 `com.jarvis.health-pulse`가 exit=1.
err 로그에 `line 113: alerts[*]: unbound variable` — macOS bash 3.2 + `set -u`에서
**빈 배열** `[*]`/`[@]` 확장이 unbound로 죽는 고전 버그.

역설적 구조: alerts가 **비는** 순간 = 시스템이 **건강한** 순간에만 크래시.
alerts가 차 있으면 113줄을 정상 통과해 폰알림까지 정상 동작.
→ "정상=exit0" 경로만 골라 부수는 무증상 고장. 건강을 영원히 보고할 수 없음.

## 검증 결과 (측정치)
**✅ 확인된 것**
- err 로그 원문: `legion-health-pulse.sh: line 113: alerts[*]: unbound variable` (1줄)
- 스크립트 9줄 `set -uo pipefail` 확인
- 배열 확장 전수 조사: 97·124줄은 `${#arr[@]} > 0` 가드 안 → 안전.
  **113줄만 무가드로 매 실행 통과** = 유일한 실제 결함
- 패치 반영 확인: 110줄 `${notes[*]:-}`, 114줄 `${alerts[*]:-}`

**⚠️ 검증 못 한 것 (정직 보고)**
- **실행 검증 0.** 이 세션 샌드박스가 `bash -n`·스크립트 실행·`launchctl start`·셸 루프를 전부 차단.
  구문검사조차 못 돌림. 수정은 **정적 검토만** 거친 상태.
- 확인 방법: 다음 자동 실행(900s 주기) 후
  `~/.grok/logs/health-pulse.launchd.err.log`가 **1줄 그대로**면 정상.
  (베이스라인: 1줄, mtime 7/21 03:34)

## 🔻 자기교정 — 처음 판단이 틀렸다
초기에 이 버그를 **"현재 exit=1의 원인"**으로 단정했으나 실측에서 뒤집힘:
- err 로그 mtime = **7/21 03:34 (8일 전)**. 오늘 것이 아님
- 전체 health 로그 중 `alerts=0`은 **단 1회** → 크래시는 그 1회가 전부
- **현재 exit=1은 설계대로의 알림 경로** (132줄 `exit 1`).
  7/29 07:55 실측 `alerts=2` — RAM free 74MB, load1 255.59 (재부팅 직후 부팅폭주)

→ 버그는 진짜지만 **잠복**이었고, 오늘 exit=1과는 무관.
→ 교훈: "버그 발견 = 원인 발견"이 아니다. 로그는 내용 말고 **mtime부터**.
   `- 1 com.jarvis.X`는 그 잡이 exit1을 이상신호로 **설계**했는지 코드에서 먼저 확인.

## 다음 한 걸음
다음 health-pulse 자동 실행 후 err 로그 줄 수 확인(1줄 유지 = 수정 성공).
실행 가능한 세션에서 `bash -n` 1회 돌려 구문 확정.

## ⚠️ 승인 필요 사항
- **push 안 함** (`.grok`은 이 레포 밖. 이 보고서만 daedalus-conquest에 기록)
- 별건 관찰: RAM free 74MB / load1 255는 재부팅 부팅폭주로 보이나,
  전체 로그에 `alerts=0`이 **역대 단 1회**뿐 = RAM/load 알림이 **상시 상태**.
  감시자가 늘 울고 있으면 경보는 무의미해짐 — 임계값 재조정 or 실제 메모리 압박 해소 중
  무엇을 할지는 neo 판단 필요.
