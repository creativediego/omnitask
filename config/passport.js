 const bCrypt = require("bcrypt-nodejs");

 ///Inside this block, we initialize the passport-local strategy, and the user model, which will be passed as an argument
 module.exports = function(passport, user) {

     const User = user;
     const LocalStrategy = require("passport-local").Strategy;

     passport.serializeUser(function(user, done) {

         done(null, user.id);
     });

     /*In the deserialize function above, we use the Sequelize findById promise to get the user, and if successful, an instance of the Sequelize model is returned. 
     To get the User object from this instance, we use the Sequelize getter function user.get().*/

     passport.deserializeUser(function(id, done) {

         User.findById(id).then(function(user) {

             if (user) {
                 done(null, user.get());
             } else {
                 done(user.errors, null);
             }

         });

     });

     //Then we define our custom strategy with our instance of the LocalStrategy
     passport.use("local-signup", new LocalStrategy(

         {
             usernameField: "email",
             passwordField: "password",
             passReqToCallback: true // allows us to pass back the entire request to the callback
         },

         /*Now we have declared what request (req) fields our usernameField and passwordField (passport variables) are. 
         The last variable passReqToCallback allows us to pass the entire request to the callback, which is particularly useful for signing up.
         After the last comma, we add this callback function.*/

         function(req, email, password, done) {

             //In this function, we will handle storing a user's details.

             //First, we add our hashed password generating function inside the callback function.
             const generateHash = function(password) {

                 return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

             };

             // Then, using the Sequelize user model we initialized earlier as User, 
             // we check to see if the user already exists, and if not we add them.

             User.findOne({
                 where: {
                     email: email
                 }
             }).then(function(user) {

                 if (user)

                 {
                     return done(null, false, {
                         message: "The email you entered is already taken."
                     });

                 } else {

                     const userPassword = generateHash(password);

                     const data = {

                         email: email,
                         password: userPassword,
                         name: req.body.name
                             /*
                             firstname: req.body.firstname,
                             lastname: req.body.lastname
                             */
                     };

                     //User.create() is a Sequelize method for adding new entries to the database. 
                     //Notice that the values in the data object are gotten from the req.body object which contains the input from our signup form. 

                     User.create(data).then(function(newUser, created) {

                         if (!newUser) {

                             return done(null, false);
                         }

                         if (newUser) {

                             return done(null, newUser);
                         }

                     });

                 }

             });

         }

     ));



 }