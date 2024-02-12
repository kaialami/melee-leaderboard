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
        SELECT ranking, username, elo, wins, played
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
            addPlayer(info.p1);
            existing.push(info.p1.id);
        }

        if (!existing.includes(info.p2.id)) {
            addPlayer(info.p2);
            existing.push(info.p2.id);
        }
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



// const reset = await resetDatabase();
// console.log(reset);

// await addPlayer({id: '19c63f43', name: "kai"});

// const players = await getPlayers();
// console.log(players);