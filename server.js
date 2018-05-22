//Express
const express = require("express");
const app = express();
const passport = require('passport')
const session = require('express-session')
const router = require("./routes/api-routes");
const authRouter = require("./routes/auth")(app);

//DB
const db = require("./models");

//Routes
app.use(router);


//Middleware for Express
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//load passport strategies
require("./config/passport")(passport, db.user);

//Public/Static folder
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