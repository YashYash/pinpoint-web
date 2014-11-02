settings = require('./settings');
require('newrelic');
var express = module.exports.express = require('express');
var logfmt = require("logfmt");
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require("fs");

var redis = require('redis');
var app = module.exports.app = express();
var compressor = require('node-minify');
global.appserver = http.createServer(app);
global.io = require('socket.io').listen(global.appserver, {
  log: true
});
socket = io.sockets.on('connection', function(socket) {
  console.log('#### Socket.io Connected. Port ' + 3000);
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

mongoose.set('debug', true);
// app.use(logfmt.requestLogger());
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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100', 'http://local.rocketu.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/// Routes ///
app.use('/', routes);
app.use('/scrape/kijiji/', kijiji);
app.use('/generate/', set);
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

if (!process.env.NODE_ENV) {
  globalEnv = 'development';
  console.log("#### Pinpoint in development ####");
  console.log("Server listening to port " + 3000);
  console.log("Using dev database - 'pinpoint-dev'")
  appserver.listen(3000);
  // mongoose.connect('mongodb://pinpoint-founder:kobefederer1qaz@ds049170.mongolab.com:49170/pinpoint');
  mongoose.connect('mongodb://localhost:27017/pinpoint-dev');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

if (process.env.NODE_ENV === 'production') {
  globalEnv = 'production';
  console.log("#### Pinpoint in production ####");
  console.log("Server listening to port " + 3000);
  console.log("Using production database - 'pinpoint-dev'")
  appserver.listen(3000);
  mongoose.connect('mongodb://pinpoint-founder:kobefederer1qaz@ds049170.mongolab.com:49170/pinpoint');
  // mongoose.connect('mongodb://localhost:27017/pinpoint-dev');
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

app.use(express.static(__dirname + 'public'));
module.exports = app;
