import { describe, it, expect, vi, afterEach } from 'vitest'
import * as authUtils from '../utils/auth.js'
import bcrypt from 'bcrypt'

describe('auth.js', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('hashPassword genera un hash distinto al texto plano', async () => {
        const password = '123456'
        const hash = await authUtils.hashPassword({ password })
        expect(hash).not.toBe(password)
        expect(hash.length).toBeGreaterThan(10)
    })

    it('compareHashPassword devuelve true para el hash correcto', async () => {
        const password = '123456'
        const hash = await bcrypt.hash(password, 10)
        const result = await authUtils.compareHashPassword({ password, hashed_password: hash })
        expect(result).toBe(true)
    })

    it('compareHashPassword devuelve false para el hash incorrecto', async () => {
        const password = '123456'
        const hash = await bcrypt.hash('otro', 10)
        const result = await authUtils.compareHashPassword({ password, hashed_password: hash })
        expect(result).toBe(false)
    })
})