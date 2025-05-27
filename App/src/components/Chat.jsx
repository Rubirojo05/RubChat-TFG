import styled from "styled-components"
import Contacts from "./Contacts"
import Welcome from "./Welcome"
import ChatContainer from "./ChatContainer"
import { useAuth } from "../hooks/useAuth"
import { jwtDecode } from "jwt-decode"
import useImage from "../hooks/useImage"
import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import useAxiosRefresh from "../hooks/useAxiosRefresh"

const Chat = () => {
  const { auth } = useAuth()
  const { contacts } = useImage()
  const [currentChat, setCurrentChat] = useState(undefined)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [unread, setUnread] = useState({})
  const [onlineUsers, setOnlineUsers] = useState([])
  const contactsRef = useRef(null)
  const socketRef = useRef(null)
  const axiosPrivate = useAxiosRefresh()

  const currentUser = auth?.accessToken ? jwtDecode(auth?.accessToken) : undefined
  const contactsData = contacts?.data?.map(c => ({ ...c, id: String(c.id) })) || []

  useEffect(() => {
    if (!auth?.accessToken || !currentUser) return
    let cancel = false
    const fetchUnread = async () => {
      try {
        const res = await axiosPrivate.post("/message/unread-counts", { id: currentUser.id })
        if (!cancel) {
          const unreadObj = {}
          res.data.forEach(u => { unreadObj[u.fromUser] = u.count })
          setUnread(unreadObj)
        }
      } catch (err) {
        if (!cancel) setUnread({})
      }
    }
    fetchUnread()
    return () => { cancel = true }
  }, [auth?.accessToken])

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // --- CORRECCIÓN: Mantener onlineUsers actualizado siempre ---
  useEffect(() => {
    if (!auth?.accessToken) return
    // Si ya hay una conexión previa, la cerramos antes de crear una nueva
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      query: { accessToken: auth?.accessToken },
      transports: ["websocket"], // Forzar websocket para evitar problemas de polling
    })

    // Actualiza la lista de usuarios en línea cada vez que llega el evento
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users)
    }

    socketRef.current.on("connect", () => {
      console.log("Conectado al servidor")
    })

    socketRef.current.on("online-users", handleOnlineUsers)

    return () => {
      socketRef.current.off("online-users", handleOnlineUsers)
      socketRef.current.disconnect()
    }
  }, [auth?.accessToken])

  // --- Actualiza onlineUsers en tiempo real aunque cambie currentChat ---
  useEffect(() => {
    if (!socketRef.current) return
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users)
    }
    socketRef.current.on("online-users", handleOnlineUsers)
    return () => {
      socketRef.current.off("online-users", handleOnlineUsers)
    }
  }, [currentChat])

  useEffect(() => {
    if (!socketRef.current) return

    const handleMsgReceive = (msg) => {
      if (!currentChat || msg.idEmitor !== currentChat.id) {
        setUnread(prev => ({
          ...prev,
          [msg.idEmitor]: (prev[msg.idEmitor] || 0) + 1
        }))
      }
    }

    socketRef.current.on("msg-receive", handleMsgReceive)
    return () => {
      socketRef.current.off("msg-receive", handleMsgReceive)
    }
  }, [currentChat])

  const handleChatChange = async (chat) => {
    setCurrentChat(chat)
    if (auth?.accessToken && currentUser) {
      try {
        await axiosPrivate.post("/message/mark-as-read", {
          idEmitor: chat.id,
          idReceptor: currentUser.id
        })
      } catch (err) { }
    }
    setUnread((prev) => ({ ...prev, [chat.id]: 0 }))
    if (isMobile) setShowMobileMenu(false)
    if (contactsRef.current) {
      contactsRef.current.scrollTop = contactsRef.current.scrollTop
    }
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <Container>
      <div className="container">
        {isMobile && (
          <div className={`mobile-toggle ${showMobileMenu ? "active" : ""}`} onClick={toggleMobileMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        )}

        {currentUser && contacts && (
          <div className={`contacts-wrapper ${isMobile ? (showMobileMenu ? "show" : "") : ""}`} ref={contactsRef}>
            <Contacts
              contacts={contactsData}
              currentUser={currentUser}
              changeChat={handleChatChange}
              unread={unread}
              onlineUsers={onlineUsers}
            />
          </div>
        )}

        {isMobile && showMobileMenu && <div className="overlay" onClick={() => setShowMobileMenu(false)}></div>}

        <div className="chat-wrapper">
          {currentChat ? (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socketRef.current}
              onlineUsers={onlineUsers}
            />
          ) : (
            <Welcome userName={currentUser?.firstName} />
          )}
        </div>
      </div>
    </Container>
  )
}

export default Chat

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #f5f5f5;
    
    .container {
        height: 85vh;
        width: 85vw;
        background-color: rgba(255, 255, 255, 0.9);
        display: grid;
        grid-template-columns: 1fr 3fr;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        position: relative;
        
        .contacts-wrapper {
            grid-column: 1;
            height: 100%;
            overflow: hidden;
        }
        
        .chat-wrapper {
            grid-column: 2;
            height: 100%;
        }
        
        .mobile-toggle {
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            cursor: pointer;
            flex-direction: column;
            gap: 5px;
            background-color: #f0f0f0;
            padding: 8px;
            border-radius: 5px;
            transition: transform 0.3s ease;
            
            &.active {
                transform: translateX(0);
            }
            
            .bar {
                width: 25px;
                height: 3px;
                background-color: #333;
                border-radius: 3px;
                transition: all 0.3s ease;
            }
            
            &.active .bar:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            
            &.active .bar:nth-child(2) {
                opacity: 0;
            }
            
            &.active .bar:nth-child(3) {
                transform: rotate(-45deg) translate(5px, -5px);
            }
        }
        
        .overlay {
            display: none;
        }
        
        @media screen and (min-width: 769px) and (max-width: 1080px) {
            grid-template-columns: 1.5fr 2.5fr;
        }
        
        @media screen and (max-width: 768px) {
            grid-template-columns: 1fr;
            
            .mobile-toggle {
                display: flex;
            }
            
            .contacts-wrapper {
                position: fixed;
                top: 0;
                left: -100%;
                width: 70%;
                height: 100%;
                background-color: #f8f8f8;
                z-index: 100;
                transition: left 0.3s ease;
                box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
            }
            
            .contacts-wrapper.show {
                left: 0;
            }
            
            .chat-wrapper {
                grid-column: 1;
            }
            
            .overlay {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 50;
            }

            .chat-header {
                padding: 0 1rem;
            }
        }
    }
`