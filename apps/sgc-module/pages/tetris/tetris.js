var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var tetris = new Feature(app, '/sgc-module/pages/tetris/');

	tetris.addJS(['assets/js/Services/Tetris.js', 'assets/js/jsutils.js']);

	tetris.addPage({
		name: 'tetris',
		url: 'assets/pages/tetris.html',
		javascript: [
			'assets/js/const.js',
			'assets/js/Engines/Tetris.js',
			'assets/js/Engines/Tetronimo.js',
			'assets/js/Controllers/Tetris.js',
			'assets/js/Views/Tetris.js',
			'assets/js/Views/Tetronimos.js',
		],
		css: ['assets/css/tetris.css']
	});

	return Q(app);
}
