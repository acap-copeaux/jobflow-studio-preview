const els = {
  projectName: document.getElementById('projectName'),
  companyName: document.getElementById('companyName'),
  targetText: document.getElementById('targetText'),
  sourceText: document.getElementById('sourceText'),
  sourceFile: document.getElementById('sourceFile'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  generateBtn: document.getElementById('generateBtn'),
  saveBtn: document.getElementById('saveBtn'),
  resetBtn: document.getElementById('resetBtn'),
  statLength: document.getElementById('statLength'),
  statWords: document.getElementById('statWords'),
  statSentences: document.getElementById('statSentences'),
  statKeywords: document.getElementById('statKeywords'),
  analysisOutput: document.getElementById('analysisOutput'),
  outputA: document.getElementById('outputA'),
  outputB: document.getElementById('outputB'),
  outputC: document.getElementById('outputC')
};

const STORAGE_KEY = 'jobflow_beta_workspace_v1';

function getWords(text) {
  return (text.match(/\b[\p{L}\p{N}'’-]+\b/gu) || []).map(w => w.toLowerCase());
}

function getSentences(text) {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
}

function topKeywords(text, limit = 5) {
  const stop = new Set(['de','la','le','les','des','du','un','une','et','ou','à','a','en','pour','sur','avec','dans','que','qui','au','aux','par','plus','est','sont','ce','cet','cette','ces','mon','ma','mes','son','sa','ses']);
  const freq = {};
  getWords(text).forEach(word => {
    if (word.length < 4 || stop.has(word)) return;
    freq[word] = (freq[word] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a,b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function updateStats(text) {
  const words = getWords(text);
  const sentences = getSentences(text);
  els.statLength.textContent = text.length;
  els.statWords.textContent = words.length;
  els.statSentences.textContent = sentences.length;
  const keywords = topKeywords(text);
  els.statKeywords.textContent = keywords.length ? keywords.join(', ') : '—';
}

function analyze() {
  const source = els.sourceText.value.trim();
  const target = els.targetText.value.trim();
  updateStats(source);

  if (!source) {
    els.analysisOutput.textContent = 'Ajoute un texte source avant de lancer l’analyse.';
    return;
  }

  const sentences = getSentences(source);
  const keywords = topKeywords(source, 6);
  const summary = [];
  summary.push(`Projet : ${els.projectName.value || '—'}`);
  summary.push(`Entreprise : ${els.companyName.value || '—'}`);
  summary.push(`Phrases détectées : ${sentences.length}`);
  summary.push(`Mots-clés dominants : ${keywords.length ? keywords.join(', ') : 'aucun'}`);
  if (target) {
    summary.push('Contexte cible : renseigné');
  } else {
    summary.push('Contexte cible : absent ou incomplet');
  }
  if (sentences[0]) {
    summary.push(`Phrase d’ouverture repérée : ${sentences[0]}`);
  }
  els.analysisOutput.textContent = summary.join('\n');
}

function generate() {
  const project = els.projectName.value.trim() || 'Projet';
  const company = els.companyName.value.trim() || 'Entreprise';
  const source = els.sourceText.value.trim();
  const target = els.targetText.value.trim();
  const sentences = getSentences(source);
  const opener = sentences[0] || 'Base à compléter.';
  const second = sentences[1] || 'Élément secondaire à préciser.';

  els.outputA.value = `Version A — ${project}\n\nContexte : ${company}\n\nBase retenue : ${opener}\n\nCible : ${target || 'à compléter'}\n\nSynthèse : cette version conserve une structure simple et exploitable.`;

  els.outputB.value = `Version B — ${project}\n\nContexte : ${company}\n\nBase retenue : ${opener}\n\nDéveloppement : ${second}\n\nOrientation : cette version pousse une formulation plus claire et plus structurée.`;

  els.outputC.value = `Version C — ${project}\n\nBloc court : ${opener}\n\nCible : ${target || 'à compléter'}\n\nOrientation : cette version reste plus concise et plus rapide à relire.`;
}

function saveState() {
  const data = {
    projectName: els.projectName.value,
    companyName: els.companyName.value,
    targetText: els.targetText.value,
    sourceText: els.sourceText.value,
    analysisOutput: els.analysisOutput.textContent,
    outputA: els.outputA.value,
    outputB: els.outputB.value,
    outputC: els.outputC.value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const data = JSON.parse(raw);
  els.projectName.value = data.projectName || '';
  els.companyName.value = data.companyName || '';
  els.targetText.value = data.targetText || '';
  els.sourceText.value = data.sourceText || '';
  els.analysisOutput.textContent = data.analysisOutput || 'Aucune analyse pour le moment.';
  els.outputA.value = data.outputA || '';
  els.outputB.value = data.outputB || '';
  els.outputC.value = data.outputC || '';
  updateStats(els.sourceText.value || '');
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  Object.values(els).forEach(el => {
    if (!el) return;
    if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')) el.value = '';
  });
  els.analysisOutput.textContent = 'Aucune analyse pour le moment.';
  els.outputA.value = '';
  els.outputB.value = '';
  els.outputC.value = '';
  updateStats('');
}

els.sourceFile.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  els.sourceText.value = text;
  updateStats(text);
});

els.analyzeBtn.addEventListener('click', analyze);
els.generateBtn.addEventListener('click', generate);
els.saveBtn.addEventListener('click', saveState);
els.resetBtn.addEventListener('click', resetState);
els.sourceText.addEventListener('input', () => updateStats(els.sourceText.value));

loadState();
updateStats(els.sourceText.value || '');
console.log('Jobflow Studio Beta prototype ready.');
