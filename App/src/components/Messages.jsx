"use client"

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { deleteMessage } from "../services/message"

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
    <Container>
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
                <DeletedMsg>
                  <span role="img" aria-label="eliminado">🚫</span>
                  {currentUser.id === message.idEmitor
                    ? " Eliminaste este mensaje"
                    : " Se eliminó este mensaje"}
                </DeletedMsg>
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
        <EmptyState>
          <h2>¡No hay mensajes aún!</h2>
          <p>Escríbele un mensaje para iniciar la conversación 🚀</p>
        </EmptyState>
      )}
      {contextMenu && (
        <ContextMenu style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={() => {
            setConfirmDelete(contextMenu.messageId)
            setContextMenu(null)
          }}>
            Borrar mensaje
          </button>
        </ContextMenu>
      )}
      {confirmDelete && (
        <ConfirmModal>
          <span className="warning-icon" role="img" aria-label="Advertencia">⚠️</span>
          <div className="modal-title">¿Eliminar mensaje para todos?</div>
          <div className="modal-desc">Esta acción no se puede deshacer.</div>
          <ModalActions>
            <button onClick={() => setConfirmDelete(null)}>Cancelar</button>
            <button className="danger" onClick={() => handleDelete(confirmDelete)}>Borrar</button>
          </ModalActions>
        </ConfirmModal>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1rem 2rem;
  overflow-y: auto;
  height: 100%;
  min-height: 0;
  background-color: #f9f9f9;

  .message {
    display: flex;
    align-items: flex-end;
    margin-bottom: 0.5rem;
    .content {
      max-width: 320px;
      width: auto;
      padding: 1rem;
      font-size: 1rem;
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      word-break: break-word;
      background: none;
    }
    .audio-content {
      max-width: 320px;
      width: 100%;
      padding: 1rem 0.5rem;
    }
  }
  .emisor {
    justify-content: flex-end;
    .content {
      background-color: #333;
      color: #fff;
      align-items: flex-end;
    }
    .audio-content {
      background-color: #333;
      color: #fff;
      align-items: flex-end;
    }
  }
  .receptor {
    justify-content: flex-start;
    .content {
      background-color: #e0e0e0;
      color: #333;
      align-items: flex-start;
    }
    .audio-content {
      background-color: #e0e0e0;
      color: #333;
      align-items: flex-start;
    }
  }
  .msg-image {
    max-width: 220px;
    width: 100%;
    border-radius: 8px;
    margin-bottom: 0.3rem;
    background: #fff;
    display: block;
  }
  .msg-audio {
    width: 100%;
    min-width: 120px;
    max-width: 320px;
    margin-bottom: 0.3rem;
    display: block;
  }
  .msg-text {
    margin: 0;
    padding: 0;
    word-break: break-word;
    white-space: pre-line;
    font-size: 1rem;
    line-height: 1.5;
    background: none;
  }
  @media screen and (max-width: 768px) {
    .message .content {
      max-width: 90vw;
      width: auto;
      padding: 0.7rem;
    }
    .message .audio-content {
      max-width: 90vw;
      width: 100%;
      padding: 0.7rem;
    }
    .msg-image {
      max-width: 90vw;
      width: 100%;
    }
    .msg-audio {
      width: 100%;
      min-width: 140px;
    }
  }
`

const DeletedMsg = styled.div`
  color: #888;
  font-style: italic;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
`

const ContextMenu = styled.div`
  position: fixed;
  z-index: 9999;
  background: #fff;
  border: 1.5px solid #ddd;
  border-radius: 7px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.13);
  padding: 0.3rem 0;
  min-width: 140px;
  button {
    width: 100%;
    background: none;
    border: none;
    padding: 0.7rem 1.2rem;
    text-align: left;
    color: #c00;
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 7px;
    &:hover {
      background: #ffeaea;
    }
  }
`

const ConfirmModal = styled.div`
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 2.2rem 2.5rem 1.7rem 2.5rem;
  z-index: 10000;
  min-width: 270px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
  border: 2px solid #e74c3c;
  .warning-icon {
    font-size: 2.5rem;
    color: #e74c3c;
    margin-bottom: 0.2rem;
  }
  .modal-title {
    font-size: 1.18rem;
    font-weight: 600;
    color: #222;
    margin-bottom: 0.2rem;
  }
  .modal-desc {
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;
  }
`

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 0.7rem;
  width: 100%;
  button {
    background: #f5f5f5;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.6rem;
    font-size: 1.05rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.18s;
    &:hover { background: #e3e6ee; }
    &.danger {
      background: #e74c3c;
      color: #fff;
      &:hover { background: #c0392b; }
    }
  }
`

const EmptyState = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  text-align: center;
  gap: 0.7rem;
  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
    color: #444;
  }
  p {
    font-size: 1.05rem;
    color: #888;
    margin: 0;
  }
`

export default Messages