var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();
var is_admin;

module.exports.getallevents = function(callback) {
	var rows = [];
	var query = client.query('SELECT ename, descr, date(sdate) as sdate, date(edate) as edate, location FROM events');
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.getevent = function(username, eventname, callback) {
	var rows = [];
	var query = client.query('SELECT ename, descr, date(sdate) as sdate, date(edate) as edate, location FROM events where uname = $1 and ename = $2', [username, eventname]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.getuserevents = function(username, callback) {
	var rows = [];
	var query = client.query('SELECT ename, descr, date(sdate) as sdate, date(edate) as edate, location FROM events where uname = $1', [username]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}


module.exports.insert = function(name, desc, startdate, enddate, location, username, callback) {
	var query = client.query('INSERT INTO events (ename, desc, sdate, edate, location, uname) VALUES ($1, $2, $3, $4, $5, $6)',
	[name, desc, startdate, enddate, location, username], function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}
module.exports.update = function(name, fieldnames, fieldvalues, callback) {
	var sqlquery = 'UPDATE events SET ';
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

module.exports.delete = function(name, username, callback) {
	var rows = [];
	var query = client.query('DELETE FROM events WHERE ename = $1 and uname = $2', [name, username], function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}
