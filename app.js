/**
 * Module dependencies.
 */

var express = require('express'), 
	routes = require('./routes'),
	user = require('./routes/user'),
	events = require('./routes/event'),
	apps = require('./routes/apps'),
	http = require('http'),
	path = require('path'),
	assert = require('assert'),
	helmet = require('helmet'),
	form = require('express-form'),
	field = form.field,
	app = express(),
	MemStore = express.session.MemoryStore,
	formerror = false,
	formerrortext = '';


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
  user: "",
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

var requireRole = function(role) {
    return function(req, res, next) {
        if(req.session.user && req.session.role === role) 
            next();
        else 
        	res.send(403);
	}
};

var requireAuth = function(req, res, next) {
    if (!req.session.user) {
      res.send(403);
    } else {
    	next();
    }
  };

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('/event/*', requireAuth);
app.all('/user/*', requireAuth);
app.all('/app/*', requireAuth);
app.all('/logout/', requireAuth);

app.all('/admin', requireRole("admin"));
/*
 * GET parts.
 * Some pages may have gets but are actually due to redirect issues (i.e, URL).
 */ 
app.get('/admin', routes.admin);
app.get('/register', routes.reg);
app.get('/applist', routes.apps);
app.get('/event/new/', events.addevent);
app.get('/event/:id', events.getevent);
app.get('/event/edit/:id', events.edit);
app.get('/event/delete/:id', events.del);
app.get('/app/settings/:id', apps.settings);
app.get('/app/build/:id', apps.build);
app.get('/user/:id', user.getuser);
app.get('/user/edit/:id', user.userinfo);
app.get('/user/delete/:id', user.remove);
app.get('/logout/', user.logout);
app.get('/', routes.index);

/*
 * POST part
 * Some posts are database changes and such.
 */
app.post('/login', user.login);
app.post('/signup', 
	form(
    	field("username").trim().minLength(3).required().is(/^[A-z]+$/),
    	field("password").trim().required().is(/^[a-z]+$/),
    	field("email").trim().isEmail(),
    	field("realname").trim().minLength(3).required().is(/^[A-z]+$/),
    	field("org").trim().minLength(3).required().is(/^[A-z]+$/)
 		), 
	user.register);
app.post('/newevent', requireAuth, events.add);
app.post('/updateevent', requireAuth,events.update);
app.post('/edituser', requireAuth, user.edit);
app.post('/editapp', requireAuth, apps.save);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
