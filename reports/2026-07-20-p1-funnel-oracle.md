# p1 Funnel (Oracle)

battle_win → (gem_drip) → gacha_nudge? → shop_view → gacha_pull → first_gacha

Critical path emits (must stay wired):
battle_win, gem_drip, gacha_nudge, shop_view, gacha_pull, first_gacha, share_clicked

Query (analytics worker): count each last 7d; alert if shop_view=0 while battle_win>10.
