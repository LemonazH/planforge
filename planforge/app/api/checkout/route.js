// app/api/checkout/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServer } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    const sb = getSupabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth`);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'PlanForge Pro',
            description: 'Business plan AI illimitati · Storico salvato · Supporto prioritario',
          },
          unit_amount: 1900,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      metadata: { userId: user.id },
      success_url: `${appUrl}/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Errore pagamento.' }, { status: 500 });
  }
}
