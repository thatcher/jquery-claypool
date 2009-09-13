/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $Web, $S){
	
	var log,
	    news;
	
    $S.News = function(options){
        $.servlet(this);
    	$.extend(true, this, options);
		log = $.logger('Site.Services.News');
        news = $.$('#newsModel').get();
	};
	
	$.extend($S.News.prototype, $Web.Servlet.prototype,{
        handleGet:function(request, response){
			log.debug("Handling Get");
			response.
				m({news:news}).
				render();  
        }
    });
    
})(jQuery, Claypool.Server, Site.Services);