import { addPlayers, getPlayers, resetDatabase } from "./database.js";
import { getEventSets } from "./query.js";

const tournament = "https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles";
const result = await getEventSets(tournament);
let sets;

try {
    sets = result.data.event.sets;
    // console.log(sets);
} catch (err) {
    throw err;
}

await resetDatabase();
await addPlayers(sets.nodes);
console.log(await getPlayers());