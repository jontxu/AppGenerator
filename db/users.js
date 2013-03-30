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
	var query = client.query('INSERT INTO users (uname, upass, email, is_admin) VALUES ($1, $2, $3, false)', [name, pass, email], function(err) {
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
    var query = client.query('SELECT uname, upass, email FROM users WHERE is_admin = FALSE');
    query.on('row', function(row) {
		rows.push(row);
    });
  	query.on('end', function(result) {
     callback(rows);
  });
}

module.exports.getuser = function(name, callback) {
    var rows = [];
    var query = client.query('SELECT uname, upass, email FROM users WHERE is_admin = FALSE and uname = $1', [name]);
    query.on('row', function(row) {
		rows.push(row);
    });
  	query.on('end', function(result) {
     callback(rows);
  });
}

module.exports.update = function(name, fieldnames, fieldvalues, callback) {
	var sqlquery = 'UPDATE user SET ';
	for (var i = 0; i < fieldnames.length; i++) {
		query = query + fieldnames[i] + '=' + fieldvalues[i];
		if (i != fieldnames.length) 
			query += ', ';
	}
	query += 'WHERE ename =' + name;
	var query = client.query(sqlquery, function(err) {
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