var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var services = new Feature(app, '/sgc/features/services/');

	services.addJS([
		'assets/js/Services/Bootstrap.js',
		'assets/js/Services/Controller.js',
		'assets/js/Services/Renderer.js',
	]);

	return Q(app);
}
