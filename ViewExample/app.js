var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// Error Handler Module
var expressErrorHandler = require('express-error-handler');

var user = require('./routes/user');

var config = require('./config');

var database_loader = require('./database/database_loader');
var route_loader = require('./routes/route_loader');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

console.log('config.server_port _> ' + config.server_port);
app.set('port', config.server_port || 3000);

app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

route_loader.init(app, express.Router());

// 404 Error page
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express Web Server : ' + app.get('port'));
    database_loader.init(app, config);
});