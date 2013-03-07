
/*
 * GET home page.
 */
var register = require('./register');
var applist = require('./applist');

exports.index = function(req, res){
  res.render('index', { title: 'Login' });
};

exports.reg = register.get;
exports.apps = applist.get;