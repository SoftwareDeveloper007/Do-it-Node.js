var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// mongodb 모듈 사용
var MongoClient = require('mongodb').MongoClient;

var database;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl, function (err, db) {
        if (err){
            console.log('데이터베이스 련결시 에러 발생함.');
            return;
        }

        console.log('데이터베이스에 련결됨 : ' + databaseUrl);
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