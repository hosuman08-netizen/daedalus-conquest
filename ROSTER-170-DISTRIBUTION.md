# 170종 로스터 등급 분포 설계 (N 신설)

**현재**: 120종 (SSR 9 + SR 55 + R 56)  
**목표**: 170종 (N 티어 신설 포함)

## 권장 분포

| 등급 | 종 수 | 비율   | 비고 |
|------|-------|--------|------|
| SSR  | 9     | 5.3%   | God-tier Founding 9종 유지 (희소·프리미엄 가치) |
| SR   | 55    | 32.4%  | Elite/초인 기존 55종 유지 |
| R    | 56    | 32.9%  | 약간 초인적 기존 56종 유지 |
| N    | 50    | 29.4%  | 평범한 인간 신설 (id 121~170) |

**총 170종**

## 근거 (1줄)
기존 120종(SSR9+SR55+R56, id 1~120)의 플레이어 META/소유권 100% 보존 + N 50종(id 121~170) 신설로 가챠 60% N 실드랍률 실현, 무과금 조기 진입/수집 깊이/볼륨 확보, 추후 N80→200 확장 여지 확보.

## 구현 메모 (units.js 연동)
- RARITY_COUNT: { SSR:9, SR:55, R:56, N:50 }
- buildRoster() N 구간: PREFIX + ARCH_NOUN (이미 코드 지원)
- id 배치: SSR 1-9, SR 10-64, R 65-120, N 121-170 (기존 1-120 완전 보호)
- RARITY_MUL / COLOR: N=1.0 / #9ca3af 유지
- 가챠 확률: N 55~60% · R 30% · SR 12% · SSR 3% (별도 조정)
- 신규 아트: N-ART-PROMPTS 또는 ART-DIRECTION-CHARACTER-PROMPTS 템플릿 사용 → art/u121.png ~ u170.png

## 다음 단계
- units.js RARITY_COUNT N:50으로 업데이트 (필요 시)
- N 아트 50종 생성 (템플릿 + image_gen)
- codex/gacha synthetic fallback + PNG lazy 로직 확인 (game.js)
- 테스트: N 드랍률·수집 루프·META 호환

(2026-06-16 · Grok CEO 창작)