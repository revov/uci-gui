var express = require('express');
var app = express();

// Database and ODM configuration
var dbConfig = require('./config/db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

//Session configuration
session = require('express-session');
MongoStore = require('connect-mongo')(session);
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'mySecret',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// Passport JS configuration
var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

var User = require('./models/user.js');
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Routes configuration
app.use('/api', require('./api'));

app.use('/public', express.static(__dirname + '/public'));

app.get('*', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(3000, function () {
    console.log('UCI GUI listening on port 3000!');
});
