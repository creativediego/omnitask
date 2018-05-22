const authController = require("../controller/authcontroller");

module.exports = function(app, passport) {

    app.get("/signup", authController.signup);

    app.get("/signin", authController.signin);

    app.get("/dashboard", authController.dashboard);

    //Passport sign up strategy route
    app.post("/signup", passport.authenticate("local-signup", {

            successRedirect: "/dashboard",
            failureRedirect: "/signup"

        }


    ));


};