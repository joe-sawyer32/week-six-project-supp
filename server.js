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

// ROUTES
app.get("/", (req, res) => {
  console.log(req.session);
  res.render("index", {
    newUser: req.session.loginErr,
    user: req.session.user,
    oldFav: req.session.addFavErr
  });
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
        req.session.user = { id: foundUser.id, name: foundUser.userName };
      } else {
        req.session.loginErr = {
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
        req.session.user = { id: addedUser.id, name: addedUser };
      } else {
        res.status(500).send("Unable to add user");
      }
    });
  } else {
    console.log("Returning To Login");
  }
  delete req.session.loginErr;
  res.redirect("/");
});

app.get("/favorites", (req, res) => {
  models.favorites
    .findAll({ where: { userId: req.session.user.id } })
    .then(foundFavs => {
      if (foundFavs) {
        console.log(foundFavs);
        res.render("favorites", { user: req.session.user, favs: foundFavs });
      } else {
        res.render("favorites", {
          user: req.session.user,
          msg: "Unable to find favorite tracks for this user"
        });
      }
    });
});

app.post("/favorites", (req, res) => {
  var user = req.session.user;
  var addTrack = req.body;
  console.log("new track obj: ", addTrack);
  console.log("new track obj type: ", typeof addTrack);
  console.log("user id: ", user.id);
  if (addTrack) {
    // need validation for integer
    models.favorites
      .findOne({ where: { trackId: addTrack.id, userId: user.id } })
      .then(foundUser => {
        if (foundUser) {
          console.log(foundUser);
          req.session.addFavErr = {
            msg: "This track has already been added to your favorites"
          };
          res.redirect("/");
        } else {
          console.log("About to add");
          var newFav = models.favorites.build({
            trackId: addTrack.id,
            userId: user.id
          });
          console.log("new fav: ", newFav);
          newFav.save().then(addedFav => {
            if (addedFav) {
              delete req.session.addFavErr;
              res.redirect("/");
            } else {
              res.status(500).send("Unable to add favorite");
            }
          });
        }
      });
  }
});

app.listen(port, () => {
  console.log(`Spinning with express: Port ${port}`);
});
