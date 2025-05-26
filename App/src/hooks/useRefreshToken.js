import { refreshToken } from "../services/auth";
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
	const {updateAuth} = useAuth()

	const refresh = async() => {

		const result = await refreshToken()
		// const data = {accessToken: result.accessToken, email: result.email , roleId : result.roleId}
		updateAuth(result)
		return result
	}
	return refresh
}

export default useRefreshToken