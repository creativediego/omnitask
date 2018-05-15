//Express
const express = require("express");
const app = express();
const router = require("./routes/api-routes");

//Middleware for Express
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Public/Static folder
app.use(express.static("public"));

//Handlebars for templating
const exhbs = require("express-handlebars");

app.engine("handlebars", exhbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



//DB
const db = require("./models");

//Routes
app.use(router);

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {

        console.log("Your app is running on port" + PORT);

    });
});