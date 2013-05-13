var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();
var is_admin;


module.exports.add = function(ename, lname, title, sdate, edate, lect, excerpt, loc, callback) {
	var query = client.query("INSERT INTO lectures (lecname, lecttitle, ename, sdate, edate, lecturer, excerpt, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [lname, title, ename, sdate, edate, lect, excerpt, loc], function(err) {
  	if (err) {
    	callback(err);
    	return;
  	} else {
	    callback(null);
	    return;
	}
 	});
}

module.exports.get = function(lname, ename, callback) {
    var rows = [];
    var query = client.query('SELECT lecname, lecttitle, ename, sdate, edate, lecturer, excerpt, location FROM lectures WHERE lecname = $1 AND ename = $2', [lname, ename]);
    query.on('row', function(row) {
		rows.push(row);
    });
  	query.on('end', function(result) {
     callback(rows);
  });
}

module.exports.getall = function(ename, callback) {
    var rows = [];
    var query = client.query('SELECT lecname, lecttitle, ename, sdate, edate, lecturer, excerpt, location FROM lectures WHERE ename = $1', [ename]);
    query.on('row', function(row) {
		rows.push(row);
    });
  	query.on('end', function(result) {
     callback(rows);
  });
}

module.exports.update = function(ename, lname, title, sdate, edate, lect, excerpt, loc, callback) {
	var query = client.query("UPDATE lectures SET lecttitle = $1, sdate = $2, edate = $3, lecturer = $4, excerpt = $5, location = $6 WHERE lecname = $7 AND ename = $8", [title, sdate, edate, lect, excerpt, loc, lname, ename], function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}

module.exports.remove = function(lname, ename, callback) {
	var query = client.query('DELETE FROM lectures WHERE lecname = $1 and ename = $2', [lname, ename], function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}