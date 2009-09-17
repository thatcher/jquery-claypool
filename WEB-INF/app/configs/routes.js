/**
 * @author thatcher
 */

(function($){

   $.mvc({
        "hijax:server" : [{
            id:"#envjs-server-routes",
            hijaxMap:
             [{ urls :"/jsx/$",              controller:"#homeService"},
              { urls :"/docs$",              controller:"#docsService"},
              { urls :"/doc/<:id(.*):>",     controller:"#docsService"},
              { urls :"/support",            controller:"#supportService"},
              { urls :"/error$",             controller:"#errorService"},
              { urls :"/events$",            controller:"#eventsService"},
              { urls :"/event/<:id(.*):>",   controller:"#eventsService"},
              { urls :"/examples$",          controller:"#examplesService"},
              { urls :"/example/<:id(.*):>", controller:"#examplesService"},
              { urls :"/home$",              controller:"#homeService"},
              { urls :"/news$",              controller:"#newsService"},
              { urls :"/news/<:id(.*):>",    controller:"#newsService"},
              { urls :"/releases$",          controller:"#releasesService"},
              { urls :"/release/<:id(.*):>", controller:"#releasesService"}]
        }]   
    });
	
})(jQuery);
