require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("./conn");
const Products = require("./pdSchema");
const DefaultData = require('./defaultData');
const cors = require("cors");
const router = require("./router");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser(""));
app.use("*", cors({
    origin: true,
    credentials: true
}));
app.use(router);

const port = process.env.PORT || 8005;


app.listen(port, function (err) {
    console.log("server listening at port 8005");
});

DefaultData();

