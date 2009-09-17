/**
 * 
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, $V){
    
    var log;
    
    $V.Examples = function(options){
        $.extend(true, this, options);
        log = $.logger('Site.Views.Examples')    
    };
    
    $.extend($V.Examples.prototype,{
        
        render : function(model){
            log.debug("Rendering HTML Response");
            var page = model.id?'examples/'+model.id:'examples';
            this.write( $.e4x(
                'site/html/pages/'+page+'.js'+(model.id?'?'+model.id:''), 
                    model, 
                    true
            ));
        }
        
    });
     
})(jQuery,  Site.Views);