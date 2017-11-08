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

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('open', function () {
        console.log("Connected to database : " + databaseUrl);

        createUserSchema(database);
    });

    database.on('disconnected', function () {
        console.log("Database is disconnected.");
    });

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
}

function createUserSchema(database) {
    database.UserSchema = require('./database/user_schema').createSchema(mongoose);

    database.UserModel = mongoose.model('user3', database.UserSchema);

    console.log('UserModel is defined.');
}


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));


var router = express.Router();

router.route('/process/login').post();

router.route('/process/adduser').post();

router.route('/process/listuser').post();

app.use('/', router);

var authUser = function (db, id, password, callback) {
    console.log('authUser is called :' + id + ', ' + password);

    UserModel.findById(id, function (err, results) {
        if(err){
            callback(err, null);
            return;
        }

        console.log('Search result with id %s.');

        if(results.length > 0){
            var user = new UserModel({id: id});

            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);

            if(authenticated) {
                console.log('Password is correct.');
                callback(null, results);
            }
            else{
                console.log('Password is incorrect.');
                callback(null, null);
            }
        }
        else{
            console.log('No identified user.');
            callback(null, null);
        }
    });
};

var addUser = function (db, id, password, name, callback) {
    console.log('addUser is called :' + id + ', ' + password + ', ' + name);

    var user = new UserModel({"id": id, "password": password, "name": name});
    user.save(function (err) {
        if(err){
            call(err, null);
            return;
        }

        console.log("User data is added.");
        callback(null, user);

    });
};

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