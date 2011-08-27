var http = require('http');

export.register = function(app){
	app.get('/master/create-quest', create);
    app.get('/master/add-task', add);
    app.get('/master/open-quest', open);
    app.get('/master/start-quest', start);
    app.get('/master/finish-quest', finish);
}

function create(req, res){
	res.send('H3ll0homeHa6');
}

function add(req, res){
	res.send({ok:true});
}

function open(req, res){
	if (req.params.url)
		res.send({ok:true});
	else
		res.send({ok:true});
}

function start(req, res){
	res.send({ok:true});
}

function finish(req, res){
	res.send({ok:true});
}