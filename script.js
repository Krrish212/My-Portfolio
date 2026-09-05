// ============================================
// PLEXUS NETWORK BACKGROUND (site-wide)
// Grey-blue drifting nodes + distance-faded links,
// with a few faint cyan/violet accent nodes.
// ============================================
(function initPlexus() {
  const canvas = document.querySelector('canvas.plexus');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const LINK_DIST = 150;
  const MAX_NODES = 90;
  const DRIFT = 0.16; // px per frame — gentle

  let nodes = [];
  let w = 0, h = 0;
  let rafId = null;

  function resize(reseed) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reseed) seed();
  }

  function seed() {
    const count = Math.min(MAX_NODES, Math.round((w * h) / 20000));
    nodes = [];
    for (let i = 0; i < count; i++) {
      const accent = i < 4; // sparse accent nodes
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * DRIFT * 2,
        vy: (Math.random() - 0.5) * DRIFT * 2,
        r: accent ? 2.9 : 1.3 + 1.3 * Math.random(),
        color: accent
          ? (i % 2 ? 'rgba(0,229,255,0.30)' : 'rgba(168,85,247,0.30)')
          : 'rgba(107,117,128,0.55)'
      });
    }
  }

  function step() {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -12) n.x = w + 12; else if (n.x > w + 12) n.x = -12;
      if (n.y < -12) n.y = h + 12; else if (n.y > h + 12) n.y = -12;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.3;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.22;
          ctx.strokeStyle = 'rgba(96,106,118,' + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    step();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (reduceMotion.matches) { draw(); return; } // static single frame
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  window.addEventListener('resize', () => {
    const widthChanged = window.innerWidth !== w;
    stop();
    resize(widthChanged);
    start();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', () => { stop(); start(); });
  }

  resize(true);
  start();
})();

// ============================================
// SCROLL REVEAL
// ============================================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// ============================================
// NAV active link on scroll (index only, harmless elsewhere)
// ============================================
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
if (navLinks.length) {
  const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  window.addEventListener('scroll', () => {
    let current = sections[0];
    sections.forEach(sec => {
      if (window.scrollY + 140 >= sec.offsetTop) current = sec;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current.id));
  }, { passive: true });
}

// ============================================
// IMAGE FALLBACKS
// Placeholder assets may not exist yet — hide the
// broken <img> so the styled fallback shows through.
// ============================================
document.querySelectorAll('img[data-fallback]').forEach(img => {
  const hide = () => {
    const media = img.closest('[data-media]');
    if (media) media.classList.add('img-missing');
  };
  if (img.complete && img.naturalWidth === 0) hide();
  img.addEventListener('error', hide);
});

// ============================================
// HERO TOOL WHEEL
// Continuous slow rotation on a 3D-tilted plane;
// scrub faster by scrolling or dragging, with
// momentum. Tiles counter-rotate (Z) and
// counter-tilt (X) so logos always face the
// viewer upright. Hover labels render on a flat
// overlay outside the tilted plane so they are
// never distorted.
// ============================================
(function initWheel() {
  const wheel = document.querySelector('[data-wheel]');
  if (!wheel) return;
  const ring = wheel.querySelector('.wheel__ring');
  const tiles = Array.from(wheel.querySelectorAll('.wheel__tile'));
  const stepDeg = 360 / tiles.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const BASE_SPEED = 0.12; // deg per frame
  // Orbit geometry. SQUASH flattens the circle into a clear ellipse;
  // SKEW leans that ellipse diagonally (tiles counter-rotate by +SKEW
  // so logos stay upright). Depth along the orbit drives scale/opacity
  // and zIndex, so near tiles genuinely overlap far ones.
  const SQUASH = 0.38;
  const SKEW = -12; // must match .wheel__ring rotate() in styles.css
  const SCALE_MIN = 0.58, SCALE_MAX = 1.18;
  const OPACITY_MIN = 0.45, OPACITY_MAX = 1;
  const items = Array.from(wheel.querySelectorAll('.wheel__item'));

  let angle = 0;
  let velocity = 0;
  let rafId = null;
  let dragging = false;
  let lastPointerAngle = 0;
  let radius = 0;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function measure() {
    const box = wheel.clientWidth;
    const tileW = tiles[0] ? tiles[0].offsetWidth : 80;
    radius = Math.max(0, (box - tileW * SCALE_MAX) / 2);
  }

  // Flat label overlay (lives in .hero__stage, outside the orbit)
  const label = document.querySelector('.wheel__label');
  const labelHost = label ? label.parentElement : null;
  let hoverTile = null;

  function positionLabel() {
    if (!hoverTile || !label) return;
    const hostRect = labelHost.getBoundingClientRect();
    const r = hoverTile.getBoundingClientRect();
    label.style.left = (r.left + r.width / 2 - hostRect.left) + 'px';
    label.style.top = (r.bottom - hostRect.top + 10) + 'px';
  }

  if (label) {
    tiles.forEach(tile => {
      const show = () => {
        hoverTile = tile;
        label.textContent = tile.dataset.label || '';
        label.classList.add('on');
        positionLabel();
      };
      const hide = () => {
        if (hoverTile === tile) { hoverTile = null; label.classList.remove('on'); }
      };
      tile.addEventListener('pointerenter', show);
      tile.addEventListener('pointerleave', hide);
      tile.addEventListener('focus', show);
      tile.addEventListener('blur', hide);
    });
  }

  function render() {
    items.forEach((item, i) => {
      const theta = (angle + i * stepDeg) * Math.PI / 180;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius * SQUASH;
      // depth: 0 at the top of the ellipse (far), 1 at the bottom (near)
      const depth = (Math.sin(theta) + 1) / 2;
      const scale = SCALE_MIN + (SCALE_MAX - SCALE_MIN) * depth;

      item.style.transform =
        'translate(-50%, -50%) translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px)' +
        ' rotate(' + (-SKEW) + 'deg) scale(' + scale.toFixed(3) + ')';
      item.style.opacity = (OPACITY_MIN + (OPACITY_MAX - OPACITY_MIN) * depth).toFixed(3);
      item.style.zIndex = String(Math.round(depth * 100));
    });
    positionLabel();
  }

  function loop() {
    if (!dragging) {
      // idle spin pauses while a tile is hovered, so its label stays readable
      angle += (hoverTile ? 0 : BASE_SPEED) + velocity;
      velocity *= 0.94;
      if (Math.abs(velocity) < 0.002) velocity = 0;
    }
    render();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (reduceMotion.matches) { render(); return; } // static
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function pointerAngle(e) {
    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
  }

  wheel.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (reduceMotion.matches) {
      angle += e.deltaY * 0.15;
      render();
      return;
    }
    velocity = clamp(velocity + e.deltaY * 0.02, -14, 14);
  }, { passive: false });

  wheel.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastPointerAngle = pointerAngle(e);
    wheel.setPointerCapture(e.pointerId);
  });
  wheel.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const a = pointerAngle(e);
    let delta = a - lastPointerAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    angle += delta;
    velocity = clamp(delta, -15, 15);
    lastPointerAngle = a;
    if (reduceMotion.matches) render();
  });
  const endDrag = () => {
    dragging = false;
    if (reduceMotion.matches) velocity = 0;
  };
  wheel.addEventListener('pointerup', endDrag);
  wheel.addEventListener('pointercancel', endDrag);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', () => { stop(); velocity = 0; start(); });
  }
  window.addEventListener('resize', () => { measure(); render(); });

  measure();
  render();
  start();
  // re-measure once fonts/layout settle
  setTimeout(() => { measure(); render(); }, 300);
})();

