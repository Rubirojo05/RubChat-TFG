import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import { useAuth } from '../hooks/useAuth'


const PersistLogin = () => {
	const [ isLoading,setIsLoading] = useState(true)
	const { auth } = useAuth()
	const refresh = useRefreshToken()

	useEffect(()=> {

		const verifyRefreshToken = async() =>{
			try {
				await refresh()
			} catch (err) {
				console.error(err)
			} finally{
				setIsLoading(false)
			}
		}

		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

	},[])

	// useEffect(()=> {
	//     console.log(`isLoading: ${isLoading}`)
	//     console.log(`aT: ${auth?.accessToken}`)
	//     console.log(`roleId de la recarga: ${auth.roleId}`)
	// },[isLoading])

	return (
		<>

			{
				isLoading ? <p>Cargando...</p> : <Outlet/>
			}
        
		</>
	)
}

export default PersistLogin