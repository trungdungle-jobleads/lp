/* Upload modal */
function openModal() {
  var m = document.getElementById('des148-modal');
  clearTimeout(window.des148ModalCloseT);
  m.classList.remove('is-closing');
  m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (window.des148UpdateSticky) window.des148UpdateSticky();
}
function closeModal() {
  var m = document.getElementById('des148-modal');
  if (!m.classList.contains('is-open') || m.classList.contains('is-closing')) return;
  m.classList.add('is-closing');   /* play the fade/scale-out, then hide */
  clearTimeout(window.des148ModalCloseT);
  window.des148ModalCloseT = setTimeout(function(){
    m.classList.remove('is-open'); m.classList.remove('is-closing');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.des148UpdateSticky) window.des148UpdateSticky();
  }, 300);
}
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });

/* Multi-step upload flow: pick file -> upload+consent -> matching -> complete -> login */
function showStep(name) {
  var card = document.getElementById('des148-modalcard');
  if (!card) return;
  [].slice.call(card.querySelectorAll('.des148-mstep')).forEach(function(s){ s.hidden = s.getAttribute('data-mstep') !== name; });
  card.setAttribute('data-step', name);
  card.scrollTop = 0;
}
function pickResume() { var f = document.getElementById('des148-file'); if (f) f.click(); }
function startUploadFlow(name) {
  var fn = document.getElementById('des148-filename'); if (fn) fn.textContent = name || 'resume.docx';
  var cb = document.getElementById('des148-consent-cb'); if (cb) cb.checked = false;
  var btn = document.getElementById('des148-startbtn'); if (btn) { btn.disabled = true; btn.classList.remove('is-loading'); }
  showStep('upload');
  openModal();
}
function onConsentChange() {
  var cb = document.getElementById('des148-consent-cb');
  var btn = document.getElementById('des148-startbtn');
  if (btn) btn.disabled = !(cb && cb.checked);
}
function startMatching() {
  var cb = document.getElementById('des148-consent-cb');
  if (!cb || !cb.checked) return;
  var btn = document.getElementById('des148-startbtn');
  if (btn) { btn.classList.add('is-loading'); btn.disabled = true; }
  setTimeout(function(){ if (btn) btn.classList.remove('is-loading'); showStep('complete'); }, 2200);
}
function viewMatches() { showStep('login'); }
function togglePw() {
  var pw = document.getElementById('des148-pw'); if (!pw) return;
  var isPw = pw.type === 'password';
  pw.type = isPw ? 'text' : 'password';
  var ic = document.querySelector('.des148-eye .des148-ms img');
  if (ic) ic.src = 'assets/icons/' + (isPw ? 'visibility_off' : 'visibility') + '-787673.svg';   /* swap the external icon file */
}
(function(){ var f = document.getElementById('des148-file'); if (f) f.addEventListener('change', function(){ if (this.files && this.files[0]) startUploadFlow(this.files[0].name); this.value = ''; }); })();

/* Hero upload dropzones (V1 + V2): click, keyboard, and drag & drop (PDF / Word) */
(function(){
  var drops = [].slice.call(document.querySelectorAll('.des148-dz'));
  if (!drops.length) return;
  var stop = function(e){ e.preventDefault(); e.stopPropagation(); };
  drops.forEach(function(drop){
    drop.addEventListener('click', pickResume);
    drop.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); pickResume(); }
    });
    ['dragenter', 'dragover'].forEach(function(ev){
      drop.addEventListener(ev, function(e){ stop(e); drop.classList.add('is-dragover'); });
    });
    ['dragleave', 'dragend'].forEach(function(ev){
      drop.addEventListener(ev, function(e){ stop(e); drop.classList.remove('is-dragover'); });
    });
    drop.addEventListener('drop', function(e){ stop(e); drop.classList.remove('is-dragover'); var fl = e.dataTransfer && e.dataTransfer.files; startUploadFlow(fl && fl[0] ? fl[0].name : null); });
  });
  /* Stop the browser from navigating away if a file is dropped outside a zone */
  ['dragover', 'drop'].forEach(function(ev){
    window.addEventListener(ev, function(e){ if (!(e.target.closest && e.target.closest('.des148-dz'))) e.preventDefault(); });
  });
})();

/* Floating header-version switcher (V1 / V2) */
(function(){
  var hero = document.querySelector('.des148-herobg');
  var media = document.querySelector('.des148-herocard-media');
  var sw = document.querySelector('.des148-vswitch');
  if (!hero || !media || !sw) return;
  var v2 = media.querySelector('.des148-hero-v2');
  var setV = function(v){
    hero.setAttribute('data-hv', v);
    try { localStorage.setItem('des148-hv', v); } catch(e){}   /* remember the chosen version across reloads */
    [].slice.call(sw.querySelectorAll('.des148-vswitch-btn')).forEach(function(b){ b.classList.toggle('is-active', b.getAttribute('data-v') === v); });
    if (v2) {
      if (v === '2') { v2.classList.add('is-shown'); if (window.des148V2) window.des148V2.start(); }
      else { v2.classList.remove('is-shown'); if (window.des148V2) window.des148V2.stop(); }
    }
    if (window.des148V3) { if (v === '3') window.des148V3.start(); else window.des148V3.stop(); }
    if (window.des148RevealHero) window.des148RevealHero(v);  /* replay the ordered hero entrance for this version */
  };
  sw.addEventListener('click', function(e){ var b = e.target.closest('.des148-vswitch-btn'); if (b) setV(b.getAttribute('data-v')); });
  /* Show the switcher when the pointer is in the right-edge strip (~100px) — always reachable, any screen width */
  hero.addEventListener('mousemove', function(e){
    sw.classList.toggle('is-visible', sw.contains(e.target) || e.clientX >= window.innerWidth - 100);
  });
  hero.addEventListener('mouseleave', function(){ sw.classList.remove('is-visible'); });
  /* Restore the persisted version on load — set the attribute/button/is-shown now (before the reveal
     runs) so the page comes up directly in the saved version; the controllers below start the loop. */
  var savedV = null; try { savedV = localStorage.getItem('des148-hv'); } catch(e){}
  var initV = (savedV === '1' || savedV === '2' || savedV === '3') ? savedV : '2';   /* V2 is the standard/default version */
  hero.setAttribute('data-hv', initV);
  [].slice.call(sw.querySelectorAll('.des148-vswitch-btn')).forEach(function(b){ b.classList.toggle('is-active', b.getAttribute('data-v') === initV); });
  if (initV === '2' && v2) v2.classList.add('is-shown');
})();

/* V3 only: the whole hero card is a dropzone, revealed only while a file is dragged over it.
   A hint pill follows the cursor so people discover it; on drop we open the standard upload popup. */
