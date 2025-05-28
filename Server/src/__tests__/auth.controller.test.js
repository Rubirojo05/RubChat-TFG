import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as authController from '../controllers/auth.controller.js'

const mockRes = () => {
    const res = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    res.cookie = vi.fn().mockReturnValue(res)
    res.clearCookie = vi.fn().mockReturnValue(res)
    return res
}

describe('auth.controller', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('login', () => {
        it('debe devolver 400 si faltan email o password', async () => {
            const req = { body: {} }
            const res = mockRes()
            await authController.login(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
        it('debe devolver 401 si la contraseña no coincide', async () => {
            const req = { body: { email: 'a', password: 'b' } }
            const res = mockRes()
            vi.spyOn(authController.User, 'getByEmail').mockResolvedValue([[{ active: true, password: 'hash' }]])
            vi.spyOn(authController, 'compareHashPassword').mockResolvedValue(false)
            await authController.login(req, res)
            expect(res.status).toHaveBeenCalledWith(401)
        })
    })

    describe('refresh', () => {
        it('debe devolver 401 si no hay refreshToken', async () => {
            const req = { cookies: {} }
            const res = mockRes()
            await authController.refresh(req, res)
            expect(res.status).toHaveBeenCalledWith(401)
        })
    })

    describe('logout', () => {
        it('debe devolver 204 si no hay refreshToken', () => {
            const req = { cookies: {} }
            const res = mockRes()
            authController.logout(req, res)
            expect(res.status).toHaveBeenCalledWith(204)
        })
        it('debe limpiar la cookie si hay refreshToken', () => {
            const req = { cookies: { refreshToken: 'token' } }
            const res = mockRes()
            authController.logout(req, res)
            expect(res.clearCookie).toHaveBeenCalled()
            expect(res.json).toHaveBeenCalledWith({ message: 'cookie cleared' })
        })
    })
})