import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { getDev, insertToken, getToken, deleteToken } from "./database.js";

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
    const passText = req.body["password"];
    const hash = await bcrypt.hash(passText, 13);
    try {
        await insertDev(hash);
        
        const user = { name: "dev" }
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        await insertToken(refreshToken);

        res.send({
            message: "account created",
            redirect: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
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

    const user = { name: "dev" }
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    await insertToken(refreshToken);
    
    res.send({
        message: "logged in",
        redirect: true,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
});

app.post("/token", jsonParser, async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.sendStatus(401);

    const tokens = await getToken(refreshToken);
    if (tokens.length === 0) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: "dev" });
        res.send({ accessToken: accessToken });
    })
});

app.delete("/logout", async (req, res) => {
    const refreshToken = req.body.token;
    await deleteToken(refreshToken);
    res.sendStatus(204);
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

const port = 9090;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

 