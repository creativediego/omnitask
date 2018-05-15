const express = require("express");
const router = express.Router();
const db = require("../models");

//Home page route
router.get("/", function(req, res) {
    db.Task.findAll({}).then(function(dbTask) {
        res.render("index", { tasks: dbTask });

    });

});

router.delete("/api/tasks/delete/:id", function(req, res) {
    db.Task.destroy({
        where: {
            id: req.params.id
        }

    }).then(function(dbTask) {
        res.json(dbTask);
        // res.send(200);
        //res.redirect("/");
    });


});

router.post("/", function(req, res) {
    console.log(req.body)
    db.Task.create({
            title: req.body.task

        })
        .then(function(dbPost) {
            //res.json(dbPost);
            res.redirect("/");
        });


});

module.exports = router;