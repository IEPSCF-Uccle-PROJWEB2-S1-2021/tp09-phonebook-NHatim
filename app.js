const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
<<<<<<< HEAD
const phoneRouter = require('./routes/phone');
const phoneApiRouter = require('./routes/phoneApi');
=======
const usersRouter = require('./routes/users');
>>>>>>> b0a3f029e64b9843d4a19fb53f337d4f005d1638

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
<<<<<<< HEAD
app.use('/phone', phoneRouter);
app.use('/api/phone', phoneApiRouter);
=======
app.use('/users', usersRouter);
>>>>>>> b0a3f029e64b9843d4a19fb53f337d4f005d1638

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  const status = err.status || 500;
  res.status(status);
  res.render('error', { title: `Error ${status}` });
});

module.exports = app;
