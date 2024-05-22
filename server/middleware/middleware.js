import { authenticateToken } from "../util/jwt.js";

export function authenticate(req, res, next) {
    try {
        const cookie = req.cookies['jwt'];
        const claims = authenticateToken(cookie);
        if (!claims) {
            return res.status(401).send({ message: "Unauthenticated" });
        }
        req.claims = claims;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).send({ message: "Unauthenticated" });
    }
}

