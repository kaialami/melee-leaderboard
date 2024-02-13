import { start } from "repl";
import { addPlayers, addTournament, getPlayers, getSets, getSetsByPlayer, resetDatabase, updateElo } from "./database.js";
import { getEventSets } from "./query.js";
import { promises as fs } from "fs";

async function addAndUpdate(urls) {
    resetDatabase();

    const startgg = "https://www.start.gg/";
    for (let url of urls) {
        if (url === "") return;

        let prefix = startgg + "tournament/";
        let tournament = url.substring(prefix.length);
        tournament = tournament.substring(0, tournament.indexOf("/"));
        prefix = startgg + "tournament/" + tournament + "/event/";
        let event = url.substring(prefix.length);
        console.log(prefix + event, tournament, event);

        const sets = await getEventSets(prefix + event);
        await addTournament(tournament, event);
        await addPlayers(sets, tournament);
        let weight = 1;
        if (tournament === "janairy-2024") weight = 2;
        updateElo(tournament, weight);
    }
}

// const weeklyTournament = "https://www.start.gg/tournament/ubc-melee-weekly-36-pizza-time/event/melee-singles";
// const janairyTournament = "https://www.start.gg/tournament/janairy-2024/event/melee-singles";
// const weekly = await getEventSets(weeklyTournament);
// const janairy = await getEventSets(janairyTournament);


// await resetDatabase();
// await addTournament("ubc-melee-weekly-36-pizza-time", "melee-singles");
// await addTournament("janairy-2024", "melee-singles");
// await addPlayers(weekly, "ubc-melee-weekly-36-pizza-time");
// await addPlayers(janairy, "janairy-2024");

// await updateElo("janairy-2024", 2);
// await updateElo("ubc-melee-weekly-36-pizza-time", 1);

const urls = await fs.readFile("./resources/tournament-urls/urls.txt", "utf8");
const splitUrls = urls.split(/\r?\n/);
await addAndUpdate(splitUrls);
