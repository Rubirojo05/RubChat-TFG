import { describe, it, expect, vi, afterEach } from 'vitest'
import * as userController from '../controllers/user.controller.js'

const mockRes = () => {
    const res = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
}

describe('user.controller', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('addUserController', () => {
        it('debe devolver 400 si la validación falla', async () => {
            vi.spyOn(userController, 'validateUser').mockReturnValue({ error: { message: '"error"' } })
            const req = { body: {}, files: {} }
            const res = mockRes()
            await userController.addUserController(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
    })

    describe('updateUserController', () => {
        it('debe devolver 400 si falta id', async () => {
            const req = { body: {} }
            const res = mockRes()
            await userController.updateUserController(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
        it('debe devolver 400 si el usuario no existe', async () => {
            vi.spyOn(userController.User, 'getById').mockResolvedValue([[]])
            const req = { body: { id: 'id' } }
            const res = mockRes()
            await userController.updateUserController(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getAllUsers', () => {
        it('debe devolver 200 con usuarios', async () => {
            vi.spyOn(userController.User, 'getAll').mockResolvedValue([[{ id: 1, img: 'http://img', roleId: 2 }]])
            const req = { id: 2 }
            const res = mockRes()
            await userController.getAllUsers(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
        })
    })

    describe('deleteUser', () => {
        it('debe devolver 400 si falta id', async () => {
            const req = { body: {} }
            const res = mockRes()
            await userController.deleteUser(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
        it('debe devolver 400 si el usuario no existe', async () => {
            vi.spyOn(userController.User, 'getById').mockResolvedValue([[]])
            const req = { body: { id: 'id' } }
            const res = mockRes()
            await userController.deleteUser(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
    })
})