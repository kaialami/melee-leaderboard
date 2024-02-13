import express from "express";
import { getPlayer, getPlayers } from "./database.js";

const app = express();


app.get("/all", async (req, res) => {
    const players = await getPlayers(10);
    res.send(players);
});

app.get("/player/:id", async (req, res) => {
    const id = req.params.id;
    const player = await getPlayer(id);
    res.send(player);
})



app.use(express.static("public"));

const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

 