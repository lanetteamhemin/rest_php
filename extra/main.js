
var express = require("express");
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');


var app = express();

app.use(require('express-session')({secret:'keyboard',resave:true,saveUninitialized:true}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'lanetteam1',
    database : 'test'
});

passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    console.log('deserialize');
    connection.query("select * from sample where id="+id, function(err, rows) {
        done(err, rows);
    });
});
passport.use(new LocalStrategy((email,password,done) =>{
    console.log('start')
    var sql = "SELECT * FROM login WHERE email='"+email+"' and password='"+password+"'";
    console.log(sql);
    connection.query(sql,function(err, rows) {
        if (err)
            return done(err);
        if (!rows.length) {
            return done(null, false, {message: 'Wrong user'});
        }
        return done(null,rows);
    });
}));

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
});

app.get('/login',(req,res)=>{
   res.send('Valid');
});
app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),(req,res)=>{
    console.log("login");
    res.send({"success":"success"});
})

app.get('/show', (req,res)=>{
    console.log('display request call');
    connection.query('SELECT * FROM sample',function (err,rows) {
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

app.post('/updatebyid/:id', (req,res)=>{
    var id=req.params.id;

    console.log('update by id '+id+' request call');
    connection.query('update sample set name="'+req.body.name+'", email="'+req.body.email+'", password="'+req.body.password+'" where id='+id,function (err,rows) {
        if (err) throw err;
        else{
            res.send({"data":"success"});
        }
    });
});

app.post('/insert',(req,res)=>{
    console.log('insert request call');

    connection.query('insert into sample(name,email,password) values("'+req.body.name+'","'+req.body.email+'","'+req.body.password+'");', function(err, rows, fields)
    {
        if (err) throw err;
        else{
            res.send({"data":"success"});
        }
    });
});

app.delete('/delete/:id',(req,res)=>{
    var id=req.params.id;

    console.log('delete request call');

    connection.query('delete from sample where id='+id, function(err, rows, fields)
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
    })

});

app.listen(1212,()=>{
    console.log('server started on 1212 port');
});

