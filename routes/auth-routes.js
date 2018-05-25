const db = require("../models");
const authController = require("../controller/authcontroller");
const apiController = require("../controller/apicontroller");


module.exports = function(app, passport) {

    //Serve home page.
    app.get("/", authController.isLoggedIn, function(req, res) {

        res.render("dashboard");

    });

    app.get("/signup", authController.signup);

    app.get("/signin", authController.signin);

    app.get("/dashboard", authController.isLoggedIn, function(req, res) {
        //console.log("HELLO WORLD: ", req.user.email)
        db.Task.findAll({
            where: { UserId: req.user.id }
        }).then(function(dbTasks) {

            res.render("dashboard", { tasks: dbTasks });
            console.log(dbTasks)
                //res.json(dbTasks);

        });
    });

    //Create a task route
    //app.post("/dashboard", authController.isLoggedIn, apiController.createTask);

    //Passport sign up strategy route
    app.post("/signup", passport.authenticate("local-signup", {

            successRedirect: "/dashboard",
            failureRedirect: "/signup"

        }


    ));

    app.get('/logout', authController.logout);


    app.post("/signin", passport.authenticate("local-signin", {

            successRedirect: "/dashboard",
            failureRedirect: "/signin"


        },

    ));

    //Complete a task route
    app.put("/api/tasks/update/complete/:id", authController.isLoggedIn, apiController.completeTask);


};