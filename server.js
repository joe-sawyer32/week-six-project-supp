// IMPORTS
const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const logger = require("morgan");
const path = require("path");

const app = express();
const port = process.env.port || 8080;

// SET VIEW ENGINE
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "/views"));

// MIDDLEWARE
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

// ROUTES
app.get("/", (req, res) => {
  res.send("Up and serving...");
});

app.listen(port, () => {
  console.log(`Spinning with express: Port ${port}`);
});
