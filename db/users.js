var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();

module.exports.authenticate = function(username, password, callback) {
	var is_admin = null;
	var query = client.query('select uname, upass, email, is_admin from users where uname = $1 and upass = crypt($2, upass)',  [username, password]);
	query.on('end', function(row) {
		if (is_admin == null) {
			console.log("Incorrect username or password");
    		callback(null);
    		return;
    	}
  	});
	query.on('row', function(row) {
		if (row.uname != username) {
			console.log("Incorrect username or password");
			callback(null);
			return;
		} else {
			is_admin = row.is_admin;
			callback(row.is_admin);
			return;
		}
	});
}

module.exports.signup = function(name, pass, email, realname, org, callback) {
	var query = client.query("INSERT INTO users (uname, upass, email, is_admin, realname, org) VALUES ($1, crypt($2, gen_salt('md5')), $3, false, $4, $5)", [name, pass, email, realname, org], function(err) {
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
    var query = client.query('SELECT uname, realname, org, email FROM users WHERE is_admin = FALSE');
    query.on('row', function(row) {
		rows.push(row);
    });
  	query.on('end', function(result) {
     callback(rows);
  });
}

module.exports.getuser = function(name, callback) {
    var rows = [];
    var query = client.query('SELECT uname, realname, org, email FROM users WHERE is_admin = FALSE and uname = $1', [name]);
    query.on('row', function(row) {
		rows.push(row);
    });
  	query.on('end', function(result) {
     callback(rows);
  });
}

module.exports.update = function(name, email, realname, org, formername, callback) {
	var query = client.query("UPDATE users SET uname = $1, email = $2, realname = $3, org = $4 where uname = $5", [name, email, realname, org, formername], function (err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}

module.exports.delete = function(name, callback) {
	var rows = [];
	var query = client.query('DELETE FROM users WHERE uname = $1', [name], function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}