import express from "express";
import bodyParser from "body-parser";
import { getDev, getPlayer, getPlayers, getSetsByPlayer, updateRankings, updateVisibility } from "./database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const jsonParser = bodyParser.json();

const minPlayed = 10;

// https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue 
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.static("public"));

app.get("/visible", async (req, res) => {
    const players = await getPlayers(minPlayed, true);
    res.send(players);
});

app.get("/invisible", async (req, res) => {
    const invisible = await getPlayers(minPlayed, false);
    res.send(invisible);
});

app.get("/player/:id", async (req, res) => {
    const id = req.params.id;
    const player = await getPlayer(id);
    res.send(player);
});

app.get("/sets/:id", async (req, res) => {
    const id = req.params.id;
    const player = await getPlayer(id);
    const sets = await getSetsByPlayer(player.id, "desc");
    res.send(sets);
})

app.get("/dev", async (req, res) => {
    const dev = await getDev();
    res.send(dev);
});

app.post("/make-invisible", jsonParser, async (req, res) => {
    const checked = req.body;
    try {
        await updateVisibility(checked, 0);
        await updateRankings();
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post("/make-visible", jsonParser, async (req, res) => {
    const checked = req.body;
    try {
        await updateVisibility(checked, 1);
        await updateRankings();
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get("/authenticated", authenticateToken, async (req, res) => {
    res.send(req.user);
});

function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

 