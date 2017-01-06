var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var klondike = new Feature(app, '/sgc-module/pages/klondike/');

	klondike.addJS(['assets/js/Services/Klondike.js']);

	klondike.addPage({
		name: 'klondike',
		url: 'assets/pages/klondike.html',
		javascript: [
			'assets/js/Engines/Klondike.js',
			'assets/js/Engines/Deck.js',
			'assets/js/Controllers/Klondike.js',
			'assets/js/Views/Klondike.js'
		],
		css: ['assets/css/klondike.css', 'assets/css/cards.css']
	});

	return Q(app);
}
