"use client"

import styled from "styled-components"
import Logout from "./Logout"
// import { MessageSquare } from 'lucide-react' // Removed unused import

const Welcome = ({ userName }) => {
  return (
    <Container>
      <h1>
        Bienvenido, <span>{userName}!</span>
      </h1>
      <h3>Selecciona un chat para comenzar a conversar</h3>
      <Logout />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: white;
  color: #333;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-family: system-ui, sans-serif;
    
    span {
      color: #555;
      font-weight: bold;
    }
  }
  
  h3 {
    font-size: 1.2rem;
    color: #777;
    font-weight: normal;
    font-family: system-ui, sans-serif;
  }
`

export default Welcome
