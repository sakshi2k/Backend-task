const express = require("express");
const randomString = require("randomstring");
const bodyParser = require("body-parser");

const Admin = require('../models/Admin');

const app = express();

app .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static("public"));

/* ************************************** Routes ************************************* */

app.route("/admin")

    // desc : Renders home page
    .get((req, res) => {
        res.render("admin-register");
    })

    // desc :  CREATE - Create an ADMIN User.
    .post(async(req, res) => {
    const {userName, caption, phoneNo, email, address, age, occupation} = req.body;


    console.log("hey", req.body);

    const newAdmin = new Admin({
        userName : userName,
        caption : caption, 
        phoneNo : phoneNo, 
        email : email, 
        address : address, 
        age : age, 
        occupation : occupation
    });

    try {    
        Admin.findOne({email : email}, async(err, foundUser) => {
            if(!err) {
                // check if user already registered.
                if(foundUser){
                    res.send("ADMIN already registered with this email ID.!");
                } else {

                    // Generate secret token
                    const secretToken = randomString.generate(16);

                    newAdmin.secretToken = secretToken;

                    await newAdmin.save();
                    // res.send("ADMIN registered successfully.");
                    res.send("Check your mail to Verify your account.");
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


// Desc : Verify Admin account via Secret Code
app.route("/admin/verify")
    .get((req, res) => {
        res.render("verify");
    })

    .post(async(req, res, next) => {
        try{
        const {secretToken, email} = req.body;

        // find the account that matches with the admin using email.
        Admin.findOne({email : email}, async(err, foundAdmin) => {
            if(!err){
                if(!foundAdmin) {
                    req.flash('error', "Admin not found")
                    req.redirect("/admin/verify");
                } else {
                    if(foundAdmin.secretToken === secretToken) {
                        foundAdmin.active = true;   // false by default
                        foundAdmin.secretToken = '';
                        foundAdmin.save();
                        res.send({
                            success : true,
                            message : "Congratulations, You are not registered.!"
                        }) 
                    } else {
                        // Wrong Secret Token
                        return res.json({
                            success : "false",
                            message : "Wrong Secret token"
                        });
                    }
                }
            }
        })
        }
        catch (err) {
            next(error);
        }
    });

module.exports = app;