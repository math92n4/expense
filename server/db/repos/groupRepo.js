import pool from "../connection.js";

export async function getGroupsByUserId(id) {
    try {
        const [groupResult] = await pool.query(`SELECT * FROM expense_groups INNER JOIN user_group ON expense_groups.group_id = user_group.group_id WHERE user_group.user_id = ?`,
                                                [id])
        return groupResult;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function getGroupById(id) {
    try {
        const [groupResult] = await pool.query(`SELECT * FROM expense_groups WHERE group_id = ?`, [id])
        console.log(groupResult)
        return groupResult[0]
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function createGroup(user, group) {
    try {
        const [groupResult] = await pool.query(`INSERT INTO expense_groups (group_name, description)
                                                VALUES (?, ?)`,
                                                [group.groupName, group.groupDesc]);

        const groupId = groupResult.insertId;

        const [result] = await pool.query(`INSERT INTO user_group (user_id, group_id)
                                           VALUES (?, ?)`,
                                           [user.id, groupId]);

        return groupResult;
    } catch (error) {
        console.error(error);
        throw error;
    }
}





export async function addMember(userId, groupId) {
    try {
        const [addMember] = await pool.query(`INSERT INTO user_group (user_id, group_id)
                                            VALUES (?,?)`, [userId, groupId])
        return addMember;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

