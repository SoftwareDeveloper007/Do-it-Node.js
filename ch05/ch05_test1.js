var http = require('http');

var server = http.createServer();

var hostname = '10.64.17.126';
var port  = 3000;
server.listen(port, host, '50000', function() {
    console.log('Web server executed -> ' + host + ':' + port);
});