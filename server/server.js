import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { getAllTournaments, getDev, getPlayer, getPlayers, getSetsByPlayer, insertDev, resetDatabase, updateDatabase, updateRankings, updateVisibility } from "./database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const jsonParser = bodyParser.json();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const minPlayed = 5;

// https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue 
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.REQUEST_URL);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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

app.get("/tournaments", async (req, res) => {
    const tournaments = await getAllTournaments(true);
    res.send(tournaments);
})

app.get("/dev", async (req, res) => {
    try {
        const dev = await getDev();
        res.send(dev);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

});

app.post("/add-tournament", jsonParser, async (req, res) => {
    const params = req.body;
    try {
        await updateDatabase(params.url, params.isWeekly, params.weight);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
})

app.post("/make-invisible", jsonParser, async (req, res) => {
    const checked = req.body;
    try {
        await updateVisibility(checked, 0);
        await updateRankings();
        res.sendStatus(200);
    } catch (err) {
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
        res.sendStatus(500);
    }
});

app.delete("/reset-database", async (req, res) => {
    try {
        await resetDatabase();
        res.sendStatus(200);
    } catch(err) {
        res.sendStatus(500);
    }
});

app.get("/export", async (req, res) => {
    const tournaments = await getAllTournaments(false);
    res.send(tournaments);
});

app.post("/import", jsonParser, async (req, res) => {
    const body = req.body;

    try {
        const splitTournaments = body.content.split(/\r?\n/);
        for (const tournament of splitTournaments) {
            const splitEntry = tournament.split(" ");
            const url = splitEntry[0];
            const weight = parseInt(splitEntry[1]);
    
            if (url === "") break;

            let isWeekly = 0;
            if (weight === 1) isWeekly = 1;

            await updateDatabase(url, isWeekly, weight);
        }
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
    
})


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

app.post("/signup", jsonParser, async (req, res) => {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 13);
    try {
        await insertDev(hash);
        
        const token = generateAccessToken({ name: "dev" });

        res.json({ token: token });
    } catch (err) {
        console.log(err);
        res.sendStatus(403);
    }
});

app.post("/login", jsonParser, async (req, res) => {
    const [hash] = await getDev();
    const { password } = req.body;

    const isValid = await bcrypt.compare(password, hash.pass);
    if (!isValid) {
        res.sendStatus(401);
        return;
    }

    const token = generateAccessToken({ name: "dev" });

    res.json({ token: token });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30min" });
}


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

 