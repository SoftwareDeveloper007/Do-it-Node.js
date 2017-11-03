var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
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

router.route('/process/product').get(function(req, res){
    console.log('/process/product : Routing Function called');
    
    if(req.session.user){
        res.redirect('/public/product.html');
    }
    else {
        res.redirect('/public/login2.html')
    }
})


router.route('/process/setUserCookie').get(function(req, res){
    console.log('/process/setUserCookie : Routing function called');
    res.cookie('user', {
        id: 'mike',
        name: 'Girl Age',
        authorized: true
    });
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function(req, res){
    console.log('/process/showCookie : Routing function called');
    res.send(req.cookies);
    
});

app.use('/', router);

app.all('*', function(req, res){
    res.status(404).send('<h1>404 Page Not Found!</h1>')
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express Web Server : ' + app.get('port'));
});