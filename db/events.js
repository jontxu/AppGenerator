var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();
var is_admin;

module.exports.getallevents = function(callback) {
	var rows = [];
	var query = client.query('SELECT ename, fullname, descr, date(sdate) as sdate, date(edate) as edate, location FROM events');
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.getevent = function(username, eventname, callback) {
	var rows = [];
	var query = client.query('SELECT ename, fullname, descr, date(sdate) as sdate, date(edate) as edate, location FROM events where uname = $1 and ename = $2', [username, eventname]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.geteventbyname = function(eventname, callback) {
	var rows = [];
	var query = client.query('SELECT ename, fullname, descr, date(sdate) as sdate, date(edate) as edate, location FROM events where ename = $1', [eventname]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.getuserevents = function(username, callback) {
	var rows = [];
	var query = client.query('SELECT ename, fullname, descr, date(sdate) as sdate, date(edate) as edate, location FROM events where uname = $1', [username]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}
module.exports.geteventname = function(username, eventname, callback) {
	var rows = [];
	var query = client.query('SELECT fullname FROM events where uname = $1 and ename = $2', [username, eventname]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}


module.exports.insert = function(name, desc, startdate, enddate, location, username, fullname, callback) {
	var query = client.query('INSERT INTO events (ename, desc, sdate, edate, location, uname, fullname) VALUES ($1, $2, $3, $4, $5, $6)',
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
module.exports.update = function(ename, name, desc, sdate, edate, loc, callback) {
	var query = client.query('UPDATE EVENTS set fullname = $1, descr = $2, sdate = $3, edate = $4, location = $5 where ename = $6', [name, desc, sdate, edate, loc, ename], function(err) {
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

module.exports.deleteevent = function(name, callback) {
	var rows = [];
	var query = client.query('DELETE FROM events WHERE ename = $1', [name], function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}