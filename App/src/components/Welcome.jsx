"use client"

import styled from "styled-components"
import Logout from "./Logout"
import { Settings } from "lucide-react" // Cambia Shield por Settings
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Welcome = ({ userName }) => {
  const navigate = useNavigate()
  const { auth } = useAuth()
  return (
    <Container>
      <h1>
        Bienvenido, <span>{userName}!</span>
      </h1>
      <h3>Selecciona un chat para comenzar a conversar</h3>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Logout />
        {auth?.roleId === 1 && (
          <AdminButton
            title="Panel de administración"
            onClick={() => navigate("/admin")}
          >
            <Settings size={24} />
          </AdminButton>
        )}
      </div>
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

export default Welcome