import axios from 'axios'

const PORT = import.meta.env.VITE_API_URL
console.log(PORT)

export const instancePrivate = axios.create({
	baseURL: PORT,
	withCredentials: true,
})

export const instancePublic = axios.create({
	baseURL: PORT,
	headers: { 'Content-Type': 'application/json' }
})

export const instanceRegister = axios.create({
	baseURL: PORT,
	headers: { 'Content-Type': 'multipart/form-data' }
})

export const instanceRefresh = axios.create({
	baseURL: PORT,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
})