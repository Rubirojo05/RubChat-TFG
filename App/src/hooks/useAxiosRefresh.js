import { instancePrivate } from "../services/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "./useAuth";

const useAxiosRefresh = () => {
	const refresh = useRefreshToken()
	const {auth} = useAuth()

	useEffect(()=> {

		const requestIntercept = instancePrivate.interceptors.request.use(
			config => {
				if(!config.headers['Authorization']){
					config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
				}
				return config
			},
			(error) => Promise.reject(`error en la request : ${error}`)
		)
        
		const responseIntercept = instancePrivate.interceptors.response.use(
			response=> response,

			async (error) => {
				const prevRequest = error?.config
				if(error?.response?.status === 403 && !prevRequest?.send){
					prevRequest.send = true
					const newAcccessToken = await refresh()
					prevRequest.headers['Authorization'] = `Bearer ${newAcccessToken}`
					return instancePrivate(prevRequest)
				}
				(error) => Promise.reject(`error en la response : ${error}`)
			}
		)

		return () => {
			instancePrivate.interceptors.request.eject(requestIntercept)
			instancePrivate.interceptors.response.eject(responseIntercept)
		}

	},[auth,refresh])

	return instancePrivate
}

export default useAxiosRefresh