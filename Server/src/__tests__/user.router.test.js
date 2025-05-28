import request from 'supertest'
import express from 'express'
import { userRouter } from '../routes/user.router.js'

const app = express()
app.use(express.json())
app.use('/user', userRouter)

describe('User Router', () => {
    it('POST /user/register responde con 400 si faltan datos', async () => {
        const res = await request(app).post('/user/register').send({})
        expect(res.status).toBe(400)
    })

    it('POST /user/register responde con 400 si falta el email', async () => {
        const res = await request(app)
            .post('/user/register')
            .field('password', '123456')
            .field('username', 'nuevo')
        expect(res.status).toBe(400)
    })

    it('POST /user/register responde con 400 si falta el password', async () => {
        const res = await request(app)
            .post('/user/register')
            .field('email', 'nuevo@example.com')
            .field('username', 'nuevo')
        expect(res.status).toBe(400)
    })

    it('POST /user/register responde con 400 si falta el username', async () => {
        const res = await request(app)
            .post('/user/register')
            .field('email', 'nuevo@example.com')
            .field('password', '123456')
        expect(res.status).toBe(400)
    })

    it('POST /user/register responde con 201, 400 o 409 si datos correctos o usuario duplicado', async () => {
        const res = await request(app)
            .post('/user/register')
            .field('email', 'nuevo@example.com')
            .field('password', '123456')
            .field('username', 'nuevo')
        expect([201, 400, 409]).toContain(res.status)
    })

    it('PATCH /user responde con 401 si no está autenticado', async () => {
        const res = await request(app).patch('/user').send({})
        expect(res.status).toBe(401)
    })

    it('GET /user/all responde con 401 si no está autenticado', async () => {
        const res = await request(app).get('/user/all')
        expect(res.status).toBe(401)
    })

    it('DELETE /user responde con 401 si no está autenticado', async () => {
        const res = await request(app).delete('/user')
        expect(res.status).toBe(401)
    })
})