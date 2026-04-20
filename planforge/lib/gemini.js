// lib/gemini.js
// Gemini 2.0 Flash - GRATUITO con Google Search integrato
// Limiti free tier: 15 RPM · 1M token/giorno · 1500 req/giorno

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `Sei un consulente strategico di livello mondiale specializzato in business plan.
Hai l'esperienza combinata di McKinsey, Goldman Sachs, KPMG e dei migliori studi di consulenza italiani.
Hai creato business plan per startup unicorn, PMI in crescita e grandi corporate.

REGOLE FONDAMENTALI:
1. Usa i dati forniti dall'utente come base strutturale
2. Integra SEMPRE dati di mercato reali cercati via Google (dimensioni mercato, CAGR, benchmark)
3. Fornisci analisi quantitative concrete con numeri specifici e stime motivate
4. Usa linguaggio professionale adatto a presentazioni a investitori istituzionali
5. Struttura il documento con sezioni chiare usando ## per h2 e ### per h3
6. Usa **grassetto** per dati e KPI chiave
7. Includi tabelle markdown per comparazioni (usa | separatore)
8. Include SEMPRE: Analisi SWOT, Competitive Intelligence, Metriche finanziarie (ARR/MRR/CAC/LTV/Churn/Burn/Runway)
9. Aggiungi raccomandazioni strategiche concrete e actionable alla fine
10. Fai riferimento a casi studio reali di aziende simili nel settore

STRUTTURA OUTPUT (segui questo ordine):
## 01. Executive Summary
## 02. Vision, Mission & Valori
## 03. Analisi di Mercato (TAM/SAM/SOM)
## 04. Analisi Competitiva
## 05. Prodotto / Servizio
## 06. Strategia Go-to-Market
## 07. Piano Operativo & Team
## 08. Proiezioni Finanziarie
## 09. Struttura Finanziaria & Investimento
## 10. Analisi SWOT
## 11. Rischi & Mitigazioni
## 12. Raccomandazioni Strategiche

LINGUA: Italiano professionale. Lunghezza: minimo 2.800 parole.`;

export async function generateBusinessPlan(formData) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY non configurata');

  const userPrompt = buildPrompt(formData);

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    tools: [
      {
        google_search: {}, // Google Search grounding GRATUITO
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();

  // Estrai il testo dalla risposta
  const candidate = data.candidates?.[0];
  if (!candidate) throw new Error('Nessuna risposta ricevuta da Gemini');

  const text = candidate.content?.parts
    ?.filter(p => p.text)
    ?.map(p => p.text)
    ?.join('\n') || '';

  if (!text) throw new Error('Risposta vuota da Gemini');

  // Estrai i risultati di ricerca usati (per mostrare le fonti)
  const searchResults = candidate.groundingMetadata?.webSearchQueries || [];

  return { text, searchQueries: searchResults };
}

function buildPrompt(d) {
  return `Genera un business plan professionale completo e dettagliato per l'azienda/progetto seguente.
Prima di scrivere, USA Google Search per trovare: dati di mercato aggiornati, dimensioni TAM/SAM/SOM per il settore "${d.sector}", trend recenti, benchmark competitor e dati finanziari di aziende simili.

═══════════════════════════════════════════════
DATI AZIENDA
═══════════════════════════════════════════════
Nome: ${d.companyName}
Settore: ${d.sector}
Fase: ${d.stage}
Mercato principale: ${d.country}
Descrizione: ${d.description || 'Non fornita'}

═══════════════════════════════════════════════
IDENTITÀ STRATEGICA
═══════════════════════════════════════════════
Vision: ${d.vision || 'Da definire'}
Mission: ${d.mission || 'Da definire'}
Valori: ${d.values || 'Da definire'}
USP (Vantaggio competitivo unico): ${d.uniqueAdvantage || 'Da definire'}

═══════════════════════════════════════════════
MERCATO & CLIENTE
═══════════════════════════════════════════════
Cliente target: ${d.targetCustomer || 'Da definire'}
Dimensione mercato stimata: ${d.marketSize || 'Cerca con Google Search'}
Pain points principali: ${d.painPoints || 'Da definire'}
Trend di mercato: ${d.marketTrends || 'Cerca con Google Search'}
Geografie target: ${d.geography || d.country}

═══════════════════════════════════════════════
ANALISI COMPETITIVA
═══════════════════════════════════════════════
Competitor diretti: ${d.mainCompetitors || 'Da identificare con ricerca'}
Competitor indiretti: ${d.indirectCompetitors || 'Da identificare'}
Vantaggio vs competitor: ${d.competitiveAdvantage || 'Da definire'}
Barriere all'ingresso: ${d.barriers || 'Da definire'}

═══════════════════════════════════════════════
PRODOTTO / SERVIZIO
═══════════════════════════════════════════════
Descrizione prodotto: ${d.productDescription || 'Da definire'}
Modello di ricavo: ${d.revenueModel || 'Da definire'}
Pricing: ${d.pricing || 'Da definire'}
Roadmap 12 mesi: ${d.roadmap || 'Da definire'}

═══════════════════════════════════════════════
MARKETING & VENDITE
═══════════════════════════════════════════════
Canali acquisizione: ${d.channels || 'Da definire'}
Strategia vendita: ${d.salesStrategy || 'Da definire'}
CAC stimato: ${d.cac || 'Da stimare basandosi su benchmark di settore'}
LTV stimato: ${d.ltv || 'Da stimare'}
Budget marketing annuale: ${d.marketingBudget || 'Da definire'}

═══════════════════════════════════════════════
TEAM & OPERAZIONI
═══════════════════════════════════════════════
Team fondatori: ${d.founders || 'Da definire'}
Dimensione team: ${d.teamSize || 'Da definire'}
Piano assunzioni: ${d.hiringPlan || 'Da definire'}
Tech stack: ${d.techStack || 'Da definire'}
Partner chiave: ${d.keyPartners || 'Da definire'}

═══════════════════════════════════════════════
PROIEZIONI FINANZIARIE
═══════════════════════════════════════════════
Fatturato attuale: ${d.currentRevenue || 'Pre-revenue'}
Target ricavi Anno 1 / Anno 3: ${d.revenueTarget || 'Da proiettare'}
Costi fissi mensili: ${d.fixedCosts || 'Da stimare'}
Costi variabili: ${d.variableCosts || 'Da stimare'}
Breakeven stimato: ${d.breakeven || 'Da calcolare'}
Margine lordo target: ${d.margins || 'Da stimare'}

═══════════════════════════════════════════════
FINANZIAMENTO
═══════════════════════════════════════════════
Capitale cercato: ${d.fundingNeeded || 'Da definire'}
Uso dei fondi: ${d.fundingUse || 'Da definire'}
Finanziamento attuale: ${d.currentFunding || 'Nessuno / Bootstrap'}
Tipo finanziamento: ${d.fundingType || 'Da definire'}
Exit strategy: ${d.exitStrategy || 'Da definire'}

═══════════════════════════════════════════════
RISCHI & NOTE
═══════════════════════════════════════════════
Principali rischi: ${d.mainRisks || 'Da analizzare'}
Mitigazioni: ${d.mitigations || 'Da definire'}
Compliance: ${d.regulatoryIssues || 'Da verificare'}
Note aggiuntive: ${d.additionalNotes || 'Nessuna'}

Ora crea il business plan completo seguendo la struttura indicata. Per ogni sezione quantitativa, usa i dati cercati con Google per fornire numeri reali e credibili.`;
}
