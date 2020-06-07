const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const User = require('./models/User');

const app = express();

mongoose.connect('mongodb://localhost:27017/sampleDB', {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(!err) console.log("Connected to DB");
        else res.send("Error occured in connecting with DB : " + err);
    });

app .set('view engine', 'ejs')
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static("public"));

// Mounting the routes
// app .use('/', require('./routes/user'));

app.route("/")

    // desc : Renders home page
    .get((req,res) => {    
        res.render("home");
    })

    // desc :  CREATE - Create a single user
    .post((req, res) => {
        const {userName, caption, phoneNo, email, address, age, occupation} = req.body;

        const newUser = new User({
            userName : userName,
            caption : caption, 
            phoneNo : phoneNo, 
            email : email, 
            address : address, 
            age : age, 
            occupation : occupation
        });

        try {    
            User.findOne({email : email}, (err, foundUser) => {
                if(!err) {

                    // check if user already registered.
                    if(foundUser){
                        res.send("User already registered with this email ID.!");
                    } else {
                        newUser.save();
                        res.send("User registered successfully.");
                        // res.send(500,'showAlert') ;
                    }            
                }
            
            })   
        } catch (err) {
            return res.json({
                success: false,
                message: err
            })
        }

});


// desc : REST implementation at  ROUTE.
app.route("/user/:userEmail")

    // desc : GET - To get details of a single User
    .get((req, res) => {
        try {
            User.findOne({email : req.params.userEmail}, (err, foundUser) => {
                if(!err){
                    console.log("No error1");
                    if(foundUser){
                        return res.json({
                            success : true,
                            User : foundUser
                        });
                    } else { 
                        return res.json({
                            success : false,
                            message : "User not found"
                        });
                    }
                }
            });
        }
        catch (err) {
            return res.json({
                success : false,
                message : "Error : " + err
            });
        }
    })

    // desc :  EDIT - Edit the details of a single user
    .patch((req, res) => {
        try{
            User.findOne({email : req.params.userEmail}, (err, foundUser) => {
                if(!err)
                    if(foundUser){
                        console.log(foundUser);
                        User.updateOne(
                            {email: req.params.userEmail}, 
                            {$set : req.body},
                            function(err){
                                if(!err){
                                    res.send("Successfully updated");
                                } else {
                                    res.send(err);
                                }
                            }
                        );
                    } else {
                        res.send("User not found");
                    }
            });
        }
        catch (err){
            return res.json({
                success : false,
                message : "Error : " + err
            });
        }
    })

    // sesc : DELETE - Delete a single user entry from the User table
    .delete((req, res) => {
        try{
            User.deleteOne({email : req.params.userEmail}, (err) => {
                if(!err){
                    res.send("Successfully deleted : " + req.params.userEmail);
                } else {
                    res.send(err);
                }
            })
        } 
        catch (err){
            return res.json({
                success : false,
                message : "Error : " + err
            });
        }
    })



// desc : LIST - List all the users present in the User table
app.get("/users/findAll", (req, res) => {

    User.find({}, (err, foundUser) => {
        res.send(foundUser);
    })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});




