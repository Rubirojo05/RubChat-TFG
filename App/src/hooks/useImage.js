import { useEffect, useState } from "react"
import useAxiosRefresh from "./useAxiosRefresh"

const useImage = () => {
	const [contacts, setcontacts] = useState('')
	const axios = useAxiosRefresh()

	useEffect(()=> {
		(async()=>{
			
			const contactsUrl = await Alluser()
			setcontacts(contactsUrl)

		})()
	},[])


	const Alluser = async() => {
		const img = await axios.get('/user/all')

		return img
	}

	return {
		Alluser,
		contacts
	}
}

export default useImage