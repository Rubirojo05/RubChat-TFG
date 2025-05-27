import express from 'express'
import logger from 'morgan'
import { config } from 'dotenv'
import { userRouter } from './routes/user.router.js'
import { messagesRouter } from './routes/messages.router.js'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { corsConfiguration } from './utils/corsConfiguration.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.router.js'
import { errorHandler } from './middleware/errorHandler.js'
import path from 'path'
import { decodeToken } from './utils/jwt.js'

config()

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(logger('dev'))
app.use(cors(corsConfiguration()))

const server = createServer(app)
const io = new Server(server, {
    cors: corsConfiguration()
})

let onlineUsers = new Map()

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.accessToken) {
        const decode = decodeToken(socket.handshake.query.accessToken)
        if (!decode) return next(new Error('Authentication error'))
        socket.decoded = decode
        next()
    }
    else {
        next(new Error('Authentication error'));
    }
})
    .on('connection', (socket) => {
        console.log('usuario conectado')
        onlineUsers.set(socket.decoded.id, socket.id)
        console.log('onlineUsers ahora:', Array.from(onlineUsers.keys()))
        io.emit('online-users', Array.from(onlineUsers.keys()).map(String))

        socket.on('typing', ({ to, from, isTyping }) => {
            const receptorSocketId = onlineUsers.get(to)
            if (receptorSocketId) {
                io.to(receptorSocketId).emit('typing', { from, isTyping })
            }
        })

        socket.on('disconnect', () => {
            console.log('usuario desconectado')
            onlineUsers.delete(socket.decoded.id)
            io.emit('online-users', Array.from(onlineUsers.keys()).map(String))
        })
    })

app.use('/message', (req, res, next) => {
    req.emitToSocket = (eventName, eventData, emisorId, receptorId) => {
        emisorId = emisorId || req.body.idEmitor || req.id
        receptorId = receptorId || req.body.idReceptor
        const receptorSocketId = onlineUsers.get(receptorId)
        const emisorSocketId = onlineUsers.get(emisorId)
        if (receptorSocketId) {
            io.to(receptorSocketId).emit(eventName, eventData)
        }
        if (emisorSocketId && emisorSocketId !== receptorSocketId) {
            io.to(emisorSocketId).emit(eventName, eventData)
        }
    }
    next()
}, messagesRouter)

app.use('/auth', authRouter)
app.use('/user', userRouter)

app.use('*', errorHandler)

const PORT = process.env.PORTAPI || 3000

server.listen(PORT, () => { console.log(`server running on port: ${PORT}`) })