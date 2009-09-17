/**
 * 
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $V){
    
    var log;
    
    $V.Docs = function(options){
        $.extend(true, this, options);
        log = $.logger('Site.Views.Docs')    
    };
    
    $.extend($V.Docs.prototype,{
        
        render : function(model){
            log.debug("Rendering HTML Response");
            var page = !model.id?'docs':
                    (model.doc&&model.doc.id=='api')?'api':'guide';
            /* Thats so cool.*/
            this.write($.e4x(
                "site/html/pages/"+page+".js",
                model, 
                true
            ));
        }
        
    });
     
})(jQuery,  Site.Views);