/* demo-ambient v1.1 (2026-10-06): the Tier 2/3 "ambient" layer for demo-flow scene pages (and static beat pages).
 *
 * Tier 1 = the scripted story (demo-flow.js). Tier 2 = things a presenter touches while talking, which must
 * behave like the product but never change the story. Tier 3 = everything else: looks clickable, does nothing.
 * Everything here is declarative (attributes only), adds ZERO visible controls, and paints nothing at rest,
 * so beat screenshots are unchanged unless something is hovered.
 *
 *   data-amb-scroll="x|y|both"   clipped box becomes reachable (wheel / trackpad / thumb drag). Same size, same
 *                                rest scroll, native bar hidden, product overlay thumb on hover/scroll only.
 *   data-amb-sb="mac|fluent|slack|none"  thumb skin (on the box, an ancestor or <body>; default mac)
 *   data-amb-clip-ok             waiver: "the product clips here too" (silences flow-walk UNREACHABLE CLIP)
 *   data-tip="Label: value|Label: value"  tooltip rows (split on the first ": "; a row without ": " is plain text)
 *   data-tip-title="…"           optional first (title) row
 *   data-tip-skin="tableau|pulse|tnext|slds|slack"  on the mark, an ancestor or <body>
 *   <title> inside an SVG mark   auto tip (converted to data-tip at init so the OS tooltip never shows)
 *   data-amb-notip               on an svg/chart: "this chart has no tooltips in the product" (Slack images, mobile)
 *   data-amb-toggle[="class:NAME"]  free open/close. Default: flips aria-expanded on itself and `hidden` on the
 *                                target. data-amb-target="sel" (default: next element sibling). The open state comes
 *                                from aria-expanded, else from the target's visibility. "swap:#a,#b" shows the hidden
 *                                one of two blocks and hides the other (data-demo-hide).
 *   data-amb-resize="left|right" evidence-gated drag resize of a panel edge. data-amb-min / data-amb-max (px),
 *                                data-amb-resize-var="--x" (+ data-amb-resize-var-on="sel", default body) when the
 *                                layout reads a CSS var. Double-click the edge = reset.
 *   data-amb-hover="row|ul|icon|tint"  hover utilities (colors per skin, see demo-ambient.css)
 *   data-amb-inert               force Tier-3 behaviour on any element.  data-amb-allow = let this click through.
 *                                Tier 3 also catches bare a:not([href]) and titled icon spans inside chrome regions
 *                                (header, nav, [role=banner], [data-amb-chrome]).
 *   data-amb-rest                native pane / demo-flow-driven thread: restored on reset like a data-amb-scroll box
 *                                (no overflow change, no thumb)
 *   data-amb-sb="ios"            transient 3px thumb, only while scrolling; also works on a natively scrolled box
 *   data-amb-tip-bounds="sel"    clamp and flip tooltips inside that zone (mark, ancestor or <body>)
 *   data-amb-series="captured"   on a <polyline> with data-amb-scrub="Label: value|..." (one row per point): Pulse line
 *                                scrub (rule + dot + one-line tip). Only for series whose values were captured.
 *
 * Reset: every ambient change (scroll, toggles, widths, tooltip) is restored when a demo-flow step starts
 * (body[data-demo-busy] turns on), and on demoAmbient.reset(). ←, Shift+R and ?beat= reload the page anyway.
 * A rest position is captured lazily on the first USER gesture (wheel/pointer/touch; not keyboard) inside a box, so
 * demo-flow's own scrolls and streams are never fought: a `demo:scroll` event from demo-flow (detail = element), or a
 * scrollTop that differs from what the layer last wrote, ends the restore for that box.
 * Story safety: an element that is the trigger of the current or any later step is never toggled; clicks
 * demo-flow already handled (defaultPrevented) are skipped; nothing ambient runs while demo-flow is busy.
 * Include AFTER demo-flow.js. window.demoAmbient = {version, reset(), tipsShown, inertClicks, hide(), info()}.
 */
