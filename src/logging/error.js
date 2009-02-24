

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
    $$Log.ConfigurationError = function(e, options){
        $.extend( this, new $$.ConfigurationError(e, options||{
            name:"Claypool.Logging.ConfigurationError",
            message: "An error occured trying to configure the logging system."
        }));
    };
})(  jQuery, Claypool, Claypool.Logging );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
    $$Log.NoAppendersAvailableError = function(e, options){
        $.extend( this, new $$.Error(e, options||{
            name:"Claypool.Logging.NoAppendersAvailableError",
            message: "An error occured trying to configure the logging system."
        }));
    };
})(  jQuery, Claypool, Claypool.Logging );
	