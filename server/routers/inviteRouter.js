import { Router } from "express";
import { authenticate } from "../middleware/middleware.js";
import { getInvites, sendInvite, deleteInvite, acceptInvite } from "../db/repos/inviteRepo.js";

const router = Router();

router.get('/api/invite', authenticate, async (req, res) => {
    const { userId } = req.claims;
    const invites = await getInvites(userId);
    return res.send(invites);
})

router.post('/api/invite', authenticate, async (req, res) => {
    const sentFrom = req.claims.userId;
    const { addedUserId, groupId } = req.body;
    const post = await sendInvite(sentFrom, addedUserId, groupId)
    return res.send(post)
})

router.post('/api/invite/accept/:id', authenticate, async (req, res) => {
    const inviteId = req.params.id;
    const accept = await acceptInvite(inviteId);
    return res.send(accept);
})

router.delete('/api/invite/decline/:id', authenticate, async (req, res) => {
    const inviteId = req.params.id;
    const decline = await deleteInvite(inviteId)
    return res.send(decline)
})


export default router;