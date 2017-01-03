var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var bridge = new Feature(app, '/sgc-module/features/bridge/');

	bridge.addJS(['assets/js/Services/Module.js']);

	return Q(app);
}
