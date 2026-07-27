import { Router, Response } from 'express'
import { db } from '../db'
import { messages } from '../db/schema'
import { sql } from 'drizzle-orm'
import { authenticate, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router({ mergeParams: true })

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            body: z.string().min(1)
        })

        const data = schema.parse(req.body)
        const ticketId = parseInt(req.params.id as string)

        const [message] = await db.insert(messages).values({
            body: data.body,
            ticketId,
            authorId: req.user?.id
        }).returning()

    const result = await db.execute(sql`
      SELECT m.*, u.name as author_name, u.email as author_email, u.role as author_role
      FROM messages m
      LEFT JOIN users u ON m.author_id = u.id
      WHERE m.id = ${message.id}
    `)

    res.status(201).json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.post('/ai-reply', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const ticketId = parseInt(req.params.id as string)

        const ticketResult = await db.execute(sql`
            SELECT * FROM tickets WHERE id = ${ticketId}
            `)
        const ticket = ticketResult.rows[0] as any
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' })

    const messagesResult = await db.execute(sql`
      SELECT m.body, u.name, u.role
      FROM messages m
      LEFT JOIN users u ON m.author_id = u.id
      WHERE m.ticket_id = ${ticketId}
      ORDER BY m.created_at ASC
    `)

    const conversation = (messagesResult.rows as any[])
      .map(m => `${m.role === 'agent' ? 'Agent' : 'Customer'} (${m.name}): ${m.body}`)
      .join('\n')
    
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    const aiMessage = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 300,
        messages: [
            {
                role: 'user',
                content: `You are a helpful customer support agent. Ticket: ${ticket.title}\nDescription: ${ticket.description}\nConversation so far:\n${conversation || 'No messages yet'}\nWrite a helpful, professional reply to continue this support conversation. Be concise and solution-focused.`,
            },
        ],
    })

    const text = aiMessage.content[0].type === 'text' ? aiMessage.content[0].text : ''

    res.json({ suggestion: text })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router