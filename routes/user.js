const express = require("express");
const routes = require('express');

const User = require('../models/User');

const app = express();

/* ************************************** Routes ************************************* */

app.route("/user")
    // desc : Renders home page
    .get((req, res) => {
        res.render("user-register");
    })

    // desc :  CREATE - Create a single user
    .post(async(req, res) => {
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

        console.log("hey", req.body);

        try {    
            User.findOne({email : email}, async(err, foundUser) => {
                if(!err) {

                    // check if user already registered.
                    if(foundUser){
                        res.send("User already registered with this email ID.!");
                    } else {
                        await newUser.save()
                        
                        res.send("User registered successfully.");
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
    .get(async(req, res) => {
        try {
            User.findOne({email : req.params.userEmail}, async(err, foundUser) => {
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
    .patch(async(req, res) => {
        try{
            User.findOne({email : req.params.userEmail}, async(err, foundUser) => {
                if(!err)
                    if(foundUser){
                        console.log(foundUser);
                        User.updateOne(
                            {email: req.params.userEmail}, 
                            {$set : req.body},
                            function(err){
                                if(!err){
                                    // req.flash('success', "Changes saved.!")
                                    res.send("Successfully updated");
                                } else {
                                    res.send(err);
                                }
                            }
                        );
                    } else {
                        // req.flash('error', "No user found.!")
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

    // desc : DELETE - Delete a single user entry from the User table
    .delete(async(req, res) => {
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
app.get("/users/findAll", async(req, res) => {

    User.find({}, (err, foundUser) => {
        res.send(foundUser);
    })
});


module.exports = app;