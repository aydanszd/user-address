const express = require("express");
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes");
const addressRoutes = require("./src/routes/adressRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);

app.get("/", (req, res) => {
    res.send("OK!");
});

module.exports = app;