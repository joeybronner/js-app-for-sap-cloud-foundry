
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cfenv = require('cfenv');

var app = express();
var oAppEnv = cfenv.getAppEnv();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// connection to mongodb
require('./server/db/mongo-connect.js')(oAppEnv);

// api
require ('./server/api/info/info.js')(app, oAppEnv);
require ('./server/api/messages/messages.js')(app);

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
