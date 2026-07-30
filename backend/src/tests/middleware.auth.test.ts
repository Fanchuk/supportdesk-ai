import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { Response, NextFunction } from 'express'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import { createToken } from '../lib/auth'

beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret'
})

describe('authenticate', () => {
    let res: Partial<Response>
    let next: NextFunction

    beforeEach(() => {
        res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }
        next = vi.fn()
    })

    it('401 без токена', () => {
        const req = { headers: {} } as AuthRequest
        authenticate(req, res as Response, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()
    })

    it('401 з невалідним токеном', () => {
        const req = { headers: { authorization: 'Bearer bad-token' } } as AuthRequest
        authenticate(req, res as Response, next)
        expect(res.status).toHaveBeenCalledWith(401)
    })

    it('викликає next() і встановлює req.user з валідним токеном', () => {
        const token = createToken({ id: 42, role: 'agent', email: 'a@a.com' })
        const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest
        authenticate(req, res as Response, next)
        expect(next).toHaveBeenCalled()
        expect(req.user).toMatchObject({ id: 42, role: 'agent' })
    })
})

describe('requireRole', () => {
    let res: Partial<Response>
    let next: NextFunction

    beforeEach(() => {
        res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }
        next = vi.fn()
    })

    it('403 якщо роль не підходить', () => {
        const req = { user: { id: 1, role: 'agent', email: 'a@a.com' } } as AuthRequest
        requireRole(['admin'])(req, res as Response, next)
        expect(res.status).toHaveBeenCalledWith(403)
    })

    it('next() якщо роль підходить', () => {
        const req = { user: { id: 1, role: 'admin', email: 'a@a.com' } } as AuthRequest
        requireRole(['admin', 'manager'])(req, res as Response, next)
        expect(next).toHaveBeenCalled()
    })

    it('403 якщо user відсутній', () => {
        const req = {} as AuthRequest
        requireRole(['admin'])(req, res as Response, next)
        expect(res.status).toHaveBeenCalledWith(403)
    })
})