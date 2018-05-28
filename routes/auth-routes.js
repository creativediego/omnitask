const db = require("../models");
const authController = require("../controller/authcontroller");
const apiController = require("../controller/apicontroller");


module.exports = function(app, passport) {

    app.get("/signup", authController.signup);

    app.get("/login", authController.login);



    //Create a task route
    //app.post("/dashboard", authController.isLoggedIn, apiController.createTask);

    //Passport sign up strategy route
    app.post("/signup", function(req, res, next) {

        req.checkBody("name", "Name cannot be empty.").notEmpty();
        req.checkBody("email", "The email you entered is invalid. Try a valid email.").isEmail();
        req.checkBody("password", "Password must be at least 8 characters long, include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "i");
        req.checkBody("passwordMatch", "Passwords do not match. Please try again.").equals(req.body.password);

        const validationErrors = req.validationErrors();

        if (validationErrors) {
            res.render("signup", { errors: validationErrors })
        } else {
            next();
        }

    }, passport.authenticate("local-signup", {

            successRedirect: "/dashboard",
            failureRedirect: "/signup",
            failureFlash: true

        }


    ));

    app.get('/logout', authController.logout);


    app.post("/login", passport.authenticate("local-signin", {

            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true


        },

    ));

    //Complete a task route
    app.put("/api/tasks/update/complete/:id", authController.isLoggedIn, apiController.completeTask);


};