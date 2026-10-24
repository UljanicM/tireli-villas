// Background particles: soft and sharp dots in
// many sizes, but alive rather than printed. Every dot drifts slowly around
// its own spot; the moving pointer pushes the nearby ones aside and stirs
// them round like air, and lights them up as it passes. The lit dots fade
// slowly behind it. Everywhere else they are only a faint hint.
(() => {
  const canvas = document.querySelector('.dots');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)');

  const AMBIENT = 0.025; // how much every dot shows on its own
  const REVEAL = 0.15; // extra opacity for dots near the moving pointer
  const PUSH_R = 170; // px: dots inside this are pushed and stirred
  const LIGHT_R = 230; // px: dots inside this light up
  const HOLD = 600; // ms the pointer counts as moving after its last move

  let W = 0;
  let H = 0;
  let dpr = 1;
  let dots = [];
  let mx = -1e4; // pointer, and how far it moved since the last frame
  let my = -1e4;
  let mvx = 0;
  let mvy = 0;
  let lastMove = -Infinity;
  let activity = 0; // 0..1, eases up while the pointer moves

  // Seeded, so the field is the same on every visit and every resize.
  function rng(seed) {
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  // Two pre-drawn dots, a sharp one and a blurred one, scaled per particle.
  function sprite(soft) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#1e2b2e';
    if (soft) {
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, ink);
      grad.addColorStop(1, 'transparent');
      g.fillStyle = grad;
    } else {
      g.fillStyle = ink;
    }
    g.beginPath();
    g.arc(32, 32, soft ? 32 : 30, 0, Math.PI * 2);
    g.fill();
    return c;
  }
  let sharp;
  let blurred;

  function build() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    sharp = sprite(false);
    blurred = sprite(true);

    const rand = rng(2013);
    const count = Math.round((W * H) / 950);
    dots = [];
    for (let i = 0; i < count; i++) {
      const x = rand() * W;
      const y = rand() * H;
      // Slow waves across the screen make the dots gather in loose patches.
      const patch = 0.5 + 0.5 * Math.sin(x / 170 + Math.sin(y / 230) * 1.7) * Math.cos(y / 190 - x / 410);
      if (rand() > 0.35 + 0.65 * patch) continue;
      const soft = rand() < 0.35;
      const r = 0.8 + 4.2 * rand() ** 2.2; // mostly small, a few large
      dots.push({
        x0: x, y0: y, x, y, vx: 0, vy: 0, lit: 0,
        r: soft ? r * 1.7 : r,
        img: soft ? blurred : sharp,
        a: 0.5 + 0.5 * rand(),
        // its own slow wander around its spot
        amp: 6 + 22 * rand(),
        f1: 0.6 + 0.8 * rand(),
        f2: 0.6 + 0.8 * rand(),
        p1: rand() * 6.283,
        p2: rand() * 6.283,
        // larger dots are heavier and move less, which reads as depth
        give: 1.25 - r / 6,
      });
    }
  }

  function frame(now) {
    const moving = now - lastMove < HOLD;
    activity += ((moving ? 1 : 0) - activity) * (moving ? 0.12 : 0.04);
    const t = now * 0.00012;
    const calm = still.matches;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const d of dots) {
      if (!calm) {
        // Spring toward its wandering spot.
        const hx = d.x0 + Math.sin(t * d.f1 + d.p1) * d.amp;
        const hy = d.y0 + Math.cos(t * d.f2 + d.p2) * d.amp;
        let ax = (hx - d.x) * 0.012;
        let ay = (hy - d.y) * 0.012;

        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < PUSH_R) {
          const f = (1 - dist / PUSH_R) ** 2 * d.give;
          const ux = dx / dist;
          const uy = dy / dist;
          ax += ux * f * 0.5 - uy * f * 0.22 + mvx * f * 0.035; // aside, round, and along
          ay += uy * f * 0.5 + ux * f * 0.22 + mvy * f * 0.035;
        }
        d.vx = (d.vx + ax) * 0.9;
        d.vy = (d.vy + ay) * 0.9;
        d.x += d.vx;
        d.y += d.vy;
      }

      // Light up near the moving pointer; fade slowly once it has passed.
      const dist = Math.hypot(d.x - mx, d.y - my);
      const target = dist < LIGHT_R ? (1 - dist / LIGHT_R) * activity : 0;
      d.lit += (target - d.lit) * (target > d.lit ? 0.18 : 0.02);

      const alpha = d.a * (AMBIENT + REVEAL * d.lit);
      if (alpha < 0.004) continue;
      ctx.globalAlpha = alpha;
      ctx.drawImage(d.img, d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
    }
    ctx.globalAlpha = 1;
    mvx *= 0.8;
    mvy *= 0.8;
    requestAnimationFrame(frame);
  }

  addEventListener('pointermove', (e) => {
    if (mx > -1e3) {
      mvx = e.clientX - mx;
      mvy = e.clientY - my;
    }
    mx = e.clientX;
    my = e.clientY;
    lastMove = performance.now();
  }, { passive: true });

  // Leaving the window lets the lit dots fade and the field settle.
  document.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget) {
      mx = my = -1e4;
      lastMove = -Infinity;
    }
  });

  let resizing = 0;
  addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(build, 150);
  });

  build();
  requestAnimationFrame(frame);
})();
