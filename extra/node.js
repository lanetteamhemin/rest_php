const connection = requ
var server = app.listen(3000, "127.0.0.1", function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});


//rest api to create a new record into mysql database
app.post('/employees', function (req, res) {
    var postData  = req.body;
    connection.query('INSERT INTO employee SET ?', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});