const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const nodemailer = require("nodemailer");
const app = express();

// importing Models
const User = require('./models/User');
const Admin = require('./models/Admin');

mongoose.connect('mongodb://localhost:27017/sampleDB', {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(!err) console.log("Connected to DB");
        else res.send("Error occured in connecting with DB : " + err);
    });

// Express engine setup
app .set('view engine', 'ejs')
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static("public"));

// Mounting the routes
app.use('/', require('./routes/user'));
app.use('/', require('./routes/admin'));

app.get("/", (req, res) => {
    res.render("home");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});




