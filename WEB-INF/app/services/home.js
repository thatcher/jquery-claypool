/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $Web, $S){
	
    var log,
		releases,
		news,
		events;
	
    $S.Home = function(options){
        $.servlet(this);
    	$.extend(true, this, options);
        log = $.logger('Site.Services.Home');;
        releases = $.$('#releasesModel').get();
        news = $.$('#newsModel').get();
        events = $.$('#eventsModel').get();
	};
	
	$.extend($S.Home.prototype, $Web.Servlet.prototype,{
        handleGet:function(request, response){
			log.debug("Handling Get");
            response.
                m({
                    recent:releases.slice(0,releases.length>1?2:1),
                    news: news.slice(0,news.length>2?3:news.length),
                    events: events.slice(0,events.length>2?3:events.length)
                }).
                render();
        }
    });
    
})(jQuery, Claypool.Server, Site.Services);