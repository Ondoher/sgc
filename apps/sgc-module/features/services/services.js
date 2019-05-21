var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var bootstrap = new Feature(app, '/sgc-module/features/services/');

	bootstrap.addJS(['assets/js/Services/Bootstrap.js', 'assets/js/Services/Module.js']);

	return Q(app);
}
