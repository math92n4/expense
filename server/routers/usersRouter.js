import { Router } from "express";
import { getUserByEmail, createUser } from "../db/repos/userRepo.js";
import { hashPassword, checkPassword } from "../util/password.js"
import { generateAccessToken, authenticateToken } from "../util/jwt.js";
import { authenticate } from "../middleware/middleware.js"

const router = Router();

router.get('/api/user/:email', async (req, res) => {
    const email = req.params.email;
    const result = await getUserByEmail(email);
    if(!result) {
        return res.status(404).send({ data: "Could not find user" })
    }
    res.send(result)
})

router.post('/api/user', async (req, res) => {
    const { email, password } = req.body;
    
    if(!email) {
        return res.status(400).send("Email is missing")
    }

    if(!password) {
        return res.status(400).send("Password is missing")
    }

    if(await getUserByEmail(email)) {
        return res.status(409).send("Email already exist")
    }

    const encryptedPassword = await hashPassword(password)
    const result = await createUser(email, encryptedPassword)
    res.status(201).send(result.id)
})

router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email)
    if(!user) {
        return res.status(404).send("User not found")
    } 

    const passwordCheck = await checkPassword(password, user.password)
    if(!passwordCheck) {
        return res.status(400).send("Bad credentials")
    }

    const userId = user.user_id

    const token = generateAccessToken(email, userId)


    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 500000
    })

    return res.send({ email, userId })
})

router.get('/api/user', authenticate, async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = authenticateToken(cookie)
        if(!claims) {
            return res.status(401).send("Unauthenticated")
        }

        const { user_id, email } = await getUserByEmail(claims)

        const user = {
            id: user_id,
            email: email
        }

        return res.status(200).send(user)
         
    } catch(e) {
        return res.status(401).send("Unauthenticated")
    }
    
})

router.post('/api/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })
    res.send('Logged out')
})

export default router;