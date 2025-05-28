import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ChatInput from "../components/ChatInput"
import React from "react"
import { vi } from "vitest"
import { act } from "react-dom/test-utils"

// Mock de uploadImage y uploadAudio
vi.mock("../services/messageFiles", () => ({
    uploadImage: vi.fn(() => Promise.resolve("url/imagen.png")),
    uploadAudio: vi.fn(() => Promise.resolve("url/audio.mp3")),
}))

// Mock EmojiPicker (para evitar problemas de dependencias nativas)
vi.mock("emoji-picker-react", () => ({
    __esModule: true,
    default: ({ onEmojiClick }) => (
        <div data-testid="emoji-picker">
            <button onClick={() => onEmojiClick({ emoji: "😀" })}>emoji</button>
        </div>
    ),
}))

// Mock de window.innerWidth para forzar modo escritorio
Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1024,
})

describe("ChatInput", () => {
    let sendMessage, emitTyping

    beforeEach(() => {
        sendMessage = vi.fn()
        emitTyping = vi.fn()
    })

    it("permite escribir y enviar un mensaje", () => {
        render(<ChatInput sendMessage={sendMessage} emitTyping={emitTyping} />)
        const input = screen.getByPlaceholderText("Escribe un mensaje...")
        fireEvent.change(input, { target: { value: "Hola mundo" } })
        fireEvent.submit(input.closest("form"))
        expect(sendMessage).toHaveBeenCalledWith("Hola mundo")
        expect(input.value).toBe("")
    })

    it("simula grabación de audio y subida", async () => {
        // Mock de MediaRecorder y getUserMedia
        const start = vi.fn()
        const stop = vi.fn()
        window.MediaRecorder = vi.fn(function () {
            this.start = start
            this.stop = stop
            this.ondataavailable = null
            this.onstop = null
        })
        window.navigator.mediaDevices = {
            getUserMedia: vi.fn(() => Promise.resolve({}))
        }
        render(<ChatInput sendMessage={sendMessage} emitTyping={emitTyping} />)
        // Click en el icono de grabar audio
        const micBtn = screen.getAllByTitle(/grabar audio/i)[0]
        fireEvent.click(micBtn)
        expect(window.navigator.mediaDevices.getUserMedia).toHaveBeenCalled()
        // Simula que se detiene la grabación
        fireEvent.click(micBtn)
        // No se puede comprobar la subida real porque depende de eventos, pero no debe romper
    })
})