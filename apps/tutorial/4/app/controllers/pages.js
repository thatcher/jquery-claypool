
(function($, $C){
	
    var log,
        Pages;
    
    $C.Pages = function(options){
        $.extend(true, this, options);
        log = $.logger('Example.Controllers.Pages');
        Pages = $.$('#pagesModel');
    };
    
    $.extend($C.Pages.prototype, {
        handle:function(event){
            var id = event.params('id');
            log.debug('got id %s', id);
            Pages.get(id,{
                success: function(page){
                    event.m({
                        index:id,
                        title:page.title,
                        description:page.description
                    }).render();
                }
            });
               
		}
    });
    
})(jQuery, Example.Controllers);