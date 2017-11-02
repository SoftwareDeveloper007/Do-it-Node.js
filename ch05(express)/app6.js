var express = require('express');

var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
    console.log('First Middleware is called.');

    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;
    
    res.send('<h3>Response from server. User-Agent -> ' + userAgent + '</h3><h3>Param Name -> ' + paramName + '</h3>');
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express Web Server : ' + app.get('port'));
});