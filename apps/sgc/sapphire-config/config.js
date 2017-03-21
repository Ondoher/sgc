var config = {
	podAppIdExceptions: {
		111: 'sgc',
		130: 'sgc-dev',
		1045: '0996c26cd1a440dcb0effa89f749163c',
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
