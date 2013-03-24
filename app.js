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
var helmet = require('helmet');
var app = express();

var usersdb = require('./db/users');
var eventsdb = require('./db/events');
var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();
var is_admin;
var MemStore = express.session.MemoryStore;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(helmet.xframe());
  app.use(helmet.iexss());
  app.use(helmet.contentTypeOptions());
  app.use(helmet.cacheControl());
  app.use(express.methodOverride());
  app.use(express.cookieParser('deustotechrules'));
  app.use(express.session({
    secret: "deustotech",
    cookie: {httpOnly: true},
    store: MemStore({reapInterval: 60000 * 10})
  }));
  app.use(express.csrf());
  app.use(function (req, res, next) {
    res.locals.token = req.session._csrf;
    next();
  });
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var requireRole = function(role) {
    return function(req, res, next) {
        if(req.session.user && req.session.role === role) 
            next();
        else 
        	res.send(403);
	}
};

var requireAuth = function() {
  return function(req, res, next) {
    if(req.session.user != null) {
      next();
    } else {
    	res.redirect('back');
    }
  }
};

app.all('/admin', requireRole("admin"));
/*
 * GET parts.
 * Some pages may have gets but are actually due to redirect issues (i.e, URL).
 */ 
app.get('/admin', routes.admin, requireRole("admin"));
app.get('/register', routes.reg);
app.get('/applist', routes.apps, requireAuth());
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/event/new/', function(req, res) {
	//TODO
	res.render();
});
app.get('/event/edit', function(req, res) {
	//TODO
	res.render();
});
app.get('/app/new/', function(req, res) {
	//TODO
	res.render();
});
app.get('/app/edit', function(req, res) {
	//TODO
	res.render();
});
app.get('/user/edit', function(req, res) {
	//TODO
	res.render();
});

/*
 * POST part
 * Some posts are database changes and such. 
 */
app.post('/login', function(req, res) {
	req.session.user = req.body.username;
	usersdb.authenticate(req.body.username, req.body.password, function(is_admin) {
	if (is_admin == null) {
		res.render('index', { title: 'Login' });
		req.session.user = null;
		res.redirect("/");
	} else if (is_admin == false) {
		eventsdb.getuserevents(req.body.username, function(eventRows){
			if (eventRows == null)
				console.log("Error getting events");
			else {
				res.method = 'GET';
				res.render('applist', {title: 'My apps & events', events: eventRows, username: req.body.username});		
			} 
		}); 
	} else if (is_admin == true) {
		req.session.role = "admin";
		res.redirect('/admin');
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

app.post('/event/new/', function(req, res) {
	eventsdb.insert(req.body.name, req.body.desc, req.body.startdate, req.body.enddate, req.body.location, req.body.username, function(events) {
	if (events) {
		 // May change in time
	      res.redirect('/event/new');
	      console.log('Username or mail already taken');
	    }
	    else if (events == null) {
	      res.redirect('/applist');
	    }
	});
	//TODO
	res.render();
});
app.post('/event/edit', function(req, res) {
	//TODO
	res.render();
});
app.post('/event/delete', function(req, res) {
	//TODO
	res.render();
});
app.post('/user/edit', function(req, res) {
	//TODO
	res.render();
});
app.get('/app/new/', function(req, res) {
	//TODO
	res.render();
});
app.get('/app/edit', function(req, res) {
	//TODO
	res.render();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
