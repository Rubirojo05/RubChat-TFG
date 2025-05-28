import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Messages from "../components/Messages"
import React from "react"

// Mock del servicio de borrado
vi.mock("../services/message", () => ({
    deleteMessage: vi.fn(() => Promise.resolve())
}))

const mockSocket = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
}

const currentUser = { id: "1", firstName: "Current" }

const baseMessages = [
    { id: "m1", idEmitor: "1", content: "Hola", deleted: false },
    { id: "m2", idEmitor: "2", content: "¿Qué tal?", deleted: false }
]

describe("Messages component", () => {
    let setMessages

    beforeEach(() => {
        setMessages = vi.fn()
        mockSocket.on.mockReset()
        mockSocket.off.mockReset()
        mockSocket.emit.mockReset()
    })

    it("muestra el estado vacío si no hay mensajes", () => {
        render(
            <Messages messages={[]} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        expect(screen.getByText("¡No hay mensajes aún!")).toBeInTheDocument()
        expect(screen.getByText(/Escríbele un mensaje/)).toBeInTheDocument()
    })

    it("renderiza mensajes de emisor y receptor", () => {
        render(
            <Messages messages={baseMessages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        expect(screen.getByText("Hola")).toBeInTheDocument()
        expect(screen.getByText("¿Qué tal?")).toBeInTheDocument()
        // El mensaje del emisor debe tener la clase "emisor"
        expect(screen.getAllByText("Hola")[0].closest(".message")).toHaveClass("emisor")
        // El mensaje del receptor debe tener la clase "receptor"
        expect(screen.getAllByText("¿Qué tal?")[0].closest(".message")).toHaveClass("receptor")
    })

    it("renderiza una imagen si el mensaje es una url de imagen", () => {
        const messages = [
            { id: "m1", idEmitor: "1", content: "foto.png", deleted: false }
        ]
        render(
            <Messages messages={messages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        const img = screen.getByAltText("imagen")
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", expect.stringContaining("foto.png"))
    })

    it("renderiza un audio si el mensaje es una url de audio", () => {
        const messages = [
            { id: "m1", idEmitor: "1", content: "audio.mp3", deleted: false }
        ]
        const { container } = render(
            <Messages messages={messages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        const audio = container.querySelector("audio")
        expect(audio).toBeInTheDocument()
        expect(audio).toHaveAttribute("src", expect.stringContaining("audio.mp3"))
    })

    it("muestra mensaje eliminado si deleted=true (emisor)", () => {
        const messages = [
            { id: "m1", idEmitor: "1", content: "Hola", deleted: true }
        ]
        render(
            <Messages messages={messages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        expect(screen.getByText(/Eliminaste este mensaje/)).toBeInTheDocument()
    })

    it("muestra mensaje eliminado si deleted=true (receptor)", () => {
        const messages = [
            { id: "m1", idEmitor: "2", content: "Hola", deleted: true }
        ]
        render(
            <Messages messages={messages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        expect(screen.getByText(/Se eliminó este mensaje/)).toBeInTheDocument()
    })

    it("abre menú contextual al hacer click derecho en mensaje propio", async () => {
        render(
            <Messages messages={baseMessages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        const emisorMsg = screen.getByText("Hola").closest(".message")
        fireEvent.contextMenu(emisorMsg)
        expect(screen.getByText("Borrar mensaje")).toBeInTheDocument()
    })

    it("no abre menú contextual en mensajes de otros", () => {
        render(
            <Messages messages={baseMessages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        const receptorMsg = screen.getByText("¿Qué tal?").closest(".message")
        fireEvent.contextMenu(receptorMsg)
        expect(screen.queryByText("Borrar mensaje")).not.toBeInTheDocument()
    })

    it("muestra modal de confirmación al pulsar borrar mensaje", async () => {
        render(
            <Messages messages={baseMessages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        const emisorMsg = screen.getByText("Hola").closest(".message")
        fireEvent.contextMenu(emisorMsg)
        fireEvent.click(screen.getByText("Borrar mensaje"))
        expect(screen.getByText(/¿Eliminar mensaje para todos/)).toBeInTheDocument()
        expect(screen.getByText("Cancelar")).toBeInTheDocument()
        expect(screen.getByText("Borrar")).toBeInTheDocument()
    })

    it("cierra el modal de confirmación al pulsar cancelar", async () => {
        render(
            <Messages messages={baseMessages} currentUser={currentUser} socket={mockSocket} setMessages={setMessages} />
        )
        const emisorMsg = screen.getByText("Hola").closest(".message")
        fireEvent.contextMenu(emisorMsg)
        fireEvent.click(screen.getByText("Borrar mensaje"))
        fireEvent.click(screen.getByText("Cancelar"))
        await waitFor(() => {
            expect(screen.queryByText(/¿Eliminar mensaje para todos/)).not.toBeInTheDocument()
        })
    })
})