import OpenAI from 'openai';
import { FAQ } from '@/types';

/** Lazy-initialized to avoid build failure when OPENAI_API_KEY is not set */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  faqs: FAQ[] = []
): Promise<{ response: string; escalated: boolean }> {
  try {
    const openai = getOpenAIClient();
    const systemPrompt = `You are a helpful AI assistant for RBLC ltd, a car spare parts marketplace in Rwanda. 
Your role is to:
1. Answer customer inquiries about car parts
2. Help customers find the right parts for their car make/model
3. Provide information about suppliers and mechanics
4. Escalate complex issues to human admin

Available FAQs:
${faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

If a customer asks something complex that requires human intervention (like complaints, refunds, or technical issues beyond FAQs), respond with "ESCALATE" at the start of your response.

Be friendly, professional, and concise. Respond in English or Kinyarwanda based on the customer's language preference.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    const escalated = response.startsWith('ESCALATE');

    return {
      response: escalated ? response.replace(/^ESCALATE\s*/i, '') : response,
      escalated,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      response: 'Sorry, I encountered an error. Please try again or contact support.',
      escalated: false,
    };
  }
}

export async function suggestRelatedParts(
  carBrand: string,
  carModel: string,
  requestedPart: string
): Promise<string[]> {
  try {
    const openai = getOpenAIClient();
    const prompt = `Given a car: ${carBrand} ${carModel}, and a requested part: ${requestedPart}, 
suggest 3-5 related parts that customers often need together or as alternatives. 
Return only a JSON array of part names, no other text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    return JSON.parse(response);
  } catch (error) {
    console.error('Error suggesting parts:', error);
    return [];
  }
}
