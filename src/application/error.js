

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$App){
    /**
     * @constructor
     */
    $$App.ContextError = function(e, options){
        var details = {
            name:"Claypool.Application.ContextError",
            message:"An unexpected error occured while searching the application context."
        };
        $.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
    
})(  jQuery, Claypool, Claypool.Application );
