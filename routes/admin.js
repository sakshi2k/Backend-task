const express = require("express");
const randomString = require("randomstring");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer"); 

const Admin = require('../models/Admin');
const User = require('../models/User');

const app = express();

app .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static("public"));

let unauthenticatedUsers = [];
/* ************************************** Routes ************************************* */

app.route("/admin")

    // desc : Renders home page
    .get((req, res) => {
        res.render("admin-register");
    })

    // desc :  CREATE - Create an ADMIN User.
    .post(async(req, res) => {
    const {userName, caption, phoneNo, email, address, age, occupation} = req.body;

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
        // create admin with unique email.
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

                    // sending token through mail - NODE-MAILER

                    const message = "Your secret Code is : " + secretToken;

                    let testAccount = await nodemailer.createTestAccount();

                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                      host: "smtp.ethereal.email",
                      port: 587,
                      secure: false, // true for 465, false for other ports
                      auth: {
                        user: testAccount.user, // generated ethereal user
                        pass: testAccount.pass, // generated ethereal password
                      },
                    });
                  
                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                      from: '"Fred Foo 👻" <foo@example.com>', // sender address
                                                //   to: newAdmin.email, // list of receivers
                      to: newAdmin.email, // list of receivers
                      subject: "Your One time Secret Token", // Subject line
                      text: message, // plain text body
                      html: message, // html body
                    });
                  
                    console.log("Message sent: %s", info.messageId);
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                    return res.json({
                        success : true,
                        message : "Check your mail to Verify your account",
                        // for testingPurpose only
                        testingPurposeOnly: "OR visit" + nodemailer.getTestMessageUrl(info)                    
                    });
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


// desc : Verify Admin account via Secret Code
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
                    res.send({
                        success : false,
                        message : "Admin not found!"
                    })
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

// desc : authenticate new users
app.route("/admin/authenticateUsers")

    .get((req, res) => {

        unauthenticatedUsers = [""];
        User.find({isAuthenticated : "false"}, (err, foundUser) => {
            
            
            foundUser.forEach(function(user) {
                unauthenticatedUsers.push(user);
                // console.log(user.userName);
                // console.log(unauthenticatedUsers[1], unauthenticatedUsers[2], unauthenticatedUsers[3]);
            })
        })
        res.render("authenticateUsers", {users : unauthenticatedUsers });
    });
    // .post();

module.exports = app;