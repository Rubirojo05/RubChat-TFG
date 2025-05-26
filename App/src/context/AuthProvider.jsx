import { createContext,useState } from "react";

export const AuthContext = createContext()

// const initialState = JSON.parse(window.localStorage.getItem('auth')) ? JSON.parse(window.localStorage.getItem('auth')) : {}

export const AuthProvider = ({children}) =>{
	const [auth,setAuth] = useState({})

	const updateAuth = (result) => {
		const newAuth = {...result}
		// window.localStorage.setItem('auth', JSON.stringify(newAuth))
		setAuth(newAuth)
	}

	const updateAuthLogin = ({accessToken}) => {
		// window.localStorage.setItem('auth', JSON.stringify(newAuth))
		setAuth(accessToken)
	}

	return(
		<AuthContext.Provider value={{auth,updateAuth,updateAuthLogin}}>
			{children}
		</AuthContext.Provider>
	)
}