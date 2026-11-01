import { NextResponse } from 'next/server';
import { generateEventPlanWithAI, PlanGenerationInput } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      eventName,
      eventType,
      eventDate,
      location,
      guestCount,
      totalBudget,
      theme,
      preferences,
    } = body;

    // Validate inputs
    if (!eventName || !eventType || !eventDate || !location) {
      return NextResponse.json(
        { success: false, error: 'Please provide event name, type, date, and location.' },
        { status: 400 }
      );
    }

    const budgetNum = Number(totalBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Total budget must be a positive number in INR.' },
        { status: 400 }
      );
    }

    const guestsNum = Number(guestCount);
    if (isNaN(guestsNum) || guestsNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Guest count must be at least 1.' },
        { status: 400 }
      );
    }

    const input: PlanGenerationInput = {
      eventName: String(eventName).trim(),
      eventType: eventType as any,
      eventDate: String(eventDate).trim(),
      location: String(location).trim(),
      guestCount: guestsNum,
      totalBudget: budgetNum,
      theme: String(theme || 'Modern').trim(),
      preferences: String(preferences || '').trim(),
    };

    const payload = await generateEventPlanWithAI(input);

    return NextResponse.json({
      success: true,
      data: payload,
    });
  } catch (error: any) {
    console.error('Error generating event plan API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to generate event plan. Please try again.',
      },
      { status: 500 }
    );
  }
}

