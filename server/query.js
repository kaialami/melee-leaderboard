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
 * @returns Promise of nodes (sets) from API query
 */
export async function getEventSets(eventUrl) {
    const slug = eventUrl.substring(startgg.length);
    const query = await getQueryFromFile("EventSets.txt");

    let page = 1;
    let res = await fetchPage(slug, query, page);
    let nodes = res.data.event.sets.nodes;
    const totalPages = res.data.event.sets.pageInfo.totalPages;

    while (page < totalPages) {
        page++;
        res = await fetchPage(slug, query, page);
        nodes = nodes.concat(res.data.event.sets.nodes);
    }

    return Promise.resolve(nodes);
}

async function fetchPage(slug, query, page) {
    const res = await fetch(startggApi, {
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
                page: page,
                perPage: 50
            }
        })
    });

    return res.json();
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
    const res = await fetch(startggApi, {
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

    return res.json();
}

/**
 * Given a set (i.e. one node returned from getEventSets) return the set information.
 * 
 * Information includes both participants, winning player and winners (1) or losers (2) bracket.
 * 
 * @param {*} set Looks like { id, completedAt, fullRoundText, winnerId, round, slots: [ { entrant }, { entrant } ]}
 * @returns Looks like { id, p1: { id, name }, p2: { id, name }, tournament, winner, bracket, completedAt, fullRoundText }
 */
export function getSetInfo(set, tournament) {
    try {
        const id = set.id;

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
    
        const completedAt = set.completedAt;
        const fullRoundText = set.fullRoundText;

        return {
            id,
            p1: {
                id: id1,
                name: p1.name
            },
            p2: {
                id: id2,
                name: p2.name
            },
            tournament,
            winner,
            bracket,
            completedAt,
            fullRoundText
        }
    } catch (err) {
        throw Error("missing set properties");
    }
   
}

async function getQueryFromFile(file) {
    return fs.readFile(`./resources/queries/${file}`, "utf8");
}
