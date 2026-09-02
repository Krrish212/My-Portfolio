// ============================================
// NLP CASE STUDY — live tokenisation demo
// Runs the first three pipeline stages on whatever is in the textarea:
// sanitise, stop word filtering, n-gram expansion.
// Entirely client-side — no network calls, no dependencies.
// ============================================
(function initNlpDemo() {
  const input = document.getElementById('nlp-demo-input');
  if (!input) return;

  const outClean = document.getElementById('nlp-out-clean');
  const outTokens = document.getElementById('nlp-out-tokens');
  const outNgrams = document.getElementById('nlp-out-ngrams');
  const outCount = document.getElementById('nlp-out-count');

  // NLTK's English stop list, inlined so the demo has no dependency.
  const STOP = new Set((
    'i me my myself we our ours ourselves you your yours yourself yourselves ' +
    'he him his himself she her hers herself it its itself they them their ' +
    'theirs themselves what which who whom this that these those am is are ' +
    'was were be been being have has had having do does did doing a an the ' +
    'and but if or because as until while of at by for with about against ' +
    'between into through during before after above below to from up down in ' +
    'out on off over under again further then once here there when where why ' +
    'how all any both each few more most other some such no nor not only own ' +
    'same so than too very s t can will just don should now'
  ).split(' '));

  // The default input contains an HTML tag, and people paste arbitrary text.
  const esc = (s) => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function sanitise(raw) {
    return raw
      .toLowerCase()
      .replace(/<[^>]*>/g, ' ')                        // strip HTML tags
      .replace(/https?:\/\/\S+|www\.\S+/g, ' ')        // strip URLs
      .replace(/[!-\/:-@\[-`{-~]/g, ' ')               // punctuation -> space, not deleted
      .replace(/\s+/g, ' ')
      .trim();
  }

  function run() {
    const clean = sanitise(input.value);
    outClean.textContent = clean || '—';

    const tokens = clean ? clean.split(' ') : [];
    outTokens.innerHTML = tokens.length
      ? tokens.map(t => `<span class="nlp-tok${STOP.has(t) ? ' stop' : ''}">${esc(t)}</span>`).join('')
      : '—';

    const kept = tokens.filter(t => !STOP.has(t));
    const grams = { 1: [], 2: [], 3: [] };
    for (let n = 1; n <= 3; n++) {
      for (let i = 0; i + n <= kept.length; i++) grams[n].push(kept.slice(i, i + n).join(' '));
    }

    // chips are a truncated sample; the count line reports the true totals
    const sample = [
      ...grams[1].slice(0, 4).map(g => ['', g]),
      ...grams[2].slice(0, 3).map(g => ['bi', g]),
      ...grams[3].slice(0, 2).map(g => ['tri', g])
    ];
    outNgrams.innerHTML = sample.length
      ? sample.map(([cls, g]) => `<span class="nlp-tok ${cls}">${esc(g)}</span>`).join('')
      : '—';

    const total = grams[1].length + grams[2].length + grams[3].length;
    outCount.textContent = total
      ? `${total} features generated · ${grams[1].length} uni / ${grams[2].length} bi / ${grams[3].length} tri`
      : '';
  }

  input.addEventListener('input', run);
  run();
})();
