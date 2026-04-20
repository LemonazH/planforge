'use client';
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'magic' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const sb = getSupabaseBrowser();

  const reset = () => { setError(''); setMessage(''); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); reset();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push('/dashboard');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); reset();
    const { error } = await sb.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setMessage('Controlla la tua email per confermare il tuo account!');
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true); reset();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setMessage(`Link di accesso inviato a ${email}! Controlla la tua email.`);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true); reset();
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setMessage('Email di reset inviata! Controlla la casella di posta.');
  };

  const S = {
    wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#f8f8f6' },
    card: { background: '#fff', border: '1px solid #e2e2de', borderRadius: 14, padding: 36, width: '100%', maxWidth: 400 },
    logo: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, justifyContent: 'center' },
    h2: { fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: 'center' },
    sub: { fontSize: 13, color: '#777', marginBottom: 28, textAlign: 'center' },
    label: { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5, color: '#333' },
    field: { marginBottom: 14 },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none' },
    btn: { width: '100%', padding: '11px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
    btnSecondary: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer', marginBottom: 10, color: '#333', fontWeight: 500 },
    error: { padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13, marginBottom: 14 },
    success: { padding: '10px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#16a34a', fontSize: 13, marginBottom: 14 },
    divider: { textAlign: 'center', fontSize: 12, color: '#aaa', margin: '14px 0', position: 'relative' },
    link: { color: '#111', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' },
  };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.logo}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>◈</span>
            <span style={{ fontWeight: 800, fontSize: 16 }}>PlanForge</span>
          </Link>
        </div>

        {mode === 'login' && (
          <>
            <h2 style={S.h2}>Bentornato</h2>
            <p style={S.sub}>Accedi al tuo account PlanForge</p>
            {error && <div style={S.error}>{error}</div>}
            {message && <div style={S.success}>{message}</div>}
            <form onSubmit={handleLogin}>
              <div style={S.field}>
                <label style={S.label}>Email</label>
                <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Password</label>
                <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                <div style={{ textAlign: 'right', marginTop: 5 }}>
                  <span onClick={() => setMode('forgot')} style={{ ...S.link, fontSize: 12 }}>Password dimenticata?</span>
                </div>
              </div>
              <button type="submit" style={S.btn} disabled={loading}>
                {loading ? 'Accesso...' : 'Accedi →'}
              </button>
            </form>
            <div style={S.divider}>oppure</div>
            <button style={S.btnSecondary} onClick={handleGoogle}>
              Continua con Google
            </button>
            <button style={S.btnSecondary} onClick={() => setMode('magic')}>
              Accedi con link email (senza password)
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#777', marginTop: 16 }}>
              Non hai un account?{' '}
              <span onClick={() => setMode('signup')} style={S.link}>Registrati gratis</span>
            </p>
          </>
        )}

        {mode === 'signup' && (
          <>
            <h2 style={S.h2}>Crea il tuo account</h2>
            <p style={S.sub}>Gratis · 3 business plan inclusi</p>
            {error && <div style={S.error}>{error}</div>}
            {message && <div style={S.success}>{message}</div>}
            <form onSubmit={handleSignup}>
              <div style={S.field}>
                <label style={S.label}>Nome completo</label>
                <input style={S.input} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Mario Rossi" required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Email</label>
                <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Password</label>
                <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimo 8 caratteri" required minLength={8} />
              </div>
              <button type="submit" style={S.btn} disabled={loading}>
                {loading ? 'Registrazione...' : 'Crea account gratis →'}
              </button>
            </form>
            <div style={S.divider}>oppure</div>
            <button style={S.btnSecondary} onClick={handleGoogle}>Continua con Google</button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 10 }}>
              Registrandoti accetti i nostri Termini di servizio.
            </p>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#777', marginTop: 10 }}>
              Hai già un account?{' '}
              <span onClick={() => setMode('login')} style={S.link}>Accedi</span>
            </p>
          </>
        )}

        {mode === 'magic' && (
          <>
            <h2 style={S.h2}>Link magico</h2>
            <p style={S.sub}>Ti mandiamo un link di accesso diretto via email, senza password.</p>
            {error && <div style={S.error}>{error}</div>}
            {message && <div style={S.success}>{message}</div>}
            <form onSubmit={handleMagicLink}>
              <div style={S.field}>
                <label style={S.label}>Email</label>
                <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
              </div>
              <button type="submit" style={S.btn} disabled={loading}>
                {loading ? 'Invio...' : 'Invia link di accesso'}
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#777', marginTop: 16 }}>
              <span onClick={() => setMode('login')} style={S.link}>← Torna al login</span>
            </p>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <h2 style={S.h2}>Reset password</h2>
            <p style={S.sub}>Ti mandiamo un link per reimpostare la password.</p>
            {error && <div style={S.error}>{error}</div>}
            {message && <div style={S.success}>{message}</div>}
            <form onSubmit={handleForgot}>
              <div style={S.field}>
                <label style={S.label}>Email</label>
                <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
              </div>
              <button type="submit" style={S.btn} disabled={loading}>
                {loading ? 'Invio...' : 'Invia link di reset'}
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#777', marginTop: 16 }}>
              <span onClick={() => setMode('login')} style={S.link}>← Torna al login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
