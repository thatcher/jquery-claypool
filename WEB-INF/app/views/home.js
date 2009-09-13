/**
 * 
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $V){
    
	var log;
	
    $V.Home = function(options){
        $.extend(true, this, options);   
		log = $.logger('Site.Views.Home'); 
    };
    
    $.extend($V.Home.prototype,{
        
        render : function(model){
            log.debug("Rendering HTML Response");
            /* Thats so cool.*/
            this.write($.e4x(
				"site/html/pages/home.js",
				model, 
				true
			));
        }
		
    });
     
})(jQuery,  Site.Views);