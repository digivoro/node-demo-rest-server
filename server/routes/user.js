const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const User = require("../models/User");

const app = express();

app.get("/user", (req, res) => {
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

app.post("/user", (req, res) => {
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

app.put("/user/:id", (req, res) => {
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

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;

  // OPCION 1: Eliminar registro
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

  // OPCION 2: Marcar usuario como eliminado, mantener registro
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