// Experience section lives in experience-rail.js (renders from experience-data.js)

// ============================================
// PROJECTS RAIL
// Horizontal image-led cards; arrows + keyboard
// scroll by one card. Cards are plain links to
// their dedicated detail pages.
// ============================================
(function initRail() {
  document.querySelectorAll('[data-rail]').forEach(outer => {
    const rail = outer.querySelector('.proj-rail');
    if (!rail) return;
    const leftArrow = outer.querySelector('.rail-arrow.left');
    const rightArrow = outer.querySelector('.rail-arrow.right');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function scrollByCard(dir) {
      const card = rail.querySelector('.proj-card');
      const delta = card
        ? (card.getBoundingClientRect().width + 24) * dir
        : rail.clientWidth * 0.8 * dir;
      rail.scrollBy({ left: delta, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }

    leftArrow?.addEventListener('click', () => scrollByCard(-1));
    rightArrow?.addEventListener('click', () => scrollByCard(1));
    rail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCard(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCard(-1); }
    });
  });
})();

// ============================================
// HERO SPLIT REVEAL
// Desktop: the hero is pinned (position: sticky
// inside a tall wrapper) for ~1.3 viewport-heights
// of scroll; progress maps linearly and reversibly
// to scroll. p 0.15–0.85 slides the two portrait
// frames off along their diagonal seam, unmasking
// the wheel. <1024px: no pin — a one-time reveal
// when the stage scrolls into view. Reduced motion:
// static hero, frames hidden, wheel fully visible.
// ============================================
(function initHeroReveal() {
  const pin = document.querySelector('[data-hero-pin]');
  if (!pin) return;
  const hero = pin.querySelector('.hero');
  const wheelwrap = pin.querySelector('.hero__wheelwrap');
  const stage = pin.querySelector('.hero__stage');
  const f1 = pin.querySelector('.hero__frame--1');
  const f2 = pin.querySelector('.hero__frame--2');
  if (!hero || !wheelwrap || !stage || !f1 || !f2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  let mode = null;
  let rafPending = false;
  let observer = null;

  function apply(p) {
    // photos static 0–0.15, split 0.15–0.85, fully clear by 0.85
    const t = clamp((p - 0.15) / 0.7, 0, 1);
    f1.style.transform = 'translate(' + (-11 - 149 * t) + '%, ' + (-4 - 136 * t) + '%) rotate(' + (-15 - 10 * t) + 'deg)';
    f2.style.transform = 'translate(' + (11 + 149 * t) + '%, ' + (4 + 136 * t) + '%) rotate(' + (11 + 10 * t) + 'deg)';
    wheelwrap.style.opacity = (0.25 + 0.75 * t).toFixed(3);
    wheelwrap.style.transform = 'scale(' + (0.92 + 0.08 * t).toFixed(4) + ')';
  }

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const total = pin.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      apply(clamp(-pin.getBoundingClientRect().top / total, 0, 1));
    });
  }

  function clearInline() {
    [f1, f2, wheelwrap].forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
  }

  function setMode() {
    const next = reduceMotion.matches ? 'static' : (desktop.matches ? 'pin' : 'mobile');
    if (next === mode) return;
    mode = next;

    window.removeEventListener('scroll', onScroll);
    if (observer) { observer.disconnect(); observer = null; }
    clearInline();
    hero.classList.remove('is-revealed');

    pin.classList.toggle('hero-pin--active', mode === 'pin');
    hero.classList.toggle('hero--static', mode === 'static');
    hero.classList.toggle('hero--mobile', mode === 'mobile');

    if (mode === 'pin') {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    } else if (mode === 'mobile') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            hero.classList.add('is-revealed');
            observer.disconnect();
            observer = null;
          }
        });
      }, { threshold: 0.35 });
      observer.observe(stage);
    }
  }

  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', setMode);
  if (desktop.addEventListener) desktop.addEventListener('change', setMode);
  setMode();
})();
