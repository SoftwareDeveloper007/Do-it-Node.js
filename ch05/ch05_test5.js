var http = require('http');
var fs = require('fs');

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
    
    var filename = 'face.jpg';
    fs.readFile(filename, function(err, data){
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.write(data);
        res.end();    
    })
    
    
})