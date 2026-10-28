/* demo-flow v1.1 (2026-10-06) — turns a scene page into a clickable, self-typing demo.
 *
 * A scene page holds the FINAL DOM of all its beats. Anything that appears later carries
 * data-demo-hide (hidden before first paint by demo-flow.css). A JSON step list says what the
 * presenter clicks and what happens next:
 *
 *   <script type="application/json" id="demo-flow">{
 *     "scene": "ch2-lex-home", "prev": "../slack/scene-ch1.html?beat=last", "next": "../agentforce/scene-ch4.html",
 *     "steps": [
 *       {"beat": "CH2-01"},                                            // step 0 = load state
 *       {"beat": "CH2-02", "on": {"click": ".lex-ask"}, "do": [{"show": ".lb-dock"}]},
 *       {"beat": "CH2-03", "on": {"click": ".lb-pop-ft button"}, "do": [
 *          {"hide": ".lb-pop"}, {"show": "#greet", "fx": "fade"},
 *          {"type": ".afs-cbox", "ph": ".ph", "text": "Profitability in the South...", "bubble": "#q4", "send": ".send"},
 *          {"think": "#thinking", "ms": 1600}, {"stream": "#a4", "follow": ".afs-dock-body"}]}
 *     ]}</script>
 *
 * Step triggers ("on"): {"click": sel} the real UI element · {"key": "Enter"} · {"auto": ms} · none = advance key only.
 * Actions ("do"), all instant-capable (back / jump / ?beat= fast-forward):
 *   show/hide sel [fx fade|pop|slide; hide supports fade|pop]   add/remove sel + cls   wait ms   press sel (visual click)
 *   type sel text [ph sel] [bubble sel] [send sel] [sendOn cls] [wait "enter"|"none"] [pace "auto"|"keys"]
 *   think sel ms [keep]           stream sel [wps] [follow paneSel]   scroll sel to end|top|<sel> [offset]
 *   goto url                      call hookName  (window.demoHooks[hookName](el?, {instant}))
 *
 * Presenter keys (no visible controls, ever): → / PageDown = next (or hurry the current animation)
 *   ← / PageUp = back one beat · Shift+R = restart scene · ` (backtick) = backstage beat list · Esc closes it.
 * URL: ?beat=CH2-03 (or ?step=4, ?beat=last) renders that state instantly. ?speed=2 types/streams 2x faster.
 * window.demoFlow exposes {step, beat, busy, waiting, steps, next(), go(n), scrolled(el)} for tools/flow-walk.py.
 * Scroll handshake: every scroll demo-flow makes itself (scroll action, step.rest, stream follow) dispatches
 * `demo:scroll` on document with detail = the element, so demo-ambient stops restoring that box. A hook that scrolls
 * a pane must call opts.scrolled(el) (or demoFlow.scrolled(el)) for the same effect.
 */
