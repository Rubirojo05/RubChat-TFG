"use client"

import styled from "styled-components"
import { EmojiIcon, SendIcons } from "./Icons"
import EmojiPicker from "emoji-picker-react"
import { useRef, useState } from "react"
import { uploadImage, uploadAudio } from "../services/messageFiles"
import { FaMicrophone, FaMusic } from "react-icons/fa"
import { MoreVertical } from "lucide-react"

const ImageIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

const UploadAudioIcon = () => (
  <FaMusic size={24} color="#555" />
)

const RecordIcon = ({ recording }) =>
  recording
    ? <svg width="24" height="24" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
    : <FaMicrophone size={24} color="#555" />

const ChatInput = ({ sendMessage, emitTyping }) => {
  const [showEmojiPiecker, setShowEmojiPiecker] = useState(false)
  const [msg, setMsg] = useState("")
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const inputRef = useRef()
  const typingTimeout = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (msg.trim() !== "") {
      sendMessage(msg)
      setMsg("")
      if (emitTyping) emitTyping(false)
    }
  }

  const handleEmoji = (e) => {
    const message = inputRef.current.value + e.emoji
    setMsg(message)
    if (emitTyping) emitTyping(true)
    resetTypingTimeout()
  }

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    let url
    if (type === "image") {
      url = await uploadImage(file)
      sendMessage(url)
    } else if (type === "audio") {
      url = await uploadAudio(file)
      sendMessage(url)
    }
    e.target.value = null // reset input
    if (emitTyping) emitTyping(false)
    setShowMobileMenu(false)
  }

  // --- AUDIO POR MICRO ---
  const handleRecord = async () => {
    if (recording) {
      if (mediaRecorder) mediaRecorder.stop()
      setRecording(false)
      if (emitTyping) emitTyping(false)
      setShowMobileMenu(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new window.MediaRecorder(stream)
      let chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" })
        try {
          const url = await uploadAudio(new File([audioBlob], "audio.webm", { type: "audio/webm" }))
          sendMessage(url)
        } catch (err) {
          alert("Error al subir el audio")
        }
        setAudioChunks([])
        if (emitTyping) emitTyping(false)
      }
      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      recorder.start()
      setRecording(true)
      if (emitTyping) emitTyping(true)
      resetTypingTimeout()
    } catch (err) {
      alert("No se pudo acceder al micrófono")
    }
    setShowMobileMenu(false)
  }

  // --- Emitir typing al escribir ---
  const handleInputChange = (e) => {
    setMsg(e.target.value)
    if (emitTyping) emitTyping(true)
    resetTypingTimeout()
  }

  // --- Timeout para dejar de escribir ---
  const resetTypingTimeout = () => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      if (emitTyping) emitTyping(false)
    }, 1500)
  }

  // Detecta si es móvil (ancho <= 600px)
  const isMobile = window.innerWidth <= 600

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div className="icon emoji" onClick={() => setShowEmojiPiecker(!showEmojiPiecker)}>
          <EmojiIcon />
        </div>
        {showEmojiPiecker && <EmojiPicker onEmojiClick={handleEmoji} />}
        <input
          placeholder="Escribe un mensaje..."
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          value={msg}
        />
        {/* PC/tablet: todos los iconos, móvil: solo botón enviar y menú */}
        <div className={`icons-group${isMobile ? " mobile-hide" : ""}`}>
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            style={{ display: "none" }}
            onChange={e => handleFileChange(e, "image")}
          />
          <label htmlFor="image-upload" className="icon">
            <ImageIcon />
          </label>
          <input
            type="file"
            accept="audio/*"
            id="audio-upload"
            style={{ display: "none" }}
            onChange={e => handleFileChange(e, "audio")}
          />
          <label htmlFor="audio-upload" className="icon" title="Subir audio">
            <UploadAudioIcon />
          </label>
          <div className="icon" onClick={handleRecord} title={recording ? "Detener grabación" : "Grabar audio"}>
            <RecordIcon recording={recording} />
          </div>
        </div>
        {/* Móvil: botón de menú de más opciones */}
        {isMobile && (
          <div className="icon more-menu" onClick={() => setShowMobileMenu(v => !v)}>
            <MoreVertical size={22} />
            {showMobileMenu && (
              <MobileMenu onClick={e => e.stopPropagation()}>
                <input
                  type="file"
                  accept="image/*"
                  id="mobile-image-upload"
                  style={{ display: "none" }}
                  onChange={e => handleFileChange(e, "image")}
                />
                <label
                  htmlFor="mobile-image-upload"
                  className="icon"
                  tabIndex={0}
                  onClick={e => e.stopPropagation()}
                  onTouchStart={e => e.stopPropagation()}
                >
                  <ImageIcon />
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  id="mobile-audio-upload"
                  style={{ display: "none" }}
                  onChange={e => handleFileChange(e, "audio")}
                />
                <label
                  htmlFor="mobile-audio-upload"
                  className="icon"
                  title="Subir audio"
                  tabIndex={0}
                  onClick={e => e.stopPropagation()}
                  onTouchStart={e => e.stopPropagation()}
                >
                  <UploadAudioIcon />
                </label>
                <div
                  className="icon"
                  onClick={e => {
                    e.stopPropagation()
                    handleRecord()
                  }}
                  onTouchStart={e => {
                    e.stopPropagation()
                    handleRecord()
                  }}
                  title={recording ? "Detener grabación" : "Grabar audio"}
                  tabIndex={0}
                >
                  <RecordIcon recording={recording} />
                </div>
              </MobileMenu>
            )}
          </div>
        )}
        <button type="submit" className="send-btn">
          <SendIcons />
        </button>
      </form>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    form {
        display: flex;
        align-items: center;
        width: 100%;
        background-color: #f0f0f0;
        position: relative;
        padding: 0.5rem 0.7rem;
        gap: 0.5rem;
        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: #555;
            border-radius: 1rem;
            transition: background 0.2s;
            padding: 0.2rem;
            min-width: 36px;
            min-height: 36px;
            position: relative;
            z-index: 2;
            svg {
                width: 22px;
                height: 22px;
            }
        }
        .icon:hover {
            background-color: rgba(0, 0, 0, 0.07);
        }
        input[type="text"] {
            flex: 1;
            border-radius: 2rem;
            font-size: 1.15rem;
            padding-left: 1rem;
            padding-right: 1rem;
            background-color: #ffffff;
            color: #333;
            border: 1px solid #e0e0e0;
            height: 40px;
        }
        ::placeholder { color: #999 }
        .EmojiPickerReact {
            position: absolute;
            bottom: 60px;
            left: 0;
            z-index: 10;
        }
        .icons-group {
            display: flex;
            align-items: center;
            gap: 0.2rem;
        }
        .send-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background-color: #333;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 0.2rem;
            svg {
                width: 22px;
                height: 22px;
            }
        }
        .send-btn:hover {
            background-color: #555;
        }
        /* --- MOBILE --- */
        @media screen and (max-width: 600px) {
            padding: 0.1rem 0.05rem;
            gap: 0.05rem;
            .icons-group {
                display: none !important;
            }
            .icon {
                min-width: 28px;
                min-height: 28px;
                padding: 0.05rem;
                svg {
                    width: 18px;
                    height: 18px;
                }
            }
            input[type="text"] {
                font-size: 0.97rem;
                height: 32px;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
            }
            .send-btn {
                width: 32px;
                height: 32px;
                svg {
                    width: 16px;
                    height: 16px;
                }
            }
            .more-menu {
                display: flex !important;
                margin-left: 0.05rem;
                margin-right: 0.05rem;
                position: relative;
            }
        }
        @media screen and (min-width: 601px) {
            .more-menu {
                display: none !important;
            }
        }
    }
`

const MobileMenu = styled.div`
  position: absolute;
  bottom: 38px;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  padding: 0.4rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  z-index: 100;
  .icon {
    min-width: 28px;
    min-height: 28px;
    padding: 0.1rem;
    background: #f6f6f6;
    margin-bottom: 0.1rem;
    border-radius: 10px;
    justify-content: flex-start;
    svg {
      width: 18px;
      height: 18px;
    }
  }
  .icon:last-child {
    margin-bottom: 0;
  }
`

export default ChatInput