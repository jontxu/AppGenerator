/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var open = require('open');
var assert = require('assert');
var app = express();
var parseXlsx = require('excel');

var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/register', routes.reg);
app.get('/applist', routes.apps);
app.get('/', routes.index);
app.get('/users', user.list);


app.post('/applist', function(req, res){
	var query = client.query('SELECT "Name" FROM "User" WHERE "Pass" = $1',  [req.body.password]);
	console.log(query.toString());
	query.on('row', function(row) {
	  console.log('user "%s"', row.name);
	  res.render('applist', {title: 'Welcome, ' + req.body.username });
 	});

});

app.post('/login', function(req, res){
	if (req.body.password != req.body.password_confirm) 
	    res.redirect('register');
	else {
	  var query = client.query('INSERT INTO "User" ("Name", "Pass", email) VALUES ($1, $2, $3)', [req.body.username, req.body.password, req.body.email], function(err) {
	    if (err) {
	      res.redirect('register');
	      console.log('Username or mail already taken');
	    }
	    else {
	      res.render('index', {title: 'Log in'});
	    }
	  });
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