(function(){
  var hero = document.querySelector('.des148-herobg');
  var card = document.querySelector('.des148-herocard');
  var pill = card && card.querySelector('.des148-heropill');
  if (!hero || !card || !pill) return;
  var isV3 = function(){ return hero.getAttribute('data-hv') === '3'; };
  var stop = function(e){ e.preventDefault(); e.stopPropagation(); };
  var depth = 0;   /* dragenter/leave fire per child -> count to avoid flicker */
  var setDropping = function(on){ card.classList.toggle('is-dropping', on); if (on) card.classList.remove('is-hint'); };
  card.addEventListener('dragenter', function(e){ if (!isV3()) return; stop(e); depth++; setDropping(true); });
  card.addEventListener('dragover',  function(e){ if (!isV3()) return; stop(e); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; if (!card.classList.contains('is-dropping')) setDropping(true); });
  card.addEventListener('dragleave', function(e){ if (!isV3()) return; stop(e); depth = Math.max(0, depth - 1); if (depth === 0) setDropping(false); });
  card.addEventListener('drop',      function(e){ if (!isV3()) return; stop(e); depth = 0; setDropping(false); var fl = e.dataTransfer && e.dataTransfer.files; startUploadFlow(fl && fl[0] ? fl[0].name : null); });
  /* hint pill trails the cursor (lower-right, clamped inside the card) and eases toward it with a light spring:
     it accelerates, then brakes smoothly, instead of snapping. */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var upBtn = card.querySelector('.des148-hero-actions .des148-btn');   /* the "Upload my resume" button — hide the pill while hovering it */
  var mqMobile = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;   /* the hint pill is desktop-only — dropping a file makes no sense on the mobile layout */
  var EDGE = 24;       /* = the 1.5rem media padding (visual-to-card-edge gap / dashed-frame inset), so the pill's reach matches the padding exactly */
  var SMOOTH = 0.25;   /* seconds to catch up to the cursor — larger = slower, more visible accel/decel */
  var tgtX = 0, tgtY = 0, curX = 0, curY = 0, velX = 0, velY = 0, raf = null, placed = false, lastTs = null, visualReady = false;
  /* critically-damped follow (SmoothDamp): the pill eases toward the cursor with a visible acceleration and a soft stop, no overshoot */
  var tick = function(ts){
    var dt = (lastTs == null) ? 1/60 : Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    var omega = 2 / SMOOTH, x = omega * dt, exp = 1 / (1 + x + 0.48*x*x + 0.235*x*x*x);
    var cx = curX - tgtX, tx = (velX + omega * cx) * dt; velX = (velX - omega * tx) * exp; curX = tgtX + (cx + tx) * exp;
    var cy = curY - tgtY, ty = (velY + omega * cy) * dt; velY = (velY - omega * ty) * exp; curY = tgtY + (cy + ty) * exp;
    pill.style.left = curX + 'px'; pill.style.top = curY + 'px';
    if (Math.abs(curX - tgtX) + Math.abs(curY - tgtY) + Math.abs(velX) + Math.abs(velY) > 0.3) {
      raf = requestAnimationFrame(tick);
    } else { curX = tgtX; curY = tgtY; velX = velY = 0; pill.style.left = curX + 'px'; pill.style.top = curY + 'px'; raf = null; lastTs = null; }
  };
  /* track the cursor across the whole document so the pill stays visible and keeps trailing even when the
     mouse is outside the card; the clamp pins it to the dropzone area, so it just trails to the nearest edge. */
  document.addEventListener('mousemove', function(e){
    if (!isV3() || !visualReady || (mqMobile && mqMobile.matches) || card.classList.contains('is-dropping') || (upBtn && upBtn.contains(e.target))) { card.classList.remove('is-hint'); return; }   /* hidden until the V3 visual has appeared; also hide for: not-V3, mobile, during a drag, or over the Upload button */
    var r = card.getBoundingClientRect(), pw = pill.offsetWidth, ph = pill.offsetHeight;   /* layout size (ignores the show/hide scale) so the clamp is exact */
    tgtX = Math.max(EDGE, Math.min(e.clientX - r.left + 18, r.width - pw - EDGE));   /* clamped -> stays in the dropzone area even when the cursor is outside the card */
    tgtY = Math.max(EDGE, Math.min(e.clientY - r.top + 18, r.height - ph - EDGE));
    card.classList.add('is-hint');
    if (reduce) { curX = tgtX; curY = tgtY; pill.style.left = tgtX + 'px'; pill.style.top = tgtY + 'px'; return; }
    if (!placed) { curX = tgtX; curY = tgtY; velX = velY = 0; placed = true; lastTs = null; pill.style.left = curX + 'px'; pill.style.top = curY + 'px'; }
    if (!raf) { lastTs = null; raf = requestAnimationFrame(tick); }
  });
  if (upBtn) upBtn.addEventListener('mouseenter', function(){ if (isV3()) { card.classList.remove('is-hint'); } });

  /* Show the pill parked at the bottom-right of the dropzone (no mouse move needed) */
  var startPill = function(){
    if (!isV3() || (mqMobile && mqMobile.matches)) return;
    var r = card.getBoundingClientRect(); if (!r.width) return;
    var pw = pill.offsetWidth, ph = pill.offsetHeight;
    tgtX = curX = Math.max(EDGE, r.width - pw - EDGE);
    tgtY = curY = Math.max(EDGE, r.height - ph - EDGE);
    velX = velY = 0; placed = true; lastTs = null;
    pill.style.left = curX + 'px'; pill.style.top = curY + 'px';
    card.classList.add('is-hint');
  };
  /* ...but only once the header trust stat has finished counting up to 12,000,000 (des148:trustdone) */
  var markVisualReady = function(){ if (visualReady) return; visualReady = true; requestAnimationFrame(startPill); };
  document.addEventListener('des148:trustdone', markVisualReady);
  setTimeout(markVisualReady, 6000);   /* fallback if the counter never completes */

  /* Click anywhere on the card to upload — desktop V3 only (where the pill lives). On mobile the whole card is NOT clickable; only the V3 visual is (below). */
  card.addEventListener('click', function(e){
    if (!isV3() || (mqMobile && mqMobile.matches)) return;
    if (e.target.closest('button, a, input, label')) return;            /* let the Upload button / links act on their own */
    if (window.getSelection && String(window.getSelection())) return;   /* ignore text selection */
    pickResume();
  });
  var v3visual = card.querySelector('.des148-hero-v3');
  if (v3visual) v3visual.addEventListener('click', function(){
    if (!isV3() || !(mqMobile && mqMobile.matches)) return;             /* mobile V3: tap the visual to upload */
    pickResume();
  });

  /* fade the pill out softly when it scrolls off-screen, and back in when it returns */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(entries){
      entries.forEach(function(e){ card.classList.toggle('is-pilloff', !e.isIntersecting); });
    }, { rootMargin: '-30px 0px -30px 0px', threshold: 0 }).observe(pill);
  }
})();

