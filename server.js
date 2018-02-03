const conn=require('./db/database.js');
const express=require('express');
const bodyParser=require('body-parser');

const app=express();
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    //console.log('request get');
    conn.connect(function(err) {
        if (err) throw res.send(err);
        console.log("Connected!");
        var sql = "INSERT INTO sample (name) VALUES ('hemin')";
        con.query(sql, function (err, result) {
            if (err) throw res.send(err);
            console.log("1 record inserted");
        });
    });
    res.send('all is okay');
});

app.listen(3000,()=>{
    console.log('started on port 3000');

});

// var server = app.listen(3000, "127.0.0.1", function () {
//
//     var host = server.address().address
//     var port = server.address().port
//
//     console.log("Example app listening at http://%s:%s", host, port)
//
// });