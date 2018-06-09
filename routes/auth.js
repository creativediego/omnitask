const authController = require("../controller/auth-controller");
const apiController = require("../controller/api-controller");
const Recaptcha = require('express-recaptcha').Recaptcha;
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);
require('dotenv').config()

module.exports = function(app, passport, db) {

    app.get("/signup", recaptcha.middleware.render, authController.signup);

    app.get("/login", authController.getLogin);

    //Sign users up
    app.post("/signup",
        //Render recaptcha
        recaptcha.middleware.render,
        //Validate fields
        authController.validateSignUp,
        //Recaptcha validation middleware
        recaptcha.middleware.verify,
        //Validate recatpcha with previous middleware
        authController.validateRecaptcha,
        //Passport local sign up strategy
        passport.authenticate("local-signup", {

            successRedirect: "/dashboard",
            failureRedirect: "/signup",
            failureFlash: true
        }));

    //Passport login strategy
    app.post("/login", passport.authenticate("local-signin", {

        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true

    }, ));

    app.get('/logout', authController.logout);

};