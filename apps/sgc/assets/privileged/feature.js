function NavHandler() {
}
 
NavHandler.prototype = {
    implements: ['select', 'reinit', 'unload'],
 
    register: function() {
        SYMPHONY.services.make('sample-navigation', this, this.implements, true);
    },
 
	start : function() {
		console.log('start');
        this.navigation = SYMPHONY.services.subscribe('navigation');
        this.navigation.addHeader('sample', 'Sample', '', 'sample-navigation');
        this.navigation.addItem('sample', 'sample-inbox', 'Sample Inbox', {}, '');
	},

    reinit : function() {
		console.log('reinit');
        this.start();
    },

    unload : function() {
		console.log('unload');
        this.stop();
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
nav.start();