/**
 * @author thatcher
 */

(function($){

   $.routes({
        "hijax:server": [{
            id:"#site-routes",
            hijaxMap:
                [{ urls :"/jsx/$",                controller:"#siteService",    action:"home"},
                 { urls :"/docs$",                controller:"#siteService",    action:"docs"},
                 { urls :"/doc/<:id(.*):>$",      controller:"#siteService",    action:"doc"},
                 { urls :"/events$",              controller:"#siteService",    action:"events"},
                 { urls :"/event/|:id|/?$",       controller:"#siteService",    action:"event"},
                 { urls :"/examples$",            controller:"#siteService",    action:"examples"},
                 { urls :"/example/<:id(.*):>$",  controller:"#siteService",    action:"example"},
                 { urls :"/home$",                controller:"#siteService",    action:"home"},
                 { urls :"/news$",                controller:"#siteService",    action:"news"},
                 { urls :"/releases$",            controller:"#siteService",    action:"releases"},
                 { urls :"/release/<:id(.*):>$",  controller:"#siteService",    action:"release"},
                 { urls :"/support$",             controller:"#siteService",    action:"support"},
                 { urls :"/error$",               controller:"#siteService",    action:"error"}]
        }]
    });
    
	
})(jQuery);
