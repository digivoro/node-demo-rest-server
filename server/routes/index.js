const express = require("express");
const app = express();
const userRoutes = require("./user");
const loginRoutes = require("./login");

// Server routes
app.use(userRoutes);
app.use(loginRoutes);

module.exports = app;
