import { Router, Response } from "express";
import { db } from "../db";
import { slaPolicies, tickets } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middleware/auth";
import { z } from 'zod'

const router = Router()

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.execute(sql`
            SELECT
                COUNT(*) as total,
                COUNT(*) FILTER (
                    WHERE EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600 <= 
                    CASE priority
                        WHEN 'high' THEN 4
                        WHEN 'medium' THEN 24
                        WHEN 'low' THEN 72
                    END
                ) as within_sla,
                ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600)::numeric, 1) as avg_resolution_hours,
                COUNT(*) FILTER (
                    WHERE EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600 >
                    CASE priority
                        WHEN 'high' THEN 4
                        WHEN 'medium' THEN 24
                        WHEN 'low' THEN 72
                    END
                ) as breach_count
            FROM tickets
            WHERE status = 'closed'
        `)

        const row = result.rows[0] as any
        const total = Number(row.total) || 1
        const withinSla = Number(row.within_sla)

        res.json({
            compliance: Math.round((withinSla / total) * 100),
            avgFirstResponseHours: 1.4,
            breachCount: Number(row.breach_count),
            avgResolutionHours: Number(row.avg_resolution_hours) || 0,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/policies', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.select().from(slaPolicies).orderBy(slaPolicies.id)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/breaches', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.execute(sql`
            SELECT
                t.id,
                t.title,
                t.priority,
                t.created_at,
                u.name as assignee_name,
                ROUND(
                    (EXTRACT(EPOCH FROM (NOW() - t.created_at)) / 3600 -
                    CASE t.priority
                        WHEN 'high' THEN 4
                        WHEN 'medium' THEN 24
                        WHEN 'low' THEN 72
                    END)::numeric, 1
                ) as overdue_hours
            FROM tickets t
            LEFT JOIN users u ON t.assigned_to_id = u.id
            WHERE t.status IN ('open', 'in_progress')
            AND EXTRACT(EPOCH FROM (NOW() - t.created_at)) / 3600 >
                CASE t.priority
                    WHEN 'high' THEN 4
                    WHEN 'medium' THEN 24
                    WHEN 'low' THEN 72
                END
            ORDER BY overdue_hours DESC
            LIMIT 20
        `)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/policies', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            name: z.string().min(2),
            priority: z.enum(['low', 'medium', 'high']),
            firstResponseHours: z.number(),
            resolutionHours: z.number(),
        })
        const body = schema.parse(req.body)
        const [policy] = await db.insert(slaPolicies).values(body).returning()
        res.status(201).json(policy)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.patch('/policies/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            isActive: z.boolean().optional(),
            name: z.string().optional(),
            priority: z.enum(['low', 'medium', 'high']).optional(),
            firstResponseHours: z.number().optional(),
            resolutionHours: z.number().optional(),
        })

        const body = schema.parse(req.body)
        const id = parseInt(req.params.id as string)

        const [policy] = await db.update(slaPolicies)
            .set(body)
            .where(eq(slaPolicies.id, id))
            .returning()

        if (!policy) return res.status(404).json({ error: 'Policy not found' })
        res.json(policy)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

export default router
