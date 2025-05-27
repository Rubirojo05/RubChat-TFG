import { createAccessToken, createRefreshToken, decodeTokenRefresh } from '../utils/jwt.js';
import { compareHashPassword } from '../utils/auth.js';
import { UserModel } from "../models/user.model.js";

const User = new UserModel

const DEFAULT_AVATAR_URL = "https://res.cloudinary.com/dc4m6ur4f/image/upload/v1748351647/DefaultImage_mf97vm.png"

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: 'Email or Password required' })

    try {
        const result = await User.getByEmail({ email })

        if (result.length === 0 || !(result[0][0].active)) return res.status(400).json({ message: 'Unauthorized' })

        const bool = await compareHashPassword({ password, hashed_password: result[0][0].password })
        if (!bool) return res.status(401).json({ message: 'Unauthorized' })

        const imageName = result[0][0].img
        let imageUrl

        if (imageName && imageName.startsWith('http')) {
            imageUrl = imageName
        } else {
            imageUrl = DEFAULT_AVATAR_URL
        }

        const userReturn = {
            firstName: result[0][0].firstName,
            id: result[0][0].id,
            email: result[0][0].email,
            roleId: result[0][0].roleId,
            url: imageUrl
        }

        res.cookie('refreshToken', createRefreshToken(userReturn), {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({ accessToken: createAccessToken(userReturn) })

    } catch (error) {
        return res.status(401).json({ error: 'Invalid user o password' })
    }
}

export const refresh = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.refreshToken) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.refreshToken

    let token
    try {
        token = decodeTokenRefresh(refreshToken)
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    const { exp } = token
    const currentTime = new Date().getTime()
    if (exp < currentTime) return res.status(403).json({ message: 'Forbidden' })

    let result

    try {
        result = await User.getByEmail({ email: token.email })
        if (!result[0] || !result[0][0]) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const imageName = result[0][0].img
    let imageUrl

    if (imageName && imageName.startsWith('http')) {
        imageUrl = imageName
    } else {
        imageUrl = DEFAULT_AVATAR_URL
    }

    const userReturn = {
        firstName: result[0][0].firstName,
        id: result[0][0].id,
        email: result[0][0].email,
        roleId: result[0][0].roleId,
        url: imageUrl
    }

    res.json({ accessToken: createAccessToken(userReturn), roleId: result[0][0].roleId, email: result[0][0].email })
}

export const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) return res.status(204)
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'cookie cleared' })
}