const authController = require("../controller/auth-controller");
const apiController = require("../controller/api-controller");


module.exports = function(app, passport, db) {

    //Serve home page.
    app.get("/", authController.isLoggedIn, function(req, res) {

        res.render("dashboard");

    });


    //Serve get requests for all tasks
    app.get("/api/tasks/all", authController.isLoggedIn, apiController.fetchTasks);

    //Create a task route
    app.post("/api/tasks/create", authController.isLoggedIn, apiController.createTask);


    //Complete a task route
    app.put("/api/tasks/update/complete/:id", authController.isLoggedIn, apiController.completeTask);


    //Delete a task route
    app.delete("/api/tasks/delete/:id", function(req, res) {
        db.Task.destroy({
            where: {
                id: req.params.id
            }

        }).then(function(dbTask) {
            res.json(dbTask);

        });


    });




};