import dotenv from "dotenv";
import { promises as fs } from "fs";

dotenv.config();

const startgg = "https://www.start.gg/";
const startggApi = "https://api.start.gg/gql/alpha";
const startggKey = process.env.STARTGG_KEY;

/**
 * FOR ALL QUERIES DO ERROR HANDLING!
 */


/** 
 * Queries start.gg for all the sets in an event (max 500 sets).
 * 
 * Return value looks like {data: {event: id, name, sets: []}}
 * 
 * @param {*} eventUrl Looks like https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles
 * @returns Promise of query response from the start.gg api as an object
 */
export async function getEventSets(eventUrl) {
    const slug = eventUrl.substring(startgg.length);

    const query = await getQueryFromFile("EventSets.txt");
    const result = await fetch(startggApi, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + startggKey
        },
        body: JSON.stringify({
            query: query,
            variables: {
                slug: slug,
                page: 1,
                perPage: 500
            }
        })
    });
    
    return result.json();
}

/**
 * Queries start gg for the tournament name.
 * 
 * Return value looks like {data: {tournament: {id, name}}}
 * 
 * @param {*} tournamentUrl Looks like https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/details (anything beyond tournament slug is ignored)
 * @returns Promise of query response from the start.gg api as an object
 */
export async function getTournament(tournamentUrl) {
    const prefix = startgg + "tournament/";
    let slug = tournamentUrl.substring(prefix.length);
    slug = "tournament/" + slug.substring(0, slug.indexOf("/"));

    const query = await getQueryFromFile("Tournament.txt");
    const result = await fetch(startggApi, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + startggKey
        },
        body: JSON.stringify({
            query: query,
            variables: {
                slug: slug
            }
        })
    });

    return result.json();
}

async function getQueryFromFile(file) {
    return fs.readFile(`./resources/querying/${file}`, "utf8");
}

// const data = await getEventSets("https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles");
// const event = data.data.event;
// const sets = event.sets
// console.log(event);
// console.log(sets);

// const data2 = await getTournament("https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles");
// const tournament = data2.data.tournament;
// console.log(tournament.name);