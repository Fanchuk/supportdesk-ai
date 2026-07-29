import { Router, Response } from 'express'
import { db } from '../db'
import { emailIntegrations } from '../db/schema'
import { eq } from 'drizzle-orm'
import { authenticate, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.select().from(emailIntegrations).orderBy(emailIntegrations.id)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            email: z.string().email(),
            provider: z.string(),
            host: z.string(),
            port: z.number(),
            login: z.string(),
        })
        const body = schema.parse(req.body)
        const [integration] = await db.insert(emailIntegrations).values(body).returning()
        res.status(201).json(integration)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            email: z.string().optional(),
            provider: z.string().optional(),
            host: z.string().optional(),
            port: z.number().optional(),
            login: z.string().optional(),
            isActive: z.boolean().optional(),
        })
        const body = schema.parse(req.body)
        const id = parseInt(req.params.id as string)

        const [integration] = await db.update(emailIntegrations)
            .set(body)
            .where(eq(emailIntegrations.id, id))
            .returning()

        if (!integration) return res.status(404).json({ error: 'Not found' })
        res.json(integration)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string)
        const [integration] = await db.delete(emailIntegrations)
            .where(eq(emailIntegrations.id, id))
            .returning()

        if (!integration) return res.status(404).json({ error: 'Not found' })
        res.json(integration)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router