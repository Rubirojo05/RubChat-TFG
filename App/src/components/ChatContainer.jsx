"use client"

import styled from "styled-components"
import Logout from "./Logout"
import ChatInput from "./ChatInput"
import Messages from "./Messages"
import { useEffect, useState } from "react"
import useAxiosRefresh from "../hooks/useAxiosRefresh"
import { Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([])
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
      // Solo añade el mensaje si es para este chat abierto
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

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={currentChat.img || "/placeholder.svg"} alt="" />
          </div>
          <div className="username">
            <h3>{currentChat.firstName}</h3>
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
      <ChatInput sendMessage={async (msg) => {
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
      }} />
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
            .username {
                h3 {
                    color: #333;
                }
            }
        }
    }
    
    @media screen and (max-width: 768px) {
        .chat-header {
            padding: 0 1rem;
            padding-left: 3.5rem; /* Make space for the mobile toggle button */
            
            .user-details {
                gap: 0.5rem;
                
                .avatar img {
                    height: 2.5rem;
                    width: 2.5rem;
                }
                
                .username h3 {
                    font-size: 0.9rem;
                }
            }
        }
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