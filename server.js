//Express
require('dotenv').config()
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const developmentSettings = require("./development-settings");

//Middleware BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: developmentSettings.sessionSecret, resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//DB
const db = require("./models");

//Routes
const authRouter = require("./routes/auth-routes")(app, passport);
const htmlRouter = require("./routes/html-routes")(app, passport);
const apiRouter = require("./routes/api-routes")(app, passport);




//load passport strategies
require("./config/passport")(passport, db.User);


//Public/static folder
app.use(express.static("public"));

//Handlebars for templating
const exhbs = require("express-handlebars");

app.engine("handlebars", exhbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {

        console.log("Your app is running on port" + PORT);

    });
});