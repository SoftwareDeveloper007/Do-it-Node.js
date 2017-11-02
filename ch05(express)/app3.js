var express = require('express');

var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
    console.log('First Middleware is called.');
   
    req.user = 'mike';
    next();
    
    
});

app.use(function(req, res, next){
    console.log('Second Middleware is called.')
    res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
    res.end('<h1>Result from server : ' + req.user + '</h1>');
})

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express Web Server : ' + app.get('port'));
});