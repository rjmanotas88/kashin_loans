var express = require('express');
var indexRouter = require('./routes/index');
var firstNetFilesRouter = require('./routes/firstNetFilesRoutes');

var app = express();
var bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/firstNetFiles', firstNetFilesRouter);
app.listen(3000);

module.exports = app;
