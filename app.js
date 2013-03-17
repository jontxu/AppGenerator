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

var usersdb = require('./db/users');
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

app.get('/admin', routes.admin);
app.get('/register', routes.reg);
app.get('/applist', routes.apps);
app.get('/', routes.index);
app.get('/users', user.list);


app.post('/login', function(req, res) {
	var urows = usersdb.getusers();
	usersdb.authenticate(req.body.username, req.body.password, function(is_admin) {
    	if (is_admin == null) {
    		res.redirect("/");
    	} else if (is_admin == false) {
      		console.log(!is_admin);
      		res.method = 'GET';
      		res.render('applist', {title: 'My apps & events'});
    	} else if (is_admin == true) {
    		//var urows = usersdb.getusers();
    		if (urows == []) {
    			res.redirect("/");
    		} else {
    			console.log("User rows: " + urows);
				res.method = 'GET';
				res.render('admin', {title: 'Test', rows: urows});    				
    		}
      	}
	});
});

app.post('/signup', function(req, res){
	if (req.body.password != req.body.password_confirm) {
	    console.log('Passwords don\'t match');
	    res.redirect('register');
	}
	else {
	   usersdb.signup(req.body.username, req.body.password, req.body.email, function(user) {
	    if (user) {
	      res.redirect('register');
	      console.log('Username or mail already taken');
	    }
	    else if (user == null) {
	      res.redirect('/');
	    }
	   });
	}
	   
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
