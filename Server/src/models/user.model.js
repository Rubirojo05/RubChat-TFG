import { pool } from './DBConnection.js'

export class UserModel {
        async add({ id, firstName, lastName, email, password, roleId, img }) {

                await pool.query('INSERT INTO users(id, firstName, lastName, email, password, img, roleId) VALUES(?,?,?,?,?,?,?)', [id, firstName, lastName, email, password, img, roleId])

        }
        async getAll() {
                return await pool.query('SELECT id,firstName,lastName,email,img,roleId FROM users')
        }
        async getByEmail({ email }) {
                const result = await pool.query('SELECT * FROM users WHERE email=?', [email])
                return result
        }
        async getById({ id }) {
                return await pool.query('SELECT * FROM users WHERE id=?', [id])
        }
        async deletebyEmail({ email }) {
                const result = await pool.query('DELETE FROM users WHERE emailUser=?', [email])

                return result
        }
        async deletebyId({ id }) {
                return await pool.query('DELETE FROM users WHERE id=?', [id])
        }
        async updatebyId({ id, data }) {
                const columns = Object.keys(data).map(col => `${col} = ?`).join(', ')
                const values = Object.values(data)
                const sql = `UPDATE users SET ${columns} WHERE id = ?`
                values.push(id)
                return await pool.query(sql, values)
        }
}
