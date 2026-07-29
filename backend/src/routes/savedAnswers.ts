import { Router, Response } from 'express'
import { db } from '../db'
import { savedAnswers } from '../db/schema'
import { eq } from 'drizzle-orm'
import { authenticate, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.select().from(savedAnswers).orderBy(savedAnswers.id)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            title: z.string().min(2),
            category: z.string().min(1),
            body: z.string().min(1),
        })
        const body = schema.parse(req.body)
        const [answer] = await db.insert(savedAnswers).values(body).returning()
        res.status(201).json(answer)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const schema = z.object({
            title: z.string().optional(),
            category: z.string().optional(),
            body: z.string().optional(),
        })
        const data = schema.parse(req.body)
        const id = parseInt(req.params.id as string)
        const [answer] = await db.update(savedAnswers).set(data).where(eq(savedAnswers.id, id)).returning()
        if (!answer) return res.status(404).json({ error: 'Not found' })
        res.json(answer)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id as string)
        const [answer] = await db.delete(savedAnswers).where(eq(savedAnswers.id, id)).returning()
        if (!answer) return res.status(404).json({ error: 'Not found' })
        res.json(answer)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router