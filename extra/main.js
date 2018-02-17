
var express = require("express");
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');

var session = require("express-session");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var cors = require('cors');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
});

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './img')
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload=multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        console.log('multer storage');
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg')
        {
            return callback(res.send('Only images are allowed'), null)
        }
        callback(null, true)
    }
}).single('profile');

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
});

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({    // to support URL-encoded bodies
    extended: true
}));

app.use(session({secret:'user',resave:true,saveUninitialized:true}));
//app.use(session({secret:'user'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

passport.serializeUser(function (user, done) {
    console.log('serialize');
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    console.log('deserialize '+id);
    connection.query("select * from sample", function (err, rows) {
        done(err, rows);
    });
});

passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    function ( email, password, done) {
        var sql = "SELECT * FROM sample WHERE email='" + email + "' and password='" + password + "'";
        connection.query(sql, function (err, rows) {
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false);
            }
            return done(null, rows);
        });
    })
);
app.get('/',(req,res)=>{

    res.send('root index');
});

app.get('/login',(req,res)=>{

    res.send('index');
});

app.post('/login',passport.authenticate('local-login',{
        failureRedirect:'/login',
    }),(req,res)=>{
        var ss=req.session.passport.user;
        console.log(ss);
        res.send(ss);
    }
);

app.post('/insert',upload,(req,res)=>{
    console.log('insert request call');

    var profile = req.file.filename;
    var a = 'insert into sample(name,email,password,profile,delete_flag) values("'+req.body.name+'","'+req.body.email+'","'+req.body.password+'","'+profile+'",0);';
    connection.query(a, function(err, rows, fields)
    {
        if (err) throw err;
        else{
            res.send({_id:rows.insertId});
        }
    });
});

// app.post('/login',(req,res)=>{
//     debugger;
//     console.log("login request call: post method");
//     connection.query('select * from sample where email="'+req.body.email+'" and password="'+req.body.password+'"',function (err,rows) {
//         if (err) throw err;
//         else{
//             console.log(rows);
//             res.send({"data":rows});
//         }
//     });
// });
//


app.get('/show', (req,res)=>{
    console.log('display request call');
    connection.query('SELECT * FROM sample where delete_flag=0',function (err,rows) {
        if(err)  throw  err;
        res.send(rows);
        console.log("data return");
    });
});

app.get('/fetchbyid/:id', (req,res)=>{
    var id=req.params.id;
    console.log('fetch by id request call');
    connection.query('SELECT * FROM sample where id='+id,function (err,rows) {
        if(err)  throw  err;
        res.send(rows);
        console.log("data return");
    });
});

app.post('/updatebyid/:id',/* upload ,*/ (req,res)=>{
    var id=req.params.id;
    console.log('update by id '+id+' request call');

    connection.query('update sample set name="'+req.body.name+'", email="'+req.body.email+'" where id='+id,function (err,rows) {
        if (err) throw err;
        else{
            res.send({"data":"success"});
        }
    });
});

app.post('/updateprofile/:id', upload , (req,res)=>{
    var id=req.params.id;

    var profile = req.file.filename;

    connection.query('update sample set profile="'+profile+'"  where id='+id,function (err,rows) {
        if (err) throw err;
        else{
            res.send({"data":"update profile successfully"});
        }
    });
});

app.delete('/delete/:id',(req,res)=>{
    var id=req.params.id;

    console.log('delete request call');

    connection.query('update sample set delete_flag=1 where id='+id, function(err, rows, fields)
    {
        if (err) throw err;
        else{
            res.send({"data":"success"});
        }
    });
});

app.post('/edit/:id',(res,req)=> {
    var id = req.params.id;

    console.log("update request call");

    connection.query("update sample set name='"+req.body.name+"' and email='"+req.body.email+"' where id="+id,function(err,rows)
    {
        if (err) throw err;
        else{
            res.send({"data":"success"});
        }
    });
});

app.listen(1212,()=>{
    console.log('server started on 1212 port');
});

