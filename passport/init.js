var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Set up login strategy
    passport.use(
        'login',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({ email: email }, function(mongoError, user) {
                if (mongoError) {
                    console.log('Database error:' + mongoError);
                    return done(mongoError);
                }
                if (!user) {
                    return done( null, false, { message: 'User not found.' } );
                }

                if(!user.isValidPassword(password)) {
                    return done( null, false, { message: 'Invalid password.' } );
                }

                return done(null, user);
            });
        })
    );
    
    // Set up registration strategy
    passport.use(
        'register',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            function(email, password, done) {
                findOrCreateUser = function(){
                    // find a user in Mongo with provided email
                    User.findOne({ email :  email }, function(err, user) {
                        // In case of any error, return using the done method
                        if (err){
                            console.log('Error in SignUp: '+err);
                            return done(err);
                        }
                        // already exists
                        if (user) {
                            console.log('User already exists with username: '+email);
                            return done(null, false, {message: 'User Already Exists'});
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new User();

                            // set the user's local credentials
                            newUser.email = email;
                            newUser.setPassword(password);

                            // save the user
                            newUser.save(function(err) {
                                if (err){
                                    console.log('Error in Saving user: '+err);
                                    throw err;
                                }
                                console.log('User Registration succesful');
                                return done(null, newUser);
                            });
                        }
                    });
                };

                // Delay the execution of findOrCreateUser and execute the method
                // in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            }
        )
    );
};