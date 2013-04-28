var eventsdb = require ('../db/events');
var usersdb = require('../db/users');

exports.settings = function(req, res) {
	if (req.params.id) {
		if (req.session.role == "admin") {
			eventsdb.geteventbyname(req.params.id, function(evento) {
				if (evento == null)
					console.log("error getting user");
				else {
					res.method = 'GET';
					res.render('newapp', {title : 'App settings' , eventname: evento[0].fullname, appid: req.params.id, user: req.session.user });
					}
				});
		} else if (req.session.role == "user") {
			eventsdb.geteventname(req.session.user, req.params.id, function(evento) {
				if (evento == null) {
					console.log("error getting user");
					res.redirect('back');
				} else {
					res.method = 'GET';
					res.render('newapp', {title : 'App settings' , eventname: evento[0].fullname, appid: req.params.id, user: req.session.user });
				}
			});
		}
	} else {
		res.redirect('back');
	}
}

exports.build =  function(req, res) {
	if (req.params.id) {
		var sys = require('sys');
		var exec = require('child_process').exec;
		var child;

		// executes `pwd`
		child = exec("echo " + req.params.id, function (error, stdout, stderr) {
  			sys.print('Output: ' + stdout);
  			if (error !== null) {
	    		console.log('exec error: ' + error);
  			}
		});
		res.redirect('/event/' + req.params.id);
	} else {
		res.redirect('back');
	}
}

/*
 * POST
 */

 exports.save = function(req, res) {
 	if (req.params.id) {
		appsdb.update(req.params.id, req.body.descr, req.body.logo, req.body.twit, req.body.fb, req.body.ever, req.body.ios, req.body.andr, req.body.keystore, function(appl) {
			if (appl == null) {
				console.log("error getting user");
				res.redirect('back');
			} else {
				res.redirect('back');
			}
		});
	} else {
		res.redirect('back');
	}
 }