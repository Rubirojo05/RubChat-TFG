import request from 'supertest'
import express from 'express'
import { messagesRouter } from '../routes/messages.router.js'

const app = express()
app.use(express.json())
app.use('/messages', messagesRouter)

describe('Messages Router', () => {
    it('GET /messages responde con 401 si no está autenticado', async () => {
        const res = await request(app).get('/messages')
        expect(res.status).toBe(401)
    })

    it('POST /messages responde con 401 si no está autenticado', async () => {
        const res = await request(app).post('/messages').send({})
        expect(res.status).toBe(401)
    })

    it('DELETE /messages responde con 401 si no está autenticado', async () => {
        const res = await request(app).delete('/messages')
        expect(res.status).toBe(401)
    })

    it('POST /messages/upload-image responde con 401 si no está autenticado', async () => {
        const res = await request(app).post('/messages/upload-image')
        expect(res.status).toBe(401)
    })

    it('POST /messages/upload-audio responde con 401 si no está autenticado', async () => {
        const res = await request(app).post('/messages/upload-audio')
        expect(res.status).toBe(401)
    })

    it('PUT /messages responde con 401 si no está autenticado', async () => {
        const res = await request(app).put('/messages').send({})
        expect(res.status).toBe(401)
    })

    it('POST /messages/unread-counts responde con 401 si no está autenticado', async () => {
        const res = await request(app).post('/messages/unread-counts').send({})
        expect(res.status).toBe(401)
    })

    it('POST /messages/mark-as-read responde con 401 si no está autenticado', async () => {
        const res = await request(app).post('/messages/mark-as-read').send({})
        expect(res.status).toBe(401)
    })

    it('POST /messages/user responde con 401 si no está autenticado', async () => {
        const res = await request(app).post('/messages/user').send({})
        expect(res.status).toBe(401)
    })
})