"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { Search } from "lucide-react"

export default function Contacts({ contacts, currentUser, changeChat, unread = {}, onlineUsers = [] }) {
  const [currentUserName, setCurrentUserName] = useState(undefined)
  const [currentUserImage, setCurrentUserImage] = useState(undefined)
  const [currentSelected, setCurrentSelected] = useState(undefined)
  const [search, setSearch] = useState("")
  const [modalImg, setModalImg] = useState(null)

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

  // Compara como string para evitar problemas de tipo
  const isUserOnline = (userId) => {
    return onlineUsers.includes(String(userId))
  }

  // Filtrado de contactos según búsqueda
  const filteredContacts = (() => {
    if (!search.trim()) return contacts
    const term = search.trim().toLowerCase()
    return contacts.filter(
      c =>
        c.firstName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term)
    )
  })()

  // Cierra el modal al hacer click fuera de la imagen
  const handleModalClose = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setModalImg(null)
    }
  }

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <SearchBar>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchBar>
          <div className="contacts">
            {filteredContacts.length === 0 && search.trim() ? (
              <NotFound>
                No se encontró ningún contacto para "{search.trim()}"
              </NotFound>
            ) : (
              filteredContacts.map((contact, index) => {
                const online = isUserOnline(contact.id)
                return (
                  <div
                    key={contact.id}
                    className={`contact ${index === currentSelected ? "selected" : ""}`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="avatar">
                      <img
                        src={`${contact.img}`}
                        alt=""
                        style={{ cursor: "pointer" }}
                        onClick={e => {
                          e.stopPropagation()
                          setModalImg(contact.img)
                        }}
                      />
                      {unread[contact.id] > 0 && (
                        <span className="unread-badge">{unread[contact.id]}</span>
                      )}
                      <span
                        className={`status-dot ${online ? "online" : "offline"}`}
                        title={online ? "En línea" : "Desconectado"}
                      />
                    </div>
                    <div className="username">
                      <h3>
                        {contact.firstName}
                        <span className="status-text">
                          {online ? " (En línea)" : " (Desconectado)"}
                        </span>
                      </h3>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <div className="current-user" style={{ cursor: "pointer" }}>
            <div className="avatar">
              <img
                src={`${currentUserImage}`}
                alt=""
                style={{ cursor: "pointer" }}
                onClick={() => setModalImg(currentUserImage)}
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
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
      )}
    </>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
    background-color: #f8f8f8;
    height: 100%;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

    .not-found {
      text-align: center;
      color: #c0392b;
      font-size: 1rem;
      margin: 1.2rem 0 0.5rem 0;
      font-family: inherit;
    }

    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        background-color: #f0f0f0;
        padding-top: 0.5rem;
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
                    transition: box-shadow 0.18s;
                }
                img:hover {
                    box-shadow: 0 0 0 3px #bbb;
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
                .status-dot {
                  position: absolute;
                  bottom: 3px;  
                  right: 1px;    
                  width: 13px;
                  height: 13px;
                  border-radius: 50%;
                  border: 2px solid #fff;
                  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                  background: #bbb;
                  z-index: 3;
                }
                .status-dot.online {
                  background: #27ae60;
                }
                .status-dot.offline {
                  background: #bbb;
                }
            }
            .username {
                h3 {
                    color: #333;
                    font-size: 1.08rem;
                    font-weight: 600;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.2rem;
                }
                .status-text {
                  font-size: 0.85rem;
                  color: #888;
                  font-weight: 400;
                  margin-left: 0.3rem;
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
        gap: 2.2rem;
        padding-left: 1.2rem;
        border-top: 1px solid #ddd;
        min-height: 110px;
        margin-top: 1.2rem;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            img {
                border-radius: 50%;
                height: 5.2rem;
                width: 5.2rem;
                object-fit: cover;
                box-shadow: 0 1px 8px rgba(0,0,0,0.10);
                transition: box-shadow 0.18s;
                border: 3px solid #fff;
            }
            img:hover {
                box-shadow: 0 0 0 3px #bbb;
            }
        }
        .username {
            display: flex;
            align-items: center;
            height: 100%;
            h2 {
                color: #222;
                font-size: 2rem;
                font-weight: 700;
                margin: 0;
                letter-spacing: -1px;
                line-height: 1.1;
                word-break: break-word;
            }
        }
    }

    @media screen and (max-width: 900px) and (min-width: 481px) {
      /* Baja la barra de búsqueda y la lista de contactos un poco */
      padding-top: 32px;
      .contacts {
        padding-top: 1.5rem;
      }
      .current-user {
        margin-top: 2rem;
      }
    }
    
    @media screen and (min-width: 769px) and (max-width: 1080px) {
        .current-user {
            gap: 1.5rem;
            padding-left: 0.7rem;
            min-height: 90px;
            .username {
                h2 {
                    font-size: 1.3rem;
                }
            }
            .avatar img {
                height: 3.5rem;
                width: 3.5rem;
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
            gap: 1.1rem;
            padding-left: 0.5rem;
            min-height: 90px;
            .avatar img {
                height: 3.8rem;
                width: 3.8rem;
            }
            .username h2 {
                font-size: 1.25rem;
            }
        }
        .contacts .contact {
            .avatar img {
                height: 2.1rem;
                width: 2.1rem;
            }
        }
    }
`

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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f3f3f3;
  border-radius: 8px;
  padding: 0.45rem 1rem 0.45rem 0.7rem;
  margin: 1rem auto 0.5rem auto;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  max-width: 90%;
  width: 95%;
  position: relative;
  border: 1.5px solid #e3e6ee;
  transition: border 0.18s;
  &:focus-within {
    border: 1.5px solid #111;
    background: #ededed;
  }
`

const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  color: #888;
  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.2;
    color: #888;
    transition: color 0.2s;
  }
  ${SearchBar}:focus-within & svg {
    color: #111;
  }
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  width: 100%;
  color: #222;
  font-family: inherit;
  &::placeholder {
    color: #aaa;
    font-family: inherit;
  }
`

const NotFound = styled.div.attrs({ className: "not-found" })`
  text-align: center;
  color: #c0392b;
  font-size: 1rem;
  margin: 1.2rem 0 0.5rem 0;
  font-family: inherit;
`