'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ─── STEPS DATA ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'overview', icon: '◈', title: 'Panoramica', sub: 'Idea & azienda',
    fields: [
      { key: 'companyName', label: 'Nome azienda / progetto', type: 'text', placeholder: 'Es. TechFlow S.r.l.', required: true },
      { key: 'sector', label: 'Settore di appartenenza', type: 'text', placeholder: 'Es. SaaS B2B, Food Tech, E-commerce...', required: true },
      { key: 'stage', label: 'Fase del progetto', type: 'select', required: true, options: ['Idea (pre-seed)', 'MVP / Prototipo', 'Early Stage (seed)', 'Growth Stage', 'Scale-up', 'Azienda consolidata'] },
      { key: 'country', label: 'Mercato principale', type: 'text', placeholder: 'Es. Italia, Europa, USA...', required: true },
      { key: 'description', label: 'Descrivi brevemente il business', type: 'textarea', placeholder: 'Cosa fa la tua azienda? Quale problema risolve?', required: true },
    ],
  },
  {
    id: 'vision', icon: '◎', title: 'Vision & Mission', sub: 'Identità strategica',
    fields: [
      { key: 'vision', label: 'Vision (dove vuoi arrivare in 5-10 anni)', type: 'textarea', placeholder: 'Es. Diventare il leader europeo nel settore X...', required: true },
      { key: 'mission', label: 'Mission (cosa fai ogni giorno e per chi)', type: 'textarea', placeholder: 'Es. Forniamo soluzioni Y a PMI del settore Z...', required: true },
      { key: 'values', label: 'Valori aziendali', type: 'text', placeholder: 'Es. Innovazione, Trasparenza, Sostenibilità' },
      { key: 'uniqueAdvantage', label: 'Vantaggio competitivo unico (USP)', type: 'textarea', placeholder: 'Cosa ti differenzia in modo unico dalla concorrenza?', required: true },
    ],
  },
  {
    id: 'market', icon: '◉', title: 'Analisi di Mercato', sub: 'TAM · SAM · SOM',
    fields: [
      { key: 'targetCustomer', label: 'Cliente target principale', type: 'textarea', placeholder: 'Età, ruolo, settore, dimensione azienda...', required: true },
      { key: 'marketSize', label: 'Dimensione stimata del mercato', type: 'text', placeholder: 'Es. ~€1.2 mld mercato CRM Italia (opzionale, AI lo cercherà)' },
      { key: 'painPoints', label: 'Pain points principali del cliente', type: 'textarea', placeholder: 'Quali problemi urgenti risolvi?', required: true },
      { key: 'marketTrends', label: 'Trend di mercato rilevanti', type: 'textarea', placeholder: 'Es. Crescita 35% AI enterprise, digitalizzazione PMI...', required: true },
      { key: 'geography', label: 'Geografie target', type: 'text', placeholder: 'Es. Italia 2025, UE 2026, US 2027', required: true },
    ],
  },
  {
    id: 'competition', icon: '◆', title: 'Analisi Competitiva', sub: 'Posizionamento',
    fields: [
      { key: 'mainCompetitors', label: 'Principali concorrenti diretti', type: 'textarea', placeholder: 'Es. Competitor A (leader mercato), Competitor B (low cost)...', required: true },
      { key: 'indirectCompetitors', label: 'Concorrenti indiretti / sostituti', type: 'text', placeholder: 'Es. Excel, soluzioni interne, consulenti freelance...' },
      { key: 'competitiveAdvantage', label: 'In cosa sei meglio dei competitor?', type: 'textarea', placeholder: 'Prezzo, velocità, integrazione, supporto, tecnologia...', required: true },
      { key: 'barriers', label: 'Barriere all\'ingresso che crei', type: 'text', placeholder: 'Es. Dati proprietari, brevetti, network effect...' },
    ],
  },
  {
    id: 'product', icon: '◇', title: 'Prodotto / Servizio', sub: 'Offerta & roadmap',
    fields: [
      { key: 'productDescription', label: 'Descrizione dettagliata prodotto/servizio', type: 'textarea', placeholder: 'Come funziona? Quali feature principali?', required: true },
      { key: 'revenueModel', label: 'Modello di ricavo', type: 'select', required: true, options: ['Abbonamento SaaS', 'Freemium + Upgrade', 'Pay-per-use', 'Licensing B2B', 'Marketplace', 'E-commerce prodotti fisici', 'Servizi professionali', 'Misto'] },
      { key: 'pricing', label: 'Strategia di pricing', type: 'textarea', placeholder: 'Es. Base €29/mese, Pro €79/mese, Enterprise custom...', required: true },
      { key: 'roadmap', label: 'Roadmap prodotto (12 mesi)', type: 'textarea', placeholder: 'Q1: MVP, Q2: Feature X, Q3: Launch UE...' },
    ],
  },
  {
    id: 'marketing', icon: '◫', title: 'Marketing & Vendite', sub: 'Acquisizione & crescita',
    fields: [
      { key: 'channels', label: 'Canali di acquisizione clienti', type: 'textarea', placeholder: 'Es. SEO, LinkedIn Ads, Partnership, Cold outreach...', required: true },
      { key: 'salesStrategy', label: 'Strategia di vendita', type: 'select', required: true, options: ['Self-service (product-led)', 'Inbound + SDR', 'Enterprise sales', 'Channel partners', 'Retail / distribuzione', 'Misto'] },
      { key: 'cac', label: 'CAC stimato', type: 'text', placeholder: 'Es. ~€150 per cliente B2B SME' },
      { key: 'ltv', label: 'LTV stimato', type: 'text', placeholder: 'Es. ~€2.400 su 24 mesi' },
      { key: 'marketingBudget', label: 'Budget marketing annuale', type: 'text', placeholder: 'Es. €50K anno 1, €120K anno 2', required: true },
    ],
  },
  {
    id: 'operations', icon: '◱', title: 'Operazioni & Team', sub: 'Struttura organizzativa',
    fields: [
      { key: 'founders', label: 'Fondatori / Team chiave', type: 'textarea', placeholder: 'Es. CEO: 10 anni fintech, CTO: ex Google...', required: true },
      { key: 'teamSize', label: 'Dimensione attuale del team', type: 'select', required: true, options: ['Solo founder', '2-3 persone', '4-10 persone', '11-30 persone', '31-100 persone', '100+ persone'] },
      { key: 'hiringPlan', label: 'Piano di assunzioni (12-24 mesi)', type: 'textarea', placeholder: 'Es. +2 developer Q1, +1 sales Q2...' },
      { key: 'keyPartners', label: 'Partner strategici e fornitori chiave', type: 'text', placeholder: 'Es. AWS, Salesforce, partner fintech...' },
    ],
  },
  {
    id: 'financials', icon: '◳', title: 'Proiezioni Finanziarie', sub: 'P&L & metriche',
    fields: [
      { key: 'currentRevenue', label: 'Fatturato / MRR attuale', type: 'text', placeholder: 'Es. €0 (pre-revenue) oppure €8K/mese MRR' },
      { key: 'revenueTarget', label: 'Target ricavi Anno 1 / Anno 3', type: 'text', placeholder: 'Es. Anno 1: €200K ARR · Anno 3: €2M ARR', required: true },
      { key: 'fixedCosts', label: 'Costi fissi mensili stimati', type: 'text', placeholder: 'Es. Team €15K, Infra €2K, Ufficio €1K...', required: true },
      { key: 'margins', label: 'Margine lordo stimato a regime', type: 'text', placeholder: 'Es. 70% gross margin (SaaS tipico)' },
      { key: 'breakeven', label: 'Stima punto di pareggio', type: 'text', placeholder: 'Es. Mese 18 con 250 clienti paganti' },
    ],
  },
  {
    id: 'funding', icon: '◰', title: 'Finanziamento', sub: 'Capitali & investitori',
    fields: [
      { key: 'fundingNeeded', label: 'Capitale richiesto', type: 'text', placeholder: 'Es. €500.000 seed round', required: true },
      { key: 'fundingUse', label: 'Come utilizzerai i fondi', type: 'textarea', placeholder: 'Es. 60% prodotto, 30% marketing, 10% legale...', required: true },
      { key: 'fundingType', label: 'Tipo di finanziamento cercato', type: 'select', required: true, options: ['Equity (partecipazione)', 'Prestito bancario', 'Grant / Bando pubblico', 'Revenue-based financing', 'Crowdfunding', 'Non cerco finanziamenti'] },
      { key: 'exitStrategy', label: 'Exit strategy', type: 'select', options: ['Nessuna (crescita sostenibile)', 'Acquisizione strategica', 'IPO / Quotazione', 'Management buyout', 'Da definire'] },
    ],
  },
  {
    id: 'risks', icon: '◲', title: 'Rischi & Mitigazioni', sub: 'Scenari & contingenze',
    fields: [
      { key: 'mainRisks', label: 'Principali rischi di business (top 3-5)', type: 'textarea', placeholder: 'Es. Rischio tecnologico, regolatorio, mercato...', required: true },
      { key: 'mitigations', label: 'Strategie di mitigazione', type: 'textarea', placeholder: 'Come affronteresti ogni scenario negativo?', required: true },
      { key: 'regulatoryIssues', label: 'Aspetti normativi / compliance', type: 'text', placeholder: 'Es. GDPR, PSD2, ISO 27001...' },
      { key: 'additionalNotes', label: 'Note aggiuntive', type: 'textarea', placeholder: 'Qualsiasi info extra rilevante...' },
    ],
  },
];

