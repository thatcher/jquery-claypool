
(function($, $C){
	
    $C.Pages = function(options){
        $.extend(true, this, options);
    };
    
    $.extend($C.Pages.prototype, {
        handle:function(event){
            var id = event.params('id');
            alert('page '+id);
		}
    });
    
})(jQuery, Example.Controllers);