const authController = require("../controller/auth-controller");
const htmlController = require("../controller/html-controller");


module.exports = function(app, passport, db) {

    app.get("/", authController.isLoggedIn, htmlController.root)

    app.get("/dashboard", authController.isLoggedIn, htmlController.showDashboard);



}