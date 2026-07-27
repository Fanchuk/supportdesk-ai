import { Router, Response } from 'express'
import { db } from '../db'
import { assignmentRules } from '../db/schema'
import { eq, sql } from 'drizzle-orm'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.execute(sql`
        SELECT
           ar.*,
           t.name as team_name,
           COUNT(tk.id) as tickets_assigned
        FROM assignment_rules as ar
        LEFT JOIN teams t ON ar.team_id = t.id
        LEFT JOIN tickets tk ON tk.team_id = ar.team_id
        GROUP BY ar.id, t.name
        ORDER BY ar.created_at DESC
        `)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, requireRole(['admin', 'manager']), async (req: AuthRequest, res: Response) => {
    try {
       const schema = z.object({
           name: z.string().min(2),
           keywords: z.array(z.string()),
           teamId: z.number(),
       })
       const body = schema.parse(req.body)

       const [rule] = await db.insert(assignmentRules).values({
        name: body.name,
        keywords: body.keywords,
        teamId: body.teamId
       }).returning()

       res.status(201).json(rule)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.patch('/:id', authenticate, requireRole(['admin', 'manager']), async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            isActive: z.boolean().optional(),
            name: z.string().optional(),
            keywords: z.array(z.string()).optional(),
            teamId: z.number().optional(),
        })
        const body = schema.parse(req.body)
        const ruleId = parseInt(req.params.id as string)

        const [rule] = await db.update(assignmentRules)
               .set(body)
               .where(eq(assignmentRules.id, ruleId))
               .returning()

        if (!rule) return res.status(404).json({ error: 'Rule not found' })

        res.json(rule)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

export default router