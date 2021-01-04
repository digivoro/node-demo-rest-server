require("./config");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");
const path = require("path");

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Enable public/ folder
app.use(express.static(path.resolve(__dirname, "../public")));

// Server routes
app.use(routes);

// MongoDB connection
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(process.env.DB_URI, connectionOptions, err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Conexión establecida con la base de datos.");
  }
});

// Server listen
app.listen(process.env.PORT, () => {
  console.log(`Escuchando el puerto ${process.env.PORT}`);
});
