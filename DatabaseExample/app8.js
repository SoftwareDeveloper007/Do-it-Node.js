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

var pool = mysql.createPool({
   connectionLimit: 10,
   host: 'localhost',
   user: 'root',
   password: 'passion1989',
   database: 'test',
   debug: false
});

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

router.route('/process/adduser').post(function (req, res) {
   console.log('/process/adduser : Routing function is called.');

   var paramId = req.body.id || req.query.id;
   var paramPassword = req.body.password || req.query.password;
   var paramName = req.body.name || req.query.name;
   var paramAge = req.body.age || req.query.age;

   console.log('Request parameter : ' + paramId + ', ' + paramPassword + ', ' + paramName + ', ' + paramAge);

   addUser(paramId, paramName, paramPassword, paramAge, function (err, addedUser) {
       if(err){
           console.log("Error happened.");
           res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
           res.write('<h1>Error happened</h1>');
           res.end();
           return;
       }

       if(addedUser){
           console.dir(addedUser);
           res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
           res.write('<h1>User is added successfully</h1>');
           res.end();
           return;
       }
       else{
           console.log("Error happened.");
           res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
           res.write("<h1>Failed to add user.</h1>");
           res.end();
           return;
       }
   });
});

router.route('/process/login').post(function (req, res) {
    console.log('/process/login : Routing function is called.');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log("Request parameter : " + paramId + ', ' + paramPassword);


    authUser(paramId, paramPassword, function (err, rows) {
        if(err){
            console.log("Error happened.");
            res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
            res.write('<h1>Error happened</h1>');
            res.end();
            return;
        }

        if(rows){
            console.dir(rows);
            res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
            res.write('<h1>User login is succeeded</h1>');
            res.write('<div><p>User : ' + rows[0].name + '</p></div>')
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

});

app.use('/', router);

var addUser = function (id, name, password, age, callback) {
    console.log('addUser is called.');
    pool.getConnection(function (err, conn) {
        if(err){
            if(conn){
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log("Database connection's thread id : " + conn.threadId);

        var data = {id: id, name: name, password: password, age: age};
        var exec = conn.query('insert into users set ?', data, function (err, result) {
            conn.release();
            console.log('Executed SQL : ' + exec.sql);

            if(err){
                console.log('Error happened in SQL run.');
                callback(err, null);
                return;
            }

            callback(null, result);

        });
    });
};

var authUser = function (id, password, callback) {
    console.log('authUser is called :' + id + ', ' + password);

    pool.getConnection(function (err, conn) {
       if(err){
           if(conn){
               conn.release();
           }

           callback(err, null);
       }

       console.log("Database connection's thread id : " + conn.threadId);

       var tablename = 'users';
       var columns = ['id', 'name', 'age'];
       var exec = conn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function (err, rows) {
          conn.release();
          console.log('Executed SQL : ' + exec.sql);
          if(err){
              callback(err, null);
              return;
          }

          if(rows.length > 0){
              console.log("User is found.");
              callback(null, rows);
          }
          else {
              console.log("User is not found.");
              callback(null, null);
          }
       });
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
});