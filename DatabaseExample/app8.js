var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// Error Handler Module
var expressErrorHandler = require('express-error-handler');

var mysql = require('mysql');

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

router.route('/process/login').post(function (req, res) {
    console.log('/process/login : Routing function is called.');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log("Request parameter : " + paramId + ', ' + paramPassword);

    if(database){
        authUser(database, paramId, paramPassword, function (err, docs) {
            if(err){
                console.log("Error happened.");
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write('<h1>Error happened</h1>');
                res.end();
                return;
            }

            if(docs){
                console.dir(docs);
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write('<h1>User login is succeeded</h1>');
                res.write('<div><p>User : ' + docs[0].name + '</p></div>')
                res.write('<br><br><a href="/public/login.html">Log in again</a> ');
                res.end();
                return;
            }
            else {
                console.log("Error happened.");
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write("<h1>Can't visit user database</h1>");
                res.end();
                return;
            }
        })
    }
});

app.use('/', router);

var authUser = function (db, id, password, callback) {
    console.log('authUser is called :' + id + ', ' + password);
    var users = db.collection('users');
    users.find({"id": id, "password": password}).toArray(function (err, docs) {
        if(err){
            callback(err, null);
            return;
        }
        if(docs.length > 0){
            console.log("Identified User is found");
            callback(null, docs);
        }
        else {
            console.log("Identified User is not found.");
            callback(null, null);
        }
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