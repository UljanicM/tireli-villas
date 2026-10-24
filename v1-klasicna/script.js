// Draws the connector lines from the central circle toward the middle of
// every node, then plays the entrance sequence.
//
// Geometry is read from the layout (offsetLeft/Top), not from
// getBoundingClientRect, so hover and entrance transforms never move a line.
// Each line starts a little inside the circle and ends a little inside its
// node; both ends are hidden under those opaque surfaces, so the line meets
// the outline exactly with no gap.
(() => {
  const root = document.documentElement;
  const stage = document.querySelector('.stage');
  const svg = stage.querySelector('.wires');
  const ring = stage.querySelector('.ring');
  const nodes = [...stage.querySelectorAll('[data-node]')];
  const wide = matchMedia('(min-width: 761px)');
  const full = matchMedia('(min-width: 1100px)');
  const NS = 'http://www.w3.org/2000/svg';
  const TUCK = 8; // px each end runs under the circle / node
  const lines = new Map();

  // Entrance timing. The villa cards rise together as the sequence starts;
  // every other node follows on its own, clockwise by data-order, from
  // Naslovna to the language switch. Each line draws in just ahead of its node.
  const START = 450; // ms, once the circle has begun to appear
  const STEP = 230; // ms between two buttons
  const LEAD = 380; // ms a line starts before its node
  let last = 0;

  nodes.forEach((node) => {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('pathLength', '1'); // lets the draw-in animate with a 0..1 dash
    const at = START + Number(node.dataset.order ?? 0) * STEP;
    last = Math.max(last, at);
    node.style.setProperty('--delay', `${at}ms`);
    line.style.setProperty('--delay', `${Math.max(0, at - LEAD)}ms`);
    svg.appendChild(line);
    lines.set(node, line);

    const on = () => line.classList.add('is-active');
    const off = () => line.classList.remove('is-active');
    node.addEventListener('pointerenter', on);
    node.addEventListener('pointerleave', off);
    node.addEventListener('focusin', on);
    node.addEventListener('focusout', off);
  });

  // The CSS `translate` property (used to centre the circle and the labels)
  // is not part of offsetLeft/Top, so it is added back here.
  function shift(el, w, h) {
    const t = getComputedStyle(el).translate;
    if (!t || t === 'none') return [0, 0];
    const [x, y = '0px'] = t.split(' ');
    const px = (v, size) => (v.endsWith('%') ? (parseFloat(v) / 100) * size : parseFloat(v));
    return [px(x, w), px(y, h)];
  }

  // Untransformed box of an element in the stage's coordinate space.
  function box(el) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let x = 0;
    let y = 0;
    for (let n = el; n && n !== stage; n = n.offsetParent) {
      x += n.offsetLeft;
      y += n.offsetTop;
      const [sx, sy] = shift(n, n.offsetWidth, n.offsetHeight);
      x += sx;
      y += sy;
    }
    return { left: x, top: y, right: x + w, bottom: y + h, width: w, height: h };
  }

  // A label's data-gap is the visible line length between the circle and the
  // label's outline. Its centre therefore sits at R + gap + the distance from
  // the label's centre to its own outline along the spoke direction.
  const gapped = [...stage.querySelectorAll('.spoke[data-gap]')];
  function placeSpokes() {
    gapped.forEach((el) => {
      const a = (parseFloat(el.style.getPropertyValue('--a')) * Math.PI) / 180;
      const ext = Math.min(
        el.offsetWidth / 2 / Math.abs(Math.cos(a)),
        el.offsetHeight / 2 / Math.abs(Math.sin(a))
      );
      el.style.setProperty('--d', `${(Number(el.dataset.gap) + ext).toFixed(1)}px`);
    });
  }

  function draw() {
    if (!wide.matches) return;
    placeSpokes();
    svg.setAttribute('viewBox', `0 0 ${stage.offsetWidth} ${stage.offsetHeight}`);
    const c = box(ring);
    const cx = c.left + c.width / 2;
    const cy = c.top + c.height / 2;
    const R = c.width / 2;

    // Below the full radial layout only the first row of cards is wired;
    // lines to lower rows would have to run through the gaps between cards.
    const cards = nodes.filter((n) => n.classList.contains('card'));
    const firstRow = Math.min(...cards.map((n) => box(n).top));

    lines.forEach((line, node) => {
      const r = box(node);
      const hide = () => line.setAttribute('visibility', 'hidden');
      if (!full.matches && node.classList.contains('card') && r.top > firstRow + 1) return hide();

      // Aim at the middle of the node; enter where that ray crosses its outline.
      const nx = r.left + r.width / 2;
      const ny = r.top + r.height / 2;
      const dx = nx - cx;
      const dy = ny - cy;
      const len = Math.hypot(dx, dy);
      if (!len) return hide();
      const tx = dx ? ((dx > 0 ? r.left : r.right) - cx) / dx : -Infinity;
      const ty = dy ? ((dy > 0 ? r.top : r.bottom) - cy) / dy : -Infinity;
      const edge = Math.max(tx, ty) * len; // distance from the centre to the outline
      if (edge <= R + 4) return hide(); // node sits on the circle itself

      const ux = dx / len;
      const uy = dy / len;
      line.removeAttribute('visibility');
      line.setAttribute('x1', (cx + ux * (R - TUCK)).toFixed(1));
      line.setAttribute('y1', (cy + uy * (R - TUCK)).toFixed(1));
      line.setAttribute('x2', (cx + ux * (edge + TUCK)).toFixed(1));
      line.setAttribute('y2', (cy + uy * (edge + TUCK)).toFixed(1));
    });
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      draw();
    });
  };

  new ResizeObserver(schedule).observe(stage);
  wide.addEventListener('change', schedule);
  full.addEventListener('change', schedule);
  document.addEventListener('tireli:lang', schedule);
  if (document.fonts) document.fonts.ready.then(schedule);

  draw();
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
  // Once the entrance is over, hover feedback runs without the stagger delay.
  setTimeout(() => root.classList.add('settled'), last + 1000);
})();
