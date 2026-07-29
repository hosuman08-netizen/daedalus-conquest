/* Legion 경량 측정 beacon — daedalus
   주 계측은 game.js logEvent (ALLOWED 풀계약). beacon = 통합 share/activate + multi /stats view.
   2026-07-29 AWAY-w2: multi-parity body (anon+anonId+ts+extra).
   ⚠️ boot에 session_start/install 넣지 않음 — game.js logEvent가 소유 (이중 emit 방지). */
(function(){
  try{
    var URL = window.LEGION_ANALYTICS_URL || 'https://legion-analytics.hoyashi95.workers.dev';
    var APP = String(window.LEGION_APP || 'daedalus-conquest').slice(0,40);
    var K = 'legion_anon';
    var anon = localStorage.getItem(K);
    if (!anon) {
      anon = (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
      localStorage.setItem(K, anon);
    }
    window.legionTrack = function (type, extra) {
      if (!URL) return;
      try {
        var body = JSON.stringify(Object.assign({
          app: APP,
          type: String(type || 'view').slice(0, 32),
          anon: anon,
          anonId: anon,
          ts: Date.now()
        }, extra || {}));
        if (navigator.sendBeacon) { navigator.sendBeacon(URL + '/ev', body); }
        else {
          fetch(URL + '/ev', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: body,
            keepalive: true
          }).catch(function () {});
        }
      } catch (e) {}
    };
    // multi /stats rolls up :view — keep single view boot only
    function boot() {
      try { window.legionTrack('view'); } catch (e) {}
    }
    if (document.readyState !== 'loading') boot();
    else document.addEventListener('DOMContentLoaded', boot);
  } catch (e) {}
})();
