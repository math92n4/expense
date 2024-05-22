import { Router } from "express";
import { createGroup, getGroupsByUserId, getGroupById, addMember, isMember } from "../db/repos/groupRepo.js"
import { authenticate } from "../middleware/middleware.js";

const router = Router();

router.get('/api/group/my', authenticate, async (req, res) => {
    const { userId } = req.claims;
    const groups = await getGroupsByUserId(userId);
    return res.send(groups)
})

router.get('/api/group/:id', authenticate, async (req, res) => {
    const groupId = req.params.id;
    const group = await getGroupById(groupId)
    return res.send(group)
})

router.get('/api/group/ismember/:groupId', authenticate, async (req, res) => {
    const { userId } = req.claims;
    const groupId = req.params.groupId;
    const member = await isMember(userId, groupId);
    return res.send(member)
})

router.get('/api/group/ismember/:userId/:groupId', authenticate, async (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    const member = await isMember(userId, groupId);
    return res.send(member)
})

router.post('/api/group', authenticate, async (req, res) => {
    const { userId } = req.claims
    const { groupName, groupDesc } = req.body;

    const group = {
        groupName: groupName,
        groupDesc: groupDesc
    }
    const createdGroup = await createGroup(userId, group)
    return res.status(201).send(createdGroup)

    
})


export default router;