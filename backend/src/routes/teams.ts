import { Router, Response } from 'express'
import { db } from '../db'
import { teams, users, tickets } from '../db/schema'
import { eq, sql } from 'drizzle-orm'
import { authenticate, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
    const result = await db.execute(sql`
      SELECT 
        t.id,
        t.name,
        t.description,
        COUNT(DISTINCT u.id) as members_count,
        COUNT(DISTINCT tk.id) FILTER (WHERE tk.status != 'closed') as active_tickets,
        ROUND(
          AVG(
            EXTRACT(EPOCH FROM (tk.updated_at - tk.created_at)) / 3600
          )::numeric, 1
        ) as avg_response_hours
      FROM teams t
      LEFT JOIN users u ON u.team_id = t.id
      LEFT JOIN tickets tk ON tk.team_id = t.id
      GROUP BY t.id, t.name, t.description
      ORDER BY t.name ASC
    `)

    res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const teamId = parseInt(req.params.id as string)

        const result = await db.execute(sql`
      SELECT 
        t.*,
        COUNT(DISTINCT u.id) as members_count,
        COUNT(DISTINCT tk.id) FILTER (WHERE tk.status != 'closed') as active_tickets
      FROM teams t
      LEFT JOIN users u ON u.team_id = t.id
      LEFT JOIN tickets tk ON tk.team_id = t.id
      WHERE t.id = ${teamId}
      GROUP BY t.id
    `)

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Team not found' })
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            name: z.string().min(2),
            description: z.string().optional()
        })

        const body = schema.parse(req.body)

        const [team] = await db
            .insert(teams)
            .values({
                name: body.name,
                description: body.description,
            })
            .returning()

        res.status(201).json(team)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

export default router
