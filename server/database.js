import mysql from "mysql2";
import dotenv from "dotenv";
import { promises as fs } from "fs";

import { getSetInfo } from "./query.js";
import { calculate } from "./Elo.js";

const minPlayed = 10;
const placements = 5;

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
 * @param played minimum number of sets played
 * @returns players in descending elo order
 */
export async function getPlayers(played, visible) {
    let where = "";
    if (visible) {
        where = "AND visible = 1 ";
    }
    const [rows] = await pool.query("SELECT * FROM player WHERE played >= ? " + where + "ORDER BY elo DESC", [played]);
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
export async function addPlayers(sets, tournament, isWeekly) {
    const players = await getPlayers(0, false);
    let existing = existingPlayers(players);

    for (let set of sets) {
        try {
            const info = getSetInfo(set, tournament);

            if (!existing.includes(info.p1.id)) {
                await addPlayer(info.p1);
                existing.push(info.p1.id);
            }
    
            if (!existing.includes(info.p2.id)) {
                await addPlayer(info.p2);
                existing.push(info.p2.id);
            }
    
            await updateNames(info.p1, info.p2);
            
            if (isWeekly === "1") {
                await makeVisible(info.p1, info.p2);
            }

            await addSet(info);
        } catch (err) {
            // skip set
        }
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

export async function addTournament(tournament, event, isWeekly, weight) {
    const [rows] = await pool.query("SELECT * FROM tournament WHERE tournamentName = ?", [tournament]);
    if (rows.length === 0) {
        await pool.query("INSERT INTO tournament VALUES(?, ?, ?, ?)", [tournament, event, isWeekly, weight]);
    }
}

export async function getTournament(tournament) {
    const [rows] = await pool.query("SELECT * FROM tournament WHERE tournamentName = ?", [tournament]);
    return rows[0];
}

export async function getSets(order) {
    const [rows] = await pool.query(`SELECT * FROM sets ORDER BY completedAt ${order}`);
    return rows;
}

export async function getSetsByPlayer(id, order) {
    const [rows] = await pool.query(`SELECT * FROM sets WHERE p1 = ? OR p2 = ? ORDER BY completedAt ${order}`, [id, id]);
    return rows;
}

export async function getSetsByTournament(tournament, order) {
    const [rows] = await pool.query(`SELECT * FROM sets WHERE tournament = ? ORDER BY completedAt ${order}`, [tournament]);
    return rows;
}



export async function updateElo(tournament) {
    const t = await getTournament(tournament);
    const sets = await getSetsByTournament(tournament, "asc");
    for (let set of sets) {
        let outcome = 1;
        if (set.winner === set.p2) {
            outcome = 0;
        }

        const p1 = await getPlayer(set.p1);
        const p2 = await getPlayer(set.p2);

        let { newRa, newRb, change } = calculate(p1.elo, p2.elo, outcome, set.bracket, t.weight);



        if (p1.wins >= placements && p2.wins >= placements) { // neither in placements - normal elo changes
            await pool.query(`
            UPDATE player 
            SET elo = ?, wins = ?, played = ?
            WHERE id = ?; 
            UPDATE player 
            SET elo = ?, wins = ?, played = ?
            WHERE id = ?`, [newRa, p1.wins + outcome, p1.played + 1, p1.id, newRb, p2.wins + (1 - outcome), p2.played + 1, p2.id]);
        } else { // someone is in placements - no loss penalty for either
            await pool.query("UPDATE sets SET placement = 1 WHERE id = ?", [set.id]);
            
            if (change > 0) { // p1 wins
                await pool.query("UPDATE player SET elo = ?, wins = ?, played = ? WHERE id = ?", 
                    [newRa, p1.wins + outcome, p1.played + 1, p1.id]);

                await pool.query("UPDATE player SET elo = ?, wins = ?, played = ? WHERE id = ?", 
                    [p2.elo, p2.wins + (1 - outcome), p2.played + 1, p2.id]);
            } else { // p2 wins or no change
                await pool.query("UPDATE player SET elo = ?, wins = ?, played = ? WHERE id = ?", 
                    [p1.elo, p1.wins + outcome, p1.played + 1, p1.id]);

                await pool.query("UPDATE player SET elo = ?, wins = ?, played = ? WHERE id = ?", 
                    [newRb, p2.wins + (1 - outcome), p2.played + 1, p2.id]);
            }
        }
        

        await pool.query("UPDATE sets SET eloChange = ? WHERE id = ?", [change, set.id]);
    }
}

export async function updateRankings() {
    let players = await getPlayers(minPlayed, true);
    if (players.length > 0) {
        let prevRank = 1;
        let prevElo = players[0].elo;

        await updateRank(players[0], 1);

        for (let i = 1; i < players.length; i++) {
            let player = players[i];
            if (player.elo === prevElo) {
                await updateRank(player, prevRank + 1);
            } else {
                await updateRank(player, i + 1);
                prevRank = i;
                prevElo = player.elo;
            }
        }
    }  
}

export async function getDev() {
    const [rows] = await pool.query("SELECT pass FROM DEV");
    return rows;
}

export async function insertDev(hash) {
    return pool.query("INSERT INTO dev VALUES('dev', ?)", [hash]);
}

export async function insertToken(token) {
    return pool.query("INSERT INTO token(id) VALUES (?)", [token]);
}

export async function getToken(token) {
    const [rows] = await pool.query("SELECT id FROM token WHERE id = ?", [token]);
    return rows;
}

export async function deleteToken(token) {
    return pool.query("DELETE FROM token WHERE id = ?", [token]);
}

async function updateRank(player, rank) {
    await pool.query("UPDATE player SET ranking = ? WHERE id = ?", [rank, player.id]);
}

async function makeVisible(p1, p2) {
    const [rows1] = await pool.query("SELECT * FROM player WHERE id = ?", [p1.id]);
    const [rows2] = await pool.query("SELECT * FROM player WHERE id = ?", [p2.id]);

    if (rows1[0].forceInvisible === 0) {
        await pool.query("UPDATE player SET visible = 1 WHERE id = ?", [p1.id]);
    }

    if (rows2[0].forceInvisible === 0) {
        await pool.query("UPDATE player SET visible = 1 WHERE id = ?", [p2.id]);
    }
}


export async function updateVisibility(checked, visibility) {
    const forceInvisibile = (1 - visibility);
    let promises = [];
    for (const [id, value] of Object.entries(checked)) {
        if (value) {
            promises.push(pool.query("UPDATE player SET visible = ?, forceInvisible = ? WHERE id = ?", [visibility, forceInvisibile, id]));
        }
    }
    console.log(promises);
    const result = await Promise.all(promises);
    console.log(result);
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
 */
async function addSet(set) {
    const p1 = set.p1;
    const p2 = set.p2;
    await pool.query("INSERT INTO sets VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)", [set.id, set.tournament, p1.id, p1.name, p2.id, p2.name, set.winner, set.bracket, set.fullRoundText, set.completedAt, set.placement]);
}
