/* Carelo site: the thread, scroll choreography and section interactions. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = window.gsap, ST = window.ScrollTrigger;
  const NS = 'http://www.w3.org/2000/svg';
  const isMobile = () => matchMedia('(max-width:860px)').matches;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } } };

  if (!G || !ST) { document.documentElement.classList.add('no-gsap'); return; }
  G.registerPlugin(ST);
  G.defaults({ ease: 'power3.out', duration: 0.9 });

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (!RM && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ST.update);
    G.ticker.add(t => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  }
  function goTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.6 });
    else target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    setTimeout(() => target.focus({ preventScroll: true }), lenis ? 1200 : 300);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) { e.preventDefault(); return; }
    const t = document.getElementById(id.slice(1)); if (!t) return;
    e.preventDefault(); goTo(t);
  });
  const nav = $('#nav');
  ST.create({ start: 0, end: 'max', onUpdate: s => nav.classList.toggle('scrolled', s.scroll() > 30) });

  /* ================= THE THREAD ================= */
  const Thread = (() => {
    const svg = $('#thread'), core = $('.t-core', svg), glow = $('.t-glow', svg), ghost = $('.t-ghost', svg), pulses = $('#pulses');
    let L = 0, samples = [], keyed = {}, minLen = 0, drawn = 0;
    const cbs = [];
    const outer = s => (s.parentElement && s.parentElement.classList.contains('pin-spacer') ? s.parentElement : s);
    const rectPage = el => { const r = el.getBoundingClientRect(); return { l: r.left + scrollX, t: r.top + scrollY, w: r.width, h: r.height }; };

    function points() {
      const W = document.documentElement.clientWidth, m = isMobile(), LX = m ? 16 : 28;
      const pts = [];
      // hero: senior phone -> caregiver phone
      const hs = $('#hpSen .phone'), hc = $('#hpCar .phone');
      const a = rectPage(hs), b = rectPage(hc);
      if (m) {
        pts.push({ x: LX, y: a.t + 40 });
        pts.push({ x: LX, y: b.t + b.h + 40 });
      } else {
        const sp = { x: a.l + a.w - 4, y: a.t + a.h * 0.42, key: 'hS', h: 1 };
        const cp = { x: b.l + 4, y: b.t + b.h * 0.36, key: 'hC', h: 1 };
        pts.push({ x: a.l + a.w * 0.5, y: a.t + a.h * 0.42, h: 1 });
        pts.push(sp);
        pts.push(cp);
        pts.push({ x: b.l + b.w * 0.5, y: b.t + b.h * 0.5, h: 1 });
        pts.push({ x: b.l + b.w * 0.5, y: b.t + b.h + 70 });
      }
      $$('[data-sec]').forEach(sec => {
        if (sec.id === 'top') return;
        const o = rectPage(outer(sec));
        const tx = sec.dataset.tx;
        const x = m ? LX : tx === 'L' ? LX : tx === 'R' ? W - LX : parseFloat(tx) * W;
        const pad = Math.min(200, o.h * 0.12);
        const inner = $$('.ta', sec).map(el => { const r = rectPage(el); return { x: m ? LX : r.l, y: r.t, key: el.id || null }; });
        pts.push({ x, y: o.t + pad });
        if (sec.id === 'roadmap' && !m) { inner.forEach(p => pts.push(p)); pts.push({ x, y: o.t + o.h - pad * 0.5 }); return; }
        if (sec.id === 'waitlist') { inner.forEach(p => { pts.push({ x: m ? LX : p.x, y: p.y - 120 }); pts.push(p); }); return; }
        inner.forEach(p => pts.push(p));
        pts.push({ x, y: o.t + o.h - pad });
      });
      return pts;
    }
    function toPath(p) {
      // Each segment is an S-curve. Points flagged h leave/arrive horizontally, all others vertically, so the line never overshoots.
      let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
      for (let i = 0; i < p.length - 1; i++) {
        const a = p[i], b = p[i + 1], dx = b.x - a.x, dy = b.y - a.y;
        const c1 = a.h ? [a.x + dx * 0.5, a.y] : [a.x, a.y + dy * 0.5];
        const c2 = b.h ? [b.x - dx * 0.5, b.y] : [b.x, b.y - dy * 0.5];
        d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      return d;
    }
    function build() {
      const W = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
      svg.setAttribute('width', W); svg.setAttribute('height', H); svg.style.height = H + 'px';
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const pts = points();
      const d = toPath(pts);
      [core, glow, ghost].forEach(p => p.setAttribute('d', d));
      L = core.getTotalLength();
      samples = []; let maxY = -1;
      const step = 6;
      for (let l = 0; l <= L; l += step) { const p = core.getPointAtLength(l); maxY = Math.max(maxY, p.y); samples.push({ l, x: p.x, y: p.y, my: maxY }); }
      keyed = {};
      pts.filter(p => p.key).forEach(p => { keyed[p.key] = nearest(p.x, p.y); });
      minLen = keyed.hC ? keyed.hC + 120 : 0;
      [core, glow].forEach(p => { p.style.strokeDasharray = `${L} ${L}`; });
      update(true);
    }
    function nearest(x, y) { let best = 0, bd = Infinity; for (const s of samples) { const dd = (s.x - x) ** 2 + (s.y - y) ** 2; if (dd < bd) { bd = dd; best = s.l; } } return best; }
    function lenAtY(y) { let lo = 0, hi = samples.length - 1; if (!samples.length) return 0; while (lo < hi) { const mid = (lo + hi) >> 1; if (samples[mid].my < y) lo = mid + 1; else hi = mid; } return samples[lo].l; }
    function update(force) {
      if (!L) return;
      const target = RM ? L : Math.max(minLen, lenAtY(scrollY + innerHeight * 0.66));
      if (!force && Math.abs(target - drawn) < 0.5) return;
      drawn = Math.min(L, target);
      const off = L - drawn;
      core.style.strokeDashoffset = off; glow.style.strokeDashoffset = off;
      cbs.forEach(fn => fn(drawn));
    }
    function pulse(l0, l1, bad, dur = 1.4) {
      if (!L) return;
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = `<circle r="14" fill="url(#${bad ? 'pg-bad' : 'pg-ok'})"/><circle r="3.2" fill="#fff"/>`;
      pulses.appendChild(g);
      const place = l => { const p = core.getPointAtLength(Math.max(0, Math.min(L, l))); g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); };
      if (RM) { place(l1); G.fromTo(g, { opacity: 1 }, { opacity: 0, duration: 1, onComplete: () => g.remove() }); return; }
      const o = { l: l0 }; place(l0);
      G.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      G.to(o, { l: l1, duration: dur, ease: 'power2.inOut', onUpdate: () => place(o.l), onComplete: () => G.to(g, { opacity: 0, scale: 1.6, transformOrigin: 'center', duration: 0.5, onComplete: () => g.remove() }) });
    }
    const pulseY = (y0, y1, bad, dur) => pulse(lenAtY(y0), lenAtY(y1), bad, dur);
    return { build, update, pulse, pulseY, lenAtY, key: k => keyed[k], onDraw: fn => cbs.push(fn), get length() { return L; }, nearest };
  })();
  window.CareloThread = Thread;

  /* ================= OPENING ================= */
  function opening() {
    return new Promise(resolve => {
      if (RM || store.get('carelo-seen')) return resolve();
      store.set('carelo-seen', '1');
      const ov = document.createElement('div');
      ov.id = 'opening'; ov.setAttribute('aria-hidden', 'true');
      ov.innerHTML = `<svg viewBox="0 0 640 220"><path class="ecg" id="ecg"/><text class="word" id="ecgWord" x="320" y="150" text-anchor="middle">carelo</text></svg><button type="button">Skip intro</button>`;
      document.body.appendChild(ov);
      const path = $('#ecg', ov), word = $('#ecgWord', ov);
      const ecgPts = [[0, 120], [190, 120], [212, 108], [232, 120], [252, 120], [268, 34], [286, 178], [304, 120], [340, 120], [362, 102], [386, 120], [640, 120]];
      const ecgY = x => { for (let i = 0; i < ecgPts.length - 1; i++) { const [x0, y0] = ecgPts[i], [x1, y1] = ecgPts[i + 1]; if (x <= x1) return y0 + (y1 - y0) * ((x - x0) / (x1 - x0)); } return 120; };
      const smoothY = x => 172 + Math.sin((x / 640) * Math.PI * 2) * 6;
      const xs = []; for (let x = 0; x <= 640; x += 4) xs.push(x);
      ecgPts.forEach(p => { if (!xs.includes(p[0])) xs.push(p[0]); }); xs.sort((a, b) => a - b);
      const st = { k: 0 };
      const draw = () => path.setAttribute('d', xs.map((x, i) => `${i ? 'L' : 'M'}${x} ${(ecgY(x) * (1 - st.k) + smoothY(x) * st.k).toFixed(1)}`).join(' '));
      draw();
      const len = path.getTotalLength() + 40;
      G.set(path, { strokeDasharray: len, strokeDashoffset: len });
      G.set(word, { opacity: 0, y: 14 });
      let done = false;
      const finish = () => { if (done) return; done = true; G.to(ov, { opacity: 0, y: -30, duration: 0.6, ease: 'power3.inOut', onComplete: () => ov.remove() }); resolve(); };
      const tl = G.timeline({ onComplete: finish });
      tl.to(path, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' })
        .to(st, { k: 1, duration: 0.4, ease: 'power3.inOut', onUpdate: draw })
        .to(path, { attr: { 'stroke-width': 2 }, scaleX: 0.42, transformOrigin: '50% 50%', duration: 0.4, ease: 'expo.out' }, '-=0.1')
        .to(word, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, '<')
        .to({}, { duration: 0.15 });
      $('button', ov).addEventListener('click', () => { tl.kill(); finish(); });
      addEventListener('keydown', function k() { removeEventListener('keydown', k); tl.kill(); finish(); });
    });
  }

  /* ================= HERO ================= */
  function heroSky() {
    const h = new Date().getHours();
    const sky = $('#heroSky'), lbl = $('#skyLabel');
    let bg, name;
    if (h >= 5 && h < 11) { name = 'morning'; bg = 'radial-gradient(120% 80% at 20% 10%,#FCEBB6 0%,#FDF5DA 40%,#FCFCFA 75%)'; }
    else if (h >= 11 && h < 17) { name = 'afternoon'; bg = 'radial-gradient(120% 80% at 70% 0%,#FBF1CF 0%,#EEF7FB 45%,#FCFCFA 78%)'; }
    else if (h >= 17 && h < 21) { name = 'evening'; bg = 'radial-gradient(120% 80% at 80% 0%,#D3E9F6 0%,#E8F3F9 42%,#FCFCFA 78%)'; }
    else { name = 'night'; bg = 'radial-gradient(120% 80% at 50% 0%,#C9E1F0 0%,#E3EFF6 45%,#FCFCFA 80%)'; }
    sky.style.background = bg; lbl.textContent = name;
  }
  function splitWords(el) {
    const out = [];
    [...el.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const parts = n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('span'); i.textContent = p; w.appendChild(i); frag.appendChild(w); out.push(i);
        });
        n.replaceWith(frag);
      } else {
        const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('span'); n.replaceWith(w); i.appendChild(n); w.appendChild(i); out.push(i);
      }
    });
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    return out;
  }
  let heroWords = [];
  function heroPrep() {
    heroSky();
    heroWords = splitWords($('#heroTitle'));
    if (RM) return;
    G.set(heroWords, { yPercent: 115 });
    G.set(['.hero .eyebrow', '.hero .lede', '.hero-ctas', '.hero-facts'], { opacity: 0, y: 24 });
    G.set(['#hpSen', '#hpCar'], { opacity: 0, y: 90 });
  }
  function heroIntro() {
    if (RM) { heroLoop(); return; }
    const tl = G.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero .eyebrow', { opacity: 1, y: 0, duration: 1 })
      .to(heroWords, { yPercent: 0, duration: 1.1, stagger: 0.075 }, '-=0.8')
      .to(['.hero .lede', '.hero-ctas', '.hero-facts'], { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, '-=0.7')
      .to('#hpSen', { opacity: 1, y: 0, duration: 1.4, ease: 'elastic.out(1,0.75)' }, '-=1.1')
      .to('#hpCar', { opacity: 1, y: 0, duration: 1.4, ease: 'elastic.out(1,0.75)' }, '-=1.25')
      .add(() => { Thread.build(); roadmapLens(); heroFloat(); heroLoop(); }, '-=0.2');
  }
  function heroFloat() {
    G.to('#hpSen', { y: -10, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    G.to('#hpCar', { y: -12, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.8 });
    const stage = $('.hero');
    const phones = $$('#heroStage .phone');
    if (matchMedia('(pointer:fine)').matches) {
      stage.addEventListener('pointermove', e => {
        const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
        phones.forEach((p, i) => G.to(p, { rotationY: x * (i ? 9 : 7), rotationX: -y * 6, duration: 1.2, ease: 'power3.out' }));
      });
      stage.addEventListener('pointerleave', () => phones.forEach(p => G.to(p, { rotationY: 0, rotationX: 0, duration: 1.4, ease: 'power3.out' })));
    }
  }
  let heroActive = true, heroTimer = null;
  function heroLoop() {
    ST.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: s => { heroActive = s.isActive; } });
    const run = () => { if (heroActive && !document.hidden) heroCheckIn(); heroTimer = setTimeout(run, 6200); };
    heroTimer = setTimeout(run, RM ? 1500 : 900);
  }
  function heroCheckIn() {
    const btn = $('#heroOk'), thumb = $('#heroThumb'), notif = $('#heroNotif'), chip = $('#heroCheckChip'), sub = $('#heroCheckSub');
    const reset = () => { chip.className = 'chip chip-wait'; chip.textContent = 'Waiting'; sub.textContent = 'Due by 10:00 AM'; };
    const arrive = () => { chip.className = 'chip chip-ok'; chip.textContent = 'Okay'; sub.textContent = 'Checked in 9:02 AM'; };
    if (RM) { G.set(notif, { yPercent: 0, opacity: 1 }); arrive(); setTimeout(() => { G.set(notif, { opacity: 0 }); reset(); }, 3600); return; }
    const sr = btn.getBoundingClientRect(), scr = btn.parentElement.parentElement.getBoundingClientRect();
    const tx = sr.left - scr.left + sr.width * 0.55 - 31, ty = sr.top - scr.top + sr.height * 0.45 - 30;
    const tl = G.timeline();
    tl.set(thumb, { x: tx + 90, y: ty + 200, opacity: 0, scale: 1 })
      .to(thumb, { x: tx, y: ty, opacity: 0.92, duration: 0.9, ease: 'power3.out' })
      .to(thumb, { scale: 0.9, duration: 0.15, ease: 'power2.in' })
      .to(btn, { scale: 0.95, duration: 0.15, ease: 'power2.in' }, '<')
      .add(() => {
        const sp = document.createElement('span'); sp.className = 'ripple';
        const d = sr.width * 1.6; Object.assign(sp.style, { width: d + 'px', height: d + 'px', left: sr.width / 2 - d / 2 + 'px', top: sr.height / 2 - d / 2 + 'px' });
        btn.appendChild(sp); G.to(sp, { scale: 1, opacity: 0, duration: 1, ease: 'power2.out', onComplete: () => sp.remove() });
        if (isMobile()) mobileHeroPulse(); else if (Thread.key('hS') !== undefined) Thread.pulse(Thread.key('hS'), Thread.key('hC'), false, 1.2);
      })
      .to(btn, { scale: 1, duration: 0.8, ease: 'elastic.out(1,0.5)' })
      .to(thumb, { scale: 1, x: tx + 110, y: ty + 230, opacity: 0, duration: 0.8, ease: 'power2.in' }, '<')
      .fromTo(notif, { yPercent: -220, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.4)' }, '-=0.45')
      .add(arrive, '-=0.4')
      .to(notif, { yPercent: -220, opacity: 0, duration: 0.7, ease: 'power3.in' }, '+=2.2')
      .add(reset, '+=0.3');
  }
  function mobileHeroPulse() {
    const p = $('#heroLinkMPath'), dot = $('#heroLinkMDot'); const L = p.getTotalLength(); const o = { t: 0 };
    G.set(dot, { opacity: 1 });
    G.to(o, { t: 1, duration: 1, ease: 'power2.inOut', onUpdate: () => { const q = p.getPointAtLength(o.t * L); dot.setAttribute('cx', q.x); dot.setAttribute('cy', q.y); }, onComplete: () => G.to(dot, { opacity: 0, duration: 0.3 }) });
  }

  /* ================= PROBLEM: map ================= */
  const US = [[-124.7, 48.4], [-123, 49], [-95.2, 49], [-94.8, 49.4], [-89.6, 48], [-84.8, 46.6], [-83.5, 46.1], [-82.4, 43], [-83.1, 42], [-81, 41.9], [-79.8, 42.2], [-79, 42.9], [-79.2, 43.4], [-76.2, 43.6], [-75.3, 44.8], [-71.5, 45], [-70, 46.7], [-69.2, 47.4], [-67.8, 47.1], [-67, 44.9], [-70.2, 43.6], [-70.6, 42.6], [-70, 41.7], [-71.9, 41.3], [-73.9, 40.6], [-74, 39.6], [-75, 38.8], [-75.9, 37.4], [-76, 36.9], [-75.5, 35.3], [-76.6, 34.7], [-78, 33.9], [-79.2, 33.2], [-80.9, 32], [-81.4, 30.4], [-80.6, 28.4], [-80, 26.7], [-80.4, 25.2], [-81.1, 25.1], [-81.8, 26.1], [-82.8, 27.9], [-83, 29.1], [-84, 30], [-85.4, 29.7], [-86.5, 30.4], [-88, 30.6], [-89.6, 30.2], [-89.4, 29], [-90.9, 29.1], [-93.8, 29.7], [-95, 29.3], [-96.7, 28.3], [-97.4, 27.3], [-97.2, 25.9], [-99.1, 26.4], [-99.5, 27.5], [-100.9, 29.4], [-102.4, 29.8], [-103.1, 29], [-104.5, 29.7], [-106.5, 31.8], [-108.2, 31.8], [-108.2, 31.3], [-111, 31.3], [-114.8, 32.5], [-117.1, 32.5], [-118.4, 34], [-120.6, 34.6], [-121.9, 36.6], [-122.5, 37.8], [-123.8, 39.8], [-124.4, 40.4], [-124.2, 42], [-124, 44.6], [-124, 46.3]];
  const proj = (lon, lat) => [(lon + 126) * 15.7 * 0.79 + 20, (50.5 - lat) * 21.2 + 6];
  const PAIRS = [
    [[-82.46, 27.95], [-87.63, 41.88]], [[-93.27, 44.98], [-96.8, 32.78]], [[-112.07, 33.45], [-122.33, 47.61]],
    [[-81.69, 41.5], [-97.74, 30.27]], [[-74.17, 40.74], [-84.39, 33.75]], [[-95.93, 41.26], [-118.24, 34.05]],
    [[-80.84, 35.23], [-104.99, 39.74]], [[-83.05, 42.33], [-95.37, 29.76]], [[-71.06, 42.36], [-122.42, 37.77]],
  ];
  function drawMap() {
    const cv = $('#usMap'); if (!cv) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = 900 * dpr; cv.height = 560 * dpr;
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    const poly = US.map(p => proj(p[0], p[1]));
    const inside = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c; } return c; };
    ctx.fillStyle = '#C5D3DE';
    for (let y = 7; y < 560; y += 14) for (let x = 7; x < 900; x += 14) if (inside(x, y)) { ctx.beginPath(); ctx.arc(x, y, 3.6, 0, Math.PI * 2); ctx.fill(); }
    const svg = $('#usArcs');
    PAIRS.forEach((pr, i) => {
      const [a, b] = [proj(...pr[0]), proj(...pr[1])];
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const cx = mx, cy = my - dist * 0.32;
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'pair'); g.dataset.grp = i % 3;
      g.innerHTML = `<path class="arc" d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}"/><circle cx="${a[0]}" cy="${a[1]}" r="6" fill="#DBB155"/><circle cx="${b[0]}" cy="${b[1]}" r="6" fill="#104E64"/>`;
      svg.appendChild(g);
      const p = g.querySelector('path'); const L = p.getTotalLength(); p.style.strokeDasharray = L; p.dataset.len = L;
    });
  }
  function arcsTween(tl, grp, at) {
    $$(`#usArcs .pair[data-grp="${grp}"]`).forEach((g, k) => {
      const p = g.querySelector('path'), dots = g.querySelectorAll('circle');
      tl.fromTo(dots[0], { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, at + k * 0.08)
        .fromTo(p, { strokeDashoffset: p.dataset.len }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, at + 0.1 + k * 0.08)
        .fromTo(dots[1], { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, at + 0.8 + k * 0.08);
    });
  }
  function countTo(el, tl, at, dur) {
    const to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0; const o = { v: 0 };
    tl.to(o, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => { el.textContent = o.v.toFixed(dec); } }, at);
  }

  /* ================= FEATURES ================= */
  const featAnims = [];
  let featTl = null, featCur = -1;
  function featureSetup() {
    const screens = $$('#featPhone .fs');
    const arts = $$('.feat');
    // hub dots
    const flow = $('#hubFlow'); for (let i = 0; i < 16; i++) { const d = document.createElement('i'); flow.appendChild(d); }
    featAnims[0] = () => {
      const tl = G.timeline({ repeat: 2 });
      $$('#hubFlow i').forEach((d, i) => {
        const left = i % 2 === 0;
        tl.fromTo(d, { x: left ? 52 : 196, y: -6, opacity: 0, scale: 1 }, { x: 126 + (Math.random() * 30 - 15), y: 104, opacity: 1, scale: 0.6, duration: 0.9, ease: 'power2.in' }, i * 0.09).to(d, { opacity: 0, duration: 0.2 }, '>-0.1');
      });
      tl.fromTo('#featPhone [data-f="0"] .c-card', { scale: 1 }, { scale: 1.03, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 1.4);
      return tl;
    };
    featAnims[1] = () => G.timeline()
      .fromTo('#pillDrop', { y: -160, rotation: -40, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'bounce.out' })
      .fromTo('#featMedBtn', { scale: 1 }, { scale: 0.94, duration: 0.18, ease: 'power2.in' }, '+=0.3')
      .add(() => {
        const host = $('#medBurst'); host.innerHTML = '';
        for (let i = 0; i < 20; i++) { const p = document.createElement('i'); host.appendChild(p); const a = i / 20 * Math.PI * 2, r = 70 + Math.random() * 50; G.fromTo(p, { x: 0, y: 0, opacity: 1, scale: 1 }, { x: Math.cos(a) * r, y: Math.sin(a) * r, opacity: 0, scale: 0.3, duration: 1.2, ease: 'expo.out' }); }
      })
      .to('#featMedBtn', { scale: 1, duration: 0.8, ease: 'elastic.out(1,0.5)' });
    featAnims[2] = () => {
      const lcd = $('#lcd'), msg = $('#scanMsg'); msg.textContent = 'Hold steady…'; lcd.textContent = '---.-';
      const tl = G.timeline();
      tl.set('#scanline', { opacity: 1, y: 0 }).to('#scanline', { y: 236, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: 1 });
      const o = { n: 0 }; tl.to(o, { n: 18, duration: 1.4, ease: 'none', onUpdate: () => { lcd.textContent = (130 + Math.random() * 40).toFixed(1); } }, 0.3);
      tl.add(() => { lcd.textContent = '152.4'; msg.innerHTML = '<b style="color:var(--teal-ink)">152.4 lb saved.</b> Steady this month.'; }).to('#scanline', { opacity: 0, duration: 0.3 }, '<')
        .fromTo('#lcd', { scale: 1.12 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, '<');
      return tl;
    };
    featAnims[3] = () => {
      const cards = $$('#cards4 .card3d'); const line = $('#cogLine'); const L = line.getTotalLength();
      const tl = G.timeline();
      tl.set(cards, { rotationY: 0 }).set(line, { strokeDasharray: L, strokeDashoffset: L });
      cards.forEach((c, i) => tl.to(c, { rotationY: 180, duration: 0.8, ease: 'power3.inOut' }, 0.2 + i * 0.35));
      tl.to([cards[0], cards[2]], { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1 }, '+=0.1').to(line, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, '-=0.2');
      return tl;
    };
    featAnims[4] = () => {
      const ring = $('#safeRing'), txt = $('#safeTxt'), msg = $('#safeMsg'), o = { p: 0 };
      ring.style.stroke = ''; msg.innerHTML = '&nbsp;'; txt.style.color = '';
      return G.timeline().to(o, {
        p: 1, duration: 3.8, ease: 'none',
        onUpdate: () => { ring.setAttribute('stroke-dashoffset', (263.9 * o.p).toFixed(1)); txt.innerHTML = `${Math.ceil(30 * (1 - o.p))} min<br>left`; if (o.p > 0.7) ring.style.stroke = 'var(--alert)'; },
      }).add(() => {
        txt.innerHTML = 'No<br>answer'; txt.style.color = 'var(--alert-ink)';
        msg.innerHTML = '<b style="color:var(--alert-ink)">Priya has been notified.</b>';
        const ph = $('#featPhone').getBoundingClientRect();
        Thread.pulseY(scrollY + ph.top + ph.height * 0.3, scrollY + ph.top + ph.height * 1.6, true, 1.6);
      }).fromTo('#safeBtn', { x: 0 }, { x: 6, duration: 0.08, repeat: 5, yoyo: true });
    };
    featAnims[5] = () => {
      const ring = $('#wsRing'), num = $('#wsNum'), o = { v: 0 };
      const tl = G.timeline();
      tl.set('.wsc', { opacity: 0, scale: 0.3, y: -80 });
      tl.to(o, { v: 86, duration: 1.8, ease: 'power3.out', onUpdate: () => { num.textContent = Math.round(o.v); ring.setAttribute('stroke-dashoffset', (527.8 * (1 - o.v / 100)).toFixed(1)); } });
      tl.to('.wsc', { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(2)', stagger: 0.12 }, 0.6);
      return tl;
    };
    function setFeature(i) {
      if (i === featCur) return; featCur = i;
      arts.forEach((a, k) => a.classList.toggle('on', k === i));
      screens.forEach((s, k) => {
        if (k === i) { s.classList.add('on'); if (!RM) G.fromTo(s, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }); else G.set(s, { opacity: 1 }); }
        else if (s.classList.contains('on')) { if (!RM) G.to(s, { opacity: 0, duration: 0.5, onComplete: () => s.classList.remove('on') }); else s.classList.remove('on'); }
      });
      $('.feat-cap').textContent = ['Sample data · Apple Health', 'Sample data', 'Sample data · scale reading', 'Sample data · 8-week trend', 'Sample data · 30-minute window, sped up', 'Sample data'][i];
      if (featTl) featTl.kill();
      if (!RM) featTl = featAnims[i]();
      else { featTl = featAnims[i](); featTl.progress(1); }
    }
    arts.forEach((a, i) => ST.create({ trigger: a, start: 'top 60%', end: 'bottom 60%', onToggle: s => { if (s.isActive) setFeature(i); } }));
    ST.create({ trigger: '#features', start: 'top 70%', once: true, onEnter: () => { if (featCur < 0) setFeature(0); } });
  }

  /* ================= REPORT ================= */
  let reportShown = false;
  function renderReport(anim) {
    const r = window.CareloDemo ? window.CareloDemo.getReport() : null; if (!r) return;
    const c = r.comp;
    $('#rpRange').textContent = r.week;
    $('#rpScore').textContent = c.score;
    // weight
    const ws = r.days.map(d => d.w);
    let last = ws.find(v => v !== null); const wf = ws.map(v => (v === null ? last : (last = v)));
    const lo = Math.min(...wf) - 0.8, hi = Math.max(...wf) + 0.8;
    const wpts = wf.map((v, i) => [10 + i * 46.7, 54 - (v - lo) / (hi - lo) * 46]);
    const avg = wf.reduce((a, b) => a + b, 0) / wf.length;
    $('#rpW').textContent = `${avg.toFixed(1)} lb avg · ${c.wChange <= 0 ? '−' : '+'}${Math.abs(c.wChange).toFixed(1)} lb`;
    $('#rpWeight').innerHTML = `<path d="M0 58H300" stroke="#EEF1F4"/><path class="ln" d="${wpts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}" fill="none" stroke="#104E64" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${wpts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#104E64"/>`).join('')}${r.days.map((d, i) => `<text x="${10 + i * 46.7}" y="62" font-size="0" >${d.d}</text>`).join('')}`;
    // adherence
    $('#rpA').textContent = `${c.dosesT} of ${c.dosesN} doses (${Math.round(c.adh * 100)}%)`;
    $('#rpAdh').innerHTML = r.days.map((d, i) => {
      const n = d.meds.filter(m => m === 1).length, miss = d.meds.includes(0), h = n / 2 * 40;
      return `<rect x="${i * 43 + 6}" y="4" width="30" height="40" rx="6" fill="#F1F4F7"/><rect class="br" x="${i * 43 + 6}" y="${44 - h}" width="30" height="${h}" rx="6" fill="${miss ? '#E7000B' : '#8EC8E8'}"/><text x="${i * 43 + 21}" y="58" text-anchor="middle" font-size="10" fill="#5D646F" font-family="Inter,sans-serif">${d.d}</text>`;
    }).join('');
    // cognition
    const cs = r.days.map(d => d.cog); let lc = cs.find(v => v !== null) || 8; const cf = cs.map(v => (v === null ? lc : (lc = v)));
    const cpts = cf.map((v, i) => [10 + i * 46.7, 54 - (v - 4) / 6 * 46]);
    $('#rpC').textContent = c.cogAvg ? `avg ${c.cogAvg.toFixed(1)} / 10` : '';
    $('#rpCog').innerHTML = `<path d="M0 58H300" stroke="#EEF1F4"/><path class="ln" d="${cpts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}" fill="none" stroke="#B8902F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${cpts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#B8902F"/>`).join('')}`;
    $('#rpFlags').innerHTML = r.flags.slice(0, 4).map(f => `<p class="rp-flag${f.hot ? ' hot' : ''}"><span>${f.hot ? '⚑ ' : '✓ '}${f.t}</span></p>`).join('');
    if (!anim) { $$('#rpFlags .hot').forEach(f => f.style.setProperty('--hl', 1)); return; }
    const tl = G.timeline();
    $$('#sheet .ln').forEach((p, i) => { const L = p.getTotalLength(); tl.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, i * 0.5); });
    tl.from('#sheet circle', { scale: 0, transformOrigin: 'center', duration: 0.4, stagger: 0.03, ease: 'back.out(3)' }, 0.4);
    tl.from('#rpAdh .br', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, stagger: 0.07, ease: 'elastic.out(1,0.6)' }, 0.3);
    $$('#rpFlags .hot').forEach((f, i) => tl.add(() => f.style.setProperty('--hl', 1), 1.4 + i * 0.35));
    return tl;
  }
  function reportSetup() {
    const env = $('#env'), sheet = $('#sheet'), bot = $('#sheetBot');
    if (window.CareloDemo) window.CareloDemo.onUpdate(() => { if (reportShown) renderReport(false); });
    if (RM) { G.set(['#envFlap', '#envSeal', '.env-front', '.env-back'], { opacity: 0 }); renderReport(false); reportShown = true; return; }
    // wrap the sheet so it appears to slide out of the envelope
    const clip = document.createElement('div');
    Object.assign(clip.style, { position: 'absolute', left: '-40px', right: '-40px', bottom: '26px', height: '900px', overflow: 'hidden', zIndex: 3, perspective: '1600px' });
    env.insertBefore(clip, sheet); clip.appendChild(sheet);
    G.set(sheet, { bottom: 0 });
    renderReport(false);
    $$('#rpFlags .hot').forEach(f => f.style.setProperty('--hl', 0));
    const H = sheet.offsetHeight, topH = $('.sheet-top', sheet).offsetHeight;
    G.set(bot, { rotationX: -178, transformOrigin: '50% 0%', opacity: 0 });
    G.set(sheet, { y: H + 10 });
    ST.create({
      trigger: '#envStage', start: 'top 62%', once: true,
      onEnter: () => {
        const tl = G.timeline({ defaults: { ease: 'expo.out' } });
        tl.to('#envSeal', { scale: 0, rotation: 90, opacity: 0, duration: 0.6, ease: 'back.in(2)' })
          .to('#envFlap', { rotationX: 180, duration: 1, ease: 'power3.inOut' }, '-=0.15')
          .set('#envFlap', { zIndex: 1 })
          .to(sheet, { y: H - topH - 110, duration: 1.1 }, '-=0.25')
          .to(sheet, { y: Math.max(0, H - topH - 290), duration: 0.8, ease: 'power3.inOut' })
          .set(clip, { overflow: 'visible', zIndex: 7 })
          .to(sheet, { y: 0, duration: 0.9, ease: 'power3.inOut' })
          .to(['.env-front', '.env-back', '#envFlap'], { y: 140, opacity: 0, duration: 1, ease: 'power3.in' }, '<')
          .to(bot, { rotationX: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.5')
          .add(() => { reportShown = true; renderReport(true); }, '-=0.6');
      },
    });
  }

  /* ================= SETUP ================= */
  function typeCode(delay = 0) {
    const boxes = $$('#codeBoxes span'); const code = '48213';
    boxes.forEach(b => { b.textContent = ''; b.classList.remove('f'); });
    const tl = G.timeline({ delay });
    boxes.forEach((b, i) => tl.add(() => { b.textContent = code[i]; b.classList.add('f'); }, i * 0.38).fromTo(b, { y: -12, scale: 1.25 }, { y: 0, scale: 1, duration: 0.6, ease: 'back.out(3)' }, i * 0.38));
    return tl;
  }
  function tapRing() {
    if (RM) return;
    G.fromTo('#tapRing', { scale: 0.6, opacity: 1 }, { scale: 1.7, opacity: 0, duration: 1.4, ease: 'power2.out', repeat: -1 });
  }

  /* ================= WHY ================= */
  function costChart() {
    const svg = $('#costChart');
    const base = 300, top = 30, max = 2500, h = v => (v / max) * (base - top);
    const bars = [
      { name: 'GrandCare', v: 1795, hi: 2500, lbl: '~$1,795*', x: 110 },
      { name: 'CarePredict', v: 449, hi: 499, lbl: '~$449–$499*', x: 270 },
      { name: 'Carelo', v: 0, hi: 0, lbl: '$0', x: 430, us: true },
    ];
    let s = '';
    [0, 500, 1000, 1500, 2000, 2500].forEach(t => { const y = base - h(t); s += `<line class="axis" x1="70" x2="550" y1="${y}" y2="${y}" ${t ? 'stroke-dasharray="2 5"' : ''}/><text class="grid-t" x="60" y="${y + 4}" text-anchor="end">$${t.toLocaleString()}</text>`; });
    bars.forEach((b, i) => {
      if (b.us) {
        s += `<rect class="bar-us" x="${b.x - 50}" y="${base - 4}" width="100" height="8" rx="4" fill="#8EC8E8"/><circle class="us-glow" cx="${b.x}" cy="${base}" r="30" fill="url(#pg-ok)" opacity="0"/>`;
        s += `<text class="val us-val" x="${b.x}" y="${base - 18}" text-anchor="middle" style="font-size:24px;font-family:var(--font-display);fill:var(--teal)">${b.lbl}</text>`;
      } else {
        s += `<rect class="bar-hi" data-i="${i}" x="${b.x - 50}" y="${base - h(b.hi)}" width="100" height="${h(b.hi)}" rx="10" fill="#DBB155" opacity=".25"/>`;
        s += `<rect class="bar" data-i="${i}" x="${b.x - 50}" y="${base - h(b.v)}" width="100" height="${h(b.v)}" rx="10" fill="#DBB155" opacity=".85"/>`;
        s += `<text class="val" x="${b.x}" y="${base - h(b.hi) - 10}" text-anchor="middle">${b.lbl}</text>`;
      }
      s += `<text class="lbl" x="${b.x}" y="${base + 26}" text-anchor="middle"${b.us ? ' style="fill:var(--teal)"' : ''}>${b.name}</text>`;
    });
    s += `<text class="grid-t" x="110" y="${base - h(2500) - 28}" text-anchor="middle">lighter: with sensors</text>`;
    svg.insertAdjacentHTML('beforeend', s);
  }
  function whyAnim() {
    if (RM) return;
    const tl = G.timeline({ scrollTrigger: { trigger: '#costChart', start: 'top 70%', once: true } });
    tl.from('#costChart .bar-hi, #costChart .bar', { scaleY: 0, transformOrigin: '50% 100%', duration: 1.4, ease: 'expo.out', stagger: 0.15 })
      .from('#costChart .val:not(.us-val)', { opacity: 0, y: 10, duration: 0.6, stagger: 0.15 }, '-=0.9')
      .from('#costChart .bar-us', { scaleX: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'expo.out' }, '+=0.1')
      .from('#costChart .us-val', { opacity: 0, y: 14, scale: 0.6, transformOrigin: '50% 100%', duration: 0.9, ease: 'back.out(3)' }, '-=0.4')
      .fromTo('#costChart .us-glow', { opacity: 0.9, scale: 0.4, transformOrigin: 'center' }, { opacity: 0, scale: 2, duration: 1.4, ease: 'power2.out' }, '-=0.6');
    const rows = $$('#cmp tbody tr');
    const tl2 = G.timeline({ scrollTrigger: { trigger: '#cmp', start: 'top 75%', once: true } });
    tl2.from('#cmp thead th', { opacity: 0, y: -10, duration: 0.5, stagger: 0.05 });
    rows.forEach((r, i) => { tl2.from(r, { opacity: 0, x: -24, duration: 0.6 }, 0.2 + i * 0.12); const y = r.querySelector('.yes'); if (y) tl2.from(y, { scale: 0, duration: 0.7, ease: 'back.out(3.5)' }, 0.45 + i * 0.12); });
  }

  /* ================= PRICING ================= */
  function pricing() {
    const cards = $$('#qStack .q-card'), ans = [];
    const LABELS = [{ 1: 'One loved one', 2: 'Two or more' }, { apple: 'Apple Watch', other: 'Another brand', none: 'No watch' }, { m: 'Monthly', y: 'Yearly' }];
    const stackPos = i => ({ y: i * 16, scale: 1 - i * 0.05, opacity: i < 3 ? 1 : 0 });
    function layout(instant) {
      cards.forEach((c, i) => {
        const pos = i - ans.length;
        if (i < ans.length) return;
        c.style.zIndex = 10 - pos;
        c.inert = pos !== 0;
        const t = stackPos(pos);
        if (instant || RM) G.set(c, { ...t, x: 0, rotationY: 0, rotation: 0 }); else G.to(c, { ...t, x: 0, rotation: 0, duration: 0.9, ease: 'power3.out' });
      });
    }
    layout(true);
    $('#qStack').addEventListener('click', e => {
      const b = e.target.closest('.q-opt'); if (!b) return;
      const card = b.closest('.q-card'); const qi = +card.dataset.q; if (qi !== ans.length) return;
      ans.push(b.dataset.v);
      card.querySelector('.q-ans').textContent = LABELS[qi][b.dataset.v];
      card.inert = true;
      const n = ans.length - 1;
      const pile = { scale: 0.55, x: -card.offsetWidth * 0.225, y: 300 - 150 + 300 * 0.275 + n * 50, rotation: n % 2 ? 1.5 : -1.5, zIndex: 20 + n };
      if (RM) G.set(card, { rotationY: 180, transformOrigin: '50% 50%', ...pile });
      else G.timeline().to(card, { rotationY: 180, transformOrigin: '50% 50%', duration: 0.8, ease: 'power3.inOut' }).to(card, { ...pile, duration: 0.9, ease: 'power3.inOut' }, '+=0.25');
      layout();
      const nextCard = cards[ans.length]; if (nextCard) setTimeout(() => { const f = nextCard.querySelector('.q-opt'); if (f) f.focus({ preventScroll: true }); }, 400);
      $('#finderStatus').textContent = ans.length < 3 ? `Question ${ans.length + 1} of 3` : 'Your recommendation';
      if (ans.length === 3) setTimeout(() => recommend(ans), RM ? 0 : 900);
    });
    function recommend(a) {
      const plan = a[0] === '2' ? 'family' : a[2] === 'y' ? 'annual' : 'individual';
      const names = { family: 'Family · $19.99/month', annual: 'Annual · $10/month, billed yearly', individual: 'Individual · $12.99/month' };
      const watch = { apple: 'Apple Watch data flows in through Apple Health on her iPhone.', other: 'Fitbit and Galaxy Watch support is planned for Phase 2. Until then, Carelo uses her phone\'s own health data.', none: 'No watch needed. Her phone already counts steps and activity.' }[a[1]];
      const extra = plan === 'family' && a[2] === 'y' ? ' Ask us about yearly billing for families.' : '';
      $('#finderTitle').textContent = names[plan];
      $('#finderNote').textContent = watch + extra;
      $('#finderReset').hidden = false;
      const plans = $('#plans'); plans.classList.add('chosen');
      $$('.plan', plans).forEach(p => p.classList.toggle('rec', p.dataset.plan === plan));
      if (!RM) G.fromTo('#finderTitle', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 });
    }
    $('#finderReset').addEventListener('click', () => {
      ans.length = 0;
      cards.forEach(c => { c.inert = false; G.set(c, { clearProps: 'transform,zIndex' }); });
      layout(true);
      $('#plans').classList.remove('chosen'); $$('.plan').forEach(p => p.classList.remove('rec'));
      $('#finderStatus').textContent = 'Answer the questions to see your plan';
      $('#finderTitle').textContent = 'Your recommendation will appear here.';
      $('#finderNote').textContent = 'Your answers stay on this page.';
      $('#finderReset').hidden = true;
      cards[0].querySelector('.q-opt').focus();
    });
  }

  /* ================= FOUNDERS: DFW map ================= */
  const TX = [[-106.6, 32], [-103.06, 32], [-103.04, 36.5], [-100, 36.5], [-100, 34.56], [-99.4, 34.4], [-98.5, 34.1], [-97.6, 33.9], [-96.6, 33.85], [-95.3, 33.88], [-94.48, 33.64], [-94.04, 33.55], [-94.04, 31], [-93.6, 30.2], [-93.84, 29.7], [-94.7, 29.4], [-95.1, 29.1], [-96.6, 28.3], [-97.2, 27.6], [-97.4, 26], [-97.15, 25.95], [-98.3, 26.1], [-99.1, 26.4], [-99.5, 27.5], [-100.3, 28.3], [-100.9, 29.4], [-101.4, 29.77], [-102.4, 29.8], [-103.1, 29], [-104.5, 29.7], [-104.9, 30.6], [-106, 31.4]];
  const tp = (lon, lat) => [(lon + 107) * 85.7, (37 - lat) * 100];
  const CITIES = [['Frisco', -96.82, 33.15, 'end', -5], ['McKinney', -96.62, 33.2, 'start', 5], ['Allen', -96.67, 33.1, 'start', 5], ['Plano', -96.7, 33.02, 'start', 5]];
  function dfw() {
    const svg = $('#dfwSvg');
    const d = TX.map((p, i) => (i ? 'L' : 'M') + tp(...p).map(v => v.toFixed(1)).join(' ')).join(' ') + 'Z';
    const line = pts => pts.map((p, i) => (i ? 'L' : 'M') + tp(...p).map(v => v.toFixed(1)).join(' ')).join(' ');
    const roads = [
      [[-96.8, 32.7], [-96.77, 32.95], [-96.7, 33.05], [-96.64, 33.15], [-96.61, 33.3]],
      [[-96.82, 32.8], [-96.83, 33.0], [-96.82, 33.2], [-96.8, 33.32]],
      [[-97.0, 33.07], [-96.85, 33.1], [-96.7, 33.12], [-96.6, 33.18], [-96.5, 33.2]],
      [[-97.45, 32.75], [-97.1, 32.76], [-96.8, 32.78], [-96.5, 32.8]],
      [[-96.98, 32.6], [-96.97, 32.9], [-97.0, 33.2]],
    ];
    const [lx, ly] = tp(-96.52, 33.05), [wx, wy] = tp(-96.99, 33.08), [dx, dy] = tp(-96.8, 32.78), [fx, fy] = tp(-97.33, 32.75), [ccx, ccy] = tp(-96.75, 33.0);
    let s = `<path class="tx" d="${d}"/>`;
    s += `<ellipse class="lake" cx="${lx}" cy="${ly}" rx="3" ry="5"/><ellipse class="lake" cx="${wx}" cy="${wy}" rx="4.5" ry="3"/>`;
    s += roads.map(r => `<path class="road" d="${line(r)}"/>`).join('');
    s += `<circle id="dfwPing" cx="${ccx}" cy="${ccy}" r="20" fill="none" stroke="#DBB155" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
    s += `<g class="zl" opacity="0"><circle cx="${dx}" cy="${dy}" r="1.3" fill="#5D646F"/><text class="ref-lbl" x="${dx + 2.5}" y="${dy + 1.2}" font-size="3.4">Dallas</text><circle cx="${fx}" cy="${fy}" r="1.3" fill="#5D646F"/><text class="ref-lbl" x="${fx + 2.5}" y="${fy + 1.2}" font-size="3.4">Fort Worth</text></g>`;
    CITIES.forEach(([n, lo, la, anc, off]) => {
      const [x, y] = tp(lo, la);
      s += `<g class="pin" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="pin-in"><ellipse cx="0" cy="0.4" rx="1.6" ry=".6" fill="rgba(0,0,0,.18)"/><path d="M0 0c-1.9-2.3-3-3.9-3-5.3a3 3 0 1 1 6 0c0 1.4-1.1 3-3 5.3z" fill="#DBB155" stroke="#fff" stroke-width=".5"/><circle cx="0" cy="-5.3" r="1.1" fill="#fff"/></g><text class="city-lbl" x="${off}" y="-4" font-size="3.6" text-anchor="${anc}">${n}</text></g>`;
    });
    svg.innerHTML = s;
    const zoomBox = [818, 352, 96, 96];
    if (RM) { svg.setAttribute('viewBox', zoomBox.join(' ')); G.set('.zl', { opacity: 1 }); G.set('#dfwPing', { opacity: 0 }); return; }
    G.set('#dfwSvg .pin-in', { y: -26, opacity: 0 }); G.set('#dfwSvg .city-lbl', { opacity: 0 });
    G.set(['.founder', '.traction > div'], { opacity: 0, x: 30 }); G.set('#award', { rotation: -24, opacity: 0 });
    const vb = { x: 0, y: 0, w: 1160, h: 1120 };
    const tl = G.timeline({ scrollTrigger: { trigger: '#founders', start: 'top 62%', once: true } });
    tl.fromTo('#dfwPing', { scale: 0.6, opacity: 1, transformOrigin: 'center' }, { scale: 2.2, opacity: 0, duration: 1, ease: 'power2.out', repeat: 1 })
      .to(vb, { x: zoomBox[0], y: zoomBox[1], w: zoomBox[2], h: zoomBox[3], duration: 2.2, ease: 'expo.inOut', onUpdate: () => svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`) }, 0.4)
      .to('.zl', { opacity: 1, duration: 0.6 }, '-=0.5')
      .to('#dfwSvg .pin-in', { y: 0, opacity: 1, duration: 0.9, ease: 'bounce.out', stagger: 0.18 }, '-=0.3')
      .to('#dfwSvg .city-lbl', { opacity: 1, duration: 0.5, stagger: 0.18 }, '<0.3');
    const cnt = { v: 0 }; const el = $('#famCount'); el.textContent = '0';
    tl.to(cnt, { v: 10, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(cnt.v); } }, '-=1.2');
    tl.to('.traction > div', { opacity: 1, x: 0, duration: 0.9, stagger: 0.08 }, 0.6)
      .to('.founder', { opacity: 1, x: 0, duration: 1.1, ease: 'expo.out', stagger: 0.15 }, 1)
      .to('#award', { opacity: 1, duration: 0.3 }, 1.6)
      .to('#award', { rotation: 0, duration: 2, ease: 'elastic.out(1.1,0.3)' }, 1.6);
  }

  /* ================= ROADMAP ================= */
  function roadmap() {
    const phases = $$('#road .phase');
    if (RM) { phases.forEach(p => p.classList.add('lit')); return; }
    const lit = new Array(phases.length).fill(false);
    Thread.onDraw(len => {
      phases.forEach((p, i) => {
        const a = $('.ta', p); if (!a.dataset.len) return;
        const on = len >= +a.dataset.len;
        if (on !== lit[i]) {
          lit[i] = on; p.classList.toggle('lit', on);
          if (on) { G.fromTo($('.p-node', p), { scale: 1.6 }, { scale: 1, duration: 1, ease: 'elastic.out(1,0.4)' }); Thread.pulse(Math.max(0, +a.dataset.len - 500), +a.dataset.len, false, 0.9); }
        }
      });
    });
  }
  function roadmapLens() {
    $$('#road .ta').forEach(a => { const r = a.getBoundingClientRect(); a.dataset.len = Thread.nearest(isMobile() ? 16 : r.left + scrollX, r.top + scrollY); });
  }

  /* ================= CTA ================= */
  function cta() {
    const line = $('#hLine'), fill = $('#hFill');
    const L = line.getTotalLength();
    if (RM) { G.set(fill, { opacity: 0.6 }); }
    else {
      G.set(line, { strokeDasharray: L, strokeDashoffset: L });
      const tl = G.timeline({ scrollTrigger: { trigger: '#heartStage', start: 'top 70%', once: true } });
      tl.to(line, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
        .to(fill, { opacity: 0.6, duration: 1 }, '-=0.6')
        .add(() => G.timeline({ repeat: -1, repeatDelay: 0.9 }).to('#heartBeat', { scale: 1.035, duration: 0.18, ease: 'power2.out' }).to('#heartBeat', { scale: 1, duration: 0.35, ease: 'power2.inOut' }).to('#heartBeat', { scale: 1.02, duration: 0.16, ease: 'power2.out' }).to('#heartBeat', { scale: 1, duration: 0.5, ease: 'power2.inOut' }));
    }
    const form = $('#wlForm'), email = $('#wlEmail'), err = $('#wlErr');
    email.addEventListener('input', () => { if (email.getAttribute('aria-invalid') === 'true') { email.removeAttribute('aria-invalid'); err.textContent = ''; } });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = email.value.trim();
      let msg = '';
      if (!v) msg = 'Enter your email so we can tell you when Carelo launches.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'That email doesn\'t look right. Check for a missing @ or dot.';
      if (msg) { err.textContent = msg; email.setAttribute('aria-invalid', 'true'); email.focus(); if (!RM) G.fromTo(form, { x: 0 }, { x: 8, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' }); return; }
      done();
    });
    function done() {
      const stage = $('#doneStage');
      const show = () => {
        form.hidden = true; stage.classList.add('on');
        const sen = $('#doneSen'), car = $('#doneCar'), path = $('#donePath'), dot = $('#doneDot');
        const r0 = stage.getBoundingClientRect(), a = sen.getBoundingClientRect(), b = car.getBoundingClientRect();
        const ax = a.right - r0.left, ay = a.top - r0.top + a.height * 0.45, bx = b.left - r0.left, by = b.top - r0.top + b.height * 0.25;
        path.setAttribute('d', `M${ax} ${ay} C ${ax + 60} ${ay + 70}, ${bx - 60} ${by + 70}, ${bx} ${by}`);
        if (RM) return;
        G.from([sen, car], { y: 80, opacity: 0, duration: 1.4, ease: 'elastic.out(1,0.75)', stagger: 0.15 });
        G.from('#doneCar .notif', { yPercent: -150, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', delay: 2.1 });
        const Lp = path.getTotalLength(), o = { t: 0 };
        G.to(o, { t: 1, delay: 1.2, duration: 1.1, ease: 'power2.inOut', onStart: () => G.set(dot, { opacity: 1 }), onUpdate: () => { const q = path.getPointAtLength(o.t * Lp); dot.setAttribute('cx', q.x); dot.setAttribute('cy', q.y); }, onComplete: () => G.to(dot, { opacity: 0, duration: 0.4 }) });
      };
      if (RM) { show(); return; }
      G.to(form, { opacity: 0, y: -20, duration: 0.5, onComplete: show });
      G.to('.heart-svg', { opacity: 0.25, duration: 0.8 });
      const hs = $('#heartStage').getBoundingClientRect();
      Thread.pulseY(scrollY + hs.top - 900, scrollY + hs.top + 140, false, 1.6);
    }
  }

  /* ================= DEMO glue ================= */
  function demoGlue() {
    addEventListener('carelo:pulse', e => {
      const st = $('#demoStage').getBoundingClientRect();
      Thread.pulseY(scrollY + st.top, scrollY + st.bottom, e.detail && e.detail.bad, 1.2);
    });
    if (RM) return;
    G.from(['#dcSen', '#dcCar'], { y: 80, opacity: 0, duration: 1.5, ease: 'elastic.out(1,0.8)', stagger: 0.15, scrollTrigger: { trigger: '#demoStage', start: 'top 80%', once: true } });
  }

  /* ================= generic reveals ================= */
  function reveals() {
    if (RM) {
      $$('.sec-head, .report-copy, .demo-head, .phase, .plan').forEach(el => G.from(el, { opacity: 0, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
      return;
    }
    $$('.sec-head, .report-copy, .demo-head, .worlds-head').forEach(el => {
      G.from(el.children, { opacity: 0, y: 34, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
    });
    G.from('.plan', { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '#plans', start: 'top 85%', once: true } });
    G.from('.q-stack', { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.q-stack', start: 'top 85%', once: true } });
    $$('.p-card').forEach(c => G.from(c, { y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%', once: true } }));
  }

  /* ================= responsive pins ================= */
  function pins() {
    const mm = G.matchMedia();
    // Problem: pinned stat carousel
    mm.add({ big: '(min-width:861px)', small: '(max-width:860px)', rm: '(prefers-reduced-motion: reduce)' }, ctx => {
      const { small, rm } = ctx.conditions;
      if (rm) return;
      const sec = $('#problem');
      if (small && innerHeight < 560) return;
      sec.classList.add('pinned');
      const stats = $$('.stat', sec), bars = $$('.stat-steps i', sec);
      stats.forEach(s => { const c = $('.count', s); c.textContent = '0'; });
      G.set(stats, { opacity: 0, y: 40 });
      G.set('#usArcs .pair circle', { scale: 0 });
      $$('#usArcs .pair path').forEach(p => { p.style.strokeDashoffset = p.dataset.len; });
      const tl = G.timeline({ scrollTrigger: { trigger: '.problem-stage', start: 'top top', end: '+=2600', pin: true, scrub: 0.8, anticipatePin: 1 } });
      stats.forEach((s, i) => {
        const at = i * 3;
        tl.to(s, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at);
        countTo($('.count', s), tl, at + 0.1, 1.4);
        tl.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: 2.6, ease: 'none' }, at);
        arcsTween(tl, i, at + 0.1);
        if (i < stats.length - 1) tl.to(s, { opacity: 0, y: -40, duration: 0.7, ease: 'power3.in' }, at + 2.3);
      });
      tl.to({}, { duration: 0.6 });
      return () => { sec.classList.remove('pinned'); G.set(stats, { clearProps: 'all' }); stats.forEach(s => { const c = $('.count', s); c.textContent = (+c.dataset.to).toFixed(+c.dataset.dec || 0); }); };
    });
    // reduced-motion or small: show stats/arcs statically
    if (RM) { G.set('#usArcs .pair circle', { scale: 1 }); }

    // Two worlds: pinned wipe (desktop only)
    mm.add('(min-width:861px) and (min-height:620px) and (prefers-reduced-motion: no-preference)', () => {
      const sec = $('#two-worlds'); sec.classList.add('pinned');
      const ms = $$('.moment', sec), sweep = $('#wSweep'), clock = $('#wClock'), box = $('#moments');
      ms.forEach((m, i) => { m.style.zIndex = i + 1; if (i) G.set(m, { clipPath: 'inset(0% 100% 0% 0% round 32px)' }); });
      G.set('.moment .chk', { scale: 0 });
      G.set(ms[0].querySelector('.chk'), { scale: 1 });
      const tl = G.timeline({ scrollTrigger: { trigger: '.worlds-stage', start: 'top top', end: () => '+=' + (ms.length - 1) * 950, pin: true, scrub: 0.9, anticipatePin: 1 } });
      ms.forEach((m, i) => {
        if (!i) return;
        const at = (i - 1) * 2 + 0.6;
        const left = () => parseFloat(getComputedStyle(m).left) || 0;
        const W = () => m.offsetWidth;
        tl.set(sweep, { opacity: 1 }, at)
          .fromTo(m, { clipPath: 'inset(0% 100% 0% 0% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.2, ease: 'power2.inOut' }, at)
          .fromTo(sweep, { x: () => left() }, { x: () => left() + W(), duration: 1.2, ease: 'power2.inOut' }, at)
          .set(sweep, { opacity: 0 }, at + 1.2)
          .add(() => { clock.textContent = tl.scrollTrigger && tl.scrollTrigger.direction < 0 ? ms[i - 1].dataset.time : m.dataset.time; }, at + 0.6)
          .fromTo(m.querySelector('.chk'), { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, at + 1.05);
      });
      tl.to({}, { duration: 0.5 });
      return () => { sec.classList.remove('pinned'); ms.forEach(m => { m.style.zIndex = ''; G.set(m, { clearProps: 'clipPath' }); }); G.set('.moment .chk', { clearProps: 'all' }); };
    });
    mm.add('(max-width:860px), (max-height:619px)', () => {
      if (RM) return;
      $$('.moment').forEach(m => G.from(m, { opacity: 0, y: 50, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: m, start: 'top 85%', once: true } }));
    });

    // Setup: horizontal scroll (desktop)
    mm.add('(min-width:861px) and (prefers-reduced-motion: no-preference)', () => {
      const sec = $('#setup'); sec.classList.add('pinned');
      const track = $('#setupTrack'), dots = $$('#setupProg li');
      const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth + 80);
      const tween = G.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#setupStage', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: s => { const k = Math.min(4, Math.round(s.progress * 4)); dots.forEach((d, i) => d.classList.toggle('on', i <= k)); } } });
      const steps = $$('#setupTrack .step');
      ST.create({ trigger: steps[3], containerAnimation: tween, start: 'left 75%', onEnter: () => typeCode(0.1), onEnterBack: () => typeCode(0) });
      $$('.step .phone').forEach(p => G.from(p, { y: 40, rotation: 3, duration: 1.2, ease: 'elastic.out(1,0.8)', scrollTrigger: { trigger: p.closest('.step'), containerAnimation: tween, start: 'left 90%', once: true } }));
      return () => { sec.classList.remove('pinned'); G.set(track, { clearProps: 'x' }); };
    });
    mm.add('(max-width:860px), (prefers-reduced-motion: reduce)', () => {
      const track = $('#setupTrack'), dots = $$('#setupProg li');
      const onScroll = () => { const k = Math.round(track.scrollLeft / (track.scrollWidth - track.clientWidth || 1) * 4); dots.forEach((d, i) => d.classList.toggle('on', i <= k)); };
      track.addEventListener('scroll', onScroll, { passive: true });
      if (RM) { $$('#codeBoxes span').forEach((b, i) => { b.textContent = '48213'[i]; b.classList.add('f'); }); }
      else ST.create({ trigger: '#setupTrack', start: 'top 75%', once: true, onEnter: () => typeCode(0.6) });
      return () => track.removeEventListener('scroll', onScroll);
    });
  }

  /* ================= boot ================= */
  function boot() {
    heroPrep();
    drawMap();
    costChart();
    featureSetup();
    reportSetup();
    whyAnim();
    pricing();
    dfw();
    roadmap();
    cta();
    demoGlue();
    reveals();
    pins();
    tapRing();
    if (RM) { $$('.stat .count').forEach(c => { c.textContent = (+c.dataset.to).toFixed(+c.dataset.dec || 0); }); G.set('#usArcs .pair circle', { scale: 1 }); }
    const rebuild = () => { Thread.build(); roadmapLens(); Thread.update(true); };
    ST.addEventListener('refresh', rebuild);
    ST.refresh();
    ST.create({ start: 0, end: 'max', onUpdate: () => Thread.update() });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ST.refresh());
    let rt; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => ST.refresh(), 250); }).observe(document.body);
    opening().then(heroIntro);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
