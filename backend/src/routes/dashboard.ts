import { Router, Response } from 'express'
import { db } from '../db'
import { tickets } from '../db/schema'
import { eq, count, sql } from 'drizzle-orm'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

const cache = new Map<string, { data: any; expires: number }>()

const getCached = (key: string) => {
    const item = cache.get(key)
    if (!item) return null
    if (Date.now() > item.expires) {
        cache.delete(key)
        return null
    }
    return item.data
}

const setCache = (key: string, data: any, ttlSeconds = 60) => {
    cache.set(key, { data, expires: Date.now() + ttlSeconds * 1000 })
}

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const month = req.query.month ? parseInt(req.query.month as string) : null
        const year = req.query.year ? parseInt(req.query.year as string) : null

        const cacheKey = `stats-${month}-${year}`
        const cached = getCached(cacheKey)
        if (cached) return res.json(cached)

        const result = await db.execute(sql`
            SELECT
                COUNT(*) FILTER (WHERE status = 'open') as open,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                COUNT(*) FILTER (WHERE status = 'closed') as closed,
                COUNT(*) as total
            FROM tickets
            WHERE (${month}::int IS NULL OR EXTRACT(MONTH FROM created_at) = ${month}::int)
              AND (${year}::int IS NULL OR EXTRACT(YEAR FROM created_at) = ${year}::int)
        `)

        const row = result.rows[0] as any
        const open = Number(row.open)
        const inProgress = Number(row.in_progress)
        const closed = Number(row.closed)
        const total = Number(row.total)

        const responseData = {
            open, inProgress, closed, total,
            percentOpen: total ? Math.round((open / total) * 100) : 0,
            percentInProgress: total ? Math.round((inProgress / total) * 100) : 0,
            percentClosed: total ? Math.round((closed / total) * 100) : 0,
        }

        setCache(cacheKey, responseData, 60)
        res.json(responseData)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/response-trend', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const days = parseInt(req.query.days as string) || 14
        
        const cacheKey = `trend-${days}`
        const cached = getCached(cacheKey)
        if (cached) return res.json(cached)

        const result = await db.execute(sql`
            SELECT
               TO_CHAR(DATE_TRUNC('day', created_at), 'Dy') as day,
               COUNT(*) as count,
               ROUND(AVG(
                   EXTRACT(EPOCH FROM (${tickets.updatedAt} - ${tickets.createdAt})) / 60
               )::numeric, 0) as avg_minutes
               FROM tickets
               WHERE ${tickets.createdAt} >= NOW() - INTERVAL '1 day' * ${days}
               GROUP BY DATE_TRUNC('day', ${tickets.createdAt})
               ORDER BY DATE_TRUNC('day', ${tickets.createdAt}) ASC
            `)

        const rows = (result.rows as Array<{ day: string; count: string | number; avg_minutes: string | number }>).map(r => ({
            day: r.day,
            count: Number(r.count),
            avg_minutes: Number(r.avg_minutes) || Number(r.count)
        }))

        setCache(cacheKey, rows, 60)
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/latest-tickets', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const cacheKey = 'latest-tickets'
        const cached = getCached(cacheKey)
        if (cached) return res.json(cached)

        const result = await db.execute(sql`
            SELECT
               t.id,
               t.title,
               t.status,
               t.priority,
               t.created_at,
               u.name as user_name,
               u.email as user_email
            FROM tickets t
            LEFT JOIN users u ON t.created_by_id = u.id
            ORDER BY t.created_at DESC
            LIMIT 10
        `)
        
        setCache(cacheKey, result.rows, 15)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router