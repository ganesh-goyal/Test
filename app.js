const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

// 🚨 Hardcoded secret
const SECRET_KEY = "my-super-secret-key";
const API_KEY = "SECRET-123";
// In-memory board
let board = Array(9).fill("");

// Home
app.get("/", (req, res) => {
  res.send("TicTacToe JS DevSecOps App Running");
});

// Move (no validation)
app.post("/move", (req, res) => {
  const { position, player } = req.body;

  if (board[position] === "") {
    board[position] = player;
    res.json(board);
  } else {
    res.status(400).send("Invalid move");
  }
});

// 🚨 Command Injection
app.get("/run", (req, res) => {
  const cmd = req.query.cmd;
  exec(cmd, (err, stdout) => {
    res.send(stdout);
  });
});

// 🚨 File Read (Path Traversal)
app.get("/read", (req, res) => {
  const file = req.query.file;
  const data = fs.readFileSync(file, "utf8");
  res.send(data);
});

// 🚨 Debug info leak
app.get("/debug", (req, res) => {
  res.json(process.env);
});

app.listen(3000, () => console.log("Server running on port 3000"));