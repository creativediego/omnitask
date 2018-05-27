const db = require("../models");
module.exports.signup = function(req, res) {

    res.render("signup");

};

module.exports.login = function(req, res) {

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