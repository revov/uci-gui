var express = require('express');
var app = express();

//common configuration
var bodyParser = require('body-parser');
app.use(bodyParser.json());

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
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    })
}));

// Passport JS configuration
var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport/init');
initPassport(passport);

// Routes configuration
app.use('/api', require('./api')(passport));

app.use('/public', express.static(__dirname + '/public'));

app.get('*', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(3000, function () {
    console.log('UCI GUI listening on port 3000!');
});
