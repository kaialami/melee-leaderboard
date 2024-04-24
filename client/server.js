import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://leejjon.medium.com/create-a-react-app-served-by-express-js-node-js-and-add-typescript-33705be3ceda
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
});

app.use(express.static(path.join(__dirname, "build")));

const port = process.env.PORT || 7070;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});





