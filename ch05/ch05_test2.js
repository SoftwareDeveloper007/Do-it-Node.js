var http = require('http');

var server = http.createServer();

var host = '10.64.17.126';
var port  = 3000;
server.listen(port, host, '50000', function() {
    console.log('Web server executed -> ' + host + ':' + port);
});

server.on('connection', function(socket){
    console.log('Client is connected!');
})

server.on('request', function(req, res){
    console.log('Client request is received');
    //console.dir(req);
    
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<h1>The response received from server</h1>');
    res.end();
})