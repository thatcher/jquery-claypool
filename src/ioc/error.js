


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
    /**
     * @constructor
     */
    $$IoC.ContainerError = function(e){
        $.extend( this, new $$.Error(e, {
            name:"Claypool.IoC.ContainerError",
            message: "An error occured in the ioc instance factory."
        }));
    };
})(  jQuery, Claypool, Claypool.IoC );
        
        


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
    /**
     * @constructor
     */
    $$IoC.FactoryError = function(e){
        $.extend( this, new $$.Error(e, {
            name:"Claypool.IoC.FactoryError",
            message: "An error occured in the ioc factory."
        }));
    };
})(  jQuery, Claypool, Claypool.IoC );
        
        


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
    /**
     * @constructor
     */
    $$IoC.ConfigurationError = function(e){
        $.extend( this, new $$.ConfigurationError(e, {
            name:"Claypool.IoC.ConfigurationError",
            message: "An error occured updating the ioc container configuration."
        }));
    };
})(  jQuery, Claypool, Claypool.IoC );
        
        


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
    /**
     * @constructor
     */
    $$IoC.LifeCycleError = function(e){
        $.extend( this, new $$.Error(e, {
            name:"Claypool.IoC.LifeCycleError",
            message: "An error occured during the lifecycle process."
        }));
    };
})(  jQuery, Claypool, Claypool.IoC );
        
        


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
    /**
     * @constructor
     */
    $$IoC.ConstructorResolutionError = function(e){
        $.extend( this, new $$.NameResolutionError(e, {
            name:"Claypool.IoC.ConstructorResolutionError",
            message: "An error occured trying to resolve the constructor."
        }));
    };
    
})(  jQuery, Claypool, Claypool.IoC );
