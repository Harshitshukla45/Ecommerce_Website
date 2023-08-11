require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path'); // Import path module
require("./conn");
const Products = require("./pdSchema");
const DefaultData = require('./defaultData');
const cors = require("cors");
const router = require("./router");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));
// app.use(router);


app.use('/api', router);
const reactBuildPath = path.join(__dirname, 'build');
app.use(express.static(reactBuildPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
});


const port = process.env.PORT || 8005;
app.listen(port, function (err) {
    console.log("server listening at port 8005");
});

DefaultData();
