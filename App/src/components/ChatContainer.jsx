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

const ChatContainer = ({ currentChat, currentUser, socket, onlineUsers = [] }) => {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeout = useRef(null)
  const axios = useAxiosRefresh()
  const navigate = useNavigate()
  const { auth } = useAuth()

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

  // CORRECCIÓN: compara siempre como string
  const isOnline = onlineUsers.includes(String(currentChat.id))

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={currentChat.img || "/placeholder.svg"} alt="" />
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
      <Messages messages={messages} currentUser={currentUser} socket={socket} setMessages={setMessages} />
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
    </Container>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 70px 1fr 80px;
    background-color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    height: 100%;
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        background-color: #f0f0f0;
        border-bottom: 1px solid #ddd;
        .user-details{
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                    width: 3rem;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
            .username-row {
                display: flex;
                align-items: center;
                gap: 0.7rem;
                h3 {
                    color: #333;
                    margin: 0;
                    font-size: 1.15rem;
                    font-weight: 600;
                }
            }
        }
    }
    
    @media screen and (max-width: 768px) {
        .chat-header {
            padding: 0 1rem;
            padding-left: 3.5rem;
            .user-details {
                gap: 0.5rem;
                .avatar img {
                    height: 2.5rem;
                    width: 2.5rem;
                }
                .username-row h3 {
                    font-size: 0.9rem;
                }
            }
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