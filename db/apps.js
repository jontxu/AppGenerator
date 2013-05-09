var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb';
var client = new pg.Client(connectionString);
client.connect();
var is_admin;


module.exports.getapp = function(eventname, callback) {
	var rows = [];
	var query = client.query('SELECT ename, appname, description, twitter, facebook, evernote, ios, android, keystorename FROM appsettings where ename = $1', [eventname]);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
		callback(rows);
	});
}

module.exports.update = function(appname, descr, twit, fb, ios, andr, ever, keystore, ename, callback) {
	var query = client.query('UPDATE appsettings SET appname = $1, description = $2, twitter = $3, facebook = $4, ios = $5, android = $6, evernote = $7, keystorename = $8 where ename = $9', [appname, descr, twit, fb, ios, andr, ever, keystore, ename], function (err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}
