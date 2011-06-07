
/**
 * In Claypool a controller is meant to be expose various 
 * aggregations of event-scope state.
 * 
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
	/**
	 * @constructor
	 */
	$$MVC.Controller = function(options){
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.MVC.Controller");
    };
    $.extend($$MVC.Controller.prototype,
        $$.SimpleCachingStrategy.prototype,{
        handle: function(event){
            throw "MethodNotImplementedError";
        }
    });
	
})(  jQuery, Claypool, Claypool.MVC );
