import express from "express";
import { getPlayers } from "./database.js";

const app = express();

app.get("/players", async (req, res) => {
    const players = await getPlayers();
    res.send(players);
});

app.use(express.static("public"));

const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

 