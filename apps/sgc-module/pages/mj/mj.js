var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var mj = new Feature(app, '/sgc-module/pages/mj/');

	mj.addJS(['assets/js/Services/Mj.js']);

	mj.addPage({
		name: 'mj',
		url: 'assets/pages/mj.html',
		javascript: ['assets/js/Controllers/Mj.js', 'assets/js/Views/Mj.js'],
		css: ['assets/css/mj.css']
	});

	return Q(app);
}
