import { validateMessage,validateMessageUpdate} from '../validator/message.validator.js'
import crypto from 'crypto'
import { MessageModel } from "../models/message.model.js";
import { pool } from '../models/DBConnection.js'

const Message = new MessageModel

export const addUserMessage = async(req,res)=>{
    const { id } = req
    
    const validate = validateMessage({...req.body})
    
    if(validate.error){
        return res.status(400).json({ error: JSON.parse(validate.error.message)})
    }

    const idMessage = crypto.randomUUID()
    const {content,idReceptor} = validate.data
    const date = new Date()
        const messageToAdd = {
            id: idMessage, 
            idEmitor: id ,
            idReceptor,
            content,
            date
        }

    try {
        
        await Message.add({...messageToAdd})
        const { emitToSocket } = req
        
        emitToSocket('msg-receive', messageToAdd)
        res.status(200).json({...messageToAdd})

    } catch (error) {
        return res.status(400).json({message:'error at insert',error})
    }
}
export const updateMessages = async(req,res)=>{

    const validate = validateMessageUpdate({...req.body})

    if(validate.error){
        return res.status(400).json({ error: JSON.parse(validate.error.message)})
    }

    const {content,idUser,id} = validate.data

    const message = await Message.getById({id})
    if(!message) return res.status(400).json({message: 'Message not found'})

    try {
        await Message.update({id,content,idUser})
        res.status(200).json({ message:'update message'})
    } catch (error) {
        return res.status(400).json({message:'error at update message',error})
    }
}
export const getMessages = async(req,res)=>{

    try {

        const result = await Message.getAll()
        if(!(result.length)) return res.status(400).json({message: 'No notes found'})
        const { io } = req
        io.emit('messages',result[0])
        res.status(200).json(result[0])

    } catch (error) {
        return res.status(400).json({message:'error at get messages',error})
    }

}
export const getMessagesById = async(req,res)=>{

    const {id} = req
    const { idReceptor } = req.body

    try {
        const result = await Message.getByIdEmisorReceptor({id,idReceptor})
        res.status(200).json(result[0])
    } catch (error) {
        res.status(400).json(error)
    }

}
export const deleteMessage = async(req,res) => {
    
    const {id} = req.body
    if(!id) return res.status(400).json({message: 'Message id Required'})

    const message = await Message.getById({id})
    if(!(message[0].length)) return res.status(400).json({message:'Message not found'})

    try {
        await Message.delete({id})
        return res.status(200).json({message: 'message deleted'})
    } catch (error) {
        res.status(400).json({message: 'error delete message'})
    }
}   
export const getUnreadCounts = async (req, res) => {
  const userId = req.body.id
  const [rows] = await pool.query(
    `SELECT idEmitor as fromUser, COUNT(*) as count
     FROM messages
     WHERE idReceptor = ? AND \`read\` = FALSE
     GROUP BY idEmitor`,
    [userId]
  )
  res.json(rows)
}

export const markAsRead = async (req, res) => {
  const { idEmitor, idReceptor } = req.body
  await pool.query(
    `UPDATE messages SET \`read\` = TRUE WHERE idEmitor = ? AND idReceptor = ? AND \`read\` = FALSE`,
    [idEmitor, idReceptor]
  )
  res.json({ ok: true })
}