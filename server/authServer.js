import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { getDev, insertToken, getToken, deleteToken, insertDev } from "./database.js";

const app = express();
const jsonParser = bodyParser.json();

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

app.post("/signup", jsonParser, async (req, res) => {
    console.log("hi");
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

const port = 9090;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

 