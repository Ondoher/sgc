var config = {
	podAppIdExceptions: {
		111: 'sgc',
        130: 'sgc-dev',
        134: 'sgc-dev',
        1045: 'sgc',
	}
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
