var express = require('express');
var cookieParser = require('cookie-parser');
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/userRouter');
var eventRouter = require('./routes/events/eventRouter')

var app = express();
app.use(cors());
// app.use(logger('dev'));
app.use(express.json());
app.use('/uploads',express.static('uploads'))
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs")
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/event', eventRouter);



module.exports = app;
