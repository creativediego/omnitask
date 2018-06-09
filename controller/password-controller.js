const db = require("../models");
require('dotenv').config()
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const crypto = require("crypto");
const bCrypt = require("bcrypt-nodejs");
const async = require("async");


//Renders password forgot page
module.exports.getForgot = function(req, res) {

    res.render("forgot");

}

//Renders password reset page if reset token is valid. Otherwise, the user is redirected to forgot page.
module.exports.getReset = function(req, res) {

    db.User.findOne({
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        }
    }).then(function(user) {
        if (!user) {
            // console.log("NOT FOUND")
            req.flash("error", "Password reset token is invalid or has expired.");
            return res.redirect("/forgot");
        }
        res.render("reset", {
            user: req.user
        });
    });
}


//Post request when a user enters his email address to receive a password reset link
module.exports.postForgot = function(req, res, next) {


    /*Runs an array of functions in series, each passing their results to the next in the array. 
    However, if any of the functions pass an error to the callback, the next function is not executed and the main callback is immediately called with the error.
    */
    async.waterfall([

            //Create a random string 
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    const token = buf.toString('hex');
                    done(err, token);
                });
            },

            function(token, done) {

                //Find user in the User model 
                db.User.findOne({ where: { email: req.body.email } }).then(function(user) {

                    //If user is not found
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgot');

                    }

                    //Save reset token and expiration time to the database
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save().then(() => {
                        done(null, token, user);
                    });
                }).catch((err) => { done(err) }); //Catch any errors and pass it to the async callback.
            },

            function(token, user, done) {

                //Set up email
                const transport = nodemailer.createTransport(
                    nodemailerSendgrid({
                        apiKey: process.env.SENDGRID_API_KEY
                    })
                );

                //Send email.
                transport.sendMail({
                        from: "doNotReply@omnitask.app",
                        to: user.email,
                        subject: "Reset password request",
                        html: "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                            "http://" + req.headers.host + "/reset/" + token + "\n\n" +
                            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
                    },
                    function(err) {
                        req.flash("info", "An e-mail has been sent to " + user.email + " with further instructions.");
                        done(err, "done");

                    });

            }



        ],
        function(err) {
            if (err) req.flash("error", "An error occured."); //return next(err);
            res.redirect("/forgot");

        })

}

//Middleware to validate a user's password when resetting
module.exports.validatePasswordReset = function(req, res, next) {

    req.checkBody("password", "Password must be at least 8 characters long, include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "i");
    req.checkBody("passwordMatch", "Passwords do not match. Please try again.").equals(req.body.password);

    const validationErrors = req.validationErrors();

    if (validationErrors) {
        console.log(validationErrors)
        req.flash("error", validationErrors[0].msg);
        return res.redirect("/reset/" + req.params.token + "");

    } else {
        next();
    }

}

//Post request that resets a user's password, sends a confirmation email, and redirects the user to the dashboard
module.exports.postReset = function(req, res, next) {

    //Async waterfall array of functions used to more elegantly handle callbacks and pass results to the next cb.
    async.waterfall([
        function(done) {

            //First, we add our hashed password generating function inside the callback function.
            const generateHash = function(password) {

                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

            };

            //Find the user in the database by the reset token, and make sure the token hasn't expired.
            db.User.findOne({
                    where: {
                        resetPasswordToken: req.params.token,
                        resetPasswordExpires: { $gt: Date.now() }
                    }
                })
                .then(function(user) {
                    if (!user) {
                        req.flash("error", "Password reset token is invalid or has expired.");
                        return res.redirect("/reset/" + req.params.token + "");
                    }

                    user.password = generateHash(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save().then(() => {
                        req.logIn(user, function(err) {
                            done(null, user);
                        });
                    }).catch((err) => { done(err) }); //Catch any errors and pass it to the async callback.
                });
        },

        function(user, done) {

            //Set up email.
            const transport = nodemailer.createTransport(
                nodemailerSendgrid({
                    apiKey: process.env.SENDGRID_API_KEY
                })
            );

            //Send email.
            transport.sendMail({
                    from: "doNotReply@omnitask.app",
                    to: user.email,
                    subject: "Your password has been reset",
                    html: "This is a confirmation that the password for your account " + user.email + " has just been changed.\n"
                },
                function(err) {
                    req.flash("info", "Success! Your password has been changed.");
                    done(err, "done");

                });

        }
    ], function(err) {

        if (err) req.flash("error", "An error occured."); //return next(err);
        res.redirect("/dashboard");


    });

}