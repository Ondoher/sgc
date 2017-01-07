var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var words = new Feature(app, '/sgc-module/pages/words/');

	words.addJS(['assets/js/Services/Words.js']);
	words.addPage({
		name: 'words',
		url: 'assets/pages/words.html',
		javascript: [
			'assets/js/Controllers/Words.js',
			'assets/js/Engines/Words.js',
			'assets/js/Views/Words.js'
		],
		css: ['assets/css/words.css']
	});

	return Q(app);
}
