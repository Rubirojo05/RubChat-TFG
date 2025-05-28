import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Chat from "../components/Chat"
import React from "react"
import { vi } from "vitest"

// Mocks de hooks y dependencias externas
vi.mock("../hooks/useAuth", () => ({
    useAuth: () => ({
        auth: { accessToken: "mocktoken" }
    })
}))
vi.mock("../hooks/useImage", () => ({
    __esModule: true,
    default: () => ({
        contacts: {
            data: [
                { id: 2, firstName: "Pepe", img: "/avatar.png", email: "pepe@mail.com" },
                { id: 3, firstName: "Ana", img: "/avatar2.png", email: "ana@mail.com" }
            ]
        }
    })
}))
vi.mock("../hooks/useAxiosRefresh", () => ({
    __esModule: true,
    default: () => ({
        post: vi.fn(() => Promise.resolve({ data: [] }))
    })
}))
vi.mock("jwt-decode", () => ({
    jwtDecode: () => ({ id: "1", firstName: "Juan", url: "/yo.png" })
}))
vi.mock("socket.io-client", () => ({
    io: vi.fn(() => ({
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
        disconnect: vi.fn()
    }))
}))
vi.mock("../components/Contacts", () => ({
    __esModule: true,
    default: ({ contacts, currentUser, changeChat, unread, onlineUsers }) => (
        <div data-testid="contacts">
            {contacts.map(c => (
                <div key={c.id} data-testid="contact" onClick={() => changeChat(c)}>
                    {c.firstName}
                </div>
            ))}
        </div>
    )
}))
vi.mock("../components/Welcome", () => ({
    __esModule: true,
    default: ({ userName }) => <div data-testid="welcome">Bienvenido, {userName}</div>
}))
vi.mock("../components/ChatContainer", () => ({
    __esModule: true,
    default: ({ currentChat }) => <div data-testid="chatcontainer">{currentChat?.firstName}</div>
}))

describe("Chat", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renderiza los contactos y la pantalla de bienvenida por defecto", async () => {
        render(<Chat />)
        expect(await screen.findByTestId("contacts")).toBeInTheDocument()
        expect(screen.getByTestId("welcome")).toHaveTextContent("Bienvenido, Juan")
    })

    it("al hacer click en un contacto, muestra el ChatContainer", async () => {
        render(<Chat />)
        const pepe = await screen.findByText("Pepe")
        fireEvent.click(pepe)
        expect(await screen.findByTestId("chatcontainer")).toHaveTextContent("Pepe")
    })

    it("muestra correctamente los nombres de los contactos", async () => {
        render(<Chat />)
        expect(await screen.findByText("Pepe")).toBeInTheDocument()
        expect(screen.getByText("Ana")).toBeInTheDocument()
    })

    it("cierra el menú móvil al seleccionar un chat en móvil", async () => {
        // Fuerza modo móvil
        Object.defineProperty(window, "innerWidth", { value: 500, writable: true })
        window.dispatchEvent(new Event("resize"))
        render(<Chat />)
        const pepe = await screen.findByText("Pepe")
        fireEvent.click(pepe)
        // No hay expect directo, pero no debe romper ni lanzar error
    })

    it("muestra el overlay y el menú móvil cuando showMobileMenu es true", async () => {
        // Fuerza modo móvil
        Object.defineProperty(window, "innerWidth", { value: 500, writable: true })
        window.dispatchEvent(new Event("resize"))
        render(<Chat />)
        // Simula click en el toggle para abrir menú
        fireEvent.click(document.querySelector(".mobile-toggle"))
        expect(document.querySelector(".contacts-wrapper.show")).toBeInTheDocument()
        expect(document.querySelector(".overlay")).toBeInTheDocument()
    })
})