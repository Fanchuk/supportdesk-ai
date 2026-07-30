import { describe, it, expect, vi, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../index'
import { createToken } from '../lib/auth'

beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret'
})

// мокаємо db щоб не йти в реальну БД
vi.mock('../db', () => ({
    db: {
        select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockResolvedValue([]),
                orderBy: vi.fn().mockResolvedValue([]),
            }),
        }),
        insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([{
                    id: 1, name: 'Test', email: 'test@test.com',
                    role: 'agent', password: 'hashed',
                }]),
            }),
        }),
        execute: vi.fn().mockResolvedValue({ rows: [{ total: '0' }] }),
    },
}))

vi.mock('../lib/ai/classify', () => ({
    classifyTicket: vi.fn().mockResolvedValue({ priority: 'medium', category: 'General' }),
}))

const agentToken = () =>
    createToken({ id: 1, role: 'agent', email: 'agent@test.com' })

const adminToken = () =>
    createToken({ id: 2, role: 'admin', email: 'admin@test.com' })

// auth routes
describe('POST /api/auth/register', () => {
    it('400 якщо email невалідний', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'bad-email', password: 'password123' })
        expect(res.status).toBe(400)
    })

    it('400 якщо name < 2 символів', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'A', email: 'test@test.com', password: 'password123' })
        expect(res.status).toBe(400)
    })
})

describe('POST /api/auth/login', () => {
    it('400 якщо email невалідний', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'not-email', password: 'pass' })
        expect(res.status).toBe(400)
    })

    it('401 якщо користувач не знайдений', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'ghost@test.com', password: 'password123' })
        expect(res.status).toBe(401)
    })
})

// tickets routes
describe('GET /api/tickets', () => {
    it('401 без токена', async () => {
        const res = await request(app).get('/api/tickets')
        expect(res.status).toBe(401)
    })

    it('200 з валідним токеном', async () => {
        const res = await request(app)
            .get('/api/tickets')
            .set('Authorization', `Bearer ${agentToken()}`)
        expect(res.status).toBe(200)
    })
})

describe('POST /api/tickets', () => {
    it('400 якщо title < 3 символів', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .set('Authorization', `Bearer ${agentToken()}`)
            .send({ title: 'AB', description: 'Valid description here' })
        expect(res.status).toBe(400)
    })

    it('400 якщо description < 10 символів', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .set('Authorization', `Bearer ${agentToken()}`)
            .send({ title: 'Valid title', description: 'Short' })
        expect(res.status).toBe(400)
    })
})

// assignment rules
describe('GET /api/assignment-rules', () => {
    it('401 без токена', async () => {
        const res = await request(app).get('/api/assignment-rules')
        expect(res.status).toBe(401)
    })
})

describe('POST /api/assignment-rules', () => {
    it('403 для agent (не admin/manager)', async () => {
        const res = await request(app)
            .post('/api/assignment-rules')
            .set('Authorization', `Bearer ${agentToken()}`)
            .send({ name: 'Rule', keywords: ['bug'], teamId: 1 })
        expect(res.status).toBe(403)
    })
})

// users
describe('GET /api/users', () => {
    it('401 без токена', async () => {
        const res = await request(app).get('/api/users')
        expect(res.status).toBe(401)
    })
})

// email integrations
describe('POST /api/email-integrations', () => {
    it('400 якщо email невалідний', async () => {
        const res = await request(app)
            .post('/api/email-integrations')
            .set('Authorization', `Bearer ${adminToken()}`)
            .send({ email: 'bad', provider: 'gmail', host: 'smtp.gmail.com', port: 587, login: 'test' })
        expect(res.status).toBe(400)
    })
})