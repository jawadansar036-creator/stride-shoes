import { NextRequest, NextResponse } from 'next/server';
import { askRAGShoppingAssistant } from '@/lib/ai/rag-service';
import { ChatMessage } from '@/lib/ai/llm-provider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'A valid message string is required.' },
        { status: 400 }
      );
    }

    const answer = await askRAGShoppingAssistant(message, history);

    return NextResponse.json({
      success: true,
      message: answer.message,
      recommendedProducts: answer.recommendedProducts,
      citations: answer.citations,
      suggestedQuestions: answer.suggestedQuestions,
      provider: answer.provider,
    });
  } catch (error: any) {
    console.error('[API /api/chat error]:', error);
    return NextResponse.json(
      {
        error: 'Failed to process AI chat query',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
