import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/goodbye", (req, res) => {
    res.send("goodbye");
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

