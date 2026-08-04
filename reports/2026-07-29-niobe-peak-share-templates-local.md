# Niobe · Local peak-share templates (daedalus + p21)
**When:** 2026-07-29 · 3H-w2 · Seraph→Niobe  
**Scope:** copy only · post-draw / post-launch peak · TG / Web Share · **No X** · no public post  
**Track:** Ent · fictional entertainment · 18+ · odds prominent in-app only (not in share line)  
**Wire:** 1-tap CTA · share=bonus product-owned · K-proxy `start=` / `ref=` · UGC canvas when available

---

## DAEDALUS — peak (post first-gacha / SSR+) · max 4 lines

### D1 · Primary (TG 1-tap)
```
방금 뽑혔다.
{{relic_name}} · {{rarity}} — 내 레코드.
daedalus · 가챠 한 방
https://t.me/daedalus_conquest_bot?start=share_{{uid}}_{{relic_id}}
```

### D2 · Punch alt (same slot)
```
한 장. {{relic_name}} ({{rarity}})
내 것. 따라와.
https://t.me/daedalus_conquest_bot?start=share_{{uid}}_{{relic_id}}
```

### D3 · First gacha (activation peak)
```
첫 소환 끝.
{{relic_name}} · {{rarity}} 봉인.
성장 루프 열림 — 같이 키울 사람.
https://t.me/daedalus_conquest_bot?start=share_{{uid}}_fg
```

### D4 · UGC canvas caption (image export)
```
{{player}} — {{relic_name}} 봉인.
{{rarity}}. 기록됨. daedalus
https://t.me/daedalus_conquest_bot?start=share_{{uid}}_{{relic_id}}
```

**Vars:** `relic_name` `rarity` `uid` `relic_id` `player`  
**Trigger:** showGacha SSR/UR/EX + first_gacha mountShareHook · glow still on  
**Bonus:** share complete → fictional gems/scrap (amount product-owned; live code +5 gems CD 24h)  
**Cross seeds:** p9 / p11 / p17 start tags when deep-link router ready (`start=share_{{uid}}_x9` etc.)

---

## P21 TAROT — peak (post-draw / daily card) · max 4 lines

### T1 · Primary (image share + text)
```
방금 뽑았다.
{{card_ko}} · {{direction}} — {{focus_one_line}}
픽션 리딩 · 30초
{{share_url}}
```

### T2 · Major-heavy emotion (major ≥ 2)
```
메이저가 강하다.
{{names_join}}
지금 이미지로 남김.
{{share_url}}
```

### T3 · Daily card (habit loop)
```
오늘 카드: {{card_ko}}
한 줄만 보고 하루 시작.
{{share_url}}
```

### T4 · UGC canvas caption
```
{{spread_name}} — {{card_ko}}
내 리딩 한 장. (엔터테인먼트)
{{share_url}}
```

**Vars:** `card_ko` `direction` `focus_one_line` `names_join` `spread_name`  
**URL builder (live):** `https://hosuman08-netizen.github.io/tarot-oracle/?utm_source=share&utm_medium=app&ref={{kid}}`  
**Trigger:** offerSharePeak post-draw · sharePeakBtn → shareReading (canvas file preferred)  
**No X:** do not call shareToX from peak CTA (local wire keeps TG/Web Share only)

---

## Wire (Morpheus / product — not ship code this file)
| App | Peak moment | CTA | K-proxy | Bonus |
|-----|-------------|-----|---------|-------|
| daedalus | first_gacha + SSR+ | cardBrag / mountShareHook | `start=share_*` | gems/scrap |
| p21 | post-draw sharePeak | 결과 이미지 공유 | `ref=` UTM | track share_peak |

SENSE: one protagonist (relic / card) · ≤4 lines · no emoji dump · no odds dump in share.  
Shield: fictional · 18+ · rates on pull UI only.  
**Status:** LOCAL SHIP · parked for inject · **No X · no push · no neo-public seed.**

## Preview (fill example)
**D1:**  
방금 뽑혔다. / Arclight Warden · SSR — 내 레코드. / daedalus · 가챠 한 방 / `…?start=share_42_u7`  

**T1:**  
방금 뽑았다. / 태양 · 정방향 — 드러낼 타이밍. / 픽션 리딩 · 30초 / `…/tarot-oracle/?…&ref=k9`

## CHECKER
- [x] daedalus templates 4-line D1–D4  
- [x] p21 templates 4-line T1–T4  
- [x] paths local only · No X  
- [x] K-proxy fields present  
