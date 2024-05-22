import "dotenv/config";
import jwt from 'jsonwebtoken'


export function generateAccessToken(email, userId) {
    return jwt.sign({ email, userId }, process.env.TOKEN_SECRET)
}

export function authenticateToken(cookie) {
    return jwt.verify(cookie, process.env.TOKEN_SECRET);
}