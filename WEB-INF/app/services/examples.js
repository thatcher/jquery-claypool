/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $Web, $S){
	
	var log,
	    examples;
	
    $S.Examples = function(options){
        $.servlet(this);
    	$.extend(true, this, options);
		log = $.logger('Site.Services.Examples');
        examples = $.$('#examplesModel').get();
	};
	
	$.extend($S.Examples.prototype, $Web.Servlet.prototype,{
        handleGet:function(request, response){
			log.debug("Handling Get");
			var id = response.params('id');
			if(id){
                //find the releases based on the id passed
                for(i=0;i<examples.length;i++){
                    if(examples[i].id == id){
                        example = examples[i]; 
                        break;
                    }
                }
                response.
                    m({
                        id:id,
                        example:example
                    }).
                    render();
            }else{
                //list all examples
	            response.
	                m({
	                    examples:examples,
	                    id:id
	                }).
	                render(); 
            }  
        }
    });
    
})(jQuery, Claypool.Server, Site.Services);