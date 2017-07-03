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
const sessionConfig = require(path.join(__dirname, "sessionConfig"));
const models = require("./models");

// SET VIEW ENGINE
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "/views"));

// MIDDLEWARE
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));
app.use(logger("dev"));
function createUserSess(userName) {
  console.log("Made it to create user session for: ", userName);
  req.session.user = userName;
}

// ROUTES
app.get("/", (req, res) => {
  console.log(req.session);
  res.render("index", { newUser: req.session.error, user: req.session.user });
});

app.post("/login", (req, res) => {
  var requestingUserName = req.body.username;
  console.log("request body: ", req.body);
  console.log("requesting user: ", requestingUserName);
  models.users
    .findOne({ where: { userName: requestingUserName } })
    .then(foundUser => {
      if (foundUser) {
        console.log(foundUser);
        req.session.user = foundUser.userName; // what to do with the found user as a promise ???
      } else {
        req.session.error = {
          msg: "Invalid username. Would you like to create this username?",
          user: requestingUserName
        };
      }
      res.redirect("/");
    });
});

app.post("/users", (req, res) => {
  var addUser = req.body.adduser;
  console.log(addUser);
  if (addUser) {
    console.log("Inside to add a new user");
    var newUser = models.users.build({ userName: addUser });
    console.log("new user: ", newUser);
    newUser.save().then(addedUser => {
      if (addedUser) {
        req.session.user = addedUser;
      } else {
        res.status(500).send(error);
      }
    });
  } else {
    console.log("Returning To Login");
  }
  delete req.session.error;
  res.redirect("/");
});

app.get("/favorites", (req, res) => {
  res.render("favorites");
});

app.post("/favorites", (req, res) => {});

app.listen(port, () => {
  console.log(`Spinning with express: Port ${port}`);
});
