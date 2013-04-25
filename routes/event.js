var eventsdb = require ('../db/events');
var usersdb = require('../db/users');


/*
 * GET part
 */

exports.addevent = function(req, res) {
	res.render('newevent', {title : 'Add new event'});
}

exports.getevent = function(req, res) {
	if (req.params.id) {
		if (req.session.role == "admin") {
			eventsdb.geteventbyname(req.params.id, function(eventRow) {
				if (eventRow == null)
					console.log("error getting user");
				else {
					res.method = 'GET';
					res.render('singleevent', {title : 'Event information', even: eventRow[0] });
				}
			});
		} else if (req.session.role == "user") {
			eventsdb.getevent(req.session.user, req.params.id, function(eventRow) {
				if (eventRow == null)
					console.log("error getting user");
				else {
					res.render('singleevent', {title : 'Event information', even: eventRow[0] });
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
					res.render('event', {title : 'Editing event ' + eventRow[0].fullname, even: eventRow[0]});
					}
				});
		} else if (req.session.role == "user") {
			eventsdb.getevent(req.session.user, req.params.id, function(eventRow) {
				if (eventRow == null)
					console.log("error getting user");
				else {
					res.method = 'GET';
					res.render('event', {title : 'Editing event ' + eventRow[0].fullname, even: eventRow[0]});
					}
				});
		}
	} else {
		res.redirect('back');
	}
}

exports.del = function(req, res) {
	if (req.params.id) {
		if (req.session.role == "admin") {
			eventsdb.deleteevent(req.params.id, function(usererror) {
				if (usererror) {
					console.log("error deleting event");
					res.redirect('back');
				} else if (usererror == null) {
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
	var id = req.body.name.trim().toLowerCase(); //id is a slug for urls
	eventsdb.insert(id, req.body.descr, req.body.sdate, req.body.edate, req.body.location, req.session.user, req.body.name, function(events) {
	if (events) {
		 // May change in time
	      res.redirect('/event/new/');
	      console.log('Error inserting in database');
	    }
	    else if (events == null) {
	      res.redirect('/applist/');
	    }
	});
}

exports.update = function(req, res) {
	var id = req.body.name.trim().toLowerCase(); //id is a slug for urls
	eventsdb.update(id, req.body.name, req.body.descr, req.body.sdate, req.body.edate, req.body.location, function(events) {
		if (events == null) {
			res.redirect('back');
		} else {
			res.redirect('/event/' + id);
			console.log('Error inserting in database');
		}
	});
}