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
				res.json({lectures: lect});
			}
		});

	} else {
		res.redirect('back');
	}
}

exports.save = function(req, res) {
	if (req.params.id) {
		lecture = req.body.lectures;
		for (var i=0; i < lecture.length; i++) {
			lecturesdb.update(lecture[i].ename, lecture[i].lectname, lecture[i].lecttitle, lecture[i].sdate, lecture[i].edate, lecture[i].lecturer, lecture[i].excerpt, lecture[i].location, function(lect) {
				if (lect == null)
					res.send(500);
				else {
					console.log('Event added');
				}
			});
		}
	} else {
		res.redirect('back');
	}
}
