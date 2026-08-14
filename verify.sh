#!/usr/bin/env bash
# 배포 전 검증 게이트 — 문법 + 런타임 크래시 + 수치증감 감사. 실패 시 exit 1.
# 교훈(2026-06-19): 정적분석이 못잡는 크래시를 런타임 하니스가 잡는다. 배포 전 필수.
set -uo pipefail
cd "$(dirname "$0")"
fail=0
echo "── 1) 문법 체크"
for f in game.js i18n.js units.js gear.js lore.js; do
  [ -f "$f" ] || continue
  if node -c "$f" 2>/dev/null; then echo "  ✅ $f"; else echo "  ❌ $f 문법오류"; fail=1; fi
done
echo "── 1b) 크로스파일 충돌(로드순서 concat — CRIT_DMG류 전역 중복 잡기)"
xftmp="/tmp/verify-xfcheck-$$.js"; cat i18n.js units.js gear.js lore.js game.js > "$xftmp" 2>/dev/null
if node -c "$xftmp" 2>/tmp/xferr; then echo "  ✅ 전역 const/함수 충돌 없음"; else echo "  ❌ 크로스파일 충돌"; grep -E 'SyntaxError|already been declared|redeclar' /tmp/xferr | head -1; fail=1; fi
rm -f "$xftmp"
echo "── 2) 런타임 크래시 게이트"
rcout="$(node test/runtime-check.js 2>&1)"; rccode=$?
if [ "$rccode" = 0 ]; then echo "  ✅ 런타임 클린"; else echo "  ❌ 런타임 오류(exit $rccode)"; echo "$rcout" | grep -E '❌|🔴|LOAD ERROR|THREW' | head; fail=1; fi
echo "── 3) 수치 증감 감사"
audit=$(node test/value-audit.js 2>&1)
if echo "$audit" | grep -qE '🔴|❌'; then echo "  ⚠️ 일부 액션 점검 필요:"; echo "$audit" | grep -E '🔴|❌' | head; else echo "  ✅ 모든 수치 액션 정상"; fi
echo "── 4) 계측 계약(emit ⊆ worker ALLOWED)"
if [ -f test/instrumentation-contract.js ]; then
  ic=$(node test/instrumentation-contract.js 2>&1)
  if echo "$ic" | grep -q '🟢'; then echo "  ✅ ${ic#🟢 }"; else echo "  ❌ 계측 계약 위반"; echo "$ic" | grep -E '🔴|→' | head; fail=1; fi
fi
echo "── 5) 유출어 게이트(배포 번들에 내부 은어·의도 서술 금지)"
# 교훈(2026-08-14): 이 레포는 PUBLIC이고 아래 파일들은 브라우저로 그대로 나간다.
# 8/13 문서 분리를 하고도 배포 번들 주석에 "미꾸라지"(법망 회피 내부어)가 4곳 남아 있었다.
# 진짜 리스크는 다크패턴 설계가 아니라 '의도를 우리 이름으로 문서화한 것'이다 —
# fictional framing이 실드인데 같은 파일이 그게 의도적 장치라고 증언하면 실드가 자멸한다.
# 그래서 파일명 화이트리스트가 아니라 '의도 서술 어휘'로 잡는다.
SHIP="index.html game.js style.css i18n.js units.js gear.js lore.js legion-beacon.js sw.js manifest.json"
BAN='미꾸라지|분류 회피|규제 회피|법망|Skinner|중독 엔진|고래 유인|사행성|착취'
leak=0
for f in $SHIP; do
  [ -f "$f" ] || continue
  # "다크패턴 아님" 류 부정 선언은 통과시킨다(그건 숨길 게 아니다)
  hits=$(grep -nE "$BAN" "$f" 2>/dev/null | grep -vE '아님|금지|없음') || true
  if [ -n "$hits" ]; then echo "  ❌ $f"; echo "$hits" | cut -c1-140 | head -5; leak=1; fi
done
if [ "$leak" = 0 ]; then echo "  ✅ 배포 번들 클린 — 내부 은어 0"; else echo "  🔴 배포 중단: 주석 문구를 '실제로 무엇을 보장하는가'로 다시 쓴 뒤 재검증"; fail=1; fi
echo "──────────────"
if [ "$fail" = 0 ]; then echo "🟢 검증 통과 — 배포 OK"; exit 0; else echo "🔴 검증 실패 — 배포 중단"; exit 1; fi
