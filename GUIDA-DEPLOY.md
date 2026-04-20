# ◈ PlanForge — Guida Completa al Deploy
## Da zero a online in ~30 minuti

---

## ✅ FATTO AUTOMATICAMENTE (già completato)

Il database **BP SaaS** su Supabase è stato creato e configurato:
- ✓ Progetto creato su Supabase (regione Europa - Frankfurt)
- ✓ Tabella `profiles` (utenti + piano + abbonamento)
- ✓ Tabella `business_plans` (piani generati + testo + dati form)
- ✓ Trigger automatico: crea profilo al momento della registrazione
- ✓ Row Level Security (RLS): ogni utente vede solo i propri dati
- ✓ Indici per performance
- ✓ Vista `user_stats` per analytics

**URL Supabase:** `https://azeykvasgzltveldglye.supabase.co`
**Anon Key:** già nel file `.env.local.example`

---

## 📋 COSA DEVI FARE TU (5 passaggi)

---

### PASSAGGIO 1 — Recupera la Service Role Key di Supabase
*Tempo: 2 minuti*

1. Apri il browser e vai su: **https://supabase.com/dashboard**
2. Clicca sul progetto **"BP SaaS"**
3. Nel menu a sinistra clicca su **"Settings"** (icona ingranaggio in basso)
4. Clicca su **"API"**
5. Scorri fino a **"Project API keys"**
6. Copia la chiave chiamata **`service_role`** (clicca sull'occhio per vederla, poi copia)
7. Incollala nel file `.env.local.example` alla riga:
   ```
   SUPABASE_SERVICE_ROLE_KEY=INCOLLA_QUI_LA_SERVICE_ROLE_KEY
   ```

> ⚠️ La service_role key è segreta: non pubblicarla mai su GitHub o in codice client.

---

### PASSAGGIO 2 — Ottieni la chiave Google Gemini (GRATIS)
*Tempo: 3 minuti*

1. Vai su: **https://aistudio.google.com/app/apikey**
2. Accedi con il tuo account Google
3. Clicca **"Create API Key"**
4. Scegli **"Create API key in new project"**
5. Copia la chiave (inizia con `AIza...`)
6. Incollala nel file `.env.local.example`:
   ```
   GEMINI_API_KEY=AIzaSy...
   ```

> Il piano gratuito include 1.500 richieste/giorno e 1 milione di token/giorno.
> Più che sufficiente per centinaia di utenti.

---

### PASSAGGIO 3 — Crea account Stripe (monetizzazione)
*Tempo: 5 minuti*

1. Vai su: **https://stripe.com** → clicca **"Inizia ora"**
2. Crea l'account (usa la tua email)
3. Una volta dentro, vai su **"Sviluppatori" → "Chiavi API"**
4. Copia **"Chiave pubblicabile"** (inizia con `pk_test_...`)
   → incolla in `.env.local.example` come `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Clicca **"Rivela la chiave segreta di prova"**, copia (inizia con `sk_test_...`)
   → incolla come `STRIPE_SECRET_KEY`

> Il `STRIPE_WEBHOOK_SECRET` lo aggiungi DOPO il deploy (vedi Passaggio 5).

---

### PASSAGGIO 4 — Deploy su Vercel
*Tempo: 10 minuti*

#### 4a. Carica il codice su GitHub

1. Vai su **https://github.com** → accedi o crea account
2. Clicca **"New repository"** → nome: `planforge` → clicca **"Create repository"**
3. Scarica e installa **GitHub Desktop**: https://desktop.github.com
4. Apri GitHub Desktop → **"Add Existing Repository"**
5. Seleziona la cartella `planforge` (quella dello ZIP che hai scaricato)
6. Clicca **"Publish repository"** → collega al repo creato al punto 2

#### 4b. Deploy su Vercel

1. Vai su **https://vercel.com** → clicca **"Sign Up"** → scegli **"Continue with GitHub"**
2. Clicca **"Add New Project"**
3. Cerca e seleziona il repository `planforge`
4. Clicca **"Import"**
5. Nella sezione **"Environment Variables"**, aggiungi UNA PER UNA queste variabili:

```
Nome variabile                        Valore
─────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL              https://azeykvasgzltveldglye.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY         eyJhbGci... (copia dal file .env.local.example)
SUPABASE_SERVICE_ROLE_KEY             (quella che hai copiato al Passaggio 1)
GEMINI_API_KEY                        AIzaSy... (quella del Passaggio 2)
STRIPE_SECRET_KEY                     sk_test_... (Passaggio 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY    pk_test_... (Passaggio 3)
NEXT_PUBLIC_APP_URL                   https://planforge.vercel.app (sostituisci con il tuo URL Vercel)
STRIPE_WEBHOOK_SECRET                 lo aggiungi dopo (Passaggio 5)
```

6. Clicca **"Deploy"**
7. Attendi 2-3 minuti → il tuo sito è ONLINE 🎉

---

### PASSAGGIO 5 — Configura il Webhook Stripe
*Tempo: 3 minuti — da fare DOPO il deploy*

Il webhook serve per attivare automaticamente il piano Pro quando un utente paga.

1. Vai su **Stripe Dashboard** → **"Sviluppatori"** → **"Webhook"**
2. Clicca **"Aggiungi endpoint"**
3. **URL endpoint:** `https://TUO-NOME.vercel.app/api/webhook`
   (sostituisci `TUO-NOME` con il nome che Vercel ti ha assegnato)
4. Clicca **"Seleziona eventi"** e aggiungi questi 3:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
5. Clicca **"Aggiungi endpoint"**
6. Nella pagina del webhook, clicca **"Rivela"** sotto "Segreto di firma"
7. Copia il valore (`whsec_...`)
8. Vai su **Vercel → Settings → Environment Variables**
9. Aggiungi: `STRIPE_WEBHOOK_SECRET` = `whsec_...`
10. Vai su **Vercel → Deployments → clicca i 3 puntini → Redeploy**

---

### PASSAGGIO 6 — Abilita Google Login su Supabase (opzionale ma consigliato)
*Tempo: 5 minuti*

Permette agli utenti di registrarsi con un click usando Google.

1. Vai su **https://console.cloud.google.com**
2. Crea un nuovo progetto → chiamalo "PlanForge"
3. Vai su **"API e servizi" → "Credenziali"**
4. Clicca **"Crea credenziali" → "ID client OAuth 2.0"**
5. Tipo applicazione: **"Applicazione web"**
6. URI di reindirizzamento autorizzati: aggiungi
   `https://azeykvasgzltveldglye.supabase.co/auth/v1/callback`
7. Copia **Client ID** e **Client Secret**
8. Torna su **Supabase Dashboard → Authentication → Providers → Google**
9. Abilita Google, incolla Client ID e Client Secret → Salva

---

## 🚀 Riepilogo URLs finali

| Cosa | URL |
|------|-----|
| Il tuo sito | `https://TUO-NOME.vercel.app` |
| Dashboard Supabase | `https://supabase.com/dashboard/project/azeykvasgzltveldglye` |
| Stripe Dashboard | `https://dashboard.stripe.com` |
| Gemini AI Studio | `https://aistudio.google.com` |

---

## 🛠️ Problemi comuni

**"Error: SUPABASE_SERVICE_ROLE_KEY missing"**
→ Hai dimenticato di aggiungere la service role key in Vercel. Ricontrolla il Passaggio 1 e 4b.

**"Error: GEMINI_API_KEY"**
→ La chiave Gemini non è valida o non è stata incollata correttamente. Controlla che non ci siano spazi.

**Il pagamento funziona ma il piano Pro non si attiva**
→ Il webhook non è configurato. Ricontrolla il Passaggio 5.

**"Vercel build failed"**
→ Vai su Vercel → il tuo progetto → "Deployments" → clicca sul deploy fallito → leggi i log rossi in basso.

---

## 💰 Quando inizia a costare qualcosa?

- **Supabase**: gratis fino a 50.000 utenti registrati e 500MB di dati
- **Gemini**: gratis fino a 1.500 richieste/giorno (≈ 1.500 business plan/giorno)
- **Vercel**: gratis per hobby, a pagamento ($20/mese) oltre certi limiti di banda
- **Stripe**: nessun costo fisso, solo 1.5% + €0.25 per ogni pagamento ricevuto

In pratica puoi arrivare a **centinaia di utenti paganti** senza spendere nulla di infrastruttura.
