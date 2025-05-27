"use client"

import styled from "styled-components"
import Logout from "./Logout"
import ChatInput from "./ChatInput"
import Messages from "./Messages"
import { useEffect, useState, useRef } from "react"
import useAxiosRefresh from "../hooks/useAxiosRefresh"
import { Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.18s;
  cursor: zoom-out;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const ModalImg = styled.img`
  max-width: 82vw;
  max-height: 55vh;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  background: #fff;
  cursor: pointer;
  border: 3px solid #fff;
  transition: box-shadow 0.18s, border 0.18s;
  &:hover {
    box-shadow: 0 12px 40px rgba(0,0,0,0.22);
    border: 3px solid #bbb;
  }
`

const ChatContainer = ({ currentChat, currentUser, socket, onlineUsers = [] }) => {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeout = useRef(null)
  const axios = useAxiosRefresh()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [modalImg, setModalImg] = useState(null)

  useEffect(() => {
    ; (async () => {
      const response = await axios.post("/message/user", { idReceptor: currentChat.id })
      setMessages(response?.data)
    })()
  }, [currentChat])

  useEffect(() => {
    if (!socket) return
    const listener = (msg) => {
      if (
        (msg.idEmitor === currentChat.id && msg.idReceptor === currentUser.id) ||
        (msg.idEmitor === currentUser.id && msg.idReceptor === currentChat.id)
      ) {
        setMessages((prevState) => [...prevState, msg])
      }
    }
    socket.on("msg-receive", listener)
    return () => {
      socket.off("msg-receive", listener)
    }
  }, [socket, currentChat, currentUser])

  useEffect(() => {
    if (!socket) return
    const handleTyping = ({ from, isTyping }) => {
      if (from === currentChat.id) {
        setIsTyping(isTyping)
        if (isTyping) {
          if (typingTimeout.current) clearTimeout(typingTimeout.current)
          typingTimeout.current = setTimeout(() => setIsTyping(false), 2500)
        }
      }
    }
    socket.on("typing", handleTyping)
    return () => {
      socket.off("typing", handleTyping)
      if (typingTimeout.current) clearTimeout(typingTimeout.current)
    }
  }, [socket, currentChat])

  const emitTyping = (typing) => {
    if (socket && currentChat && currentUser) {
      socket.emit("typing", {
        to: currentChat.id,
        from: currentUser.id,
        isTyping: typing
      })
    }
  }

  const isOnline = onlineUsers.includes(String(currentChat.id))

  // Igual que en Contacts: cerrar modal al hacer click fuera de la imagen
  const handleModalClose = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setModalImg(null)
    }
  }

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={currentChat.img || "/placeholder.svg"}
              alt=""
              style={{ cursor: "pointer" }}
              onClick={() => setModalImg(currentChat.img || "/placeholder.svg")}
            />
          </div>
          <div className="username-row">
            <h3>{currentChat.firstName}</h3>
            <StatusWrapper>
              <StatusDot $online={isOnline} />
              <StatusText $online={isOnline}>{isOnline ? "En línea" : "Desconectado"}</StatusText>
              {isTyping && (
                <TypingIndicator>Escribiendo...</TypingIndicator>
              )}
            </StatusWrapper>
          </div>
        </div>
        <div className="header-actions">
          {auth?.roleId === 1 && (
            <AdminButton
              title="Panel de administración"
              onClick={() => navigate("/admin")}
            >
              <Settings size={24} />
            </AdminButton>
          )}
          <Logout />
        </div>
      </div>
      <div className="messages-area">
        <Messages messages={messages} currentUser={currentUser} socket={socket} setMessages={setMessages} />
      </div>
      <div className="chat-input-container">
        <ChatInput
          sendMessage={async (msg) => {
            try {
              const messagetoSend = {
                idEmitor: currentUser.id,
                idReceptor: currentChat.id,
                content: msg,
              }
              await axios.post("/message", messagetoSend)
            } catch (err) {
              console.error(err)
            }
          }}
          emitTyping={emitTyping}
        />
      </div>
      {modalImg && (
        <ModalOverlay className="modal-overlay" onClick={handleModalClose}>
          <ModalImg
            src={modalImg}
            alt="Foto de perfil"
            onClick={() => setModalImg(null)}
            title="Cerrar"
          />
        </ModalOverlay>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  min-width: 0;
  background-color: white;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
  position: relative;

  .chat-header {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    min-height: 70px;
    max-height: 90px;
    box-sizing: border-box;
    position: sticky;
    top: 0;
    z-index: 2;
    transition: all 0.2s;
    .user-details{
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 0;
      .avatar {
        img {
          height: 3rem;
          width: 3rem;
          border-radius: 50%;
          object-fit: cover;
          transition: box-shadow 0.18s, height 0.18s, width 0.18s;
        }
        img:hover {
          box-shadow: 0 0 0 3px #bbb;
        }
      }
      .username-row {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        min-width: 0;
        h3 {
          color: #333;
          margin: 0;
          font-size: 1.15rem;
          font-weight: 600;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      flex-shrink: 0;
    }
  }

  .messages-area {
    flex: 1 1 0;
    min-height: 0;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background: #f9f9f9;
  }

  .chat-input-container {
    flex: 0 0 auto;
    position: sticky;
    bottom: 0;
    z-index: 2;
    background: white;
  }

  /* --- PORTÁTIL Y TABLET --- */
  @media screen and (max-width: 900px) and (min-width: 481px) {
    .chat-header {
      margin-top: 0;
      min-height: 70px;
      max-height: 90px;
      padding: 0 1rem;
      .user-details {
        gap: 0.7rem;
        .avatar img {
          height: 2.3rem;
          width: 2.3rem;
        }
        .username-row h3 {
          font-size: 1.05rem;
        }
      }
      .header-actions {
        gap: 6px;
        button, .logout-btn {
          padding: 0.3rem 0.5rem !important;
          svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
      }
    }
    .chat-input-container {
      min-height: 62px;
      max-height: 80px;
    }
  }

  /* --- MÓVIL --- */
  @media screen and (max-width: 480px) {
    .chat-header {
      margin-top: 0;
      padding: 0 0.1rem;
      min-height: 48px;
      max-height: 60px;
      .user-details {
        gap: 0.2rem;
        .avatar img {
          height: 1.5rem;
          width: 1.5rem;
        }
        .username-row h3 {
          font-size: 0.85rem;
        }
      }
      .header-actions {
        gap: 2px;
        button, .logout-btn {
          padding: 0.15rem 0.25rem !important;
          svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
      }
    }
    .chat-input-container {
      min-height: 54px;
      max-height: 70px;
    }
  }
`

const StatusWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.7rem;
`
const StatusDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $online }) => ($online ? "#27ae60" : "#bbb")};
  border: 1.5px solid #fff;
  box-shadow: 0 0 2px #aaa;
  display: inline-block;
`
const StatusText = styled.span`
  font-size: 0.97rem;
  color: ${({ $online }) => ($online ? "#27ae60" : "#888")};
  font-weight: 500;
`
const TypingIndicator = styled.div`
  font-size: 0.97rem;
  color: #1abc9c;
  font-style: italic;
  margin-left: 10px;
  animation: blink 1.2s infinite;
  white-space: nowrap;
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

const AdminButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #555;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #333;
  }
`

export default ChatContainer