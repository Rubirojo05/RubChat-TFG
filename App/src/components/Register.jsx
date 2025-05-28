import { useState } from "react"
import { register } from "../services/user"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { User, Mail, Lock, Image as ImageIcon, ArrowLeft } from "lucide-react"
import "../styles/Register.css"

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
        <div className="register-bg">
            <div className="register-card">
                <div className="register-image-section">
                    <div className="register-image-selector">
                        <input
                            id="img-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />
                        <label className="register-image-circle" htmlFor="img-upload">
                            {preview ? (
                                <img className="register-preview-img" src={preview} alt="preview" />
                            ) : (
                                <ImageIcon size={48} />
                            )}
                        </label>
                        <span className="register-image-text">Foto de perfil</span>
                    </div>
                </div>
                <div className="register-form-section">
                    <div className="register-mobile-header">
                        <button className="register-backhome-btn" type="button" onClick={() => navigate("/")}>
                            <ArrowLeft size={20} style={{ marginRight: 8 }} />
                            Volver al inicio
                        </button>
                    </div>
                    <h1 className="register-title">Crear cuenta en RubChat</h1>
                    <form onSubmit={handleForm} autoComplete="off">
                        <div className="register-input-group">
                            <User size={20} />
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                autoComplete="off"
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstName}
                                required
                            />
                        </div>
                        <div className="register-input-group">
                            <User size={20} />
                            <input
                                type="text"
                                placeholder="Apellido"
                                autoComplete="off"
                                onChange={(e) => setLastname(e.target.value)}
                                value={lastName}
                                required
                            />
                        </div>
                        <div className="register-input-group">
                            <Mail size={20} />
                            <input
                                type="email"
                                placeholder="Email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <div className="register-input-group">
                            <Lock size={20} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <div className="register-input-group">
                            <Lock size={20} />
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                onChange={(e) => setConfirmpassword(e.target.value)}
                                value={confirmpassword}
                                required
                            />
                        </div>
                        <button className="register-btn" type="submit">Registrarme</button>
                        <div className="register-link">
                            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                        </div>
                        <button className="register-pc-backhome-btn" type="button" onClick={() => navigate("/")}>
                            <ArrowLeft size={18} style={{ marginRight: 6 }} />
                            Volver al inicio
                        </button>
                    </form>
                    {error && <div className="register-error-message">{JSON.stringify(error)}</div>}
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default Register