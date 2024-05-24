
export function getTotalExpenses(expenses) {
    let total = 0;
    for(let i=0; i<expenses.length; i++) {
        total += parseFloat(expenses[i].expense)
    }
    return total;
}


function getTotalExpensesForUsers(expenses) {
    const uniqueUsers = findUniqueUsers(expenses);
    const totalExpenses = [];

    uniqueUsers.forEach(userEmail => {
        const userExpenses = expenses.filter(expense => expense.email === userEmail);
        const totalExpense = userExpenses.reduce((total, expense) => total + parseFloat(expense.expense), 0);
        totalExpenses.push({ email: userEmail, totalExpense });
    });

    return totalExpenses;
}


function findUniqueUsers(expenses) {
    let users = []
    for(const expense of expenses) {
        if(!users.includes(expense.email)) {
            const userEmail = expense.email;
            users.push(userEmail);
        }
    }
    return users;
}

function getAmountToBeShared(expenses) {
    const userExpenses = getTotalExpensesForUsers(expenses);
    let total = 0;
    userExpenses.forEach(userExpense => {
        total += parseFloat(userExpense.totalExpense)
    })
    const result = total / userExpenses.length
    return result
}



function getUsersWithAmountUnder(expenses) {
    let users = []
    const totalAllUsers = getTotalExpensesForUsers(expenses);
    const amountToBeShared = getAmountToBeShared(expenses);
    totalAllUsers.forEach(user => {
        if(user.totalExpense < amountToBeShared) {
            users.push(user)
        }
    })
    return users;
}

function getUsersWithAmountOver(expenses) {
    let users = []
    const totalAllUsers = getTotalExpensesForUsers(expenses);
    const amountToBeShared = getAmountToBeShared(expenses);
    totalAllUsers.forEach(user => {
        if(user.totalExpense > amountToBeShared) {
            users.push(user)
        }
    })
    return users;
    
}

export function calculateTransfers(expenses) {
    let transfers = [];
    const amountToBeShared = getAmountToBeShared(expenses);
    const usersWithAmountOver = getUsersWithAmountOver(expenses);
    const usersWithAmountUnder = getUsersWithAmountUnder(expenses);

    for(const userOver of usersWithAmountOver) {
        const maxTransferAmount = userOver.totalExpense - amountToBeShared;

        for(const userUnder of usersWithAmountUnder) {
            if(userUnder.totalExpense !== amountToBeShared) {
                let toTransfer = amountToBeShared - userUnder.totalExpense;
                if(toTransfer > maxTransferAmount) {
                    toTransfer = maxTransferAmount;
                }
                userUnder.totalExpense += toTransfer;
                userOver.totalExpense -= toTransfer;
                transfers.push({ userFrom: userUnder.email, userTo: userOver.email, amount: toTransfer })
            }
        }
    }
    return transfers;
}
