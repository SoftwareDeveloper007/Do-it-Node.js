var login = function (req, res) {
    console.log('/process/login : Routing function is called');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log("Request parameter : " + paramId + ', ' + paramPassword);

    if(database){
        authUser(database, paramId, paramPassword, function (err, docs) {
            if(err){
                console.log("Error happened.");
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write('<h1>Error happened</h1>');
                res.end();
                return;
            }

            if(docs){
                console.dir(docs);
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write('<h1>User login is succeeded</h1>');
                res.write('<div><p>User : ' + docs[0].name + '</p></div>')
                res.write('<br><br><a href="/public/login.html">Log in again</a> ');
                res.end();
                return;
            }
            else {
                console.log("Error happened.");
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write("<h1>Can't not visit user database</h1>");
                res.end();
                return;
            }
        })
    }
};

var adduser = function (req, res) {
    console.log('/process/adduser : Routing function is called.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log('Request Parameter : ' + paramId + ', ' + paramPassword + ', ' + paramName);

    if (database){
        addUser(database, paramId, paramPassword, paramName, function (err, result) {
            if(err){
                console.log("Error happened.");
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write('<h1>Error happened</h1>');
                res.end();
                return;
            }

            if(result){
                console.dir(result);
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write('<h1>User addition is succeeded</h1>');
                res.write('<div><p>User : ' + paramName + '</p></div>')
                res.end();
                return;
            }
            else {
                console.log("Error happened.");
                res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
                res.write("<h1>User is not added.</h1>");
                res.end();
                return;
            }
        });
    }
    else {
        console.log("Error happened.");
        res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
        res.write("<h1>Can't be connected to database</h1>");
        res.end();
        return;
    }
};

var listuser = function (req, res) {
    console.log('/process/listuser : Routing function is called.');

    if(database){
        UserModel.findAll(function (err, results) {
            if(err){
                console.log('Error happened.');
                res.writeHead(200, {'Content-Type': "text/html; charset=utf8"});
                res.write('<h1>Error happened</h1>');
                res.end();
                return;
            }

            if(results){
                console.dir(results);
                res.writeHead(200, {'Content-Type': "text/html; charset=utf8"});
                res.write("<h3>User List</h3>");
                res.write("<div><ul>");

                for (var i=0; i<results.length; i++){
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write("   <li>#" + i + " -> " + curId + ', ' + curName + "</li>");
                }

                res.write("</ul></div>");
                res.end();

            }
            else{
                console.log("Error happened.");
                res.writeHead(200, {'Content-Type': "text/html; charset=utf8"});
                res.write('<h1>No Visitors.</h1>');
                res.end();
            }
        });
    }
};

module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;