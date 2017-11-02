var http = require('http');

var server = http.createServer();

var hostname = 'localhost';
var port  = 3000;
server.listen(port, function() {
    console.log('Web server executed : ' + port);
});