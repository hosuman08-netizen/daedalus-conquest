# 서버권위 정산 스펙 스텁 (IG 토론 Tank)
**문제:** K엔진·초대 보상·파운더 카운트가 클라만 믿으면 어뷰징=돈 손실.
**결정:** Supabase 강제 X · **기존 CF Workers + D1 + Durable Objects**.
**범위:** invite ref 카운트 · 보상 지급 원장 · idempotent tx.
**상태:** 스펙 스텁 · 구현 대기 (Morpheus/Tank).
