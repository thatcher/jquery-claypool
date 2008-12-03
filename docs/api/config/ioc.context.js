//-------------------------------------------------------------------------------------//
//  -   IoC CONFIGURATION   -
//  - This is a configuration file for a claypool application.  It demonstrates the
//  - basic ability of IoC, AOP, and MVC wiring that is supported by claypool as
//  - well as the Category Logging API.
//______________________________________________________________________________________//
(function($){
	$.merge($.Configuration.ioc, [
        //-------------------------------------------------------------------------------------//
        //  -   MODELS  -
        //  - Models *should* be JSON serializable.  This includes xml, but more importanlty
        //  - should disclude any functions. Simple types, {}, and [].
        //  -
        //  - DataAccessObjects implement a specific approach to access models.  This might 
        //  - cached objects, restful server resources in xml/json, client-side resources
        //  - that are persisted via gears.
        //  -
        //  -   ApiModel (XML and ObjTree)
        //  - Straightforward json with getScript for speed since own the urls, not actually used
        //  -   by the application
        //  -
        //  -   #apiDAO ->  In this case DataAccessObject is a clean simple xmldb ReST
        //  - implementation which manages the specifics of urls and resource manifest
        //  - maps.
        //______________________________________________________________________________________//
        {   id:"#tracWiki",         clazz:"API.Models.TracWiki", 
            options:[{
            	serviceUrl:"/server/wiki.proxy",
            	mode:"param",
            	//serviceUrl:"/docs/api/data/",
            	//mode:"path",
            	hashKeys: ["Basics", "StaticMethods", "Interfaces", "Abstracts", "Classes", "Exceptions"],
            	defaultHash : "Basics",
            	defaultUrl:"/docs/api/core.wiki",
                manifest: [
                    { source:"/docs/api/core.wiki",      				target:"ClaypoolApiCore"},
                    { source:"/docs/api/logging.wiki",     				target:"ClaypoolApiLogging"},
                    { source:"/docs/api/application.wiki", 				target:"ClaypoolApiApplication"},
                    { source:"/docs/api/ioc.wiki",         				target:"ClaypoolApiIoc"},
                    { source:"/docs/api/mvc.wiki",         				target:"ClaypoolApiMvc"},
                    { source:"/docs/api/aop.wiki",         				target:"ClaypoolApiAop"}
                ]
            }]
        },
        //-------------------------------------------------------------------------------------//
        //  -   VIEWS   -
        //  - Each View or DomAccessObject is a class that is ussually attached to a DOM
        //  - element(s) identified by a jQuery selector ( a css3 selctor). Views are flexible
        //  - in terms of the implementation, it only needs to implement the 'update' method
        //  - which modifies the dom depending on the 'model' object passed to it.
        //
        //_____________________________________________________________________________________//
        {   id:"#api",   clazz:"API.Views.Page",         selector:"#api" ,
        	inject:{ creole:"ref://#creole"  }
    	},
        {   id:"#creole",   clazz:"Parse.Simple.Creole",  
        	options:[{
		        interwiki: {
		            WikiCreole: 'http://www.wikicreole.org/wiki/',
		            Wikipedia: 'http://en.wikipedia.org/wiki/'
		        },
		        linkFormat: ''
		    }]
        },
        //-------------------------------------------------------------------------------------//
        //  -   CONTROLLERS -
        //  - Controllers contain the business logic the application.  Event, links, and forms
        //  - are routed to the controllers in the mvc configuration section. (see section commented
        //  - with title 'ROUTERS'). Simple controller ussually implements the 'handle' method
        //  - but 'multi-action' controllers can implement any methods they choose and only need
        //  - to supply the specified endpoint in the configuration (see ROUTERS below.)
        //  -
        //_____________________________________________________________________________________//
        {  id:"#navController",       clazz:"API.Controllers.Nav" ,
            inject:{ tracWiki:"ref://#tracWiki"  }
        }
    ]);
})(jQuery);