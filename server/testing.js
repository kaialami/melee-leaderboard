import { addPlayers, addTournament, getPlayers, resetDatabase } from "./database.js";
import { getEventSets } from "./query.js";

// const tournament = "https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles";
const tournament = "https://www.start.gg/tournament/janairy-2024/event/melee-singles";
const result = await getEventSets(tournament);
let sets;

try {
    sets = result.data.event.sets;
    // console.log(sets);
} catch (err) {
    throw err;
}

await resetDatabase();
// await addTournament("ubc-melee-weekly-36-pizza-time", "melee-singles");
await addTournament("janairy-2024", "melee-singles");
await addPlayers(sets.nodes, "janairy-2024");
