import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ChatContainer from "../components/ChatContainer"
import React from "react"
import { vi } from "vitest"

// Mocks de hooks y dependencias externas
vi.mock("../hooks/useAxiosRefresh", () => ({
    __esModule: true,
    default: () => ({
        post: vi.fn((url) => {
            if (url === "/message/user") {
                return Promise.resolve({ data: [{ id: 1, idEmitor: "2", content: "Hola", deleted: false }] })
            }
            return Promise.resolve({ data: {} })
        }),
    }),
}))

vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useNavigate: () => vi.fn(),
}))

vi.mock("../hooks/useAuth", () => ({
    useAuth: () => ({
        auth: { roleId: 1 }
    })
}))

// Mock de Logout y ChatInput para aislar el test
vi.mock("../components/Logout", () => ({
    __esModule: true,
    default: () => <div data-testid="logout" />
}))
vi.mock("../components/ChatInput", () => ({
    __esModule: true,
    default: ({ sendMessage, emitTyping }) => (
        <div data-testid="chatinput">
            <button onClick={() => sendMessage("test")}>Enviar</button>
            <button onClick={() => emitTyping(true)}>Typing</button>
        </div>
    )
}))
vi.mock("../components/Messages", () => ({
    __esModule: true,
    default: ({ messages }) => (
        <div data-testid="messages">
            {messages.map((msg, i) => <div key={i}>{msg.content}</div>)}
        </div>
    )
}))

describe("ChatContainer", () => {
    const baseProps = {
        currentChat: { id: "2", firstName: "Pepe", img: "/avatar.png" },
        currentUser: { id: "1", firstName: "Juan" },
        socket: {
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn()
        },
        onlineUsers: ["2"]
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renderiza el nombre y avatar del chat actual", async () => {
        render(<ChatContainer {...baseProps} />)
        expect(await screen.findByText("Pepe")).toBeInTheDocument()
        expect(screen.getByAltText("")).toHaveAttribute("src", "/avatar.png")
    })

    it("muestra el estado 'En línea' si el usuario está online", async () => {
        render(<ChatContainer {...baseProps} />)
        expect(await screen.findByText("En línea")).toBeInTheDocument()
    })

    it("muestra el estado 'Desconectado' si el usuario no está online", async () => {
        render(<ChatContainer {...baseProps} onlineUsers={[]} />)
        expect(await screen.findByText("Desconectado")).toBeInTheDocument()
    })

    it("renderiza los mensajes recibidos", async () => {
        render(<ChatContainer {...baseProps} />)
        expect(await screen.findByTestId("messages")).toHaveTextContent("Hola")
    })

    it("muestra el botón de admin si el usuario es admin", async () => {
        render(<ChatContainer {...baseProps} />)
        expect(screen.getByTitle("Panel de administración")).toBeInTheDocument()
    })

    it("llama a sendMessage y emitTyping de ChatInput", async () => {
        render(<ChatContainer {...baseProps} />)
        fireEvent.click(screen.getByText("Enviar"))
        fireEvent.click(screen.getByText("Typing"))
    })

    it("muestra el indicador de escribiendo cuando isTyping es true", async () => {
        // Simula el evento de typing
        const socket = {
            on: vi.fn((event, cb) => {
                if (event === "typing") {
                    setTimeout(() => cb({ from: "2", isTyping: true }), 10)
                }
            }),
            off: vi.fn(),
            emit: vi.fn()
        }
        render(<ChatContainer {...baseProps} socket={socket} />)
        expect(await screen.findByText("Escribiendo...")).toBeInTheDocument()
    })
})