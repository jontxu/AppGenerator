
/*
 * GET home page.
 */

exports.get = function(req, res){
  res.render('applist', { title: 'Applist' });
};

