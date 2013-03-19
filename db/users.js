var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();
var is_admin;

module.exports.authenticate = function(username, password, callback) {
  var query = client.query('SELECT uname, is_admin FROM users WHERE upass = $1',  [password]);
  query.on('row', function(row) {
  if (row.uname != username) {
    callback(null);
    console.log("Not the same username");
    return;
  } else { 
    console.log(row.uname + " " + row.is_admin);
    is_admin = row.is_admin;
    callback(row.is_admin);
    return;
  }
 });
}

module.exports.signup = function(name, pass, email, callback) {
	var query = client.query('INSERT INTO users (uname, upass, email) VALUES ($1, $2, $3)', [name, pass, email], function(err) {
  	if (err) {
    	callback(err);
    	return;
  	} else {
	    callback(null);
	    return;
	}
 	});
}

module.exports.getusers = function() {
    var rows = [];
    var query = client.query('SELECT uname, upass, email FROM users');
    query.on('row', function(row) {
    	console.log("Current rows: " + rows);
		rows.push(row);
    });
  	query.on('end', function(result) {
  	 console.log("Total rows: " + rows.length);
     return rows;
  });
  return rows;
}
