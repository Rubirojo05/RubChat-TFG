import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import * as jwtUtils from '../utils/jwt.js'
import jsonwebtoken from 'jsonwebtoken'

describe('jwt.js', () => {
    const OLD_ENV = process.env

    beforeAll(() => {
        process.env.ACCESS_TOKEN_SECRET = 'testsecret'
        process.env.REFRESH_TOKEN_SECRET = 'refreshsecret'
    })

    afterAll(() => {
        process.env = OLD_ENV
    })

    const user = { id: '1', email: 'a@a.com', roleId: 2 }

    it('createAccessToken y decodeToken funcionan correctamente', () => {
        const token = jwtUtils.createAccessToken(user)
        const decoded = jwtUtils.decodeToken(token)
        expect(decoded.email).toBe(user.email)
        expect(decoded.id).toBe(user.id)
        expect(decoded.roleId).toBe(user.roleId)
        expect(decoded.tokenType).toBe('token')
    })

    it('createRefreshToken y decodeTokenRefresh funcionan correctamente', () => {
        const token = jwtUtils.createRefreshToken(user)
        const decoded = jwtUtils.decodeTokenRefresh(token)
        expect(decoded.email).toBe(user.email)
        expect(decoded.id).toBe(user.id)
        expect(decoded.roleId).toBe(user.roleId)
        expect(decoded.tokenType).toBe('token')
    })

    it('decodeToken lanza error con token inválido', () => {
        expect(() => jwtUtils.decodeToken('token_invalido')).toThrow()
    })
})