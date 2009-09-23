
(function($, $C){
	
    var log;
    
    $C.Pages = function(options){
        $.extend(true, this, options);
        log = $.logger('Example.Controllers.Pages');
    };
    
    $.extend($C.Pages.prototype, {
        handle:function(event){
            var id = event.params('id');
            log.debug('got id %s', id);
		}
    });
    
})(jQuery, Example.Controllers);