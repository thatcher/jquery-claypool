/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $Web, $S){
	
	var log,
        docs,
        releases;
	
    $S.Docs = function(options){
        $.servlet(this);
    	$.extend(true, this, options);
		log = $.logger('Site.Services.Docs');
        docs = $.$('#docsModel').get();
        releases = $.$('#releasesModel').get();
	};
	
	$.extend($S.Docs.prototype, $Web.Servlet.prototype,{
        handleGet:function(request, response){
			log.debug("Handling Get");
			var id = response.params('id'),
                doc, 
                release = [],
                i;
            if(id){
                //find the docs based on the id passed
                for(i=0;i<docs.length;i++){
                    if((docs[i].id+'-'+docs[i].version) == id){
                        doc = docs[i];
                        log.debug('found doc %s', id);
                        break;
                    }
                }
                response.
                    m({
                        id:id,
                        doc:doc,
                        releases:releases
                    }).
                    render();
            }else{
                //list all docs
                response.
                    m({docs:docs}).
                    render();
            }
        }
    });
    
})(jQuery, Claypool.Server, Site.Services);