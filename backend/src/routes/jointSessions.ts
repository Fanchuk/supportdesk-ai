import { Router, Response } from 'express'
import { db } from '../db'
import { jointSessions, jointSessionMessages, jointSessionAgents, users, tickets } from '../db/schema'
import { eq, sql, and } from 'drizzle-orm'
import { authenticate, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.execute(sql`
            SELECT 
                js.id,
                js.is_active,
                js.created_at,
                t.id as ticket_id,
                t.title as ticket_title,
                t.priority as ticket_priority,
                t.status as ticket_status,
                COUNT(jsm.id) as message_count,
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', u.id,
                        'name', u.name,
                        'initials', UPPER(LEFT(u.name, 2)),
                        'role', u.role
                    )
                ) as agents
            FROM joint_sessions js
            LEFT JOIN tickets t ON js.ticket_id = t.id
            LEFT JOIN joint_session_agents jsa ON jsa.session_id = js.id
            LEFT JOIN users u ON jsa.user_id = u.id
            LEFT JOIN joint_session_messages jsm ON jsm.session_id = js.id
            WHERE js.is_active = true
            GROUP BY js.id, t.id
            ORDER BY js.created_at DESC
        `)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/:id/messages', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const sessionId = parseInt(req.params.id as string)
        const result = await db.execute(sql`
            SELECT 
                jsm.id,
                jsm.body,
                jsm.created_at,
                u.id as author_id,
                u.name as author_name,
                UPPER(LEFT(u.name, 2)) as author_initials,
                u.role as author_role
            FROM joint_session_messages jsm
            LEFT JOIN users u ON jsm.author_id = u.id
            WHERE jsm.session_id = ${sessionId}
            ORDER BY jsm.created_at ASC
        `)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({ ticketId: z.number() })
        const { ticketId } = schema.parse(req.body)

        const [session] = await db.insert(jointSessions)
            .values({ ticketId, isActive: true })
            .returning()

        await db.insert(jointSessionAgents).values({
            sessionId: session.id,
            userId: req.user!.id,
        })

        res.status(201).json(session)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.post('/:id/messages', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({ body: z.string().min(1) })
        const { body } = schema.parse(req.body)
        const sessionId = parseInt(req.params.id as string)

        const [message] = await db.insert(jointSessionMessages)
            .values({ sessionId, authorId: req.user!.id, body })
            .returning()

        const result = await db.execute(sql`
            SELECT jsm.*, u.name as author_name, UPPER(LEFT(u.name, 2)) as author_initials, u.role as author_role
            FROM joint_session_messages jsm
            LEFT JOIN users u ON jsm.author_id = u.id
            WHERE jsm.id = ${message.id}
        `)

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.execute(sql`
            SELECT
                COUNT(DISTINCT js.id) FILTER (WHERE js.is_active = true) as active_sessions,
                COUNT(DISTINCT jsa.user_id) FILTER (WHERE js.is_active = true) as agents_online,
                COUNT(jsm.id) FILTER (
                    WHERE jsm.created_at >= DATE_TRUNC('day', NOW())
                ) as messages_today,
                ROUND(AVG(
                    EXTRACT(EPOCH FROM (NOW() - js.created_at)) / 60
                )::numeric, 0) as avg_session_minutes
            FROM joint_sessions js
            LEFT JOIN joint_session_agents jsa ON jsa.session_id = js.id
            LEFT JOIN joint_session_messages jsm ON jsm.session_id = js.id
        `)
        const row = result.rows[0] as any
        res.json({
            activeSessions: Number(row.active_sessions),
            agentsOnline: Number(row.agents_online),
            messagesToday: Number(row.messages_today),
            avgSessionMinutes: Number(row.avg_session_minutes) || 0,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router