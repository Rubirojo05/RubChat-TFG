import { instancePrivate } from "./axios"

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await instancePrivate.post('/message/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.url
}

export const uploadAudio = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await instancePrivate.post('/message/upload-audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.url
}