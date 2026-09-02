// ============================================
// CASE STUDY — scroll reveal
// Per-section fade/rise, fired once then unobserved.
// The plexus background is the site's shared canvas
// (script.js), which already freezes under
// prefers-reduced-motion.
// ============================================
(function initCaseStudyReveal() {
  const els = document.querySelectorAll('.cs .rv');
  if (!els.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => io.observe(el));
})();
