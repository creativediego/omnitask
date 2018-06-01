const db = require("../models");
require('dotenv').config()
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const crypto = require("crypto");
const async = require("async");




module.exports.getForgot = function(req, res) {

    res.render("forgot");

}

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
                        from: 'doNotReply@omnitask.app',
                        to: user.email,
                        subject: 'Reset password request',
                        html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    },
                    function(err) {
                        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                        done(err, 'done');

                    });

            }



        ],
        function(err) {
            if (err) req.flash('error', "An error occured."); //return next(err);
            res.redirect("/forgot");

        })
}