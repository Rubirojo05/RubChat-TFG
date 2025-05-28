"use client"

import { useEffect, useRef, useState } from "react"
import { deleteMessage } from "../services/message"
import "../styles/Messages.css"

const BASE_URL = import.meta.env.VITE_API_URL

const getFullUrl = (url) => {
  if (!url) return ""
  if (url.startsWith("http")) return url
  return BASE_URL + url
}

const isImage = (msg) => typeof msg === "string" && msg.match(/\.(jpeg|jpg|png|gif|webp)$/i)
const isAudio = (msg) => typeof msg === "string" && msg.match(/\.(mp3|wav|ogg|webm)$/i)

const Messages = ({ messages, currentUser, socket, setMessages }) => {
  const scroll = useRef()
  const [contextMenu, setContextMenu] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Scroll al último mensaje
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Cierra menú contextual al hacer click fuera o al hacer scroll
  useEffect(() => {
    const closeMenu = () => setContextMenu(null)
    window.addEventListener("click", closeMenu)
    window.addEventListener("scroll", closeMenu)
    return () => {
      window.removeEventListener("click", closeMenu)
      window.removeEventListener("scroll", closeMenu)
    }
  }, [])

  // Llama a la función de borrado
  const handleDelete = async (messageId) => {
    setConfirmDelete(null)
    try {
      await deleteMessage(messageId)
      // El backend emitirá 'msg-delete' por socket y el useEffect lo actualizará localmente
    } catch (err) {
      alert("Error al borrar el mensaje")
    }
  }

  // Escucha evento de borrado por socket y actualiza el mensaje (no lo borra del array, solo marca como eliminado)
  useEffect(() => {
    if (!socket) return
    const onDelete = (updatedMsg) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === updatedMsg.id
            ? { ...msg, ...updatedMsg, deleted: !!updatedMsg.deleted }
            : msg
        )
      )
    }
    socket.on("msg-delete", onDelete)
    return () => socket.off("msg-delete", onDelete)
  }, [socket, setMessages])

  return (
    <div className="messages-container">
      {messages && messages.length > 0 ? (
        messages.map((message, idx) => (
          <div
            ref={idx === messages.length - 1 ? scroll : null}
            key={message.id}
            className={`message ${currentUser.id === message.idEmitor ? "emisor" : "receptor"}`}
            onContextMenu={e => {
              e.preventDefault()
              if (currentUser.id === message.idEmitor && !message.deleted) {
                setContextMenu({ x: e.clientX, y: e.clientY, messageId: message.id })
              } else {
                setContextMenu(null)
              }
            }}
          >
            <div className={`content${isAudio(message.content) ? " audio-content" : ""}`}>
              {message.deleted ? (
                <div className="deleted-msg">
                  <span role="img" aria-label="eliminado">🚫</span>
                  {currentUser.id === message.idEmitor
                    ? " Eliminaste este mensaje"
                    : " Se eliminó este mensaje"}
                </div>
              ) : isImage(message.content) ? (
                <img src={getFullUrl(message.content)} alt="imagen" className="msg-image" />
              ) : isAudio(message.content) ? (
                <audio controls src={getFullUrl(message.content)} className="msg-audio" />
              ) : (
                <p className="msg-text">{message.content}</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="messages-emptystate">
          <h2>¡No hay mensajes aún!</h2>
          <p>Escríbele un mensaje para iniciar la conversación 🚀</p>
        </div>
      )}
      {contextMenu && (
        <div className="messages-contextmenu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={() => {
            setConfirmDelete(contextMenu.messageId)
            setContextMenu(null)
          }}>
            Borrar mensaje
          </button>
        </div>
      )}
      {confirmDelete && (
        <div className="messages-confirmmodal">
          <span className="warning-icon" role="img" aria-label="Advertencia">⚠️</span>
          <div className="modal-title">¿Eliminar mensaje para todos?</div>
          <div className="modal-desc">Esta acción no se puede deshacer.</div>
          <div className="modal-actions">
            <button onClick={() => setConfirmDelete(null)}>Cancelar</button>
            <button className="danger" onClick={() => handleDelete(confirmDelete)}>Borrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages