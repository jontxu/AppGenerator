var eventsdb = require ('../db/events');
var usersdb = require('../db/users');
var sys = require('sys');
var exec = require('child_process').exec;
var child;
var fs = require('fs');

/*
 * GET part
 */

exports.addevent = function(req, res) {
	res.render('newevent', {title : 'Add new event', user: req.session.user});
}

exports.getevent = function(req, res) {
	if (req.params.id) {
		if (req.session.role == "admin") {
			eventsdb.geteventbyname(req.params.id, function(eventRow) {
				if (eventRow == null)
					console.log("error getting user");
				else {
					res.method = 'GET';
					res.render('singleevent', {title : 'Event information', even: eventRow[0], user: req.session.user });
				}
			});
		} else if (req.session.role == "user") {
			eventsdb.getevent(req.session.user, req.params.id, function(eventRow) {
				if (eventRow == null)
					console.log("error getting user");
				else {
					res.render('singleevent', {title : 'Event information', even: eventRow[0], user: req.session.user });
				}
			});
		}
	} else {
		res.redirect('back');
	}
}

exports.edit = function(req, res) {
	if (req.params.id) {
		if (req.session.role == "admin") {
			eventsdb.geteventbyname(req.params.id, function(eventRow) {
				if (eventRow == null)
					console.log("error getting user");
				else {
					res.method = 'GET';
					res.render('event', {title : 'Editing event ' + eventRow[0].fullname, even: eventRow[0], user: req.session.user});
					}
				});
		} else if (req.session.role == "user") {
			eventsdb.getevent(req.session.user, req.params.id, function(eventRow) {
				if (eventRow == null)
					console.log("error getting user");
				else {
					res.method = 'GET';
					res.render('event', {title : 'Editing event ' + eventRow[0].fullname, even: eventRow[0], user: req.session.user});
					}
				});
		}
	} else {
		res.redirect('back');
	}
}

exports.del = function(req, res) {
	var sys = require('sys');
	var exec = require('child_process').exec;
	var child;
	var fs = require('fs');
	if (req.params.id) {
		if (req.session.role == "admin") {
			eventsdb.deleteevent(req.params.id, function(usererror) {
				if (usererror) {
					console.log("error deleting event");
					res.redirect('back');
				} else if (usererror == null) {
					child = exec("rm -r gen/" + req.params.id + "/", function (error, stdout, stderr) {
  						sys.print('Output: ' + stdout);
  							if (error !== null) {
		    					console.log('exec error: ' + error);
				    			res.send(500);
  						}
					});
					console.log('deleted event ' + req.params.id);
					res.redirect('back');
				}
			});
		} else if (req.session.role == "user") {
			eventsdb.delete(req.params.id, req.session.user, function(usererror) {
				if (usererror) {
					console.log("error deleting event");
					res.redirect('back');
				} else if (usererror == null) {
					child = exec("rm -r gen/" + req.params.id + "/", function (error, stdout, stderr) {
  						sys.print('Output: ' + stdout);
  							if (error !== null) {
		    					console.log('exec error: ' + error);
				    			res.send(500);
  						}
					});
					console.log('deleted event ' + req.params.id);
					res.redirect('back');
				}
			});
		}
	} else {
		res.redirect('back');
	}
}


/* 
 * POST part
 */
exports.add = function(req, res) {
	console.log(req.body.fullname);
	var id = req.body.fullname.replace(/\s/g, "").toLowerCase(); //id is a slug for urls
	console.log(id);
	eventsdb.insert(id, req.body.descr, req.body.sdate, req.body.edate, req.body.location, req.session.user, req.body.fullname, function (events) {
		if (events) {			
			console.log('Error inserting in database');
			res.redirect('/event/new/');
		} else if (events == null) {
			child = exec("mkdir gen/" + id, function (error, stdout, stderr) {
  				sys.print('Output: ' + stdout);
  					if (error !== null) {
	    				console.log('exec error: ' + error);
	    				res.send(500);
  				}
			});
			child = exec("mkdir gen/" + id + "/assets", function (error, stdout, stderr) {
	  			sys.print('Output: ' + stdout);
  				if (error !== null) {
		    		console.log('exec error: ' + error);
	    			res.send(500);
  				}
			});
			res.redirect('/applist/');
		}
	});
}

exports.update = function(req, res) {
	var name = req.body.ename;
	var id = name.replace(/\s/g, "").toLowerCase(); //id is a slug for urls
	eventsdb.update(id, req.body.ename, req.body.descr, req.body.sdate, req.body.edate, req.body.location, function(events) {
		if (events == null) {
			res.redirect('/applist/');
		} else {
			res.redirect('/event/' + id);
			console.log('Error inserting in database');
		}
	});
}