/* How it works — the vertical line fills red down to where the screen centre crosses it (full when the centre reaches its end). The fill eases toward that scroll target with the same critically-damped follow as the header pill, so it moves organically instead of tracking scroll 1:1 */
(function(){
  var tl = document.querySelector('.des148-tl');
  if (!tl) return;
  var SMOOTH = 0.25;   /* follow smoothing time — matches the header pill feel */
  var target = 0, cur = 0, vel = 0, raf = null, lastTs = null;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var measure = function(){
    var r = tl.getBoundingClientRect();
    target = Math.max(0, Math.min(window.innerHeight / 2 - r.top, r.height));
  };
  var apply = function(v){ tl.style.setProperty('--tl-fill', v + 'px'); };
  var tick = function(ts){
    if (lastTs === null) lastTs = ts;
    var dt = Math.min((ts - lastTs) / 1000, 0.05);   /* clamp dt so a paused tab doesn't cause a jump */
    lastTs = ts;
    measure();
    var omega = 2 / SMOOTH, x = omega * dt;
    var exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    var change = cur - target;
    var temp = (vel + omega * change) * dt;
    vel = (vel - omega * temp) * exp;
    cur = target + (change + temp) * exp;
    apply(cur);
    if (Math.abs(cur - target) > 0.3 || Math.abs(vel) > 0.3) {
      raf = requestAnimationFrame(tick);
    } else {
      cur = target; apply(cur); vel = 0; raf = null; lastTs = null;
    }
  };
  var kick = function(){ if (raf === null) { lastTs = null; raf = requestAnimationFrame(tick); } };
  if (reduce) {   /* reduced motion: snap straight to the scroll position, no easing */
    var snap = function(){ measure(); apply(target); };
    window.addEventListener('scroll', snap, { passive: true });
    window.addEventListener('resize', snap);
    snap();
  } else {
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    measure(); cur = target; apply(cur);   /* start already at the current scroll position (no intro fill on load) */
  }
})();

/* The Problem — hide the "Fit" word whenever the filled bar is too narrow to show the whole "Fit NN%" label; the number always stays visible */
(function(){
  var fits = [].slice.call(document.querySelectorAll('.des148-pw-fit'));
  if (!fits.length) return;
  var check = function(fit){
    var word = fit.querySelector('.des148-pw-fit-word');
    var bar = fit.closest('.des148-pw-bar');
    var fill = bar && bar.querySelector('i');
    if (!word || !fill) return;
    word.style.display = '';                                  /* show to measure the full label width */
    if (fit.scrollWidth > fill.clientWidth) word.style.display = 'none';   /* doesn't fit -> drop just the word */
  };
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function(entries){
      entries.forEach(function(en){
        var fit = en.target.querySelector('.des148-pw-fit');   /* en.target is the filled <i>; recheck as it grows/reflows */
        if (fit) check(fit);
      });
    });
    fits.forEach(function(fit){
      var fill = fit.closest('.des148-pw-bar').querySelector('i');
      if (fill) ro.observe(fill);
    });
  } else {
    var all = function(){ fits.forEach(check); };
    window.addEventListener('resize', all);
    setTimeout(all, 2600);   /* after the bars have filled */
    all();
  }
})();

/* V2 stage: the active step drives the scene; every transition slides content upward (loop) */
(function(){
  var v2 = document.querySelector('.des148-hero-v2');
  if (!v2) return;
  var steps = [].slice.call(v2.querySelectorAll('.des148-vstep'));
  var scenes = [].slice.call(v2.querySelectorAll('.des148-scene'));
  if (!steps.length || !scenes.length) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = 0, timer = null;
  var syncSteps = function(){ steps.forEach(function(s, i){ s.classList.toggle('is-active', i === idx); }); };
  var place = function(){
    scenes.forEach(function(s, i){
      s.style.transition = 'none';
      s.style.transform = 'translateY(' + (i === idx ? '0' : '100%') + ')';
      s.classList.toggle('is-active', i === idx);
    });
    void v2.offsetHeight;
    scenes.forEach(function(s){ s.style.transition = ''; });
    syncSteps();
  };
  var jobtrack = v2.querySelector('.des148-jobtrack');
  var jobCards = jobtrack ? [].slice.call(jobtrack.querySelectorAll('.des148-match')) : [];
  var restartScroll = function(){ if (!jobtrack) return; jobtrack.style.animation = 'none'; void jobtrack.offsetHeight; jobtrack.style.animation = ''; };
  var go = function(next){
    if (next === idx) return;
    var oldEl = scenes[idx], newEl = scenes[next];
    if (oldEl.getAttribute('data-scene') === '2') {
      /* matched-jobs leaving: pin the cards' transform to none so they don't jog ~20px down when
         .is-active is removed — the group's own opacity fade (scene rule) handles the disappearing. */
      jobCards.forEach(function(c){ c.style.transform = 'none'; });
    }
    if (newEl.getAttribute('data-scene') === '2') {
      /* matched-jobs entering: clear the transform pin back to the hidden start (no animation), then
         let .is-active replay the staggered entrance; restart the scroll from the top. */
      jobCards.forEach(function(c){ c.style.transition = 'none'; c.style.transform = ''; });
      if (jobtrack) void jobtrack.offsetHeight;
      jobCards.forEach(function(c){ c.style.transition = ''; });
      restartScroll();
    }
    /* place the incoming scene just below without animating, then slide it up — so every scene
       (including the whole matched-jobs group) moves bottom-to-top and never overlaps the outgoing
       one. Covers the 3 -> 1 loop too (incoming may be parked above at -100%; jumping it to 100%
       first is invisible since both are off-screen). */
    newEl.style.transition = 'none';
    newEl.style.transform = 'translateY(100%)';
    void newEl.offsetHeight;
    newEl.style.transition = '';
    if (reduce) {
      oldEl.style.transition = 'none'; oldEl.style.transform = 'translateY(100%)'; void oldEl.offsetHeight; oldEl.style.transition = '';
      newEl.style.transition = 'none'; newEl.style.transform = 'translateY(0)'; void newEl.offsetHeight; newEl.style.transition = '';
    } else {
      oldEl.style.transform = 'translateY(-100%)';   /* old scene slides up and out the top */
      newEl.style.transform = 'translateY(0)';         /* new scene slides in from below */
    }
    oldEl.classList.remove('is-active'); newEl.classList.add('is-active');
    idx = next; syncSteps();
  };
  window.des148V2 = {
    start: function(){ if (timer) { clearInterval(timer); timer = null; } idx = 0; place(); if (!reduce) timer = setInterval(function(){ go((idx + 1) % scenes.length); }, 2800); },
    stop: function(){ if (timer) { clearInterval(timer); timer = null; } idx = 0; place(); }
  };
  /* If the page loaded already on V2 (persisted), kick off the scene loop right away. */
  var heroSec = document.querySelector('.des148-herobg');
  if (heroSec && heroSec.getAttribute('data-hv') === '2') window.des148V2.start();
})();

