fs = require('fs');

var config = {
	port: 8081,
	useCompression: false,
	builderCache: false,
	minify : false,
	cors : {
	   origin: [/\.symphony\.com:.*$/, /\.symphony\.com$/]
	},
	https: {
		key : fs.readFileSync(__dirname + '/certs/localhost/localhost.key', {encoding: 'utf-8'}),
		cert : fs.readFileSync(__dirname + '/certs/localhost/localhost.cert', {encoding: 'utf-8'}),
	},
	baseUrl : 'https://localhost:8081/',
}

var env = process.env.node_env;

envConfig = {};
try
{
	if (env) envConfig = require('./config.' + env);
}
catch (e)
{
}

module.exports = Object.merge(config, envConfig);
