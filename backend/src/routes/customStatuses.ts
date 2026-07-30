import { Router, Response } from 'express'
import { db } from '../db'
import { customStatuses } from '../db/schema'
import { eq } from 'drizzle-orm'
import { authenticate, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.select().from(customStatuses).orderBy(customStatuses.id)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            label: z.string().min(2),
            color: z.string(),
            description: z.string().optional(),
        })
        const body = schema.parse(req.body)
        const [status] = await db.insert(customStatuses).values(body).returning()
        res.status(201).json(status)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            label: z.string().optional(),
            color: z.string().optional(),
            description: z.string().optional(),
            isActive: z.boolean().optional(),
        })
        const body = schema.parse(req.body)
        const id = parseInt(req.params.id as string)

        const [status] = await db.update(customStatuses)
            .set({
                ...(body.label !== undefined && { label: body.label }),
                ...(body.color !== undefined && { color: body.color }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.isActive !== undefined && { isActive: body.isActive }),
            })
            .where(eq(customStatuses.id, id))
            .returning()

        if (!status) return res.status(404).json({ error: 'Status not found' })
        res.json(status)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string)
        const [status] = await db.delete(customStatuses).where(eq(customStatuses.id, id)).returning()
        if (!status) return res.status(404).json({ error: 'Status not found' })
        res.json(status)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router