/* Makes the app self-contained.
   1. Every JobLeads API call is answered with an empty object. Unanswered calls make the
      app redirect to /maintenance.html, which does not exist in an export; the prototype
      itself needs no backend (its numbers and its map ship in the bundle).
   2. Opened without a hash (double-click), the hub page is the entry route. */
(function () {
  var original = window.fetch ? window.fetch.bind(window) : null;
  function json(body) {
    return Promise.resolve(new Response(JSON.stringify(body), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    }));
  }
  window.fetch = function (input, init) {
    var url = String(input && input.url ? input.url : input);
    var local = url.indexOf('http') !== 0 || url.indexOf(location.origin) === 0;
    if (!local || /\/(rw|api)\//.test(url)) { return json({}); }
    return original ? original(input, init) : json({});
  };
  if (!location.hash) { location.replace(location.href.split('#')[0] + '#/us/job-city-tracker'); }
})();
