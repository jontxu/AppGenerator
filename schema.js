var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:tistisquare@localhost/testdb'
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE user (name text primary key, pass text)');
query.on('end', function() { 
  console.log('DB created');
});
client.query('INSERT INTO visits VALUES("jon", "test")');
client.end();