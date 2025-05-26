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
        </div>
    )
}

export default Home