(function () {
  'use strict';
  var cfgEl = document.getElementById('demo-flow');
  if (!cfgEl) return;
  var cfg;
  try { cfg = JSON.parse(cfgEl.textContent); } catch (e) { console.error('[demo-flow] bad JSON', e); return; }
  var steps = cfg.steps || [];
  var params = new URLSearchParams(location.search);
  var SPEED = parseFloat(params.get('speed') || cfg.speed || '1') || 1;

  var st = { step: -1, running: -1, queued: null, busy: false, waiting: null, fast: false, wakers: [], waitResolve: null, keyFeed: null };
  var api = window.demoFlow = {
    get step() { return st.step; },
    get beat() { return beatAt(st.step); },
    get busy() { return st.busy; },
    get running() { return st.running; },
    get waiting() { return st.waiting; },
    steps: steps, scene: cfg.scene,
    next: function () { advance(); },
    go: function (n) { reloadAt(n); },
    scrolled: scrolled
  };

  function $(sel) { return sel ? document.querySelector(sel) : null; }
  function $$(sel) { return sel ? Array.prototype.slice.call(document.querySelectorAll(sel)) : []; }
  function scrolled(el) { if (el) document.dispatchEvent(new CustomEvent('demo:scroll', { detail: el })); }
  function follow(pane) { pane.scrollTop = pane.scrollHeight; scrolled(pane); }
  function beatAt(i) { for (var k = i; k >= 0; k--) if (steps[k] && steps[k].beat) return steps[k].beat; return null; }
  function setBody() {
    document.body.setAttribute('data-demo-step', String(st.step));
    var b = beatAt(st.step); if (b) document.body.setAttribute('data-demo-beat', b);
    document.body.toggleAttribute('data-demo-busy', st.busy);
    if (st.waiting) document.body.setAttribute('data-demo-waiting', st.waiting); else document.body.removeAttribute('data-demo-waiting');
  }

  // ---- timing: every pause goes through sleep() so "hurry" (→ during an animation) can collapse it
  function sleep(ms) {
    if (st.fast || ms <= 0) return Promise.resolve();
    return new Promise(function (res) {
      var t = setTimeout(done, ms / SPEED);
      function done() { clearTimeout(t); var i = st.wakers.indexOf(done); if (i >= 0) st.wakers.splice(i, 1); res(); }
      st.wakers.push(done);
    });
  }
  function hurry() { st.fast = true; st.wakers.slice().forEach(function (w) { w(); }); }

  // ---- actions
  function show(el, fx, instant) {
    if (!el) return;
    el.removeAttribute('data-demo-hide'); el.hidden = false;
    if (!instant && fx) { el.classList.remove('demo-fx-' + fx); void el.offsetWidth; el.classList.add('demo-fx-' + fx); }
  }
  function hide(el) { if (el) el.setAttribute('data-demo-hide', ''); }
  async function hideFx(els, fx, instant) {
    if (instant || !fx || st.fast) { els.forEach(hide); return; }
    els.forEach(function (el) { el.classList.add('demo-out-' + fx); });
    await sleep(fx === 'fade' ? 260 : 220);
    els.forEach(function (el) { el.classList.remove('demo-out-' + fx); hide(el); });
  }

  function composerParts(box, a) {
    var tag = box.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return { input: box };
    var holder = box.querySelector('.demo-typed');
    if (!holder) {
      holder = document.createElement('span'); holder.className = 'demo-typed';
      var ph = a.ph ? box.querySelector(a.ph) || $(a.ph) : null;
      var host = (a.into && box.querySelector(a.into)) || (ph && ph.parentNode) || box;
      if (ph && ph.parentNode === host) host.insertBefore(holder, ph); else host.insertBefore(holder, host.firstChild);
    }
    return { holder: holder, ph: a.ph ? box.querySelector(a.ph) || $(a.ph) : null };
  }
  function setComposer(p, text, caret) {
    if (p.input) {
      p.input.value = text;
      if (caret) { try { p.input.focus({ preventScroll: true }); p.input.setSelectionRange(text.length, text.length); } catch (e) {} }
      else if (document.activeElement === p.input) p.input.blur();
      return;
    }
    p.holder.textContent = text;
    if (caret) { var c = document.createElement('span'); c.className = 'demo-caret'; p.holder.appendChild(c); }
    if (p.ph) p.ph.style.display = text ? 'none' : '';
  }
  function charDelay(ch, i) {
    var d = 34 + Math.random() * 38;
    if (ch === ',' || ch === ';') d += 140;
    else if (ch === '.' || ch === '?' || ch === '!') d += 240;
    else if (ch === ' ' && i % 23 === 0) d += 180;           // a "thinking" hitch now and then
    return d;
  }
  function waitForSend(sendSel) {
    st.waiting = 'enter'; setBody();
    return new Promise(function (res) {
      st.waitResolve = function () { st.waitResolve = null; st.waiting = null; setBody(); res(); };
    });
  }
  async function doType(a, instant) {
    var box = $(a.type); if (!box) return warn('type target', a.type);
    var p = composerParts(box, a), text = a.text || '';
    var sendBtn = a.send ? $(a.send) : null;
    if (!instant) {
      box.classList.add('demo-focus');
      if (a.pace === 'keys') {
        // presenter "types" by mashing any key; each press reveals the next few characters
        var i = 0;
        await new Promise(function (res) {
          st.waiting = 'keys'; setBody();
          st.keyFeed = function () {
            i = Math.min(text.length, i + 2 + Math.floor(Math.random() * 3));
            setComposer(p, text.slice(0, i), true);
            if (i >= text.length || st.fast) { st.keyFeed = null; st.waiting = null; setBody(); res(); }
          };
          setComposer(p, '', true);
        });
      } else {
        for (var k = 1; k <= text.length; k++) {
          if (st.fast) break;
          setComposer(p, text.slice(0, k), true);
          await sleep(charDelay(text[k - 1], k));
        }
      }
      setComposer(p, text, true);
      if (sendBtn && a.sendOn) sendBtn.classList.add(a.sendOn);
      if ((a.wait || 'enter') === 'enter') { st.fast = false; await waitForSend(a.send); }
      box.classList.remove('demo-focus');
    }
    if (a.bubble) {
      setComposer(p, '', false);
      if (sendBtn && a.sendOn) sendBtn.classList.remove(a.sendOn);
      show($(a.bubble), instant ? null : 'pop', instant);
    } else {
      setComposer(p, text, false);
    }
  }

  function prepStream(root) {
    var units = [], pend = [];
    var ATOM = 'svg,img,canvas,video,tr,[data-atom]';
    (function walk(node) {
      for (var c = node.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) {
          if (c.data.trim()) { units.push({ kind: 'text', node: c, text: c.data }); c.data = ''; }
        } else if (c.nodeType === 1) {
          if (c.matches('[data-stream-skip]')) continue;
          if (c.matches(ATOM)) { units.push({ kind: 'atom', el: c }); c.setAttribute('data-demo-pend', ''); continue; }
          var before = units.length;
          walk(c);
          if (units.length > before) { c.setAttribute('data-demo-pend', ''); pend.push(c); }
        }
      }
    })(root);
    units.forEach(function (u) {
      u.anc = [];
      for (var n = u.kind === 'text' ? u.node.parentNode : u.el.parentNode; n && n !== root; n = n.parentNode) u.anc.push(n);
    });
    return units;
  }
  async function doStream(a, instant) {
    var root = $(a.stream); if (!root) return warn('stream target', a.stream);
    var pane = a.follow ? $(a.follow) : null;
    if (instant) { show(root, null, true); return; }
    var units = prepStream(root);
    show(root, null, false);
    var wps = (a.wps || 24), tick = 1000 / wps;
    for (var i = 0; i < units.length; i++) {
      var u = units[i];
      u.anc.forEach(function (n) { n.removeAttribute('data-demo-pend'); });
      if (u.kind === 'atom') {
        u.el.removeAttribute('data-demo-pend');
        if (!st.fast) { u.el.classList.add('demo-fx-fade'); }
        if (pane) follow(pane);
        await sleep(u.el.tagName.toLowerCase() === 'tr' ? 70 : 220);
      } else {
        var parts = u.text.split(/(\s+)/), out = '';
        for (var w = 0; w < parts.length; w++) {
          out += parts[w];
          if (st.fast) { out = u.text; u.node.data = out; break; }
          if (/\S/.test(parts[w])) { u.node.data = out; if (pane) follow(pane); await sleep(tick * (0.6 + Math.random() * 0.8)); }
        }
        u.node.data = u.text;
      }
    }
    $$('[data-demo-pend]').forEach(function (n) { if (root.contains(n)) n.removeAttribute('data-demo-pend'); });
    if (pane) follow(pane);
  }

  function settle(root) {
    // measuring while a pop/fade transform runs gives a wrong scrollHeight: wait for finite animations
    var an = (document.getAnimations ? document.getAnimations() : []).filter(function (x) {
      var t = x.effect && x.effect.getComputedTiming ? x.effect.getComputedTiming() : null;
      return t && isFinite(t.endTime) && x.playState === 'running' && x.effect.target && root.contains(x.effect.target);
    });
    return Promise.all(an.map(function (x) { return x.finished.catch(function () {}); }));
  }
  async function doScroll(a, instant) {
    var pane = $(a.scroll); if (!pane) return warn('scroll pane', a.scroll);
    scrolled(pane);
    if (!instant && !st.fast) await settle(pane);
    var scale = pane.offsetHeight ? pane.getBoundingClientRect().height / pane.offsetHeight : 1;   // inside transform:scale()
    var top;
    if (a.to === 'end') top = pane.scrollHeight;
    else if (!a.to || a.to === 'top') top = 0;
    else {
      var t = $(a.to); if (!t) return warn('scroll anchor', a.to);
      top = pane.scrollTop + (t.getBoundingClientRect().top - pane.getBoundingClientRect().top) / (scale || 1) - (a.offset == null ? 8 : a.offset);
    }
    scrolled(pane);
    pane.scrollTo({ top: top, behavior: instant || st.fast ? 'auto' : 'smooth' });
  }

  async function run(a, instant) {
    if (a.show) $$(a.show).forEach(function (el) { show(el, a.fx, instant); });
    else if (a.hide) await hideFx($$(a.hide), a.fx, instant);
    else if (a.add) $$(a.add).forEach(function (el) { el.classList.add(a.cls); });
    else if (a.remove) $$(a.remove).forEach(function (el) { el.classList.remove(a.cls); });
    else if (a.type) await doType(a, instant);
    else if (a.think !== undefined) {
      var el = $(a.think);
      if (!instant) { if (el) show(el, 'fade', false); await sleep(a.ms || 1500); }
      if (el && !a.keep) hide(el);
    }
    else if (a.stream) await doStream(a, instant);
    else if (a.scroll) await doScroll(a, instant);
    else if (a.wait) { if (!instant) await sleep(a.wait); }
    else if (a.press) { if (!instant) { var p = $(a.press); if (p) { p.classList.add('demo-press'); await sleep(200); p.classList.remove('demo-press'); } } }
    else if (a.goto) { if (!instant) navigate(a.goto); }
    else if (a.call) {
      var fn = window.demoHooks && window.demoHooks[a.call];
      if (fn) await fn(a.el ? $(a.el) : null, { instant: instant, fast: st.fast, sleep: sleep, arg: a.arg, scrolled: scrolled });
      else warn('hook', a.call);
    }
  }
  function warn(what, sel) { console.warn('[demo-flow] missing ' + what + ': ' + sel); }

  async function runStep(i, instant) {
    var s = steps[i]; if (!s) return;
    st.busy = !instant; st.running = i; st.fast = false; setBody();
    for (var k = 0; k < (s.do || []).length; k++) await run(s.do[k], instant);
    if (s.rest) await doScroll(s.rest, instant);
    st.step = i; st.busy = false; st.fast = false; setBody();
    if (!instant) {
      if (st.queued === i + 1) { st.queued = null; runStep(i + 1, false); return; }
      arm();
    }
  }

  // ---- triggers
  var autoTimer = null;
  function arm() {
    clearTimeout(autoTimer);
    var nxt = steps[st.step + 1];
    if (nxt && nxt.on && nxt.on.auto != null) autoTimer = setTimeout(function () { if (!st.busy) runStep(st.step + 1, false); }, nxt.on.auto / SPEED);
  }
  function advance() {
    if (st.waiting === 'enter' && st.waitResolve) { st.waitResolve(); return; }
    if (st.waiting === 'keys') { hurry(); if (st.keyFeed) st.keyFeed(); return; }
    if (st.busy) { hurry(); return; }
    if (st.step + 1 < steps.length) runStep(st.step + 1, false);
    else if (cfg.next) navigate(cfg.next);
  }
  function back() {
    // previous beat = the last step of the beat before the current one
    var cur = beatAt(st.step), k = st.step;
    while (k >= 0 && beatAt(k) === cur) k--;
    if (k < 0) { if (cfg.prev) navigate(cfg.prev); else reloadAt(0); return; }
    reloadAt(k);
  }
  function reloadAt(n) {
    var u = new URL(location.href); u.searchParams.delete('beat'); u.searchParams.set('step', String(n));
    location.replace(u.toString());
  }
  function navigate(url) { location.href = url; }
  // Scene crossfade, opted in over http(s) only. Chrome 150+ aborts cross-document view transitions on file://
  // ("ViewTransition opt-in disabled") and throws an uncaught page error, so offline file:// runs hard-cut instead.
  if (location.protocol !== 'file:') {
    var vtStyle = document.createElement('style');
    vtStyle.textContent = '@view-transition { navigation: auto; }';
    document.head.appendChild(vtStyle);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-demo-overlay]')) return;
    if (st.waiting === 'enter' && st.waitResolve) {
      var cur = steps[st.step + 1] || {}, ty = (cur.do || []).filter(function (a) { return a.type && a.send; })[0];
      if (ty && e.target.closest(ty.send)) { e.preventDefault(); st.waitResolve(); }
      return;
    }
    if (st.busy) {
      // a click on the step after the running one: finish the current animation fast, then run it
      var after = steps[st.running + 1];
      if (after && after.on && after.on.click && e.target.closest(after.on.click)) { e.preventDefault(); st.queued = st.running + 1; hurry(); }
      return;
    }
    var nxt = steps[st.step + 1];
    if (nxt && nxt.on && nxt.on.click && e.target.closest(nxt.on.click)) { e.preventDefault(); runStep(st.step + 1, false); }
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('[data-demo-overlay]') && e.key !== 'Escape' && e.key !== '`') return;
    if (e.key === '`') { e.preventDefault(); toggleOverlay(); return; }
    if (e.key === 'Escape') { toggleOverlay(false); return; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); advance(); return; }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); back(); return; }
    if (e.shiftKey && (e.key === 'R' || e.key === 'r')) { e.preventDefault(); reloadAt(0); return; }
    if (st.waiting === 'keys' && st.keyFeed && e.key.length === 1) { e.preventDefault(); st.keyFeed(); return; }
    if (e.key === 'Enter' && st.waiting === 'enter' && st.waitResolve) { e.preventDefault(); st.waitResolve(); return; }
    if (st.busy) {
      var after = steps[st.running + 1];
      if (after && after.on && after.on.key && e.key === after.on.key) { e.preventDefault(); st.queued = st.running + 1; hurry(); }
      return;
    }
    var nxt = steps[st.step + 1];
    if (nxt && nxt.on && nxt.on.key && e.key === nxt.on.key) { e.preventDefault(); runStep(st.step + 1, false); }
  });

  // ---- backstage beat list (hidden; styled as tooling so it never reads as product UI)
  var ov = null;
  function toggleOverlay(force) {
    if (!ov) {
      ov = document.createElement('div'); ov.setAttribute('data-demo-overlay', ''); ov.className = 'demo-flow-ov'; ov.hidden = true;
      var scenes = window.DEMO_SCENES || [{ id: cfg.scene, url: location.pathname.split('/').pop(), beats: steps.map(function (s) { return s.beat; }).filter(Boolean) }];
      var base = cfg.root || '';
      var html = '<div class="demo-flow-tag">DEMO</div><div class="demo-flow-ov-hd">Beats <kbd>`</kbd></div><ol>';
      scenes.forEach(function (sc) {
        var seen = {};
        html += '<li><b>' + sc.id + '</b><div>';
        (sc.beats || []).forEach(function (b) {
          if (seen[b]) return; seen[b] = 1;
          var href = (sc.id === cfg.scene ? location.pathname.split('/').pop() : base + sc.url) + '?beat=' + encodeURIComponent(b);
          html += '<a data-demo-control href="' + href + '"' + (b === beatAt(st.step) && sc.id === cfg.scene ? ' class="on"' : '') + '>' + b + '</a>';
        });
        html += '</div></li>';
      });
      ov.innerHTML = html + '</ol><p>→ next · ← back · Shift+R restart · Esc close</p>';
      document.body.appendChild(ov);
    }
    ov.hidden = force === undefined ? !ov.hidden : !force;
  }

  // ---- boot: fast-forward to ?beat= / ?step=, else load state
  function target() {
    var b = params.get('beat'), s = params.get('step');
    if (s != null) return Math.max(0, Math.min(steps.length - 1, parseInt(s, 10) || 0));
    if (b === 'last') return steps.length - 1;
    if (b) { var last = -1; steps.forEach(function (x, i) { if (x.beat === b) last = i; }); if (last >= 0) { for (var j = last + 1; j < steps.length && !steps[j].beat; j++) last = j; return last; } }
    return 0;
  }
  async function boot() {
    var n = target();
    for (var i = 0; i <= n; i++) await runStep(i, true);
    st.step = n; setBody(); arm();
    if (cfg.next) { var l = document.createElement('link'); l.rel = 'prefetch'; l.href = cfg.next.split('?')[0]; document.head.appendChild(l); }
    document.body.setAttribute('data-demo-ready', '');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
