# ◈ PlanForge — Business Plan AI SaaS

> Genera business plan professionali con AI. Stack 100% gratuito da deployare.

---

## Stack Tecnico (tutto free)

| Servizio | Piano gratuito | Uso |
|---|---|---|
| **Vercel** | Hobby illimitato | Hosting + Serverless |
| **Supabase** | 500MB DB, 50K MAU | Database + Autenticazione |
| **Google Gemini 2.0 Flash** | 1.500 req/giorno | LLM + Google Search |
| **Stripe** | Solo % per transazione | Pagamenti Pro |

**Costo fisso mensile: €0**

---

## Struttura del Progetto

```
planforge/
├── app/
│   ├── page.jsx              # Landing page
│   ├── layout.jsx            # Root layout + SEO
│   ├── globals.css           # Stili globali
│   ├── auth/page.jsx         # Login · Signup · Magic link · Reset password
│   ├── dashboard/page.jsx    # Dashboard utente + storico piani
│   ├── wizard/page.jsx       # Wizard 10 step + generazione + output
│   └── api/
│       ├── generate/route.js # POST → Gemini AI (con auth check)
│       ├── checkout/route.js # GET → Stripe checkout
│       └── webhook/route.js  # POST → Stripe webhook → attiva Pro
├── lib/
│   ├── supabase.js           # Client Supabase (browser + server + admin)
│   ├── db.js                 # Operazioni DB (profili, piani, abbonamenti)
│   └── gemini.js             # Gemini 2.0 Flash + Google Search
├── middleware.js             # Protezione route autenticate
├── supabase-schema.sql       # Schema DB da incollare in Supabase
└── .env.example              # Template variabili d'ambiente
```

---

## Setup Completo (20 minuti)

### 1. Installa e configura

```bash
git clone <tuo-repo> && cd planforge
npm install
cp .env.example .env.local
```

### 2. Supabase (Database + Auth) — GRATIS

1. Crea account su https://supabase.com
2. Crea nuovo progetto (scegli regione Europe/Frankfurt)
3. Vai su **SQL Editor** → incolla il contenuto di `supabase-schema.sql` → clicca **RUN**
4. Vai su **Settings → API** → copia le chiavi:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
5. Per abilitare Google OAuth: **Authentication → Providers → Google**
   (crea credenziali OAuth su Google Cloud Console, inserisci Client ID e Secret)

### 3. Google Gemini — GRATIS

1. Vai su https://aistudio.google.com/app/apikey
2. **Create API Key** → copia in `.env.local`:
   ```
   GEMINI_API_KEY=AIza...
   ```

### 4. Stripe — solo % sulle transazioni

1. Crea account https://stripe.com
2. **API Keys** → copia chiavi in `.env.local`
3. Dopo il deploy, aggiungi webhook:
   - URL: `https://tuodominio.vercel.app/api/webhook`
   - Events da ascoltare:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `customer.subscription.deleted`

### 5. Deploy su Vercel

```bash
npm i -g vercel
vercel --prod
```

Aggiungi le env vars in **Vercel → Settings → Environment Variables**.

---

## Come funziona il flusso utente

```
Landing page
    ↓
Registrazione / Login (Supabase Auth)
    ↓
Wizard 10 step (raccolta dati)
    ↓
API /generate → verifica auth + piano
    ↓
Gemini AI + Google Search → business plan
    ↓
Salvataggio in Supabase DB
    ↓
Output + Dashboard con storico
    ↓ (se limite free raggiunto)
Stripe Checkout → Pro €19/mese
    ↓
Webhook → attiva Pro in DB
```

---

## Monetizzazione

- **Free**: 3 piani totali per account
- **Pro**: €19/mese → illimitati + storico completo + supporto

Con 1.000 utenti attivi e conversione 5% = **€950/mese MRR**, costi infrastruttura €0.
