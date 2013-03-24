
/*
 * GET home page.
 */
var usersdb = require('../db/users');
exports.get = function(req, res) {
  usersdb.getusers(function(userRows) {
	if (userRows == null)
	console.log("error getting user");
	else {
		for (var i = 0; i < userRows.length; i++)
			console.log(userRows[i].uname + ' ' + userRows[i].upass + ' ' + userRows[i].email);
		res.method = 'GET';
		res.render('admin', {title: 'Administration page', rows: userRows});		
		}
	});
};