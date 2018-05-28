const db = require("../models");
const authController = require("../controller/authcontroller");
const apiController = require("../controller/apicontroller");
const Recaptcha = require('express-recaptcha').Recaptcha;
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);
require('dotenv').config()


module.exports = function(app, passport) {


    app.get("/signup", recaptcha.middleware.render, authController.signup);

    app.get("/login", authController.login);


    //Passport sign up strategy route
    app.post("/signup", recaptcha.middleware.verify, authController.validateRecaptcha, authController.validateSignUp, passport.authenticate("local-signup", {

            successRedirect: "/dashboard",
            failureRedirect: "/signup",
            failureFlash: true

        }

    ));

    //Passport login strategy
    app.post("/login", passport.authenticate("local-signin", {

            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true

        },

    ));

    app.get('/logout', authController.logout);

};