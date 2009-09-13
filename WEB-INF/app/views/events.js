/**
 * 
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $V){
    
    var log;
    
    $V.Events = function(options){
        $.extend(true, this, options);
        log = $.logger('Site.Views.Events')    
    };
    
    $.extend($V.Events.prototype,{
        
        render : function(model){
            log.debug("Rendering HTML Response");
            /* Thats so cool.*/
            this.write($.e4x(
                "site/html/pages/events.js",
                model, 
                true
            ));
        }
        
    });
     
})(jQuery,  Site.Views);