require('./config')({
  key: 'pinpoint',
  port: 3000,
  base: '/',
  development: {
    app: {
      url: 'localhost:3000'
    }
  },
  staging: {
    app: {
      url: 'localhost:3020'
    }
  }
})

var express = module.exports.express = require('express')
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require("fs");

var redis = require('redis');
var app = module.exports.app = express();
global.appserver = http.createServer(app);
global.io = require('socket.io').listen(global.appserver, {
  log: true
});
socket = io.sockets.on('connection', function(socket) {
  console.log('#### Socket.io Connected. Port 3000');
  return socket;
});
var mongoose = require('mongoose');
var Account = require('./models/account');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var holla = require('holla');

var routes = require('./routes/index');
var dashboard = require('./routes/dashboard');
var kijiji = require('./scrapers/kijiji');
var set = require('./scrapers/set');

var testapi = require('./api/testapi');
var ads = require('./api/ads');
var url = require('./api/url');
var general = require('./api/general');
var chat = require('./api/chat');

var router = express.Router();


// view engine setup
// app.set('port', process.env.PORT || 3000)
mongoose.set('debug', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: 'my secret',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 6000000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100', 'http://local.rocketu.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

/// Routes ///
app.use('/', routes);
app.use('/scrape/kijiji/', kijiji);
app.use('/set/', set);
app.use('/dashboard/', dashboard);

/// Apis ///
app.use('/api/', general);
app.use('/api/ads/', ads);
app.use('/api/url/', url);
app.use('/api/chat/', chat);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log("#### Pinpoint in development ####");
  console.log("Server listening to port 3000");
  console.log("Using dev database - 'pinpoint-dev'")
  appserver.listen(3000);
  mongoose.connect('mongodb://localhost:27017/pinpoint-dev');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;