// ─── MARKDOWN RENDERER ───────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{ fontSize: 16, fontWeight: 700, margin: '28px 0 8px', paddingBottom: 8, borderBottom: '2px solid #111', color: '#111' }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} style={{ fontSize: 13, fontWeight: 700, margin: '16px 0 5px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('| ')) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith('| ')) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0].split('|').filter(c => c.trim());
      const rows = tableLines.slice(2).map(r => r.split('|').filter(c => c.trim()));
      elements.push(
        <div key={`t${i}`} style={{ overflowX: 'auto', margin: '8px 0 14px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f5f5f0' }}>
                {headers.map((h, j) => <th key={j} style={{ padding: '7px 10px', textAlign: 'left', fontWeight: 600, border: '1px solid #e0e0dc', fontSize: 11 }}>{h.trim()}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#fafaf8' }}>
                  {row.map((cell, ci) => <td key={ci} style={{ padding: '6px 10px', border: '1px solid #eeeeea', color: '#444', fontSize: 12 }}>{cell.trim()}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <p key={i} style={{ margin: '3px 0', fontSize: 13, color: '#555', paddingLeft: 16, position: 'relative', lineHeight: 1.65 }}>
          <span style={{ position: 'absolute', left: 0, color: '#aaa', fontSize: 10, top: 4 }}>▸</span>
          {parseBold(line.replace(/^[-*]\s/, ''))}
        </p>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 8 }} />);
    } else {
      elements.push(
        <p key={i} style={{ fontSize: 13, color: '#444', lineHeight: 1.75, margin: '3px 0' }}>
          {parseBold(line)}
        </p>
      );
    }
    i++;
  }
  return elements;
}

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ fontWeight: 700, color: '#111' }}>{p.slice(2, -2)}</strong>
      : p
  );
}

