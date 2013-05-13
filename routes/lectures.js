var lecturesdb = require('../db/lectures');

exports.getlect = function(req, res) {
	if (req.params.id) {
		lecturesdb.getall(req.params.id, function(lect) {
			if (lect == null)
				console.log("error getting lectures");
			else {
				for (var i = 0; i < lect.length; i++) {
					var time1, time2;
					time1 = lect[i].sdate.getUTCFullYear() + "-" + (('0' + (lect[i].sdate.getUTCMonth() + 1)).slice(-2)) + "-" + 
						(('0' + lect[i].sdate.getUTCDate()).slice(-2)) + " " + (('0' + lect[i].sdate.getHours()).slice(-2)) + 
						":" + (('0' + lect[i].sdate.getMinutes()).slice(-2));
					time2 = lect[i].edate.getUTCFullYear() + "-" + (('0' + (lect[i].edate.getUTCMonth() + 1)).slice(-2)) + "-" + 
						(('0' + lect[i].edate.getUTCDate()).slice(-2)) + " " + (('0' + lect[i].edate.getHours()).slice(-2)) + 
						":" + (('0' + lect[i].edate.getMinutes()).slice(-2));
					lect[i].sdate = time1;
					lect[i].edate = time2;
				}
				res.json({ lectures: lect });
			}
		});

	} else {
		res.redirect('back');
	}
}

exports.save = function(req, res) {
	if (req.params.id) {
		console.log(req.body.data);
		lecturesdb.update(req.body.data.lecname, req.body.data.lecttitle, req.body.data.ename, req.body.data.sdate, req.body.data.edate, req.body.data.lecturer, req.body.data.excerpt, req.body.data.location, function(lect) {
			if (lect == null) {
				console.log('Lecture saved');
				lecturesdb.getall(req.params.id, function(lectu) {
					if (lectu == null)
						console.log("error getting lectures");
					else {
						for (var i = 0; i < lectu.length; i++) {
							var time1, time2;
							time1 = lectu[i].sdate.getUTCFullYear() + "-" + (('0' + (lectu[i].sdate.getUTCMonth() + 1)).slice(-2)) + "-" + 
								(('0' + lectu[i].sdate.getUTCDate()).slice(-2)) + " " + (('0' + lectu[i].sdate.getHours()).slice(-2)) + 
								":" + (('0' + lectu[i].sdate.getMinutes()).slice(-2));
							time2 = lectu[i].edate.getUTCFullYear() + "-" + (('0' + (lectu[i].edate.getUTCMonth() + 1)).slice(-2)) + "-" + 
								(('0' + lectu[i].edate.getUTCDate()).slice(-2)) + " " + (('0' + lectu[i].edate.getHours()).slice(-2)) + 
								":" + (('0' + lectu[i].edate.getMinutes()).slice(-2));
							lectu[i].sdate = time1;
							lectu[i].edate = time2;
						}
						res.json({ lectures: lectu });
					}
				});
			} else {
				console.log(lect);
				res.send(500);
			}
		});
	} else {
		res.redirect('back');
	}
}

exports.create = function(req, res) {
	if (req.params.id) {
		console.log(req.body.data);
		lecturesdb.add(req.body.data.ename, req.body.data.lecname, req.body.data.lecttitle, req.body.data.sdate, req.body.data.edate, req.body.data.lecturer, req.body.data.excerpt, req.body.data.location, function(lect) {
			if (lect == null) {
				console.log('Lecture added');
				lecturesdb.getall(req.params.id, function(lectu) {
					if (lectu == null)
						console.log("error getting lectures");
					else {
						for (var i = 0; i < lectu.length; i++) {
							var time1, time2;
							time1 = lectu[i].sdate.getUTCFullYear() + "-" + (('0' + (lectu[i].sdate.getUTCMonth() + 1)).slice(-2)) + "-" + 
								(('0' + lectu[i].sdate.getUTCDate()).slice(-2)) + " " + (('0' + lectu[i].sdate.getHours()).slice(-2)) + 
								":" + (('0' + lectu[i].sdate.getMinutes()).slice(-2));
							time2 = lectu[i].edate.getUTCFullYear() + "-" + (('0' + (lectu[i].edate.getUTCMonth() + 1)).slice(-2)) + "-" + 
								(('0' + lectu[i].edate.getUTCDate()).slice(-2)) + " " + (('0' + lectu[i].edate.getHours()).slice(-2)) + 
								":" + (('0' + lectu[i].edate.getMinutes()).slice(-2));
							lectu[i].sdate = time1;
							lectu[i].edate = time2;
						}
						res.json({ lectures: lectu });
					}
				});
			} else {
				console.log(lect);
				res.send(500);
			}
		});
	} else {
		res.redirect('back');
	}
}

exports.remove = function(req, res) {
	if (req.params.id) {
		console.log(req);
		console.log(req.body.data.ename + " " + req.body.data.lecname);
		lecturesdb.remove(req.body.data.ename, req.body.data.lecname, function(lect) {
			if (lect == null) {
				console.log('Lecture removed');
				lecturesdb.getall(req.params.id, function(lectu) {
					if (lectu == null)
						console.log("error getting lectures");
					else {
						for (var i = 0; i < lectu.length; i++) {
							var time1, time2;
							time1 = lectu[i].sdate.getUTCFullYear() + "-" + (('0' + (lectu[i].sdate.getUTCMonth() + 1)).slice(-2)) + "-" + 
								(('0' + lectu[i].sdate.getUTCDate()).slice(-2)) + " " + (('0' + lectu[i].sdate.getHours()).slice(-2)) + 
								":" + (('0' + lectu[i].sdate.getMinutes()).slice(-2));
							time2 = lectu[i].edate.getUTCFullYear() + "-" + (('0' + (lectu[i].edate.getUTCMonth() + 1)).slice(-2)) + "-" + 
								(('0' + lectu[i].edate.getUTCDate()).slice(-2)) + " " + (('0' + lectu[i].edate.getHours()).slice(-2)) + 
								":" + (('0' + lectu[i].edate.getMinutes()).slice(-2));
							lectu[i].sdate = time1;
							lectu[i].edate = time2;
						}
						res.json({ lectures: lectu });
					}
				});
			} else {
				console.log(lect);
				res.send(500);
			}
		});
	} else {
		res.redirect('back');
	}
}
