import { pool } from './DBConnection.js'

export class MessageModel {
    async add({ id, idEmitor, idReceptor, content, date }) {
        // Guarda read: false al crear el mensaje
        const result = await pool.query(
            'INSERT INTO messages(id,date,idEmitor,idReceptor,content,`read`) VALUES(?,?,?,?,?,?)',
            [id, date, idEmitor, idReceptor, content, false]
        )
        return result
    }
    async getByEmail({ email }) {
        const result = await pool.query('SELECT * FROM messages WHERE  emailUser=?', [email])
        return result
    }
    async getById({ id }) {
        const result = await pool.query('SELECT * FROM messages WHERE id=?', [id])
        return result
    }
    async getByIdEmisorReceptor({ id, idReceptor }) {
        const result = await pool.query('SELECT * FROM messages WHERE (idEmitor=? AND idReceptor=?) OR (idReceptor=? AND idEmitor=?) ORDER BY date', [id, idReceptor, id, idReceptor])
        return result
    }
    async getByIdOfUser({ id }) {
        const result = await pool.query('SELECT * FROM messages WHERE idEmitor=? OR idReceptor=?', [id, id])
        return result
    }
    async getAll() {
        const result = await pool.query('SELECT * FROM messages')
        return result
    }
    async delete({ id }) {
        const result = await pool.query('DELETE FROM messages WHERE id=?', [id])
        return result
    }
    async deleteAllByUser({ id }) {
        // Borra todos los mensajes donde el usuario sea emisor o receptor
        return await pool.query('DELETE FROM messages WHERE idEmitor=? OR idReceptor=?', [id, id])
    }
    async update({ id, content, idUser }) {
        const result = await pool.query('UPDATE messages SET content=? WHERE id=? AND idEmitor=?', [content, id, idUser])
        return result
    }
}