const db = require("../models");
//const request = require("request");
//require('dotenv').config()


module.exports.signup = function(req, res) {
    //console.log(res.recaptcha);

    res.render("signup", { captcha: res.recaptcha });

};

module.exports.getLogin = function(req, res) {

    res.render("login");

};

module.exports.dashboard = function(req, res) {

    res.render('index');

}

module.exports.logout = function(req, res) {

    req.session.destroy(function(err) {

        res.redirect("/login");

    });

}

//Middleware to protect dashboard route, passed in the get "/dashboard" route in this file.
module.exports.isLoggedIn = function(req, res, next) {

    if (req.isAuthenticated())

        return next();

    res.redirect("/login")

}

//Middleware to validate sign up form.
module.exports.validateSignUp = function(req, res, next) {

    req.checkBody("name", "Name cannot be empty.").notEmpty();
    req.checkBody("email", "The email you entered is invalid. Try a valid email.").isEmail();
    req.checkBody("password", "Password must be at least 8 characters long, include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "i");
    req.checkBody("passwordMatch", "Passwords do not match. Please try again.").equals(req.body.password);

    const validationErrors = req.validationErrors();

    if (validationErrors) {
        res.render("signup", { validationErrors: validationErrors, captcha: res.recaptcha });
    } else {
        next();
    }
}

//Middleware to check is reCaptcha has worked.
module.exports.validateRecaptcha = function(req, res, next) {

    //If captcha succeeds
    if (!req.recaptcha.error) {

        next();

    }
    //If the fails
    else {

        res.render("signup", { flashError: "Please select reCAPTCHA." });

    }

}