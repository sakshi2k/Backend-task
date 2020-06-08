const express = require("express");
const app = express();

// Requiring Models
const User = require('../models/User');


/* ************************************** Routes ************************************* */

app.route("/user")
    // desc : Renders registration page
    .get((req, res) => {
        res.render("user-register");
    })

    // desc :  CREATE - Create a user
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

    // desc :  EDIT - Edits the details of a single user
    .patch(async(req, res) => {
        try{
            User.findOne({email : req.params.userEmail}, async(err, foundUser) => {
                if(!err)
                    if(foundUser){
                        User.updateOne(
                            {email: req.params.userEmail}, 
                            {$set : req.body},
                            function(err){
                                if(!err){
                                    return res.json({
                                        success : true,
                                        message :"Successfully updated"
                                    });
                                } else {
                                    return res.json({
                                        success : true,
                                        message : "ERROR occured while updating : " + err
                                    });
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

    // desc : DELETE - Deletes a single user entry from the User table
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

// desc : LIST - Lists all the users present in the User table
app.get("/users/findAll", async(req, res) => {

    User.find({}, (err, foundUser) => {
        res.send(foundUser);
    })
});

module.exports = app;