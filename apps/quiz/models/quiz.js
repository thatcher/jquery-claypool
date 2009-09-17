/**
 * Example @VERSION - 
 *
 * Copyright (c) 2008-2009 ClayoolJS
 *
 */
(function($, $M){
    
    var cache,
	    log;
	
    $M.Quiz = function(options){
		cache = {};
		log = $.logger('Example.Models.Quiz');
		return $.extend(true, this, options);
    };
	
	$.extend($M.Quiz.prototype,{
		get: function(id,callback){
			var _this = this;
			if (!cache[id]) {
				$.ajax({
					type: 'GET',
					url: $.env('root') + $.env('data') + id + '.json',
					dataType: 'json',
					success: function(json){
						log.debug('Succesfully retreived data');
						cache[id] = json;
						if (callback && $.isFunction(callback)) {
							callback(json);
						}
					}
				});
			}else{
				if (callback && $.isFunction(callback)) {
					callback(cache[id]);
   				}    
			}
		}
	});
    
    
})(jQuery,  Example.Models);