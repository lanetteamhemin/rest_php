var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lanetteam1",
    database: "test"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

