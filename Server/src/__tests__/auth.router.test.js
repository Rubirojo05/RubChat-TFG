import request from 'supertest'
import express from 'express'
import { authRouter } from '../routes/auth.router.js'

const app = express()
app.use(express.json())
app.use('/auth', authRouter)

describe('Auth Router', () => {
    it('POST /auth/login responde con 400 si faltan datos', async () => {
        const res = await request(app).post('/auth/login').send({})
        expect(res.status).toBe(400)
    })

    it('POST /auth/login responde con 400 si falta el email', async () => {
        const res = await request(app).post('/auth/login').send({ password: '123456' })
        expect(res.status).toBe(400)
    })

    it('POST /auth/login responde con 400 si falta el password', async () => {
        const res = await request(app).post('/auth/login').send({ email: 'test@example.com' })
        expect(res.status).toBe(400)
    })

    it('POST /auth/login responde con 200, 400 o 401 si datos correctos/incorrectos', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'test@example.com',
            password: '123456'
        })
        expect([200, 400, 401]).toContain(res.status)
    })

    it('GET /auth/refresh responde con 401 si no hay token', async () => {
        const res = await request(app).get('/auth/refresh')
        expect(res.status).toBe(401)
    })
})