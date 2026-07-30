import { describe, it, expect, beforeAll } from 'vitest'
import { hashPassword, comparePassword, createToken, verifyToken } from '../lib/auth'

beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret'
})

describe('hashPassword / comparePassword', () => {
    it('хешує пароль і порівнює правильно', async () => {
        const hash = await hashPassword('mypassword')
        expect(hash).not.toBe('mypassword')
        const valid = await comparePassword('mypassword', hash)
        expect(valid).toBe(true)
    })

    it('повертає false для невірного пароля', async () => {
        const hash = await hashPassword('mypassword')
        const valid = await comparePassword('wrongpassword', hash)
        expect(valid).toBe(false)
    })
})

describe('createToken / verifyToken', () => {
    it('створює і верифікує токен', () => {
        const payload = { id: 1, role: 'admin', email: 'test@test.com' }
        const token = createToken(payload)
        expect(typeof token).toBe('string')
        const decoded = verifyToken(token)
        expect(decoded.id).toBe(1)
        expect(decoded.role).toBe('admin')
        expect(decoded.email).toBe('test@test.com')
    })

    it('кидає помилку для невалідного токена', () => {
        expect(() => verifyToken('invalid.token.here')).toThrow()
    })
})