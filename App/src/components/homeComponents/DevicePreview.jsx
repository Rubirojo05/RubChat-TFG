"use client"

import { useState, useEffect } from "react"
import "../../styles/DevicePreview.css"

const DevicePreview = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div className={`desktop-chat-container ${visible ? "visible" : ""}`}>
      <div className="chat-window">
        <div className="window-header">
          <div className="window-controls">
            <span className="control close"></span>
            <span className="control minimize"></span>
            <span className="control maximize"></span>
          </div>
          <div className="window-title">RubChat</div>
          <div className="window-actions"></div>
        </div>

        <div className="chat-header">
          <div className="chat-avatar"></div>
          <div className="chat-info">
            <div className="chat-name">Rubén Rojo</div>
          </div>
        </div>

        <div className="chat-messages">
          <div className="message received">
            <div className="message-bubble">
              <p>¡Hola! ¿Cómo estás?</p>
            </div>
          </div>

          <div className="message sent">
            <div className="message-bubble">
              <p>¡Muy bien! ¿Y tú?</p>
            </div>
          </div>

          <div className="message received">
            <div className="message-bubble">
              <p>¿Nos vemos esta tarde?</p>
            </div>
          </div>

          <div className="message sent">
            <div className="message-bubble">
              <p>¡Claro! A las 5 en el café</p>
            </div>
          </div>
        </div>

        <div className="chat-input">
          <div className="input-field">
            <span className="input-placeholder">Escribe un mensaje...</span>
          </div>
          <div className="send-button"></div>
        </div>
      </div>
    </div>
  )
}

export default DevicePreview
