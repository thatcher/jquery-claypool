Claypool.Application={
/*
 * Claypool.Application @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 */
};

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$App){
    
    var CONTEXT_PRIORITY = 0;
    $$App.context = null;
	
	
	$.extend( $$App, {
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns Describe what it returns
	     * @type String
	     */
	    getContext: function(){
	        if(!$$App.context){
	            $$App.context = new $$App.Context();
	        }
	        return $$App.context;
	    },
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns Describe what it returns
	     * @type String
	     */
	    Initialize: function(callback){
	        /**
	         * we intentionally do not attempt to try or catch anything here
	         * If loading the current application.context fails, the app needs to fail
	         */
	        $(document).trigger("claypool:initialize", [$$App]);
	        //Allow extension of Initialize via callback
	        if(callback){callback();}
	        //Provide standard event hook
	        $(document).trigger("ApplicationLoaded");
	        /**now return the applicationContext ready to use*/
	        return $$App.getContext();
	    },
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns Describe what it returns
	     * @type String
	     */
	    Reinitialize: function(callback){
	        /**we probably should try/catch here*/
	        $(document).trigger("claypool:reinitialize", [$$App]);
	        //Allow extension of Initialize via callback
	        if(callback){callback();}
	        //Provide standard event hook
	        $(document).trigger("ApplicationReloaded");
	        /**now return the applicationContext ready to use*/
	        return $$App.getContext();
	    }
    });
    
	//Register the Application Context
	$.register($$App, CONTEXT_PRIORITY);
	
})(  jQuery, Claypool, Claypool.Application );


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
    $$App.Context = function(options){
        $$.extend(this, $$.Context);
        this.contextContributors = {};
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Application.Context");
    };
    
    $.extend($$App.Context.prototype,
        $$.Context.prototype,{
        get: function(id){
            /**we always look in the global first and then through contributors in order*/
            var contextObject;
            var contributor;
            try{
                this.logger.debug("Searching application context for object: %s" ,id);
                contextObject = null;
                contextObject = this.find(id);
                if(contextObject !== null){
                    this.logger.debug("Found object in global application context. Object id: %s", id);
                    return contextObject;
                }else{
                    this.logger.debug("Searching for object in contributed application context. Object id: %s", id);
                    for(contributor in this.contextContributors){
                        this.logger.debug("Checking Application Context Contributor %s." , contributor);
                        contextObject = this.contextContributors[contributor].get(id);
                        if(contextObject !== null){
                            this.logger.debug("Found object in contributed application context. Object id: %s", id);
                            return contextObject;
                        }
                    }
                }
                this.logger.debug("Cannot find object in any application context. Object id: %s", id);
                return null;
            }catch(e){
                throw new $$App.ContextError(e);
            }
        },
        put: function(id, object){
            /**We may want to use a different strategy here so that 'put'
            will look for a matching id and update the entry even in a contributor.*/
            this.logger.debug("Adding object to global application context %s", id);
            this.add(id, object);
        }
    });

})(  jQuery, Claypool, Claypool.Application );

/**
 * Extending this class, a container is searched using its 'get' method when
 * anyone looks for something in the applicationContext
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$App){
        /**
         * @constructor
         */
        $$App.ContextContributor = function(options){
            //??TODO: this works but, uh... why? $.extend( this, new $.ContextContributor(options));
            $$.extend(this, $$.ContextContributor);
            $.extend(true, this, options);
            this.logger = $.logger("Claypool.Application.ContextContributor");
            return this;
        };
        
        $.extend($$App.ContextContributor.prototype, 
            $$.ContextContributor.prototype,{
            registerContext: function(id){
                this.logger.info("Registering Context id: %s", id);
                $$App.getContext().contextContributors[id] = this;
            }
        });
        
})(  jQuery, Claypool, Claypool.Application );

/**
 * The application context is generally provided by the ioc container
 * but other modules can add to it as well.
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$App){
        /**@class*/
        $$App.Aware = function(options){
            $.extend( this, options);
            this.logger = $.logger("Claypool.Application.Aware");
        };
        $.extend($$App.Aware.prototype, {
            /**
             * Describe what this method does
             * @private
             * @param {String} paramName Describe this parameter
             * @returns Describe what it returns
             * @type String
             */
            //TODO: change method name to $ (DONE: was getApplicationContext)
            $: function(){
                return $$App.getContext();
            }
        });
    
})(  jQuery, Claypool, Claypool.Application );


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

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$App){
    
    $.extend($,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        app : function(){
            return $$App.getContext();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        boot : function(cb){
            $$App.Initialize(cb);
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        reboot : function(cb){
            $$App.Reinitialize(cb);
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        manage : function(containerName, managedId, callback){
            $(document).bind("claypool:initialize", function(event, context){
                if(!context[managedId]){
                    context[managedId] = new ($.resolve( containerName ))();
                    if(context.ContextContributor && $.isFunction(context.ContextContributor)){
                        context[managedId].registerContext(containerName);
                    }
                }else{
                    context[managedId].factory.updateConfig();
                }
                //allow managed containers to register callbacks post creation
                if(callback && $.isFunction(callback)){
                    callback(context[managedId]);
                }
            }).bind("claypool:reinitialize", function(event, context){
                //TODO: need to do a better job cleaning slate here.
                context[managedId] = new ($.resolve( containerName ))();
                if(context.ContextContributor && $.isFunction(context.ContextContributor)){
                    context[managedId].registerContext(containerName);
                }
                //allow managed containers to register callbacks post creation
                if(callback && $.isFunction(callback)){
                    callback(context[managedId]);
                }
            });
            return this;
        }
    });
	
})(  jQuery, Claypool, Claypool.Application );
