import { addPlayers, resetDatabase } from "./database.js";
import { getEventSets } from "./query.js";

const tournament = "https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles";
const result = await getEventSets(tournament);
let sets;

try {
    sets = result.data.event.sets;
} catch (err) {
    throw err;
}

await resetDatabase();
await addPlayers(sets);