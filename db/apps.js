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

module.exports.update = function(appname, descr, logo, twit, fb, ever, ios, andr, keystore, callback) {
	var query = client.query('UPDATE appsettings SET appname = $1, description = $2, logo = $3, twitter = $4, facebook = $5, ios = $6, android = $7, keystorename = $8 where emame = $9' [appname, descr, logo, twit, fb, ever, ios, andr, keystore, ename], function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
			return;
		}
	});
}
