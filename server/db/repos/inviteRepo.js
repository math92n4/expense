import pool from "../connection.js";

export async function sendInvite(from, to, group) {
    try {
        const [invite] = await pool.query(`INSERT INTO invites (sent_from, sent_to, group_id) VALUES (?, ?, ?)`,
                            [from, to, group])
        return invite;

    } catch(error) {
        console.error(error);
    }
}

export async function getInvites(userId) {
    try {
        const [invites] = await pool.query('SELECT users.email, expense_groups.group_name, invites.invite_id FROM invites JOIN users ON invites.sent_from = users.user_id JOIN expense_groups ON invites.group_id = expense_groups.group_id WHERE invites.sent_to = ?',
                                            [userId])

        return invites;

    } catch(error) {
        console.error(error);
    }
}

export async function acceptInvite(inviteId) {
    try {
        const [inviteData] = await pool.query('SELECT * FROM invites WHERE invite_id = ?', [inviteId]);

        const userGroup = inviteData[0]

        const [accept] = await pool.query('INSERT INTO user_group (user_id, group_id) VALUES (?,?)',
                                            [userGroup.sent_to, userGroup.group_id]);

        await deleteInvite(inviteId)

        return accept;

    } catch(error) {
        console.error(error)
    }
}

export async function deleteInvite(inviteId) {
    try {
        const [deleteInvite] = await pool.query('DELETE FROM invites WHERE invite_id = ?',
                                                [inviteId])

        return deleteInvite;
    } catch(error) {
        console.error(error);
    }
}

