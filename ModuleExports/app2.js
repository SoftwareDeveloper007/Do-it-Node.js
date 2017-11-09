var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// Error Handler Module
var expressErrorHandler = require('express-error-handler');

// mongoose Module
var mongoose = require('mongoose');

var user = require('./routes/user');

var config = require('./config');



var database;
var UserSchema;
var UserModel;


var app = express();

console.log('config.srever_port _> ' + config.server_port);
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


function connectDB() {

    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database = mongoose.connection;

    database.on('open', function () {
        console.log("Connected to database : " + databaseUrl);

        createUserSchema(database);
    });

    database.on('disconnected', function () {
        console.log("Database is disconnected.");
    });

    database.on('error', console.error.bind(console, 'mongoose connection error.'));

    app.set('database', database);
}

function createUserSchema(database) {
    database.UserSchema = require('./database/user_schema').createSchema(mongoose);

    database.UserModel = mongoose.model('user3', database.UserSchema);

    console.log('UserModel is defined.');
}

var router = express.Router();

router.route('/process/login').post(user.login);

router.route('/process/adduser').post(user.adduser);

router.route('/process/listuser').post(user.listuser);

app.use('/', router);


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
    connectDB();
});