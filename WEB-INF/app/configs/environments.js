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
	    defaults:{
            root:'/',
            data:'/data/',
			context_dir:cwd,
            app_dir:'/WEB-INF/jsx/',
			templates:'file:'+cwd+'/templates/',
	        rest: {
	            SERVICE: "Any",
	            URL: "/rest",
	            AJAX: "jQuery"
	        }
	    },
	    //-------------------------------------------------------------------------------------//
	    //  -   DEVELOPMENT CONFIGURATION   -
	    //______________________________________________________________________________________//
	    dev:{
	        server:{
                monitorTemplates:'true',
	            db: {
	                DRIVER 	: "org.sqlite.JDBC",
	                PROVIDER:"JDBC",
	                DIALECT:"SQLite",
	                HOST:"jdbc:sqlite:claypool.db",
	                NAME:"example",
	                USER:"sa",
	                PASS:""
	            }
	        }
	    },
	    //-------------------------------------------------------------------------------------//
	    //  -   PRODUCTION CONFIGURATION   -
	    //______________________________________________________________________________________//
	    prod:{
	        server:{
	            db: {
	                DRIVER 	: "com.mysql.jdbc.Driver",
	                PROVIDER:"JDBC",
	                DIALECT:"MySQL",
	                HOST:"jdbc:mysql://127.0.0.1:3306/claypool",
	                USER:"example",
	                PASS:"example"
	            }
	        }
	    },
	    //-------------------------------------------------------------------------------------//
	    //  -   APPENGINE CONFIGURATION   -
	    //______________________________________________________________________________________//
	    appengine:{
	        server:{
	            templates:'http://jquery-claypool.appspot.com/templates/'
	        }
	    }
	}); 
    
})(jQuery);
    
