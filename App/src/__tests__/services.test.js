import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as userService from '../services/user'
import * as authService from '../services/auth'
import * as messageService from '../services/message'
import * as messageFilesService from '../services/messageFiles'
import * as axiosModule from '../services/axios'

// Mock de las instancias axios personalizadas
const mockPost = vi.fn()
const mockGet = vi.fn()
const mockDelete = vi.fn()
const mockPatch = vi.fn()

beforeEach(() => {
    vi.clearAllMocks()
    axiosModule.instancePublic.post = mockPost
    axiosModule.instanceRegister.post = mockPost
    axiosModule.instanceRefresh.get = mockGet
    axiosModule.instancePrivate.delete = mockDelete
    axiosModule.instancePrivate.post = mockPost
    axiosModule.instancePrivate.patch = mockPatch
})

// --- user.js ---
describe('user.js', () => {
    it('loginWithAxios devuelve datos al loguear correctamente', async () => {
        mockPost.mockResolvedValueOnce({ data: { token: 'abc' } })
        const data = await userService.loginWithAxios({ email: 'a', password: 'b' })
        expect(data).toEqual({ token: 'abc' })
        expect(mockPost).toHaveBeenCalledWith('/auth/login', { email: 'a', password: 'b' }, { withCredentials: true })
    })

    it('loginWithAxios maneja error y retorna undefined', async () => {
        mockPost.mockRejectedValueOnce(new Error('fail'))
        const data = await userService.loginWithAxios({ email: 'a', password: 'b' })
        expect(data).toBeUndefined()
    })

    it('register devuelve datos al registrar correctamente', async () => {
        mockPost.mockResolvedValueOnce({ data: { ok: true } })
        const data = await userService.register('formdata')
        expect(data).toEqual({ ok: true })
        expect(mockPost).toHaveBeenCalledWith('/user/register', 'formdata')
    })
})

// --- auth.js ---
describe('auth.js', () => {
    it('refreshToken devuelve datos correctamente', async () => {
        mockGet.mockResolvedValueOnce({ data: { refreshed: true } })
        const data = await authService.refreshToken()
        expect(data).toEqual({ refreshed: true })
        expect(mockGet).toHaveBeenCalledWith('/auth/refresh')
    })

    it('refreshToken maneja error y retorna undefined', async () => {
        mockGet.mockRejectedValueOnce(new Error('fail'))
        const data = await authService.refreshToken()
        expect(data).toBeUndefined()
    })
})

// --- message.js ---
describe('message.js', () => {
    it('deleteMessage llama a axios.delete con el id correcto', async () => {
        mockDelete.mockResolvedValueOnce({ data: { deleted: true } })
        const res = await messageService.deleteMessage(123)
        expect(res).toEqual({ data: { deleted: true } })
        expect(mockDelete).toHaveBeenCalledWith('/message', { data: { id: 123 } })
    })
})

// --- messageFiles.js ---
describe('messageFiles.js', () => {
    it('uploadImage sube imagen y retorna url', async () => {
        mockPost.mockResolvedValueOnce({ data: { url: 'img.jpg' } })
        const file = new File(['a'], 'a.jpg', { type: 'image/jpeg' })
        const url = await messageFilesService.uploadImage(file)
        expect(url).toBe('img.jpg')
        expect(mockPost).toHaveBeenCalled()
        const formData = mockPost.mock.calls[0][1]
        expect(formData instanceof FormData).toBe(true)
    })

    it('uploadAudio sube audio y retorna url', async () => {
        mockPost.mockResolvedValueOnce({ data: { url: 'audio.mp3' } })
        const file = new File(['a'], 'a.mp3', { type: 'audio/mp3' })
        const url = await messageFilesService.uploadAudio(file)
        expect(url).toBe('audio.mp3')
        expect(mockPost).toHaveBeenCalled()
        const formData = mockPost.mock.calls[0][1]
        expect(formData instanceof FormData).toBe(true)
    })
})