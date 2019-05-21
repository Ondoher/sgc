function NavHandler() {
}
 
NavHandler.prototype = {
    implements: ['start', 'ready', 'stop', 'select'],
 
    register: function() {
        SYMPHONY.services.make('sample:navigation', this, this.implements, true);
    },
 
	start : function() {
		console.log('start');
	},

    ready : function() {
		console.log('ready');
        this.navigation = SYMPHONY.services.subscribe('navigation');
        this.navigation.addHeader('sample', 'Sample', '', 'sample:navigation');
        this.navigation.addItem('sample', 'sample-inbox', 'Sample Inbox', {}, '');
    },

	stop : function() {
		console.log('stop');
        this.navigation.removeHeader('sample');
	},
 
    select : function(header, id) {
        console.log('sample select');
    }
}

var nav = new NavHandler();
nav.register();