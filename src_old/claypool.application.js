Claypool.Application={
/*
 * Claypool.Application @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 */
};
(function($, $Log, $App){
	var CONTEXT_PRIORITY = 0;
	$.extend( $App, {
	    context:null,
	    /**@static   */
	    getContext: function(){
	        if(!$App.context){
	            $App.context = new $App.Context();
	        }
	        return $App.context;
	    },
	    /**@static   */
	    Initialize: function(callback){
	        /**we intentionally do not attempt to try or catch anything here
	        If loading the current application.context fails, the app needs to fail*/
	        jQuery(document).trigger("claypool:initialize", [$App]);
	        //Allow extension of Initialize via callback
	        if(callback){callback();}
	        //Provide standard event hook
	        jQuery(document).trigger("ApplicationLoaded");
	        /**now return the applicationContext ready to use*/
	        return $App.getContext();
	    },
	    /** @static   */
	    Reinitialize: function(callback){
	        /**we probably should try/catch here*/
	        jQuery(document).trigger("claypool:reinitialize", [$App]);
	        //Allow extension of Initialize via callback
	        if(callback){callback();}
	        //Provide standard event hook
	        jQuery(document).trigger("ApplicationReloaded");
	        /**now return the applicationContext ready to use*/
	        return $App.getContext();
	    },
	    /**@class*/
	    Context$Class:{
	        contextContributors:{},//static member
	        constructor: function(options){
	            $.extend( this, new $.Context(options));
	            $.extend( this, $App.Context$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.Application.Context");
	        },
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
	                throw new $App.ContextError(e);
	            }
	        },
	        put: function(id, object){
	            /**We may want to use a different strategy here so that 'put'
	            will look for a matching id and update the entry even in a contributor.*/
	            this.logger.debug("Adding object to global application context %s", id);
	            this.add(id, object);
	        }
	    },
	    /**@class
	    * Extending this class, a container is searched using its 'get' method when
	    * anyone looks for something in the applicationContext
	    */
	    ContextContributor$Class:{
	        constructor: function(options){
	            //??TODO: this works but, uh... why? $.extend( this, new $.ContextContributor(options));
	            $.extend( this, $App.ContextContributor$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.Application.ContextContributor");
	            return this;
	        },
	        registerContext: function(id){
	            this.logger.info("Registering Context id: %s", id);
	            $App.getContext().contextContributors[id] = this;
	        }
	    },
	    /**@class*/
	    Aware$Class:{
	        //The application context is generally provided by the ioc container
	        //but other modules can add to it as well.
	        constructor: function(options){
	            $.extend( this, $App.Aware$Class);
	            $.extend( this, options);
	            this.logger = $Log.getLogger("Claypool.Application.Aware");
	        },
	        getApplicationContext: function(){
	            return $App.getContext();
	        }
	    },
	    /**@exception*/
	    ContextError$Class:{
	        constructor: function(e, options){var details = {
	                name:"Claypool.Application.ContextError",
	                message:"An unexpected error occured while searching the application context."
	            };
	            $.extend( this, new $.Error(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    }
	});
	//Register the Application Context
	$.register($App, CONTEXT_PRIORITY);
	
	/**@constructorAlias*/
	$App.Context                 = $App.Context$Class.constructor;
	/**@constructorAlias*/
	$App.ContextContributor      = $App.ContextContributor$Class.constructor;
	/**@constructorAlias*/
	$App.Aware                   = $App.Aware$Class.constructor;
	
	//Exception Classes
	/**@constructorAlias*/
	$App.ContextError            = $App.ContextError$Class.constructor;

})( Claypool, /*Required Modules*/
	Claypool.Logging, 
	Claypool.Application );

//Give a little bit, Give a little bit of our application to you. ;)
(function($){ 
	$.Application = Claypool.Application;
})(jQuery);
