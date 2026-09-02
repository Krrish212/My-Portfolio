// ============================================
// EXPERIENCE DATA
// Single source of truth for the Experience rail.
// Edit copy here — ExperienceRail renders from it.
//
// `meta` is the combined line used by the REST state.
// `title` is the JOB ROLE (the bold h3). `descriptor` is the project line
// shown in the open state's left column and inside `meta` at rest.
// `metrics` is the accent middot row under the open title.
// `stack` fills the open state's TECH STACK sidebar.
// ============================================
window.EXPERIENCE = [
  {
    id: 'accenture',
    company: 'Accenture',
    monogram: 'A',
    accent: '#8b5cf6',
    // Marks are cropped to their own ink (see public/logos/*-mark.png), so
    // logoHeight is the only knob needed to balance them optically: the two
    // near-square marks sit taller than the wide dojo wordmark.
    // logoTint:true masks the mark and paints it in the card accent; set false
    // for a multi-colour mark, which is shown as-is at 90%.
    logo: 'public/logos/accenture-mark.png',
    logoTint: true,
    logoHeight: 46,
    meta: 'ACCENTURE · 2025 · THREAT-INTEL PIPELINES & A RAG CHATBOT POC',
    descriptor: 'THREAT-INTEL PIPELINES & A RAG CHATBOT POC',
    date: '2025',
    title: 'AI/ML Engineer Intern',
    summary: 'RAG chatbot POC, threat-intel dashboards, and MLOps risk-rule endpoints on Databricks.',
    pills: ['Hybrid retrieval', 'PySpark + Unity Catalogue', 'MLOps rule endpoints'],
    metrics: ['ADVANCED RAG', 'HYBRID RETRIEVAL', 'MLOPS RULE ENDPOINTS'],
    body: [
      'Engineered PySpark and SQL pipelines over Delta tables governed by Unity Catalogue, joining disparate sources into a unified model that powered interactive threat intelligence dashboards for senior clientele.',
      'Architected a RAG chatbot proof-of-concept using semantic clustering for context grouping, Azure AI Search for retrieval, and Sentence Transformer embeddings served through a hybrid retrieval index for low-latency search.',
      'Built an LLM evaluation loop grounded in RAG design principles, adding automated post-retrieval query rewriting to improve context relevance and reduce hallucination in generated responses.',
      'Defined CRA/EDD customer risk rules and exposed them as Databricks endpoints within an MLOps workflow, and authored High-Level Architecture diagrams adopted by senior engineers and PMs.'
    ],
    stack: ['PySpark', 'Databricks', 'Azure AI Search', 'Sentence Transformers', 'Hybrid Retrieval', 'SQL', 'MLOps']
  },
  {
    id: 'barclays',
    company: 'Barclays',
    monogram: 'B',
    accent: '#38bdf8',
    logo: 'public/logos/barclays-mark.png',
    logoTint: true,
    logoHeight: 48,
    meta: 'BARCLAYS · 2025 · MODELLING £30M+ REAL-ESTATE PORTFOLIO RISK',
    descriptor: 'MODELLING £30M+ REAL-ESTATE PORTFOLIO RISK',
    date: '2025',
    title: 'Corporate Banking Analyst',
    summary: 'Covenant risk, refinancing exposure, and portfolio dashboards for commercial real estate.',
    pills: ['£30M+ portfolio analysed', 'LTV / ICR modelling', 'Dashboard reporting'],
    metrics: ['£30M+ PORTFOLIO ANALYSED', 'LTV / ICR MODELLING', 'DASHBOARD REPORTING'],
    body: [
      'Analysed £30M+ commercial real estate portfolios on the Real Estate Team, modelling Loan-to-Value and Interest Coverage Ratio to assess covenant compliance, refinancing risk, and exposure trends.',
      'Supported end-to-end project delivery by coordinating data input and generating insights for refinancing risk, exposure trends, and committee presentations.',
      'Designed Excel-based portfolio dashboards tracking loan pipelines, occupancy-related metrics, covenant trends, and asset performance, strengthening reporting used across the asset management cycle.'
    ],
    stack: ['LTV/ICR Modelling', 'Excel (Advanced)', 'Risk Analysis', 'Committee Reporting']
  },
  {
    id: 'dojo',
    company: 'Dojo',
    monogram: 'D',
    accent: '#34d399',
    // a wide wordmark rather than a mark, so it needs less height to carry the
    // same visual weight as the chevron and the eagle
    logo: 'public/logos/dojo-mark.png',
    logoTint: true,
    logoHeight: 30,
    // the mark spells the name, so the panel's name label under it would just
    // repeat it — hidden, but its space kept so all three marks stay aligned
    logoIsWordmark: true,
    meta: 'DOJO · 2023 · OPTIMISING APIS BEHIND 30M+ WEEKLY TRANSACTIONS',
    descriptor: 'OPTIMISING APIS BEHIND 30M+ WEEKLY TRANSACTIONS',
    date: '2023',
    title: 'Product Management Intern',
    summary: 'API reliability work and agile delivery behind a high-volume payments platform.',
    pills: ['30M+ weekly transactions', 'Agile sprint delivery'],
    metrics: ['30M+ WEEKLY TRANSACTIONS', 'AGILE SPRINT DELIVERY'],
    body: [
      "Collaborated with engineers to optimise RESTful API calls supporting 30M+ weekly transactions across Dojo's payments infrastructure, improving reliability and user experience.",
      'Facilitated agile sprints, translating business requirements into data-driven priorities and aligning deliverables with customer-focused roadmaps.',
      'Strengthened technical communication and project delivery through visualisation, sprint reporting, and stakeholder alignment, enhancing transparency and collaboration across teams.'
    ],
    stack: ['RESTful APIs', 'Agile', 'Sprint Reporting', 'Stakeholder Alignment']
  }
];
