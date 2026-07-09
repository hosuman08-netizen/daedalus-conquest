#!/bin/bash
# p1-pay-test.sh — Stars 결제 실전 테스트 (Sovereign/Morpheus용)
# 실행: bash p1-pay-test.sh
set -e

W="https://legion-pay.hoyashi95.workers.dev"
echo "=== p1 결제 테스트 ==="
echo "1. /rates (prominent disclosure)"
curl -s "$W/rates" | head -c 400; echo

echo ""
echo "2. /invoice (Stars link 발급 — 성공 시 link 나와야 함)"
INV=$(curl -s "$W/invoice?item=starter&uid=TEST$(date +%s)")
echo "$INV"
if echo "$INV" | grep -q '"link"'; then
  echo "✅ /invoice link 생성 성공"
else
  echo "❌ 실패 (BOT_TOKEN secret 확인 필요)"
fi

echo ""
echo "3. /verify (KV 영수증 없으면 false — 정상)"
curl -s "$W/verify?item=starter&uid=TEST$(date +%s)"

echo ""
echo "=== 완료 체크리스트 ==="
echo "- [ ] wrangler secret BOT_TOKEN 설정 + deploy"
echo "- [ ] /invoice link 반환 확인"
echo "- [ ] TG 미니앱 shop → starter/gem1 클릭 → openInvoice 동작"
echo "- [ ] 실제 소액 결제 후 grant 확인 (TG 내)"
echo "- [ ] /rates prominent disclosure 노출됨"
echo "p1 결제 완료 시 legion-status + report."

echo "테스트 끝. 결과 Sovereign에게 공유."
