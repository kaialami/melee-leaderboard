import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
}).promise();

async function getPlayers() {
    const [rows] = await pool.query("SELECT * FROM player");
    return rows;
}

async function getPlayer(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM player
        WHERE id = ?
    `, [id]);

    return rows[0];
}

const players = await getPlayers();
console.log(players);
const kai = await getPlayer("19c63f4dd3");
console.log(kai);