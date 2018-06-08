const passwordController = require("../controller/passwordController");



module.exports = function(app, passport, db) {

    app.get("/forgot", passwordController.getForgot);

    app.post("/forgot", passwordController.postForgot);

    app.get("/reset/:token", passwordController.getReset);

    app.post("/reset/:token", passwordController.validatePasswordReset, passwordController.postReset);

}