import './App.css'
import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { RequireAuth } from './components/RequireAuth'
import styled from 'styled-components'
import { Unauthorized } from './components/Unauthorized'
import PersistLogin from './components/PersistLogin'
import useAxiosRefresh from "./hooks/useAxiosRefresh"
import Chat from './components/Chat'
import Home from './components/Home'
import Info from './components/Info'
import AdminPage from './components/AdminPage'

function App() {
	useAxiosRefresh()

	return (
		<Container>
			<Suspense fallback={<div>Loading...</div>}>
				<BrowserRouter>
					<Routes>
						{/* Rutas no protegidas/Publicas */}
						<Route path="/" element={<Home />} />
						<Route path="/info" element={<Info />} />

						{/* Rutas no protegidas/Publicas */}
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="/unauthorized" element={<Unauthorized />} />

						<Route element={<PersistLogin />}>
							{/* Rutas protegidas, en vez de hacerlo una a una, se envuelve todo a la vez*/}
							{/* Rutas donde pueden ingresar usuarios y admimintradores */}
							<Route element={<RequireAuth allowedRoles={[1, 2]} />}>
								<Route path="/chat" element={<Chat />} />
							</Route>

							{/* Rutas donde pueden ingresar admimintradores */}
							<Route element={<RequireAuth allowedRoles={[1]} />}>
								<Route path="/admin" element={<AdminPage />} />
							</Route>
						</Route>

					</Routes>
				</BrowserRouter>
			</Suspense>
		</Container>
	)
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`

export default App
