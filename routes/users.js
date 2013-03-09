nano = require('nano')('http://localhost:5984')

module.exports.authenticate = function(login,password,callback) {
    nano.db.get('users/'+login,function(err,doc) {
        if(err) { 
	  console.log(err.message); 
	  callback(null); 
	  return;
	}
        if(doc == null) { 
	  callback(null); 
	  return; 
	}
        if(doc.password == password) { 
	  callback(doc); 
	  return;
	}
        console.log('retrieved: ' + doc); callback(null);
    });
}
