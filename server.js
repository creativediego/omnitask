//Dependencies
require('dotenv').config()
const express = require("express");
const app = express();
const db = require("./models");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");

//Middleware BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// For Passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: db.sequelize
    }),
    resave: false,
    proxy: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


//session variables
app.use(function(req, res, next) {

    res.locals.flashError = req.flash("error");
    res.locals.flashInfo = req.flash("info");
    res.locals.user = req.user;
    next();

});


//Routes
const authRouter = require("./routes/auth")(app, passport, db);
const forgotPasswordRouter = require("./routes/password")(app, passport, db);
const htmlRouter = require("./routes/html")(app, passport, db);
const apiRouter = require("./routes/api")(app, passport, db);




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