import { describe, it, expect } from 'vitest'
import { allErrors } from '../middleware/allErrors.js'

describe('allErrors middleware', () => {
    it('devuelve el status y mensaje del error', () => {
        const error = new Error('Algo salió mal')
        error.statusCode = 400
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        allErrors(error, {}, res, () => { })
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ status: 400, message: 'Algo salió mal' })
    })

    it('devuelve 500 si no hay statusCode', () => {
        const error = new Error('Error interno')
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        allErrors(error, {}, res, () => { })
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ status: 500, message: 'Error interno' })
    })
})