const authController = require("../controller/authController");
const htmlController = require("../controller/htmlController");


module.exports = function(app, passport, db) {

    app.get("/", authController.isLoggedIn, htmlController.root)

    app.get("/dashboard", authController.isLoggedIn, htmlController.showDashboard);



}