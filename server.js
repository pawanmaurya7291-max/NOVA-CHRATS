const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Load DB
let db = {};
if (fs.existsSync("db.json")) {
    db = JSON.parse(fs.readFileSync("db.json"));
}

// Save DB
function saveDB() {
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}

// 🔑 Random Key Generator
function generateKey() {
    return "KEY-" + Math.random().toString(36).substr(2, 10).toUpperCase();
}

// 🔑 GET KEY API
app.post("/get-key", (req, res) => {
    const { deviceId } = req.body;

    if (!deviceId) {
        return res.json({ status: false, msg: "No deviceId" });
    }

    // One device = one key
    if (db[deviceId]) {
        return res.json({
            status: true,
            key: db[deviceId],
            old: true
        });
    }

    const newKey = generateKey();
    db[deviceId] = newKey;
    saveDB();

    res.json({
        status: true,
        key: newKey,
        old: false
    });
});

// 🔐 VERIFY API
app.post("/verify", (req, res) => {
    const { deviceId, key } = req.body;

    if (!deviceId || !key) {
        return res.json({ status: false });
    }

    if (db[deviceId] === key) {
        res.json({ status: true });
    } else {
        res.json({ status: false });
    }
});

// 🚀 START SERVER
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});