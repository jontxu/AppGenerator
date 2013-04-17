/**
 * Module dependencies.
 */

var express = require('express'), 
	routes = require('./routes'),
	user = require('./routes/user'),
	http = require('http'),
	path = require('path'),
	assert = require('assert'),
	helmet = require('helmet'),
	form = require('express-form'),
	gm = require('googlemaps'),
	util = require('util'),
	field = form.field,
	app = express(),
	usersdb = require('./db/users'),
	eventsdb = require('./db/events'),
	appsdb = require('./db/apps'),
	pg = require('pg'),
	connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb',
	client = new pg.Client(connectionString),
	MemStore = express.session.MemoryStore,
	formerror = false,
	formerrortext = '';

client.connect();

app.configure(function(){
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
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
	res.render('newevent', {title : 'Add new event'});
});
app.get('/event/:id', function(req, res) {
	if (req.params.id) {
		eventsdb.getevent(req.session.user, req.params.id, function(eventRow) {
			if (eventRow == null)
				console.log("error getting user");
			else {
				res.method = 'GET';
				res.render('singleevent', {title : 'Event information', even: eventRow[0]});
				}
			});
	} else {
		res.redirect('back');
	}
});
app.get('/event/edit/:id', function(req, res) {
	if (req.params.id) {
		eventsdb.getevent(req.session.user, req.params.id, function(eventRow) {
			if (eventRow == null)
				console.log("error getting user");
			else {
				res.method = 'GET';
				res.render('event', {title : 'Editing event ' + eventRow[0].fullname, even: eventRow[0]});
				}
			});
	} else {
		res.redirect('back');
	}
});
app.get('/event/delete/:id', function(req, res) {
	if (req.params.id) {
		eventsdb.delete(req.params.id, req.session.user, function(usererror) {
				if (usererror) {
					console.log("error deleting event");
					res.redirect('back');
				} else if (usererror == null) {
					console.log('deleted event ' + req.params.id);
					res.redirect('back');
				}
			});
		} else {
			res.redirect('back');
		}
});
app.get('/app/settings/:id', function(req, res) {
	if (req.params.id) {
		eventsdb.geteventname(req.session.user, req.params.id, function(evento) {
			if (evento == null) {
				console.log("error getting user");
				res.redirect('back');
			} else {
				res.method = 'GET';
				console.log(evento);
				res.render('newapp', {title : 'App settings' , eventname: evento[0].fullname, appid: req.params.id });
			}
		});
	} else {
		res.redirect('back');
	}
});
app.get('/app/build/:id', function(req, res) {
	if (req.params.id) {
		eventsdb.geteventname(req.session.user, req.params.id, function(evento) {
			if (evento == null) {
				console.log("error getting user");
				res.redirect('back');
			} else {
				res.method = 'GET';
				console.log(evento);
				res.render('newapp', {title : 'App settings' , eventname: evento[0].fullname, appid: req.params.id });
			}
		});
	} else {
		res.redirect('back');
	}
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
		res.redirect('/applist/');
	} else if (is_admin == true) {
		req.session.role = "admin";
		res.redirect('/admin/');
		}
	});
});

app.post('/signup', 
	form(
    	field("username").trim().minLength(3).required().is(/^[A-z]+$/),
    	field("password").trim().required().is(/^[a-z]+$/),
    	field("email").trim().isEmail(),
    	field("realname").trim().minLength(3).required().is(/^[A-z]+$/),
    	field("org").trim().minLength(3).required().is(/^[A-z]+$/)
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
		   		usersdb.signup(req.body.username, req.body.password, req.body.email, req.body.realname, req.body.org, function(user) {
		    		if (user) {
		    			console.log('There has been an error while signing up');
		      			res.redirect('register');
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

app.post('/newevent', function(req, res) {
	var id = req.body.name.trim().toLowerCase(); //id is a slug for urls
	eventsdb.insert(id, req.body.descr, req.body.sdate, req.body.edate, req.body.location, req.session.user, req.body.name, function(events) {
	if (events) {
		 // May change in time
	      res.redirect('/event/new/');
	      console.log('Username or mail already taken');
	    }
	    else if (events == null) {
	      res.redirect('/applist/');
	    }
	});
	//TODO
	res.render();
});
app.post('/updateevent', function(req, res) {
	//TODO
	res.render();
});
app.post('/deleteevent', function(req, res) {
	//TODO
	res.render();
});
app.post('/edituser', function(req, res) {
	res.render('admin');
});
app.get('/addapp', function(req, res) {
	//TODO
	res.render();
});
app.get('/editapp', function(req, res) {
	//TODO
	res.render();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
