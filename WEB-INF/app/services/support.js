/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $Web, $S){
	
	var log;
	
    $S.Support = function(options){
        $.servlet(this);
    	$.extend(true, this, options);
		log = $.logger('Site.Services.Support');
	};
	
	$.extend($S.Support.prototype, $Web.Servlet.prototype,{
        handleGet:function(request, response){
			log.debug("Handling Get");
			response.
				m({
					msg:'hello',
					name:'world'
				}).render();  
        }
    });
    
})(jQuery, Claypool.Server, Site.Services);