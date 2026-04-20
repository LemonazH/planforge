import './globals.css';

export const metadata = {
  title: 'PlanForge — Business Plan AI Professionale',
  description: 'Crea business plan professionali in minuti grazie all\'AI. Analisi di mercato reale, proiezioni finanziarie, pronto per investitori e banche.',
  keywords: 'business plan, AI, professionale, startup, PMI, investitori',
  openGraph: {
    title: 'PlanForge — Business Plan AI',
    description: 'Crea business plan professionali con l\'AI in 12 minuti.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◈</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
