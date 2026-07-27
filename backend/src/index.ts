import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import dashboardRoutes from './routes/dashboard'
import ticketRoutes from './routes/tickets'
import messageRoutes from './routes/messages'
import teamRoutes from './routes/teams'
import assignmentRuleRoutes from './routes/assigmentRules'
import automationRuleRoutes from './routes/automationRules'
import customStatusRoutes from './routes/customStatuses'
import slaRouter from './routes/sla'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
)
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'SupportDesk API running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/tickets/:id/messages', messageRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/assignment-rules', assignmentRuleRoutes)
app.use('/api/automation-rules', automationRuleRoutes)
app.use('/api/sla', slaRouter)
app.use('/api/custom-statuses', customStatusRoutes)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

export default app
