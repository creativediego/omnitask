const db = require("../models");

module.exports.fetchTasks = function(req, res) {
  db.Task.findAll({
    where: { UserId: req.user.id }
  }).then(function(dbTasks) {
    res.json(dbTasks);
  });
};

module.exports.completeTask = function(req, res) {
  db.Task.update(
    {
      completed: true
    },
    {
      where: {
        id: req.params.id
        //UserId: req.user.id
      }
    }
  ).then(function(dbTask) {
    res.json(dbTask);
  });
};

module.exports.createTask = function(req, res) {
  db.Task.create({
    title: req.body.task,
    UserId: req.user.id
  }).then(function(dbTask) {
    res.redirect("/dashboard");
  });
};
