
/*
 * GET home page.
 */
var eventsdb = require('../db/events');

exports.get = function(req, res) {
	if (req.session.user == null) {
		res.send(403);
	} else {
		eventsdb.getuserevents(req.session.user, function(eventRows) {
			if (eventRows == null)
				console.log("Error getting events");
			else {
				res.method = 'GET';
				res.render('applist', {title: 'My apps & events', events: eventRows, username: req.session.user});		
			} 
		});
	}
};