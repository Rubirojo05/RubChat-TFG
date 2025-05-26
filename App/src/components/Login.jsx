import { useState } from "react"
import { loginWithAxios } from "../services/user"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import styled, { keyframes } from "styled-components"
import { Mail, Lock, LogIn, MessageCircle, Users, ArrowLeft } from "lucide-react"

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/chat"
    const { updateAuthLogin } = useAuth()

    const handleForm = async (e) => {
        e.preventDefault()
        try {
            const data = await loginWithAxios({ email, password })
            updateAuthLogin({ accessToken: data.accessToken })
            navigate(from, { replace: true })
        } catch (err) {
            setError("Email o contraseña incorrectos")
        }
    }

    return (
        <Bg>
            <Card>
                <InfoSection>
                    <InfoTitle>

                        ¿Qué puedes hacer iniciando sesión?
                    </InfoTitle>
                    <InfoList>
                        <InfoItem>
                            <MessageCircle size={22} />
                            <span>Chatear en tiempo real con tus amigos</span>
                        </InfoItem>
                        <InfoItem>
                            <Users size={22} />
                            <span>Conocer nuevas personas</span>
                        </InfoItem>
                        <InfoItem>
                            <Lock size={22} />
                            <span>Tu información está segura y protegida</span>
                        </InfoItem>
                    </InfoList>
                </InfoSection>
                <FormSection>
                    <Title>Iniciar sesión en <span>RubChat</span></Title>
                    <form onSubmit={handleForm} autoComplete="off">
                        <InputGroup>
                            <Mail size={20} />
                            <input
                                type="email"
                                placeholder="Email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Lock size={20} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </InputGroup>
                        <Button type="submit">
                            Iniciar sesión
                        </Button>
                        <RegisterLink>
                            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                        </RegisterLink>
                    </form>
                    <BackHomeButton type="button" onClick={() => navigate("/")}>
                        <ArrowLeft size={18} style={{ marginRight: 6 }} />
                        Volver al inicio
                    </BackHomeButton>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </FormSection>
            </Card>
        </Bg>
    )
}

// Animación de entrada
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(40px);}
    to { opacity: 1; transform: translateY(0);}
`

const Bg = styled.div`
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #f7f7f7 0%, #e5e5e5 100%);
    display: flex;
    justify-content: center;
    align-items: center;
`

const Card = styled.div`
    display: flex;
    flex-direction: row;
    background: linear-gradient(135deg, #fff 60%, #f3f3f3 100%);
    border-radius: 26px;
    box-shadow: 0 8px 32px rgba(60,60,90,0.13), 0 0 0 2px #e3e6ee;
    border: 1.5px solid #e3e6ee;
    width: 100%;
    max-width: 900px;
    min-height: 440px;
    animation: ${fadeIn} 0.7s cubic-bezier(.39,.575,.56,1) both;
    overflow: hidden;
    @media (max-width: 800px) {
        flex-direction: column;
        max-width: 98vw;
        min-height: unset;
    }
`

const InfoSection = styled.div`
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    min-width: 340px;
    padding: 2.5rem 2rem;
    border-right: 1.5px solid #e3e6ee;
    @media (max-width: 800px) {
        min-width: unset;
        border-right: none;
        border-bottom: 1.5px solid #e3e6ee;
        align-items: center;
        padding: 2rem 1rem 1.5rem 1rem;
    }
`
const InfoTitle = styled.h2`
    font-size: 1.35rem;
    font-weight: 700;
    color: #222;
    display: flex;
    align-items: center;
    margin-bottom: 1.2rem;
    font-family: system-ui, sans-serif;
`
const InfoList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
`
const InfoItem = styled.li`
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 1.08rem;
    color: #444;
    margin-bottom: 1.1rem;
    svg {
        color: #111;
        flex-shrink: 0;
    }
    span {
        font-family: system-ui, sans-serif;
    }
`

const FormSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem 2.5rem;
    @media (max-width: 800px) {
        padding: 2rem 1.2rem;
    }
`

const Title = styled.h1`
    font-size: 2.1rem;
    font-weight: 700;
    color: #222;
    margin-bottom: 2rem;
    text-align: center;
    letter-spacing: -1px;
    font-family: system-ui, sans-serif;
    span {
        color: #111;
        font-weight: 800;
    }
`

const InputGroup = styled.div`
    display: flex;
    align-items: center;
    background: #f6f6f6;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    margin-bottom: 1.1rem;
    border: 1.5px solid #e3e6ee;
    transition: border 0.2s, box-shadow 0.2s;
    &:focus-within {
        border: 1.5px solid #111;
        background: #ededed;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    svg {
        color: #888;
        margin-right: 0.7rem;
        transition: color 0.2s;
    }
    input {
        border: none;
        background: transparent;
        outline: none;
        font-size: 1rem;
        width: 100%;
        padding: 0.6rem 0;
        color: #222;
        transition: background 0.2s;
        font-family: system-ui, sans-serif;
    }
`

const Button = styled.button`
    width: 100%;
    padding: 0.85rem;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.7rem;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    font-family: system-ui, sans-serif;
    &:hover {
        background: #222;
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 6px 18px rgba(0,0,0,0.10);
    }
`

const BackHomeButton = styled.button`
    margin: 1.5rem auto 0 auto;
    display: flex;
    align-items: center;
    background: transparent;
    color: #222;
    border: 1.5px solid #e3e6ee;
    border-radius: 7px;
    padding: 0.5rem 1.1rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.18s, border 0.18s, color 0.18s;
    font-family: system-ui, sans-serif;
    &:hover {
        background: #f6f6f6;
        border: 1.5px solid #111;
        color: #111;
    }
`

const RegisterLink = styled.div`
    margin-top: 1.2rem;
    font-size: 1rem;
    color: #444;
    text-align: center;
    font-family: system-ui, sans-serif;
    a {
        color: #111;
        text-decoration: underline;
        font-weight: 500;
        transition: color 0.2s;
        &:hover {
            color: #000;
        }
    }
`

const ErrorMessage = styled.div`
    margin-top: 1rem;
    color: #c00;
    font-size: 0.95rem;
    text-align: center;
`

export default Login