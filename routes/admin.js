
/*
 * GET home page.
 */
var usersdb = require('../db/users');
exports.get = function(req, res) {
  usersdb.getusers(function(userRows) {
	if (userRows == null)
	console.log("error getting user");
	else {
		res.method = 'GET';
		res.render('admin', {title: 'Administration page', rows: userRows, user: req.session.user});		
		}
	});
};