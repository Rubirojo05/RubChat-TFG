import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Contacts from "../components/Contacts"
import React from "react"

// Mock useAuth hook
vi.mock("../hooks/useAuth", () => ({
    useAuth: () => ({
        updateAuthLogin: vi.fn(),
        auth: { id: "1", url: "user1.jpg" }
    })
}))

// Mock axios instance
vi.mock("../services/axios", () => ({
    instancePrivate: {
        patch: vi.fn(() =>
            Promise.resolve({
                data: { user: { img: "newimg.jpg" } }
            })
        )
    }
}))

const contacts = [
    { id: "1", firstName: "Alice", email: "alice@mail.com", img: "alice.jpg" },
    { id: "2", firstName: "Bob", email: "bob@mail.com", img: "bob.jpg" }
]

const currentUser = { id: "1", firstName: "Current", url: "user1.jpg" }

describe("Contacts component", () => {
    let changeChatMock

    beforeEach(() => {
        changeChatMock = vi.fn()
    })

    it("renders current user info", () => {
        render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        expect(screen.getByText("Current")).toBeInTheDocument()
        expect(screen.getAllByAltText("")[2]).toHaveAttribute("src", "user1.jpg")
    })

    it("renders contacts list", () => {
        render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        expect(screen.getByText("Alice")).toBeInTheDocument()
        expect(screen.getByText("Bob")).toBeInTheDocument()
    })

    it("calls changeChat when contact is clicked", () => {
        render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        // Click en la tarjeta de Alice (no en el avatar)
        fireEvent.click(screen.getByText("Alice").closest(".contact"))
        expect(changeChatMock).toHaveBeenCalledWith(contacts[0])
    })

    it("abre y cierra el modal al hacer click en el avatar de un contacto", async () => {
        const { container } = render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        // Click en el avatar de Alice (primer contacto)
        fireEvent.click(screen.getAllByAltText("")[0])
        expect(screen.getByAltText("Foto de perfil")).toBeInTheDocument()
        // Cierra el modal haciendo click en el overlay
        fireEvent.click(container.querySelector(".modal-overlay"))
        await waitFor(() => {
            expect(screen.queryByAltText("Foto de perfil")).not.toBeInTheDocument()
        })
    })

    it("abre y cierra el modal al hacer click en el avatar del usuario actual", async () => {
        const { container } = render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        // Click en el avatar del usuario actual (último img)
        fireEvent.click(screen.getAllByAltText("")[2])
        expect(screen.getByAltText("Foto de perfil")).toBeInTheDocument()
        fireEvent.click(container.querySelector(".modal-overlay"))
        await waitFor(() => {
            expect(screen.queryByAltText("Foto de perfil")).not.toBeInTheDocument()
        })
    })

    it("muestra el botón de cambiar imagen solo para el usuario actual", async () => {
        render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        // Click en el avatar del usuario actual
        fireEvent.click(screen.getAllByAltText("")[2])
        expect(await screen.findByText(/Cambiar imagen/)).toBeInTheDocument()
        // Click en el avatar de Alice (no debe aparecer el botón)
        fireEvent.click(screen.getAllByAltText("")[0])
        expect(screen.queryByText(/Cambiar imagen/)).not.toBeInTheDocument()
    })

    it("filters contacts by search", () => {
        render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        const input = screen.getByPlaceholderText("Buscar usuario...")
        fireEvent.change(input, { target: { value: "bob" } })
        expect(screen.getByText("Bob")).toBeInTheDocument()
        expect(screen.queryByText("Alice")).not.toBeInTheDocument()
    })

    it("shows not found message if no contact matches search", () => {
        render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        const input = screen.getByPlaceholderText("Buscar usuario...")
        fireEvent.change(input, { target: { value: "zzz" } })
        expect(screen.getByText(/No se encontró ningún contacto/)).toBeInTheDocument()
    })

    it("shows unread badge if unread prop is set", () => {
        render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
                unread={{ "2": 3 }}
            />
        )
        expect(screen.getByText("3")).toBeInTheDocument()
    })

    it("shows online status dot if user is online", () => {
        render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
                onlineUsers={["2"]}
            />
        )
        // El primer contacto (Alice) está offline, el segundo (Bob) online
        const statusDots = screen.getAllByTitle(/(En línea|Desconectado)/)
        expect(statusDots[1]).toHaveClass("status-dot online")
    })

    it("muestra error si subes un archivo que no es imagen", async () => {
        const { container } = render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        // Abre modal del usuario actual
        fireEvent.click(screen.getAllByAltText("")[2])
        // Click en el botón de cambiar imagen
        fireEvent.click(await screen.findByText(/Cambiar imagen/))
        // Selecciona el input de tipo file
        const fileInput = container.querySelector('input[type="file"]')
        const file = new File(["test"], "test.txt", { type: "text/plain" })
        fireEvent.change(fileInput, { target: { files: [file] } })
        expect(await screen.findByText(/no es una imagen válida/i)).toBeInTheDocument()
    })

    it("muestra mensaje de éxito tras subir imagen", async () => {
        const { container } = render(
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={changeChatMock}
            />
        )
        // Abre modal del usuario actual
        fireEvent.click(screen.getAllByAltText("")[2])
        // Click en el botón de cambiar imagen
        fireEvent.click(await screen.findByText(/Cambiar imagen/))
        // Selecciona el input de tipo file
        const fileInput = container.querySelector('input[type="file"]')
        const file = new File(["img"], "img.png", { type: "image/png" })
        fireEvent.change(fileInput, { target: { files: [file] } })
        expect(await screen.findByText(/Imagen cambiada correctamente/i)).toBeInTheDocument()
    })
})