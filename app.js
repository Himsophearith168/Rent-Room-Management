require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var user = require("./routes/user")
var authRoute = require("./routes/authroute")
var room = require("./routes/roomroute")
var tenant = require("./routes/tenantroute")
var roomAssign = require("./routes/roomAssign")
var utility = require("./routes/utilityBillRoute")
var utilityMeter = require("./routes/utilityMeterRoute")
var utilityType = require("./routes/utilityTypeRoute")
var billDetail = require("./routes/billDetail")
var payment = require("./routes/payment")
var invoice = require("./routes/invoice")
var auth = require("./middlewares/auth")
var { seedAdmin } = require("./config/seeder");

seedAdmin();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', authRoute);


app.use(auth.isAdmin);
app.use('/users', user);
app.use('/room', room);
app.use('/tenant', tenant);
app.use('/roomAssign', roomAssign);
app.use('/utility', utility);
app.use('/utilityMeter', utilityMeter);
app.use('/utilityType', utilityType);
app.use('/billDetail', billDetail);
app.use('/payment', payment);
app.use('/invoice', invoice);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const status = err.status || 500;
  const acceptsJson = req.headers.accept && req.headers.accept.indexOf('application/json') !== -1;

  if (acceptsJson || req.xhr) {
    return res.status(status).json({
      success: false,
      message: err.message
    });
  }

  res.status(status);
  res.render('error');
});

module.exports = app;
