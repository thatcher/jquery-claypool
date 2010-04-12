/**
 * @author thatcher
 */
(function($, $V){
    
    var log;
    
    $V.Site = function(options){
        $.extend(true, this, options);
        log = $.logger('ClaypoolJS.Views.Site');
    };
    
    $.extend($V.Site.prototype, {
        render: function(model){
            log.info("Rendering html template %s ", model.template); 
            var doc = $.e4x(model.template,  model, true);
            log.debug('result of template : %s', doc);
            this.write(doc);
        }
    });
    
})(jQuery, ClaypoolJS.Views);
