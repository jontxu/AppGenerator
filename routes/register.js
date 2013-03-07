
/*
 * GET home page.
 */

exports.get = function(req, res){
  res.render('register', { title: 'Sign up' });
};

