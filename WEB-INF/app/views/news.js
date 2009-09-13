/**
 * 
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $V){
    
    var log;
    
    $V.News = function(options){
        $.extend(true, this, options);
        log = $.logger('Site.Views.News')    
    };
    
    $.extend($V.News.prototype,{
        
        render : function(model){
            log.debug("Rendering HTML Response");
            /* Thats so cool.*/
            this.write($.e4x(
                "site/html/pages/news.js",
                model, 
                true
            ));
        }
        
    });
     
})(jQuery,  Site.Views);