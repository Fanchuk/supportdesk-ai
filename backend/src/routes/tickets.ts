import { Router, Response } from 'express'
import { db } from '../db'
import { tickets, users } from '../db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import { classifyTicket } from '../lib/ai/classify'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { status, priority, sort } = req.query
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const offset  = (page - 1) * limit

        let query = sql`
        SELECT
           t.id, t.title, t.status, t.priority, t.created_at, t.updated_at,
           u.name as user_name, u.email as user_email
        FROM tickets t
        LEFT JOIN users u ON t.created_by_id = u.id
        WHERE 1=1
        `

        if (status) {
            query = sql`${query} AND t.status = ${status}`
        }

        if (priority) {
            query = sql`${query} AND t.priority = ${priority}`
        }

        query = sql`${query} ORDER BY t.created_at ${sort === 'asc' ? sql`ASC` : sql`DESC`}`

        const countQuery = sql`SELECT COUNT(*) as total FROM (${query}) as sub`
        const countResult = await db.execute(countQuery)
        const total = Number((countResult.rows[0] as any).total)

        const paginatedQuery = sql`${query} LIMIT ${limit} OFFSET ${offset}`
        const result = await db.execute(paginatedQuery)

        res.json({
            data: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            title: z.string().min(3),
            description: z.string().min(10),
            priority: z.enum(['low', 'medium', 'high']).optional(),
            category: z.string().optional(),
        })

        const body = schema.parse(req.body)

        const rulesResult = await db.execute(sql`
            SELECT ar.*, t.id as team_id_val
            FROM assignment_rules ar
            JOIN teams t ON ar.team_id = t.id
            WHERE ar.is_active = true
            `)

        let assignedTeamId = null
        const titleLower = body.title.toLowerCase()

        for (const rule of rulesResult.rows as any[]) {
            const keywords = rule.keywords as string[]
            const matched = keywords.some((kw: string) => titleLower.includes(kw.toLowerCase()))
            if (matched) {
                assignedTeamId = rule.team_id
                break
            }
        }

        let aiPriority: 'low' | 'medium' | 'high' = 'medium'
        let aiCategory = 'General'

        try {
            const classification = await classifyTicket(body.title, body.description)
            aiPriority = classification.priority
            aiCategory = classification.category
        } catch (error) {
            console.error('AI classification failed:', error)
        }

        const [ticket] = await db
            .insert(tickets)
            .values({
                title: body.title,
                description: body.description,
                priority: body.priority || aiPriority,
                category: body.category || aiCategory,
                status: 'open',
                createdById: req.user?.id,
                teamId: assignedTeamId,
            })
            .returning()

        res.status(201).json(ticket)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            status: z.enum(['open', 'in_progress', 'closed']).optional(),
            priority: z.enum(['low', 'medium', 'high']).optional(),
            assignedToId: z.number().optional(),
            teamId: z.number().optional(),
        })

        const body = schema.parse(req.body)
        const ticketId = parseInt(req.params.id as string)

        const [ticket] = await db
            .update(tickets)
            .set({
                ...body,
                updatedAt: new Date(),
            })
            .where(eq(tickets.id, ticketId))
            .returning()

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' })
        }

        res.json(ticket)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.delete('/:id', authenticate, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
    try {
        const ticketId = parseInt(req.params.id as string)

        const [ticket] = await db.delete(tickets).where(eq(tickets.id, ticketId)).returning()

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' })
        }

        res.json(ticket)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Server error' })
    }
})

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const ticketId = parseInt(req.params.id as string)

        const result = await db.execute(sql`
      SELECT 
        t.*,
        u.name as creator_name,
        u.email as creator_email,
        a.name as assignee_name,
        a.email as assignee_email,
        tm.name as team_name
      FROM tickets t
      LEFT JOIN users u ON t.created_by_id = u.id
      LEFT JOIN users a ON t.assigned_to_id = a.id
      LEFT JOIN teams tm ON t.team_id = tm.id
      WHERE t.id = ${ticketId}
    `)

        const ticket = result.rows[0]

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no found' })
        }

        const messagesResult = await db.execute(sql`
      SELECT 
        m.*,
        u.name as author_name,
        u.email as author_email,
        u.role as author_role
      FROM messages m
      LEFT JOIN users u ON m.author_id = u.id
      WHERE m.ticket_id = ${ticketId}
      ORDER BY m.created_at ASC
    `)

        res.json({
            ...ticket,
            messages: messagesResult.rows,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
