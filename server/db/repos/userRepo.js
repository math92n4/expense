import pool from "../connection.js";

export async function getUserByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
}

export async function createUser(email, password) {
    const [result] =  await pool.query(`INSERT INTO users (email, password) 
                    VALUES (?, ?)`,
                    [email, password]);
    return getUserByEmail(email)
}