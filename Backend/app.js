const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


// Routes
app.use("/api/auth", require("./Routes/auth.routes"));
app.use("/api/user", require("./Routes/user.routes"));

module.exports = app;
