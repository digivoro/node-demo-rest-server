require("./config");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Routes
app.get("/usuario", (req, res) => {
  res.json("get usuario");
});

app.post("/usuario", (req, res) => {
  let body = req.body;

  if (!body.nombre) {
    res.status(400).json({
      ok: false,
      message: "El nombre es necesario"
    });
  } else {
    res.json({
      usuario: body
    });
  }
});

app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  res.json({
    id
  });
});

app.delete("/usuario", (req, res) => {
  res.json("delete usuario");
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando el puerto ${process.env.PORT}`);
});
