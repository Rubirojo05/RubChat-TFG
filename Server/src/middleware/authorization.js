import { decodeToken } from "../utils/jwt.js"

export const userAuthenticated = (req,res, next) =>{
    const  authorization  = req.headers.authorization || req.headers.Authorization
    if(!authorization?.startsWith('Bearer ')) return res.status(401).json({message: 'Unauthorized'})
    const token = authorization.replace('Bearer ','')
    
    try {
        const dataUser = decodeToken(token)
        const {exp, id} = dataUser
        const currentTime = new Date().getTime()
        if(exp < currentTime) return res.status(403).json({message:'Forbidden'})
        req.id = id
    } catch (error) {
        return res.status(401).json({response:'Unauthorized'})
    }
    next()
}