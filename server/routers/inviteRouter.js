import { Router } from "express";
import { authenticate } from "../middleware/middleware";

const router = Router();

router.get('/api/invite', authenticate, async (req, res) => {
    // GET INVITES FOR USER
})

router.post('/api/invite', authenticate, async (req, res) => {
    const { addedUserId, groupId } = req.body;
    const post = await addMember(addedUserId, groupId)
    return res.send(post)
})

router.delete('/api/invite/decline', authenticate, async (req, res) => {
    // DECLINE - REMOVE ROW
})


export default router;