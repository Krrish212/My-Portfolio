// ============================================
// EXPERIENCE RAIL
// Horizontal fanned rail of three cards.
//
// OPEN-STATE APPROACH SHIPPED: horizontal accordion (the primary approach).
// The clicked card flex-grows to ~70% of the rail while the other two collapse
// to 72px spines showing a rotated company name + logo mark.
//
// The reflow hazard the brief warns about is handled rather than fought: while
// the rail has an open card, each collapsing card's inner content is pinned to
// its rest width via the --restw custom property and clipped by overflow:hidden,
// so the text never re-wraps as the container squeezes — it just slides out of
// view behind a fast opacity fade. No jank, so the fallback panel wasn't needed.
//
// Hover/sibling-push is pure CSS (:has()); JS owns open/close, keyboard, the
// <1024px snap rail, and rendering from window.EXPERIENCE.
// ============================================
(function initExperienceRail() {
  const rail = document.querySelector('[data-exp-rail]');
  if (!rail || !window.EXPERIENCE) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const snapMode = window.matchMedia('(max-width: 1023px) and (min-width: 768px)');
  const stackMode = window.matchMedia('(max-width: 767px)');

  const esc = (s) => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // ---------- render ----------
  rail.innerHTML = window.EXPERIENCE.map((e, i) => `
    <article class="exp-card" id="exp-card-${esc(e.id)}" style="--accent:${esc(e.accent)}">
      <div class="exp-card__inner">
        <div class="exp-card__logo${e.logoTint === false ? ' logo--multi' : ''}${e.logoIsWordmark ? ' logo--wordmark' : ''}"
             data-media style="--logo:url('${esc(e.logo)}');--mark-h:${Number(e.logoHeight) || 48}px">
          <span class="exp-card__markwrap">
            <img src="${esc(e.logo)}" alt="" data-fallback>
            <span class="exp-card__mark" aria-hidden="true"></span>
          </span>
          <span class="exp-card__lname">${esc(e.company)}</span>
          <span class="exp-card__wordmark">${esc(e.company)}</span>
        </div>
        <div class="exp-card__head">
          <p class="exp-card__meta">${esc(e.meta)}</p>
          <h3 class="exp-card__title">${esc(e.title)}</h3>
        </div>
        <p class="exp-card__metrics" style="--i:2">${e.metrics.map(esc).join(' · ')}</p>
        <div class="exp-card__teaser">
          <p class="exp-card__summary" style="--i:0">${esc(e.summary)}</p>
          <div class="exp-card__pills" style="--i:1">
            ${e.pills.map(p => `<span class="exp-pill">${esc(p)}</span>`).join('')}
          </div>
        </div>
        <div class="exp-card__foot">
          <p class="exp-card__cue">CLICK TO OPEN</p>
        </div>
        <div class="exp-card__bodywrap" id="exp-panel-${esc(e.id)}">
          <div class="exp-card__body">
            <div class="exp-card__grid">
              <div class="exp-card__col" style="--i:3">
                <p class="exp-card__roleline">
                  <span class="exp-card__descriptor">${esc(e.descriptor)}</span>
                  <span class="exp-card__date">${esc(e.date)}</span>
                </p>
                <p class="exp-card__lede">${esc(e.summary)}</p>
                ${e.body.map(p => `<p>${esc(p)}</p>`).join('')}
              </div>
              <aside class="exp-card__side" style="--i:3">
                <p class="exp-card__sidelabel">TECH STACK</p>
                <div class="exp-card__stack">
                  ${e.stack.map(t => `<span class="exp-stackpill">${esc(t)}</span>`).join('')}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <span class="exp-card__spine" aria-hidden="true">
        <span class="exp-card__spine-mark">${esc(e.monogram)}</span>
        <span class="exp-card__spine-name">${esc(e.company)}</span>
      </span>
      <button class="exp-card__trigger" type="button"
              aria-expanded="false" aria-controls="exp-panel-${esc(e.id)}"
              data-index="${i}">
        <span class="sr-only">${esc(e.company)} — ${esc(e.title)}, ${esc(e.date)}. Open case study.</span>
      </button>
    </article>
  `).join('');

  const cards = Array.from(rail.querySelectorAll('.exp-card'));
  const triggers = Array.from(rail.querySelectorAll('.exp-card__trigger'));

  // The real mark takes over from the text wordmark once it loads. A missing
  // file leaves .has-logo off and the letterspaced wordmark stands in.
  rail.querySelectorAll('.exp-card__logo img').forEach(img => {
    const mark = () => img.closest('.exp-card__logo').classList.add('has-logo');
    if (img.complete && img.naturalWidth > 0) mark();
    img.addEventListener('load', mark);
  });

  // Pin each card's rest width so collapsing cards don't re-wrap their text.
  function measure() {
    cards.forEach(card => {
      if (card.classList.contains('is-open')) return;
      const w = card.getBoundingClientRect().width;
      if (w > 80) card.style.setProperty('--restw', Math.round(w) + 'px');
    });
  }

  // ---------- open / close ----------
  let openId = null;

  function setOpen(id) {
    // remeasure before collapsing, while cards are still at rest width
    if (id !== null && openId === null) measure();
    openId = id;
    rail.classList.toggle('has-open', id !== null);
    cards.forEach((card, i) => {
      const isOpen = card.id === 'exp-card-' + id;
      card.classList.toggle('is-open', isOpen);
      triggers[i].setAttribute('aria-expanded', String(isOpen));
    });
  }

  function toggle(i) {
    const id = window.EXPERIENCE[i].id;
    setOpen(openId === id ? null : id);
  }

  triggers.forEach((btn, i) => {
    btn.addEventListener('click', () => toggle(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        triggers[Math.min(triggers.length - 1, i + 1)].focus();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        triggers[Math.max(0, i - 1)].focus();
      }
      if (e.key === 'Home') { e.preventDefault(); triggers[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); triggers[triggers.length - 1].focus(); }
      // Enter/Space fire click natively on <button>
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openId !== null) {
      const active = rail.querySelector('.exp-card.is-open .exp-card__trigger');
      setOpen(null);
      if (active) active.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (openId !== null && !rail.contains(e.target)) setOpen(null);
  });

  window.addEventListener('resize', () => {
    if (openId === null) measure();
  });

  // ---------- <1024px: active card = the one snapped to centre ----------
  let snapRaf = false;
  function updateSnap() {
    if (snapRaf) return;
    snapRaf = true;
    requestAnimationFrame(() => {
      snapRaf = false;
      if (!snapMode.matches) return;
      const mid = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      let best = null, bestD = Infinity;
      cards.forEach(card => {
        const r = card.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) { bestD = d; best = card; }
      });
      cards.forEach(card => card.classList.toggle('is-snapped', card === best));
    });
  }
  rail.addEventListener('scroll', updateSnap, { passive: true });

  function applyMode() {
    rail.classList.toggle('is-snaprail', snapMode.matches);
    rail.classList.toggle('is-stacked', stackMode.matches);
    if (!snapMode.matches) cards.forEach(c => c.classList.remove('is-snapped'));
    else updateSnap();
    if (stackMode.matches) setOpen(openId); // keep state, styles differ
    measure();
  }
  [snapMode, stackMode].forEach(mq => {
    if (mq.addEventListener) mq.addEventListener('change', applyMode);
  });
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', measure);

  applyMode();
  measure();
  setTimeout(measure, 300); // after fonts settle
})();
