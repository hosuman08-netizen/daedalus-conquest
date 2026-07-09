# P0 Growth Instrumentation + Viral Loops — Implementation Deltas
Date: 2026-07-01 · By: Grok (CEO) autonomous prep (reversible analysis)
For: Morpheus (COO) execution handoff. Trinity spec direct.
Governance: edits/git = 자율. Deploy/push = neo y/n. Prominent rates + no kompu + fictional always.

## North Star
주간 신규 활성화 수 (core_loop_complete or ch5_reached count).

## 1. Instrumentation (analytics + launch tagging)
- Enhance install + first_open:
  - Parse tg.initDataUnsafe.start_param or ?ref / utm_source etc at init.
  - logEvent("install", { ch:.., ref:.., channel:.., utm:.. , source: start_param or url })
  - Same for "first_open" if distinct, or session_start enhance.
  - Format: start=ref_{myTGID}_{channel}  e.g. ref_123456789_gacha or ref_123456789_x or ref_123456789_tg
- Emit core events (add where missing):
  - After first successful auto-battle cycle finish or any gacha: logEvent("core_loop_complete", { ch: META.chapter })
  - On chapter reach 5 first time (track META._ch5Reached): logEvent("ch5_reached", { ref: META.referredBy })
  - Ensure share_clicked, referral_bonus_granted already wired in some places.
- logEvent fn already good (fire-and-forget, sendBeacon). Keep.
- Update processReferralBonus to also tag the source channel from start_param parse (split _ ).

## 2. Two-sided Referral (game.js + pay)
- Invitee (joiner) on processReferralBonus:
  - Current: gold+gem. **Change to fictional starter**: grant equivalent of "10연 1SR starter pack".
  - E.g. META.gems += ... or simulate 10 gacha grants fictional (no real pay) or direct grant 1 SR unit + fodder.
  - Toast: "친구 선물: 10연 확정 SR 획득!"
  - Keep logEvent('referral_bonus_granted'...
- Inviter:
  - On ch5_reached for invitee: need to credit inviter.
  - Use existing PAY_BACKEND /referrals or extend: on ch5 emit, POST or use existing count bump.
  - Simple MVP: when ch5, if (META.referredBy) { log + later refreshReferrals triggers inviter claim? Or direct grant small fictional + prestige for inviter via API? }
  - Keep milestone in pay for scale, but P0 focus ch5 trigger.
- Invite link gen (update existing ~4445):
  - `https://t.me/daedalus_conquest_bot?start=ref${myId}_inapp`  (add channel tag)
  - Also support for X/share etc.

## 3. Share Hooks 3곳 (dopamine peak)
Use TG share: current shareDominion uses openTelegramLink. Enhance to pass start=refID_channel.
For best viral in TG: use switchInlineQuery if supported, else share url with start param + text "MY Legion carried X%".

1. SSR / high rarity result (in/after showGacha):
   - If rar.key === 'SSR' (or UR/EX): add button or auto after spectacle.
   - <button>내 결과 공유 (TG 카드)</button>
   - onclick: generate link `https://t.me/daedalus_conquest_bot?start=ref${uid}_ssr` ; tg.openTelegramLink(share url + text with rarity + "MY Legion" ); logEvent("share_clicked", {type:'ssr'})

2. Boss clear / Prestige (doAscend success + battle win high ch):
   - In finish or post doAscend: if win or ascended, show/share overlay or toast+btn "인증 공유".
   - Use shareDominion style or new shareAscend().
   - Channel tag _prestige or _boss.

3. Near-miss (battle tease):
   - In battle log when near miss (already has "아슬아슬", "near-miss tease").
   - Add small "공유로 10골드" fictional button if near-miss detected.
   - On click: share + small in-game fictional gold.

Buttons locations:
- Main persistent: add to battle page bottom or nav "👥 친구 초대" → open share modal with start link.
- SSR result (gacha modal): append share btn if high rarity.
- Daily claim (after checkDaily toast or reward render): add "초대하고 스타터 더 받기" btn.

## 4. UI / Button wiring
- Existing: share-dominion, ref-claim, profile share.
- Add new:
  - In index.html or dynamic: invite btns.
  - After daily reward display: insert share/invite.
  - In gacha after list: conditional share.

## 5. Pay-worker / backend notes (if needed)
- /referrals already counts for inviter. On ch5_reached from client, can bump or use client log.
- For starter pack fictional: keep client side (game.js) to avoid pay.
- Update start button payload reply to use ref_{} format + channel.
- Existing ?ref= fallback keep.

## 6. Test gates (reversible)
- Local: simulate start=ref_XXXX_tg in URL / tg mock.
- Emit test events → /stats check counts.
- ch5: force chapter=5 , see event.
- SSR: pull until SSR → share btn appears.
- Referral join sim: grant fictional SR starter.
- Prominent disclosure + fictional kept.

## Exact insertion hints (from current code)
- processReferralBonus ~437: upgrade parser + grant pack fictional.
- install block ~5690: parse start/utm before/ in logEvent.
- showGacha ~3505: after list render, if SSR add share btn.
- doAscend ~4182 success path: add share hook.
- battle finish win ~2678 area + near miss ~3010/3035: share trigger.
- checkDaily ~3560 post grant: add invite btn.
- Invite gen ~4445: update link format.
- Add ch5 detect in chapter bump ~2794.
- core_loop: in auto finish or post gacha.

## Anti
No A/B, no big dashboard, no paid promo. Small MVP wiring only. N<50 until 2w stable.

## Compliance (미꾸라지)
Fictional values only. Prominent rates in gacha UI already. No kompu. Age gate ok. Reversible.

Ready for Morpheus: handoff this + Trinity spec. CEO prep done.
Grok (CEO) — Legion one.
