import { Router, Response } from 'express'
import { db } from '../db'
import { automationRules } from '../db/schema'
import { eq, sql } from 'drizzle-orm'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
 try {
       const result = await db.execute(sql`
        SELECT
                COUNT(*) FILTER (WHERE is_active = true) as active_count,
                COUNT(*) as total_count,
                COALESCE(SUM(executed_count), 0) as total_executed,
                COALESCE(SUM(
                    CASE 
                        WHEN created_at >= DATE_TRUNC('month', NOW()) 
                        THEN executed_count 
                        ELSE 0 
                    END
                ), 0) as executed_this_month
            FROM automation_rules
        `)

    const row = result.rows[0] as any
    const totalExecuted = Number(row.executed_this_month)
    const estimatedHours = Math.round(totalExecuted * 0.025)

    res.json({
        activeCount: Number(row.active_count),
        totalCount: Number(row.total_count),
        actionsThisMonth: totalExecuted,
        timeSavedHours: estimatedHours
    })
 } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
 }
})

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.execute(sql`
            SELECT 
                id, 
                name, 
                description, 
                trigger, 
                action,
                condition_hours as "conditionHours",
                is_active as "isActive",
                executed_count as "executedCount",
                created_at as "createdAt"
            FROM automation_rules
            ORDER BY created_at DESC
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
            description: z.string().optional(),
            trigger: z.enum(['new_ticket', 'time_based', 'status_change']),
            action: z.enum(['close_ticket', 'send_email', 'change_priority', 'reassign']),
            conditionHours: z.number().optional(),
        })

        const body = schema.parse(req.body)

        const [rule] = await db
            .insert(automationRules)
            .values({
                name: body.name,
                description: body.description,
                trigger: body.trigger,
                action: body.action,
                conditionHours: body.conditionHours,
                isActive: true,
                executedCount: 0,
            })
            .returning()

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
    })

    const body = schema.parse(req.body)
    const ruleId = parseInt(req.params.id as string)

    const [rule] = await db.update(automationRules)
      .set(body)
      .where(eq(automationRules.id, ruleId))
      .returning()

    if (!rule) return res.status(404).json({ error: 'Rule not found' })

    res.json(rule)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Invalid data' })
  }
})

export default router