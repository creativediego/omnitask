const express = require("express");
const router = express.Router();
const db = require("../models");

//Serve home page.
router.get("/", function(req, res) {
    db.Task.findAll({}).then(function(dbTask) {
        res.render("index");

    });

});



//Create a task route
router.post("/", function(req, res) {
    console.log(req.body)
    db.Task.create({
            title: req.body.task

        })
        .then(function(dbTask) {
            res.redirect("/");
        });


});

//Serve get requests for all tasks
router.get("/api/tasks/all", function(req, res) {
    db.Task.findAll({}).then(function(dbTasks) {
        res.json(dbTasks);

    });

});

//Delete a task route
router.delete("/api/tasks/delete/:id", function(req, res) {
    db.Task.destroy({
        where: {
            id: req.params.id
        }

    }).then(function(dbTask) {
        res.json(dbTask);

    });


});



//Complete a task route
router.put("/api/tasks/update/complete/:id", function(req, res) {

    db.Task.update({
        completed: true

    }, {
        where: {
            id: req.params.id
        }

    }).then(function(dbTask) {
        res.json(dbTask)

    });
});

module.exports = router;