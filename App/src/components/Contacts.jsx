"use client"

import { useEffect, useState, useRef } from "react"
import { Search, Camera } from "lucide-react"
import { instancePrivate } from "../services/axios"
import { useAuth } from "../hooks/useAuth"
import "../styles/Contacts.css"

export default function Contacts({ contacts, currentUser, changeChat, unread = {}, onlineUsers = [] }) {
  const [currentUserName, setCurrentUserName] = useState(undefined)
  const [currentUserImage, setCurrentUserImage] = useState(undefined)
  const [currentSelected, setCurrentSelected] = useState(undefined)
  const [search, setSearch] = useState("")
  const [modalImg, setModalImg] = useState(null)
  const [showChangeBtn, setShowChangeBtn] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const fileInputRef = useRef()
  const { updateAuthLogin, auth } = useAuth()

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

  const isUserOnline = (userId) => {
    return onlineUsers.includes(String(userId))
  }

  const filteredContacts = (() => {
    if (!search.trim()) return contacts
    const term = search.trim().toLowerCase()
    return contacts.filter(
      c =>
        c.firstName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term)
    )
  })()

  const handleModalClose = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setModalImg(null)
      setShowChangeBtn(false)
      setErrorMsg("")
      setSuccessMsg("")
    }
  }

  useEffect(() => {
    if (!modalImg || !currentUserImage) {
      setShowChangeBtn(false)
      return
    }
    setShowChangeBtn(modalImg === currentUserImage)
  }, [modalImg, currentUserImage])

  const handleChangeImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    setErrorMsg("")
    setSuccessMsg("")
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setErrorMsg("El archivo seleccionado no es una imagen válida.")
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("id", currentUser.id)
      formData.append("img", file)
      const res = await instancePrivate.patch("/user/", formData)
      if (res.data?.user) {
        updateAuthLogin({
          ...auth,
          url: res.data.user.img
        })
        setCurrentUserImage(res.data.user.img)
        setModalImg(res.data.user.img)
        setSuccessMsg("Imagen cambiada correctamente")
        setTimeout(() => {
          setModalImg(null)
          setSuccessMsg("")
        }, 1500)
      } else {
        setErrorMsg("No se pudo actualizar la imagen. Intenta de nuevo.")
      }
    } catch (err) {
      setErrorMsg("Error al actualizar la imagen de perfil")
    }
    setUploading(false)
  }

  return (
    <>
      {currentUserImage && currentUserName && (
        <div className="contacts-container">
          <div className="search-bar">
            <span className="search-icon">
              <Search size={18} />
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="contacts">
            {filteredContacts.length === 0 && search.trim() ? (
              <div className="not-found">
                No se encontró ningún contacto para "{search.trim()}"
              </div>
            ) : (
              filteredContacts.map((contact, index) => {
                const online = isUserOnline(contact.id)
                return (
                  <div
                    key={contact.id}
                    className={`contact${index === currentSelected ? " selected" : ""}`}
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
            <div className="modal-overlay" onClick={handleModalClose}>
              <div className="modal-img-wrapper">
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <img
                    className="modal-img"
                    src={modalImg}
                    alt="Foto de perfil"
                    onClick={() => setModalImg(null)}
                    title="Cerrar"
                  />
                  {showChangeBtn && (
                    <button
                      className="change-btn"
                      type="button"
                      onClick={handleChangeImageClick}
                      disabled={uploading}
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: "35px",
                        border: "white 1px solid",
                        transform: "translateX(-50%)",
                        zIndex: 2,
                        minWidth: "170px"
                      }}
                    >
                      <Camera size={18} style={{ marginRight: 7 }} />
                      {uploading ? "Actualizando..." : "Cambiar imagen"}
                    </button>
                  )}
                </div>
                {showChangeBtn && (
                  <div className="warning-msg">
                    Al cambiar la imagen tendrás que iniciar sesión de nuevo.
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {errorMsg && <div className="error-msg">{errorMsg}</div>}
                {successMsg && <div className="success-msg">{successMsg}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}