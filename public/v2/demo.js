/* Carelo live demo: two working phones sharing one state. Sample data only. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = window.gsap;
  const ic = (n, st) => `<svg class="ic"${st ? ` style="${st}"` : ''} aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const fmtH = h => { let hh = Math.floor(h), mm = Math.round((h - hh) * 60); if (mm === 60) { hh++; mm = 0; } const ap = hh >= 12 && hh < 24 ? 'PM' : 'AM'; return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${ap}`; };
  const shortH = h => fmtH(h).replace(/ (AM|PM)/, '');
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const listeners = [];

  const MEDS = [
    { due: 8, label: 'Morning medicine', name: 'Lisinopril 10 mg', key: 'm0' },
    { due: 20, label: 'Evening medicine', name: 'Atorvastatin 20 mg', key: 'm1' },
  ];
  const NEXT_WEEK = [
    { d: 'Wed', meds: [1, 1], check: 1, cog: 8, w: 152.2 },
    { d: 'Thu', meds: [1, 1], check: 1, cog: 9, w: 151.8 },
    { d: 'Fri', meds: [1, 0], check: 1, cog: 8, w: 151.5 },
    { d: 'Sat', meds: [1, 1], check: 1, cog: 8, w: 151.0 },
    { d: 'Sun', meds: [1, 1], check: 1, cog: 9, w: 150.4 },
    { d: 'Mon', meds: [1, 1], check: 0, cog: 8, w: 149.9 },
    { d: 'Tue', meds: [1, 1], check: 1, cog: 8, w: 149.4 },
  ];

  function base() {
    return {
      days: [
        { d: 'Wed', meds: [1, 1], check: 1, cog: 8, w: 153.0 },
        { d: 'Thu', meds: [1, 0], check: 1, cog: 8, w: 152.8 },
        { d: 'Fri', meds: [1, 1], check: 0, cog: 8, w: 152.9 },
        { d: 'Sat', meds: [1, 1], check: 1, cog: 8, w: 152.6 },
        { d: 'Sun', meds: [0, 1], check: 1, cog: 8, w: 152.7 },
        { d: 'Mon', meds: [1, 1], check: 1, cog: 7, w: 152.5 },
        { d: 'Tue', meds: [null, null], check: null, cog: null, w: null },
      ],
      times: {},
      alerts: [
        { bad: false, t: 'Yesterday went well', s: 'Both doses, check-in and memory game done' },
        { bad: true, t: 'Missed morning medicine · Sunday', s: 'No response within 30 minutes' },
      ],
      clock: 8 + 6 / 60,
      view: 'home',
      busy: false,
      ffDone: false,
      week: 'This week (sample)',
    };
  }
  let S = base();
  let game = null;
  let missTween = null;
  const today = () => S.days[6];

  /* ---------- score ---------- */
  function components(days = S.days) {
    let dosesT = 0, dosesN = 0, chkT = 0, chkN = 0, cogS = 0, cogN = 0;
    const ws = [];
    days.forEach(d => {
      d.meds.forEach(m => { if (m !== null) { dosesN++; dosesT += m; } });
      if (d.check !== null) { chkN++; chkT += d.check; }
      if (d.cog !== null) { cogN++; cogS += d.cog; }
      if (d.w !== null) ws.push(d.w);
    });
    const adh = dosesN ? dosesT / dosesN : 1;
    const chk = chkN ? chkT / chkN : 1;
    const cog = cogN ? cogS / cogN / 10 : 0.8;
    const wChange = ws.length > 1 ? (ws[ws.length - 1] - ws[0]) : 0;
    const wPct = ws.length > 1 ? Math.abs(wChange) / ws[0] * 100 : 0;
    const stab = wPct <= 1.5 ? 1 : Math.max(0, 1 - (wPct - 1.5) / 3.5);
    const score = Math.round(100 * (0.35 * adh + 0.25 * chk + 0.2 * cog + 0.2 * stab));
    return { adh, chk, cog, stab, score, dosesT, dosesN, chkT, chkN, cogAvg: cogN ? cogS / cogN : null, wChange, wPct, ws };
  }

  /* ---------- pulses / notifications ---------- */
  const bridgePath = $('#bridgePath');
  function pulse(bad) {
    window.dispatchEvent(new CustomEvent('carelo:pulse', { detail: { bad } }));
    const mobile = matchMedia('(max-width:860px)').matches;
    if (mobile) {
      const b = $('#carBadge');
      if (b && $('#tabCar').getAttribute('aria-selected') !== 'true') {
        b.style.background = bad ? 'var(--alert)' : 'var(--sage-ink)';
        if (G && !RM) G.fromTo(b, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(3)' }); else b.style.opacity = 1;
      }
      return;
    }
    if (!G || !bridgePath) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('r', 11); dot.setAttribute('fill', `url(#${bad ? 'pg-bad' : 'pg-ok'})`);
    $('#bridgeDots').appendChild(dot);
    const L = bridgePath.getTotalLength();
    const o = { t: 0 };
    if (RM) { const p = bridgePath.getPointAtLength(L); dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); G.fromTo(dot, { opacity: 1 }, { opacity: 0, duration: 0.8, onComplete: () => dot.remove() }); return; }
    G.to(o, { t: 1, duration: 1.1, ease: 'power2.inOut', onUpdate() { const p = bridgePath.getPointAtLength(o.t * L); dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); }, onComplete() { G.to(dot, { opacity: 0, duration: 0.4, onComplete: () => dot.remove() }); } });
  }
  let notifT = null;
  function notify(text, bad, delay = 950) {
    setTimeout(() => {
      const n = $('#cNotif');
      $('#cNotifTxt').textContent = text;
      n.classList.toggle('alert', !!bad);
      n.querySelector('use').setAttribute('href', bad ? '#i-alert' : '#i-check');
      clearTimeout(notifT);
      if (G && !RM) {
        G.fromTo(n, { yPercent: -220, opacity: 0 }, { yPercent: 0, y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' });
        notifT = setTimeout(() => G.to(n, { yPercent: -220, opacity: 0, duration: 0.7, ease: 'power3.in' }), 3400);
      } else { n.style.transform = 'none'; n.style.opacity = 1; notifT = setTimeout(() => { n.style.opacity = 0; }, 3400); }
      if (bad) { const p = $('#cPhone'); p.classList.remove('shake'); void p.offsetWidth; if (!RM) p.classList.add('shake'); }
      updateCare(true);
    }, delay);
    pulse(bad);
  }
  function addAlert(a) { S.alerts.unshift(a); S.alerts = S.alerts.slice(0, 4); }
  function tick(min) { S.clock = Math.min(23.5, S.clock + min / 60); setClocks(); }
  function setClocks() { $('#sClock').textContent = shortH(S.clock); $('#cClock').textContent = shortH(S.clock); }
  function emit() { const r = getReport(); listeners.forEach(fn => { try { fn(r); } catch (e) { /* ignore */ } }); }

  /* ---------- senior views ---------- */
  const sView = $('#sView');
  function greeting() { return S.clock < 12 ? 'Good morning' : S.clock < 17 ? 'Good afternoon' : 'Good evening'; }
  function nextDose() { const t = today(); for (let i = 0; i < 2; i++) if (t.meds[i] === null) return i; return -1; }

  function renderSenior() {
    const t = today();
    let h = '';
    if (S.view === 'home') {
      const nd = nextDose();
      const due = nd >= 0 && MEDS[nd].due <= S.clock + 0.5;
      h = `<div class="sv sv-home">
        <p class="s-hello">${greeting()},<br>Meera</p>
        <div class="next-card">${due
          ? `<p>Your ${fmtH(MEDS[nd].due)} medicine<br><span style="font-weight:500;font-size:14px;color:var(--muted)">${MEDS[nd].name} · 1 tablet</span></p><button class="big-btn bb-ok" data-act="med" data-i="${nd}" aria-label="Took Medicine">${ic('check')}Took Medicine<span class="burst"></span></button>`
          : `<p style="display:flex;gap:10px;align-items:center">${ic('check', 'width:26px;height:26px;color:var(--sage-ink)')}${nd < 0 ? 'All medicine done today' : 'Medicine done for now'}</p><p style="font-weight:500;font-size:14px;color:var(--muted)">${nd < 0 ? 'Nothing else to take today.' : 'Next one at ' + fmtH(MEDS[nd].due) + '.'}</p>`}
        </div>
        <div class="tiles">
          <button class="tile${t.cog !== null ? ' done' : ''}" data-act="game">${ic('brain')}Brain game${t.cog !== null ? `<span class="tick">${ic('check')}</span>` : ''}</button>
          <button class="tile${t.w !== null ? ' done' : ''}" data-act="scan">${ic('camera')}Weigh myself${t.w !== null ? `<span class="tick">${ic('check')}</span>` : ''}</button>
          <button class="tile${t.check !== null ? ' done' : ''}" data-act="ok">${ic('shield')}I'm Okay${t.check === 1 ? `<span class="tick">${ic('check')}</span>` : ''}</button>
        </div></div>`;
    } else if (S.view === 'game') {
      h = `<div class="sv"><button class="back-btn" data-act="home">${ic('back')}Home</button>
        <p class="s-hello" style="font-size:24px">Find the matching pairs</p>
        <div class="mm-grid" id="mmGrid">${game.cards.map((c, i) => `<button class="mm-card" data-card="${i}" aria-label="Card ${i + 1}, face down"><span class="b">${ic('heart')}</span><span class="f">${ic(c.n)}</span></button>`).join('')}</div>
        <p class="s-sub" id="mmMsg" aria-live="polite">Tap two cards to turn them over.</p></div>`;
    } else if (S.view === 'result') {
      h = `<div class="sv" style="text-align:center;justify-content:center">
        ${ic('star', 'width:64px;height:64px;color:#DBB155;margin:0 auto')}
        <p class="s-hello">Well done, Meera!</p>
        <p class="s-sub" style="font-size:19px">You found all the pairs.<br>Score: <b>${t.cog} out of 10</b></p>
        <button class="big-btn bb-ok" data-act="home" style="min-height:96px;margin-top:20px">${ic('check')}Done</button></div>`;
    } else if (S.view === 'scan') {
      h = `<div class="sv"><button class="back-btn" data-act="home">${ic('back')}Home</button>
        <p class="s-hello" style="font-size:22px">Stand on your scale, then tap Scan</p>
        <div class="scan-view" style="height:250px"><div class="scale-art" style="top:52%"><div class="scale-lcd" id="dLcd">0.0</div><span class="scale-sticker"></span></div><div class="vf"><i></i><i></i><i></i><i></i></div><div class="scanline" id="dScan"></div></div>
        <button class="big-btn bb-med" data-act="doScan" style="min-height:84px;font-size:23px">${ic('camera', 'width:30px;height:30px')}Scan my scale</button></div>`;
    } else if (S.view === 'ok') {
      h = `<div class="sv" style="text-align:center;justify-content:center">
        <div style="width:120px;height:120px;border-radius:50%;background:var(--sage);display:grid;place-items:center;margin:0 auto;color:var(--teal-ink)" id="okBadge">${ic('check', 'width:60px;height:60px;stroke-width:3')}</div>
        <p class="s-hello">Thank you, Meera</p>
        <p class="s-sub" style="font-size:19px">Priya can see you're okay.</p>
        <button class="big-btn bb-ok" data-act="home" style="min-height:90px;margin-top:20px">Back to home</button></div>`;
    } else if (S.view === 'miss') {
      const m = MEDS[S.missIdx];
      h = `<div class="sv" style="text-align:center">
        <p class="s-sub" style="margin-top:6px">${fmtH(m.due)}</p>
        <p class="s-hello" style="font-size:25px">Time for your ${m.due < 12 ? 'morning' : 'evening'} medicine</p>
        <div class="ring-sm"><svg viewBox="0 0 100 100"><circle class="rt" cx="50" cy="50" r="42"/><circle class="rv" id="missRing" cx="50" cy="50" r="42" stroke-dasharray="263.9" stroke-dashoffset="0"/></svg><div id="missTxt">30 min<br>left</div></div>
        <p class="s-sub" style="font-size:14px">${m.name} · 1 tablet</p>
        <button class="big-btn bb-ok" data-act="med" data-i="${S.missIdx}" style="min-height:110px;margin-top:auto">${ic('check')}Took Medicine<span class="burst"></span></button></div>`;
    } else if (S.view === 'missed') {
      h = `<div class="sv" style="text-align:center">
        <div class="ring-sm" style="margin-top:20px"><svg viewBox="0 0 100 100"><circle class="rt" cx="50" cy="50" r="42"/><circle class="rv" cx="50" cy="50" r="42" stroke-dasharray="263.9" stroke-dashoffset="263.9" style="stroke:var(--alert)"/></svg><div style="color:var(--alert-ink)">Time's up</div></div>
        <p class="s-hello" style="font-size:24px">We let Priya know</p>
        <p class="s-sub" style="font-size:17px">If you already took it, that's okay. Priya may give you a call.</p>
        <button class="big-btn bb-ok" data-act="home" style="min-height:90px;margin-top:auto">Back to home</button></div>`;
    }
    sView.innerHTML = h;
    if (G && !RM) G.fromTo(sView.firstElementChild, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }

  function ripple(btn, e) {
    if (RM || !G) return;
    const r = btn.getBoundingClientRect();
    const sp = document.createElement('span'); sp.className = 'ripple';
    const d = Math.max(r.width, r.height) * 1.6;
    const x = (e && e.clientX ? e.clientX - r.left : r.width / 2), y = (e && e.clientY ? e.clientY - r.top : r.height / 2);
    Object.assign(sp.style, { width: d + 'px', height: d + 'px', left: x - d / 2 + 'px', top: y - d / 2 + 'px' });
    btn.appendChild(sp);
    G.to(sp, { scale: 1, opacity: 0, duration: 0.9, ease: 'power2.out', onComplete: () => sp.remove() });
  }
  function burst(host) {
    if (RM || !G || !host) return;
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('i'); host.appendChild(p);
      const a = (i / 18) * Math.PI * 2, dist = 60 + Math.random() * 60;
      G.fromTo(p, { x: 0, y: 0, scale: 1, opacity: 1 }, { x: Math.cos(a) * dist, y: Math.sin(a) * dist, scale: 0.3, opacity: 0, duration: 1 + Math.random() * 0.4, ease: 'expo.out', onComplete: () => p.remove() });
    }
  }

  /* ---------- actions ---------- */
  function takeMed(i, btn, e) {
    const t = today();
    if (t.meds[i] !== null) return;
    if (missTween) { missTween.kill(); missTween = null; S.busy = false; syncButtons(); }
    t.meds[i] = 1; tick(2); S.times['m' + i] = fmtH(S.clock);
    ripple(btn, e); burst(btn.querySelector('.burst') || btn);
    notify(`Mom took her ${MEDS[i].due < 12 ? 'morning' : 'evening'} medicine · ${fmtH(S.clock)} ✓`, false);
    setTimeout(() => { S.view = 'home'; renderSenior(); }, RM ? 200 : 1100);
    emit();
  }
  function checkIn(btn, e) {
    const t = today();
    ripple(btn, e);
    if (t.check === 1) { S.view = 'ok'; renderSenior(); return; }
    t.check = 1; tick(1); S.times.ck = fmtH(S.clock);
    S.view = 'ok'; renderSenior();
    if (G && !RM) G.from('#okBadge', { scale: 0.4, duration: 0.9, ease: 'elastic.out(1,0.55)' });
    notify(`Mom checked in · ${fmtH(S.clock)} ✓`, false, 600);
    setTimeout(() => { if (S.view === 'ok') { S.view = 'home'; renderSenior(); } }, 3200);
    emit();
  }
  function startGame() {
    const n = ['sun', 'leaf', 'heart', 'sun', 'leaf', 'heart'];
    for (let i = n.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [n[i], n[j]] = [n[j], n[i]]; }
    game = { cards: n.map(x => ({ n: x, up: false, m: false })), open: [], moves: 0, lock: false };
    S.view = 'game'; renderSenior();
  }
  const NAMES = { sun: 'Sun', leaf: 'Leaf', heart: 'Heart' };
  function flipCard(i) {
    if (!game || game.lock) return;
    const c = game.cards[i]; if (c.up || c.m) return;
    c.up = true; game.open.push(i); paintCards();
    if (game.open.length === 2) {
      game.moves++; game.lock = true;
      const [a, b] = game.open;
      if (game.cards[a].n === game.cards[b].n) {
        setTimeout(() => {
          game.cards[a].m = game.cards[b].m = true; game.open = []; game.lock = false; paintCards();
          $('#mmMsg').textContent = 'A match! Well done.';
          if (game.cards.every(x => x.m)) finishGame();
        }, 450);
      } else {
        $('#mmMsg').textContent = 'Not a match. Try again.';
        setTimeout(() => { game.cards[a].up = game.cards[b].up = false; game.open = []; game.lock = false; paintCards(); }, 1000);
      }
    }
  }
  function paintCards() {
    $$('#mmGrid .mm-card').forEach((el, i) => {
      const c = game.cards[i];
      el.classList.toggle('flip', c.up || c.m); el.classList.toggle('matched', c.m);
      el.setAttribute('aria-label', c.up || c.m ? `${NAMES[c.n]}${c.m ? ', matched' : ''}` : `Card ${i + 1}, face down`);
    });
  }
  function finishGame() {
    const sc = Math.max(5, 10 - Math.max(0, game.moves - 3));
    const t = today(); t.cog = sc; tick(3);
    setTimeout(() => { S.view = 'result'; renderSenior(); }, 700);
    notify(`Mom finished her memory game · ${sc}/10`, false, 1200);
    emit();
  }
  function doScan(btn) {
    if (S.scanning) return; S.scanning = true;
    btn.disabled = true; btn.lastChild.textContent = 'Scanning…';
    const lcd = $('#dLcd'), line = $('#dScan');
    const val = 152.4;
    const done = () => {
      lcd.textContent = val.toFixed(1);
      const t = today(); t.w = val; tick(2); S.times.w = fmtH(S.clock); S.scanning = false;
      btn.disabled = false; btn.dataset.act = 'home'; btn.className = 'big-btn bb-ok';
      btn.innerHTML = `${ic('check')}Saved: ${val} lb`;
      notify(`Mom's weight saved · ${val} lb, steady`, false, 400);
      emit();
    };
    if (RM || !G) { done(); return; }
    G.set(line, { opacity: 1, y: 0 });
    G.to(line, { y: 190, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 1 });
    let n = 0; const iv = setInterval(() => { lcd.textContent = (140 + Math.random() * 20).toFixed(1); if (++n > 16) { clearInterval(iv); G.to(line, { opacity: 0, duration: 0.3 }); done(); } }, 105);
  }

  /* ---------- missed dose simulation ---------- */
  function trailingMisses() {
    const flat = []; S.days.forEach(d => d.meds.forEach(m => { if (m !== null) flat.push(m); }));
    let n = 0; for (let i = flat.length - 1; i >= 0 && flat[i] === 0; i--) n++;
    return n;
  }
  function simulateMiss() {
    if (S.busy) return;
    const i = nextDose();
    if (i < 0) { flashNote('Both of today\'s doses are already logged. Press Reset demo to try again.'); return; }
    endPreview();
    S.busy = true; syncButtons();
    S.missIdx = i; S.clock = MEDS[i].due; setClocks();
    S.view = 'miss'; renderSenior(); showTab('sen');
    const ring = $('#missRing'), txt = $('#missTxt');
    const o = { p: 0 };
    missTween = (G ? G.to(o, {
      p: 1, duration: RM ? 2 : 6, ease: 'none',
      onUpdate() { ring.setAttribute('stroke-dashoffset', (263.9 * o.p).toFixed(1)); const left = Math.ceil(30 * (1 - o.p)); txt.innerHTML = `${left} min<br>left`; if (o.p > 0.75) ring.style.stroke = 'var(--alert)'; },
      onComplete: missed,
    }) : (setTimeout(missed, 2000), null));
  }
  function missed() {
    missTween = null;
    const i = S.missIdx, t = today();
    if (t.meds[i] !== null) return;
    t.meds[i] = 0; S.clock = MEDS[i].due + 0.5; setClocks();
    S.view = 'missed'; renderSenior();
    addAlert({ bad: true, t: `Missed ${i === 0 ? 'morning' : 'evening'} medicine · ${fmtH(S.clock)}`, s: `${MEDS[i].name} · no response after 30 min` });
    const streak = trailingMisses();
    if (streak >= 2) addAlert({ bad: true, t: `Pattern: ${streak} missed doses in a row`, s: 'Worth a call to check in' });
    notify(streak >= 2 ? `${streak} missed doses in a row. Worth a call.` : `Mom missed her ${i === 0 ? 'morning' : 'evening'} medicine`, true, 1000);
    S.busy = false; syncButtons();
    setTimeout(() => showTab('car'), 1300);
    emit();
  }

  /* ---------- fast forward ---------- */
  async function fastForward() {
    if (S.busy || S.ffDone) return;
    endPreview();
    S.busy = true; syncButtons();
    const t = today();
    t.meds = t.meds.map(m => (m === null ? 1 : m)); if (t.check === null) t.check = 1; if (t.cog === null) t.cog = 8; if (t.w === null) t.w = 152.4;
    const track = $('#weekTrack'), sun = $('#weekSun'), days = $('#weekDays');
    days.innerHTML = NEXT_WEEK.map(d => `<span>${d.d}</span>`).join('');
    track.classList.add('on');
    const place = p => { const x = 10 + p * 680, y = (1 - p) ** 2 * 40 + 2 * (1 - p) * p * -20 + p * p * 40; sun.style.left = (x / 700 * 100) + '%'; sun.style.top = y + 'px'; };
    place(0);
    showTab('car');
    for (let k = 0; k < 7; k++) {
      await wait(RM ? 120 : 700);
      const o = { p: k / 7 };
      if (G && !RM) G.to(o, { p: (k + 1) / 7 - 0.07, duration: 0.65, ease: 'sine.inOut', onUpdate: () => place(o.p) }); else place((k + 1) / 7 - 0.07);
      S.days.shift(); S.days.push(JSON.parse(JSON.stringify(NEXT_WEEK[k])));
      days.children[k].classList.add('lit');
      S.clock = 21; setClocks();
      updateCare(true);
    }
    await wait(500);
    const c = components();
    addAlert({ bad: false, t: `Week done: ${c.dosesT} of ${c.dosesN} doses taken`, s: `${c.chkT} of ${c.chkN} check-ins answered` });
    if (c.wPct > 1.5) addAlert({ bad: true, t: `Weight down ${Math.abs(c.wChange).toFixed(1)} lb this week`, s: 'A gradual change. Worth keeping an eye on.' });
    S.times = { m0: '8:03 AM', m1: '8:05 PM', ck: '9:01 AM', w: '7:34 AM' };
    S.week = 'Following week (sample)';
    S.ffDone = true; S.busy = false; syncButtons();
    S.view = 'home'; renderSenior();
    notify('New weekly report is ready', false, 200);
    emit();
  }

  /* ---------- caregiver dashboard ---------- */
  const cView = $('#cView');
  function buildCare() {
    cView.innerHTML = `
      <div class="c-head"><span class="avatar">M</span><span style="flex:1"><b>Mom</b><small>Meera, 79 · Minneapolis</small></span><span class="chip chip-ok" id="cStatus">All good</span></div>
      <div class="c-card c-score"><div class="ring-sm"><svg viewBox="0 0 100 100"><circle class="rt" cx="50" cy="50" r="42"/><circle class="rv" id="cRing" cx="50" cy="50" r="42" stroke-dasharray="263.9" stroke-dashoffset="263.9"/></svg><div id="cScore">0</div></div><p><b>Wellness score</b><span id="cScoreSub">Last 7 days</span></p></div>
      <p class="c-sec">Alerts</p><div class="alerts" id="cAlerts"></div>
      <p class="c-sec">Today</p>
      <div class="c-card" id="cToday"></div>
      <p class="c-sec">From Apple Health</p>
      <div class="vit-row"><div><b>68 bpm</b>Resting heart rate</div><div><b>128/78</b>Blood pressure</div><div><b id="cSteps">640</b>Steps so far</div><div><b>7h 05m</b>Sleep last night</div></div>
      <p class="c-sec">This week</p>
      <div class="c-card chart-card"><p class="ct">Weight <span id="cWt"></span></p><svg viewBox="0 0 240 70" id="chW"><path d="M0 66H240" stroke="#EEF1F4"/><path id="chWLine" fill="none" stroke="#104E64" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g id="chWDots"></g></svg></div>
      <div class="c-card chart-card"><p class="ct">Medication <span id="cAd"></span></p><svg viewBox="0 0 240 70" id="chA"><g id="chABars"></g></svg></div>
      <div class="c-card chart-card"><p class="ct">Memory game <span id="cCg"></span></p><svg viewBox="0 0 240 70" id="chC"><path d="M0 66H240" stroke="#EEF1F4"/><path id="chCLine" fill="none" stroke="#B8902F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g id="chCDots"></g></svg></div>
      <p class="s-sub" style="font-size:11px;text-align:center">Sample data</p>`;
    const NS = 'http://www.w3.org/2000/svg';
    const bars = $('#chABars');
    for (let i = 0; i < 7; i++) {
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = `<rect x="${i * 34 + 6}" y="4" width="22" height="50" rx="6" fill="#EEF1F4"/><rect class="bar" x="${i * 34 + 6}" y="54" width="22" height="0" rx="6" fill="#8EC8E8"/><circle class="miss" cx="${i * 34 + 17}" cy="64" r="3" fill="#E7000B" opacity="0"/>`;
      bars.appendChild(g);
    }
    ['#chWDots', '#chCDots'].forEach(id => { for (let i = 0; i < 7; i++) { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', i === 6 ? 4.5 : 3); c.setAttribute('cx', i * 38 + 6); c.setAttribute('cy', 40); c.setAttribute('fill', id === '#chWDots' ? '#104E64' : '#B8902F'); $(id).appendChild(c); } });
  }
  function linePts(vals, lo, hi) {
    let last = vals.find(v => v !== null); if (last == null) last = (lo + hi) / 2;
    return vals.map((v, i) => { if (v === null) v = last; last = v; return [i * 38 + 6, 60 - (v - lo) / (hi - lo) * 52]; });
  }
  const dPath = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  let shownScore = 0;
  function updateCare(animate) {
    const c = components(), t = today();
    const dur = animate && G && !RM ? 1 : 0;
    // score ring
    const o = { v: shownScore };
    const setScore = v => { $('#cScore').textContent = Math.round(v); $('#cRing').setAttribute('stroke-dashoffset', (263.9 * (1 - v / 100)).toFixed(1)); };
    if (dur) G.to(o, { v: c.score, duration: 1.4, ease: 'elastic.out(1,0.7)', onUpdate: () => setScore(o.v) }); else setScore(c.score);
    const diff = c.score - 86;
    $('#cScoreSub').textContent = diff === 0 ? 'Steady this week' : diff > 0 ? `Up ${diff} this week` : `Down ${-diff} this week`;
    shownScore = c.score;
    const bad = S.alerts.length && S.alerts[0].bad && (t.meds.includes(0) || /Weight down/.test(S.alerts[0].t));
    const st = $('#cStatus'); st.className = 'chip ' + (bad ? 'chip-alert' : 'chip-ok'); st.textContent = bad ? 'Needs a look' : 'All good';
    // alerts
    $('#cAlerts').innerHTML = S.alerts.slice(0, 3).map(a => `<div class="alert${a.bad ? ' bad' : ''}">${ic(a.bad ? 'alert' : 'check')}<span>${a.t}<small>${a.s}</small></span></div>`).join('');
    if (dur) G.from('#cAlerts .alert:first-child', { opacity: 0, y: -10, duration: 0.7, ease: 'power3.out' });
    // today
    const row = (icn, title, sub, chip) => `<div class="c-row"><span class="dot-ic">${ic(icn)}</span><span class="grow">${title}<small>${sub}</small></span>${chip}</div>`;
    const medRow = i => {
      const m = t.meds[i];
      if (m === 1) return row('pill', MEDS[i].label, `Taken ${S.times['m' + i] || ''}`, '<span class="chip chip-ok">Taken</span>');
      if (m === 0) return row('pill', MEDS[i].label, `${MEDS[i].name} · due ${fmtH(MEDS[i].due)}`, '<span class="chip chip-alert">Missed</span>');
      return row('pill', MEDS[i].label, `${MEDS[i].name} · due ${fmtH(MEDS[i].due)}`, `<span class="chip chip-wait">${MEDS[i].due <= S.clock ? 'Due now' : 'Later'}</span>`);
    };
    $('#cToday').innerHTML = medRow(0) + medRow(1)
      + row('shield', 'Check-in', t.check === 1 ? `Answered ${S.times.ck || ''}` : 'Asks at 9:00 AM', t.check === 1 ? '<span class="chip chip-ok">Okay</span>' : t.check === 0 ? '<span class="chip chip-alert">No reply</span>' : '<span class="chip chip-wait">Waiting</span>')
      + row('brain', 'Memory game', t.cog !== null ? `Score ${t.cog}/10` : 'Not played yet', t.cog !== null ? '<span class="chip chip-ok">Done</span>' : '<span class="chip chip-wait">Later</span>')
      + row('scale', 'Weight', t.w !== null ? `${t.w.toFixed(1)} lb ${S.times.w ? '· ' + S.times.w : ''}` : 'Not scanned yet', t.w !== null ? '<span class="chip chip-ok">Saved</span>' : '<span class="chip chip-wait">Later</span>');
    $('#cSteps').textContent = Math.round(Math.min(4200, 380 + Math.max(0, S.clock - 7) * 290)).toLocaleString();
    // weight chart
    const wv = S.days.map(d => d.w), known = wv.filter(v => v !== null);
    const lo = Math.min(...known) - 0.8, hi = Math.max(...known) + 0.8;
    const wp = linePts(wv, lo, hi);
    $('#cWt').textContent = `${known[known.length - 1].toFixed(1)} lb · ${c.wChange <= 0 ? '−' : '+'}${Math.abs(c.wChange).toFixed(1)} lb`;
    if (dur) G.to('#chWLine', { attr: { d: dPath(wp) }, duration: 1.1, ease: 'power3.out' }); else $('#chWLine').setAttribute('d', dPath(wp));
    $$('#chWDots circle').forEach((el, i) => { const op = wv[i] === null ? 0 : 1; if (dur) G.to(el, { attr: { cx: wp[i][0], cy: wp[i][1] }, opacity: op, duration: 1.1, ease: 'back.out(1.7)' }); else { el.setAttribute('cx', wp[i][0]); el.setAttribute('cy', wp[i][1]); el.style.opacity = op; } });
    // adherence bars
    $('#cAd').textContent = `${c.dosesT} of ${c.dosesN} doses`;
    $$('#chABars g').forEach((g, i) => {
      const d = S.days[i]; const n = d.meds.filter(m => m === 1).length;
      const h = n / 2 * 50; const bar = g.querySelector('.bar'); const miss = g.querySelector('.miss');
      if (dur) G.to(bar, { attr: { y: 54 - h, height: h }, duration: 1.2, ease: h > 0 ? 'back.out(1.6)' : 'power3.out', delay: i * 0.04 }); else { bar.setAttribute('y', 54 - h); bar.setAttribute('height', h); }
      miss.setAttribute('opacity', d.meds.includes(0) ? 1 : 0);
    });
    // cognition
    const cv = S.days.map(d => d.cog);
    const cp = linePts(cv, 4, 10);
    $('#cCg').textContent = c.cogAvg ? `avg ${c.cogAvg.toFixed(1)} / 10` : '';
    if (dur) G.to('#chCLine', { attr: { d: dPath(cp) }, duration: 1.1, ease: 'power3.out' }); else $('#chCLine').setAttribute('d', dPath(cp));
    $$('#chCDots circle').forEach((el, i) => { const op = cv[i] === null ? 0 : 1; if (dur) G.to(el, { attr: { cx: cp[i][0], cy: cp[i][1] }, opacity: op, duration: 1.1, ease: 'back.out(1.7)' }); else { el.setAttribute('cx', cp[i][0]); el.setAttribute('cy', cp[i][1]); el.style.opacity = op; } });
  }

  /* ---------- day scrubber previews ---------- */
  const EVENTS = [
    { h: 7.5, sen: ['camera', 'Step on your scale', 'Scan my scale', 'bb-med'], car: ['Weight logged', '152.4 lb · steady'] },
    { h: 8, sen: ['pill', 'Time for your blood pressure pill', 'Took Medicine', 'bb-ok'], car: ['Morning medicine taken', 'Lisinopril 10 mg'] },
    { h: 9, sen: ['shield', 'Good morning! Are you okay?', "I'm Okay", 'bb-ok'], car: ['Mom checked in', 'On time'] },
    { h: 11, sen: ['brain', 'Time for today\'s brain game', 'Play now', 'bb-med'], car: ['Memory game · 8/10', 'In her usual range'] },
    { h: 15, sen: ['shield', 'Afternoon check: are you okay?', "I'm Okay", 'bb-ok'], car: ['Afternoon check-in', 'Answered'] },
    { h: 20, sen: ['pill', 'Time for your evening pill', 'Took Medicine', 'bb-ok'], car: ['Evening medicine taken', 'Atorvastatin 20 mg'] },
    { h: 21.5, sen: ['moon', 'Good night, Meera. You did everything today.', null], car: ['Day complete', 'Wellness score 86'] },
  ];
  let previewing = false;
  function preview(h) {
    previewing = true;
    const sS = $('#sSnap'), cS = $('#cSnap');
    sS.classList.add('on'); cS.classList.add('on');
    $('#sClock').textContent = shortH(h); $('#cClock').textContent = shortH(h);
    $('#hourOut').textContent = fmtH(h);
    const cur = EVENTS.filter(e => e.h <= h + 0.001).pop();
    const next = EVENTS.find(e => e.h > h + 0.001);
    const active = cur && (h - cur.h) < 0.75;
    let sen;
    if (active && cur.sen[2]) {
      sen = `<span class="snap-tag">Preview · ${fmtH(h)}</span><p class="s-sub">${fmtH(cur.h)}</p><p class="s-hello" style="font-size:25px">${cur.sen[1]}</p><div class="big-btn ${cur.sen[3]}" style="min-height:130px;margin-top:auto">${ic(cur.sen[0])}${cur.sen[2]}</div>`;
    } else if (active) {
      sen = `<span class="snap-tag">Preview · ${fmtH(h)}</span><div style="margin:auto 0;text-align:center;display:grid;gap:16px;justify-items:center">${ic('moon', 'width:70px;height:70px;color:var(--teal)')}<p class="s-hello">${cur.sen[1]}</p></div>`;
    } else {
      sen = `<span class="snap-tag">Preview · ${fmtH(h)}</span><p class="s-hello">${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}, Meera</p><div class="next-card"><p>Nothing to do right now.</p><p style="font-weight:500;font-size:15px;color:var(--muted)">${next ? `Next: ${next.sen[1].replace(/^Time for /, '').replace(/^(.)/, m => m.toUpperCase())} at ${fmtH(next.h)}` : 'Rest well.'}</p></div>${ic(h < 18 ? 'sun' : 'moon', 'width:80px;height:80px;margin:20px auto;color:' + (h < 18 ? '#DBB155' : 'var(--teal)'))}`;
    }
    const sens = $('#sSnap');
    sens.className = 'snap-layer on ' + (h >= 19 ? '' : 's-warm');
    sens.style.background = h >= 19 ? 'linear-gradient(170deg,#E7F1F8,#CFE3F0)' : '';
    sens.innerHTML = sen;
    const done = EVENTS.filter(e => e.h + 0.05 <= h);
    const steps = Math.round(Math.min(4200, 380 + Math.max(0, h - 7) * 290));
    cS.innerHTML = `<span class="snap-tag">Preview · ${fmtH(h)}</span>
      <div class="c-head"><span class="avatar">M</span><span><b>Mom</b><small>${done.length} of ${EVENTS.length} moments done</small></span></div>
      <div class="c-card">${EVENTS.map(e => `<div class="c-row"><span class="dot-ic">${ic(e.sen[0])}</span><span class="grow">${e.car[0]}<small>${e.h + 0.05 <= h ? e.car[1] + ' · ' + fmtH(e.h + 0.05) : 'Scheduled ' + fmtH(e.h)}</small></span>${e.h + 0.05 <= h ? '<span class="chip chip-ok">Done</span>' : '<span class="chip chip-wait">Later</span>'}</div>`).join('')}</div>
      <div class="vit-row"><div><b>${steps.toLocaleString()}</b>Steps</div><div><b>${h < 13 ? 66 : h < 19 ? 72 : 64} bpm</b>Heart rate</div></div>`;
  }
  function endPreview() {
    if (!previewing) return;
    previewing = false;
    $('#sSnap').classList.remove('on'); $('#cSnap').classList.remove('on');
    $('#hourOut').textContent = 'Live'; setClocks();
  }

  /* ---------- controls ---------- */
  function syncButtons() {
    $('#btnMiss').disabled = S.busy;
    $('#btnWeek').disabled = S.busy || S.ffDone;
    $('#btnWeek').lastChild.textContent = S.ffDone ? 'Week fast-forwarded' : 'Fast-forward a week';
  }
  let noteT;
  function flashNote(msg) {
    const n = $('.dc-note'); const orig = n.dataset.orig || n.textContent; n.dataset.orig = orig;
    n.textContent = msg; n.style.color = 'var(--alert-ink)';
    clearTimeout(noteT); noteT = setTimeout(() => { n.textContent = orig; n.style.color = ''; }, 4000);
  }
  function reset() {
    if (missTween) { missTween.kill(); missTween = null; }
    S = base(); game = null; endPreview();
    $('#weekTrack').classList.remove('on');
    $('#hourRange').value = 9;
    setClocks(); renderSenior(); updateCare(true); syncButtons(); emit();
  }

  function showTab(which) {
    const sen = which === 'sen';
    $('#tabSen').setAttribute('aria-selected', sen); $('#tabCar').setAttribute('aria-selected', !sen);
    $('#dcSen').classList.toggle('off', !sen); $('#dcCar').classList.toggle('off', sen);
    if (!sen) $('#carBadge').style.opacity = 0;
  }

  function getReport() {
    const c = components();
    const flags = [];
    S.days.forEach(d => {
      d.meds.forEach((m, i) => { if (m === 0) flags.push({ hot: true, t: `Missed ${i ? 'evening' : 'morning'} dose · ${d.d}` }); });
      if (d.check === 0) flags.push({ hot: true, t: `No check-in reply · ${d.d}` });
    });
    if (c.wPct > 1.5) flags.push({ hot: true, t: `Weight down ${Math.abs(c.wChange).toFixed(1)} lb over the week. Worth keeping an eye on.` });
    else flags.push({ hot: false, t: `Weight steady (${c.wChange <= 0 ? '−' : '+'}${Math.abs(c.wChange).toFixed(1)} lb)` });
    flags.push({ hot: false, t: `Memory scores in her usual range (avg ${c.cogAvg ? c.cogAvg.toFixed(1) : '—'})` });
    return { days: JSON.parse(JSON.stringify(S.days)), comp: c, flags, week: S.week };
  }

  /* ---------- wire up ---------- */
  function init() {
    buildCare(); setClocks(); renderSenior(); updateCare(false); shownScore = components().score; syncButtons();
    $('#sScreen').addEventListener('click', e => {
      if (previewing) { endPreview(); return; }
      const b = e.target.closest('[data-act],[data-card]'); if (!b) return;
      if (b.dataset.card !== undefined) return flipCard(+b.dataset.card);
      const a = b.dataset.act;
      if (a === 'med') takeMed(+b.dataset.i, b, e);
      else if (a === 'ok') checkIn(b, e);
      else if (a === 'game') { if (today().cog !== null) { flashNote('She already played today. Press Reset demo to play again.'); return; } startGame(); }
      else if (a === 'scan') { S.view = 'scan'; renderSenior(); }
      else if (a === 'doScan') doScan(b);
      else if (a === 'home') { if (S.busy) return; S.view = 'home'; renderSenior(); }
    });
    $('#cScreen').addEventListener('click', () => { if (previewing) endPreview(); });
    $('#btnMiss').addEventListener('click', simulateMiss);
    $('#btnWeek').addEventListener('click', fastForward);
    $('#btnReset').addEventListener('click', reset);
    $('#hourRange').addEventListener('input', e => preview(+e.target.value));
    $('#tabSen').addEventListener('click', () => showTab('sen'));
    $('#tabCar').addEventListener('click', () => showTab('car'));
    $('.demo-toggle').addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const toCar = $('#tabSen').getAttribute('aria-selected') === 'true'; showTab(toCar ? 'car' : 'sen'); (toCar ? $('#tabCar') : $('#tabSen')).focus(); } });
    // swipe between phones on mobile
    let sx = null, sy = null;
    const stage = $('#demoStage');
    stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (sx === null) return; const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && matchMedia('(max-width:860px)').matches) showTab(dx < 0 ? 'car' : 'sen');
    }, { passive: true });
    showTab('sen');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.CareloDemo = { getReport, onUpdate: fn => listeners.push(fn), components };
})();