(function () {
  'use strict';
  if (window.demoAmbient) return;
  var SKINS = {
    //          placement            dx  dy  delay  layout
    tableau: { mode: 'pointer', dx: 14, dy: 16, delay: 350, layout: 'rows' },
    pulse:   { mode: 'below',   dx: 0,  dy: 3,  delay: 80,  layout: 'line' },
    tnext:   { mode: 'pointer', dx: 12, dy: 14, delay: 200, layout: 'rows' },
    slds:    { mode: 'below',   dx: 0,  dy: 8,  delay: 350, layout: 'text', nubbin: true },
    slack:   { mode: 'above',   dx: 0,  dy: 8,  delay: 300, layout: 'text', nubbin: true }
  };
  var amb = { version: '1.1', tipsShown: 0, inertClicks: 0, toggles: 0, resizes: 0 };
  var layer, tip, tipFor = null, tipPending = null, tipTimer = null, suppressUntilLeave = null, lastPt = { x: 0, y: 0 };
  var scrollRest = new Map(), toggleRest = new Map(), sizeRest = new Map(), boxes = [];
  var REST_SEL = '[data-amb-scroll],[data-amb-rest]';
  var CHROME = 'header,nav,[role=banner],[data-amb-chrome]';

  function closestAttr(el, a) { var n = el && el.closest ? el.closest('[' + a + ']') : null; return n ? n.getAttribute(a) : null; }
  function busy() { return document.body.hasAttribute('data-demo-busy'); }
  function flowSteps() { var f = window.demoFlow; return f && f.steps ? f : null; }
  // is el (or an ancestor) the click trigger of the current-next or any later step? then it is story, not ambient
  function isStoryTrigger(el) {
    var f = flowSteps(); if (!f) return false;
    var from = Math.max(f.step, f.running == null ? -1 : f.running) + 1;
    for (var i = Math.max(1, from); i < f.steps.length; i++) {
      var on = f.steps[i] && f.steps[i].on; if (!on || !on.click) continue;
      try { if (el.closest(on.click)) return true; } catch (e) {}
    }
    return false;
  }
  function press(el) {
    var r = el.getBoundingClientRect(); if (r.width > 480 || r.height > 160) return;   // no flash on whole cards/rows
    el.classList.add('amb-press'); setTimeout(function () { el.classList.remove('amb-press'); }, 160);
  }

  // ---------------------------------------------------------------- tooltips
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rowsOf(el) {
    var raw = el.getAttribute('data-tip') || '';
    return raw.split('|').map(function (r) {
      r = r.trim(); if (!r) return null;
      var i = r.indexOf(': ');
      return i > 0 ? { k: r.slice(0, i), v: r.slice(i + 2) } : { t: r };
    }).filter(Boolean);
  }
  function tipHTML(el, sk) {
    var rows = rowsOf(el), title = el.getAttribute('data-tip-title'), h = '';
    if (sk.layout === 'text') {
      var parts = (title ? [title] : []).concat(rows.map(function (r) { return r.t != null ? r.t : r.k + ': ' + r.v; }));
      return '<div class="amb-tip-txt">' + esc(parts.join(' · ')) + '</div>';
    }
    if (sk.layout === 'line') {           // Pulse: "South  44%, US$48.9K of US$111.6K" on one line
      if (title) h += '<span class="amb-tip-k">' + esc(title) + '</span> ';
      return '<div class="amb-tip-line">' + h + rows.map(function (r) {
        return r.t != null ? '<b>' + esc(r.t) + '</b>' : '<span class="amb-tip-k">' + esc(r.k) + '</span> <b>' + esc(r.v) + '</b>';
      }).join(', ') + '</div>';
    }
    if (title) h += '<div class="amb-tip-title">' + esc(title) + '</div>';
    return h + rows.map(function (r) {
      return r.t != null ? '<div class="amb-tip-row">' + esc(r.t) + '</div>'
        : '<div class="amb-tip-row"><span class="amb-tip-k">' + esc(r.k) + ':</span> <b class="amb-tip-v">' + esc(r.v) + '</b></div>';
    }).join('');
  }
  function skinOf(el) { var s = closestAttr(el, 'data-tip-skin') || 'tableau'; return SKINS[s] ? s : 'tableau'; }
  // viewport, or the data-amb-tip-bounds zone (intersected with the viewport) when the mark asks for one
  function tipBounds(el) {
    var full = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
    var sel = closestAttr(el, 'data-amb-tip-bounds'); if (!sel) return full;
    var z = null; try { z = el.closest(sel) || document.querySelector(sel); } catch (e) {}
    if (!z) return full;
    var r = z.getBoundingClientRect();
    var b = { left: Math.max(0, r.left), top: Math.max(0, r.top), right: Math.min(innerWidth, r.right), bottom: Math.min(innerHeight, r.bottom) };
    return b.right - b.left > 40 && b.bottom - b.top > 20 ? b : full;
  }
  function place() {
    if (!tipFor) return;
    var name = skinOf(tipFor), sk = SKINS[name], bd = tipBounds(tipFor);
    var L = bd.left, T = bd.top, W = bd.right, H = bd.bottom;
    var tw = tip.offsetWidth, th = tip.offsetHeight, x, y, side = 'below';
    if (sk.mode === 'pointer') {
      x = lastPt.x + sk.dx; y = lastPt.y + sk.dy;
      if (x + tw > W - 4) x = lastPt.x - sk.dx - tw;
      if (y + th > H - 4) y = lastPt.y - sk.dy - th;
    } else {
      var r = scrubRect || tipFor.getBoundingClientRect();
      x = r.left + r.width / 2 - tw / 2;
      if (sk.mode === 'above') { y = r.top - sk.dy - th; side = 'above'; if (y < T + 4) { y = r.bottom + sk.dy; side = 'below'; } }
      else { y = r.bottom + sk.dy; if (y + th > H - 4) { y = r.top - sk.dy - th; side = 'above'; } }
      var nub = r.left + r.width / 2;
      x = Math.max(L + 4, Math.min(W - tw - 4, x));
      tip.style.setProperty('--amb-nub-x', Math.max(10, Math.min(tw - 10, nub - x)) + 'px');
    }
    x = Math.max(L + 4, Math.min(W - tw - 4, x)); y = Math.max(T + 4, Math.min(H - th - 4, y));
    tip.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
    tip.setAttribute('data-side', side);
  }
  function showTip(el) {
    if (busy() || !el.isConnected) return;
    var name = skinOf(el), sk = SKINS[name];
    tip.className = 'amb-tip amb-tip-' + name + (sk.nubbin ? ' amb-nub' : '');
    tip.innerHTML = tipHTML(el, sk);
    tipFor = el; el.setAttribute('data-amb-hot', '');
    tip.hidden = false; place(); amb.tipsShown++;
  }
  function hideTip() {
    clearTimeout(tipTimer); tipTimer = null; tipPending = null;
    if (tipFor) tipFor.removeAttribute('data-amb-hot');
    tipFor = null; if (tip) tip.hidden = true;
    scrubOff();
  }
  function convertTitles(root) {
    (root || document).querySelectorAll('svg title').forEach(function (t) {
      var mark = t.parentNode;
      if (!mark || mark.tagName.toLowerCase() === 'svg' || mark.hasAttribute('data-tip')) return;
      if (mark.closest('[data-amb-notip]')) { t.remove(); return; }
      mark.setAttribute('data-tip', t.textContent.trim().replace(/\s*\n\s*/g, '|'));
      t.remove();     // no OS tooltip on top of ours; aria-label on the svg keeps the accessible name
    });
  }
  function onOver(e) {
    var m = e.target.closest && e.target.closest('[data-tip]');
    if (m && (m === tipFor || m === tipPending || m === suppressUntilLeave)) return;
    suppressUntilLeave = null;
    if (!(scrubSer && !m && e.target.closest && e.target.closest('svg') === scrubSer.ownerSVGElement)) hideTip();
    if (!m || busy() || m.closest('[data-amb-notip]')) return;
    var sk = SKINS[skinOf(m)];
    tipPending = m; tipTimer = setTimeout(function () { tipPending = null; showTip(m); }, sk.delay);
  }
  function onMove(e) {
    lastPt.x = e.clientX; lastPt.y = e.clientY;
    if (tipFor && !scrubSer && SKINS[skinOf(tipFor)].mode === 'pointer') place();
    scrubMove(e);
    if (!dragging) edgeHover(e);
  }

  // ---------------------------------------------------------------- Pulse line scrub (only series marked captured)
  // <polyline data-amb-series="captured" data-amb-scrub="Label: value|Label: value|..."> : one row per point, same count
  // as the points. Digitized series carry no data-amb-series="captured" and are never scrubbed (their values are estimates).
  var scrubRect = null, scrubRule, scrubDot, scrubSer = null, scrubIdx = -1;
  function scrubOff() {
    scrubRect = null; scrubSer = null; scrubIdx = -1;
    if (scrubRule) scrubRule.hidden = scrubDot.hidden = true;
  }
  function scrubPoints(ser) {
    var rows = (ser.getAttribute('data-amb-scrub') || '').split('|'), pts = ser.points, m = ser.getScreenCTM();
    if (!pts || !m || !pts.numberOfItems || rows.length !== pts.numberOfItems) return null;
    var out = [];
    for (var i = 0; i < pts.numberOfItems; i++) { var q = pts.getItem(i); out.push({ x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f, row: rows[i] }); }
    return out;
  }
  function scrubMove(e) {
    if (busy() || dragging || !e.target.closest) { if (scrubSer) hideTip(); return; }
    var svg = e.target.closest('svg'), ser = svg ? svg.querySelector('polyline[data-amb-series="captured"][data-amb-scrub]') : null;
    if (!ser || svg.closest('[data-amb-notip]')) { if (scrubSer) hideTip(); return; }
    var pts = scrubPoints(ser); if (!pts) return;
    var first = pts[0].x, last = pts[pts.length - 1].x;
    if (e.clientX < Math.min(first, last) - 6 || e.clientX > Math.max(first, last) + 6) { if (scrubSer) hideTip(); return; }
    var best = 0; pts.forEach(function (p, i) { if (Math.abs(p.x - e.clientX) < Math.abs(pts[best].x - e.clientX)) best = i; });
    if (scrubSer === ser && scrubIdx === best) return;
    clearTimeout(tipTimer); tipTimer = null; tipPending = null;
    var p = pts[best], sr = svg.getBoundingClientRect(), name = skinOf(svg), sk = SKINS[name];
    if (!layer) return;
    if (!scrubRule) {
      scrubRule = document.createElement('div'); scrubRule.className = 'amb-scrub-rule'; scrubDot = document.createElement('div'); scrubDot.className = 'amb-scrub-dot';
      layer.appendChild(scrubRule); layer.appendChild(scrubDot);
    }
    scrubSer = ser; scrubIdx = best; tipFor = ser;
    scrubRule.hidden = scrubDot.hidden = false;
    scrubRule.style.cssText = 'left:' + Math.round(p.x) + 'px;top:' + Math.round(sr.top) + 'px;height:' + Math.round(sr.height) + 'px';
    scrubDot.style.cssText = 'left:' + (p.x - 4) + 'px;top:' + (p.y - 4) + 'px;background:' + (getComputedStyle(ser).stroke || '#0250d9');
    scrubRect = { left: p.x - 4, right: p.x + 4, top: p.y - 4, bottom: p.y + 4, width: 8, height: 8 };
    tip.className = 'amb-tip amb-tip-' + name + (sk.nubbin ? ' amb-nub' : '');
    tip.innerHTML = tipHTML({ getAttribute: function (a) { return a === 'data-tip' ? p.row : null; } }, sk);
    tip.hidden = false; place(); amb.tipsShown++;
  }

  // ---------------------------------------------------------------- reachable overflow + overlay thumbs
  function sbSkin(el) { return closestAttr(el, 'data-amb-sb') || 'mac'; }
  function visibleRect(el) {
    var r = el.getBoundingClientRect(), L = r.left, T = r.top, R = r.right, B = r.bottom;
    for (var n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
        var q = n.getBoundingClientRect();
        L = Math.max(L, q.left); T = Math.max(T, q.top); R = Math.min(R, q.right); B = Math.min(B, q.bottom);
      }
    }
    return { left: Math.max(L, 0), top: Math.max(T, 0), right: Math.min(R, innerWidth), bottom: Math.min(B, innerHeight) };
  }
  function boxFor(el) {
    for (var i = 0; i < boxes.length; i++) if (boxes[i].el === el) return boxes[i];
    var b = { el: el, y: mk('y'), x: mk('x'), hover: false, t: null };
    function mk(ax) { var d = document.createElement('div'); d.className = 'amb-thumb amb-thumb-' + ax; d.hidden = true; layer.appendChild(d); thumbDrag(d, ax, el); return d; }
    boxes.push(b); return b;
  }
  function paintThumbs(b) {
    var el = b.el, skin = sbSkin(el);
    if (skin === 'none' || !el.isConnected) { b.x.hidden = b.y.hidden = true; return; }
    var v = visibleRect(el), axis = el.getAttribute('data-amb-scroll') || 'both';
    var inset = skin === 'fluent' ? 3 : skin === 'slack' ? 3 : 2, th = skin === 'fluent' ? 7 : skin === 'ios' ? 3 : 6;
    var sh = el.scrollHeight, ch = el.clientHeight, sw = el.scrollWidth, cw = el.clientWidth;
    var vh = v.bottom - v.top, vw = v.right - v.left;
    var canY = axis !== 'x' && sh > ch + 1 && vh > 30, canX = axis !== 'y' && sw > cw + 1 && vw > 30;
    [['y', canY], ['x', canX]].forEach(function (p) {
      var d = b[p[0]]; d.className = 'amb-thumb amb-thumb-' + p[0] + ' amb-sb-' + skin + (b.show ? ' amb-on' : '');
      d.hidden = !p[1]; if (!p[1]) return;
      if (p[0] === 'y') {
        var track = vh - 2 * inset - (canX ? th + inset : 0), len = Math.max(24, track * ch / sh);
        var pos = (track - len) * (el.scrollTop / Math.max(1, sh - ch));
        d.style.cssText = 'left:' + (v.right - inset - th) + 'px;top:' + (v.top + inset + pos) + 'px;width:' + th + 'px;height:' + len + 'px';
      } else {
        var trackX = vw - 2 * inset - (canY ? th + inset : 0), lenX = Math.max(24, trackX * cw / sw);
        var posX = (trackX - lenX) * (el.scrollLeft / Math.max(1, sw - cw));
        d.style.cssText = 'top:' + (v.bottom - inset - th) + 'px;left:' + (v.left + inset + posX) + 'px;height:' + th + 'px;width:' + lenX + 'px';
      }
    });
  }
  function flash(b, ms) {
    b.show = true; paintThumbs(b); clearTimeout(b.t);
    b.t = setTimeout(function () { if (!b.hover && !b.drag) { b.show = false; paintThumbs(b); } }, ms || 900);
  }
  var resetStamp = 0;
  function snapScroll(el) { resetStamp++; if (!scrollRest.has(el)) scrollRest.set(el, { top: el.scrollTop, left: el.scrollLeft }); }
  // the element and every rest-tracked ancestor (nested boxes, a thread inside a pane)
  function snapAround(t) { for (var n = t && t.closest ? t.closest(REST_SEL) : null; n; n = n.parentElement ? n.parentElement.closest(REST_SEL) : null) snapScroll(n); }
  function thumbDrag(d, ax, el) {
    d.addEventListener('pointerdown', function (e) {
      if (busy()) return;
      e.preventDefault(); e.stopPropagation(); snapScroll(el);
      var b = boxFor(el); b.drag = true; d.setPointerCapture(e.pointerId);
      var s0 = ax === 'y' ? el.scrollTop : el.scrollLeft, p0 = ax === 'y' ? e.clientY : e.clientX;
      var v = visibleRect(el), track = ax === 'y' ? v.bottom - v.top : v.right - v.left;
      var ratio = ax === 'y' ? el.scrollHeight / Math.max(1, track) : el.scrollWidth / Math.max(1, track);
      function mv(ev) { var dd = ((ax === 'y' ? ev.clientY : ev.clientX) - p0) * ratio; if (ax === 'y') el.scrollTop = s0 + dd; else el.scrollLeft = s0 + dd; }
      function up() { b.drag = false; d.removeEventListener('pointermove', mv); d.removeEventListener('pointerup', up); flash(b); }
      d.addEventListener('pointermove', mv); d.addEventListener('pointerup', up);
    });
    d.addEventListener('click', function (e) { e.stopPropagation(); });
  }
  var lastWheel = -1e9;   // a wheel burst keeps scrolling (compositor momentum) for a while after its last event
  function onWheel(e) {
    if (busy()) return;
    lastWheel = performance.now();
    snapAround(e.target);
    // Chromium routes a wheel over a non-scrolling sibling to a clipped box the layer never sees: snapshot them all
    document.querySelectorAll(REST_SEL).forEach(function (n) { if (!scrollRest.has(n)) scrollRest.set(n, { top: n.scrollTop, left: n.scrollLeft }); });
    var el = e.target.closest && e.target.closest('[data-amb-scroll]');
    if (!el) return;
    var axis = el.getAttribute('data-amb-scroll');
    // a mouse wheel has no X: on an x-only box, vertical wheel scrolls sideways (as Tableau tables do)
    if (axis === 'x' && !e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      var before = el.scrollLeft; el.scrollLeft += e.deltaY;
      if (el.scrollLeft !== before) e.preventDefault();
    }
    flash(boxFor(el));
  }
  function onScrollEv(e) {
    var el = e.target; if (!el || !el.hasAttribute) return;
    var native = !el.hasAttribute('data-amb-scroll') && el.hasAttribute('data-amb-sb') && sbSkin(el) === 'ios';
    if (!el.hasAttribute('data-amb-scroll') && !native) return;
    var b = boxFor(el); if (b.show || b.hover) paintThumbs(b);
    if (native ? !busy() : scrollRest.has(el)) flash(b);           // user scroll: show the thumb like the OS does
  }
  function onEnter(e) {
    var el = e.target.closest && e.target.closest('[data-amb-scroll]');
    boxes.forEach(function (b) { if (b.hover && b.el !== el) { b.hover = false; flash(b, 300); } });
    if (!el || busy() || sbSkin(el) === 'ios') return;      // iOS bars appear only while scrolling
    var b = boxFor(el); if (b.hover) return;
    b.hover = true; b.show = true; paintThumbs(b);
  }

  // ---------------------------------------------------------------- free toggles (Tier 2c)
  function toggleTarget(el) {
    var sel = el.getAttribute('data-amb-target');
    if (sel) { try { return document.querySelector(sel); } catch (e) { return null; } }
    var mode = el.getAttribute('data-amb-toggle') || '';
    return mode.indexOf('class:') === 0 ? el : el.nextElementSibling;
  }
  function shown(n) {
    if (!n || n.hidden || n.hasAttribute('data-demo-hide')) return false;
    var cs = getComputedStyle(n); return cs.display !== 'none' && cs.visibility !== 'hidden';
  }
  // scrollable ancestors (page scroller included) of the toggle and its target: their scrollTop clamps when content collapses
  function scrollAncestors(nodes) {
    var out = [];
    nodes.forEach(function (x) {
      for (var n = x; n && n !== document.documentElement; n = n.parentElement) {
        if (n.scrollHeight > n.clientHeight + 1 || n.scrollWidth > n.clientWidth + 1) {
          var cs = getComputedStyle(n);
          if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX) && !out.some(function (o) { return o.n === n; })) out.push({ n: n, top: n.scrollTop, left: n.scrollLeft });
        }
      }
    });
    return out;
  }
  // rest is snapshotted per TARGET, first wins; the toggle's own aria-expanded per toggle, first wins
  function snapTarget(tg, el, anc, real) {
    var r = toggleRest.get(tg);
    if (!r) toggleRest.set(tg, r = { real: real, cls: tg.className, hid: tg.hidden, dh: tg.hasAttribute('data-demo-hide'), arias: new Map(), anc: anc });
    if (!r.arias.has(el)) r.arias.set(el, el.getAttribute('aria-expanded'));
  }
  function doToggle(el) {
    var mode = el.getAttribute('data-amb-toggle') || '', tg = toggleTarget(el), sw = null;
    if (mode.indexOf('swap:') === 0) {
      try { sw = mode.slice(5).split(',').map(function (q) { return document.querySelector(q.trim()); }); } catch (e) { sw = null; }
      if (!sw || sw.length !== 2 || !sw[0] || !sw[1]) return;
    }
    var anc = scrollAncestors([el].concat(sw || (tg ? [tg] : [])));
    if (sw) sw.forEach(function (n) { snapTarget(n, el, anc, true); }); else snapTarget(tg || el, el, anc, !!tg);
    if (sw) {
      var aOpen = shown(sw[0]);                     // show the hidden one, hide the visible one
      [[sw[0], !aOpen], [sw[1], aOpen]].forEach(function (p) {
        if (p[1]) { p[0].removeAttribute('data-demo-hide'); p[0].hidden = false; } else p[0].setAttribute('data-demo-hide', '');
      });
    } else if (mode.indexOf('class:') === 0) { if (tg) tg.classList.toggle(mode.slice(6)); }
    else {
      var ar = el.getAttribute('aria-expanded');
      var open = ar != null ? ar === 'true' : (tg ? shown(tg) : false);      // no aria-expanded: read the target's visibility
      el.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (tg) { tg.hidden = open; if (!open) tg.removeAttribute('data-demo-hide'); }
    }
    amb.toggles++;
  }

  // ---------------------------------------------------------------- evidence-gated resize (Tier 2d)
  var dragging = null, bar;
  function edgeOf(p) {
    var r = p.getBoundingClientRect(), side = p.getAttribute('data-amb-resize') || 'left';
    return { x: side === 'right' ? r.right : r.left, top: r.top, bottom: r.bottom, side: side, r: r };
  }
  function hitEdge(e) {
    if (busy()) return null;
    var ps = document.querySelectorAll('[data-amb-resize]');
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i]; if (!p.offsetParent && getComputedStyle(p).position !== 'fixed') continue;
      var g = edgeOf(p); if (Math.abs(e.clientX - g.x) <= 4 && e.clientY >= g.top && e.clientY <= g.bottom) return { p: p, g: g };
    }
    return null;
  }
  function edgeHover(e) {
    var h = hitEdge(e);
    document.documentElement.classList.toggle('amb-col', !!h);
    if (h) { bar.hidden = false; bar.style.cssText = 'left:' + (h.g.x - 1.5) + 'px;top:' + h.g.top + 'px;height:' + (h.g.bottom - h.g.top) + 'px'; }
    else if (!dragging) bar.hidden = true;
  }
  function widthTarget(p) {
    var v = p.getAttribute('data-amb-resize-var');
    var cs = getComputedStyle(p), extra = cs.boxSizing === 'border-box' ? 0 : p.getBoundingClientRect().width - parseFloat(cs.width);
    // w is the visible (border-box) width; content-box panels get padding+border taken off
    if (!v) return { set: function (w) { p.style.width = (w - extra) + 'px'; p.style.flexBasis = (w - extra) + 'px'; }, el: p, prop: null };
    var host = document.querySelector(p.getAttribute('data-amb-resize-var-on') || 'body') || document.body;
    return { set: function (w) { host.style.setProperty(v, w + 'px'); }, el: host, prop: v };
  }
  function snapSize(p) {
    if (sizeRest.has(p)) return;
    var t = widthTarget(p);
    sizeRest.set(p, { w: p.style.width, fb: p.style.flexBasis, host: t.el, prop: t.prop, val: t.prop ? t.el.style.getPropertyValue(t.prop) : null });
  }
  function restoreSize(p, s) {
    p.style.width = s.w; p.style.flexBasis = s.fb;
    if (s.prop) { if (s.val) s.host.style.setProperty(s.prop, s.val); else s.host.style.removeProperty(s.prop); }
  }
  function onDown(e) {
    hideTip(); if (e.target.closest) suppressUntilLeave = e.target.closest('[data-tip]');
    if (!busy() && !isStoryTrigger(e.target)) snapAround(e.target);      // a story trigger inside the box is not a user scroll gesture
    var h = hitEdge(e); if (!h || e.button !== 0) return;
    e.preventDefault(); snapSize(h.p);
    var p = h.p, w0 = h.g.r.width, x0 = e.clientX, sign = h.g.side === 'left' ? -1 : 1;
    var min = parseFloat(p.getAttribute('data-amb-min')) || 200, max = parseFloat(p.getAttribute('data-amb-max')) || innerWidth * 0.7;
    var t = widthTarget(p); dragging = p; document.documentElement.classList.add('amb-col', 'amb-dragging');
    function mv(ev) { t.set(Math.round(Math.max(min, Math.min(max, w0 + sign * (ev.clientX - x0))))); edgeHover(ev); }
    function up() { dragging = null; amb.resizes++; document.documentElement.classList.remove('amb-dragging'); removeEventListener('pointermove', mv, true); removeEventListener('pointerup', up, true); }
    addEventListener('pointermove', mv, true); addEventListener('pointerup', up, true);
  }
  function onDbl(e) {
    var h = hitEdge(e); if (!h) return;
    var s = sizeRest.get(h.p); if (s) { restoreSize(h.p, s); sizeRest.delete(h.p); }
  }

  // ---------------------------------------------------------------- Tier 3 inert + toggles (bubble phase, after demo-flow)
  var CLICKY = 'a[href],button,[role=button],[role=tab],[role=menuitem],[role=link],[data-amb-inert],[data-amb-toggle]';
  // bare <a> and titled icon spans inside chrome regions look clickable but match none of CLICKY
  function chromeInert(t) {
    var a = t.closest('a:not([href])'); if (a && a.closest(CHROME)) return a;
    var sp = t.closest('span[title]');
    if (sp && sp.closest(CHROME) && (sp.querySelector('svg,img') || !sp.textContent.trim())) return sp;
    return null;
  }
  // a mouse-clicked button keeps focus; the presenter's next key would paint a :focus-visible ring that outlives the beat
  function blurClicked() {
    setTimeout(function () {
      var a = document.activeElement;
      if (!a || a === document.body || a === document.documentElement) return;
      if (a.isContentEditable || a.matches('input,textarea,select,[contenteditable]')) return;
      a.blur();
    }, 0);
  }
  function onClick(e) {
    hideTip();
    var t = e.target; if (!t.closest) return;
    if (e.defaultPrevented) { blurClicked(); return; }                       // demo-flow (or the page) handled it: a story trigger
    if (t.closest('[data-demo-overlay],[data-demo-control],[data-amb-allow]')) return;
    var tg = t.closest('[data-amb-toggle]');
    if (tg && !busy() && !isStoryTrigger(tg)) { doToggle(tg); press(tg); return; }
    var el = t.closest(CLICKY) || chromeInert(t); if (!el) return;
    if (el.matches('summary,input,select,textarea,label') || el.closest('summary')) return;   // native widgets keep working
    e.preventDefault();                       // never navigate (href="#" would add a history entry); never stopPropagation
    amb.inertClicks++; press(el); blurClicked();
  }
  function onAux(e) { var a = e.target.closest && e.target.closest('a[href]'); if (a && !a.closest('[data-demo-overlay],[data-amb-allow]')) e.preventDefault(); }
  function onDragStart(e) { if (e.target.closest && e.target.closest('a[href],img') && !e.target.closest('[data-amb-allow]')) e.preventDefault(); }

  // ---------------------------------------------------------------- reset
  var pendingRest = [];
  // demo-flow scrolled this box itself (scroll action, stream follow, hook): it is the story's now, not ours to restore
  document.addEventListener('demo:scroll', function (e) {
    var el = e.detail; if (!el) return;
    scrollRest.delete(el);
    pendingRest.forEach(function (p) { if (p.el === el) p.dead = true; });
  });
  function reset() {
    hideTip();
    // wheel/momentum scrolling is animated: re-apply the rest position for a moment unless the user scrolls again,
    // demo-flow scrolls the box (demo:scroll), or scrollTop no longer equals what we last wrote (something took over)
    var rest = []; scrollRest.forEach(function (r, el) { rest.push({ el: el, top: r.top, left: r.left, w: null, dead: false }); }); scrollRest.clear();
    var stamp = ++resetStamp; pendingRest = rest;
    function put() {
      if (stamp !== resetStamp) return;
      rest.forEach(function (p) {
        if (p.dead || !p.el.isConnected) return;
        if (p.w && performance.now() - lastWheel > 1500 && (Math.abs(p.el.scrollTop - p.w.top) > 1 || Math.abs(p.el.scrollLeft - p.w.left) > 1)) { p.dead = true; return; }   // momentum from a wheel burst just before reset is not a takeover
        p.el.scrollTo({ top: p.top, left: p.left, behavior: 'instant' });
        p.w = { top: p.el.scrollTop, left: p.el.scrollLeft };
      });
    }
    put(); [60, 200, 450, 900, 1400].forEach(function (ms) { setTimeout(put, ms); });
    var ancs = [];
    toggleRest.forEach(function (r, tg) {
      if (r.real) {
        tg.className = r.cls; tg.hidden = r.hid;
        if (r.dh) tg.setAttribute('data-demo-hide', ''); else tg.removeAttribute('data-demo-hide');
      }
      r.arias.forEach(function (aria, el) { if (aria == null) el.removeAttribute('aria-expanded'); else el.setAttribute('aria-expanded', aria); });
      r.anc.forEach(function (a) { if (ancs.indexOf(a) < 0) ancs.push(a); });
    }); toggleRest.clear();
    function putAnc() { ancs.forEach(function (a) { if (a.n.isConnected) a.n.scrollTo({ top: a.top, left: a.left, behavior: 'instant' }); }); }
    if (ancs.length) { putAnc(); setTimeout(putAnc, 0); setTimeout(putAnc, 60); }     // content collapsed => ancestors clamped; re-open lands first
    sizeRest.forEach(function (s, p) { restoreSize(p, s); }); sizeRest.clear();
    boxes.forEach(function (b) { b.hover = b.show = false; clearTimeout(b.t); paintThumbs(b); });
    if (bar) bar.hidden = true; document.documentElement.classList.remove('amb-col');
  }
  amb.reset = reset; amb.hide = hideTip;
  amb.info = function () {
    return { scroll: document.querySelectorAll('[data-amb-scroll]').length, tips: document.querySelectorAll('[data-tip]').length,
      toggles: document.querySelectorAll('[data-amb-toggle]').length, resize: document.querySelectorAll('[data-amb-resize]').length,
      tipsShown: amb.tipsShown, inertClicks: amb.inertClicks, tipVisible: !!(tip && !tip.hidden) };
  };
  window.demoAmbient = amb;

  function init() {
    layer = document.createElement('div'); layer.className = 'amb-layer';
    tip = document.createElement('div'); tip.className = 'amb-tip'; tip.hidden = true; tip.setAttribute('role', 'tooltip');
    bar = document.createElement('div'); bar.className = 'amb-resize-bar'; bar.hidden = true;
    layer.appendChild(tip); layer.appendChild(bar); document.body.appendChild(layer);
    convertTitles();
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.attributeName === 'data-demo-busy' && document.body.hasAttribute('data-demo-busy')) { reset(); blurClicked(); }   // a step starts
      });
    }).observe(document.body, { attributes: true, attributeFilter: ['data-demo-busy'] });
    document.addEventListener('pointerover', onOver, true);
    document.addEventListener('pointermove', onMove, true);
    document.addEventListener('pointerover', onEnter, true);
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('dblclick', onDbl, true);
    document.addEventListener('wheel', onWheel, { capture: true, passive: false });
    document.addEventListener('scroll', function (e) { onScrollEv(e); if (tipFor && SKINS[skinOf(tipFor)].mode !== 'pointer') place(); }, true);
    document.addEventListener('touchstart', function (e) { if (!busy() && !isStoryTrigger(e.target)) snapAround(e.target); }, { capture: true, passive: true });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); }, true);
    document.addEventListener('click', onClick, false);
    document.addEventListener('auxclick', onAux, false);
    document.addEventListener('dragstart', onDragStart, true);
    document.documentElement.addEventListener('pointerleave', function () { hideTip(); boxes.forEach(function (b) { if (b.hover) { b.hover = false; flash(b, 300); } }); });
    addEventListener('resize', function () { hideTip(); boxes.forEach(paintThumbs); });
    document.body.setAttribute('data-amb-ready', '');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
