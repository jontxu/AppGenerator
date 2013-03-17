
/*
 * GET home page.
 */
var register = require('./register');
var applist = require('./applist');
var admin = require('./admin');

exports.index = function(req, res){
  res.render('index', { title: 'Login' });
};

exports.reg = register.get;
exports.apps = applist.get;
exports.admin = admin.get;
