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

/**
 * DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER 
 * 
 *              Drops all tables. ALL DATA WILL BE LOST!
 * 
 * DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER 
 * @returns DANGER
 */
export async function resetDatabase() {
    const sql = await fs.readFile("./resources/database/leaderboard.sql", "utf8");
    return pool.query(sql);
}

/**
 * Queries for all players.
 * @returns all players from Player in descending elo order
 */
export async function getPlayers() {
    const [rows] = await pool.query("SELECT * FROM player ORDER BY elo DESC");
    return rows;
}

/**
 * Queries for a player by id.
 * @param {*} id start.gg discriminator
 * @returns one player from Player
 */
export async function getPlayer(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM player
        WHERE id = ?
    `, [id]);

    return rows[0];
}

/**
 * Given all the sets from a tournament, adds any new players to the database
 * and updates usernames. Also adds sets to database.
 * @param {*} sets array of sets obtained from start.gg api query
 */
export async function addPlayers(sets, tournament) {
    const players = await getPlayers();
    let existing = existingPlayers(players);

    let grands = true;

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
        await addSet(info, tournament, grands);
        grands = false;
    }
}

/**
 * If tournament is not in database, add it and its event (most likely melee-singles).
 * Params are just the hyphenated names in the start.gg url.
 * 
 * Call this before any addPlayers call.
 * @param {*} tournament tournament name
 * @param {*} event event name
 * @returns insert into tournament
 */

export async function addTournament(tournament, event) {
    const [rows] = await pool.query("SELECT * FROM tournament WHERE tournamentName = ?", [tournament]);
    if (rows.length === 0) {
        return pool.query("INSERT INTO tournament VALUES(?, ?)", [tournament, event]);
    }
}


/**
 * Helper function to get all ids of players already in the database.
 * @param {*} players array of players
 * @returns player ids
 */
function existingPlayers(players) {
    let ids = [];
    for (let player of players) {
        ids.push(player.id);
    }
    return ids;
}

/**
 * Helper function to add one player to the database with default values.
 * @param {*} p player to add
 * @returns insert into player
 */
async function addPlayer(p) {
    return pool.query("INSERT INTO player(id, username) VALUES(?, ?)", [p.id, p.name]);
}

/**
 * If a player's name was changed since it was added to the database, 
 * update the database to the new name.
 * @param {*} p1 player 1
 * @param {*} p2 player 2
 */
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

/**
 * Helper function to add one set to the database.
 * @param {*} set result of getSetInfo
 * @param {*} tournament tournament key
 * @param {*} isGrands true if grands (avoids runback case)
 */
async function addSet(set, tournament, isGrands) {
    let grands = 0;
    if (isGrands) grands = 1;

    const p1 = set.p1.id;
    const p2 = set.p2.id;
    await pool.query("INSERT INTO sets VALUES(?, ?, ?, ?, ?, ?, ?)", [p1, p2, tournament, set.bracket, set.winner, grands, set.startedAt]);
}



// const reset = await resetDatabase();
// console.log(reset);

// await addPlayer({id: '19c63f43', name: "kai"});

// const players = await getPlayers();
// console.log(players);