

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires Claypool.SimpleCachingStrategy
 */
(function($, $$){
    
    $$.Context = function(options){
        $$.extend( this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = new $$.Logging.NullLogger();
    };
        
    $.extend($$.Context.prototype,
        $$.SimpleCachingStrategy.prototype,{
        get: function(id){ throw new $$.MethodNotImplementedError();  },
        put: function(id, object){ throw new $$.MethodNotImplementedError(); }
    });

})(jQuery, Claypool);

/**
 * Descibe this class
 * @Chris Thatcher 
 * @version $Rev$
 * @requires Claypool.Context
 */
(function($, $$){	    
	$$.ContextContributor = function(options){
        $$.extend( this, $$.Context);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.ContextContributor");
    };
    
    $.extend($$.ContextContributor.prototype, 
        $$.Context.prototype, {
        registerContext: function(id){
            throw new $$.MethodNotImplementedError();
        }
    });
	
})(jQuery, Claypool);
