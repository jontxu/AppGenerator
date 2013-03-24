var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();

module.exports.authenticate = function(username, password, callback) {
	var is_admin = null;
	var query = client.query('SELECT uname, upass, is_admin FROM users WHERE upass = $1',  [password]);
	query.on('end', function(row) {
		if (is_admin == null) {
			console.log("Incorrect username or password");
    		callback(null);
    		return;
    	}
  	});
	query.on('row', function(row) {
		if (row.uname != username || row.upass != password) {
			console.log("Incorrect username or password");
			callback(null);
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

module.exports.getusers = function(callback) {
    var rows = [];
    var query = client.query('SELECT uname, upass, email FROM users');
    query.on('row', function(row) {
		rows.push(row);
    });
  	query.on('end', function(result) {
     callback(rows);
  });
}
