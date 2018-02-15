var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'mysql.eecs.oregonstate.edu',
    user            : 'cs290_gluckmad',
    password        : '5874',
    database        : 'cs290_gluckmad'
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({secret: 'SecretPassCode'}));

//var credentials = require('./credentials.js');

var request = require('request');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 34443);
app.use(express.static('public'));

app.get('/', function(req,res,next){
   res.render('home'); 
});

app.get('/insert',function(req,res,next){
  var context = {};
  pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.send(context);
  });
});

app.get('/delete',function(req,res,next){
  var context = {};
  pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
      res.send(null);
  });
});

app.get('/update', function(req,res,next) {
    var context = {};
    pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context = JSON.stringify(rows);
        console.log(context);
        res.render('update', context);
    });
});


app.get('/update-row', function(req,res,next) {
    console.log('In update-row');
 var context = {};
  pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home');
  });
});


app.get('/populate', function(req,res,next) {
    console.log('In populate');
    var context = {};
    pool.query("SELECT * FROM workouts", function(err, rows, fields) {
       if(err) {
           next(err);
           return;
       }
        context = JSON.stringify(rows);
        console.log('JSON response:' + context);
        res.send(context);
    });
});


app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});