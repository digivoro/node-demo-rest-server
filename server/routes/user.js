const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../models/User");
const { verifyToken, verifyAdminRole } = require("../middlewares/auth");

const app = express();

// Get users
app.get("/user", [verifyToken, verifyAdminRole], (req, res) => {
  let skip = parseInt(req.query.skip) || 0;
  let limit = parseInt(req.query.limit) || 5;
  let filterObject = {
    state: true
  }; // Ej: {google: true}
  let requestedFields = "name email role state img"; // Se excluye 'google' por ej

  User.find(filterObject, requestedFields)
    .skip(skip)
    .limit(limit)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err.message
        });
      } else {
        // En el count() se ocupa la misma condicion de filtro que en el find() para que cuente la misma cantidad
        User.count(filterObject, (err, count) => {
          res.json({
            ok: true,
            users,
            totalUsers: count
          });
        });
      }
    });
});

// Create new user
app.post("/user", [verifyToken, verifyAdminRole], (req, res) => {
  let { name, email, password, img, role } = req.body;

  let user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role
  });

  user.save((err, userResponse) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err.message
      });
    } else {
      // user.password = null;

      return res.json({
        ok: true,
        user: userResponse
      });
    }
  });
});

// Update user information
app.put("/user/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  User.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
      runValidators: true
    },
    (err, userResponse) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err.message
        });
      } else {
        res.json({
          ok: true,
          user: userResponse
        });
      }
    }
  );
});

// Update user status
app.delete("/user/:id", [verifyToken, verifyAdminRole], (req, res) => {
  let { id } = req.params;

  // OPTION 1: Delete register
  // User.findByIdAndRemove(id, (err, deletedUser) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       error: err.message
  //     });
  //   } else if (!deletedUser) {
  //     return res.status(400).json({
  //       ok: false,
  //       error: "Usuario no encontrado."
  //     });
  //   } else {
  //     res.json({
  //       ok: true,
  //       deletedUser
  //     });
  //   }
  // });

  // OPTION 2: Mark user as deleted, keep register
  User.findByIdAndUpdate(
    id,
    {
      state: false
    },
    {
      new: true,
      runValidators: true
    },
    (err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err.message
        });
      } else {
        res.json({
          ok: true,
          updatedUser
        });
      }
    }
  );
});

module.exports = app;
