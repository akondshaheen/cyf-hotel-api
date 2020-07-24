const express = require("express");
const app = express();
const { Pool } = require("pg");

app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_hotels",
  password: "Bird14",
  port: 5432,
});

app.get("/hotels", function (req, res) {
  pool.query("SELECT * FROM hotels WHERE rooms>10", (error, result) => {
    res.json(result.rows);
  });
});
