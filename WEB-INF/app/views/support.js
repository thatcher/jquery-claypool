/**
 * 
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $V){
    
    var log;
    
    $V.Support = function(options){
        $.extend(true, this, options);
        log = $.logger('Site.Views.Support')    
    };
    
    $.extend($V.Support.prototype,{
        
        render : function(model){
            log.debug("Rendering HTML Response");
            /* Thats so cool.*/
            this.write($.e4x(
                "site/html/pages/support.js",
                model, 
                true
            ));
        }
        
    });
     
})(jQuery,  Site.Views);