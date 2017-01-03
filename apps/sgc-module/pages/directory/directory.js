var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var directory = new Feature(app, '/sgc-module/pages/directory/');

	directory.addJS(['assets/js/Services/Directory.js']);

	directory.addPage({
		name: 'directory',
		url: 'assets/pages/directory.html',
		javascript: ['assets/js/Controllers/Directory.js', 'assets/js/Views/Directory.js'],
		css: ['assets/css/directory.css']
	});

	return Q(app);
}
