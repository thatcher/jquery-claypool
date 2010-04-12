GAE = {
    Models:{},
    Views:{},
    Controllers:{},
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
		log = $.logger('GAE.Services.Rest');
    };
	
	$.extend($S.Rest.prototype, $Web.RestServlet.prototype);
    
    
})(jQuery, Claypool, Claypool.Server, GAE.Services);

