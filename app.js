
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
var pg = require('pg');

var client = new pg.Client("postgres://postgres:tistisquare@localhost/testdb");
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

app.post('/applist', function(req, res)	 {
	var query = client.query("SELECT 'nombre' FROM 'usuario' WHERE 'contra' = $1",  [req.body.password]);
	console.log(query.toString());
	query.on('row', function(row) {
    	console.log('user "%s"', row.nombre);
 	});
	res.render('applist', {title: 'Welcome, ' + req.body.username });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  open('http://localhost:' + app.get('port'));
});
