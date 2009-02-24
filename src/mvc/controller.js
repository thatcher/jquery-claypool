
/**
 * In Claypool a controller is meant to be a wrapper for a generally 'atomic'
 * unit of business logic. 
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
	/**
	 * @constructor
	 */
	$$MVC.Controller = function(options){
        this.model  = null;
        this.view   = null;
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.MVC.Controller");
    };
    $.extend($$MVC.Controller.prototype,
        $$.SimpleCachingStrategy.prototype,{
        handle: function(event){
            throw new $$.MethodNotImplementedError();
        }
    });
	
})(  jQuery, Claypool, Claypool.MVC );
