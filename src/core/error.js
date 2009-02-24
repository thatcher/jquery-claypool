

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    /**
     * @constructor
     */
    $$.Error = function(e, options){
        $.extend(true, this, e||new Error());
        this.name = (options&&options.name?options.name:"Claypool.UnknownError") +
            " > Claypool.Error" + (this.name?(" > "+this.name):"") ;
        this.message = (options&&options.name?options.name:"No Message Provided \n Nested exception is:\n\t") +
            (this.message||"UnknownError");
    };
    
})(jQuery, Claypool);

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    /**
     * @constructor
     */
    $$.ConfigurationError = function(e, options){
        var details = {
            name:"Claypool.ConfigurationError",
            message:"An error occured trying to locate or load the system configuration."
        };
        $.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
    
})(jQuery, Claypool);
        

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    /**
     * @constructor
     */
    $$.MethodNotImplementedError = function(e, options){
        var details = {
            name:"Claypool.MethodNotImplementedError",
            message:"Method not implemented."
        };
        $.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
    
})(jQuery, Claypool);
        

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    /**
     * @constructor
     */
    $$.NameResolutionError = function(e, options){
        var details = {
            name:"Claypool.NameResolutionError",
            message:"Unexpected error resolving name."
        };
        $.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
    
})(jQuery, Claypool);