// ─── MAIN WIZARD PAGE ────────────────────────────────────────────────────────
export default function WizardPage() {
  const [view, setView] = useState('wizard'); // wizard | generating | output
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [output, setOutput] = useState('');
  const [genProgress, setGenProgress] = useState(0);
  const [genStage, setGenStage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [searchQueries, setSearchQueries] = useState([]);

  // Genera UUID utente e imposta cookie al mount
  useEffect(() => {
    let uid = document.cookie.match(/pf_uid=([^;]+)/)?.[1];
    if (!uid) {
      uid = crypto.randomUUID();
      document.cookie = `pf_uid=${uid}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    }
    // Controlla se arrivo da upgrade Stripe
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgrade') === 'success') {
      setView('wizard');
    }
  }, []);

  const cur = STEPS[step];
  const reqFields = cur.fields.filter(f => f.required);
  const isValid = reqFields.every(f => data[f.key]?.trim?.());

  const handleChange = (key, val) => setData(d => ({ ...d, [key]: val }));

  const STAGES = [
    'Elaborazione dati inseriti...',
    'Ricerca dati di mercato con Google...',
    'Analisi competitor e benchmark...',
    'Modellazione proiezioni finanziarie...',
    'Redazione sezioni strategiche...',
    'Revisione e ottimizzazione finale...',
  ];

  const generate = useCallback(async () => {
    setView('generating');
    setGenProgress(5);
    setError('');

    let stageIdx = 0;
    setGenStage(STAGES[0]);

    const stageInterval = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, STAGES.length - 1);
      setGenStage(STAGES[stageIdx]);
    }, 8000);

    const progressInterval = setInterval(() => {
      setGenProgress(p => Math.min(p + 1.2, 88));
    }, 600);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: data }),
      });

      clearInterval(stageInterval);
      clearInterval(progressInterval);
      setGenProgress(95);

      const result = await res.json();

      if (res.status === 402 && result.error === 'UPGRADE_REQUIRED') {
        setShowUpgrade(true);
        setView('wizard');
        return;
      }

      if (!res.ok) {
        setError(result.error || 'Errore sconosciuto. Riprova.');
        setView('wizard');
        return;
      }

      setOutput(result.text);
      setSearchQueries(result.searchQueries || []);
      setGenProgress(100);
      setTimeout(() => setView('output'), 400);

    } catch (err) {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      setError('Errore di connessione. Controlla la rete e riprova.');
      setView('wizard');
    }
  }, [data]);

  const wordCount = output.split(/\s+/).filter(Boolean).length;

  // ─── VIEWS ────────────────────────────────────────────────────────────────

  if (view === 'generating') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>◈</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Creazione in corso...</h2>
          <p style={{ fontSize: 14, color: '#777', marginBottom: 32 }}>{genStage}</p>

          <div style={{ height: 4, background: '#e8e8e4', borderRadius: 4, marginBottom: 32, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${genProgress}%`,
              background: '#111', borderRadius: 4,
              transition: 'width 0.5s ease',
            }} />
          </div>

          <div style={{ textAlign: 'left' }}>
            {STAGES.map((s, i) => {
              const idx = STAGES.indexOf(genStage);
              return (
                <div key={s} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                    background: i < idx ? '#f0fdf4' : i === idx ? '#111' : 'transparent',
                    color: i < idx ? '#16a34a' : i === idx ? '#fff' : '#ccc',
                    border: i >= idx ? '1px solid #e0e0dc' : 'none',
                  }}>
                    {i < idx ? '✓' : i === idx ? '·' : ''}
                  </div>
                  <span style={{ fontSize: 13, color: i < idx ? '#16a34a' : i === idx ? '#111' : '#bbb', fontWeight: i === idx ? 600 : 400 }}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: 11, color: '#aaa', marginTop: 24 }}>
            L'AI sta cercando dati reali con Google Search · ~30-60 secondi
          </p>
        </div>
      </div>
    );
  }

  if (view === 'output') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f8f6' }}>
        {/* Header */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e2e2de',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, gap: 12 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Business Plan — {data.companyName}</span>
              <span style={{ fontSize: 12, color: '#aaa', marginLeft: 10 }}>{wordCount.toLocaleString()} parole</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{
                  padding: '6px 14px', fontSize: 12, fontWeight: 600,
                  border: '1px solid #ddd', borderRadius: 7,
                  background: copied ? '#f0fdf4' : '#fff', color: copied ? '#16a34a' : '#333',
                }}>
                {copied ? '✓ Copiato!' : 'Copia testo'}
              </button>
              <button
                onClick={() => { setView('wizard'); setStep(0); setOutput(''); }}
                style={{ padding: '6px 14px', fontSize: 12, border: '1px solid #ddd', borderRadius: 7, background: '#fff', color: '#555' }}>
                Nuovo piano
              </button>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '24px 20px' }}>
          {/* Meta cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 16 }}>
            {[
              ['Settore', data.sector],
              ['Fase', data.stage?.split(' ')[0]],
              ['Mercato', data.country],
              ['Modello', data.revenueModel?.split(' ')[0]],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: '10px 12px', background: '#fff', border: '1px solid #e2e2de', borderRadius: 8 }}>
                <p style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>{l}</p>
                <p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v || '—'}</p>
              </div>
            ))}
          </div>

          {/* Search queries usate */}
          {searchQueries.length > 0 && (
            <div style={{
              padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: 8, marginBottom: 16, fontSize: 12, color: '#1d4ed8',
            }}>
              <strong>◉ Dati cercati con Google:</strong> {searchQueries.join(' · ')}
            </div>
          )}

          {/* Document */}
          <div style={{
            background: '#fff', border: '1px solid #e2e2de', borderRadius: 12,
            padding: '28px 32px', marginBottom: 20,
          }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              Business Plan — {data.companyName}
            </h1>
            <p style={{ fontSize: 12, color: '#aaa', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f0f0ec' }}>
              {data.sector} · {data.country} · {new Date().toLocaleDateString('it-IT')} · Generato da PlanForge AI
            </p>
            {renderMarkdown(output)}
          </div>

          {/* CTA upgrade */}
          <div style={{
            padding: '16px 20px', background: '#111', borderRadius: 12, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>Vuoi piani illimitati e export PDF?</p>
              <p style={{ fontSize: 13, color: '#aaa' }}>Passa a PlanForge Pro per €19/mese</p>
            </div>
            <a href="/api/checkout" style={{
              padding: '9px 20px', background: '#fff', color: '#111',
              borderRadius: 8, fontSize: 13, fontWeight: 700,
            }}>
              Passa a Pro →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── WIZARD VIEW ──────────────────────────────────────────────────────────
  const progress = Math.round((step / STEPS.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e2de', height: 52, display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 18 }}>◈</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>PlanForge</span>
          </Link>
          <span style={{ fontSize: 12, color: '#aaa' }}>Step {step + 1} di {STEPS.length}</span>
        </div>
      </nav>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 20,
        }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 32, maxWidth: 400, width: '100%' }}>
            <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>◈</div>
            <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Limite gratuito raggiunto</h2>
            <p style={{ textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Hai usato il tuo piano gratuito. Passa a Pro per generare piani illimitati, esportare in PDF e ricevere supporto prioritario.
            </p>
            <a href="/api/checkout" style={{
              display: 'block', textAlign: 'center', padding: '12px',
              background: '#111', color: '#fff', borderRadius: 9, fontWeight: 700, marginBottom: 10,
            }}>
              Passa a Pro — €19/mese →
            </a>
            <button onClick={() => setShowUpgrade(false)} style={{
              display: 'block', width: '100%', textAlign: 'center',
              padding: '10px', border: '1px solid #ddd', borderRadius: 9, fontSize: 13, color: '#555',
            }}>
              Annulla
            </button>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '32px 20px', maxWidth: 600 }}>
        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, cursor: i <= step ? 'pointer' : 'default',
                transition: 'all 0.2s',
                background: i < step ? '#111' : i === step ? '#111' : 'transparent',
                color: i <= step ? '#fff' : '#ccc',
                border: i > step ? '1px solid #ddd' : 'none',
              }} onClick={() => i <= step && setStep(i)}>
                {i < step ? '✓' : i + 1}
              </div>
            ))}
          </div>
          <div style={{ height: 3, background: '#e8e8e4', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#111', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Step header */}
        <div style={{
          background: '#fff', border: '1px solid #e2e2de', borderRadius: 12,
          padding: '24px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 24 }}>{cur.icon}</span>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{cur.title}</h2>
              <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{cur.sub}</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#dc2626',
            }}>
              {error}
            </div>
          )}

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cur.fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#333' }}>
                  {f.label}
                  {!f.required && <span style={{ fontSize: 11, color: '#bbb', fontWeight: 400, marginLeft: 6 }}>(opzionale)</span>}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={data[f.key] || ''}
                    onChange={e => handleChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    rows={3}
                    style={{ lineHeight: 1.6 }}
                  />
                ) : f.type === 'select' ? (
                  <select value={data[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)}>
                    <option value="">— Seleziona —</option>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={data[f.key] || ''}
                    onChange={e => handleChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              padding: '10px 20px', fontSize: 14, fontWeight: 500,
              border: '1px solid #ddd', borderRadius: 8,
              background: '#fff', color: step === 0 ? '#ccc' : '#333',
              opacity: step === 0 ? 0.5 : 1,
            }}>
            ← Indietro
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!isValid}
              style={{
                padding: '10px 24px', fontSize: 14, fontWeight: 700,
                border: 'none', borderRadius: 8,
                background: isValid ? '#111' : '#ccc',
                color: '#fff', cursor: isValid ? 'pointer' : 'default',
              }}>
              Avanti →
            </button>
          ) : (
            <button
              onClick={generate}
              disabled={!isValid}
              style={{
                padding: '10px 24px', fontSize: 14, fontWeight: 700,
                border: 'none', borderRadius: 8,
                background: isValid ? '#111' : '#ccc',
                color: '#fff', cursor: isValid ? 'pointer' : 'default',
              }}>
              Genera Business Plan ◈
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
