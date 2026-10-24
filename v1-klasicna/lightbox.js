// The viewer. Two kinds share one scrim:
// - a villa card: a copy of the card, with its outline, title and photo,
//   travels from its place on the page to the middle of the screen, enlarged;
// - any other button (the menu labels and Instagram): the button
//   itself grows into a square panel in the middle of the screen that says
//   what that section holds, while the button's text moves up into the
//   panel's heading. The rest of its text comes from i18n.js (`panels`).
// Clicking outside (or Esc) sends either one back the same way; there is
// no close button.
(() => {
  const root = document.documentElement;
  const box = document.querySelector('.lightbox');
  const scrim = box.querySelector('.lightbox-scrim');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  let open = null;

  const fade = (el, from, to, duration, delay = 0) =>
    el.animate([{ opacity: from }, { opacity: to }], { duration, delay, easing: 'ease', fill: 'both' });

  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  // Reads an element's box as it looks at rest. A button is usually still
  // hover-enlarged when it is clicked, but by the time a viewer closes it
  // is back to normal size, so closing aims here, not at the clicked size.
  function atRest(el, read) {
    const s = el.style;
    const saved = [s.transition, s.transform, s.scale];
    s.transition = 'none';
    s.transform = 'none';
    s.scale = 'none';
    const out = read();
    [s.transition, s.transform, s.scale] = saved;
    return out;
  }

  // Shared by both kinds once the travelling element is in place.
  function lift(source, el, label, back, keyboard) {
    box.setAttribute('aria-label', label);
    box.hidden = false;
    box.appendChild(el);
    source.style.visibility = 'hidden';
    root.classList.add('is-viewing');
    const t = reduce.matches ? 0 : 620;
    fade(scrim, 0, 1, t);
    open = { source, el, back, keyboard };
    box.focus({ preventScroll: true });
    return t;
  }

  function showVilla(card, keyboard) {
    // The card may be mid-hover (scaled), so start from its on-screen box
    // but size the copy from its untransformed layout.
    const r = card.getBoundingClientRect();
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const copy = make('div', 'lightbox-card villa');
    copy.innerHTML = card.innerHTML;
    Object.assign(copy.style, {
      left: `${cx - w / 2}px`,
      top: `${cy - h / 2}px`,
      width: `${w}px`,
      height: `${h}px`,
    });

    const scale = Math.min((innerWidth * 0.9) / w, (innerHeight * 0.84) / h);
    const from = `translate(0px, 0px) scale(${r.width / w})`;
    const to = `translate(${innerWidth / 2 - cx}px, ${innerHeight / 2 - cy}px) scale(${scale})`;
    const back = (t) => {
      const q = atRest(card, () => card.getBoundingClientRect());
      const home = `translate(${q.left + q.width / 2 - cx}px, ${q.top + q.height / 2 - cy}px) scale(${q.width / w})`;
      return copy.animate([{ transform: to }, { transform: home }], { duration: t, easing: EASE, fill: 'forwards' });
    };

    const t = lift(card, copy, card.querySelector('h2').textContent, back, keyboard);
    copy.animate([{ transform: from }, { transform: to }], { duration: t, easing: EASE, fill: 'forwards' });
  }

  function panelBody(data, w, heading) {
    const body = make('div', 'panel-body');
    body.style.width = `${w}px`;
    body.append(make('h2', '', heading));
    if (data.lead) body.append(make('p', 'panel-lead', data.lead));
    if (data.stats) {
      const dl = make('dl', 'panel-stats');
      data.stats.forEach(([n, label]) => {
        const item = make('div');
        item.append(make('dt', '', n), make('dd', '', label));
        dl.append(item);
      });
      body.append(dl);
    }
    if (data.rows) {
      const ul = make('ul', 'panel-rows');
      data.rows.forEach(([k, v]) => {
        const li = make('li');
        li.append(make('span', 'k', k), make('span', 'v', v));
        ul.append(li);
      });
      body.append(ul);
    }
    if (data.cta) {
      const [text, href] = data.cta;
      const a = make('a', 'panel-cta', text);
      a.href = href;
      if (href.startsWith('http')) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      body.append(a);
    }
    return body;
  }

  // Where a piece of text sits and how it is set: the element's content box
  // plus the type properties that change between the button and the panel.
  function textFrame(el, slack = 0) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const px = (v) => parseFloat(v) || 0;
    const insetL = px(cs.paddingLeft) + px(cs.borderLeftWidth);
    const insetT = px(cs.paddingTop) + px(cs.borderTopWidth);
    const insetR = px(cs.paddingRight) + px(cs.borderRightWidth);
    return {
      left: `${r.left + insetL}px`,
      top: `${r.top + insetT}px`,
      width: `${r.width - insetL - insetR + slack}px`,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      fontWeight: cs.fontWeight,
      color: cs.color,
    };
  }

  function showPanel(source, keyboard) {
    const data = window.tireliText().panels[source.dataset.panel];
    const cs = getComputedStyle(source);
    const named = source.querySelector('h2, span') || source;
    const w = Math.min(600, innerWidth - 32);
    const panel = make('section', 'panel');
    const body = panelBody(data, w, named.textContent.trim());
    const heading = body.querySelector('h2');
    if (getComputedStyle(named).textTransform === 'none') heading.style.textTransform = 'none';
    panel.append(body);

    // Square where the text allows, taller when it needs the room, always
    // leaving some scrim to click; anything longer scrolls inside the panel.
    box.hidden = false;
    box.appendChild(panel);
    const h = Math.min(innerHeight - 80, Math.max(body.offsetHeight, Math.min(w, 560)));
    body.style.height = `${h}px`;

    // The panel starts as the button (its box, rounding and colour) and
    // ends as a centred square on the paper surface.
    const buttonFrame = () => {
      const r = source.getBoundingClientRect();
      return {
        left: `${r.left}px`,
        top: `${r.top}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
        borderRadius: `${Math.min(parseFloat(cs.borderTopLeftRadius) || 0, r.height / 2)}px`,
        backgroundColor: cs.backgroundColor,
      };
    };
    const start = buttonFrame();
    const end = {
      left: `${(innerWidth - w) / 2}px`,
      top: `${(innerHeight - h) / 2}px`,
      width: `${w}px`,
      height: `${h}px`,
      borderRadius: '20px',
      backgroundColor: getComputedStyle(root).getPropertyValue('--surface').trim(),
    };
    Object.assign(panel.style, end);

    // The button's text never disappears: a copy of it travels from the
    // button to its place in the panel, where it becomes the heading, and the
    // real heading takes over once it lands. The copy is fixed-position, so
    // the panel does not clip it.
    const pairs = [[named, heading]];
    const travel = pairs.map(([from, real]) => {
      const el = make('span', 'panel-travel', real.textContent);
      el.style.textTransform = getComputedStyle(real).textTransform;
      el.style.textWrap = getComputedStyle(real).textWrap;
      panel.append(el);
      real.style.visibility = 'hidden';
      return { el, real, src: from, from: textFrame(from, 1), to: textFrame(real) };
    });

    // Everything else rises in after the text has arrived, one item at a time.
    const rest = [...body.querySelectorAll('.panel-lead, .panel-stats > div, .panel-rows li, .panel-cta')]
      .filter((el) => !travel.some((x) => x.real === el));

    // Closing: the rest fades first, then the panel shrinks back into the
    // button and the text travels back with it, landing exactly where the
    // button's own text will reappear.
    const back = (t) => {
      body.scrollTop = 0;
      const wait = t * 0.3;
      const home = atRest(source, () => ({ box: buttonFrame(), texts: travel.map((x) => textFrame(x.src, 1)) }));
      rest.forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: wait, fill: 'forwards' }));
      travel.forEach((x, i) => {
        const now = textFrame(x.real);
        x.real.style.visibility = 'hidden';
        x.el.style.visibility = '';
        x.el.animate([now, home.texts[i]], { duration: t, delay: wait, easing: EASE, fill: 'both' });
      });
      return panel.animate([end, home.box], { duration: t, delay: wait, easing: EASE, fill: 'both' });
    };

    const t = lift(source, panel, heading.textContent, back, keyboard);
    panel.animate([start, end], { duration: t, easing: EASE, fill: 'forwards' });
    travel.forEach((x) => {
      x.el.animate([x.from, x.to], { duration: t, easing: EASE, fill: 'forwards' }).finished.then(() => {
        if (open?.el !== panel) return; // closed before it landed
        x.real.style.visibility = '';
        x.el.style.visibility = 'hidden';
      });
    });
    rest.forEach((el, i) => {
      el.animate(
        [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: t ? 480 : 0, delay: t ? t * 0.55 + i * 55 : 0, easing: EASE, fill: 'both' }
      );
    });
  }

  function hide() {
    if (!open) return;
    const { source, el, back, keyboard } = open;
    open = null;
    const t = reduce.matches ? 0 : 460;
    fade(scrim, 1, 0, t);
    back(t).finished.then(() => {
      el.remove();
      box.hidden = true;
      source.style.visibility = '';
      root.classList.remove('is-viewing');
      // Focus goes back to the button only for keyboard users; after a
      // click it would light up the button's line as the viewer closes.
      if (keyboard) source.focus({ preventScroll: true });
      else box.blur();
    });
  }

  document.querySelectorAll('.card.villa').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      if (!open) showVilla(card, e.detail === 0); // detail 0: Enter, not a click
    });
  });

  document.querySelectorAll('[data-panel]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!open) showPanel(el, e.detail === 0);
    });
  });

  // Anywhere closes the viewer, except inside a section panel, which can be
  // read, scrolled and has its own link.
  box.addEventListener('click', (e) => {
    if (e.target.closest('.panel')) return;
    hide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
    // Keep keyboard focus inside the open viewer.
    if (e.key === 'Tab' && open) {
      e.preventDefault();
      const stops = [box, ...box.querySelectorAll('.panel a')];
      const i = stops.indexOf(document.activeElement);
      const next = (i + (e.shiftKey ? -1 : 1) + stops.length) % stops.length;
      stops[next].focus();
    }
  });
})();
