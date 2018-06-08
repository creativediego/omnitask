const db = require("../models");

module.exports.showDashboard = function(req, res) {

    db.Task.findAll({
        where: { UserId: req.user.id }
    }).then(function(dbTasks) {

        res.render("dashboard", { tasks: dbTasks });

    });


};

module.exports.root = function(req, res) {

    res.render("dashboard");

};