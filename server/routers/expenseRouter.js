import { Router } from "express";
import { getUsersAndExpensesByGroupId, postExpense, deleteExpense } from "../db/repos/expenseRepo.js";


const router = Router();

router.get('/api/expense/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const expenses = await getUsersAndExpensesByGroupId(groupId);
    return res.send(expenses)
})

router.post('/api/expense', async(req, res) => {
    const expense = {
        expense: req.body.expense,
        description: req.body.description,
        userId: req.body.userId,
        groupId: req.body.groupId
    }
    const post = await postExpense(expense)
    return res.status(201).send(post)
})

router.delete('/api/expense/:expenseId', async (req, res) => {
    const expenseId = req.params.expenseId;
    const deleteExpenseReq = await deleteExpense(expenseId)
    return res.send(deleteExpenseReq)
})

export default router;