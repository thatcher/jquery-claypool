//-------------------------------------------------------------------------------------//
//  -   LOGGERS     -
//  - Loggers can be enabled or disabled, turned up or turned downed here.  There
//  - are five levels for loggers, DEBUG, INFO, WARN, ERROR, and NONE.  Each level
//  - will include log messages from higher levels but not lower.  So DEBUG will
//  - print all messages while WARN will include error messages but not info and 
//  - debug messages.
//  -
//  - Understanding Logging Categories is critical to using logging effectively.  Every
//  - new logger is created with a '.' delimited name, and that name should represent
//  - some hierarchy.  Best practice is to use Namespaces and ClassNames that represent
//  - the given class.  For example 'MetaSeach.SessionController' would be a good name.
//  - If you want to only get warning messages from the MetasSearch components, but want
//  - to get all messages from MetaSearch.SessionController you can have seperate 
//  - configurations for each.
//  -
//  - By default, all Categories that are not explicitly configured will use the 'root'
//  - configuration (see below).
//_____________________________________________________________________________________//
(function($){
	$.merge( $.Configuration.logging, [
        { category:"root", 					level:"WARN" },
        { category:"API",  					level:"DEBUG" },
        { category:"API.Models", 			level:"DEBUG" },
        { category:"API.Views", 			level:"DEBUG" },
        { category:"API.Controllers", 		level:"DEBUG" },
        { category:"Claypool.IoC", 			level:"DEBUG" }
    ]);
})(jQuery);
