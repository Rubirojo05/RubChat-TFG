import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Code2, HeartHandshake, GraduationCap, Mail } from "lucide-react"

const Info = () => {
    const navigate = useNavigate()
    return (
        <Container>
            <h1>Sobre RubChat</h1>
            <Subtitle>
                Un proyecto personal, educativo y con mucha ilusión.
            </Subtitle>
            <Section>
                <SectionTitle>
                    <GraduationCap size={22} style={{ marginRight: 8, verticalAlign: "middle" }} />
                    ¿Por qué RubChat?
                </SectionTitle>
                <SectionText>
                    RubChat surge como el Trabajo de Fin de Grado Superior de Desarrollo de Aplicaciones Web. Es el resultado de meses de aprendizaje, retos y pasión por la tecnología.
                </SectionText>
            </Section>
            <Section>
                <SectionTitle>
                    <Code2 size={22} style={{ marginRight: 8, verticalAlign: "middle" }} />
                    Tecnologías utilizadas
                </SectionTitle>
                <TechList>
                    <li><b>React</b> + <b>Vite</b> para la interfaz de usuario</li>
                    <li><b>Node.js</b> y <b>Express</b> para el backend</li>
                    <li><b>Socket.io</b> para la mensajería en tiempo real</li>
                    <li><b>MySQL</b> para la base de datos</li>
                    <li><b>Styled Components</b> para el diseño</li>
                </TechList>
            </Section>
            <Section>
                <SectionTitle>
                    <HeartHandshake size={22} style={{ marginRight: 8, verticalAlign: "middle" }} />
                    Objetivo del proyecto
                </SectionTitle>
                <SectionText>
                    Más allá de crear una app de mensajería, RubChat busca demostrar habilidades en desarrollo web, usabilidad, seguridad y diseño, así como ofrecer una experiencia sencilla y moderna.
                </SectionText>
                <SectionText>
                    Uno de los propósitos principales es facilitar que conocer a nuevas personas no sea una tarea difícil. Por eso, en RubChat cada usuario registrado puede iniciar un chat directo con cualquier otra persona de la plataforma, permitiendo así conversaciones ilimitadas y fomentando nuevas conexiones de forma sencilla y accesible.
                </SectionText>
            </Section>
            <Personal>
                <b>¡Gracias por visitar y apoyar este proyecto!</b>
                <ContactLine>
                    <Mail size={18} style={{ marginRight: 7, verticalAlign: "middle" }} />
                    <a href="mailto:rubenrojomoreno@gmail.com">
                        rubenrojomoreno@gmail.com
                    </a>
                </ContactLine>
            </Personal>
            <BackHomeButton type="button" onClick={() => navigate("/")}>
                <ArrowLeft size={18} style={{ marginRight: 6 }} />
                Volver al inicio
            </BackHomeButton>
        </Container>
    )
}

const Container = styled.div`
  max-width: 520px;
  margin: auto;
  padding: 2.5rem 2rem;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  font-family: system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  justify-content: center;
  h1 {
    font-size: 2.1rem;
    margin-bottom: 0.3rem;
    color: #222;
    text-align: center;
  }
`

const Subtitle = styled.h2`
  font-size: 1.15rem;
  color: #5a5a5a;
  font-weight: 400;
  margin-bottom: 2.2rem;
  text-align: center;
`

const Section = styled.div`
  width: 100%;
  margin-bottom: 1.6rem;
`

const SectionTitle = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #2a2a2a;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
`

const SectionText = styled.div`
  font-size: 1.04rem;
  color: #444;
  margin-bottom: 0.2rem;
  text-align: left;
`

const TechList = styled.ul`
  padding-left: 1.1rem;
  margin: 0.2rem 0 0.2rem 0;
  color: #444;
  font-size: 1.03rem;
  li {
    margin-bottom: 0.2rem;
  }
`

const Personal = styled.div`
  margin: 2.2rem 0 1.2rem 0;
  font-size: 1.12rem;
  color: #333;
  text-align: center;
  font-weight: 500;
`

const ContactLine = styled.div`
  margin-top: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    color: #4f8cff;
    text-decoration: underline;
    font-weight: 400;
    font-size: 1.08rem;
    word-break: break-all;
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

export default Info