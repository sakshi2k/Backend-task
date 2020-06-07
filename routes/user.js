const express = require("express");
const routes = require('express');

const User = require('../models/User');

const app = express();

/* ************************************** Routes ************************************* */

// REST implementation at HOME ROUTE.
app.route("/")

    // desc : CREATE - Create a single user
    .get((req,res) => {    
    res.render("home");
    })

    // desc :  new User creation
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
                    res.status(200).json({ message: 'Connected!' });
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

// REST implementation at :userEmailId ROUTE.

app.route("/user/:userEmailId")

    .get((req, res) => {
        try {
            User.findOne({email : req.params.userEmailId}, (err, foundUser) => {
                if(!err){
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
    });

    // .post((req, res) => {

    // })

    // .delete((req, res) => {

    // })



module.exports = routes;