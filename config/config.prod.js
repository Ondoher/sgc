module.exports = {
	useCompression: true,
	builderCache: true,
	minify : true,
    port: 443,
    cors : {
       origin: [/\.symphony\.com:.*$/, /\.symphony\.com$/]
    },
    https: {
        key : fs.readFileSync(__dirname + '/certs/prod/apps.uber-geek.com.key.pem', {encoding: 'utf-8'}),
        cert : fs.readFileSync(__dirname + '/certs/prod/apps.uber-geek.com.pem', {encoding: 'utf-8'}),
    },
    baseUrl : 'https://apps.uber-geek.com/',
    cacheBust: true,
};
    sudo
