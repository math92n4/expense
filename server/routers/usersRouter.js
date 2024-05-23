import { Router } from "express";
import { getUserByEmail, createUser, updateUser, deleteUser } from "../db/repos/userRepo.js";
import { hashPassword, checkPassword } from "../util/password.js"
import { generateAccessToken, authenticateToken } from "../util/jwt.js";
import { authenticate } from "../middleware/middleware.js"

const router = Router();

router.get('/api/user/:email', async (req, res) => {
    const email = req.params.email;
    const result = await getUserByEmail(email);
    if(!result) {
        return res.status(404).send({ message: "Could not find user" })
    }
    res.send(result)
})

router.get('/api/user', authenticate, async (req, res) => {
    const claims = req.claims;
    if(!claims) {
        return res.status(401).send({ message: 'Unauthenticated'})
    }
    const user = await getUserByEmail(claims.email);
    console.log(user)
    return res.send(user);
})


router.post('/api/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })
    res.send('Logged out')
})

router.post('/api/user', async (req, res) => {
    const { email, password } = req.body;
    
    if(!email) {
        return res.status(400).send({ message: "Email is missing" })
    }

    if(!password) {
        return res.status(400).send({ message: "Password is missing" })
    }

    if(await getUserByEmail(email)) {
        return res.status(409).send({ message: "Email already exist" })
    }

    const encryptedPassword = await hashPassword(password)
    const result = await createUser(email, encryptedPassword)

    res.status(201).send({ message: 'User created' })
})

router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email)
    if(!user) {
        return res.status(404).send({ message: "User not found" })
    } 

    const passwordCheck = await checkPassword(password, user.password)
    if(!passwordCheck) {
        return res.status(400).send({ message: "Bad credentials" })
    }

    const userId = user.user_id

    const token = generateAccessToken(email, userId)


    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 5000000000
    })

    return res.send({ email, userId })
})

router.delete('/api/user', authenticate, async (req, res) => {
    const { userId } = req.claims;
    const deletedUser = await deleteUser(userId);
    console.log(deletedUser);
    return res.send(deletedUser)
})

router.put('/api/user', authenticate, async (req, res) => {
    const { userId, email } = req.claims;
    const currentUser = await getUserByEmail(email); 
    const { newEmail, oldPassword, newPassword } = req.body;

    const passwordMatch = await checkPassword(oldPassword, currentUser.password);

    if(!passwordMatch) {
        return res.status(403).send({ message: 'Old password doesnt match' })
    }

    const encryptedPassword = await hashPassword(newPassword)
    const updatedUser = await updateUser(userId, newEmail, encryptedPassword);
    return res.status(201).send({ message: 'User has been updated' });
})

export default router;