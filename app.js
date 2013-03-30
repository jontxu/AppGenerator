/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, assert = require('assert')
	, helmet = require('helmet')
	, form = require('express-form')
	, field = form.field
	, app = express()
	, usersdb = require('./db/users')
	, eventsdb = require('./db/events')
	, pg = require('pg')
  	, connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb'
	, client = new pg.Client(connectionString)
	, MemStore = express.session.MemoryStore
	, formerror = false
	, formerrortext = '';
client.connect();

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

app.locals({
 	scripts: [],
  	renderScriptsTags: function (all) {
    	app.locals.scripts = [];
    	if (all != undefined) {
    	  	return all.map(function(script) {
	    	    return '<script src="/javascripts/' + script + '"></script>';
      		}).join('\n ');
    	}
    	else {
      		return '<script src=""></script>';
    	}
  	},
  	getScripts: function(req, res) {
    	return scripts;
  	}
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
app.get('/applist', routes.apps);
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
app.get('/user/edit/:id', function(req, res) {
	//TODO
	if (req.params.id) {
		usersdb.getuser(req.params.id, function(userRow) {
			if (userRow == null)
				console.log("error getting user");
			else {
				for (var i = 0; i < userRow.length; i++)
					console.log(userRow[i].uname + ' ' + userRow[i].upass + ' ' + userRow[i].email);
				res.method = 'GET';
				res.render('user', {title : 'Editing page for ' + req.params.id, user: userRow[0]});
				}
			});
	} else {
		res.redirect('back');
	}
});

app.get('/user/delete/:id', function(req, res) {
	if (req.params.id) {
		usersdb.delete(req.params.id, function(usererror) {
				if (usererror) {
					console.log("error deleting user");
					res.redirect('back');
				} else if (usererror == null) {
					console.log('deleted user ' + req.params.id);
					res.redirect('back');
				}
			});
		} else {
			res.redirect('back');
		}
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
		req.session.role == "user";
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
		res.redirect('/admin/');
		}
	});
});

app.post('/signup', 
	form(
    	field("username").trim().minLength(3).required().is(/^[A-Z][a-z]+$/),
    	field("password").trim().required().is(/^[A-Z][a-z][0-9]+$/),
    	field("password_confirm").trim().required().is(/^[A-Z][a-z][0-9]+$/),
    	field("email").trim().isEmail()
 		),
   	function(req, res) {
   		if (!req.form.isValid) {
   			console.log(req.form.errors);
   			res.redirect('register');
   		}
   		else {
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
		}
	}
);

app.get('/logout', function(req, res) {
	req.session.user = null;
	req.session.role = null;
})

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
app.post('/edituser', function(req, res) {
	res.render('admin');
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
