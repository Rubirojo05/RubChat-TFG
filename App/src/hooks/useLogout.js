import { instanceRefresh } from "../services/axios"; //se utiliza esta instancia por que ya tiene withCredentials, no hay que confundirse con el nombre, podria haber utilizado instance pero tendria que agregarle withCredentials.
import { useAuth } from "./useAuth";

const useLogout = () => {
	const { updateAuth } = useAuth()

	const logout = async() => {
		updateAuth({})
		try {
			await instanceRefresh.post('/auth/logout')
		} catch (err) {
			console.error(err)
		}
	}

	return logout
}

export default useLogout