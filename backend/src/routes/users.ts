import { Router, Response } from 'express'
import { db } from '../db'
import { users } from '../db/schema'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            teamId: users.teamId,
        }).from(users).orderBy(users.name)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router