
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
            event.m({
                index:id,
                title:$.titled(3, false),
                description:$.paragraphs(3, false).join('\n')
            }).render();
		}
    });
    
})(jQuery, Example.Controllers);