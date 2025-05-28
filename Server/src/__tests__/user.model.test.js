import { describe, it, expect, vi, afterEach } from 'vitest'
import { UserModel } from '../models/user.model.js'
import * as db from '../models/DBConnection.js'

describe('UserModel', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('add inserta un usuario correctamente', async () => {
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce([{}])
        const userModel = new UserModel()
        await userModel.add({
            id: '1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: '1234',
            img: 'img.png',
            roleId: 2
        })
        expect(mockQuery).toHaveBeenCalledWith(
            'INSERT INTO users(id, firstName, lastName, email, password, img, roleId) VALUES(?,?,?,?,?,?,?)',
            ['1', 'Test', 'User', 'test@example.com', '1234', 'img.png', 2]
        )
    })

    it('getAll devuelve todos los usuarios', async () => {
        const mockUsers = [[{ id: '1', email: 'a' }]]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockUsers)
        const userModel = new UserModel()
        const result = await userModel.getAll()
        expect(mockQuery).toHaveBeenCalledWith('SELECT id,firstName,lastName,email,img,roleId FROM users')
        expect(result).toBe(mockUsers)
    })

    it('getByEmail busca por email', async () => {
        const mockUsers = [[{ id: '1', email: 'a' }]]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockUsers)
        const userModel = new UserModel()
        const result = await userModel.getByEmail({ email: 'a' })
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email=?', ['a'])
        expect(result).toBe(mockUsers)
    })

    it('getById busca por id', async () => {
        const mockUsers = [[{ id: '1', email: 'a' }]]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockUsers)
        const userModel = new UserModel()
        const result = await userModel.getById({ id: '1' })
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id=?', ['1'])
        expect(result).toBe(mockUsers)
    })

    it('deletebyEmail elimina por email', async () => {
        const mockResult = [{}]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const userModel = new UserModel()
        const result = await userModel.deletebyEmail({ email: 'a' })
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM users WHERE emailUser=?', ['a'])
        expect(result).toBe(mockResult)
    })

    it('deletebyId elimina por id', async () => {
        const mockResult = [{}]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const userModel = new UserModel()
        const result = await userModel.deletebyId({ id: '1' })
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM users WHERE id=?', ['1'])
        expect(result).toBe(mockResult)
    })

    it('updatebyId actualiza correctamente', async () => {
        const mockResult = [{}]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const userModel = new UserModel()
        const result = await userModel.updatebyId({ id: '1', data: { firstName: 'Nuevo', email: 'nuevo@a.com' } })
        expect(mockQuery).toHaveBeenCalledWith(
            'UPDATE users SET firstName = ?, email = ? WHERE id = ?',
            ['Nuevo', 'nuevo@a.com', '1']
        )
        expect(result).toBe(mockResult)
    })
})