//-------------------------------------------------------------------------------------//
//  -  MVC CONFIGURATION   -
//  - This is a mvc configuration file for a claypool application.  It demonstrates the
//  - basic ability of  MVC wiring that is supported by claypool as
//  - well as the Category Logging API.
//______________________________________________________________________________________//
(function($){
	//-------------------------------------------------------------------------------------//
	//  -   ROUTERS     -
	//  - Routers are low level controllers that hijax the browsers normal behaviour 
	//  - forwarding control to a high level controller that you've written.  In particular
	//  - we use links, form sumbission, and events (Claypool.Server includes support
	//  - for http request routing).
	//  -
	//  - Also it's important to note that you dont have to use these low level controllers,
	//  - but they help to reduce the memory consumption of an application because the
	//  - high level controllers are not created until needed.
	//  -
	//  - Both links and forms can be hijaxed using regular expression matches to the
	//  - href and action atrribute respectively. 
	//  - 
	//  - When no action is specified for a given controller, the default method 'handle'
	//  - will be called.
	//_____________________________________________________________________________________//
	$.extend(true, $.Configuration.mvc, {
		//Hijax Links
		"hijax:a":[{
	        id:"#apiLinkController",	
	        active:"true",				//affect dynamically created links
	        filter:"[href~='.wiki']",	//affect only links with the substring '.wiki'
	        stopPropagation:false,		//allows other event listeners to function
	        preventDefault:true,		//dont allow the default browser behavior
	        hijaxMap:
	          [{urls:".wiki",   controller:"#navController",    action:"load"}]
	           
		},{
	        id:"#apiTabLinkController",	
	        active:"true",				//affect dynamically created links
	        filter:"[href~='#']",		//affect only links with the hash'
	        stopPropagation:false,		//allows other event listeners to function
	        preventDefault:true,		//dont allow the default browser behavior
	        hijaxMap:
	          [{	
	          	urls:"(#Basics|#StaticMethods|#Interface|#Abstracts|#Classes|#Exceptions)",   
	          	controller:"#navController",    
	          	action:"load"
	          }]
	           
		}],
		
		//Hijax Events
		"hijax:event": [{
	        id:"#apiEventController",
	        hijaxMap:
	          [{event:"ApplicationLoaded", controller:"#navController", action:"loadDefault"}]
		}]	
	});
})(jQuery);