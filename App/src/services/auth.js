import { instanceRefresh } from "./axios"

export const refreshToken = async() => {
	try {
		const result = await instanceRefresh.get(`/auth/refresh`)
		return result.data
	} catch (error) {
		console.log(error)
	}
    
}