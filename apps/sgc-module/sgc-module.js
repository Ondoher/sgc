var Q = require('q');
var sapphire = require('sapphire-express');

function main(req, res, app)
{
	app.addJS([
		'https://www.symphony.com/resources/api/v1.0/symphony-api.js',
	], true);

	app.addCSS([
		'https://www.symphony.com/resources/api/v1.1/symphony-style.css',
	], true);

	app.addCSS([
		'/sgc-module/assets/css/sgc-module.css',
	]);

	app.addJS([
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
		'/sgc-module/assets/js/Views/SgcModule.js',
		'/sgc-module/assets/js/Controllers/SgcModule.js',
		'/sgc-module/assets/js/random.js',
		'/sgc-module/assets/js/sets.js',
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
	var app = new sapphire.Application('SGC_MODULE', req, res);

	app.setTitle('SgcModule');
	app.setBody('apps/sgc-module/templates/body.html');
	app.setMaster('apps/sgc-module/templates/master.html');
	app.addVariable('baseUrl', CONFIG.baseUrl);
    app.addVariable('podAppIdExceptions', CONFIG.sgc.podAppIdExceptions);

	return main(req, res, app)
		.then(sapphire.features.animator.bind(sapphire.features.animator, req, res))
		.then(sapphire.features.dialogs.bind(sapphire.features.dialogs, req, res))
 //		.then(use('features', 'bridge', req, res))
		.then(use('features', 'services', req, res))
		.then(use('features', 'bread-crumbs', req, res))
		.then(use('pages', 'directory', req, res))
		.then(use('pages', 'mj', req, res))
		.then(use('pages', 'tetris', req, res))
		.then(use('pages', 'klondike', req, res))
		.then(use('pages', 'words', req, res))
		.then(function(app)
		{
			return Q(app);
		})
}
