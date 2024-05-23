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

export async function createGroup(userId, group) {
    try {
        const [groupResult] = await pool.query(`INSERT INTO expense_groups (group_owner, group_name, description)
                                                VALUES (?, ?, ?)`,
                                                [userId, group.groupName, group.groupDesc]);

        const groupId = groupResult.insertId;

        const [result] = await pool.query(`INSERT INTO user_group (user_id, group_id)
                                           VALUES (?, ?)`,
                                           [userId, groupId]);

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


export async function isMember(userId, groupId) {
    try {
        const [isMember] = await pool.query(`SELECT * FROM user_group WHERE user_id = ? AND group_id = ?`,
                                            [userId, groupId])
        if(!isMember[0]) {
            return false;
        }
        return isMember[0]
        
    } catch(error) {
        console.error(error)
    }
}

export async function deleteGroup(id) {
    try {
        const [deletedGroup] = await pool.query('DELETE FROM expense_groups WHERE group_id = ?',
                                                [id])
        return deletedGroup;
    } catch(error) {
        console.error(error);
    }
}
