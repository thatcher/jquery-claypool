/**
 * 
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $V){
    
    var log;
	
    $V.Releases = function(options){
        $.extend(true, this, options);
		log = $.logger('Site.Views.Releases')    
    };
    
    $.extend($V.Releases.prototype,{
        
        render : function(model){
            log.debug("Rendering HTML Response");
            /* Thats so cool.*/
            var page = model.id?'release':'releases';
            this.write( $.e4x(
                'site/html/pages/'+page+'.js'+(model.id?'?'+model.id:''), 
                    model, 
					true
			));
        }
        
    });
     
})(jQuery,  Site.Views);