"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Home.css"
import TypingAnimation from "./homeComponents/TypingAnimation"
import DevicePreview from "./homeComponents/DevicePreview"

const Home = () => {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleScrollToFeatures = () => {
        const featuresSection = document.getElementById("features-section")
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="rubchat-container">
            {/* Header */}
            <header className={`rubchat-header ${scrolled ? "scrolled" : ""}`}>
                <div className="rubchat-logo">
                    <span className="rubchat-logo-text">RubChat</span>
                </div>
                <nav className="rubchat-nav">
                    <a href="/info" className="rubchat-nav-link">
                        Información
                    </a>
                    <a href="/login" className="rubchat-nav-link rubchat-login">
                        Iniciar sesión
                    </a>
                    <a href="/register" className="rubchat-nav-link rubchat-register">
                        Registrarse
                    </a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="rubchat-hero">
                <div className="rubchat-hero-content">
                    <h1 className="rubchat-title">RubChat</h1>
                    <div className="rubchat-typing-wrapper">
                        <span className="rubchat-typing-static">Mensajería para&nbsp;</span>
                        <TypingAnimation
                            words={["socializar", "amigos", "disfrutar", "conocer personas", "todos"]}
                            typingSpeed={150}
                            deletingSpeed={80}
                            pauseTime={3000}
                        />
                    </div>
                    <p className="rubchat-description">
                        Una nueva forma de conectar con las personas que te importan, de manera rápida, segura y elegante.
                    </p>
                    <div className="rubchat-buttons">
                        <button className="rubchat-btn rubchat-primary" onClick={() => navigate("/chat")}>Comenzar ahora</button>
                        <button className="rubchat-btn rubchat-secondary" onClick={handleScrollToFeatures}>Saber más</button>
                    </div>
                </div>
                <div className="rubchat-hero-visual">
                    <DevicePreview />
                </div>
            </section>

            {/* Features Section - Simplified */}
            <section id="features-section" className="rubchat-features">
                <h2 className="rubchat-section-title">Todo lo que necesitas para comunicarte</h2>
                <div className="rubchat-feature-list">
                    <div className="rubchat-feature-item">
                        <div className="rubchat-feature-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <h3 className="rubchat-feature-title">Mensajería instantánea</h3>
                        <p className="rubchat-feature-description">
                            Envía y recibe mensajes en tiempo real con una interfaz intuitiva
                        </p>
                    </div>
                    <div className="rubchat-feature-item">
                        <div className="rubchat-feature-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h3 className="rubchat-feature-title">Privacidad garantizada</h3>
                        <p className="rubchat-feature-description">
                            Tus conversaciones están protegidas con cifrado de extremo a extremo
                        </p>
                    </div>
                    <div className="rubchat-feature-item">
                        <div className="rubchat-feature-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3 className="rubchat-feature-title">Chats ilimitados</h3>
                        <p className="rubchat-feature-description">
                            Habla y conoce a cualquier persona que tenga una cuenta en RubChat!
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="rubchat-cta">
                <h2 className="rubchat-cta-title">¿Listo para comenzar?</h2>
                <p className="rubchat-cta-description">Únete a millones de usuarios que ya disfrutan de nuestra plataforma</p>
                <div className="rubchat-cta-buttons">
                    <a href="/register" className="rubchat-btn rubchat-primary">Crear cuenta</a>
                    <a href="/login" className="rubchat-btn rubchat-secondary rubchat-light">Iniciar sesión</a>
                </div>
            </section>

            {/* Footer */}
            <footer className="rubchat-footer">
                <p className="rubchat-copyright">&copy; {new Date().getFullYear()} RubChat. Todos los derechos reservados.</p>
            </footer>

            {/* ESTILOS RESPONSIVE SOLO PARA MÓVIL */}
            <style>{`
                @media (max-width: 700px) {
                    html, body {
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        overflow-x: hidden;
                    }
                    .rubchat-container {
                        padding: 0 !important;
                        margin-top: 130vh !important; /* Baja el contenido un poco más */
                        margin-bottom: 0 !important;
                        min-width: 100vw;
                        max-width: 100vw;
                        overflow-x: hidden;
                        background: #fff;
                        min-height: 100vh;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                    }
                    .rubchat-header {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 1.1rem 1.2rem 0.7rem 1.2rem !important;
                        gap: 0.7rem;
                        min-height: unset;
                        position: sticky;
                        top: 0;
                        background: #fff;
                        z-index: 10;
                        width: 100vw;
                        box-sizing: border-box;
                        border-bottom: 1px solid #eee;
                    }
                    .rubchat-logo {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                    .rubchat-logo-text {
                        font-size: 1.5rem !important;
                        letter-spacing: -1px;
                        text-align: center;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-nav {
                        flex-direction: row;
                        gap: 0.7rem;
                        width: 100%;
                        justify-content: flex-start;
                    }
                    .rubchat-nav-link {
                        font-size: 1rem !important;
                        padding: 0.2rem 0.7rem !important;
                    }
                    .rubchat-hero {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        padding: 1.1rem 0.7rem 0.7rem 0.7rem !important;
                        gap: 1.2rem !important;
                        margin: 0 !important;
                        min-height: unset;
                        box-sizing: border-box;
                    }
                    .rubchat-hero-content {
                        align-items: flex-start !important;
                        text-align: left !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                        box-sizing: border-box;
                    }
                    .rubchat-title {
                        font-size: 2.1rem !important;
                        margin-bottom: 0.7rem !important;
                        text-align: center !important;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-typing-wrapper {
                        font-size: 1.1rem !important;
                        margin-bottom: 0.7rem !important;
                        text-align: center !important;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-description {
                        font-size: 1rem !important;
                        margin-bottom: 1.1rem !important;
                        text-align: center !important;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-buttons {
                        flex-direction: column !important;
                        gap: 0.7rem !important;
                        width: 100%;
                        align-items: center !important;
                        justify-content: center !important;
                        display: flex !important;
                    }
                    .rubchat-btn {
                        width: 90% !important;
                        max-width: 320px !important;
                        font-size: 1.05rem !important;
                        padding: 0.8rem 0 !important;
                        margin: 0 auto !important;
                        display: block !important;
                    }
                    .rubchat-hero-visual {
                        width: 100% !important;
                        min-width: 0 !important;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-top: 0.7rem;
                        margin-bottom: 0 !important;
                    }
                    .desktop-chat-container {
                        max-width: 320px !important;
                        min-width: 0 !important;
                        width: 100% !important;
                        margin: 0 auto !important;
                        box-shadow: 0 2px 12px rgba(0,0,0,0.07);
                        border-radius: 18px;
                        padding: 0 !important;
                    }
                    .chat-window {
                        min-width: 0 !important;
                        width: 100% !important;
                        border-radius: 18px !important;
                    }
                    .rubchat-features {
                        padding: 1.2rem 0.7rem !important;
                        margin: 0 !important;
                        width: 100vw !important;
                        box-sizing: border-box;
                    }
                    .rubchat-section-title {
                        font-size: 1.3rem !important;
                        margin-bottom: 1.1rem !important;
                        text-align: center !important;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-feature-list {
                        flex-direction: column !important;
                        gap: 1.1rem !important;
                    }
                    .rubchat-feature-item {
                        min-width: 0 !important;
                        width: 100% !important;
                        padding: 1rem 0.7rem !important;
                        border-radius: 12px !important;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    }
                    .rubchat-feature-title {
                        font-size: 1.08rem !important;
                        text-align: center !important;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-feature-description {
                        font-size: 0.98rem !important;
                        text-align: center !important;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-cta {
                        padding: 1.2rem 0.7rem !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                        width: 100vw !important;
                        box-sizing: border-box;
                    }
                    .rubchat-cta-title {
                        font-size: 1.25rem !important;
                        text-align: center !important;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-cta-description {
                        font-size: 1rem !important;
                        margin-bottom: 1rem !important;
                        text-align: center !important;
                        width: 100%;
                        display: block;
                    }
                    .rubchat-cta-buttons {
                        flex-direction: column !important;
                        gap: 0.7rem !important;
                        width: 100%;
                        align-items: center !important;
                        justify-content: center !important;
                        display: flex !important;
                    }
                    .rubchat-footer {
                        padding: 1.2rem 0.7rem !important;
                        font-size: 0.97rem !important;
                        text-align: center !important;
                        width: 100vw !important;
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </div>
    )
}

export default Home