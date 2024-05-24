import pool from "../connection.js";

export async function postExpense(expense) {
    try {
        const [postExpense] = await pool.query(`INSERT INTO expense (expense, description, user_id, group_id)
                                                VALUES (?, ?, ?, ?)`,
                                                [
                                                expense.expense,
                                                expense.description,
                                                expense.userId,
                                                expense.groupId
                                                ]);
        return postExpense;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function deleteExpense(id) {
    try {
        const [expense] = await pool.query(`DELETE FROM expense WHERE expense_id = ?`,
                                            [id])
        return expense
    } catch(error) {
        console.error(error)
        throw(error)
    }
}

export async function getUsersAndExpensesByGroupId(id) {
    try {
        const [expenses] = await pool.query(`SELECT users.user_id, users.email, expense.expense, expense.expense_id, expense.description FROM users JOIN expense ON users.user_id = expense.user_id WHERE expense.group_id = ?`,
                                            [id])
        return expenses;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function updateExpense(expense, description, expenseId) {
    try {
        const [updatedExpense] = await pool.query('UPDATE expense SET expense = ?, description = ? WHERE expense_id = ?',
                                        [expense, description, expenseId])

        return updatedExpense;
    } catch(error) {
        console.error(error)
        throw error;
    }
}

