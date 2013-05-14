var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();
var is_admin;

module.exports.getallevents = function(callback) {
	var rows = [];
	var query = client.query('SELECT ename, fullname, descr, sdate, edate as edate, location FROM events');
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.getevent = function(username, eventname, callback) {
	var rows = [];
	var query = client.query('SELECT ename, fullname, descr, sdate, edate, location FROM events where uname = $1 and ename = $2', [username, eventname]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.geteventbyname = function(eventname, callback) {
	var rows = [];
	var query = client.query('SELECT ename, fullname, descr, sdate, edate, location FROM events where ename = $1 order by sdate', [eventname]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.getuserevents = function(username, callback) {
	var rows = [];
	var query = client.query('SELECT ename, fullname, descr, sdate, edate, location FROM events where uname = $1 order by sdate', [username]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}
module.exports.geteventname = function(username, eventname, callback) {
	var rows = [];
	var query = client.query('SELECT fullname FROM events where uname = $1 and ename = $2 order by sdate', [username, eventname]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}


module.exports.insert = function(name, desc, startdate, enddate, location, username, fullname, callback) {
	var query = client.query('INSERT INTO events (ename, descr, sdate, edate, location, uname, fullname) VALUES ($1, $2, $3, $4, $5, $6, $7)',
	[name, desc, startdate, enddate, location, username, fullname], function(err) {
		if (err) {
			console.log(err);
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}
module.exports.update = function(ename, name, desc, sdate, edate, loc, oldname, callback) {
	var query = client.query('UPDATE EVENTS set ename = $1, fullname = $2, descr = $3, sdate = $4, edate = $5, location = $6 where ename = $7', [ename, name, desc, sdate, edate, loc, oldname], function(err) {
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