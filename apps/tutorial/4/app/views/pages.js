
(function($, $V){
	
    var log;
    
    $V.Pages = function(options){
        $.extend(true, this, options);
        log = $.logger('Example.Views.Pages');
    };
    
    $.extend($V.Pages.prototype, {
        update:function(model){
            log.debug('updating page %s', model.index);
            $('#index').text(model.index);
            $('#title', this).text(model.title);
            $('#description', this).text(model.description);
		}
    });
    
})(jQuery, Example.Views);