import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth'
import dashboardRoutes from './routes/dashboard'
import ticketRoutes from './routes/tickets'
import messageRoutes from './routes/messages'
import teamRoutes from './routes/teams'
import assignmentRuleRoutes from './routes/assigmentRules'
import automationRuleRoutes from './routes/automationRules'
import customStatusRoutes from './routes/customStatuses'
import slaRouter from './routes/sla'
import savedAnswersRoutes from './routes/savedAnswers'
import usersRoutes from './routes/users'
import jointSessionRoutes from './routes/jointSessions'
import emailIntegrationsRoutes from './routes/emailIntegrations'
import reportsRoutes from './routes/reports'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1',
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many login attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(generalLimiter)

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://supportdesk-ai-five.vercel.app',
    ],
    credentials: true,
}))

app.use(express.json({ limit: '10mb' }))

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'SupportDesk API running' })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/tickets/:id/messages', messageRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/assignment-rules', assignmentRuleRoutes)
app.use('/api/automation-rules', automationRuleRoutes)
app.use('/api/sla', slaRouter)
app.use('/api/custom-statuses', customStatusRoutes)
app.use('/api/saved-answers', savedAnswersRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/joint-sessions', jointSessionRoutes)
app.use('/api/email-integrations', emailIntegrationsRoutes)
app.use('/api/reports', reportsRoutes)

const server = http.createServer(app)
const wss = new WebSocketServer({ server })
const rooms = new Map<number, Set<WebSocket>>()

wss.on('connection', (ws) => {
    let currentSession: number | null = null

    ws.on('message', (raw) => {
        try {
            const data = JSON.parse(raw.toString())

            if (data.type === 'join') {
                currentSession = data.sessionId
                if (currentSession === undefined || currentSession === null) {
                    throw new Error('Не вказано ID сесії')
                }
                if (!rooms.has(currentSession)) {
                    rooms.set(currentSession, new Set())
                }
                rooms.get(currentSession)!.add(ws)
            }

            if (data.type === 'message' && currentSession) {
                const room = rooms.get(currentSession)
                if (room) {
                    room.forEach((client) => {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(data))
                        }
                    })
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Невідома помилка парсингу'
            ws.send(JSON.stringify({
                type: 'error',
                message: `Помилка WebSocket: ${errorMessage}`,
            }))
        }
    })

    ws.on('close', () => {
        if (currentSession) {
            rooms.get(currentSession)?.delete(ws)
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

export default app