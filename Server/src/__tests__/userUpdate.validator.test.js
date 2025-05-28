import { describe, it, expect } from 'vitest'
import { validateUpdateUser, validateUpdateUserPartial } from '../validator/userUpdate.validator.js'

describe('validateUpdateUser', () => {
    const validUser = {
        firstName: 'Ruben',
        lastName: 'Gomez',
        email: 'ruben@example.com',
        img: { size: 1000, type: 'image/png' },
        password: '123456',
        roleId: '2',
        active: '1'
    }

    it('valida un usuario válido', () => {
        const result = validateUpdateUser(validUser)
        expect(result.success).toBe(true)
    })

    it('falla si el email es inválido', () => {
        const user = { ...validUser, email: 'noesemail' }
        const result = validateUpdateUser(user)
        expect(result.success).toBe(false)
    })

    it('falla si la imagen es demasiado grande', () => {
        const user = { ...validUser, img: { size: 6 * 1024 * 1024, type: 'image/png' } }
        const result = validateUpdateUser(user)
        expect(result.success).toBe(false)
    })

    it('falla si la imagen tiene un tipo no permitido', () => {
        const user = { ...validUser, img: { size: 1000, type: 'image/gif' } }
        const result = validateUpdateUser(user)
        expect(result.success).toBe(false)
    })
})

describe('validateUpdateUserPartial', () => {
    it('permite objetos vacíos', () => {
        const result = validateUpdateUserPartial({})
        expect(result.success).toBe(true)
    })

    it('valida un campo individual', () => {
        const result = validateUpdateUserPartial({ firstName: 'Ruben' })
        expect(result.success).toBe(true)
    })

    it('falla si el email es inválido', () => {
        const result = validateUpdateUserPartial({ email: 'noesemail' })
        expect(result.success).toBe(false)
    })
})