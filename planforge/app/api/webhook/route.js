// app/api/webhook/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { activateProSubscription, cancelSubscription, getProfileByStripeCustomer } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature invalida' }, { status: 400 });
  }

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (!userId) break;

      // Recupera subscription per avere la data di fine
      let endAt = null;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        endAt = new Date(sub.current_period_end * 1000).toISOString();
      }

      await activateProSubscription({
        userId,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        endAt,
      });
      console.log(`✅ Pro attivato per ${userId}`);
      break;
    }

    case 'invoice.payment_succeeded': {
      // Rinnovo mensile - aggiorna data fine abbonamento
      const invoice = event.data.object;
      if (!invoice.subscription) break;

      const sub = await stripe.subscriptions.retrieve(invoice.subscription);
      const profile = await getProfileByStripeCustomer(invoice.customer);
      if (!profile) break;

      await activateProSubscription({
        userId: profile.id,
        stripeCustomerId: invoice.customer,
        stripeSubscriptionId: invoice.subscription,
        endAt: new Date(sub.current_period_end * 1000).toISOString(),
      });
      break;
    }

    case 'customer.subscription.deleted': {
      await cancelSubscription(event.data.object.customer);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
