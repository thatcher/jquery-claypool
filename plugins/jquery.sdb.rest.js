SDB = {
    Services:{}
};

/**
 * @author thatcher
 */
(function($, $$, $Web, $S){
    
    var log;
    
    $S.Rest = function(options){
        $$.extend(this, $Web.RestServlet);
        $.extend(true, this, options);
		/**this.db =  new $.sdb({'default':{
            endpoint:    $.env('endpoint'),
            accessKeyId: $.env('accessKeyId'),
            secretKey:   $.env('secretKey'),
            method:      $.env('method'),
            dataType:    $.env('dataType')
        }});*/
		log = $.logger('SDB.Services.Rest');
    };
	
	$.extend($S.Rest.prototype, $Web.RestServlet.prototype);
    
    
})(jQuery, Claypool, Claypool.Server, SDB.Services);
