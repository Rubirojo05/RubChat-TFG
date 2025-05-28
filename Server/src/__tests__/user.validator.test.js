import { describe, it, expect } from 'vitest'
import { validateUser } from '../validator/user.validator.js'

describe('validateUser', () => {
    const validUser = {
        firstName: 'Ruben',
        lastName: 'Gomez',
        email: 'ruben@example.com',
        img: { size: 1000, type: 'image/png' },
        password: '123456',
        confirmpassword: '123456',
        roleId: '2'
    }

    it('valida un usuario correcto', () => {
        const result = validateUser(validUser)
        expect(result.success).toBe(true)
    })

    it('falla si falta el email', () => {
        const { email, ...user } = validUser
        const result = validateUser(user)
        expect(result.success).toBe(false)
    })

    it('falla si las contraseñas no coinciden', () => {
        const user = { ...validUser, confirmpassword: 'diferente' }
        const result = validateUser(user)
        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('password do not match')
    })

    it('falla si la imagen es demasiado grande', () => {
        const user = { ...validUser, img: { size: 6 * 1024 * 1024, type: 'image/png' } }
        const result = validateUser(user)
        expect(result.success).toBe(false)
    })

    it('falla si la imagen tiene un tipo no permitido', () => {
        const user = { ...validUser, img: { size: 1000, type: 'image/gif' } }
        const result = validateUser(user)
        expect(result.success).toBe(false)
    })
})