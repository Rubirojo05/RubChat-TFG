"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"

export default function Contacts({ contacts, currentUser, changeChat, unread = {} }) {
  const [currentUserName, setCurrentUserName] = useState(undefined)
  const [currentUserImage, setCurrentUserImage] = useState(undefined)
  const [currentSelected, setCurrentSelected] = useState(undefined)

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.firstName)
      setCurrentUserImage(currentUser.url)
    }
  }, [currentUser])

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index)
    changeChat(contact)
  }

  // Refresca la página o recarga datos tras editar/eliminar usuario
  const handleUserUpdated = () => window.location.reload()
  const handleUserDeleted = () => window.location.href = "/login"

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact.id}
                  className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img src={`${contact.img}`} alt="" />
                    {unread[contact.id] > 0 && (
                      <span className="unread-badge">{unread[contact.id]}</span>
                    )}
                  </div>
                  <div className="username">
                    <h3>{contact.firstName}</h3>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="current-user" style={{cursor: "pointer"}}>
            <div className="avatar">
              <img src={`${currentUserImage}`} alt="" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 80% 20%;
    overflow: hidden;
    background-color: #f8f8f8;
    height: 100%;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        background-color: #f0f0f0;
        padding-top: 1rem;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #c0c0c0;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #e0e0e0;
            min-height: 5rem;
            cursor: pointer;
            width: 90%;
            border-radius: 0.5rem;
            padding: 0.4rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            transition: 0.3s ease-in-out;
            .avatar {
                position: relative;
                img {
                    height: 3rem;
                    width: 3rem;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .unread-badge {
                  position: absolute;
                  top: 0;
                  right: 0;
                  background: #e74c3c;
                  color: #fff;
                  border-radius: 50%;
                  font-size: 0.8rem;
                  width: 20px;
                  height: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  border: 2px solid #fff;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
                  z-index: 2;
                }
            }
            .username {
                h3 {
                    color: #333;
                }
            }
        }
        .selected {
            background-color: #d0d0d0;
        }
    }
    .contact:hover{
        background-color: #d8d8d8;
    }

    .current-user {
        background-color: #e8e8e8;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 2rem;
        padding-left: 1rem;
        border-top: 1px solid #ddd;
        height: 100%; 
        min-height: 0;
        .avatar {
            img {
                border-radius: 50%;
                height: 4rem;
                width: 4rem;
                object-fit: cover;
            }
        }
        .username {
            h2 {
                color: #333;
            }
        }
    }
    
    @media screen and (min-width: 769px) and (max-width: 1080px) {
        .current-user {
            gap: 0.5rem;
            .username {
                h2 {
                    font-size: 1rem;
                }
            }
            .avatar img {
                height: 3rem;
                width: 3rem;
            }
        }
        
        .contacts .contact {
            min-height: 4rem;
            
            .avatar img {
                height: 2.5rem;
                width: 2.5rem;
            }
            
            .username h3 {
                font-size: 0.9rem;
            }
        }
    }
    
    @media screen and (max-width: 768px) {
        .current-user {
            gap: 1rem;
            padding-left: 0.5rem;
            
            .avatar img {
                height: 3rem;
                width: 3rem;
            }
            
            .username h2 {
                font-size: 0.9rem;
            }
        }
    }
`