import { Router } from "express";
import { getUsersAndExpensesByGroupId, postExpense, deleteExpense, updateExpense } from "../db/repos/expenseRepo.js";
import { authenticate } from "../middleware/middleware.js";

const router = Router();

router.get('/api/expense/:groupId', authenticate, async (req, res) => {
    const groupId = req.params.groupId;
    const expenses = await getUsersAndExpensesByGroupId(groupId);
    return res.send(expenses)
})

router.post('/api/expense', authenticate, async(req, res) => {
    const { userId } = req.claims;
    const expense = {
        expense: req.body.expense,
        description: req.body.description,
        userId: userId,
        groupId: req.body.groupId
    }
    const post = await postExpense(expense)
    return res.status(201).send(post)
})

router.put('/api/expense', authenticate, async (req, res) => {
    const { updatedExpense, updatedDescription, expenseIdToUpdate } = req.body;
    const put = await updateExpense(updatedExpense, updatedDescription, expenseIdToUpdate);
    res.send(put);
})

router.delete('/api/expense/:expenseId', authenticate, async (req, res) => {
    const expenseId = req.params.expenseId;
    const deleteExpenseReq = await deleteExpense(expenseId)
    return res.send(deleteExpenseReq)
})

export default router;