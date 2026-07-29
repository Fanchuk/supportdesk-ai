import { Router, Response } from 'express'
import { db } from '../db'
import { sql } from 'drizzle-orm'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

function getPeriodFilter(period: string) {
    switch (period) {
        case 'today': return sql`AND created_at >= DATE_TRUNC('day', NOW())`
        case 'week': return sql`AND created_at >= NOW() - INTERVAL '7 days'`
        case 'month': return sql`AND created_at >= NOW() - INTERVAL '30 days'`
        case 'year': return sql`AND created_at >= NOW() - INTERVAL '365 days'`
        default: return sql`AND created_at >= NOW() - INTERVAL '7 days'`
    }
}

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const period = (req.query.period as string) ?? 'week'
        const filter = getPeriodFilter(period)

        const result = await db.execute(sql`
            SELECT
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'closed') as resolved,
                COUNT(*) FILTER (WHERE status != 'closed') as open,
                ROUND(AVG(
                    EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600
                )::numeric, 1) as avg_response_hours
            FROM tickets
            WHERE 1=1 ${filter}
        `)
        const row = result.rows[0] as any
        res.json({
            total: Number(row.total),
            resolved: Number(row.resolved),
            open: Number(row.open),
            avgResponseHours: Number(row.avg_response_hours) || 0,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/tickets-by-day', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const period = (req.query.period as string) ?? 'week'
        const filter = getPeriodFilter(period)

        const result = await db.execute(sql`
            SELECT
                TO_CHAR(created_at, 'Dy') as day,
                COUNT(*) FILTER (WHERE status != 'closed') as open,
                COUNT(*) FILTER (WHERE status = 'closed') as resolved
            FROM tickets
            WHERE 1=1 ${filter}
            GROUP BY TO_CHAR(created_at, 'Dy'), DATE_TRUNC('day', created_at)
            ORDER BY DATE_TRUNC('day', created_at) ASC
        `)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/response-by-category', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const period = (req.query.period as string) ?? 'week'
        const filter = getPeriodFilter(period)

        const result = await db.execute(sql`
            SELECT
                category,
                ROUND(AVG(
                    EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600
                )::numeric, 1) as avg_hours
            FROM tickets
            WHERE category IS NOT NULL ${filter}
            GROUP BY category
            ORDER BY avg_hours DESC
        `)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/agents', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const period = (req.query.period as string) ?? 'week'

        const result = await db.execute(sql`
            SELECT
                u.id,
                u.name,
                u.role,
                COUNT(t.id) FILTER (WHERE t.status = 'closed') as resolved,
                COUNT(t.id) FILTER (WHERE t.status != 'closed') as open,
                ROUND(AVG(
                    EXTRACT(EPOCH FROM (t.updated_at - t.created_at)) / 3600
                )::numeric, 1) as avg_response_hours
            FROM users u
            LEFT JOIN tickets t ON (t.assigned_to_id = u.id OR t.created_by_id = u.id)
                AND t.created_at >= NOW() - CASE
                    WHEN ${period} = 'today' THEN INTERVAL '1 day'
                    WHEN ${period} = 'month' THEN INTERVAL '30 days'
                    WHEN ${period} = 'year' THEN INTERVAL '365 days'
                    ELSE INTERVAL '7 days'
                END
            GROUP BY u.id, u.name, u.role
            ORDER BY resolved DESC NULLS LAST
        `)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router