import bcrypt from 'bcrypt'

export const hashPassword = async({password}) =>{
    const hashed_password = await bcrypt.hash(password,10)
    return hashed_password
}
export const compareHashPassword = async({password,hashed_password}) => {
    return await bcrypt.compare(password,hashed_password)
}