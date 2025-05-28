import { describe, it, expect, vi, afterEach } from 'vitest'
import { userAuthenticated } from '../middleware/authorization.js'
import * as jwtUtils from '../utils/jwt.js'

describe('userAuthenticated middleware', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    const mockRes = () => {
        const res = {}
        res.status = vi.fn().mockReturnValue(res)
        res.json = vi.fn().mockReturnValue(res)
        return res
    }

    it('devuelve 401 si no hay header Authorization', () => {
        const req = { headers: {} }
        const res = mockRes()
        const next = vi.fn()
        userAuthenticated(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
        expect(next).not.toHaveBeenCalled()
    })

    it('devuelve 401 si el header no empieza por Bearer', () => {
        const req = { headers: { authorization: 'Token abc' } }
        const res = mockRes()
        const next = vi.fn()
        userAuthenticated(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
        expect(next).not.toHaveBeenCalled()
    })

    it('devuelve 401 si el token es inválido', () => {
        const req = { headers: { authorization: 'Bearer abc' } }
        const res = mockRes()
        const next = vi.fn()
        vi.spyOn(jwtUtils, 'decodeToken').mockImplementation(() => { throw new Error('invalid') })
        userAuthenticated(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ response: 'Unauthorized' })
        expect(next).not.toHaveBeenCalled()
    })

    it('devuelve 403 si el token está expirado', () => {
        const req = { headers: { authorization: 'Bearer abc' } }
        const res = mockRes()
        const next = vi.fn()
        vi.spyOn(jwtUtils, 'decodeToken').mockReturnValue({ exp: 1, id: '1' })
        userAuthenticated(req, res, next)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' })
        expect(next).not.toHaveBeenCalled()
    })

    it('llama a next y añade req.id si el token es válido', () => {
        const req = { headers: { authorization: 'Bearer abc' } }
        const res = mockRes()
        const next = vi.fn()
        const now = new Date().getTime() + 100000
        vi.spyOn(jwtUtils, 'decodeToken').mockReturnValue({ exp: now, id: '123' })
        userAuthenticated(req, res, next)
        expect(req.id).toBe('123')
        expect(next).toHaveBeenCalled()
    })
})