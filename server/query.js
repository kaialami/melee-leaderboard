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
 * Queries start.gg for all the sets in an event (max 500 sets). Sets are returned in reverse order in which they were completed.
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

/**
 * Given a set (i.e. one node returned from getEventSets) return the set information.
 * 
 * Information includes both participants, winning player and winners (1) or losers (2) bracket.
 * 
 * @param {*} set Looks like { id, winnerId, round, slots: [ { entrant }, { entrant } ]}
 * @returns Looks like { p1: { id, name }, p2: { id, name }, winner, bracket }
 */
export function getSetInfo(set) {

    // { id, name, participants: [ { user: { discriminator } } ] }
    const p1 = set.slots[0].entrant;
    const p2 = set.slots[1].entrant;
    
    // start.gg discriminator
    const id1 = p1.participants[0].user.discriminator;
    const id2 = p2.participants[0].user.discriminator;
    
    // if losers bracket, bracket = 2
    let bracket = 1;
    if (set.round < 0) bracket = 2;

    // winner === discriminator of the winning player
    let winner = id1;
    if (set.winnerId === p2.id) winner = id2;

    return {
        p1: {
            id: id1,
            name: p1.name
        },
        p2: {
            id: id2,
            name: p2.name
        },
        winner,
        bracket
    }
    
}

async function getQueryFromFile(file) {
    return fs.readFile(`./resources/queries/${file}`, "utf8");
}

// const data = await getEventSets("https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles");
// const event = data.data.event;
// const sets = event.sets

// const grands = sets.nodes[0];
// console.log(grands);
// console.log(getSetInfo(grands));



// const data2 = await getTournament("https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles");
// const tournament = data2.data.tournament;
// console.log(tournament.name);