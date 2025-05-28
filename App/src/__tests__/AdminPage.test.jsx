import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import AdminPage from '../components/AdminPage'
import React from 'react'

// Mock de useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    }
})

// Mock de useAuth
vi.mock('../hooks/useAuth', () => ({
    useAuth: () => ({
        auth: { accessToken: 'fake-token' }
    })
}))

// Mock automático de axios
vi.mock('../services/axios')

import { instancePrivate } from '../services/axios'

const usersMock = [
    {
        id: 1,
        firstName: 'Ruben',
        email: 'ruben@email.com',
        img: 'img1.jpg',
        roleId: 1,
        role_id: 1,
    },
    {
        id: 2,
        firstName: 'Ana',
        email: 'ana@email.com',
        img: 'img2.jpg',
        roleId: 2,
        role_id: 2,
    }
]

const mockGet = instancePrivate.get
const mockPatch = instancePrivate.patch
const mockDelete = instancePrivate.delete

describe('AdminPage', () => {
    beforeEach(() => {
        mockGet.mockReset()
        mockPatch.mockReset()
        mockDelete.mockReset()
        mockGet.mockResolvedValue({ data: usersMock })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('muestra el loading y luego los usuarios', async () => {
        render(<AdminPage />)
        expect(screen.getByText(/Cargando usuarios/i)).toBeInTheDocument()
        expect(mockGet).toHaveBeenCalledWith('/user/all')
        await screen.findByText('Ruben')
        expect(screen.getByText('Ana')).toBeInTheDocument()
        expect(screen.getByText('ruben@email.com')).toBeInTheDocument()
        expect(screen.getByText('ana@email.com')).toBeInTheDocument()
    })

    it('filtra usuarios por nombre y muestra mensaje si no hay resultados', async () => {
        render(<AdminPage />)
        await screen.findByText('Ruben')
        const input = screen.getByPlaceholderText(/Buscar usuario/i)
        fireEvent.change(input, { target: { value: 'ana' } })
        expect(screen.getByText('1 usuario encontrado')).toBeInTheDocument()
        expect(screen.getByText('Ana')).toBeInTheDocument()
        expect(screen.queryByText('Ruben')).not.toBeInTheDocument()

        fireEvent.change(input, { target: { value: 'noexiste' } })
        expect(screen.getByText(/Usuario no encontrado/i)).toBeInTheDocument()
    })

    it('permite cambiar el rol y guardar cambios', async () => {
        mockPatch.mockResolvedValue({})
        render(<AdminPage />)
        await screen.findByText('Ruben')
        const selects = screen.getAllByRole('combobox')
        fireEvent.change(selects[0], { target: { value: '2' } })
        const saveBtns = screen.getAllByTitle('Guardar cambios')
        expect(saveBtns[0]).toBeVisible()
        fireEvent.click(saveBtns[0])
        await waitFor(() => expect(mockPatch).toHaveBeenCalledWith('/user/', { id: 1, roleId: 2 }))
        expect(mockGet).toHaveBeenCalledTimes(2)
    })

    it('confirma el borrado de usuario y recarga la lista', async () => {
        mockDelete.mockResolvedValue({})
        render(<AdminPage />)
        await screen.findByText('Ruben')
        const deleteBtns = screen.getAllByTitle('Eliminar usuario')
        fireEvent.click(deleteBtns[0])
        const confirmBtn = screen.getByText('Eliminar')
        fireEvent.click(confirmBtn)
        await waitFor(() => expect(mockDelete).toHaveBeenCalledWith('/user/', { data: { id: 1 } }))
        expect(mockGet).toHaveBeenCalledTimes(2)
    })

    it('muestra alert si hay error al cargar usuarios', async () => {
        mockGet.mockRejectedValueOnce(new Error('fail'))
        window.alert = vi.fn()
        render(<AdminPage />)
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Error al cargar usuarios/i)))
    })

    it('muestra alert si hay error al actualizar rol', async () => {
        mockPatch.mockRejectedValueOnce({ response: { status: 409 } })
        window.alert = vi.fn()
        render(<AdminPage />)
        await screen.findByText('Ruben')
        const selects = screen.getAllByRole('combobox')
        fireEvent.change(selects[0], { target: { value: '2' } })
        const saveBtns = screen.getAllByTitle('Guardar cambios')
        fireEvent.click(saveBtns[0])
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Ya existe un usuario/i)))
    })

    it('muestra alert si hay error al borrar usuario', async () => {
        mockDelete.mockRejectedValueOnce(new Error('fail'))
        window.alert = vi.fn()
        render(<AdminPage />)
        await screen.findByText('Ruben')
        const deleteBtns = screen.getAllByTitle('Eliminar usuario')
        fireEvent.click(deleteBtns[0])
        const confirmBtn = screen.getByText('Eliminar')
        fireEvent.click(confirmBtn)
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Error al borrar usuario/i)))
    })
})