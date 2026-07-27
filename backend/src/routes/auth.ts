import { Router, Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, createToken } from "../lib/auth";
import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'manager', 'agent']).optional(),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
    try {
        const body = registerSchema.parse(req.body)

        const [existingUser] = await db.select().from(users).where(eq(users.email, body.email))
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' })
        }
        const hashedPassword = await hashPassword(body.password)

        const [user] = await db.insert(users).values({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role || 'agent'
        }).returning()

        const token = createToken({ id: user.id, role: user.role, email: user.email })

        res.status(201).json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.post('/login', async (req: Request, res: Response) => {
    try {
        const body = loginSchema.parse(req.body)

        const [user] = await db.select().from(users).where(eq(users.email, body.email))
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const valid = await comparePassword(body.password, user.password)
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = createToken({ id: user.id, role: user.role, email: user.email })

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch {
        res.status(400).json({ error: 'Invalid data' })
    }
})

router.get('/me', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'No token' })

    try {
        const { verifyToken } = await import('../lib/auth')
        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)

        const [user] = await db.select().from(users).where(eq(users.id, decoded.id))
        if (!user) return res.status(404).json({error: 'User not found'})

        res.json({ id: user.id, name: user.name, email: user.email, role: user.role })
    } catch {
        res.status(401).json({ error: 'Invalid data' })
    }
})

export default router

