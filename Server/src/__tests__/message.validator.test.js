import { describe, it, expect } from 'vitest'
import { validateMessage, validateMessageUpdate } from '../validator/message.validator.js'

describe('validateMessage', () => {
    it('valida un mensaje correcto', () => {
        const result = validateMessage({ content: 'Hola', idReceptor: '123' })
        expect(result.success).toBe(true)
    })

    it('falla si falta content', () => {
        const result = validateMessage({ idReceptor: '123' })
        expect(result.success).toBe(false)
    })

    it('falla si falta idReceptor', () => {
        const result = validateMessage({ content: 'Hola' })
        expect(result.success).toBe(false)
    })
})

describe('validateMessageUpdate', () => {
    it('valida un update correcto', () => {
        const result = validateMessageUpdate({ content: 'Hola', idUser: '1', id: '2' })
        expect(result.success).toBe(true)
    })

    it('falla si falta id', () => {
        const result = validateMessageUpdate({ content: 'Hola', idUser: '1' })
        expect(result.success).toBe(false)
    })

    it('falla si falta idUser', () => {
        const result = validateMessageUpdate({ content: 'Hola', id: '2' })
        expect(result.success).toBe(false)
    })
})