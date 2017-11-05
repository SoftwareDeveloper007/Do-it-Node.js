var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// Error Handler Module
var expressErrorHandler = require('express-error-handler');

// mongodb Module
var MongoClient = require('mongodb').MongoClient;

var database;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl, function (err, db) {
        if (err){
            console.log('Error happened when connecting to database.');
            return;
        }

        console.log('Connected to database : ' + databaseUrl);
        database = db;
    });
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

router.route('/process/login').post(function (req, res) {
    console.log('/process/login : Routing function is called');
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
                res.write("<h1>Can't not visit user database</h1>");
                res.end();
                return;
            }
        })
    }
});

router.route('/process/adduser').post(function (req, res) {
   console.log('/process/adduser : Routing function is called.');

   var paramId = req.body.id || req.query.id;
   var paramPassword = req.body.password || req.query.password;
   var paramName = req.body.name || req.query.name; 
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

var addUser = function (db, id, password, name, callback) {
  console.log('addUser is called :' + id + ', ' + password + ', ' + name);

  var users = db.collection('users');
  users.insertMany([{"id": id, "password": password, "name": name}], function (err, result) {
      if(err){
          callback(err, null);
          return;
      }

      if(result.insertedCount > 0){
          console.log("User is added : " + result.insertedCount);
          callback(null, result);
      }
      else {
          console.log("No added record.");
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