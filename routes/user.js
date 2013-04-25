var usersdb = require('../db/users');
var eventsdb = require ('../db/events');

/*
 * GET users listing.
 */

exports.getuser = function(req, res) {
	if (req.params.id) {
		usersdb.getuser(req.params.id, function(user) {
			if (user == null) {
				console.log("error getting user");
				res.redirect('back');
			} else {
				eventsdb.getuserevents(req.params.id, function(events) {
					if (events == null) {
						console.log("Error getting events");
						res.redirect("back");
					} else {
						res.render('userinfo', { title : 'User information', ev: events, us: user[0] });
					}
				});
			}
		});
	} else {
		res.redirect('back');
	}
}

exports.userinfo = function(req, res) {
	//TODO
	if (req.params.id) {
		usersdb.getuser(req.params.id, function(userRow) {
			if (userRow == null)
				console.log("error getting user");
			else {
				res.method = 'GET';
				res.render('user', {title : 'Editing page for ' + req.params.id, user: userRow[0]});
				}
			});
	} else {
		res.redirect('back');
	}
}

exports.remove =  function(req, res) {
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
}

exports.logout = function(req, res) {
	req.session.user = null;
	req.session.role = null;
	res.redirect('/');
}

/* 
 * POST
 */

 exports.login = function(req, res) {
	req.session.user = req.body.username;
	usersdb.authenticate(req.body.username, req.body.password, function(is_admin) {
	if (is_admin == null) {
		res.render('index', { title: 'Login' });
		req.session.user = null;
		res.redirect("/");
	} else if (is_admin == false) {
		req.session.role = "user";
		res.redirect('/applist/');
	} else if (is_admin == true) {
		req.session.role = "admin";
		res.redirect('/admin/');
		}
	});
}

exports.register = function(req, res) {
   	if (!req.form.isValid) {
   		console.log(req.form.errors);
   		res.redirect('register');
   	}
   	else {
		if (req.body.password != req.body.password_confirm) {
	   		console.log('Passwords don\'t match');
	   		res.redirect('register');
		} else {
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

exports.edit = function(res, res) {
   	if (!req.form.isValid) {
   		console.log(req.form.errors);
   		res.redirect('back');
   	}
   	else {
		if (req.body.password != req.body.password_confirm) {
	   		console.log('Passwords don\'t match');
	   		res.redirect('back');
		} else {
	   		usersdb.update(req.body.username, req.body.password, req.body.email, req.body.realname, req.body.org, function(user) {
		   		if (user) {
		   			console.log('There has been an error while updating');
		   			res.redirect('back');
		   		}
		   		else if (user == null) {
	      			res.redirect('back');
		   		}
	   		});
		}
	}
}