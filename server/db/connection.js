import mysql from 'mysql2'
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_NAME,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
}).promise()

export default pool;