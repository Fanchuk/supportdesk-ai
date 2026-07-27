import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const classifyTicket = async (title: string, description: string) => {
  console.log('AI classifyTicket called:', title)

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: `Classify this support ticket and respond ONLY with JSON, no other text:
Title: ${title}
Description: ${description}

Respond with exactly this format:
{"priority": "low" | "medium" | "high", "category": "Technical" | "Billing" | "Login" | "General"}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  console.log('AI response:', text)

  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(cleaned) as { priority: 'low' | 'medium' | 'high'; category: string }
  } catch {
    return { priority: 'medium' as const, category: 'General' }
  }
}