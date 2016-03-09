var isProduction = (process.argv.indexOf('--production') !== -1);

var express = require('express'),
    app = express(),
    http = require('http'),
    httpServer = http.createServer(app),
    socketIO = require('socket.io').listen(httpServer);

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
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000 // = 14 days.
    }
}));

// Passport JS configuration
var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport/init');
initPassport(passport);

// Set rendering engine
app.set('view engine', 'ejs');

// Routes configuration
app.use('/api', require('./api')(passport, socketIO));

app.use('/public', express.static(__dirname + '/../public'));
// TODO: investigate what is wrong with JSPM's base URL.
// SystemJS seems to be looking for resources in /jspm_packages instead of
// /public/jspm_packages when bundled:
app.use('/jspm_packages', express.static(__dirname + '/../public/jspm_packages'));

app.get('*', function(req,res) {
    res.render(__dirname + '/../public/index.ejs', { production: isProduction });
});

// Start the server
httpServer.listen(3000, function () {
    console.log('UCI GUI listening on port 3000!');
});
