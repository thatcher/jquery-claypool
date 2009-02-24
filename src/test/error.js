

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MUnit){
	/**
	 * @constructor
	 */
    $$MUnit.TimedOutError = function(e, options){  
        var details = {
            name:"Claypool.MoonUnit.TimedOutError",
            message:"Test timed out."
        };$.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
	
})(  jQuery, Claypool, Claypool.MoonUnit );
