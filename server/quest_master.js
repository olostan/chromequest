var crypto = require('crypto');

exports.register = function(app){
	app.get('/master/create-quest', create);
    app.get('/master/add-task', add);
    app.get('/master/open-quest', open);
    app.get('/master/start-quest', start);
    app.get('/master/finish-quest', finish);
}

function create(req, res){
    var hasher = crypto.createHash('md5');
    hasher.update('questId');
    
	res.send({questhash:hasher.digest('base64')});
}

function add(req, res){
    console.log(req.param('url'));
    if (!req.param('url')){
        res.send({ok:false});
        return;
    }
    
	res.send({ok:true});
}

function open(req, res){
	
	
	res.send({ok:true});
}

function start(req, res){
	res.send({ok:true});
}

function finish(req, res){
	res.send({ok:true});
}