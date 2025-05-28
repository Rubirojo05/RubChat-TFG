import { validateUser } from '../validator/user.validator.js'
import crypto from 'crypto'
import { UserModel } from "../models/user.model.js";
import { MessageModel } from "../models/message.model.js";
import { hashPassword } from '../utils/auth.js';
import { deletelinkFile, ulrImage } from '../utils/pathOfImg.js';
import { validateUpdateUserPartial } from '../validator/userUpdate.validator.js';
import cloudinary from '../utils/cloudinary.js'
import { createAccessToken } from '../utils/jwt.js'

const User = new UserModel
const Messages = new MessageModel

const DEFAULT_AVATAR_URL = "https://res.cloudinary.com/dc4m6ur4f/image/upload/v1748351647/DefaultImage_mf97vm.png"

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

    let imgUrl = DEFAULT_AVATAR_URL
    if (file) {
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
        if (file && file.path && imgUrl !== DEFAULT_AVATAR_URL && !imgUrl.startsWith('http')) {
            deletelinkFile({ path: file.path.split('\\').pop() })
        }
        return res.status(400).json({ message: 'error at insert user' })
    }
}

export const updateUserController = async (req, res) => {
    const { id, roleId, email, ...rest } = req.body
    if (!id) return res.status(400).json({ message: 'id required' })
    delete req.body.id

    const newvalidate = { ...rest }
    if (roleId !== undefined) newvalidate.roleId = Number(roleId)
    if (email) newvalidate.email = email

    // --- AÑADIDO: Si hay archivo, añade el objeto img para la validación ---
    const file = req.files?.img ? req.files.img : undefined
    if (file) {
        newvalidate.img = {
            size: file.size,
            type: file.type
        }
    }

    if (Object.keys(newvalidate).length === 0) {
        return res.status(400).json({ message: 'No data to update' })
    }

    let validate = { data: newvalidate }
    if (newvalidate.password || newvalidate.img || newvalidate.firstName || newvalidate.lastName) {
        validate = validateUpdateUserPartial(newvalidate)
        if (validate.error) return res.status(400).json({ error: JSON.parse(validate.error.message) })
        // Asegúrate de que estos campos existen tras la validación
        newvalidate.active = validate.data.active ?? 1
        newvalidate.roleId = validate.data.roleId ?? 2
    }

    const user = await User.getById({ id })
    if (!user || !user[0].length) return res.status(400).json({ message: 'User not found' })

    if (email) {
        const duplicate = await User.getByEmail({ email })
        if (duplicate[0].length && duplicate[0][0].id !== id) {
            return res.status(409).json({ message: 'Duplicate username' })
        }
    }

    // --- SUBIDA A CLOUDINARY ---
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

    if (newvalidate.password) {
        newvalidate.password = await hashPassword({ password: newvalidate.password })
    }

    try {
        await User.updatebyId({ id, data: newvalidate })
        // Obtener el usuario actualizado
        const updatedUser = await User.getById({ id })
        // Devuelve el usuario actualizado (incluyendo la nueva URL de imagen)
        const userPayload = {
            firstName: updatedUser[0][0].firstName,
            id: updatedUser[0][0].id,
            email: updatedUser[0][0].email,
            roleId: updatedUser[0][0].roleId,
            img: updatedUser[0][0].img // Cambia 'url' por 'img' para ser consistente
        }
        // Solo devuelve el usuario actualizado, NO el accessToken
        res.status(200).json({
            message: 'update user',
            user: userPayload
        })
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
        await Messages.deleteAllByUser({ id })
        await User.deletebyId({ id })

        if (img && img !== DEFAULT_AVATAR_URL) {
            if (img.startsWith('http')) {
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
                user.img = imageName
            } else {
                user.img = DEFAULT_AVATAR_URL
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
        return res.status(200).json(result[0][0])
    } catch (error) {
        res.status(400).json({ message: 'User not found' })
    }
}