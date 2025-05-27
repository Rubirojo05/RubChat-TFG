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
const BASE_URL = process.env.BASE_URL || "http://localhost:3000"

export const addUserController = async (req, res) => {
    const file = req.files && req.files.img && req.files.img.type ? req.files.img : false
    if (file) req.body.img = file
    req.body.roleId = req.body.roleId || '2'

    const newvalidate = { ...req.body }
    const validate = validateUser(newvalidate)
    if (validate.error) return res.status(400).json({ error: JSON.parse(validate.error.message) })

    const { password, email } = validate.data
    const duplicate = await User.getByEmail({ email })
    if (duplicate[0].length) return res.status(409).json({ message: 'Duplicate username' })

    let imgUrl = 'DefaultImage.png'
    if (file) {
        // SUBIR A CLOUDINARY
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "user-profile",
                resource_type: "image"
            })
            imgUrl = result.secure_url
        } catch (err) {
            return res.status(500).json({ message: "Error uploading user image to Cloudinary", error: err.message })
        }
    }
    const id = crypto.randomUUID()

    try {
        const hashed_password = await hashPassword({ password })
        await User.add({ ...validate.data, password: hashed_password, id, img: imgUrl })
        res.status(200).json({ message: 'user add' })
    } catch (error) {
        // Solo borrar si subiste imagen local y no es la imagen por defecto ni una URL de Cloudinary
        if (file && file.path && imgUrl !== 'DefaultImage.png' && !imgUrl.startsWith('http')) {
            deletelinkFile({ path: file.path.split('\\').pop() })
        }
        return res.status(400).json({ message: 'error at insert user' })
    }
}

export const updateUserController = async (req, res) => {
    const { id, roleId, email, ...rest } = req.body
    if (!id) return res.status(400).json({ message: 'id required' })
    delete req.body.id

    // Permite actualizar solo el rol y/o email si es lo único que llega
    const newvalidate = { ...rest }
    if (roleId !== undefined) newvalidate.roleId = Number(roleId)
    if (email) newvalidate.email = email

    // Si solo se actualiza el rol o email, no hace falta validar imagen o password
    if (Object.keys(newvalidate).length === 0) {
        return res.status(400).json({ message: 'No data to update' })
    }

    // Validación parcial solo si hay más campos
    let validate = { data: newvalidate }
    if (newvalidate.password || newvalidate.img || newvalidate.firstName || newvalidate.lastName) {
        validate = validateUpdateUserPartial(newvalidate)
        if (validate.error) return res.status(400).json({ error: JSON.parse(validate.error.message) })
        newvalidate.active = validate.data.active
        newvalidate.roleId = validate.data.roleId
    }

    const user = await User.getById({ id })
    if (!user || !user[0].length) return res.status(400).json({ message: 'User not found' })

    // Si se actualiza el email, comprueba duplicados
    if (email) {
        const duplicate = await User.getByEmail({ email })
        if (duplicate[0].length && duplicate[0][0].id !== id) {
            return res.status(409).json({ message: 'Duplicate username' })
        }
    }

    // Si hay imagen, súbela a Cloudinary
    const file = req.files?.img ? req.files.img : undefined
    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "user-profile",
                resource_type: "image"
            })
            newvalidate.img = result.secure_url
        } catch (err) {
            return res.status(500).json({ message: "Error uploading user image to Cloudinary", error: err.message })
        }
    }

    // Si hay password, hasheala
    if (newvalidate.password) {
        newvalidate.password = await hashPassword({ password: newvalidate.password })
    }

    try {
        await User.updatebyId({ id, data: newvalidate })
        res.status(200).json({ message: 'update user' })
    } catch (error) {
        if (file && file.path && newvalidate.img && !newvalidate.img.startsWith('http')) {
            deletelinkFile({ path: file.path.split('\\').pop() })
        }
        return res.status(400).json({ message: 'error at update user', error })
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'User id Required' })

    const user = await User.getById({ id })
    if (!(user[0].length)) return res.status(400).json({ message: 'User not found' })
    const img = user[0][0].img

    try {
        // 1. Elimina todos los mensajes donde el usuario sea emisor o receptor
        await Messages.deleteAllByUser({ id })

        // 2. Elimina el usuario
        await User.deletebyId({ id })

        // 3. Borra la imagen si corresponde
        if (img && img !== 'DefaultImage.png') {
            if (img.startsWith('http')) {
                // Es Cloudinary: extrae el public_id y borra
                const matches = img.match(/\/user-profile\/([^\.\/]+)\.(jpg|jpeg|png|webp|gif)$/i)
                if (matches) {
                    const publicId = `user-profile/${matches[1]}`
                    try {
                        await cloudinary.uploader.destroy(publicId)
                    } catch (err) {
                        console.error("Error al borrar imagen de Cloudinary:", err.message)
                    }
                }
            } else {
                // Es local
                deletelinkFile({ path: img })
            }
        }
        return res.status(200).json({ message: 'User deleted' })
    } catch (error) {
        res.status(400).json({ message: 'error delete user' })
    }
}

export const getAllUsers = async (req, res) => {
    const { id } = req
    try {
        const result = await User.getAll()
        const users = result[0].filter(item => item.id !== id)

        for (const user of users) {
            const imageName = user.img
            user.roleId = Number(user.roleId)
            if (imageName && imageName.startsWith('http')) {
                // Ya es una URL de Cloudinary, no tocar
                user.img = imageName
            } else {
                // Es una imagen local, construir la URL local
                const filePath = path.join(process.cwd(), '/src/uploads/users', imageName)
                try {
                    await fs.access(filePath, fs.constants.F_OK)
                    user.img = `${BASE_URL}/uploads/users/${imageName}`
                } catch (err) {
                    user.img = `${BASE_URL}/uploads/users/DefaultImage.png`
                }
            }
        }
        return res.status(200).json(users)
    } catch (error) {
        res.status(400).json({ message: 'server error' })
    }
}

export const getUserbyId = async (req, res) => {
    const { id } = req
    try {
        const result = await User.getById({ id })
        // Si quieres, puedes aplicar la misma lógica de imagen aquí
        return res.status(200).json(result[0][0])
    } catch (error) {
        res.status(400).json({ message: 'User not found' })
    }
}