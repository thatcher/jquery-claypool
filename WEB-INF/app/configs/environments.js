/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($){

	//-------------------------------------------------------------------------------------//
	//  -   ENVIRONMENTAL CONFIGURATION   -
	//______________________________________________________________________________________//
	$.env({
        automap:{
            'file:///opt':          'dev.server',
            'file:///base':         'appengine.server',
            'http://localhost':     'dev.client',
            'claypooljs\.com':      'prod.client'
        },
	    defaults:{
            root:'/',
            data:'data/',
            app_dir:'/WEB-INF/jsx/',
			templates:'templates/'
	    },
	    //-------------------------------------------------------------------------------------//
	    //  -   DEVELOPMENT CONFIGURATION   -
	    //______________________________________________________________________________________//
	    dev:{
	        server:{
            	data:'http://localhost:8080/data/',
	            templates:'http://localhost:8080/templates/',
	        }
	    },
	    //-------------------------------------------------------------------------------------//
	    //  -   TEST CONFIGURATION   -
	    //______________________________________________________________________________________//
	    version2:{
	        server:{
                templates:'http://2.latest.jquery-claypool.appspot.com/templates/'
	        }
	    },
	    //-------------------------------------------------------------------------------------//
	    //  -   APPENGINE CONFIGURATION   -
	    //______________________________________________________________________________________//
	    appengine:{
	        server:{
	            templates:'http://www.claypooljs.com/templates/'
	        }
	    }
	}); 
    
})(jQuery);
    
