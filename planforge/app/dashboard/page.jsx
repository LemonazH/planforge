'use client';
import { useState, useEffect } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(null); // piano aperto
  const router = useRouter();
  const sb = getSupabaseBrowser();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) { router.push('/auth'); return; }
    setUser(user);

    // Carica profilo e piani in parallelo
    const [profileRes, plansRes] = await Promise.all([
      sb.from('profiles').select('*').eq('id', user.id).single(),
      sb.from('business_plans')
        .select('id, title, company_name, sector, stage, country, word_count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]);

    setProfile(profileRes.data);
    setPlans(plansRes.data || []);
    setLoading(false);
  }

  async function loadPlanFull(planId) {
    const { data } = await sb
      .from('business_plans')
      .select('*')
      .eq('id', planId)
      .single();
    setActivePlan(data);
  }

  async function deletePlan(planId) {
    if (!confirm('Eliminare questo business plan?')) return;
    await sb.from('business_plans').delete().eq('id', planId);
    setPlans(p => p.filter(x => x.id !== planId));
    if (activePlan?.id === planId) setActivePlan(null);
  }

  async function handleLogout() {
    await sb.auth.signOut();
    router.push('/');
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#aaa' }}>Caricamento...</p>
    </div>
  );

  const isPro = profile?.plan === 'pro' && profile?.subscription_status === 'active';
  const usedFree = profile?.plans_used || 0;
  const limitFree = profile?.plans_limit || 3;

  // ─── PIANO APERTO ────────────────────────────────────────────────────────
  if (activePlan) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f8f6' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e2de', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
            <button onClick={() => setActivePlan(null)} style={{ fontSize: 13, color: '#555', cursor: 'pointer', border: 'none', background: 'none' }}>← Torna alla Dashboard</button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { navigator.clipboard.writeText(activePlan.output_text); alert('Copiato!'); }}
                style={{ padding: '6px 14px', fontSize: 12, border: '1px solid #ddd', borderRadius: 7, background: '#fff', cursor: 'pointer' }}>
                Copia testo
              </button>
              <button
                onClick={() => deletePlan(activePlan.id)}
                style={{ padding: '6px 14px', fontSize: 12, border: '1px solid #fecaca', borderRadius: 7, background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>
                Elimina
              </button>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e2de', borderRadius: 12, padding: '28px 32px' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{activePlan.title}</h1>
            <p style={{ fontSize: 12, color: '#aaa', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f0f0ec' }}>
              {activePlan.sector} · {activePlan.country} · {new Date(activePlan.created_at).toLocaleDateString('it-IT')} · {activePlan.word_count?.toLocaleString()} parole
            </p>
            <div style={{ fontSize: 13, lineHeight: 1.75, color: '#444', whiteSpace: 'pre-wrap' }}>
              {activePlan.output_text}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD PRINCIPALE ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e2de', height: 52 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>◈</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>PlanForge</span>
          </Link>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#666' }}>{user?.email}</span>
            <button onClick={handleLogout} style={{ fontSize: 12, padding: '6px 12px', border: '1px solid #ddd', borderRadius: 7, background: '#fff', cursor: 'pointer', color: '#555' }}>
              Esci
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

        {/* Header stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
          {/* Piano attivo */}
          <div style={{ background: isPro ? '#111' : '#fff', border: isPro ? 'none' : '1px solid #e2e2de', borderRadius: 10, padding: '16px 18px', color: isPro ? '#fff' : '#111' }}>
            <p style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>Piano attivo</p>
            <p style={{ fontSize: 18, fontWeight: 700 }}>{isPro ? '⭑ Pro' : 'Gratuito'}</p>
            {!isPro && <a href="/api/checkout" style={{ fontSize: 11, color: '#1d4ed8', marginTop: 4, display: 'block' }}>Passa a Pro →</a>}
          </div>
          {/* Piani generati */}
          <div style={{ background: '#fff', border: '1px solid #e2e2de', borderRadius: 10, padding: '16px 18px' }}>
            <p style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>Piani generati</p>
            <p style={{ fontSize: 18, fontWeight: 700 }}>{plans.length}</p>
            {!isPro && <p style={{ fontSize: 11, color: '#aaa' }}>{usedFree}/{limitFree} free usati</p>}
          </div>
          {/* Ultimo piano */}
          <div style={{ background: '#fff', border: '1px solid #e2e2de', borderRadius: 10, padding: '16px 18px' }}>
            <p style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>Ultimo piano</p>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{plans[0]?.company_name || '—'}</p>
            <p style={{ fontSize: 11, color: '#aaa' }}>{plans[0] ? new Date(plans[0].created_at).toLocaleDateString('it-IT') : ''}</p>
          </div>
          {/* CTA nuovo piano */}
          <Link href="/wizard" style={{
            background: '#f0fdf4', border: '1px dashed #bbf7d0',
            borderRadius: 10, padding: '16px 18px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <p style={{ fontSize: 22, marginBottom: 4 }}>+</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>Nuovo piano</p>
          </Link>
        </div>

        {/* Barra limiti free */}
        {!isPro && (
          <div style={{
            background: '#fff', border: '1px solid #e2e2de', borderRadius: 10,
            padding: '14px 18px', marginBottom: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Piano gratuito — utilizzo</span>
              <span style={{ fontSize: 13, color: '#777' }}>{usedFree} / {limitFree} piani</span>
            </div>
            <div style={{ height: 6, background: '#f0f0ec', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(usedFree / limitFree) * 100}%`, background: usedFree >= limitFree ? '#dc2626' : '#111', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
            {usedFree >= limitFree && (
              <p style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>
                Limite raggiunto. <a href="/api/checkout" style={{ fontWeight: 700, textDecoration: 'underline' }}>Passa a Pro per continuare →</a>
              </p>
            )}
          </div>
        )}

        {/* Lista piani */}
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>I tuoi business plan</h2>

        {plans.length === 0 ? (
          <div style={{
            background: '#fff', border: '1px dashed #e2e2de', borderRadius: 12,
            padding: '48px 20px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>◈</p>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nessun business plan ancora</p>
            <p style={{ fontSize: 13, color: '#777', marginBottom: 20 }}>Crea il tuo primo piano in 12 minuti.</p>
            <Link href="/wizard" style={{
              display: 'inline-block', padding: '10px 24px',
              background: '#111', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14,
            }}>
              Crea il primo piano →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plans.map(plan => (
              <div key={plan.id} style={{
                background: '#fff', border: '1px solid #e2e2de', borderRadius: 10,
                padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{plan.company_name}</p>
                  <p style={{ fontSize: 12, color: '#888' }}>
                    {plan.sector} · {plan.country} · {plan.word_count?.toLocaleString()} parole
                  </p>
                </div>
                <p style={{ fontSize: 12, color: '#aaa' }}>
                  {new Date(plan.created_at).toLocaleDateString('it-IT')}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => loadPlanFull(plan.id)}
                    style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: '1px solid #e2e2de', borderRadius: 7, background: '#fff', cursor: 'pointer' }}>
                    Apri
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    style={{ padding: '6px 10px', fontSize: 12, border: '1px solid #fecaca', borderRadius: 7, background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
