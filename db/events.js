var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();
var is_admin;

module.exports.getallevents = function(username, callback) {
  var rows = [];
  var query = client.query('SELECT ename, descr, sdate, edate, location FROM events where uname = $1', [username]);
    query.on('row', function(row) {
      console.log("Current rows: " + rows);
      rows.push(row);
    });
    query.on('end', function(result) {
      console.log("Total rows: " + rows.length);
  });
  callback(rows);
  return;
}
}

module.exports.getuserevents = function(username, callback) {
  var rows = [];
  var query = client.query('SELECT ename, descr, sdate, edate, location FROM events where uname = $1', [username]);
    query.on('row', function(row) {
      console.log("Current rows: " + rows);
      rows.push(row);
    });
    query.on('end', function(result) {
      console.log("Total rows: " + rows.length);
  });
  callback(rows);
  return;
}


module.exports.insert = function(name, desc, startdate, enddate, location, username, callback) {
  var query = client.query('INSERT INTO events (ename, desc, sdate, edate, location, uname) VALUES ($1, $2, $3, $4, $5, $6)', [name, desc, startdate, enddate, location, username], function(err) {
    if (err) {
      callback(err);
      return;
    } else {
      callback(null);
      return;
    }
  });
}

module.exports.update = function(name, fieldnames, fields, callback) {
    query = 'UPDATE events SET 
    var query = client.query('UPDATE EVENT SET, upass, email WHERE ename = $4');
    query.on('row', function(row) {
    	console.log("Current rows: " + rows[0]);
		rows.push(row);
    });
  	query.on('end', function(result) {
  	 console.log("Total rows: " + rows.length);
     return rows;
  });
  return rows;
}

module.exports.delete = function(name, callback) {
	var rows = [];
	var query = client.query('DELETE FROM events WHERE');
    query.on('row', function(row) {
    	console.log("Current rows: " + rows[0]);
		rows.push(row);
    });
  	query.on('end', function(result) {
  	 console.log("Total rows: " + rows.length);
     return rows;
  });
  return rows;
}
