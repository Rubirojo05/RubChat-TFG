import { validateUser } from '../validator/user.validator.js'
import crypto from 'crypto'
import { UserModel } from "../models/user.model.js";
import { MessageModel } from "../models/message.model.js";
import { hashPassword } from '../utils/auth.js';
import { deletelinkFile, ulrImage } from '../utils/pathOfImg.js';
import { validateUpdateUserPartial } from '../validator/userUpdate.validator.js';
import cloudinary from '../utils/cloudinary.js'
import path from 'path'
import fs from 'fs/promises'

const User = new UserModel
const Messages = new MessageModel

export const addUserController = async(req,res)=>{
    const file = req.files && req.files.img && req.files.img.type ? req.files.img : false
    if(file) req.body.img = file
    req.body.roleId = req.body.roleId || '2'

    const newvalidate = {...req.body}
    const validate = validateUser(newvalidate)
    if(validate.error) return res.status(400).json({ error: JSON.parse(validate.error.message)})

    const { password,email } = validate.data
    const duplicate = await User.getByEmail({email})
    if(duplicate[0].length) return res.status(409).json({message: 'Duplicate username'})

    let imgUrl = 'DefaultImage.png'
    if(file){
        // SUBIR A CLOUDINARY
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "user-profile",
                resource_type: "image"
            })
            imgUrl = result.secure_url
        } catch (err) {
            return res.status(500).json({message: "Error uploading user image to Cloudinary", error: err.message})
        }
    }
    const id = crypto.randomUUID()

    try {
        const hashed_password = await hashPassword({password})
        await User.add({...validate.data, password: hashed_password, id, img: imgUrl})
        res.status(200).json({ message:'user add'})
    } catch (error) {
        // Solo borrar si subiste imagen local y no es la imagen por defecto ni una URL de Cloudinary
        if (file && file.path && imgUrl !== 'DefaultImage.png' && !imgUrl.startsWith('http')) {
            deletelinkFile({path: file.path.split('\\').pop()})
        }
        return res.status(400).json({message:'error at insert user'})
    }
}

export const updateUserController = async(req,res)=>{
    const {id} = req.body
    if(!id) return res.status(400).json({message: 'id required'})
    delete req.body.id
    const file = req.files?.img ? req.files.img : undefined
    const password = req.body?.password ? req.body.password : undefined
    const newvalidate = {...req.body}

    if(password) newvalidate.password = password
    if(file) newvalidate.img = file

    const validate = validateUpdateUserPartial(newvalidate)
    if(validate.error) return res.status(400).json({ error: JSON.parse(validate.error.message)})

    const {email} = validate.data
    newvalidate.active=validate.data.active
    newvalidate.roleId=validate.data.roleId

    const user = await User.getById({id})
    if(!user) return res.status(400).json({message: 'User not found'})

    const duplicate = await User.getByEmail({email})
    if(duplicate && duplicate[0][0]?.id !== id) return res.status(409).json({message: 'Duplicate username'})

    if(file){
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "user-profile",
                resource_type: "image"
            })
            newvalidate.img = result.secure_url
        } catch (err) {
            return res.status(500).json({message: "Error uploading user image to Cloudinary", error: err.message})
        }
    }
    if(password) newvalidate.password = await hashPassword({password})

    try {
        await User.updatebyId({id,data: newvalidate})
        res.status(200).json({ message:'update user'})
    } catch (error) {
        if(file && file.path && newvalidate.img && !newvalidate.img.startsWith('http')) {
            deletelinkFile({path: file.path.split('\\').pop()})
        }
        return res.status(400).json({message:'error at update user',error})
    }
}

export const deleteUser = async(req,res)=>{
    const {id} = req.body
    if(!id) return res.status(400).json({message: 'User id Required'})

    const messages = await Messages.getByIdOfUser({id})
    if (messages[0].length) return res.status(400).json({message:'User has assigned messages'})

    const user = await User.getById({id})
    if(!(user[0].length)) return res.status(400).json({message:'User not found'})
    const img = user[0][0].img

    try {
        await User.deletebyId({id})
        // Solo borrar si no es la imagen por defecto ni una URL de Cloudinary
        if(img && img !== 'DefaultImage.png' && !img.startsWith('http')) {
            deletelinkFile({path: img})
        }
        return res.status(200).json({message: 'User deleted'})
    } catch (error) {
        res.status(400).json({message: 'error delete user'})
    }
}

export const getAllUsers = async(req,res)=>{
    const { id } = req
    try {
        const result = await User.getAll()
        const users = result[0].filter(item=> item.id !== id)

        for(const user of users) {
            const imageName = user.img
            if (imageName && imageName.startsWith('http')) {
                // Ya es una URL de Cloudinary, no tocar
                user.img = imageName
            } else {
                // Es una imagen local, construir la URL local
                const filePath = path.join(process.cwd(), '/src/uploads/users', imageName)
                try {
                    await fs.access(filePath, fs.constants.F_OK)
                    user.img = `http://localhost:3000/uploads/users/${imageName}`
                } catch (err) {
                    user.img = '../uploads/users/DefaultImage.png' // o una imagen por defecto si quieres
                }
            }
        }

        return res.status(200).json(users)
    } catch (error) {
        res.status(400).json({message: 'server error'})
    }
}

export const getUserbyId = async(req,res)=>{
    const {id} = req
    try {
        const result = await User.getById({id})
        // Si quieres, puedes aplicar la misma lógica de imagen aquí
        return res.status(200).json(result[0][0])
    } catch (error) {
        res.status(400).json({message: 'User not found'})
    }
}