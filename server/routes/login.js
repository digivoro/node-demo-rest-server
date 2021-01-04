const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

// Server token config
let tokenSecret = process.env.TOKEN_SEED;
let tokenOptions = {
  expiresIn: "30d"
};

// Google token verification
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  });
  const { name, email, picture } = ticket.getPayload();
  return {
    name,
    email,
    img: picture,
    google: true
  };
}

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

      let token = jwt.sign(tokenPayload, tokenSecret, tokenOptions);

      res.json({
        ok: true,
        user: foundUser,
        token
      });
    }
  });
});

app.post("/google", async (req, res) => {
  let { idtoken } = req.body;

  try {
    let googleUser = await verify(idtoken);

    User.findOne({ email: googleUser.email }, (err, foundUser) => {
      let tokenPayload = {
        user: foundUser
      };

      if (err) {
        return res.status(500).json({
          ok: false,
          error: err.message
        });
      } else if (foundUser) {
        if (foundUser.google === false) {
          return res.status(400).json({
            ok: false,
            error: "Use normal authentication."
          });
        } else {
          let token = jwt.sign(tokenPayload, tokenSecret, tokenOptions);

          return res.json({
            ok: true,
            user: foundUser,
            token
          });
        }
      } else {
        // User is not found, create new
        let user = new User();
        user.name = googleUser.name;
        user.email = googleUser.email;
        user.img = googleUser.img;
        user.password = ":)"; // Just to pass DB validation
        user.google = true;

        user.save((err, savedUser) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              error: err.message
            });
          } else {
            let token = jwt.sign(tokenPayload, tokenSecret, tokenOptions);

            return res.json({
              ok: true,
              user: foundUser,
              token
            });
          }
        });
      }
    });
  } catch (error) {
    return res.status(403).json({
      ok: false,
      error
    });
  }
});

module.exports = app;
