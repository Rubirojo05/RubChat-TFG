import { Router } from "express";
import multiparty from 'connect-multiparty'
import cloudinary from '../utils/cloudinary.js'
import multer from 'multer'
import { addUserMessage,getMessages,getMessagesById,deleteMessage,updateMessages } from "../controllers/messages.controller.js";
import { userAuthenticated } from "../middleware/authorization.js";
import { getUnreadCounts, markAsRead } from "../controllers/messages.controller.js"

const upload = multer({ dest: 'tmp/' })

export const messagesRouter = Router()
messagesRouter.use(userAuthenticated)

messagesRouter.post('/',addUserMessage)
messagesRouter.post('/user',getMessagesById)
messagesRouter.get('/',getMessages)
messagesRouter.delete('/',deleteMessage)
messagesRouter.put('/',updateMessages)
messagesRouter.post('/unread-counts', getUnreadCounts)
messagesRouter.post('/mark-as-read', markAsRead)

messagesRouter.post("/upload-image", upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" })
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "chat-images",
      resource_type: "image"
    })
    res.status(200).json({ url: result.secure_url })
  } catch (err) {
    res.status(500).json({ message: "Error uploading to Cloudinary", error: err.message })
  }
})

messagesRouter.post("/upload-audio", upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" })
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "chat-audio",
      resource_type: "video" // Cloudinary trata audio como video
    })
    res.status(200).json({ url: result.secure_url })
  } catch (err) {
    res.status(500).json({ message: "Error uploading to Cloudinary", error: err.message })
  }
})
