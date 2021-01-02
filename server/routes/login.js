const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const app = express();

// Routes
app.post("/login", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err.message
      });
    } else if (!foundUser) {
      return res.status(400).json({
        ok: false,
        error: "El usuario no existe o la contraseña está incorrecta."
      });
    } else if (!bcrypt.compareSync(password, foundUser.password)) {
      return res.status(400).json({
        ok: false,
        error: "El usuario no existe o la contraseña está incorrecta."
      });
    } else {
      let tokenPayload = {
        user: foundUser
      };
      let tokenSecret = "this-is-the-development-seed";
      let tokenOptions = {
        expiresIn: "30d"
      };

      let token = jwt.sign(tokenPayload, tokenSecret, tokenOptions);

      res.json({
        ok: true,
        user: foundUser,
        token
      });
    }
  });
});

module.exports = app;
