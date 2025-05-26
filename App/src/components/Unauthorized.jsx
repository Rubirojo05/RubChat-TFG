"use client"

import styled from "styled-components"

export const Unauthorized = () => {
  return (
    <Container>
      <Card>
        <Icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M8 11V9"></path>
            <path d="M12 11V9"></path>
            <path d="M16 11V9"></path>
          </svg>
        </Icon>
        <Title>Acceso Restringido</Title>
        <Message>No tienes autorización para visitar esta página</Message>
        <Button onClick={() => window.history.back()}>Volver</Button>
      </Card>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  text-align: center;
`

const Icon = styled.div`
  color: #333;
  margin-bottom: 1.5rem;
`

const Title = styled.h1`
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
`

const Message = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`

const Button = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #555;
  }
`

export default Unauthorized
