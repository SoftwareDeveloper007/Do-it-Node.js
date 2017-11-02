var express = require('express');

var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
    console.log('First Middleware is called.');

    res.redirect('http://google.com');
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express Web Server : ' + app.get('port'));
});