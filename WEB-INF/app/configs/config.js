var Site = {
/**
 * Site Claypool @VERSION - 
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
 //  -   NAMESPACE DECLARATIONS   -
 //  It's good form to go ahead and declare the additional namespaces you might be using
 //  here.  We define just a couple standards.  Additional nested namespaces are very 
 //  useful for isolating application log message based on the categories defined by
 //  the namespace.
	Models:{},
	Views:{},
	Controllers:{},
	Services:{}
};
(function($){
 	
	//Scanning is a simple convention over configuration
	//pattern.  All functions on the namespace can be accessed
	//via $.$, which will create the instance the first time
	//eg $.$('#fooModel') will return a new MyApp.Models.Foo
    $.scan([
       "Site.Models", 
       "Site.Views", 
       "Site.Services"
    ]);
	
})(jQuery, Site);
    
