
(function($, $M){
	
    var log,
        cache;
    
    $M.Pages = function(options){
        $.extend(true, this, options);
        log = $.logger('Example.Models.Pages');
        cache = {};
    };
    
    $.extend($M.Pages.prototype, {
        get:function(id, options){
            log.debug('getting page %s', id);
            if(!cache[id]){
                $.ajax({
                    url:$.env('pages')+id+'.json',
                    dataType:'json',
                    success:function(page){
                        log.debug('got page %s', id);
                        cache[id] = page;
                        if(options && options.success ){
                            options.success(page);
                        }
                    },
                    error:function(xhr,status,e){
                        log.error('error getting page %s', id).
                            exception(e);
                        if(options && options.error){
                            options.error({
                                status: status,
                                msg: 'network error'+e
                            });
                        }
                    }
                });
            }else{
                log.debug('got cached page %s', id);
                if(options && options.success){
                    options.success(cache[id]);
                }
            }
            return this;
		}
    });
    
})(jQuery, Example.Models);