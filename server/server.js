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
var sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: 'mySecret',
    store: new MongoStore(
        {
            mongooseConnection: mongoose.connection,
            ttl: 14 * 24 * 60 * 60 // = 14 days. Default
        }
    ),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000 // = 14 days.
    }
});
app.use(sessionMiddleware);

// Passport JS configuration
var passport = require('passport');
var passportMiddleware = passport.initialize();
var passportSessionMiddleware = passport.session();

app.use(passportMiddleware);
app.use(passportSessionMiddleware);

var initPassport = require('./passport/init');
initPassport(passport);

// Set up socket authorization
var socketioService = require('./services/socketio')(socketIO, sessionMiddleware, passportMiddleware, passportSessionMiddleware);
require('./apiSockets')(socketioService);

// Set rendering engine
app.set('view engine', 'ejs');

// Routes configuration
app.use('/api', require('./api')(passport, socketioService));

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
