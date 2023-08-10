/**
 * 
 * app.js is our application's entry point (after bin/www)
 * This is where we contain most general config, middleware, settings etc.
 * 
 */

// In this app we use ES5 importing/exporting style,
// however in the controller a few examples of ES6 importing / exporting are displayed
// To switch to ES6, the 'type':'module' declaration can be made in package.json

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var XMLRouter = require('./routes/XML'); // imports XML router

var app = express(); // initialize express app

require('./config/database/database') // connects to Database

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// routes
app.use('/', XMLRouter); // Attaching the / path with the XMLRouter

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
