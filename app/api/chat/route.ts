import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { tools, handleToolCall } from '@/lib/chatTools'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a helpful assistant for FRPC, a software and innovation studio based in Portugal. You live inside a chat widget on the FRPC website.

FRPC builds modern web applications, SaaS products, and provides technical consulting. Your role is to help visitors understand FRPC's products, services, and how the team can help them.

Guidelines:
- Be conversational, professional, and concise. Keep replies short and friendly.
- Always reply in the same language the user writes in (Portuguese or English).
- When asked about products or services, use the get_products tool.
- When asked about how to reach FRPC, use the get_contact_info tool.
- When a user wants to be contacted or book a meeting, collect their name, email, and reason, then use schedule_callback.
- Do not make up information. If you don't know something, say so and offer to help them get in touch.

Key facts about FRPC:
- Founded in 2026, based in Portugal, works internationally
- Tech stack: React, Next.js, TypeScript
- Products are SaaS-based and ready for teams of all sizes`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    let currentMessages: Anthropic.MessageParam[] = [...messages]

    // Agentic loop — up to 5 iterations to handle tool chains
    for (let i = 0; i < 5; i++) {
      const response = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools,
        messages: currentMessages,
      })

      if (response.stop_reason === 'end_turn') {
        const textBlock = response.content.find((b) => b.type === 'text')
        return NextResponse.json({ content: (textBlock as Anthropic.TextBlock)?.text ?? '' })
      }

      if (response.stop_reason === 'tool_use') {
        currentMessages.push({ role: 'assistant', content: response.content })

        const toolResults: Anthropic.ToolResultBlockParam[] = []
        for (const block of response.content) {
          if (block.type === 'tool_use') {
            const result = handleToolCall(block.name, block.input as Record<string, unknown>)
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(result),
            })
          }
        }
        currentMessages.push({ role: 'user', content: toolResults })
      } else {
        const textBlock = response.content.find((b) => b.type === 'text')
        return NextResponse.json({ content: (textBlock as Anthropic.TextBlock)?.text ?? '' })
      }
    }

    return NextResponse.json({
      content: 'Sorry, I was unable to complete the request. Please try again.',
    })
  } catch (error) {
    console.error('[Chat API error]', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
