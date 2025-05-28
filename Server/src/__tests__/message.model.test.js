import { describe, it, expect, vi, afterEach } from 'vitest'
import { MessageModel } from '../models/message.model.js'
import * as db from '../models/DBConnection.js'

describe('MessageModel', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('add inserta un mensaje correctamente', async () => {
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce([{}])
        const messageModel = new MessageModel()
        await messageModel.add({
            id: '1',
            idEmitor: '2',
            idReceptor: '3',
            content: 'Hola',
            date: '2024-01-01'
        })
        expect(mockQuery).toHaveBeenCalledWith(
            'INSERT INTO messages(id,date,idEmitor,idReceptor,content,`read`) VALUES(?,?,?,?,?,?)',
            ['1', '2024-01-01', '2', '3', 'Hola', false]
        )
    })

    it('getByEmail busca mensajes por email', async () => {
        const mockResult = [[{ id: '1', emailUser: 'a' }]]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const messageModel = new MessageModel()
        const result = await messageModel.getByEmail({ email: 'a' })
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM messages WHERE  emailUser=?', ['a'])
        expect(result).toBe(mockResult)
    })

    it('getById busca por id', async () => {
        const mockResult = [[{ id: '1' }]]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const messageModel = new MessageModel()
        const result = await messageModel.getById({ id: '1' })
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM messages WHERE id=?', ['1'])
        expect(result).toBe(mockResult)
    })

    it('getByIdEmisorReceptor busca por emisor y receptor', async () => {
        const mockResult = [[{ id: '1' }]]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const messageModel = new MessageModel()
        const result = await messageModel.getByIdEmisorReceptor({ id: '2', idReceptor: '3' })
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM messages WHERE (idEmitor=? AND idReceptor=?) OR (idReceptor=? AND idEmitor=?) ORDER BY date',
            ['2', '3', '2', '3']
        )
        expect(result).toBe(mockResult)
    })

    it('getByIdOfUser busca todos los mensajes de un usuario', async () => {
        const mockResult = [[{ id: '1' }]]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const messageModel = new MessageModel()
        const result = await messageModel.getByIdOfUser({ id: '2' })
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM messages WHERE idEmitor=? OR idReceptor=?', ['2', '2'])
        expect(result).toBe(mockResult)
    })

    it('getAll devuelve todos los mensajes', async () => {
        const mockResult = [[{ id: '1' }]]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const messageModel = new MessageModel()
        const result = await messageModel.getAll()
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM messages')
        expect(result).toBe(mockResult)
    })

    it('delete hace borrado lógico', async () => {
        const mockResult = [{}]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const messageModel = new MessageModel()
        const result = await messageModel.delete({ id: '1' })
        expect(mockQuery).toHaveBeenCalledWith('UPDATE messages SET deleted=TRUE WHERE id=?', ['1'])
        expect(result).toBe(mockResult)
    })

    it('deleteAllByUser borra todos los mensajes de un usuario', async () => {
        const mockResult = [{}]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const messageModel = new MessageModel()
        const result = await messageModel.deleteAllByUser({ id: '2' })
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM messages WHERE idEmitor=? OR idReceptor=?', ['2', '2'])
        expect(result).toBe(mockResult)
    })

    it('update actualiza el contenido de un mensaje', async () => {
        const mockResult = [{}]
        const mockQuery = vi.spyOn(db.pool, 'query').mockResolvedValueOnce(mockResult)
        const messageModel = new MessageModel()
        const result = await messageModel.update({ id: '1', content: 'nuevo', idUser: '2' })
        expect(mockQuery).toHaveBeenCalledWith(
            'UPDATE messages SET content=? WHERE id=? AND idEmitor=?',
            ['nuevo', '1', '2']
        )
        expect(result).toBe(mockResult)
    })
})