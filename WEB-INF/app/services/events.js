/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $Web, $S){
	
	var log,
	    events;
	
    $S.Events = function(options){
        $.servlet(this);
    	$.extend(true, this, options);
		log = $.logger('Site.Services.Events');
        events = $.$('#eventsModel').get();
	};
	
	$.extend($S.Events.prototype, $Web.Servlet.prototype,{
        handleGet:function(request, response){
			log.debug("Handling Get");
			response.
				m({events:events}).
				render();  
        }
    });
    
})(jQuery, Claypool.Server, Site.Services);