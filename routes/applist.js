
/*
 * GET home page.
 */

exports.get = function(req, res){
  res.render('applist', { title: 'My apps & events'});
};

