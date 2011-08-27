var http = require('http');

exports.home = function(req, res){
	res.send('Hello home page!');
}

exports.action = function(req, res){
	res.send('Hello World! Doing '+req.params.id+'?');
}