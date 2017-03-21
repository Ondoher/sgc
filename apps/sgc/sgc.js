var Q = require('q');
var sapphire = require('sapphire-express');

function main(req, res, app)
{
	app.addJS([
		'https://www.symphony.com/resources/api/v1.0/symphony-api.js',
	], true);

	app.addCSS([
		'/sgc/assets/css/sgc.css',
	]);

	app.addJS([
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
		'/sgc/assets/js/Views/Sgc.js',
		'/sgc/assets/js/Controllers/Sgc.js',
	]);


	return Q(app)
}

function use(type, name, req, res)
{
	var module = require('./' + type + '/' + name + '/' + name + '.js');
	return function(app)
	{
		return module(req, res, app);
	}
}

exports.getApplication = function(req, res)
{
	var session = req.session.get();
	var app = new sapphire.Application('SGC', req, res);

	app.setTitle('Symfuny Game Center');
	app.setBody('apps/sgc/templates/body.html');
	app.setMaster('apps/sgc/templates/master.html');
	app.addVariable('baseUrl', CONFIG.baseUrl);
	app.addVariable('podAppIdExceptions', CONFIG.sgc.podAppIdExceptions);

	return main(req, res, app)
		.then(sapphire.features.animator.bind(sapphire.features.animator, req, res))
		.then(sapphire.features.dialogs.bind(sapphire.features.dialogs, req, res))
		.then(use('features', 'bridge', req, res))
		.then(function(app)
		{
			return Q(app);
		})
}
