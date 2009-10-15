var Claypool={
/**
 * Claypool jquery.claypool.1.0.8 - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */
	Logging:{
	    //because we log in core we need a safe way to null logging
	    //if the real Claypool.Logging isnt present.  This is the safety.
	},
	extend : function(t, $class, args){
	    $class.apply(t,args||[]);
    }
};

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
    
    $$.Logging.NullLogger = function(){
        //for speed why bother implement the interface, just null the functions
        var nullFunction=function(){
            return this;
        };
        $.extend(this,  {
            debug:nullFunction,
            info:nullFunction,
            warn:nullFunction,
            error:nullFunction,
            exception:nullFunction
        });
        return this;
    };
    
    $.extend($$.Logging.NullLogger.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
	    getLogger	: function(){
	    	return new $$.Logging.NullLogger();
	    }
	});
	
	
})(jQuery, Claypool);


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    
    $$.Configuration = {
        /** Please see each module for specific configuration options */
        //this is a short list of well knowns, but can always be '$.extend'ed
        ioc:[], 
        aop:[], 
        logging:[], 
        mvc:{ 
        	"hijax:a":[],
        	"hijax:form":[],
        	"hijax:button":[],
        	"hijax:event":[]
	    },
    	env : {
    	  dev:{},
    	  prod:{},
    	  test:{}
    	}
    };

})(  jQuery, Claypool );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    
    $$.CachingStrategy$Interface = {
        cache:  null,
        size:   null,
        clear:  function(){ throw new $$.MethodNotImplementedError(); },
        add:    function(id, object){ throw new $$.MethodNotImplementedError(); },
        remove: function(id){ throw new $$.MethodNotImplementedError(); },
        find:   function(id){ throw new $$.MethodNotImplementedError(); }
    };

})(  jQuery, Claypool );
  

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
    $$.SimpleCachingStrategy = function(options){
        $.extend(true, this, options);
        this.logger = new $$.Logging.NullLogger();
        this.clear();
        return this;
    };
    
    $.extend($$.SimpleCachingStrategy.prototype, 
        $$.CachingStrategy$Interface,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        clear: function(){
            this.logger.debug("Clearing Cache.");
    		this.cache = null;
    		this.cache = {};
    		this.size = 0;
    	},
    	/**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	add: function(id, object){
	        this.logger.debug("Adding To Cache: %s", id);
		    if ( !this.cache[id] ){
    			this.cache[id] = object;
    			this.size++;
    			return id;
    		}
    		return null;
    	},
    	/**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	remove: function(id){
    	    this.logger.debug("Removing From Cache id: %s", id);
    	    if(this.find(id)){
    	        return (delete this.cache[id])?--this.size:-1; 
    	    }return null;
    	},
    	/**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	find: function(id){
    	    this.logger.debug("Searching Cache for id: %s", id);
    		return this.cache[id] || null;
    	}
    	
    });
	
})(  jQuery, Claypool );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires Claypool.SimpleCachingStrategy
 */
(function($, $$){
    
    $$.Context = function(options){
        $$.extend( this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = new $$.Logging.NullLogger();
    };
        
    $.extend($$.Context.prototype,
        $$.SimpleCachingStrategy.prototype,{
        get: function(id){ throw new $$.MethodNotImplementedError();  },
        put: function(id, object){ throw new $$.MethodNotImplementedError(); }
    });

})(jQuery, Claypool);

/**
 * Descibe this class
 * @Chris Thatcher 
 * @version $Rev$
 * @requires Claypool.Context
 */
(function($, $$){	    
	$$.ContextContributor = function(options){
        $$.extend( this, $$.Context);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.ContextContributor");
    };
    
    $.extend($$.ContextContributor.prototype, 
        $$.Context.prototype, {
        registerContext: function(id){
            throw new $$.MethodNotImplementedError();
        }
    });
	
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
    $$.Router = function(options){
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $$.Logging.getLogger("Claypool.Router");
    };
    
    $.extend($$.Router.prototype, 
        $$.SimpleCachingStrategy.prototype, {
        /**the pattern map is any object, the pattern key is the name of 
        the objects property which is treated as a string to be compiled to
        a regular expression, The pattern key can actually be a '|' seperated
        set of strings.  the first one that is a property of the map will be used*/
        
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        compile: function(patternMap, patternKey){
            this.logger.debug("compiling patterns for match strategies");
            var pattern, routable, params;
            var i, j; 
            patternKey = patternKey.split('|');//supports flexible pattern keys
            for(i=0;i<patternMap.length;i++){
                for( j = 0; j<patternKey.length;j++){
                    pattern = patternMap[i][patternKey[j]];
					params = [];
                    if(pattern){
                        this.logger.debug("Compiling \n\tpattern: %s for \n\ttarget.", pattern);
						/**
						 * Suggestion from Martin Hrabovčin
						 * allow capturing via |:param|
						 * also added '<:foo(regexp):>/<:bar(regexp):>'
						 */
                        pattern = pattern.replace(/\<\:(.+?)\:\>/g, function(){
							var name, i = arguments[0].indexOf('(');
							name = arguments[0].substring(2,i);
							params.push(name);
							return arguments[0].substring(i,arguments[0].length-2);
						});
						pattern = pattern.replace(/\|\:\w+\|/g, function(){
							var name;
							name = arguments[0].substring(2,arguments[0].length-1);
							params.push(name);
							return '(\\w+)';
						});
                        /**pattern might be used more than once so we need a unique key to store the route*/
                        this.add(String($.guid()) , {
                            pattern:new RegExp(pattern), 
                            payload:patternMap[i],
							params : params
                        });
                    }
                }
            }
            return this;
        },

        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        
        first: function(string){
            this.logger.debug("Using strategy 'first'");
            var route, id, map = {};
            for(id in this.cache){
                route = this.find(id);
                this.logger.debug("checking pattern %s for string %s", route.pattern, string);
                if(route&&route.pattern&&route.pattern.test&&route.pattern.test(string)){
                    this.logger.debug("found match for \n\tpattern: %s \n\ttarget : %s ", 
                        route.pattern, route.payload.controller||route.payload.rewrite );
					if (route.params && route.params.length > 0) {
						//make a parameter map
						string.replace(route.pattern, function(){
							var i;
							for (i = 1; i < arguments.length - 2; i++) {
								map[route.params[i-1]] = arguments[i];
							}
						});
					}
                    return [$.extend({map: map}, route)];
                }
            }
            this.logger.debug("found no match for \n\tpattern: %s", string);
            return [];
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        all: function(string){
            this.logger.debug("Using strategy 'all'");
            var routeList = [];
            var route, id, map = {};
            for(id in this.cache){
                route = this.find(id);
                this.logger.debug("checking pattern: %s for string %s", route.pattern, string);
                if(route&&route.pattern&&route.pattern.test&&route.pattern.test(string)){
                    this.logger.debug("found match for \n\tpattern: %s \n\ttarget : %s ", 
                        route.pattern, route.payload.controller);
					if (route.params && route.params.length > 0) {
						//make a parameter map
						string.replace(route.pattern, function(){
							var i;
							for (i = 1; i < arguments.length - 2; i++) {
								map[route.params[i-1]] = arguments[i];
							}
						});
					}
                    routeList.push($.extend({map: map}, route));
                }
            }
            if(routeList.length===0){this.logger.debug("found no match for \n\tpattern: %s", string);}
            return routeList;
        }
        
    });
    
})( jQuery, Claypool);


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    
    $$.Factory$Interface = {
        create: function(){ throw new $$.MethodNotImplementedError(); }
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
     *
     */
    $$.Configurable$Interface = {
    	//This is the old school app framework configuration model.  It
    	//gives you the greatest flexibility and power to work with
    	//even legacy code, and allows you to consolidate configuration
    	//to a small number, or just a single, file.  It requires an investment
    	//to get it wired.
        configurationId:null,//an array of two unique string identifing the property 
        configuration:null,//
        configurationUrl:null,//
        configurationType:null,//"json" or "xml"
        getConfig: function(){ throw new $$.MethodNotImplementedError();},
        loadConfig: function(){ throw new $$.MethodNotImplementedError();},
        setConfig: function(){ throw new $$.MethodNotImplementedError();},
        updateConfig: function(){ throw new $$.MethodNotImplementedError();}
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
    
    */
    $$.Scanner$Interface = {
    	//The scanner is the new school app framework configuration model.  It
    	// relies heavily on convention to reduce the development overhead.  In
    	// the end, it's job is to simply walk a namespace and build the internal
    	// representation of the equivalent hand-wire configuration
        scan:function(){ throw new $$.MethodNotImplementedError();}
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
     * By default the factories are configured programatically, using setConfiguration,
     * however all the wiring is available for separating it into a data format like
     * json or xml and retreiving via ajax (though not asynchronously)
     * Factories also manage the cache of objects they create for fast retreival
     * by id, thus the cache is a simple map implementation.
     */
    $$.BaseFactory = function(options){
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, {
            configurationUrl:"./app/configs/config.js",
            configurationType:"json"//or xml
        }, options /* overrides */ );
        this.logger = new $$.Logging.NullLogger();
        return this;
    };
    
    $.extend($$.BaseFactory.prototype,
        $$.SimpleCachingStrategy.prototype, 
        $$.Factory$Interface,
        $$.Configurable$Interface,
        $$.Scanner$Interface,{
        /**
         * returns the portion configuration specified by 'configurationId'
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        getConfig: function(){
            if( !this.configuration ){
                //First look for an object name Claypool.Configuration
                this.logger.warn( "Configuration for <%s> has not been set explicitly or has been updated implicitly.",  this.configurationId );
                try{
                	this.logger.debug("$$.Configuration: \n %o", $$.Configuration);
                    if($$.Configuration[this.configurationId]){
                        this.logger.info("Found Claypool.Configuration");
                        this.configuration = $$.Configuration[this.configurationId];
                    }else if(!$$.Configuration){
                        //it's not specified in js code so look for it remotely
                        this.loadConfig();
                    }
                }catch(e){
                    this.logger.exception(e);
                    throw new $$.ConfigurationError(e);
                }
            }
            return this.configuration;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        loadConfig: function(options){
        	options = options||{};
            this.configurationUrl = options.url||this.configurationUrl;
            this.logger.info("Attempting to load configuration from: %s", this.configurationUrl);
            //a non async call because we need to configure the loggers
            //with this info before they are called!
            var _this = this;
            try{
                jQuery.ajax({
                    type: "Get",
                  url: this.configurationUrl,
                  async: false,
                  data:{},
                  dataType: "json",
        	        success: function(json){
        	            if(_this.configurationUrl == './app/configs/config.js'){
        	                $$.Configuration = $$.Configuration||{};
        	                $.extend(true, $$.Configuration, json);
        	            }else{
        	                _this.setConfig(_this.configurationId,
        	                    json?json:null
    	                    );
	                    }
	                    if(options.callback){
	                    	options.callback($$.Configuration);
	                    }
        	        }
        	    });
    	    }catch(e){
    	        this.logger.exception(e);
                throw new $$.ConfigurationError(e);
    	    }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	setConfig: function(id, configuration){
    	    this.logger.info("Setting configuration");
            this.configuration = configuration;
            $$.Configuration[id] = configuration;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(id){
            throw new $$.MethodNotImplementedError();
        }
    });

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

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    var globalContext = [],
        guid = 0,
        plugins = {},
        env;
        
    $.extend(plugins, {
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns Describe what it returns
	     * @type String
	     */
        $:function(id, value){
            var a,i;
            if(value === undefined){
                //search the contexts in priority order
                a = null;
                for(i=0;i<globalContext.length;i++){
                    a = globalContext[i]().get(id);
                    if(a){return a;}
                } return null;
            }else{
                if(globalContext[0]().find(id)){
                    globalContext[0]().remove(id);
                }
                globalContext[0]().put(id, value);
            }
        },
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns Describe what it returns
	     * @type String
	     */
        register: function(context, priority){
            if( Math.abs(priority) > (globalContext.length-1)/2 ){
                //should be claypool.application but possible to modify
                if(priority === 0 && $.isFunction(context.getContext)){
                    globalContext[0]=context.getContext;
                    
                }else if(priority !== 0 ){
                    //wrap the global context
                    if($.isFunction(context.getContext)){
                        globalContext.push(context.getContext);
                    }
                    if($.isFunction(context.getCachedContext)){
                        globalContext.unshift(context.getCachedContext);
                    }
                }
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        guid: function(){
            return (++guid)+"_"+new Date().getTime()+"_"+Math.round(Math.random()*100000000);
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        resolve: function(namespacedName){
            var _resolver;
            var namespaces;
            var target; //the resolved object/function/array/thing or null
            var i;
            try{
                _resolver = function(name){
                    return this[name];
                };
                namespaces = namespacedName.split('.');
                target = null;
                for( i = 0; i < namespaces.length; i++){
                    target = _resolver.call(target,namespaces[i]);
                    if(target === undefined){
                        return target;
                    }
                }
                return target;
            }catch(e){
                throw new $$.NameResolutionError(e);
            }
        },
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns If no arguments are given this function returns the entire configuration object.
	     *          If a single arg is present it return the resolved portion of the subconfiguration.
	     *          Otherwise it treats the first arg as the name of the subconfiguration and the
	     *          second arg as an object or array to extend or merge respectively into the subconfiguration.
	     * @type String
	     */
        config: function(){
            var config, subconfig;
            if(arguments.length === 0){
                return $$.Configuration;
            }else if(arguments.length === 1 && typeof(arguments[0]) == "string"){
                return $.resolve("Claypool.Configuration."+arguments[0]);
            }else{
                config = $.resolve("Claypool.Configuration."+arguments[0]);
                if(config){
                    subconfig = arguments[1];
                    if(subconfig instanceof Array){
                        config = $.merge(config, subconfig);
                    }else if(subconfig instanceof  Object){
                        config = $.extend(true, config, subconfig);
                    }
                }
            }
            return this;//chain
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
         env: function(){
             //an environment is set or defined by calling
             //$.env('defaults', 'client.dev')
             if(arguments.length == 2){
                 //env is not necessarily flat so deep extension may be necessary
                 env = $.extend( true, env||{}, 
                     $.config('env.'+arguments[0]),
                     $.config('env.'+arguments[1]));
                 return env;
             }else{
                 if(arguments.length === 1 && !(typeof(arguments[0])=='string')){
                    //a convenience method for defining environments
					//like $.config('env',{});
					return $.config('env', arguments[0]);
                 }
                 return env[arguments[0]]||null;
             }
         }
        //TODO add plugin convenience methods for creating factory;
        //factory : function(){}
        //TODO add plugin convenience methods for creating context;
        //context : function(){}
        //TODO add plugin convenience methods for creating cache;
        //cache: function(){} 
        
    });
    $.extend($$, plugins);
    $.extend($, plugins);
    
    //Add an event listener for claypool loaded so we can initialize loggers
})(jQuery, Claypool);Claypool.Application={
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
