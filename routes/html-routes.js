const db = require("../models");
const authController = require("../controller/authcontroller");
const htmlController = require("../controller/htmlcontroller");


module.exports = function(app, passport) {

    app.get("/", authController.isLoggedIn, htmlController.root)

    app.get("/dashboard", authController.isLoggedIn, htmlController.showDashboard);



}