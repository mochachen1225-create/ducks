const { chromium } = require('playwright');
const TSV = +process.argv[2] || 4, RUNS = +process.argv[3] || 3, SMART = process.argv[4] !== 'dumb';
(async () => {
  const b = await chromium.launch();
  for (let run = 0; run < RUNS; run++) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + require('path').resolve(__dirname, '../index.html') + '?ts=' + TSV);
    await p.waitForTimeout(800);
    await p.click('#btnStart');
    await p.evaluate(() => {
      window.__log = [];
      const od = window.detach, ot = window.takeDuck, of = window.startFall, sh = window.spawnHazard;
      window.detach = function (d, s, l) { if (window.__duck.G.line.includes(d)) window.__log.push(['detach', l || s, Math.round(-d.y)]); return od.apply(this, arguments); };
      window.takeDuck = function (d, how, h, l) { window.__log.push(['take', how, Math.round(-d.y)]); return ot.apply(this, arguments); };
      window.startFall = function (d) { window.__log.push(['fall', '', Math.round(-d.y)]); return of.apply(this, arguments); };
      window.spawnHazard = function (t, df, bo) { window.__log.push(['HZ', t + (bo ? '*' : ''), Math.round(-window.__duck.G.mama.y)]); return sh.apply(this, arguments); };
    });
    await p.mouse.move(195, 300); await p.mouse.down();
    const t0 = Date.now();
    while (Date.now() - t0 < 120000 / TSV * 1.5) {
      const st = await p.evaluate((SMART) => {
        const D = window.__duck, G = D.G, m = G.mama;
        if (G.ended) return null;
        let ty = m.y - 130, tx;
        const y = ty, pr = -y;
        if (pr > D.WF_START - 320 && pr < D.WF_END + 200) tx = D.bankL(y) + 45;
        else tx = (D.bankL(y) + Math.min(D.bankR(y), 330)) / 2;
        if (-m.y > FORK_A - 170 && -m.y < FORK_B + 50) { const [a0, b0] = channel(ty, -G.forkSide); tx = (a0 + b0) / 2; const fr = G.static[1]; const ah = fr.rocks.filter(r => r.y < m.y + 4 && r.y > m.y - 120); if (ah.length) { const ry = Math.max(...ah.map(r => r.y)); const row = ah.filter(r => Math.abs(r.y - ry) < 20).map(r => r.x).sort((a, b) => a - b); const [ca, cb] = channel(ry, -G.forkSide); const xs = [ca, ...row, cb]; let bst = 0; for (let k = 0; k < xs.length - 1; k++) if (xs[k + 1] - xs[k] > bst) { bst = xs[k + 1] - xs[k]; tx = (xs[k] + xs[k + 1]) / 2; } } }
        if (SMART) for (const h of G.hazards) {
                    if (h.type === 'logs' && h.y < m.y + 10 && h.y > m.y - 260) { tx = h.gx + h.gw / 2; ty = h.y - 60; }
          if (h.type === 'rocks') {
            // find nearest row above mama: pick gap = x with max clearance
            const ahead = h.rocks.filter(r => r.y < m.y + 5 && r.y > m.y - 200);
            if (ahead.length) { const ry = Math.max(...ahead.map(r => r.y)); const row = ahead.filter(r => Math.abs(r.y - ry) < 30).map(r => r.x).sort((a, b) => a - b);
              const bl = D.bankL(ry), br = D.bankR(ry); const xs = [bl, ...row, br]; let best = 0, bx = tx; for (let i = 0; i < xs.length - 1; i++) { if (xs[i + 1] - xs[i] > best) { best = xs[i + 1] - xs[i]; bx = (xs[i] + xs[i + 1]) / 2; } } tx = bx; ty = ry - 50; }
          }
          if (h.type === 'whirl' && Math.abs(h.cy - m.y) < 200) { tx = h.cx > 180 ? D.bankL(m.y) + 40 : D.bankR(m.y) - 40; }
          if (h.type === 'rapids' && !G.hazards.some(q => q.type === 'rocks') && h.y2 > m.y - 250 && h.y1 < m.y + 150) { const w = D.bankR(m.y) - D.bankL(m.y); tx = h.calm < 0 ? D.bankL(m.y) + w * 0.1 : D.bankR(m.y) - w * 0.1; }
          if (h.type === 'kid') for (const br of h.breads) if (br.landed && Math.abs(br.y - m.y) < 120) { tx = br.x; ty = br.y; }
        }
        // rescue nearby lost ducks
        if (SMART) { const lost = G.ducks.filter(d => (d.state === 'lost' || d.state === 'tangled') && Math.hypot(d.x - m.x, d.y - m.y) < 160 && !(-d.y > D.WF_START - 300 && d.x > 200)); if (lost.length) { tx = lost[0].x; ty = lost[0].y; } }
        return { sx: tx * D.scale, sy: (ty - D.camY) * D.scale };
      }, SMART);
      if (!st) break;
      await p.mouse.move(Math.max(2, Math.min(388, st.sx)), Math.max(2, Math.min(842, st.sy)));
      await p.waitForTimeout(40);
    }
    if (!(await p.evaluate(() => window.__duck.G.ended))) { await p.screenshot({ path: "stuck" + run + ".png" }); console.log(await p.evaluate(() => { const G = window.__duck.G; return JSON.stringify({ m: [G.mama.x, G.mama.y, G.mama.vx, G.mama.vy], hz: G.hazards.map(h => [h.type, h.y, h.y1, h.y2]), ptr: window.__duck.pointer, cam: window.__duck.camY }); })); }
    await p.mouse.up();
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => { const G = window.__duck.G; return { ended: G.ended, saved: G.saved, time: Math.round(G.stats.time), rescues: G.stats.rescues, gone: G.stats.gone.length, p: Math.round(-G.mama.y) }; });
    const log = await p.evaluate(() => window.__log);
    console.log('RUN', run, JSON.stringify(r), errs);
    const agg = {}; for (const [k, l, py] of log) if (k !== 'HZ') { const key = k + ':' + l; (agg[key] = agg[key] || []).push(py); }
    console.log('  hz:', log.filter(l => l[0] === 'HZ').map(l => l[1] + '@' + l[2]).join(' '));
    console.log('  losses:', JSON.stringify(agg));
    await p.close();
  }
  await b.close();
})();
