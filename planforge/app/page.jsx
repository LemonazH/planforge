'use client';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      {/* NAVBAR */}
      <nav style={{
        borderBottom: '1px solid #e2e2de', background: '#fff',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>◈</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>PlanForge</span>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 4,
              background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe',
              fontWeight: 600,
            }}>AI · BETA</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#pricing" style={{ fontSize: 13, color: '#555', padding: '6px 12px' }}>Prezzi</a>
            <Link href="/wizard" style={{
              fontSize: 13, fontWeight: 600, padding: '7px 16px',
              background: '#111', color: '#fff', borderRadius: 8,
            }}>
              Inizia gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 0 60px', background: '#fff', borderBottom: '1px solid #e2e2de' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, padding: '5px 14px', borderRadius: 20,
            background: '#f0fdf4', color: '#16a34a',
            border: '1px solid #bbf7d0', marginBottom: 24, fontWeight: 600,
          }}>
            ✦ Gratis · Nessuna carta di credito richiesta
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
            lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.02em',
          }}>
            Il tuo business plan<br />
            <span style={{ color: '#555' }}>professionale, in 12 minuti.</span>
          </h1>

          <p style={{
            fontSize: 18, color: '#555', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto 36px',
          }}>
            Rispondi a 10 sezioni strutturate. L'AI analizza dati di mercato reali,
            benchmark di settore e genera un piano pronto per investitori, banche e partner.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <Link href="/wizard" style={{
              fontSize: 16, fontWeight: 700, padding: '14px 32px',
              background: '#111', color: '#fff', borderRadius: 10,
              display: 'inline-block',
            }}>
              Crea il tuo Business Plan →
            </Link>
            <a href="#come-funziona" style={{
              fontSize: 15, padding: '14px 24px', border: '1px solid #ddd',
              borderRadius: 10, color: '#333', background: '#fff',
            }}>
              Come funziona
            </a>
          </div>
          <p style={{ fontSize: 12, color: '#aaa' }}>Piano gratuito include 1 business plan completo</p>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: '20px 0', background: '#f8f8f6', borderBottom: '1px solid #e2e2de' }}>
        <div className="container" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Startup & Founder', 'PMI in crescita', 'Studi di consulenza', 'Business angel', 'Commercialisti', 'Manager'].map(t => (
            <span key={t} style={{
              fontSize: 12, padding: '5px 12px', borderRadius: 20,
              border: '1px solid #e2e2de', color: '#555', background: '#fff',
            }}>{t}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="come-funziona" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
            Come funziona
          </h2>
          <p style={{ textAlign: 'center', color: '#777', marginBottom: 48, fontSize: 15 }}>
            Tre passaggi per un business plan che vale migliaia di euro di consulenza
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { n: '01', icon: '◈', t: 'Compila il wizard', d: '10 sezioni strutturate guidano la raccolta di tutti i dati rilevanti per il tuo business.' },
              { n: '02', icon: '◉', t: 'AI analizza e ricerca', d: 'Gemini AI cerca dati di mercato reali, analizza competitor e benchmark di settore aggiornati.' },
              { n: '03', icon: '◆', t: 'Ricevi il documento', d: 'Un business plan professionale completo, formattato e pronto per banche e investitori.' },
            ].map(f => (
              <div key={f.n} style={{
                padding: 24, border: '1px solid #e2e2de',
                borderRadius: 12, background: '#fafaf8',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: '#111', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, marginBottom: 16,
                }}>{f.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.t}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COSA INCLUDE */}
      <section style={{ padding: '80px 0', background: '#f8f8f6' }}>
        <div className="container">
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
            Cosa include il business plan
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              'Executive Summary', 'Analisi di Mercato (TAM/SAM/SOM)',
              'Analisi Competitiva', 'Modello di Business',
              'Strategia Go-to-Market', 'Piano Operativo',
              'Proiezioni Finanziarie P&L', 'Analisi SWOT',
              'Matrice Rischi & Mitigazioni', 'Raccomandazioni Strategiche',
            ].map(item => (
              <div key={item} style={{
                padding: '12px 14px', background: '#fff',
                border: '1px solid #e2e2de', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 500,
              }}>
                <span style={{ color: '#16a34a', fontSize: 16 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
            Semplice. Trasparente.
          </h2>
          <p style={{ textAlign: 'center', color: '#777', marginBottom: 48, fontSize: 15 }}>
            Inizia gratis, passa al Pro quando ne hai bisogno
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 640, margin: '0 auto' }}>
            {/* FREE */}
            <div style={{
              padding: 28, border: '1px solid #e2e2de',
              borderRadius: 14, background: '#fafaf8',
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Gratuito</p>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>€0</div>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Per sempre</p>
              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {['1 business plan completo', 'Ricerca AI dati di mercato', 'Export copia testo', 'Tutte le 10 sezioni'].map(f => (
                  <li key={f} style={{ fontSize: 13, color: '#555', padding: '5px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#16a34a' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/wizard" style={{
                display: 'block', textAlign: 'center', padding: '10px',
                border: '1px solid #ddd', borderRadius: 8, fontSize: 14, fontWeight: 600,
              }}>
                Inizia gratis
              </Link>
            </div>

            {/* PRO */}
            <div style={{
              padding: 28, border: '2px solid #111',
              borderRadius: 14, background: '#fff', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: '#111', color: '#fff', fontSize: 11, fontWeight: 700,
                padding: '3px 12px', borderRadius: 10, whiteSpace: 'nowrap',
              }}>PIÙ POPOLARE</div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#777', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Pro</p>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>€19<span style={{ fontSize: 16, fontWeight: 400, color: '#888' }}>/mese</span></div>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Fatturato annualmente</p>
              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {[
                  'Piani illimitati', 'Export PDF professionale',
                  'Versioni multiple e revisioni', 'Personalizzazione branding',
                  'Supporto prioritario', 'Accesso anticipato nuove funzioni',
                ].map(f => (
                  <li key={f} style={{ fontSize: 13, color: '#333', padding: '5px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#16a34a' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href="/api/checkout" style={{
                display: 'block', textAlign: 'center', padding: '11px',
                background: '#111', color: '#fff', borderRadius: 8,
                fontSize: 14, fontWeight: 700,
              }}>
                Inizia il periodo di prova
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 0', background: '#f8f8f6', borderTop: '1px solid #e2e2de' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 40, textAlign: 'center' }}>FAQ</h2>
          {[
            { q: 'Quanto è accurato il business plan generato?', a: "L'AI utilizza Google Search per cercare dati reali di mercato, competitor e trend aggiornati. Il piano è un ottimo punto di partenza professionale che puoi personalizzare." },
            { q: 'In che lingua è il business plan?', a: 'Italiano. Il sistema è ottimizzato per il mercato italiano ma può gestire anche richieste in altre lingue se le compili in quella lingua.' },
            { q: 'Posso modificare il piano generato?', a: 'Sì, puoi copiare il testo ed editarlo. Con il piano Pro hai accesso a revisioni illimitate direttamente in-app.' },
            { q: 'I miei dati sono al sicuro?', a: 'I dati inseriti nel wizard non vengono salvati permanentemente. Ogni sessione è indipendente. Non vendiamo né condividiamo i tuoi dati.' },
          ].map(({ q, a }) => (
            <details key={q} style={{
              borderBottom: '1px solid #e2e2de',
              padding: '16px 0',
            }}>
              <summary style={{ fontSize: 15, fontWeight: 600, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                {q} <span>+</span>
              </summary>
              <p style={{ fontSize: 14, color: '#666', marginTop: 10, lineHeight: 1.7 }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINALE */}
      <section style={{ padding: '80px 0', background: '#111', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.01em' }}>
            Pronto a creare il tuo business plan?
          </h2>
          <p style={{ fontSize: 16, color: '#999', marginBottom: 32 }}>
            Gratis, in 12 minuti, pronto per banche e investitori.
          </p>
          <Link href="/wizard" style={{
            fontSize: 16, fontWeight: 700, padding: '14px 36px',
            background: '#fff', color: '#111', borderRadius: 10,
            display: 'inline-block',
          }}>
            Inizia ora — è gratis →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '24px 0', background: '#0a0a0a', borderTop: '1px solid #222', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#555' }}>
          © 2026 PlanForge · Fatto con ◈ AI
        </p>
      </footer>
    </main>
  );
}
