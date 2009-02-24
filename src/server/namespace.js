
Claypool.Server={
/*
 * Claypool.Server @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Server (Servlet) Patterns  -
 */
};
(function($, $$, $$Web){
    /**
    $(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
        registrationFunction.apply(_this, [configuration, "hijax:server", "Claypool.MVC.HijaxController", {
            event:          'claypool:serve',
            strategy:       'first',
            routerKeys:     'urls',
            hijaxKey:       'request',
            eventNamespace: "Claypool:Server:HijaxServerController",
            getTarget:     function(event, request){ 
                return request.url;//request/response object
            }
        }]);
    });
    */
    $.router( "hijax:server", {
        event:          'claypool:serve',
        strategy:       'first',
        routerKeys:     'urls',
        hijaxKey:       'request',
        eventNamespace: "Claypool:Server:HijaxServerController",
        getTarget:     function(event, request){ 
            return request.url;//request/response object
        }
    });
    
    
})(  jQuery, Claypool, Claypool.Server );
