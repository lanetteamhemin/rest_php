var express = require("express");
var app = express();
var path = require('path');

var bodyParser = require('body-parser');

var multer = require('multer');
var mysql = require('mysql');
var cors = require('cors');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
});

app.use(bodyParser());
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({    // to support URL-encoded bodies
    extended: true
}));
app.use(cors());

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './img')
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

// app.post('/api/file', function(req, res) {
//     var upload = multer({
//         storage: storage,
//         fileFilter: function(req, file, callback) {
//             var ext = path.extname(file.originalname)
//             if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//                 return callback(res.end('Only images are allowed'), null)
//             }
//             callback(null, true)
//         }
//     }).single('profile');
//     upload(req, res, function(err) {
//         res.end('File is uploaded');
//         connection.query("insert into image(profile) values('"+file.originalname+"')",(req,res)=>{
//
//         });
//
//     });
//
// })

var upload=multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg')
        {
            return callback(res.end('Only images are allowed'), null)
        }
        callback(null, true)
    }
}).single('profile');

app.post('/api/file',upload, function(req, res) {
    res.end('File is uploaded');

    var data = req.file.filename;

    var query = connection.query("Insert into image(profile) values('"+data+"')");
    if(query){
        console.log("Success");
    }
    else{
        console.log("Error");
    }
});

app.listen(1212,()=>{
    console.log('server started on 1212 port');
});
