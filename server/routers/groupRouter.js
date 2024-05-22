import { Router } from "express";
import { createGroup, getGroupsByUserId, getGroupById, addMember, isMember } from "../db/repos/groupRepo.js"
import { getUserByEmail } from "../db/repos/userRepo.js";
import { authenticateToken } from "../util/jwt.js";

const router = Router();

router.get('/api/group/my/:id', async (req, res) => {
    const userId = req.params.id;
    const groups = await getGroupsByUserId(userId);
    return res.send(groups)
})

router.get('/api/group/:id', async (req, res) => {
    const groupId = req.params.id;
    const group = await getGroupById(groupId)
    return res.send(group)
})

router.get('/api/group/ismember/:userId/:groupId', async (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    const member = await isMember(userId, groupId);
    return res.send(member)
})

router.post('/api/group', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = authenticateToken(cookie)
        if(!claims) {
            return res.status(401).send({ message: "Unauthenticated" })
        }

        const { user_id, email } = await getUserByEmail(claims)

        const user = {
            id: user_id,
            email: email
        }

        const { groupName, groupDesc } = req.body;

        const group = {
            groupName: groupName,
            groupDesc: groupDesc
        }

        const createdGroup = await createGroup(user, group)

        return res.status(201).send(createdGroup)

    } catch(error) {
        console.log(error)
    }
})


router.post('/api/member', async (req, res) => {
    const { userId, groupId } = req.body;
    const post = await addMember(userId, groupId)
    return res.send(post)
})


export default router;