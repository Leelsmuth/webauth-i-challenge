const express = require("express");
const bcrypt = require("bcryptjs");

const Users = require("./users-model");

const router = express.Router();

router.post("/api/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 11);
  const newUser = {
    username: req.body.username,
    password: hash
  };

  Users.add(newUser)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // check if the provided password is correct
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function restricted(req, res, next) {
  // let's assume user & password
  const { username, password } = req.headers;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
}

router.get("/api/users", restricted, (req, res) => {
  // we don't know about sessions/cookies
  // we don't know about jwts
  // ?
  // WE NEED TO PROVIDE CREDENTIALS EVERY TIME ?????
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
