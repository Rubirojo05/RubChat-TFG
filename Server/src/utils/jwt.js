import jsonwebtoken from 'jsonwebtoken'

export const createAccessToken = (userToken) => {
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 2)
    return jsonwebtoken.sign(_tokenPayload({userToken,expiration}),process.env.ACCESS_TOKEN_SECRET)
}

export const createRefreshToken = (userToken) => {
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 24)
    return jsonwebtoken.sign(_tokenPayload({userToken,expiration}),process.env.REFRESH_TOKEN_SECRET)
}

export const decodeToken = (token) => {
    return jsonwebtoken.verify(token,process.env.ACCESS_TOKEN_SECRET)
}
export const decodeTokenRefresh = (token) => {
    return jsonwebtoken.verify(token,process.env.REFRESH_TOKEN_SECRET)
}

const _tokenPayload = ({userToken,expiration,tokenType = 'token'}) =>{
    return {
        tokenType,
        ...userToken,
        iat: new Date().getTime(),
        exp: expiration.getTime()
    }
}