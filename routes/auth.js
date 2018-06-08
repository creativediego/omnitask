const authController = require("../controller/auth-controller");
const apiController = require("../controller/api-controller");
const Recaptcha = require('express-recaptcha').Recaptcha;
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);
require('dotenv').config()


module.exports = function(app, passport, db) {


    app.get("/signup", recaptcha.middleware.render, authController.signup);

    app.get("/login", authController.getLogin);


    //Passport sign up strategy route
    app.post("/signup", authController.validateSignUp, recaptcha.middleware.verify, authController.validateRecaptcha, passport.authenticate("local-signup", {

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