/* V3 slides: auto-cycle "Upload resume" <-> "We analyze"; the title slides in from the right each time */
(function(){
  var panel = document.querySelector('.des148-v3panel');
  var step = document.querySelector('.des148-v3-step');
  if (!panel || !step) return;
  var num = step.querySelector('.des148-v3-num'), lbl = step.querySelector('.des148-v3-steplbl');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* job-card match % counts up to its target with an ease-out (decelerating) finish, staggered to match each
     card's entrance; targets are read once so replays always count from 0 back up to the real number */
  var pcts = [].slice.call(document.querySelectorAll('.des148-v3-job-pct'));
  pcts.forEach(function(el){ var m = el.textContent.match(/\d+/); el.setAttribute('data-target', m ? m[0] : '0'); });
  var easeOut = function(t){ return 1 - Math.pow(1 - t, 3); };
  var pctGen = 0;
  var setPctTargets = function(){ pcts.forEach(function(el){ el.textContent = (el.getAttribute('data-target') || '0') + '%'; }); };
  var countPcts = function(){
    var gen = ++pctGen;
    if (reduce) { setPctTargets(); return; }
    pcts.forEach(function(el, i){
      var target = parseInt(el.getAttribute('data-target'), 10) || 0, t0 = null, dur = 1600;
      setTimeout(function(){
        if (gen !== pctGen) return;
        el.textContent = '0%';
        var frame = function(ts){
          if (gen !== pctGen) return;
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.round(easeOut(p) * target) + '%';
          if (p < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }, 180 + i * 120);   /* aligns with the card entrance stagger (0.18s + 0.12s steps) */
    });
  };
  var slides = [
    { n: '1', t: 'Upload resume', cls: 'is-uploadin', dur: 2700 },   /* lines fade in top -> bottom */
    { n: '2', t: 'We analyze',    cls: 'is-review',   dur: 4000 },   /* ends right as the Experience pill finishes fading (was 4200 = a ~200ms hold), so the next title + step 3 come a touch earlier */
    { n: '3', t: 'Matched jobs',  cls: 'is-matched',  dur: 4200 }    /* job cards ease in from the right, then drift up */
  ];
  var idx = 0, timer = null, swapT = null, panelT = null;
  var clearStates = function(){ panel.classList.remove('is-uploadin', 'is-review', 'is-matched', 'is-matched-out', 'is-cyclein'); };
  var apply = function(i){
    var s = slides[i];
    var leavingMatched = panel.classList.contains('is-matched');   /* are the job cards currently on screen? */
    var leavingReview = panel.classList.contains('is-review');     /* is the resume text currently coloured red? */
    /* 1) the title leads: run the current one out toward the edge, swap the text, run the next one in */
    step.classList.remove('is-enter'); void step.offsetWidth; step.classList.add('is-exit');
    clearTimeout(swapT);
    swapT = setTimeout(function(){
      num.textContent = s.n; lbl.textContent = s.t;
      step.classList.remove('is-exit'); void step.offsetWidth; step.classList.add('is-enter');
    }, 360);
    /* 2) leaving "Matched jobs": let the cards ease softly out to the left first (keep is-matched so the resume stays
       hidden meanwhile). Leaving "We analyze": keep is-review so the red resume text HOLDS (never snaps back to black)
       until the cards take over. Any other slide: clear the previous animation right away. */
    if (leavingMatched) panel.classList.add('is-matched-out');
    else if (!leavingReview) clearStates();
    /* 3) start THIS slide's resume/panel animation shortly after the title starts coming in, so it runs together
       with the title appearing (title still leads by its exit). When leaving "Matched jobs" we wait longer so the
       cards finish easing out first; then is-cyclein makes the resume rise up from below like on first load. */
    clearTimeout(panelT);
    panelT = setTimeout(function(){
      clearStates();
      panel.classList.add(s.cls);
      if (s.cls === 'is-uploadin') panel.classList.add('is-cyclein');
      if (s.cls === 'is-matched') countPcts();   /* count the match % up as the cards slide in */
    }, leavingMatched ? 1000 : (s.cls === 'is-matched' ? 460 : 600));   /* job cards appear a touch earlier than the others, still clearly after the title */
  };
  var schedule = function(){ clearTimeout(timer); if (reduce) return; timer = setTimeout(function(){ idx = (idx + 1) % slides.length; apply(idx); schedule(); }, slides[idx].dur); };
  window.des148V3 = {
    /* keep the first slide as the reveal already left it, then advance on a timer */
    start: function(){ idx = 0; num.textContent = '1'; lbl.textContent = 'Upload resume'; clearStates(); void panel.offsetWidth; panel.classList.add('is-uploadin'); schedule(); },
    stop: function(){ clearTimeout(timer); clearTimeout(swapT); clearTimeout(panelT); ++pctGen; setPctTargets(); clearStates(); step.classList.remove('is-enter'); step.classList.remove('is-exit'); idx = 0; num.textContent = '1'; lbl.textContent = 'Upload resume'; }
  };
  var hs = document.querySelector('.des148-herobg');
  if (hs && hs.getAttribute('data-hv') === '3') window.des148V3.start();
})();

/* Hero 3-step tracker: gently advances 1 -> 2 -> 3, holds, then loops */
(function(){
  var steps = [].slice.call(document.querySelectorAll('.des148-steps .des148-step'));
  if (!steps.length) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    steps.forEach(function(s){ s.classList.add('is-on'); });
    return;
  }
  var phase = 0;
  var tick = function(){
    steps.forEach(function(s, i){ s.classList.toggle('is-on', i <= phase); });
    phase = (phase + 1) % (steps.length + 1);
  };
  tick();
  setInterval(tick, 1600);
})();

/* Mobile menu */
function toggleMenu() {
  var menu = document.getElementById('des148-mobile-menu');
  var open = menu.classList.toggle('is-open');
  document.querySelector('.des148-burger').classList.toggle('is-open', open);
  document.querySelector('.des148-burger').setAttribute('aria-expanded', open);
}

/* Navbar dropdowns open on click (not hover), like jobleads.com */
(function(){
  var nav = document.querySelector('.des148-nav');
  if (!nav) return;
  var items = [].slice.call(nav.querySelectorAll('.des148-nav-item')).filter(function(it){ return it.querySelector('.des148-dropdown'); });
  if (!items.length) return;
  var closeAll = function(except){
    items.forEach(function(it){
      if (it === except) return;
      it.classList.remove('is-open');
      var b = it.querySelector('[aria-haspopup]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  };
  items.forEach(function(it){
    var btn = it.querySelector('[aria-haspopup]');
    if (!btn) return;
    btn.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      var open = !it.classList.contains('is-open');
      closeAll(it);
      it.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function(){ closeAll(null); });          /* any click outside a trigger closes the menus */
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAll(null); });
})();

/* FAQ accordion */
document.querySelectorAll('.des148-acc[data-toggle]').forEach(function(acc){
  var row = acc.querySelector('.des148-acc-row');
  var body = acc.querySelector('.des148-acc-body');
  if (!row || !body) return;
  row.addEventListener('click', function(){
    var open = acc.classList.toggle('is-open');
    /* swap the inline SVG icon: add (+) when closed, remove (-) when open.
       (icons are <img> SVGs now, so set the src — not textContent, which would wipe the <img>) */
    var ic = acc.querySelector('.des148-acc-chevron img');
    if (ic) ic.src = open ? 'assets/icons/remove-f56462.svg' : 'assets/icons/add-f56462.svg';
    if (open) {
      body.style.maxHeight = body.scrollHeight + 'px';
    } else {
      body.style.maxHeight = body.scrollHeight + 'px';
      void body.offsetHeight; /* reflow so the transition to 0 runs */
      body.style.maxHeight = '0px';
    }
  });
  /* once open, drop the fixed cap so the panel adapts to reflow/resize */
  body.addEventListener('transitionend', function(e){
    if (e.propertyName === 'max-height' && acc.classList.contains('is-open')) body.style.maxHeight = 'none';
  });
});

/* Sticky CTA bar — a persistent fallback upload action: it shows whenever NEITHER upload button
   (the hero's nor the final CTA's) is FULLY visible on screen, and hides while the modal is open
   or once the page is scrolled to its very bottom edge (so the bar clears the end of the page).
   A fully visible upload button makes the bar redundant (hidden); otherwise the bar is shown. */
(function(){
  var bar = document.getElementById('des148-stickycta');
  if (!bar) return;
  var uploadBtn = document.querySelector('.des148-hero-actions .des148-btn');
  var finalBtn = document.querySelector('.des148-final .des148-btn');
  var modal = document.getElementById('des148-modal');
  var heroFullyVisible = true, finalFullyVisible = false, atBottom = false;   /* on load the hero's Upload button is fully in view; not yet at the page bottom */
  function update(){
    var modalOpen = modal && modal.classList.contains('is-open');
    var show = !heroFullyVisible && !finalFullyVisible && !atBottom && !modalOpen;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (window.des148StickyRotator) window.des148StickyRotator(show);   /* pause/resume the copy rotator with the bar's visibility */
  }
  window.des148UpdateSticky = update;
  /* Hide the bar once the page is scrolled to its bottom EDGE — i.e. the end of the document reaches
     the bar's own strip at the bottom of the viewport (bar height measured, so it works on desktop
     and mobile). This is about hitting the page bottom, NOT merely the footer being on screen. */
  var bottomTick = false;
  var checkBottom = function(){
    if (bottomTick) return;
    bottomTick = true;
    requestAnimationFrame(function(){
      bottomTick = false;
      var margin = bar.offsetHeight || 0;   /* clear the last (bar-height) strip so the page bottom isn't hidden behind the bar */
      atBottom = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - margin - 1);
      update();
    });
  };
  window.addEventListener('scroll', checkBottom, { passive: true });
  window.addEventListener('resize', checkBottom);
  checkBottom();
  if ('IntersectionObserver' in window) {
    /* "fully visible" = the whole button sits within the viewport (top and bottom both inside it).
       thresholds [0, 1] fire on the enters/leaves-viewport AND the fully<->partly-visible crossings. */
    var watchFull = function(btn, set){
      if (!btn) return;
      new IntersectionObserver(function(e){
        var r = e[0].boundingClientRect, root = e[0].rootBounds;
        var top = root ? root.top : 0, bottom = root ? root.bottom : window.innerHeight;
        set(r.top >= top && r.bottom <= bottom);
        update();
      }, { threshold: [0, 1] }).observe(btn);
    };
    watchFull(uploadBtn, function(v){ heroFullyVisible = v; });
    watchFull(finalBtn, function(v){ finalFullyVisible = v; });
  }
})();

/* Copy rotators — ONE shared 3.6s clock drives every crossfading label so they never drift or run
   at different speeds: the hero notes (header hero + final CTA) and the sticky bar all advance on the
   same tick. Each rotator just toggles the .is-on class; the fade itself is pure CSS (opacity .5s).
     Hero notes  : "Free · See your matches..." <-> "Supports PDF/Word" — always active.
     Sticky bar  : Desktop "Find jobs that match your resume" (title) <-> "Free..." (value);
                   Mobile  "Free..." (value) <-> "Supports PDF/Word" (formats), title hidden.
   The sticky rotator only runs WHILE THE BAR IS VISIBLE, and resets to its first line whenever the
   bar (re)appears — so the first line always gets a full dwell instead of flipping early, which was
   why the bar looked "faster" on mobile (its timer was running unseen while the bar was still hidden). */
(function(){
  var PERIOD = 3600;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rotators = [];
  var clock = null;

  function paint(r){ r.set.forEach(function(el, k){ el.classList.toggle('is-on', k === r.i); }); }
  function tick(){
    rotators.forEach(function(r){
      if (!r.active || r.set.length < 2) return;
      r.i = (r.i + 1) % r.set.length;
      paint(r);
    });
  }
  function startClock(){
    if (clock) { clearInterval(clock); clock = null; }
    if (!reduce) clock = setInterval(tick, PERIOD);
  }
  /* Restart the shared clock and show every active rotator's first line — keeps them in phase and
     guarantees a freshly-shown line gets a full interval before the first switch. */
  function resync(){
    rotators.forEach(function(r){ r.i = 0; if (r.active) paint(r); });
    startClock();
  }

  /* Hero notes: header hero + final CTA — always active */
  [].slice.call(document.querySelectorAll('.des148-hero-note')).forEach(function(note){
    var msgs = [].slice.call(note.querySelectorAll('.des148-hero-note-msg'));
    if (msgs.length >= 2) rotators.push({ set: msgs, i: 0, active: true });
  });

  /* Sticky bar: viewport-dependent set, active only while the bar is visible */
  var copy = document.querySelector('.des148-stickycta-copy');
  if (copy) {
    var title = copy.querySelector('.des148-stickycta-title');
    var value = copy.querySelector('.des148-stickycta-msg-value');
    var formats = copy.querySelector('.des148-stickycta-msg-formats');
    var all = [title, value, formats].filter(Boolean);
    var mq = window.matchMedia ? matchMedia('(max-width: 768px)') : null;
    if (value) {
      var sticky = { set: [], i: 0, active: false };
      var buildSet = function(){
        all.forEach(function(el){ el.classList.remove('is-on'); });
        sticky.set = ((mq && mq.matches) ? [value, formats] : [title, value]).filter(Boolean);
        sticky.i = 0; paint(sticky);
      };
      buildSet();
      rotators.push(sticky);
      if (mq) {
        var onMq = function(){ buildSet(); if (sticky.active) resync(); };
        mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);
      }
      /* called by the sticky show/hide logic (des148UpdateSticky) whenever the bar toggles */
      window.des148StickyRotator = function(visible){
        if (visible === sticky.active) return;         /* ignore repeated same-state calls (scroll fires often) */
        sticky.active = visible;
        if (visible) resync();                          /* appear -> fresh full dwell, back in phase */
        else { sticky.i = 0; paint(sticky); }           /* hide  -> reset so it reappears on its first line */
      };
      var bar = document.getElementById('des148-stickycta');
      if (bar && bar.classList.contains('is-visible')) window.des148StickyRotator(true);   /* already visible at init */
    }
  }

  startClock();
})();

/* Scroll reveal — content eases in as it enters the viewport (nav & footer stay static) */
(function(){
  var html = document.documentElement;
  if (!html.classList.contains('des148-rvl')) return;
  if (!('IntersectionObserver' in window)) { html.classList.remove('des148-rvl'); return; }
  try {
    var mobile = window.matchMedia('(max-width: 768px)').matches;
    var sel = '.des148-reviews-header > *, .des148-review, .des148-logos-title, .des148-logos-marquee, .des148-stack.is-tight > *, .des148-stack.is-center > *, .des148-faq-head > *, .des148-problemwin, .des148-pw-dots, .des148-pw-rvl, .des148-powerimg, .des148-powerimg-cap, .des148-card, .des148-hiw-doc, .des148-hiw-job, .des148-tl-final .des148-lead, .des148-tl-final .des148-callout, .des148-tile, .des148-acc, .des148-final, .des148-final .des148-h2, .des148-final .des148-lead, .des148-final .des148-btn, .des148-final .des148-hero-note, .des148-why-img';
    var els = [].slice.call(document.querySelectorAll(sel)).filter(function(el){
      return !el.closest('.des148-header, .des148-footwrap, #des148-stickycta, #des148-modal');
    });
    /* Per-section reveal order: tag (eyebrow) -> headline -> body, then the rest (image, cards, tiles) in document order */
    var revRank = function(el){
      if (el.classList.contains('des148-eyebrow')) return 0;
      if (el.matches('h1, h2, .des148-h2')) return 1;
      if (el.classList.contains('des148-lead')) return 2;
      return 3;
    };
    var bySection = new Map();
    els.forEach(function(el){
      var sec = el.closest('section') || el.parentElement;
      if (!bySection.has(sec)) bySection.set(sec, []);
      bySection.get(sec).push(el);
    });
    bySection.forEach(function(list){
      list.sort(function(a, b){ return revRank(a) - revRank(b); });
      list.forEach(function(el, i){ el.style.setProperty('--rd', Math.min(i * 0.09, 0.6) + 's'); });
    });
    /* Final CTA: the box fades in first, then its inner elements cascade in right after (heading -> lead -> button -> note), with no empty-box gap */
    var finalBox = document.querySelector('.des148-final');
    if (finalBox) {
      finalBox.style.setProperty('--rd', '0s');
      [].slice.call(finalBox.querySelectorAll('.des148-h2, .des148-lead, .des148-btn, .des148-hero-note')).forEach(function(el, i){
        el.style.setProperty('--rd', ((i + 1) / 10) + 's');
      });
    }
    /* The Problem window: reveal the frame, dots and search field on scroll; the RESULTS (the "What you see"/"Hidden from you" labels and the job cards) are gated and revealed only once the "Product manager" typewriter has finished (see the typing block below), so they never appear before the word is typed. */
    var pwWin = document.querySelector('.des148-problemwin');
    var pwResults = [];
    if (pwWin) {
      var pwSec = pwWin.closest('section');
      var setRd = function(el, v){ if (el) el.style.setProperty('--rd', v + 's'); };
      /* order: left column (eyebrow -> title -> body), then the red frame, then its dots, then the search field */
      if (pwSec) {
        setRd(pwSec.querySelector('.des148-eyebrow'), 0);
        setRd(pwSec.querySelector('.des148-h2'), 0.1);
        setRd(pwSec.querySelector('.des148-lead'), 0.2);
      }
      setRd(pwWin, 0.32);
      setRd(pwWin.querySelector('.des148-pw-dots'), 0.44);
      setRd(pwWin.querySelector('.des148-pw-search'), 0.54);
      pwResults = [].slice.call(pwWin.querySelectorAll('.des148-pw-label.des148-pw-rvl, .des148-pw-subchip.des148-pw-rvl, .des148-pw-job.des148-pw-rvl'));
      els = els.filter(function(el){ return pwResults.indexOf(el) === -1; });   /* keep the results out of the scroll observer; the typewriter reveals them */
    }
    /* How it works final box: resume first, then the job cards one by one, then the right half (lead + callout) */
    var hiwBox = document.querySelector('.des148-tl-final');
    if (hiwBox) {
      [].slice.call(hiwBox.querySelectorAll('.des148-hiw-doc, .des148-hiw-job, .des148-lead, .des148-callout')).forEach(function(el, i){
        el.style.setProperty('--rd', (i * 0.16) + 's');
      });
    }
    /* Why-our-matches (DESKTOP only): natural cascade order — tag -> headline -> lead -> illustration -> tiles, with the illustration coming right after the body text (no long pause). On mobile the generic per-section stagger is left untouched. */
    var whyHead = document.querySelector('.des148-why-head');
    if (whyHead && !(window.matchMedia && window.matchMedia('(max-width: 768px)').matches)) {
      var whySec = whyHead.closest('section');
      var setRdWhy = function(el, v){ if (el) el.style.setProperty('--rd', v + 's'); };
      if (whySec) {
        setRdWhy(whySec.querySelector('.des148-eyebrow'), 0);
        setRdWhy(whySec.querySelector('.des148-h2'), 0.1);
        setRdWhy(whySec.querySelector('.des148-lead'), 0.2);
        setRdWhy(whyHead.querySelector('.des148-why-img'), 0.35);   /* right after the body text, no extra delay */
        [].slice.call(whySec.querySelectorAll('.des148-tile')).forEach(function(el, i){ setRdWhy(el, 0.5 + i * 0.12); });
      }
    }
    /* Your-resume: the "Jobs that really suit me" pill drops in from above AFTER the image has settled (so its downward drop isn't cancelled by the image's upward settle) */
    var powerCap = document.querySelector('.des148-powerimg-cap');
    if (powerCap) powerCap.style.setProperty('--rd', '0.9s');
    /* Hero card entrance, ordered per version and device.
       Desktop: left column (title -> text -> button -> Free -> trust) then the media.
       Mobile:  media first (bottom-to-top) then the left column.
       V1 media = the single right block. V2 media = the three rectangles: on desktop they fly in
       from the left (drop -> stage -> steps); on mobile from below (drop -> steps -> stage).
       Called on load for the active version, and again by the switcher on every version change. */
    var revealHero = function(version){
      var m = window.matchMedia('(max-width: 768px)').matches;
      var q = function(s){ return document.querySelector(s); };
      var left = [q('.des148-herocard h1'), q('.des148-hero-sub'), q('.des148-hero-actions .des148-btn'), q('.des148-hero-note'), q('.des148-trust')];
      var v1 = q('.des148-hero-v1'), v3 = q('.des148-hero-v3'), drop = q('.des148-v2-drop'), steps = q('.des148-v2-steps'), stage = q('.des148-v2-stage');
      var mediaSeq = version === '2' ? (m ? [drop, steps, stage] : [drop, stage, steps]) : (version === '3' ? [v3] : [v1]);
      var seq = (m ? mediaSeq.concat(left) : left.concat(mediaSeq)).filter(Boolean);
      var all = left.concat([v1, v3, drop, steps, stage]).filter(Boolean);
      all.forEach(function(el){ el.style.transition = 'none'; el.classList.remove('des148-reveal-in'); });
      seq.forEach(function(el, i){ el.style.setProperty('--rd', (i * 0.09) + 's'); });
      void document.body.offsetWidth;   /* commit the hidden state, then restore transition + reveal so it animates in */
      all.forEach(function(el){ el.style.transition = ''; });
      seq.forEach(function(el){ el.classList.add('des148-reveal-in'); });
    };
    window.des148RevealHero = revealHero;
    var heroSec = document.querySelector('.des148-herobg');
    /* Defer the first reveal to AFTER the initial paint, so the hidden state is committed and the fade-in
       transition actually fires on load (calling it synchronously can coalesce 0 -> 1 before first paint,
       which skips the animation). rAF handles the foreground; the setTimeout is a fallback where rAF is throttled. */
    (function(){
      var done = false;
      var fire = function(){ if (done) return; done = true; revealHero(heroSec ? (heroSec.getAttribute('data-hv') || '1') : '1'); };
      if (window.requestAnimationFrame) requestAnimationFrame(function(){ requestAnimationFrame(fire); });
      setTimeout(fire, 80);
    })();
    /* Count stats (Why our matches are better) — the number only starts counting once its tile's
       reveal is triggered (from the observer below), then waits out that tile's own stagger (--rd)
       so it counts in step with the fade-in, never before it. Counts up from 0, or down from a
       data-from value, decelerating at the end. */
    var easeOutCount = function(t){ return 1 - Math.pow(1 - t, 3); };
    var startTileCount = function(tile){
      var el = tile.querySelector('.des148-big');
      if (!el || el.getAttribute('data-counted')) return;
      if (!el.hasAttribute('data-animate')) return;   /* only the 40k+ tile animates; statement numbers (1, 100%, 0) stay static so they never show a false value mid-count */
      var m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      var target = parseInt(m[1], 10), suffix = m[2];
      var fromAttr = el.getAttribute('data-from');
      var from = fromAttr != null ? parseInt(fromAttr, 10) : 0;
      if ((fromAttr == null && target <= 0) || from === target) return;
      el.setAttribute('data-counted', '1');   /* count once */
      var rd = parseFloat(getComputedStyle(tile).getPropertyValue('--rd'));
      var startDelay = (isNaN(rd) ? 0 : rd) * 1000;   /* line the count up with this tile's fade-in start */
      var dur = 3200, t0 = null;   /* fixed duration -> all tiles count for the same time, regardless of distance */
      el.textContent = from + suffix;
      setTimeout(function(){
        var frame = function(ts){
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.round(from + (target - from) * easeOutCount(p)) + suffix;
          if (p < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }, startDelay);
    };

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        e.target.classList.add('des148-reveal-in');
        if (e.target.classList.contains('des148-tile')) startTileCount(e.target);   /* count starts with the reveal */
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });   /* fire when the element reaches ~90% of the viewport height (closer to the bottom edge) rather than at the very bottom */
    els.forEach(function(el){ io.observe(el); });

    /* How it works — line grows first, then boxes reveal STRICTLY in order (1 -> 2 -> 3), even on fast scroll */
    var tl = document.querySelector('.des148-tl');
    if (tl) {
      io.observe(tl); /* triggers the single background line to grow */
      var steps = [].slice.call(tl.querySelectorAll('.des148-tl-step'));
      var entered = steps.map(function(){ return false; });
      var nextIdx = 0, busy = false;
      var showStep = function(step){
        var node = step.querySelector('.des148-tl-node');
        var card = step.querySelector('.des148-tl-card');
        var num = step.querySelector('.des148-tl-num');
        if (node) node.classList.add('des148-reveal-in');
        setTimeout(function(){
          if (card) card.classList.add('des148-reveal-in');
          if (num) num.classList.add('des148-reveal-in');
        }, 170);
      };
      var pump = function(){
        if (busy || nextIdx >= steps.length || !entered[nextIdx]) return;
        busy = true;
        var wait = nextIdx === 0 ? 450 : 0; /* first step waits for the line */
        setTimeout(function(){
          showStep(steps[nextIdx]);
          nextIdx++;
          setTimeout(function(){ busy = false; pump(); }, 380); /* gap enforces order */
        }, wait);
      };
      var stepIO = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          var i = steps.indexOf(e.target);
          if (i >= 0 && e.isIntersecting) { for (var j = 0; j <= i; j++) entered[j] = true; stepIO.unobserve(e.target); }
        });
        pump();
      }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });   /* match the main reveal trigger (~90% of viewport) so the How-it-works boxes reveal in step with everything else */
      steps.forEach(function(step){ stepIO.observe(step); });
    }

    /* (The "Why our matches are better" tile count now starts from the reveal observer above — see startTileCount.) */

    /* Header trust stat — count "12,000,000" up (shown in every header variant); the "+" stays static and bold */
    var trustCount = document.querySelector('.des148-trust-count');
    if (trustCount) {
      var trustTarget = parseInt(trustCount.getAttribute('data-count'), 10) || 0;
      var trustEase = function(t){ return 1 - Math.pow(1 - t, 4); };   /* easeOutQuart: fast start, slow gentle end */
      var trustDur = 2800;   /* count-up pace (a bit slower) */
      trustCount.textContent = '0';
      var runTrust = function(){
        var t0 = null;
        var frame = function(ts){
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / trustDur, 1);
          trustCount.textContent = Math.round(trustTarget * trustEase(p)).toLocaleString('en-US');
          if (p < 1) requestAnimationFrame(frame);
          else document.dispatchEvent(new CustomEvent('des148:trustdone'));   /* signal completion -> V3 header pill may now appear */
        };
        requestAnimationFrame(frame);
      };
      var trustIO = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting) return;
          trustIO.unobserve(e.target);
          runTrust();   /* start immediately as it enters view -> no static "0" first */
        });
      }, { threshold: 0 });   /* fire the moment any part enters the viewport */
      trustIO.observe(trustCount);
    }

    /* How it works box: count the match % up when it scrolls in — same speed/feel as the header (1600ms, ease-out, staggered) */
    var hiwPcts = [].slice.call(document.querySelectorAll('.des148-hiw-job-pct'));
    var hiwVisual = document.querySelector('.des148-hiw-visual');
    if (hiwPcts.length && hiwVisual) {
      var easeOutHiw = function(t){ return 1 - Math.pow(1 - t, 3); };
      var countHiw = function(el, delay){
        var m = el.textContent.trim().match(/^(\d+)(.*)$/);
        if (!m) return;
        var target = parseInt(m[1], 10), suffix = m[2];
        if (target <= 0) return;
        var dur = 1600, t0 = null;
        el.textContent = '0' + suffix;
        setTimeout(function(){
          var frame = function(ts){
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            el.textContent = Math.round(easeOutHiw(p) * target) + suffix;
            if (p < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }, delay);
      };
      var hiwFired = false;
      var hiwIO = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting || hiwFired) return;
          hiwFired = true;
          hiwPcts.forEach(function(el, i){ countHiw(el, 180 + i * 120); });
          hiwIO.disconnect();
        });
      }, { threshold: 0.25 });
      hiwIO.observe(hiwVisual);
    }

    /* The Problem: count each fit % up in sync with its (slower) bar filling */
    var pwFits = [].slice.call(document.querySelectorAll('.des148-pw-fit'));
    var pwWinEl = document.querySelector('.des148-problemwin');
    if (pwFits.length && pwWinEl) {
      var easeInOutPw = function(t){ return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };   /* easeInOutCubic: slow start, fast middle, slow end (matches the bar-fill curve) */
      var countPwFit = function(fitEl, delay){
        var el = fitEl.querySelector('.des148-pw-fit-num') || fitEl;   /* animate only the number, keep the "Fit" word intact */
        var m = el.textContent.trim().match(/^(\d+)(.*)$/);
        if (!m) return;
        var target = parseInt(m[1], 10), suffix = m[2];
        if (target <= 0) return;
        var dur = 1600, t0 = null;   /* matches the bar-fill duration */
        el.textContent = '0' + suffix;
        setTimeout(function(){
          var frame = function(ts){
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            el.textContent = Math.round(target * easeInOutPw(p)) + suffix;
            if (p < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }, delay);
      };
      var pwFired = false;
      var pwFitIO = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting || pwFired) return;
          pwFired = true;
          pwFits.forEach(function(el){
            var card = el.closest('.des148-pw-job');
            var rd = card ? parseFloat(getComputedStyle(card).getPropertyValue('--rd')) : 0;
            countPwFit(el, (isNaN(rd) ? 0 : rd) * 1000 + 300);   /* start together with the bar (rd + 0.3s delay) */
          });
          pwFitIO.disconnect();
        });
      }, { threshold: 0.2 });
      pwFitIO.observe(pwWinEl);
    }

    /* The Problem — type "Product manager" into the search field, then blink the caret briefly and fade it out */
    var pwTyped = document.querySelector('.des148-pw-typed');
    var pwCaret = document.querySelector('.des148-pw-caret');
    var pwSearchEl = document.querySelector('.des148-pw-search');
    if (pwTyped && pwCaret && pwSearchEl) {
      var pwFull = pwTyped.textContent;
      pwTyped.textContent = '';
      var pwTypeStep = function(i){
        pwTyped.textContent = pwFull.slice(0, i);
        if (i < pwFull.length) {
          setTimeout(function(){ pwTypeStep(i + 1); }, 85 + Math.random() * 45);   /* ~85-130ms per char, slightly varied like real typing */
        } else {
          pwCaret.classList.add('is-blinking');                                    /* word done -> blink 5x */
          pwCaret.addEventListener('animationend', function(){ pwCaret.classList.remove('is-blinking'); pwCaret.classList.add('is-out'); }, { once: true });   /* after exactly 5 blinks -> soft fade-out */
          pwResults.forEach(function(el, k){ el.style.setProperty('--rd', (k * 0.09) + 's'); el.classList.add('des148-reveal-in'); });   /* word typed -> now reveal the results in order (labels + cards) */
        }
      };
      var pwTypeFired = false;
      var pwTypeIO = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting || pwTypeFired) return;
          pwTypeFired = true;
          pwTypeIO.unobserve(e.target);
          var rd = parseFloat(getComputedStyle(pwSearchEl).getPropertyValue('--rd'));
          setTimeout(function(){ pwTypeStep(0); }, (isNaN(rd) ? 0.3 : rd) * 1000);   /* start as the search field reveals */
        });
      }, { threshold: 0.4 });
      pwTypeIO.observe(pwSearchEl);
    }
  } catch (err) {
    html.classList.remove('des148-rvl');
  }
})();

/* Stat-tile info popovers — tap/click to open (works on touch, no hover dependency), close on
   outside tap, Escape, or a second tap on the trigger. Only one open at a time. */
(function(){
  var infos = [].slice.call(document.querySelectorAll('.des148-tile-info'));
  if (!infos.length) return;
  var openBtn = null;
  var popOf = function(btn){ return btn.parentElement.querySelector('.des148-tile-pop'); };
  var close = function(){
    if (!openBtn) return;
    var pop = popOf(openBtn);
    if (pop) { pop.classList.remove('is-open'); pop.hidden = true; }
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn = null;
  };
  var open = function(btn){
    close();
    var pop = popOf(btn);
    if (!pop) return;
    pop.hidden = false;
    /* force reflow so the transition runs from hidden */
    void pop.offsetWidth;
    pop.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    openBtn = btn;
  };
  infos.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      if (openBtn === btn) close(); else open(btn);
    });
  });
  document.addEventListener('click', function(e){
    if (openBtn && !e.target.closest('.des148-tile-pop') && !e.target.closest('.des148-tile-info')) close();
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
})();
