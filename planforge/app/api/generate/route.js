// app/api/generate/route.js
import { NextResponse } from 'next/server';
import { generateBusinessPlan } from '@/lib/gemini';
import { getSupabaseServer } from '@/lib/supabase';
import { canGeneratePlan, incrementPlanUsage, savePlan } from '@/lib/db';

export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const sb = getSupabaseServer();
    const { data: { user }, error: authError } = await sb.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Devi essere loggato per generare un business plan.', redirect: '/auth' },
        { status: 401 }
      );
    }

    const access = await canGeneratePlan(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        {
          error: 'UPGRADE_REQUIRED',
          message: `Hai usato tutti e ${access.limit} i tuoi piani gratuiti. Passa a Pro per continuare.`,
          used: access.used,
          limit: access.limit,
        },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { formData } = body;

    if (!formData?.companyName || !formData?.sector) {
      return NextResponse.json({ error: 'Dati incompleti.' }, { status: 400 });
    }

    const result = await generateBusinessPlan(formData);

    const savedPlan = await savePlan({
      userId: user.id,
      formData,
      outputText: result.text,
      searchQueries: result.searchQueries,
    });

    if (!access.isPro) {
      await incrementPlanUsage(user.id);
    }

    return NextResponse.json({
      success: true,
      planId: savedPlan.id,
      text: result.text,
      searchQueries: result.searchQueries,
      isPro: access.isPro,
      model: 'gemini-2.0-flash',
    });

  } catch (error) {
    console.error('Generate error:', error);
    if (error.message?.includes('quota')) {
      return NextResponse.json({ error: 'Limite AI raggiunto. Riprova tra qualche ora.' }, { status: 503 });
    }
    return NextResponse.json({ error: error.message || 'Errore nella generazione. Riprova.' }, { status: 500 });
  }
}
