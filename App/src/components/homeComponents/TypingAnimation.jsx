"use client"

import { useState, useEffect, useRef } from "react"
import "../../styles/TypingAnimation.css"

const TypingAnimation = ({ words, typingSpeed, deletingSpeed, pauseTime }) => {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const currentWord = words[wordIndex]

    const handleTyping = () => {
      setText((current) => {
        if (isDeleting) {
          // Deleting text
          const newText = current.substring(0, current.length - 1)
          if (newText === "") {
            setIsDeleting(false)
            setWordIndex((current) => (current + 1) % words.length)
            return ""
          }
          return newText
        } else {
          // Typing text
          const newText = currentWord.substring(0, current.length + 1)
          if (newText === currentWord) {
            // Finished typing, pause then delete
            setIsDeleting(true)
            return newText
          }
          return newText
        }
      })
    }

    // Calculate the delay time
    const delayTime = isDeleting ? deletingSpeed : text === currentWord ? pauseTime : typingSpeed

    // Set the timeout for typing or deleting
    timeoutRef.current = setTimeout(() => {
      handleTyping()
    }, delayTime)

    // Clean up the timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return (
    <span className="typing-text">
      {text}
      <span className="cursor">|</span>
    </span>
  )
}

export default TypingAnimation
