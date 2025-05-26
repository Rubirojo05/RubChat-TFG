import { useState } from "react"
import { register } from "../services/user"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled, { keyframes } from "styled-components"
import { User, Mail, Lock, Image as ImageIcon, ArrowLeft } from "lucide-react"

export const Register = () => {
    const [firstName, setFirstname] = useState('')
    const [lastName, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('')
    const [imagen, setImagen] = useState(undefined)
    const [preview, setPreview] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleForm = async (e) => {
        e.preventDefault()
        if (password !== confirmpassword) {
            toast.error("Las contraseñas no coinciden", {
                position: "bottom-right",
                autoClose: 5000,
                pauseOnHover: true,
                theme: "dark"
            })
        } else {
            const formData = new FormData()
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('confirmpassword', confirmpassword)
            if (imagen) {
                formData.append('img', imagen)
            }
            try {
                await register(formData)
                navigate('/login')
            } catch (err) {
                setError(err)
            }
        }
    }

    const handleImage = (e) => {
        const file = e.target.files[0]
        setImagen(file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result)
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }

    return (
        <Bg>
            <Card>
                <ImageSection>
                    <ImageSelector>
                        <input
                            id="img-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />
                        <ImageCircle htmlFor="img-upload">
                            {preview ? (
                                <PreviewImg src={preview} alt="preview" />
                            ) : (
                                <ImageIcon size={48} />
                            )}
                        </ImageCircle>
                        <ImageText>Foto de perfil</ImageText>
                    </ImageSelector>
                </ImageSection>
                <FormSection>
                    <Title>Crear cuenta en RubChat</Title>
                    <form onSubmit={handleForm} autoComplete="off">
                        <InputGroup>
                            <User size={20} />
                            <input
                                type="text"
                                placeholder="Nombre"
                                autoComplete="off"
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstName}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <User size={20} />
                            <input
                                type="text"
                                placeholder="Apellido"
                                autoComplete="off"
                                onChange={(e) => setLastname(e.target.value)}
                                value={lastName}
                                required
                            />
                        </InputGroup>
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
                        <InputGroup>
                            <Lock size={20} />
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                onChange={(e) => setConfirmpassword(e.target.value)}
                                value={confirmpassword}
                                required
                            />
                        </InputGroup>
                        <Button type="submit">Registrarme</Button>
                        <RegisterLink>
                            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                        </RegisterLink>
                    </form>
                    <BackHomeButton type="button" onClick={() => navigate("/")}>
                        <ArrowLeft size={18} style={{marginRight: 6}} />
                        Volver al inicio
                    </BackHomeButton>
                    {error && <ErrorMessage>{JSON.stringify(error)}</ErrorMessage>}
                    <ToastContainer />
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
    max-width: 820px;
    min-height: 480px;
    animation: ${fadeIn} 0.7s cubic-bezier(.39,.575,.56,1) both;
    overflow: hidden;
`
const ImageSection = styled.div`
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 320px;
    padding: 2.5rem 1.5rem;
    border-right: 1.5px solid #e3e6ee;
`
const FormSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem 2.5rem;
`
const ImageSelector = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
    input[type="file"] {
        display: none;
    }
`
const ImageCircle = styled.label`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #e3e6ee;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border 0.2s, box-shadow 0.2s;
    margin-bottom: 0.2rem;
    &:hover {
        border: 3px solid #111;
        box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        background: #f6f6f6;
    }
    svg {
        color: #888;
        transition: color 0.2s;
    }
`
const PreviewImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: none;
`
const ImageText = styled.span`
    font-size: 1.08rem;
    color: #666;
    margin-top: 0.1rem;
    margin-bottom: 0.2rem;
    font-weight: 500;
`
const Title = styled.h1`
    font-size: 2.1rem;
    font-weight: 700;
    color: #222;
    margin-bottom: 1.7rem;
    text-align: center;
    letter-spacing: -1px;
    font-family: system-ui, sans-serif;
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
    &:hover {
        background: #222;
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 6px 18px rgba(0,0,0,0.10);
    }
`
const RegisterLink = styled.div`
    margin-top: 1.2rem;
    font-size: 1rem;
    color: #444;
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
const ErrorMessage = styled.div`
    margin-top: 1rem;
    color: #c00;
    font-size: 0.95rem;
    text-align: center;
`

export default Register