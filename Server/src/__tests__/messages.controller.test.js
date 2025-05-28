import { describe, it, expect, vi, afterEach } from 'vitest'
import * as messagesController from '../controllers/messages.controller.js'

const mockRes = () => {
    const res = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
}

describe('messages.controller', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('addUserMessage', () => {
        it('debe devolver 400 si la validación falla', async () => {
            vi.spyOn(messagesController, 'validateMessage').mockReturnValue({ error: { message: '"error"' } })
            const req = { body: {} }
            const res = mockRes()
            await messagesController.addUserMessage(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
    })

    describe('updateMessages', () => {
        it('debe devolver 400 si la validación falla', async () => {
            vi.spyOn(messagesController, 'validateMessageUpdate').mockReturnValue({ error: { message: '"error"' } })
            const req = { body: {} }
            const res = mockRes()
            await messagesController.updateMessages(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getMessages', () => {
        it('debe devolver 400 si no hay mensajes', async () => {
            vi.spyOn(messagesController.Message, 'getAll').mockResolvedValue([])
            const req = {}
            const res = mockRes()
            await messagesController.getMessages(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
    })

    describe('deleteMessage', () => {
        it('debe devolver 400 si falta id', async () => {
            const req = { body: {} }
            const res = mockRes()
            await messagesController.deleteMessage(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
        it('debe devolver 400 si el mensaje no existe', async () => {
            vi.spyOn(messagesController.Message, 'getById').mockResolvedValue([[]])
            const req = { body: { id: 'id' } }
            const res = mockRes()
            await messagesController.deleteMessage(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
        })
    })
})