
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
    /**
     * @constructor
     */
    $$MVC.ContainerError = function(e){
        $.extend( this, new $$.Error(e, {
            name:"Claypool.MVC.ContainerError",
            message: "An error occurred trying to retreive a container managed object."
        }));
    };
})(  jQuery, Claypool, Claypool.MVC );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
    /**
     * @constructor
     */
    $$MVC.FactoryError = function(e){
        $.extend( this, new $$.Error(e, {
            name:"Claypool.MVC.FactoryError",
            message: "An error occured trying to create the factory object."
        }));
    };
})(  jQuery, Claypool, Claypool.MVC );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
    /**
     * @constructor
     */
    $$MVC.ConfigurationError = function(e){
        $.extend( this, new $$.ConfigurationError(e, {
            name:"Claypool.MVC.ConfigurationError",
            message: "An error occured during the configuration."
        }));
    };
    
})(  jQuery, Claypool, Claypool.MVC );
