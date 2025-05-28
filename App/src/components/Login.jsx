import { useState } from "react"
import { loginWithAxios } from "../services/user"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Mail, Lock, LogIn, MessageCircle, Users, ArrowLeft } from "lucide-react"
import "../styles/Login.css"

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
        <div className="login-bg">
            <div className="login-card">
                <div className="login-info-section">
                    <h2 className="login-info-title">
                        ¿Qué puedes hacer iniciando sesión?
                    </h2>
                    <ul className="login-info-list">
                        <li className="login-info-item">
                            <MessageCircle size={22} />
                            <span>Chatear en tiempo real con tus amigos</span>
                        </li>
                        <li className="login-info-item">
                            <Users size={22} />
                            <span>Conocer nuevas personas</span>
                        </li>
                        <li className="login-info-item">
                            <Lock size={22} />
                            <span>Tu información está segura y protegida</span>
                        </li>
                    </ul>
                </div>
                <div className="login-form-section">
                    <h1 className="login-title">
                        Iniciar sesión en <span>RubChat</span>
                    </h1>
                    <form onSubmit={handleForm} autoComplete="off">
                        <div className="login-input-group">
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
                        <div className="login-input-group">
                            <Lock size={20} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <button className="login-btn" type="submit">
                            Iniciar sesión
                        </button>
                        <div className="login-register-link">
                            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                        </div>
                    </form>
                    <button className="login-backhome-btn" type="button" onClick={() => navigate("/")}>
                        <ArrowLeft size={18} style={{ marginRight: 6 }} />
                        Volver al inicio
                    </button>
                    {error && <div className="login-error-message">{error}</div>}
                </div>
            </div>
        </div>
    )
}

export default Login