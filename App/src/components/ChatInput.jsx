"use client"

import styled from "styled-components"
import { EmojiIcon, SendIcons } from "./Icons"
import EmojiPicker from "emoji-picker-react"
import { useRef, useState } from "react"
import { uploadImage, uploadAudio } from "../services/messageFiles"
import { FaMicrophone, FaMusic } from "react-icons/fa"

// Icono de imagen SVG
const ImageIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

// Icono de subir archivo de audio (nota musical)
const UploadAudioIcon = () => (
  <FaMusic size={24} color="#555" />
)

// Icono de grabar audio (micro gris o círculo rojo)
const RecordIcon = ({ recording }) =>
  recording
    ? <svg width="24" height="24" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
    : <FaMicrophone size={24} color="#555" />

const ChatInput = ({ sendMessage }) => {
  const [showEmojiPiecker, setShowEmojiPiecker] = useState(false)
  const [msg, setMsg] = useState("")
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const inputRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (msg.trim() !== "") {
      sendMessage(msg)
      setMsg("")
    }
  }

  const handleEmoji = (e) => {
    const message = inputRef.current.value + e.emoji
    setMsg(message)
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
  }

  // --- AUDIO POR MICRO ---
  const handleRecord = async () => {
    if (recording) {
      // Detener grabación
      if (mediaRecorder) mediaRecorder.stop()
      setRecording(false)
      return
    }
    // Iniciar grabación
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new window.MediaRecorder(stream)
      let chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" })
        // Subir a Cloudinary
        try {
          const url = await uploadAudio(new File([audioBlob], "audio.webm", { type: "audio/webm" }))
          sendMessage(url)
        } catch (err) {
          alert("Error al subir el audio")
        }
        setAudioChunks([])
      }
      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      recorder.start()
      setRecording(true)
    } catch (err) {
      alert("No se pudo acceder al micrófono")
    }
  }

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
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
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
        <button type="submit">
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
        display: grid;
        align-items: center;
        justify-content: space-around;
        grid-template-columns: 5% 70% 5% 5% 5% 5% 5%;
        width: 100%;
        height: 100%;
        background-color: #f0f0f0;
        position: relative;
        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: #555;
            border-radius: 1rem;
            transition: background 0.2s;
            padding: 0.2rem;
        }
        .icon:hover {
            background-color: rgba(0, 0, 0, 0.07);
        }
        input[type="text"] {
            height: 60%;
            border-radius: 2rem;
            font-size: 1.2rem;
            padding-left: 1rem;
            padding-right: 1rem;
            background-color: #ffffff;
            color: #333;
            border: 1px solid #e0e0e0;
        }
        ::placeholder { color: #999 }
        .EmojiPickerReact {
            position: absolute;
            bottom: 80px;
            left: 0;
            z-index: 10;
        }
        button {
            width: 100%;
            height: 60%;
            border-radius: 2rem;
            background-color: #333;
            border: none;
            cursor: pointer;
            svg {
                width: 100%;
                height: 60%;
            }
        }
        button:hover {
            background-color: #555;
        }
        svg {
            width: 80%;
            height: 60%;
        }
        
        @media screen and (max-width: 768px) {
            grid-template-columns: 10% 60% 10% 10% 10% 10% 10%;
            input[type="text"] {
                font-size: 1rem;
            }
        }
    }
`

export default ChatInput