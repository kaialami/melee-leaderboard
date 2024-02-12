import express from "express";
import { getPlayers } from "./database.js";

const app = express();

app.get("/players", async (req, res) => {
    const players = await getPlayers();
    res.send(players);
});

app.get("/dev", (req, res) => {
    res.send([{
        id: 'dev',
        username: 'dev',
        ranking: 23,
        elo: 2000,
        wins: 10,
        played: 22,
        visible: 1
    }]);
})

app.use(express.static("public"));

const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

 