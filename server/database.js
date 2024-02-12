import mysql from "mysql2";
import dotenv from "dotenv";
import { promises as fs } from "fs";

import { getSetInfo } from "./query.js";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    multipleStatements: true
}).promise();

export async function resetDatabase() {
    const sql = await fs.readFile("./resources/database/leaderboard.sql", "utf8");
    return pool.query(sql);
}

export async function getPlayers() {
    const [rows] = await pool.query("SELECT * FROM player ORDER BY elo DESC");
    return rows;
}

export async function getPlayer(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM player
        WHERE id = ?
    `, [id]);

    return rows[0];
}

export async function addPlayers(sets) {
    const players = await getPlayers();
    let existing = existingPlayers(players);

    for (let set of sets) {
        const info = getSetInfo(set);

        if (!existing.includes(info.p1.id)) {
            await addPlayer(info.p1);
            existing.push(info.p1.id);
        }

        if (!existing.includes(info.p2.id)) {
            await addPlayer(info.p2);
            existing.push(info.p2.id);
        }

        await updateNames(info.p1, info.p2);
    }
}

function existingPlayers(players) {
    let ids = [];
    for (let player of players) {
        ids.push(player.id);
    }
    return ids;
}

async function addPlayer(p) {
    return pool.query("INSERT INTO player(id, username) VALUES(?, ?)", [p.id, p.name]);
}

async function updateNames(p1, p2) {
    const player1 = await getPlayer(p1.id);
    const player2 = await getPlayer(p2.id);
    
    if (p1.name !== player1.username) {
        await pool.query("UPDATE player SET username = ? WHERE id = ?", [p1.name, p1.id]);
    }

    if (p2.name !== player2.username) {
        await pool.query("UPDATE player SET username = ? WHERE id = ?", [p2.name, p2.id]);
    }
}



// const reset = await resetDatabase();
// console.log(reset);

// await addPlayer({id: '19c63f43', name: "kai"});

// const players = await getPlayers();
// console.log(players);