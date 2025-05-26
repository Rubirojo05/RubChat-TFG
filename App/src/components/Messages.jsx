"use client"

import { useEffect, useRef } from "react"
import styled from "styled-components"

const BASE_URL = "http://localhost:3000"

const getFullUrl = (url) => {
  if (!url) return ""
  if (url.startsWith("http")) return url
  return BASE_URL + url
}

const isImage = (msg) => typeof msg === "string" && msg.match(/\.(jpeg|jpg|png|gif|webp)$/i)
const isAudio = (msg) => typeof msg === "string" && msg.match(/\.(mp3|wav|ogg|webm)$/i)

const Messages = ({ messages, currentUser }) => {
  const scroll = useRef()

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <Container>
      {messages ? (
        messages.map((message) => (
          <div
            ref={scroll}
            key={message.id}
            className={`message ${currentUser.id === message.idEmitor ? "emisor" : "receptor"}`}
          >
            <div className={`content${isAudio(message.content) ? " audio-content" : ""}`}>
              {isImage(message.content) ? (
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
        <h1>No hay mensajes</h1>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1rem 2rem;
  overflow: auto;
  height: 64vh;
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

export default Messages