
/*
 * GET home page.
 */
var register = require('./register');
var applist = require('./applist');
var admin = require('./admin');

exports.index = function(req, res){
	if (req.session.user != null) {
		if (req.session.role == "admin") {
			res.redirect("/admin/");
		}
		else if (req.session.role == "user") {
			res.redirect('/applist/')
		}
	} else {
		res.render('index', { title: 'Login' });	
	}
};

exports.reg = register.get;
exports.apps = applist.get;
exports.admin = admin.get;
