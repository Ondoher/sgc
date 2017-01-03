var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var breadCrumbs = new Feature(app, '/sgc-module/features/bread-crumbs/');

	breadCrumbs.addCSS(['assets/css/bread-crumbs.css']);
	breadCrumbs.addJS(['assets/js/Services/BreadCrumbs.js']);
	breadCrumbs.addTemplates('templates/bread-crumbs.html');;

	return Q(app);
}
