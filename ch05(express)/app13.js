var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var multer = require('multer');
var fs = require('fs');
var cors = require('cors');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, res, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        //callback(null, file.originalname + Date.now());
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null, basename + Date.now() + extension);
    }
});

var upload = multer({
   storage: storage,
   limits: {
       files: 10,
       fileSize: 1024*1024*1024
   }
});

var router = express.Router();

router.route('/process/product').get(function (req, res) {
    console.log('/process/product : Routing Function called');

    if (req.session.user) {
        res.redirect('/public/product.html');
    }
    else {
        res.redirect('/public/login2.html')
    }
})

router.route('/process/login').post(function (req, res) {
    console.log('/process/login : Routing Function called!');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('Request Parameter: ' + paramId + ', ' + paramPassword);

    if (req.session.user) {
        console.log('Already logged in');
        res.redirect('/public/product.html');
    }
    else {
        req.session.user = {
            id: paramId,
            name: 'Girls Age',
            authorized: true
        };

        res.writeHead(200, {"Content-Type": "text/html; charset=utf8"})
        res.write('<h1>Logged in successfully</h1>');
        res.write('<p>Id :' + paramId + '</p>');
        res.write('<br><br><a href="/process/product">Move to product page</a>');
        res.end();
    }
});

router.route('/process/logout').get(function (req, res) {
    console.log('/process/logout : Routing Function is called');

    if (req.session.user) {
        console.log('Log out');
        req.session.destroy(function (err) {
            if (err) {
                console.log('Error happened when session is deleted');
                return;
            }

            console.log('Session is deleted successfully');
            res.redirect('/public/login2.html');

        });
    }
    else {
        console.log('Not logged in');
        res.redirect('/public/login2.html');
    }
});


router.route('/process/setUserCookie').get(function (req, res) {
    console.log('/process/setUserCookie : Routing function called');
    res.cookie('user', {
        id: 'mike',
        name: 'Girl Age',
        authorized: true
    });
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function (req, res) {
    console.log('/process/showCookie : Routing function called');
    res.send(req.cookies);

});

app.use('/', router);

app.all('*', function (req, res) {
    res.status(404).send('<h1>404 Page Not Found!</h1>')
});

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express Web Server : ' + app.get('port'));
});