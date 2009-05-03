var Claypool={
/**
 * Claypool 1.0.rc11 - A Web 1.6180339... Javascript Application Framework
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
	extend : function(t, $class){
	    $class.apply(t,[]);
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
                 //env is flat so deep extension isnt necessary
                 env = $.extend( env||{}, 
                     $.config('env.'+arguments[0]),
                     $.config('env.'+arguments[1]));
                 return env;
             }else{
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
})(jQuery, Claypool);
Claypool.Logging={
/*
 * Claypool @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 */
 
    //erase safety provided by core
    NullLogger  : null,
    getLogger   : null
};

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    
    $.extend($$Log, {
        //Static Closure Method (uses a singleton pattern)
        loggerFactory:null,
        getLogger: function(category){
            if(!$$Log.loggerFactory){
                $$Log.loggerFactory = new $$Log.Factory();
                $$Log.loggerFactory.updateConfig();
            }
            return $$Log.loggerFactory.create(category);
        }
    });
    
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
	$$Log.Level = {
        DEBUG:0,
        INFO:1,
        WARN:2,
        ERROR:3,
        NONE:4
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
    $$Log.Logger$Interface = {
        debug:      function(){
            throw new $$.MethodNotImplementedError();
        },
        info:       function(){
            throw new $$.MethodNotImplementedError();
        },
        warn:       function(){
            throw new $$.MethodNotImplementedError();
        },
        error:      function(){
            throw new $$.MethodNotImplementedError();
        },
        exception:  function(){
            throw new $$.MethodNotImplementedError();
        }
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
    $$Log.NullLogger = function(){
        //for speed why bother implement the interface, just null the functions
        var nullFunction = function(){
            return this;
        };
        $.extend(this,  {
            debug:nullFunction,
            info:nullFunction,
            warn:nullFunction,
            error:nullFunction,
            exception:nullFunction
        });
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
    $$Log.Logger = function(options){
        this.category   = "root";
        this.level      = null;
        try{
            $.extend(true, this, options);
            this.level = $$Log.Level[
                this.level?this.level:"NONE"
            ];
            //allow for appender extension, eg multiple appenders and custom appenders
            //appenders are expected to be specified as string representations of the
            //function name, eg 'Claypool.Logging.ConsoleAppender'
            try{
                this.appender = new ($.resolve(this.appender||"Claypool.Logging.ConsoleAppender"))(options);
            }catch(e){
                try{ 
                    this.appender = new $$Log.ConsoleAppender(options);
                }catch(e){ 
                    this.appender = new $$Log.SysOutAppender(options); 
                }
            }
            return this;
        }catch(e){
            return new $$Log.NullLogger();
        }
    };
    
    //All logging calls are chainable
    $.extend($$Log.Logger.prototype, 
        $$Log.Logger$Interface,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        debug: function(){
            if(this.level<=$$Log.Level.DEBUG){
              this.appender.append("DEBUG",this.category,arguments);  
              return this;
            }else{ 
                this.debug = function(){
                    return this;
                }; 
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
        info: function(){
            if(this.level<=$$Log.Level.INFO){
              this.appender.append("INFO",this.category,arguments);  
              return this;
            }else{ 
                this.debug = function(){
                    return this;
                }; 
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
        warn: function(){
            if(this.level<=$$Log.Level.WARN){
              this.appender.append("WARN",this.category,arguments);  
              return this;
            }else{ this.debug = function(){return this;}; }
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        error: function(){
            if(this.level<=$$Log.Level.ERROR){
              this.appender.append("ERROR",this.category,arguments);  
              return this;
            }else{ this.debug = function(){return this;}; }
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        exception: function(e){
            if(this.level < $$Log.Level.NONE){
                if(e){
                    this.appender.append("EXCEPTION", this.category,e); 
              		return this;
          		}
            }else{ 
                this.debug = function(){
                    return this;
                }; 
            }
            return this;
        }
    });

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
    $$Log.Appender$Interface = {
        formatter:null,
        append: function(level,category,message){
            throw new $$.MethodNotImplementedError();
        }
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
    $$Log.SysOutAppender = function(options){
        /**This function is intentionally written to throw an error when called*/
        var rhinoCheck = function(){ var isRhino = null;isRhino.toString();};
        /**This is probably rhino if these are defined*/
        if($.isFunction(print) && (window.load !== undefined) && $.isFunction(window.load) ){
            try{
                rhinoCheck();
            }catch(caught){/**definitely rhino if this is true*/
                if(caught.rhinoException){
                    $.extend(true, this, options);
                    this.formatter = new $$Log.DefaultFormatter(options);
                    return this;
                }
            }
        }
        throw new $$Log.NoAppendersAvailableError();
    };
        
    $.extend($$Log.SysOutAppender.prototype, 
        $$Log.Appender$Interface, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        append: function(level,category,message){
            //print(level +"\n"+ category +"\n"+ message[0]);
            switch(level){
                case "DEBUG":
                    print(this.formatter.format(level, category, message));break;
                case "INFO":
                    print(this.formatter.format(level, category, message));break;
                case "WARN":
                    print(this.formatter.format(level, category, message));break;
                case "ERROR":
                    print(this.formatter.format(level, category, message));break;
                case ("EXCEPTION"):
                    //message is e
                    var msg = message&&message.rhinoException?"\n\t"      + message.rhinoException.message +
                        "\tcolumn: "  + message.rhinoException.columnNumber() + 
                        "\tline: "  + message.rhinoException.lineNumber()  : "UNKNOWN RUNTIME ERROR";
                    print(this.formatter.format(level, category,  msg ));
                    break;
            }
        }
    });
    
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
    $$Log.ConsoleAppender = function(options){
        try{
            if(window&&window.console&&window.console.log){
                $.extend(true, this, options);
                this.formatter = new $$Log.FireBugFormatter(options);
                return this;
            }else{
                return new $$Log.SysOutAppender(options);
            }
        }catch(e){
            /**Since the console isn't available, see if print() is and fall back to it**/
        }
        return this;
    };
    
    $.extend( $$Log.ConsoleAppender.prototype, 
        $$Log.Appender$Interface, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        append: function(level, category, message){
            switch(level){
                case ("DEBUG"):
                    console.log.apply(console, this.formatter.format(level, category, message));
                    break;
                case ("INFO"):
                    console.info.apply(console, this.formatter.format(level, category, message));
                    break;
                case ("WARN"):
                    console.warn.apply(console, this.formatter.format(level, category, message));
                    break;
                case ("ERROR"):
                    console.error.apply(console,this.formatter.format(level, category, message));
                    break;
                case ("EXCEPTION"):
                    //message is e
                    console.error.apply(console, this.formatter.format(level, category, 
                        message.message?[message.message]:[])); 
                    console.trace();
                    break;
            }
        }
    });
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
    $$Log.Formatter$Interface = {
        format: function(level, category, objects){
            throw new $.MethodNotImplementedError();
        }
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
    $$Log.FireBugFormatter = function(options){
        $.extend(true, this, options);
    };
    
    $.extend($$Log.FireBugFormatter.prototype, 
        $$Log.Formatter$Interface, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        getDateString: function(){
            return " ["+ new Date().toUTCString() +"] ";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        format: function(level, category, objects){
            var msgPrefix = category + " "+level+": "+ this.getDateString();
            objects = (objects&&objects.length&&(objects.length>0))?objects:[];
            var msgFormat = (objects.length > 0)?objects[0]:null;
            if (typeof(msgFormat) != "string"){
                objects.unshift(msgPrefix);
            }else{
                objects[0] = msgPrefix + msgFormat;
            }
            return objects;
        }
    });
    
})(  jQuery, Claypool, Claypool.Logging );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
    
    var parseFormatRegExp       = /((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/,
        functionRenameRegExp    = /function ?(.*?)\(/,
        objectRenameRegExp      = /\[object (.*?)\]/;
    
    /**
     * @constructor
     */
    $$Log.DefaultFormatter = function(options){
        $.extend(true, this, options);
    };
    
    $.extend($$Log.DefaultFormatter.prototype,
        $$Log.Formatter$Interface,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        getDateString: function(){
            return " ["+ new Date().toUTCString() +"] ";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        format: function (level, category, objects){
            var msgPrefix = " "+level+":  " +this.getDateString() + "{"+category+"} ";
            var msg = [msgPrefix?msgPrefix:""];
            var format = objects[0];
            var objIndex = 0;
            if (typeof(format) != "string"){
                format = "";
                objIndex = -1;
            }
            var parts = this.parseFormat(format);
            var i;
            for (i = 0; i < parts.length; ++i){
                if (parts[i] && typeof(parts[i]) == "object"){
                    parts[i].appender.call(this,objects[++objIndex], msg);
                }else{
                    this.appendText(parts[i], msg);
                }
            }
            for (i = objIndex+1; i < objects.length; ++i){
                this.appendText(" ", msg);
                if (typeof(objects[i]) == "string"){
                    this.appendText(objects[i], msg);
                }else{
                    this.appendObject(objects[i], msg);
                }
            }
            return msg.join("");
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        parseFormat: function(format){
            var parts = [];
            var appenderMap = {s: this.appendText, d: this.appendInteger, i: this.appendInteger, f: this.appendFloat};
            var type;
            var appender;
            var precision;
            var m;
            for (m = parseFormatRegExp.exec(format); m; m = parseFormatRegExp.exec(format)) {
                type = m[8] ? m[8] : m[5];
                appender = type in appenderMap ? appenderMap[type] : this.appendObject;
                precision = m[3] ? parseInt(m[3], 10) : (m[4] == "." ? -1 : 0);
                parts.push(format.substr(0, m[0][0] == "%" ? m.index : m.index+1));
                parts.push({appender: appender, precision: precision});
                format = format.substr(m.index+m[0].length);
            }
            parts.push(format);
            return parts;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        objectToString: function (object){
            try{ return object+"";}
            catch (e){ return null; }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendText: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendNull: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendString: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendInteger: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendFloat: function (object, msg){
            msg.push(this.objectToString(object));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendFunction: function (object, msg){
            var m = functionRenameRegExp.exec(this.objectToString(object));
            var name = m ? m[1] : "function";
            msg.push(this.objectToString(name));
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendObject: function (object, msg){
            try{
                if (object === undefined){
                    this.appendNull("undefined", msg);
                }else if (object === null){
                    this.appendNull("null", msg);
                }else if (typeof object == "string"){
                    this.appendString(object, msg);
                }else if (typeof object == "number"){
                    this.appendInteger(object, msg);
                }else if (typeof object == "function"){
                    this.appendFunction(object, msg);
                }else if (object.nodeType == 1){
                    this.appendSelector(object, msg);
                }else if (typeof object == "object"){
                    this.appendObjectFormatted(object, msg);
                }else{ this.appendText(object, msg); }
            }catch (e){/*Do Nothing*/}
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendObjectFormatted: function (object, msg){
            var text = this.objectToString(object);
            var m = objectRenameRegExp.exec(text);
            msg.push( m ? m[1] : text);
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendSelector: function (object, msg){
            msg.push(object.nodeName.toLowerCase());
            if (object.id){ msg.push(object.id);}
            if (object.className){ msg.push(object.className);}
            msg.push('</span>');
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        appendNode: function (node, msg){
            var attr;
            var i;
            var child;
            if (node.nodeType == 1){
                msg.push('<', node.nodeName.toLowerCase(), '>');
                for (i = 0; i < node.attributes.length; ++i){
                    attr = node.attributes[i];
                    if (!attr.specified){ continue; }
                    msg.push(attr.nodeName.toLowerCase(),'="',attr.nodeValue,'"');
                }
                if (node.firstChild){
                    for (child = node.firstChild; child; child = child.nextSibling){
                        this.appendNode(child, html);
                    }
                    msg.push('</',  node.nodeName.toLowerCase(), '>');
                } else {
                    msg.push('/>');
                }
            }else if (node.nodeType == 3) {
                msg.push( node.nodeValue );
            }
        }
    });
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
	$$Log.Factory = function(options){
        $$.extend(this, $$.BaseFactory);
        this.configurationId = 'logging';
        $.extend(true, this, options);
        //The LogFactory is unique in that it will create its own logger
        //so that it's events can be logged to console or screen in a
        //standard way.
        this.logger = new $$Log.Logger({
            category:"Claypool.Logging.Factory",
            level:"INFO",
            appender:"Claypool.Logging.ConsoleAppender"
        });
        this.attemptedConfigure = false;
    };
    
    $.extend($$Log.Factory.prototype,  
        $$.BaseFactory.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        create: function(category){
            var categoryParts,
                subcategory,
                loggerConf,
                rootLoggerConf;
            if(!this.configuration){
                //Only warn about lack of configuration once
                if(!this.attemptedConfigure){
                    this.logger.warn("Claypool Logging was not initalized correctly.  Logging will not occur unless initialized.");
                }
                this.attemptedConfigure = true;
                return new $$Log.NullLogger();
            }else{
                //Find the closest configured category
                categoryParts = category.split(".");
                for(i=0;i<categoryParts.length;i++){
                    subcategory = categoryParts.slice(0,categoryParts.length-i).join(".");
                    loggerConf = this.find(subcategory);
                    if(loggerConf !== null){
                        //The level is set by the closest subcategory, but we still want the 
                        //full category to display when we log the messages
                        loggerConf.category = category;
                        //TODO: we need to use the formatter/appender specified in the config
                        return new $$Log.Logger( loggerConf );
                    }
                }
                //try the special 'root' category
                rootLoggerConf = this.find('root');
                if(rootLoggerConf !== null){
                    //The level is set by the closest subcategory, but we still want the 
                    //full category to display when we log the messages
                    rootLoggerConf.category = category;
                    return new $$Log.Logger(rootLoggerConf);
                }
            }
            //No matching category found
            this.logger.warn("No Matching category: %s Please configure a root logger.", category);
            return new $$Log.NullLogger();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(){
            var loggingConfiguration;
            var logconf;
            var i;
            try{
                this.logger.info("Configuring Claypool Logging");
                this.clear();
                loggingConfiguration = this.getConfig()||[];
                for(i=0;i<loggingConfiguration.length;i++){
                    try{
                        logconf = loggingConfiguration[i];
                        this.add( logconf.category, logconf );
                    }catch(ee){
                        this.logger.exception(ee);
                        return false;
                    }
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$Log.ConfigurationError(e);
            }
            return true;
        }
    });
	    
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
    //TODO : what is the useful static plugin that could be derived from Claypool.Logging?
	$.extend($, {
	    logger  : function(name){
	        return $$Log.getLogger(name);
	    }
	});
	
	var $log;// = $.logger("jQuery");
	
	$.extend($, {
	    debug  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.debug.apply($log,arguments);
	        return this;
	    },
	    info  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.info.apply($log,arguments);
	        return this;
	    },
	    warn  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.warn.apply($log,arguments);
	        return this;
	    },
	    error  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.error.apply($log,arguments);
	        return this;
	    },
	    exception  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.exception.apply($log,arguments);
	        return this;
	    }
	});
	
	
})(  jQuery, Claypool, Claypool.Logging );
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
        manage : function(containerName, managedId){
            $(document).bind("claypool:initialize", function(event, context){
                context.managedId = new ($.resolve( containerName ))();
                if(context.ContextContributor && $.isFunction(context.ContextContributor)){
                    //$.extend(context.managedId, new context.ContextContributor());
                    context.managedId.registerContext(containerName);
                }
            }).bind("claypool:reinitialize", function(event, context){
                context.managedId.factory.updateConfig();
            });
            return this;
        }
    });
	
})(  jQuery, Claypool, Claypool.Application );

Claypool.AOP={
/*
 * Claypool.AOP @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 * @projectDescription 	This code is adopted from the jQuery AOP plugin project.  It was incorporated so it
 * 						could be extended and modified to match the overall javascript style of the rest of
 * 						Claypool. Many thanks to it's author(s), as we rely heavily on the code and learned
 * 						a lot from it's integration into Claypool.
 *
 * @author	Christopher Thatcher thatcher.christopher@gmail.com
 * @version	0.1 
 * 
 * The original header is retained below:
 * 
 * 		jQuery AOP - jQuery plugin to add features of aspect-oriented programming (AOP) to jQuery.
 * 		http://jquery-aop.googlecode.com/
 *
 * 		Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 * 		Version: 1.0
 */
};
(function($, $$, $$AOP){
    
    $.manage("Claypool.AOP.Container", "claypool:AOP");
    
})(  jQuery, Claypool, Claypool.AOP );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){
    /**
     * @constructor 
     * @param {Object} options
     *      - options should include pointcut:{target:'Class or instance', method:'methodName or pattern', advice:function }
     */
    $$AOP.Aspect = function(options){
        this.id   = null;
        this.type = null;
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.AOP.Aspect");
        //only 'first' and 'all' are honored at this point
        //and if it's not 'first' it's 'all'
        this.strategy = this.strategy||"all";
    };
    
    $.extend($$AOP.Aspect.prototype, 
        $$.SimpleCachingStrategy.prototype ,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        weave: function(){
            var _this = this;
            var pattern;
            var targetObject;
            if(!this.target){
                _this.logger.warn( "No pointcut was specified.  Cant weave aspect." );
                return;
            }
            var _weave = function(methodName){
                var pointcut, cutline;//new method , old method
                try{
                    _this.logger.info( "Weaving Advice %s for Aspect %s", methodName, _this.id );
                    _this.hasPrototype = typeof(_this.target.prototype) != 'undefined';
                    cutline = _this.hasPrototype ? 
                        _this.target.prototype[methodName] : 
                        _this.target[methodName];
                    pointcut = _this.advise(cutline);
                    if(!_this.hasPrototype){
                        _this.target[methodName] = pointcut;
                    }else{ 
                        _this.target.prototype[methodName] = pointcut;
                    }
                    return { 
                        pointcut:pointcut,
                        cutline:cutline
                    };
                }catch(e){
                    throw new $$AOP.WeaveError(e, "Weave");
                }
            };
            //we dont want an aspect to be woven multiple times accidently so 
            //its worth a quick check to make sure the internal cache is empty.
            if(this.size===0){//size is empty
                pattern = new RegExp(this[this.type?this.type:"method"]);
                targetObject = this.target.prototype?this.target.prototype: this.target;
                for(var f in targetObject){
                    if($.isFunction(targetObject[f])&&pattern.test(f)){
                        this.logger.debug( "Adding aspect to method %s", f );
                        this.add($.guid(), _weave(f));
                        if(this.strategy==="first"){break;}
                    }
                }
            } return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        unweave: function(){
            var aspect;
            try{
                for(var id in this.cache){
                    aspect = this.find(id);
                   if(!this.hasPrototype){
                        this.target[this.method] = aspect.cutline;
                    } else {
                        this.target.prototype[this.method] = aspect.cutline;
                    } this.hasPrototype = null;
                } this.clear();
            }catch(e){
                throw new $$AOP.WeaveError(e, 'Unweave');
            }
            return true;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        advise: function(cutline){
            throw new $$.MethodNotImplementedError();
        }
        
    });
     
    
})(  jQuery, Claypool, Claypool.AOP );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){   
        /**
         * @constructor
         */
        $$AOP.After = function(options){
            $$.extend(this, $$AOP.Aspect);
            $.extend(true, this, options);
            this.logger = $.logger("Claypool.AOP.After");
            this.type = "after";
        };
        
        $.extend($$AOP.After.prototype,
            $$AOP.Aspect.prototype,{
            advise: function(cutline){
                var _this = this;
                try{
                    return function() {
                        //call the original function and then call the advice 
                        //   aspect with the return value and return the aspects return value
                        var returnValue = cutline.apply(this, arguments);//?should be this?
                        return _this.advice.apply(_this, [returnValue]);
                    };
                }catch(e){
                    throw new $$AOP.AspectError(e, "After");
                }
            }
        });

    
})(  jQuery, Claypool, Claypool.AOP );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){   
        /**
         * @constructor
         */
        $$AOP.Before = function(options){
            $$.extend( this, $$AOP.Aspect);
            $.extend(true, this, options);
            this.logger = $.logger("Claypool.AOP.Before");
            this.type = "before";
        };
        $.extend($$AOP.Before.prototype,
            $$AOP.Aspect.prototype,{
            /**
             * Describe what this method does
             * @private
             * @param {String} paramName Describe this parameter
             * @returns Describe what it returns
             * @type String
             */
            advise: function(cutline){
                var _this = this;
                try{
                    return function() {
                        _this.advice.apply(_this, arguments);
                        return cutline.apply(this, arguments);//?should be this?
                    };
                }catch(e){
                    throw new $$AOP.AspectError(e, "Before");
                }
            }
        });
        
})(  jQuery, Claypool, Claypool.AOP );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){   
        /**
         * @constructor
         */
        $$AOP.Around = function(options){
            $$.extend( this,  $$AOP.Aspect);
            $.extend(true, this, options);
            this.logger = $.logger("Claypool.AOP.Around");
            this.type = "around";
        };
        $.extend($$AOP.Around.prototype, 
            $$AOP.Aspect.prototype,{
            /**
             * Describe what this method does
             * @private
             * @param {String} paramName Describe this parameter
             * @returns Describe what it returns
             * @type String
             */
            advise: function(cutline){
                var _this = this;
                try{
                    return function() {
                        var invocation = { object: this, args: arguments };
                        return _this.advice.apply(_this, [{ 
                            arguments:  invocation.args, 
                            proceed :   function() {
                                var returnValue = cutline.apply(invocation.object, invocation.args);
                                return returnValue;
                            }
                        }] );
                    };
                }catch(e){
                    throw new $$AOP.AspectError(e, "Around");
                }
            }
        });
    
})(  jQuery, Claypool, Claypool.AOP );


/**
 * Stores instance configurations and manages instance lifecycles
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){
    /**
     * @constructor
     */
    $$AOP.Factory = function(options){
        $$.extend(this, $$.BaseFactory);
        $.extend(true, this, options);
        this.configurationId = 'aop';
        this.aspectCache = null;
        this.logger = $.logger("Claypool.AOP.Factory");
        this.aspectCache = new $$.SimpleCachingStrategy();
    };
    
    $.extend($$AOP.Factory.prototype,
        $$.BaseFactory.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(){
            var _this = this;
            var aopConfiguration;//entire config
            var aopconf;//unit of config
            var i;
            var targetRef, namespace, prop, genconf;
            try{
                this.logger.debug("Configuring Claypool AOP AspectFactory");
                aopConfiguration = this.getConfig()||[];
                this.logger.debug("AOP Configurations: %d", aopConfiguration.length);
                for(i=0;i<aopConfiguration.length;i++){
                    try{
                        aopconf = aopConfiguration[i];
                        //  resolve the advice which must be specified as an optionally
                        //  namespaced string eg 'Foo.Bar.goop' 
                        if(!$.isFunction(aopconf.advice)){
                            aopconf.advice = $.resolve(aopconf.advice);
                        }
                        //If the adive is to be applied to an application managed instance
                        //then bind to its lifecycle events to weave and unweave the
                        //aspect 
                        if(aopconf.target.match("^ref://")){
                            targetRef = aopconf.target.substr(6,aopconf.target.length);
                            $(document).bind("claypool:ioc:"+targetRef, function(event, id, iocContainer){
                                _this.logger.debug("Creating aspect id %s for instance %s", aopconf.id);
                                var instance = iocContainer.find(id);
                                aopconf.target = instance._this;
                                _this.add(aopconf.id, aopconf);
                                //replace the ioc object with the aspect attached
                                var aspect = _this.create(aopconf.id);
                                instance._this = aspect.target;
                                iocContainer.remove(id);
                                iocContainer.add(id, instance);
                                _this.logger.debug("Created aspect \n%s, \n%s");
                                
                            }).bind("claypool:predestroy:"+targetRef, function(event, instance){
                                _this.logger.debug("Destroying aspect id %s for instance %s", aopconf.id);
                                var aspect = _this.aspectCache.find(aopconf.id);
                                if(aspect&&aspect.unweave){
                                    aspect.unweave();
                                }
                            });
                        }else{
                            /**
                            *   This is an aspect for an entire class of objects or a generic
                            *   instance.  We can apply it now so do it. We do like to be
                            *   flexible enough to allowa namespaced class, and in either case,
                            *   it's specified as a string so we have to resolve it
                            */
                            if(aopconf.target.match(/\.\*^/)){
                                //The string ends with '.*' which implies the target is every function
                                //in the namespace.  hence we resolve the namespace, look for every
                                //function and create a new filter for each function.
                                namespace = $.resolve(aopconf.target.substring(0, aopconf.target.length - 2));
                                for(prop in namespace){
                                    if($.isFunction(namespace[prop])){
                                        //extend the original aopconf replacing the id and target
                                        genconf = $.extend({
                                            id : aopconf.id+$.createGUID(),
                                            target : namespace[prop] 
                                        }, aopconf );
                                        this.logger.debug("Creating aspect id %s", genconf.id);
                                        this.add(genconf.id);
                                        this.create(genconf.id);//this creates the aspect
                                    }
                                }
                            }else{
                                this.logger.debug("Creating aspect id %s", aopconf.id);
                                aopconf.target =  $.resolve(aopconf.target);
                                this.add(aopconf.id, aopconf);
                                this.create(aopconf.id);//this creates the aspect
                            }
                        }
                    }catch(e){
                        //Log the expection but allow other Aspects to be configured.
                        this.logger.exception(e);
                    }
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$AOP.ConfigurationError(e);
            }
            return true;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        create: function(id){//id is #instance or $Class
            var configuration;
            var _continuation;
            var aspect = this.aspectCache.find(id);
            var _this = this;
            /** * main factory function. */
            var createWeave = function(options) {
                var aspect = null;
                if (options.after){
                    aspect = new $$AOP.After(options);
                }else if (options.before){
                    aspect = new $$AOP.Before(options);
                }else if (options.around) {
                    aspect = new $$AOP.Around(options);
                }
                return aspect.weave();
            };
            if(aspect){
                //The aspect already exists so give them whaty they're
                //looking for
                return aspect;
            }else{
                //The aspect hasnt been created yet so look for the appropriate 
                //configuration and create the aspect.
                try{
                    this.logger.debug("Looking for configuration for aspect %s", id);
                    configuration = this.find(id);
                    if(configuration === undefined || configuration === null){
                        this.logger.debug("%s is not an Aspect.", id);
                        return null;
                    }else{
                        this.logger.debug("Found configuration for instance %s", id);
                        if(configuration.selector){
                            this.logger.debug("Attaching contructor to an active selector");
                            _this = this;
                            _continuation = function(){
                                aspect  = createWeave(configuration);
                                _this.aspectCache.add(configuration.id+"#"+this.toString(), aspect);
                                return aspect;
                            };
                            if(configuration.active){
                                //Apply the weave to future dom objects matching the specific
                                //selector.
                                $(configuration.selector).livequery(_continuation);
                            }else{
                                //attach the aspect only to the current dom snapshot
                                $(configuration.selector).each(_continuation);
                            }
                        }else{
                            //This is either a simple object or class
                            aspect = createWeave(configuration);
                            this.aspectCache.add(id, aspect);
                        }
                        /**remember this might not be fully initialized yet!*/
                        return aspect;
                    }
                }catch(e){
                    this.logger.exception(e);
                    throw new $$AOP.FactoryError(e);
                }
            }
        }
    });
    
})(  jQuery, Claypool, Claypool.AOP );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 *
 *      The AOP Container manages the storage and retrieval
 *      of aspect configuration and instances respectively.
 *      The AOP Container also shares its context with the
 *      global application context, so Aspect ID's (like any
 *      other configuration ID) must be unique.
 *
 *      The aspectFactory is an instance of Claypool.AOP.Factory.
 *      When the Container is created, it caches each Aspects
 *      configuration.  Unlike the IoC Container, which lazily creates
 *      Objects, the AOP Container applies Class Aspects immediatly,
 *      creates a Proxy Aspect for container managed instances (linked
 *      to the postCreate lifecycle event). 
 *
 *      Thus, what the AOP Container actaully contibutes to the Application
 *      Context is the Aspect (used primarily to remove/reattach the Aspect),
 *      or a Continuation representing a function that will return
 *      the Aspect once the target has been created by the IoC Container.
 */
(function($, $$, $$AOP){
    /**
     * @constructor
     */
    $$AOP.Container = function(options){
        $$.extend(this, $$.Application.ContextContributor);
        $.extend( true, this, options);
        this.factory = null;
        this.logger = $.logger("Claypool.AOP.Container");
        this.logger.debug("Configuring Claypool AOP Container");
        /**Register first so any changes to the container managed objects 
        are immediately accessible to the rest of the application aware
        components*/
        this.factory = new $$AOP.Factory(options); //$AOP.getAspectFactory();
        this.factory.updateConfig();
    };
    
    $.extend($$AOP.Container.prototype,
        $$.Application.ContextContributor.prototype, {
            /**
             * Returns all aspects attached to the Class or instance.  If the instance is still 
             * sleeping, the proxy aspect is returned.
             * @private
             * @param {String} paramName Describe this parameter
             * @returns Describe what it returns
             * @type String
             */
            get: function(id){//id is #instance or $Class (ie Function)
                var aspect;
                try{
                    this.logger.debug("Search for a container managed aspect :%s", id);
                    aspect = this.find(id);
                    if(aspect===undefined||aspect===null){
                        this.logger.debug("Can't find a container managed aspect :%s", id);
                        aspect = this.factory.create(id);
                        if(aspect !== null){
                            this.add(id, aspect);
                            return aspect;
                        }
                    }else{
                        this.logger.debug("Found container managed instance :%s", id);
                        return aspect;
                    }
                }catch(e){
                    this.logger.exception(e);
                    throw new $$AOP.ContainerError(e);
                }
                return null;
            }
        });
    
})(  jQuery, Claypool, Claypool.AOP );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){
    /**
     * @constructor
     */
    $$AOP.ContainerError = function(e, options){ 
        var details = {
            name:"Claypool.AOP.ContainerError",
            message:"An error occured inside the aop container."
        };
        $.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
})(  jQuery, Claypool, Claypool.AOP );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){
    /**
     * @constructor
     */
    $$AOP.ConfigurationError =  function(e, options){ 
        var details = {
            name:"Claypool.AOP.ConfigurationError",
            message:"An error occured updating the aop container configuration."
        };
        $.extend( this, new $$.ConfigurationError(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
})(  jQuery, Claypool, Claypool.AOP );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){
    /**
     * @constructor
     */
    $$AOP.FactoryError = function(e, options){ 
        var details = {
            name:"Claypool.AOP.FactoryError",
            message:"An error occured creating the aspect from the configuration."
        };
        $.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
})(  jQuery, Claypool, Claypool.AOP );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){
    /**
     * @constructor
     */
    $$AOP.WeaveError = function(e, options){ 
        var details = {
            name:"Claypool.AOP.WeaveError",
            message:"An error occured weaving or unweaving the aspect."
        };
        $.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
})(  jQuery, Claypool, Claypool.AOP );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){
    /**
     * @constructor
     */
    $$AOP.AspectError =  function(e, options){ 
        var details = {
            name:"Claypool.AOP.AspectError",
            message:"An error occured while applying an aspect."
        };
        $.extend( this, new $$.Error(e, options?{
            name:(options.name?(options.name+" > "):"")+details.name,
            message:(options.message?(options.message+" \n "):"")+details.message
        }:details));
    };
    
})(  jQuery, Claypool, Claypool.AOP );

Claypool.IoC={
/*
 * Claypool.IOC @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Inversion of Control (Dependency Injection) Patterns  -
 */
};

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
    
    $.manage("Claypool.IoC.Container", "claypool:IoC");

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
    $$IoC.Instance = function(id, configuration){
        $.extend(this,{
            _this           : null,     //A reference to the managed object
            id              : null,     //published to the application context
            configuration   : null,     //the instance configuration
            guid            : $.guid(), //globally (naively) unique id for the instance created internally
            type            : null,     //a reference to the clazz
            id              : id,
            configuration   : configuration||{},
            logger          : $.logger("Claypool.IoC.Instance")
        });
        /**
         * Override the category name so we can identify some extra info about the object
         * in it's logging statements
         */
        this.logger.category = this.logger.category+"."+this.id;
    };
    
    $.extend($$IoC.Instance.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        precreate: function(){
            try{
                this._this = {claypoolId:this.id};//a temporary stand-in for the object we are creating
                this.logger.debug("Precreating Instance");
                $(document).trigger("claypool:precreate", [this._this, this.id]);
                //second event allow listening to the specific object lifecycle if you know it's id
                $(document).trigger("claypool:precreate:"+this.id, [this._this]);
                //TODO:  Apply function specified in ioc hook
                return this;
            }catch(e){
                this.logger.error("An Error occured in the Pre-Create LifeCycle Phase");
                this.logger.exception(e);
                throw new $$IoC.LifeCycleError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        create: function(){
            var factory,factoryClass,factoryMethod,retVal;
            var _this,_thisOrUndefined,C_onstructor,args;
            var injections, injectionValue;
            try{
            /**
            *   The selector, if it isnt null, is used to create the default value
            *   of '_this' using $.  
            */
                this.logger.debug("Applying Selector to Instance");
                if(this.configuration.selector){
                    // binds usto the elements via selector,
                    //and/or sets defaults on the object we are managing (this._this)
                    this._this  = $(this.configuration.selector);
                    this.logger.debug("Result for selector : ", this._this);
                }else{
                    this.logger.debug("Using default empty object");
                    this._this = {};
                }
            /**  
            *   This is where we will create the actual instance from a constructor.
            *   Please use precreate and postcreate to hook you're needs into the
            *   lifecycle process via ioc/aop.
            *   It follows this order:
            *       1. find the appropriate constructor
            *       2. make sure all references in the options are resolved
            *       3. apply the constructor
            */
                if(this.configuration.factory){
                    //The factory is either a managed instance (already constructed)
                    //or it is the name of a factory class to temporarily instantiate
                    factory = {};
                    if(this.configuration.factory.substring(6,0)=="ref://"){
                        //its a reference to a managed object
                        this.logger.debug("Retreiving Factory from Application Context");
                        factory = $.$(this.configuration.factory);
                    }else{
                        //Its a class, so instantiate it
                        this.logger.info("Creating Instance from Factory");
                        factoryClass = this.resolveConstructor(this.configuration.factory);
                        retval = factoryClass.apply(factory, this.configuration.options);
                        factory = retval||factory;
                    }
                    this.logger.debug("Applying factory creation method");
                    factoryMethod = this.configuration.factoryMethod||"create";
                    _this = factory[factoryMethod].apply(factory, this.configuration.options);
                    this._this = $.extend(true,  _this, this._this);
                }else{
                    //constructorName is just a simple class constructor
                    /**
                    *   This is here for complex reasons.  There are a plethora ways to instantiate a new object
                    *   with javascript, and to be consistent, regardless of the particular approach, modifying the 
                    *   prototype must do what it supposed to do.. This is the only way I've found to do that.
                    *   PS If your constructor has more than 10 parameters, this wont work.  Why does your constructor
                    *   have more than 10 parameters?
                    */
                    this.logger.info("Creating Instance simulating constructor: %s", this.configuration.clazz);
                    C_onstructor = this.resolveConstructor(this.configuration.clazz);
                    args = this.configuration.options||[];
                    _this = {};
                    switch(args.length){
                        case 0: _this = new C_onstructor();break;
                        case 1: _this = new C_onstructor(args[0]);break;
                        case 2: _this = new C_onstructor(args[0],args[1]);break;
                        case 3: _this = new C_onstructor(args[0],args[1],args[2]);break;
                        case 4: _this = new C_onstructor(args[0],args[1],args[2],args[3]);break;
                        case 5: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4]);break;
                        case 6: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4],args[5]);break;
                        case 7: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);break;
                        case 8: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);break;
                        case 9: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8]);break;
                        default:
                            //this affect the prototype nature so modifying th proto has no affect on the instance
                            _thisOrUndefined = C_onstructor.apply(_this, args);
                            _this = _thisOrUndefined||_this;
                    }
                    //Every Instance gets a logger!
                    _this.$ns = this.configuration.clazz;
                    _this.$log = $.logger(_this.$ns);
                    _this.$log.info("Created new instance of %s", _this.$ns);
                    
                    this._this = $.extend(true, _this, this._this);
                }
            /**
            *   Now that the object has been successfully created we 'inject' these items
            *   More importantly we scan the top level of the injections for values (not names)
            *   that start tieh 'ref://' which is stripped and the remaining string is used
            *   to search the application scope for a managed object with that specific id.
            *
            *   This does imply that the construction of applications managed objects
            *   cascades until all injected dependencies have resolved.  I wish all
            *   browsers supported the js 'get/set' because we could use a lazy pattern 
            *   here instead.
            */
                injections = this.configuration.inject||{};
                for(var dependency in injections){
                    injectionValue = injections[dependency];
                    if($.isFunction(injectionValue.substring) &&
                       (injectionValue.substring(0,6) == 'ref://')){
                        injections[dependency] = $.$(
                            injectionValue.substring(6, injectionValue.length)
                        );
                    }
                }
                $.extend(this._this, injections);
                $(document).trigger("claypool:create", [this._this, this.id]);
                //second event allow listening to the specific object lifecycle if you know it's id
                $(document).trigger("claypool:create:"+this.id, [this._this]);
                return this._this;
            }catch(e){
                this.logger.error("An Error occured in the Create LifeCycle Phase");
                this.logger.exception(e);
                throw new $$IoC.LifeCycleError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        postcreate:function(){
            try{
                //TODO:  Apply function specified in ioc hook
                this.logger.debug("PostCreate invoked");
                $(document).trigger("claypool:postcreate", [this._this, this.id]);
                //second event allow listening to the specific object lifecycle if you know it's id
                $(document).trigger("claypool:postcreate:"+this.id, [this._this]);
                return this._this;
            }catch(e){
                this.logger.error("An Error occured in the Post-Create LifeCycle Phase");
                this.logger.exception(e);
                throw new $$IoC.LifeCycleError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        predestroy:function(){
            //If you need to do something to save state, eg make an ajax call to post
            //state to a server or local db (gears), do it here 
            try{
                //TODO:  Apply function specified in ioc hook
                this.logger.debug("Predestory invoked");
                $(document).trigger("claypool:predestroy", [this._this, this.id]);
                //second event allow listening to the specific object lifecycle if you know it's id
                $(document).trigger("claypool:predestroy:"+this.id, [this._this]);
                return this._this;
            }catch(e){
                this.logger.exception(e);
                throw new $$IoC.LifeCycleError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        destroy:function(){
            try{
                //TODO:  
                //we dont actually do anyting here, yet... it might be
                //a good place to 'delete' or null things
                this.logger.info("Destroy invoked");
                $(document).trigger("claypool:destroy", [this._this, this.id]);
                //second event allow listening to the specific object lifecycle if you know it's id
                $(document).trigger("claypool:destroy:"+this.id, [this._this]);
                return delete this._this;
            }catch(e){
                this.logger.exception(e);
                throw new $$IoC.LifeCycleError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        postdestroy:function(){
            //If you need to do something now that the instance was successfully destroyed
            //here is your lifecycle hook.  
            try{
                //TODO:  Apply functions specified in ioc hook
                this.logger.debug("Postdestory invoked");
                $(document).trigger("claypool:postdestroy", [this.id]);
                //second event allow listening to the specific object lifecycle if you know it's id
                $(document).trigger("claypool:postdestroy:"+this.id);
                return this;
            }catch(e){
                this.logger.exception(e);
                throw new $$IoC.LifeCycleError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        resolveConstructor:function(constructorName){
            var constructor;
            try{
                constructor = $.resolve(constructorName); 
                if( $.isFunction(constructor) ){
                    this.logger.debug(" Resolved " +constructorName+ " to a function");
                    return constructor;
                }else{ 
                    throw new Error("Constructor is not a function: " + constructorName);
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$IoC.ConstructorResolutionError(e);
            }
        }
    });
    
})(  jQuery, Claypool, Claypool.IoC );


/**
 * Stores instance configurations and manages instance lifecycles
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
    /**
     * @constructor
     */
    $$IoC.Factory = function(options){
        $$.extend(this, $$.BaseFactory);
        $.extend(true, this, options);
        this.configurationId = 'ioc';
        this.logger = $.logger("Claypool.IoC.Factory");
    };
    
    $.extend($$IoC.Factory.prototype,
        $$.BaseFactory.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        createLifeCycle: function(instance){
            try{
                //Walk the creation lifecycle
                instance.precreate();
                instance.create();
                instance.postcreate();
            }catch(e){
                this.logger.error("An Error occured in the Creation Lifecycle.");
                this.logger.exception(e);
                throw new $$IoC.LifeCycleError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        destroyLifeCycle: function(instance){
            try{
                //Walk the creation lifecycle
                instance.predestroy();
                instance.destroy();
                instance.postdestroy();
            }catch(e){
                this.logger.error("An Error occured in the Destory Lifecycle.");
                this.logger.exception(e);
                throw new $$IoC.LifeCycleError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        create: function(id){
            var configuration;
            var instance;
            var _this = this;
            try{
                this.logger.debug("Looking for configuration for instance %s", id);
                configuration = this.find(id);
                if(configuration === null){
                    this.logger.warn("No known configuration for instance %s", id);
                    return null;
                }else{
                    this.logger.debug("Found configuration for instance %s", id);
                    instance = new $$IoC.Instance(configuration.id, configuration);
                    if(configuration.active&&configuration.selector){
                        this.logger.debug("Attaching contructor to an active selector");
                        // precreate so there is something to return from the container
                        // even if the livequery hasnt triggered
                        instance.precreate();
                        //pass a flag so others know it's an active object
                        instance._this["@claypool:activeobject"] = configuration.selector;
                        instance._this["@claypool:id"] = instance.id;
                        jQuery(configuration.selector).livequery(function(){
                            _this.logger.debug("Processing Creation Lifecycle.");
                            _this.createLifeCycle(instance);
                        },function(){
                            _this.logger.debug("Processing Destruction Lifecycle.");
                            _this.destroyLifeCycle(instance);
                        });
                    }else{
                        this.logger.debug("Processing Creation Lifecycle.");
                        this.createLifeCycle(instance);
                    }
                    /**remember this might not be fully initialized yet!*/
                    return instance;
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$IoC.FactoryError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(){
            var iocConfiguration;
            var iocconf;
            var i;
            try{
                this.logger.debug("Configuring Claypool IoC Factory");
                iocConfiguration = this.getConfig()||[];
                this.logger.debug("IoC Configurations: %d", iocConfiguration.length);
                for(i=0;i<iocConfiguration.length;i++){
                    try{
                        iocconf = iocConfiguration[i];
                        if(iocconf.scan && iocconf.factory){
                            this.logger.debug("Scanning %s with %s", iocconf.scan, iocconf.factory);
                            iocConfiguration = iocConfiguration.concat(
                                iocconf.factory.scan(iocconf.scan)
                            );
                        }else{
                            this.logger.debug("IoC Configuration for Id: %s", iocconf.id);
                            this.add( iocconf.id, iocconf );
                        }
                    }catch(e){
                        this.logger.exception(e);
                        return false;
                    }
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$IoC.ConfigurationError(e);
            }
            return true;
        }
    });
    
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
     *      stores instances and uses an instance factory to
     *      create new instances if one can't be found (for lazy instantiation patterns)
     */
    $$IoC.Container = function(options){
        $$.extend(this, $$.Application.ContextContributor);
        $.extend(true, this, options);
        this.factory = null;
        this.logger = $.logger("Claypool.IoC.Container");
        this.logger.debug("Configuring Claypool IoC Container");
        /**Register first so any changes to the container managed objects 
        are immediately accessible to the rest of the application aware
        components*/
        this.factory = new $$IoC.Factory();
        this.factory.updateConfig();
    };
    
    $.extend( $$IoC.Container.prototype,
        $$.Application.ContextContributor.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        get: function(id){
            var instance;
            var _this = this;
            try{
                this.logger.debug("Search for a container managed instance :%s", id);
                instance = this.find(id);
                if(!instance){
                    this.logger.debug("Can't find a container managed instance :%s", id);
                    instance = this.factory.create(id);
                    if(instance){
                        this.logger.debug("Storing managed instance %s in container", id);
                        this.add(id, instance);
                        //The container must be smart enough to replace active objects bound to dom 
                        if(instance._this["@claypool:activeobject"]){
                            $(document).bind('claypool:postcreate:'+instance.id,  function(event, reattachedObject, id){
                                _this.logger.info("Reattached Active Object Inside IoC Container");
                                instance._this = reattachedObject;
                            });
                            $(document).bind('claypool:postdestroy:'+instance.id,  function(){
                                _this.logger.info("Removed Active Object Inside IoC Container");
                                _this.remove(id);
                            });
                        }else{
                            //trigger notification of new id in ioc container
                            $(document).trigger("claypool:ioc",[id, this]);
                            //trigger specific notification for the new object
                            $(document).trigger("claypool:ioc:"+id,[id, this]);
                        }
                        //is safer than returning instance._this becuase the the object may be modified
                        //during the event hooks above, eg an aspect may have been attached.
                        return this.find(id)._this;
                    }
                }else{
                    this.logger.debug("Found container managed instance :%s", id);
                    return instance._this;
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$IoC.ContainerError(e);
            }
            return null;
        }
    });
    
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
    //TODO : what is the useful static plugin that could be derived fro Claypool.IoC?
	
})(  jQuery, Claypool, Claypool.IoC );
Claypool.MVC = {
/*
 * Claypool.MVC @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 */
};

(function($, $Log, $$MVC){
    
    $.manage("Claypool.MVC.Container", "claypool:MVC");
    
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
    $$MVC.View$Interface = {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        update: function(model){//refresh screen display logic
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        think: function(){//display activity occuring, maybe block
            throw new $$.MethodNotImplementedError();
        }
    };
	
})(  jQuery, Claypool, Claypool.MVC );

/**
 * In Claypool a controller is meant to be a wrapper for a generally 'atomic'
 * unit of business logic. 
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
	/**
	 * @constructor
	 */
	$$MVC.Controller = function(options){
        this.model  = null;
        this.view   = null;
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.MVC.Controller");
    };
    $.extend($$MVC.Controller.prototype,
        $$.SimpleCachingStrategy.prototype,{
        handle: function(event){
            throw new $$.MethodNotImplementedError();
        }
    });
	
})(  jQuery, Claypool, Claypool.MVC );

/**
 *  The hijax 'or' routing controller implements the handle and resolve methods and provides
 *   a new abstract method 'strategy' which should be a function that return 
 *   a list, possibly empty of controller names to forward the data to.  In general
 *   the strategy can be used to create low level filtering controllers, broadcasting controllers
 *   pattern matching controllers (which may be first match or all matches), etc
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
    /**
     * @constructor
     */
    $$MVC.HijaxController = function(options){
		$$.extend(this, $$MVC.Controller);
        /*defaults*/
        $.extend(true, this, {
            forwardingList:[],
            selector:"",
            filter:"",
            active:true,
            preventDefault:true,
            stopPropagation:true,
            hijaxMap:[],
            resolveQueue:[],//TODO
            strategy:null//must be provided by implementing class
        },  options );
        this.router = new $$.Router();
        this.bindCache = new $$.SimpleCachingStrategy();
        this.logger = $.logger("Claypool.MVC.HijaxController");
    };
    
    $.extend($$MVC.HijaxController.prototype, 
            $$MVC.Controller.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handle: function(data){
            //Apply the strategy
            this.logger.debug("Handling pattern: %s", data.pattern);
            this.forwardingList = this.router[this.strategy||"all"]( data.pattern );
            this.logger.debug("Resolving matched paterns");
            var _this = this;
            return jQuery(this.forwardingList).each(function(){
                var target, 
                    action, 
                    defaultView;
                try{
                    _this.logger.info("Forwaring to registered controller %s", this.payload.controller);
                    target = $.$(this.payload.controller);
                    //the default view for 'fooController' or 'fooService' is 'fooView' otherwise the writer
                    //is required to provide it before a mvc flow can be resolved.
                    defaultView = this.payload.controller.match('Controller') ?
                        this.payload.controller.replace('Controller', 'View') : null;
                    defaultView = this.payload.controller.match('Service') ?
                        this.payload.controller.replace('Service', 'View') : defaultView;
                    (function(t){
                        var  _event = data.args[0],//the event is the first arg, 
                            extra = [],//and then tack back on the original extra args.
                            m = {flash:[], length:0},//each in flash should be {id:"", msg:""}
                            v = defaultView,
                            c = target;
                        for(var i = 1; i < data.args.length; i++){extra[i-1]=data.args[i];}
                        var eventflow = $.extend( {}, _event, {
                           m: function(){
                               if(arguments.length === 0){
                                   return m;
                               }else if(arguments.length === 1){
                                   if(typeof(arguments[0]) == 'string'){
                                       return m[arguments[0]];
                                   }else if(arguments[0] instanceof Array){
                                       m.length += arguments[0].length;
                                       Array.prototype.push.apply(m,arguments[0]);
                                   }else if(arguments[0] instanceof Object){
                                       $.extend(true, m, arguments[0]);
                                   }
                               }else if(arguments.length === 2){
                                   if(arguments[1] instanceof Array){
                                       if(typeof(arguments[0]) == 'string' && !(arguments[0] in  m)){
                                           m[arguments[0]] = [];
                                       }
                                       $.merge(m[arguments[0]], arguments[1]);
                                   }else if(arguments[1] instanceof XML || arguments[1] instanceof XMLList){
                                       m[arguments[0]] = arguments[1];
                                   }else if(arguments[1] instanceof Object){
                                       if(typeof(arguments[0]) == 'string' && !(arguments[0] in  m)){
                                           m[arguments[0]] = {};
                                       }
                                       $.extend(true, m[arguments[0]], arguments[1]);
                                   }
                               }
                               return this;//chain
                           },
                           v: function(view){
                               if(!view){
                                   return v;
                               }
                               if(view && typeof(view)=='string'){
                                   view = view.split('.');
                                   if(view.length === 1){
                                       v = view;
                                   }else if(view.length === 2){
                                       if(view[0] !== ""){
                                           v = view.join('.');
                                       }else{
                                           v = v.split('.')[0]+"."+view[1];
                                       }
                                   }
                               }
                               return this;//chain
                           },
                           c : function(){
                               var target, action, controller;
                               if(arguments.length === 0){
                                   return c;
                               }else if(arguments.length > 0 && typeof(arguments[0] == "string")){
                                    //expects "target{.action}"
                                    target = arguments[0].split(".");
                                    c = target[0];
                                    v  = c.match('Controller') ? c.replace('Controller', 'View') : null;
                                    v  = c.match('Service') ? c.replace('Service', 'View') : v;
                                    action = (target.length>0&&target[1].length>0)?target[1]:"handle";
                                    controller = _this.find(target[0]);
                                    if(controller === null){
                                        controller = $.$(target[0]);
                                        //cache it for speed on later use
                                        _this.add(target[0], controller);
                                    }
                                    controller[action||"handle"].apply(controller,  [this].concat(extra) );
                               }
                               return this;//chain
                           },
                           render:_this.renderer(),
                           reset:function(){
                               m = {flash:[], length:0};//each in flash should be {id:"", msg:""}
                               v = defaultView;
                               c = target;
                               return this;//chain
                           },
						   params: function(param){
						   	   if (arguments.length === 0) {
							   	return t.map ? t.map : {};
							   }
							   else {
							   	return t.map && t.map[param] ? t.map[param] : null;
							   }
						   }
                        });
                        //tack back on the extra event arguments
                        target[t.payload.action||"handle"].apply(target,  [eventflow ].concat(extra) );
                    })(this);
                }catch(e){
                    e = e?e:new Error();
                    if(e.name&&e.name.indexOf("Claypool.Application.ContextError")>-1){
                        _this.logger.warn("No controller with id: %s", this.payload.controller);
                    }else{  /**propogate unknown errors*/
                        _this.logger.exception(e); throw e;
                    }
                }
            });
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        attach: function(){
            this.router.compile(this.hijaxMap, this.routerKeys);//, "controller", "action");
            var _this = this;
            if(this.active&&(this.selector!==""||this.filter!=="")){
                this.logger.debug("Actively Hijaxing %s's %s%s", this.hijaxKey, this.selector, this.filter);
                $(this.selector+this.filter).livequery(function(){
                    _this.hijax(this);
                });
            }else if (this.selector!==""||this.filter!==""){
                this.logger.debug("Hijaxing Current %s's.", this.hijaxKey);
                $(this.selector+this.filter).each(function(){
                    _this.hijax(this);
                });
            }else if(document!==undefined){
                this.logger.debug("Hijaxing Document For %s's.", this.hijaxKey);
                _this.hijax(document);
            }else{this.logger.warn("Unable to attach controller: %s", options.id);}
        },
        hijax: function(target){
            this.logger.debug("Hijaxing %s: %s", this.hijaxKey, target);
            var _this = this;
            var _hijax = function(event){
                var retVal = true;
                _this.logger.info("Hijaxing %s: ", _this.hijaxKey);
                if(_this.stopPropagation){
                    _this.logger.debug("Stopping propogation of event");
                    event.stopPropagation();
                }
                if(_this.preventDefault){
                    _this.logger.debug("Preventing default event behaviour");
                    event.preventDefault();
                    retVal = false;
                }
                _this.handle({pattern: _this.target.apply(_this, arguments), args:arguments});
                return retVal;
            };
            if(this.event){
                /**This is a specific event hijax so we bind once and dont think twice  */
                $(target).bind(this.event+"."+this.eventNamespace, _hijax);
                _this.logger.debug("Binding event %s to hijax controller on target", this.event, target);
            }else{     
                /**
                *   This is a '(m)any' event hijax so we need to bind based on each routed endpoints event.
                *   Only bind to the event once (if its a custom event) as we will progagate the event
                *   to each matching registration, but dont want this low level handler invoked more than once.
                */
                $(this.hijaxMap).each(function(){
                    if(this.event&&!_this.bindCache.find(this.event)){
                        _this.bindCache.add(this.event, _this);
                        _this.logger.debug("Binding event %s to controller %s on target %s",
                            this.event, this.controller ,target);
                        $(target).bind(this.event+"."+_this.eventNamespace,_hijax);
                    }
                });
            }   
            return true;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        //provides a continuation for the mvc flow to allow room for asynch dao's and the like
        renderer: function(){
            var _this = this;
            var callbackStack = [];
            return function(callback){
                var target,
                    controller,
                    action,
                    view, 
                    viewMethod,
                    guidedEventRegistration;
                /**
                *   callbacks are saved until any forwarding is completed and then executed sequentially 
                *   by popping off the top (so in reverse of the order they where added)
                */
                if(callback&&$.isFunction(callback)){
                    callbackStack.push(callback);
                }
                _this.logger.debug(" - Resolving Control - %s)", this.c());
                try{
                    //a view can specifiy a method other than the default 'update'
                    //by providing a '.name' on the view
                    view = this.v();
                    //If a writer is provided, the default view method is 'render'
                    viewMethod = $.isFunction(this.write)?"render":"update";
                    if(view.indexOf(".") > -1){
                        viewMethod = view.split('.');
                        view = viewMethod[0];
                        //always use the last so we can additively use the mvc v value in closures
                        viewMethod = viewMethod[viewMethod.length-1];
                    }
                    _this.logger.debug("Calling View %s.%s", view, viewMethod);
                    view = $.$(view);
                    if(view){
                        if($.isFunction(view[viewMethod])){
                            //if a 'writer' is provided the view is called with both args
                            if(this.write){
                                view.write = this.write;
                                view.append = this.append;
                                view[viewMethod](this.m());
                            }else{
                                view[viewMethod](this.m());
                            }
                            _this.logger.debug("Cascading callbacks");
                            while(callbackStack.length > 0){ (callbackStack.pop())(); }
                        }else if (view["@claypool:activeobject"]){
                            //some times a view is removed and reattached.  such 'active' views
                            //are bound to the post create lifecycle event so they can resolve 
                            //as soon as possible
                            guidedEventRegistration = "claypool:postcreate:"+view["@claypool:id"]+"."+$.guid();
                            $(document).bind(guidedEventRegistration,function(event, newView){
                                _this.logger.warn("The view is reattached to the dom.");
                                //unbind handler
                                $(document).unbind(guidedEventRegistration);
                                newView.update(this.m());
                                _this.logger.debug("Cascading callbacks");
                                while(callbackStack.length > 0){ (callbackStack.pop())(); }
                            });
                        }else{
                            _this.logger.debug("View method cannot be resolve", viewMethod);
                        }
                    }else{
                        _this.logger.warn("Cant resolve view %s. ", this.v());
                    }
                }catch(e){
                    _this.logger.error("Error resolving flow %s => %s", this.c(), this.v()).
                        exception(e);
                    throw e;
                }
                return this;//chain
            };
        },
        /**returns some part of the event to use in router, eg event.type*/
        target: function(event){
            throw new $$.MethodNotImplementedError();
        }
    });
    
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
    $$MVC.Factory = function(options){
        $$.extend(this, $$.IoC.Factory);
        $.extend(true, this, options);
        this.configurationId = 'mvc';
        this.logger = $.logger("Claypool.MVC.Factory");
    };
    
    $.extend($$MVC.Factory.prototype,
        $$.IoC.Factory.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(){
            var mvcConfig;
            try{
                this.logger.debug("Configuring Claypool MVC Controller Factory");
                mvcConfig = this.getConfig()||{};//returns mvc specific configs
                //Extension point for custom low-level hijax controllers
                $(document).trigger("claypool:hijax", [this, this.initializeHijaxController, mvcConfig]);
            }catch(e){
                this.logger.exception(e);
                throw new $$MVC.ConfigurationError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        scan: function(name){
            var log = this.logger||$.logger("Claypool.MVC.Factory");
            log.debug("Scanning %s" , name);
            var prop, 
                scanBase, 
                configsByConvention = [],
                idNamingConvention = function(localName, type){
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1)+type);
                },
                domNamingConvention = function(localName){
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1));
                };
            try{
                scanBase = $.resolve(name);
                for(prop in scanBase){
                    log.debug("Scan Checking %s.%s" , name, prop);
                    if($.isFunction(scanBase[prop])){
                        log.debug("Found Function Definition on %s.%s" , name, prop);
                        if(name.match(".Models")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Model"),
                               clazz: name+"."+prop
                            });
                        }else if(name.match(".Views")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "View"),
                               clazz: name+"."+prop,
                               selector: domNamingConvention(prop)
                            });
                        }else if(name.match(".Controllers")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Controller"),
                               clazz: name+"."+prop
                            });
                        }else if(name.match(".Services")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Service"),
                               clazz: name+"."+prop
                            });
                        }
                    }  
                }
            }catch(e){
                log.error("Error Scanning %s!!", name).exception(e);   
            }
            return configsByConvention;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        initializeHijaxController: function(mvcConfig, key, clazz, options){
            var configuration;
            var i;
            if(mvcConfig[key]){
                for(i=0;i<mvcConfig[key].length;i++){
                    configuration = {};
                    configuration.id = mvcConfig[key][i].id;
                    configuration.clazz = clazz;
                    configuration.options = [ $.extend(true, {}, options, mvcConfig[key][i]) ];
                    this.logger.debug("Adding MVC Configuration for Controller Id: %s", configuration.id);
                    this.add( configuration.id, configuration );
                }
            }
        }
    });
    
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
    $$MVC.Container = function(options){
        $$.extend(this, $$.Application.ContextContributor);
        $.extend(true, this, options);
        this.factory = null;
        this.logger = $.logger("Claypool.MVC.Container").
             debug("Configuring Claypool MVC Container");
        //Register first so any changes to the container managed objects 
        //are immediately accessible to the rest of the application aware
        //components
        this.factory = new $$MVC.Factory();
        this.factory.updateConfig();
        //create global controllers non-lazily
        var controller,
            id;
        for(id in this.factory.cache){
            //will trigger the controllerFactory to instantiate the controllers
            controller = this.get(id);
            //activates the controller
            this.logger.debug("attaching mvc core controller: %s", id);
            controller.attach();
        }
    };
    
    $.extend($$MVC.Container.prototype, 
        $$.Application.ContextContributor.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        get: function(id){
            var controller;
            try{
                this.logger.debug("Search for a container managed controller : %s", id);
                controller = this.find(id);
                if(controller===undefined||controller===null){
                    this.logger.debug("Can't find a container managed controller : %s", id);
                    controller = this.factory.create(id);
                    if(controller !== null){
                        this.add(id, controller);
                        return controller._this;
                    }else{
                        return null;
                    }
                }else{ 
                    this.logger.debug("Found container managed controller : %s", id);
                    return controller._this;
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$MVC.ContainerError();
            }
            throw new $$MVC.FactoryError(id);
        }
    });
    
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
    //TODO : what is the useful static plugin that could be derived from Claypool.MVC?
    //      router ?
	$.extend($, {
        //this defines the built-in low-level controllers. adding more is easy! 
        //For another example see claypool server
	    router : function(confId, options){
            $(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
                registrationFunction.apply(_this, [
                    configuration, confId, "Claypool.MVC.HijaxController", options
                ]);
            });
            return this;
	    }
	});
	/*
     *   -   Model-View-Controller Patterns  -
     *
     *   Claypool MVC provides some low level built in controllers which a used to 
     *   route control to your controllers.  These Claypool provided controllers have a convenient
     *   configuration, though in general most controllers, views, and models should be
     *   configured using the general ioc configuration patterns and are simply referenced as targets.
     *
     *   The Claypool built-in controllers are:
     *       hijax:a - maps url patterns in hrefs to controllers.
     *           The href resource is resolved via ajax and the result is delivered to the specified
     *           controllers 'handle' method
     * 
     *       hijax:form - maps form submissions to controllers.
     *           The submittion is handled via ajax and the postback is delivered to the specified
     *           controllers 'handle' method
     *
     *       hijax:button - maps button (not submit buttons) to controllers.
     *           This is really useful for dialogs etc when 'cancel' is just a button but 'ok' is a submit.
     *
     *       hijax:event - maps custom or dom events to controllers.  
     */
	$.router( "hijax:a", {
        selector        : 'a',
        event           : 'click',
        strategy        : 'first',
        routerKeys      : 'urls',
        hijaxKey        : 'link',
        eventNamespace  : "Claypool:MVC:HijaxLinkController",
        target       : function(event){ 
            var link = event.target||event.currentTarget;
            while(link.tagName.toUpperCase()!='A'){
                link = $(link).parent()[0];
            }
            return $(link).attr("href");
        }
    }).router( "hijax:button",{
        selector        : ':button',
        event           : 'click',
        strategy        : 'all',
        routerKeys      : 'ids',
        hijaxKey        : 'button',
        eventNamespace  : "Claypool:MVC:HijaxButtonController",
        target       : function(event){ 
            return event.target.id;
        }
    }).router( "hijax:input",{
        selector        : 'input',
        event           : 'blur',
        strategy        : 'all',
        routerKeys      : 'ids',
        hijaxKey        : 'input',
        eventNamespace  : "Claypool:MVC:HijaxInputController",
        target       : function(event){ 
            return event.target.id;
        }
    }).router( "hijax:form",{
        selector        : 'form',
        event           : 'submit',
        strategy        : 'first',
        routerKeys      : 'urls',
        hijaxKey        : 'form',
        eventNamespace  : "Claypool:MVC:HijaxFormController",
        target       : function(event){ 
            return event.target.action;
        }
    }).router( "hijax:event",{
        strategy        : 'all',
        routerKeys      : 'event',
        hijaxKey        : 'event',
        eventNamespace  : "Claypool:MVC:HijaxEventController",
        target       : function(event){ 
            return event.type;
        }
    });
    
    $.mvc_scanner = $$MVC.Factory.prototype;
	
})(  jQuery, Claypool, Claypool.MVC );

Claypool.Server={
/*
 * Claypool.Server @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Server (Servlet) Patterns  -
 */
};
(function($, $$, $$Web){
    
    $.router( "hijax:server", {
        event:          'claypool:serve',
        strategy:       'first',
        routerKeys:     'urls',
        hijaxKey:       'request',
        eventNamespace: "Claypool:Server:HijaxServerController",
        target:     function(event, request){ 
            return request.url;//request/response object
        }
    });
    
    
})(  jQuery, Claypool, Claypool.Server );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    $$Web.Servlet = function(options){
        $$.extend(this, $$.MVC.Controller);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.Servlet");
    };
    
    $.extend( $$Web.Servlet.prototype,
        $$.MVC.Controller.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        //We reduce to a single response handler function because it's not easy to
        //support the asynch stuff on the server side
        handle: function(event, data, request, response){
            //data is just the routing info that got us here
            //the request and response is really all we care about
            response = $.extend(true, response, event, {
                write: function(str){response.body = str; return this;},
                append: function(str){response.body += str;return this;}
            });
            try{
                switch(request.method.toUpperCase()){
                    case 'GET':
                        this.logger.debug("Handling GET request");
                        this.handleGet(request, response);
                        this.logger.debug("Finished Handling GET request. Setting status 200.");
                        response.headers.status = 200;
                        break;
                    case 'POST':
                        this.logger.debug("Handling POST request");
                        this.handlePost(request, response);
                        break;
                    case 'PUT':
                        this.logger.debug("Handling PUT request");
                        this.handlePut(request, response);
                        break;
                    case 'DELETE':
                        this.logger.debug("Handling DELETE request");
                        this.handleDelete(request, response);
                        break;
                    case 'HEAD':
                        this.logger.debug("Handling HEAD request");
                        this.handleHead(request, response);
                        break;
                    case 'OPTIONS':
                        this.logger.debug("Handling OPTIONS request");
                        this.handleOptions(request, response);
                        break;
                    default:
                        this.logger.debug("Unknown Method: %s, rendering error response.",  request.method);
                        this.handleError(request, response, "Unknown Method: " + request.method );
                }
            } catch(e) {
                this.logger.exception(e);
                this.handleError(request, response, "Caught Exception in Servlet handler", e);
            }/*finally{
                $$Web.render(request, response);
            }*/
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePut: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleDelete: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleHead: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleOptions: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleError: function(request, response, msg, e){
            this.logger.warn("The default error response should be overriden");
            response.headers.status = 300;
            response.body = msg?msg:"Unknown internal error\n";
            response.body += e&&e.msg?e.msg:(e?e:"\nUnpsecified Error.");
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        resolve: function(data){
            this.logger.warn("The default resolve response is meant to be overriden to allow the rendering of a custom view.");
            return data.response;
        }
    });
    
})(  jQuery, Claypool, Claypool.Server );



/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    $$Web.ReSTScaffold = function(options){
        $$.extend(this, $$Web.Servlet);
        $.extend( true, this, options);
        this.logger = $.logger("Claypool.Server.ReSTScaffold");
        this.Model  = $.$(options.model);
    };
    
    $.extend($$Web.ReSTScaffold.prototype,
        $$Web.Servlet.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet:function(request, response){
            var instance, id$format, 
                _this = this, p = request.requestURL;
            if(p){
                id$format = p.match(/(\d+)\.(\w+)$/);
                if(id$format){
                    //Find an existing record
                    this.logger.debug("Getting Instance %", id$format[1]);
                    instance = new this.Model(Number(id$format[1]));
                    response.body = this.Model.serialize(instance, id$format[2]);
                    response.headers["Content-Type"] =
                        "text/"+id$format[2];
                }else{
                    id$format = p.match(/(\w+)$/);
                    if(id$format){
                        p.replace(/(\w+)$/, function(url, action){
                            _this.logger.debug("using custom action : %s", action);
                            if($.isFunction(_this[action])){
                                _this[action](request, response);
                            }
                            return action;
                        });
                        return response;
                    }else{
                        //the search is a good catch-all for a get
                        this.search(request,response);
                    }
                }
                this.chooseView(request, response);
            }
            return response;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        search: function(request, response){
            this.logger.debug("Searching for records.");
            var searchTerms =  request.parameters.searchTerms||'*',
                itemsPerPage = Number(request.parameters.itemsPerPage||40),
                startIndex =   Number(request.parameters.startIndex||0), 
                offsetIndex =  Number(request.parameters.offsetIndex||0),
                startPage =    Number(request.parameters.startPage||0),
                language = "en-US",
                inputEncoding = "utf-8",
                outputEncoding = "utf-8",
                results = [],
                filter,
                i;
            for (var param in request.parameters ){
                this.logger.debug("checking for filter % ", param);
                for(i=0;i<this.Model._meta.fields.length;i++){
                    if(this.Model._meta.fields[i].fieldName == param){
                        this.logger.debug("adding filter % = ? (%)", param, request.parameters[param]);
                        filter = filter? filter.filter(param + " = ?", request.parameters[param]):
                            this.Model.filter(param + " = ?", request.parameters[param]);
                    }
                }
            }
            filter = filter ? filter : this.Model.all();
            if(searchTerms == "*"){
                results =   filter.
                            limit(itemsPerPage).
                            offset((startPage*itemsPerPage)+offsetIndex+startIndex).
                            toArray();
                for(i=0;i<results.length;i++){
                    results[i] = this.Model.serialize(results[i]);
                }
                this.logger.debug("Found %s results from search.", results.length);
                response.m({
                    xmlns$opensearch    : "http://a9.com/-/spec/opensearch/1.1/",
                    searchTerms         : searchTerms,
                    startPage           : startPage,
                    totalResults        : results.length,
                    startIndex          : startIndex,
                    itemsPerPage        : itemsPerPage,
                    results             : results
                });
            }
            
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            var instance, newuser, id$format, p = request.requestURL,
                _this = this;
            this.logger.debug("ReSTService POST: \n%s", request.body);
            if(p){
                if(p.match(/(\d+)\.(\w+)$/)){
                    id$format = p.match(/(\d+)\.(\w+)$/);
                    //Update an existing record
                    this.logger.debug("Updating Instance %", id$format[1]);
                    instance = this.Model(Number(id$format[1]));
                    //UPDATE
                    newinstance = this.Model.deserialize(request.body, id$format[2]);
                    newinstance = new this.Model(newinstance);
                    newinstance.setPkValue(instance.getPkValue());
                    this.Model.transaction(function(){
                        instance.remove();
                        newinstance.save();
                    });
                    response.body = newinstance.getPkValue();
                    response.headers.status = 200;
                    response.headers["Content-Type"] = "text/plain";
                }else if(p.match(/(new)\.(\w+)$/)){
                    id$format = p.match(/(new)\.(\w+)$/);
                    this.logger.debug("Saving New Instance (formatted as %s) \n%s ", id$format[2], request.body);
                    newinstance = this.Model.deserialize(request.body, id$format[2]);
                    newinstance = new this.Model(newinstance);
                    this.logger.debug("Deserialized new instance %s ", newinstance);
                    //SAVE
                    newinstance.save();
                    response.body = newinstance.getPkValue();
                    response.headers.status = 200;
                    response.headers["Content-Type"] = "text/plain";
                }else if(p.match(/search$/)){
                    this.search(request,response);
                    this.chooseView(request, response);
                }else {
                    p.replace(/(\w+)$/, function(url, action){
                        _this.logger.debug("using custom action : %s", action);
                        if($.isFunction(_this[action])){
                            _this[action](request, response);
                        }
                        return action;
                    });
                }
            }
            this.logger.debug("POST RESPONSE \n %s", response.body);
            return response;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleDelete: function(request, response){
            var instance, id$format, p = request.requestURL;
            if(p){
                id$format = p.match(/(\d+)\.(\w+)$/);
                if(id$format){
                    //Delete an existing record
                    this.logger.debug("Deleting Instance %", id$format[1]);
                    instance = this.Model.find(id$format[1]);
                    instance.remove();
                    response.body = "";
                    response.headers.status = 200;
                    response.headers["Content-Type"] = "text/plain";
                }
            }
            return response;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        chooseView:function(request, response){
            var p = request.requestURL;
            if(p.match(/atom$/)){
                response.headers.status = 200;
                response.headers["Content-Type"] = "application/atom+xml";
                response.v('.atom');
            }else if(p.match(/xml$/)){
                response.headers.status = 200;
                response.headers["Content-Type"] = "text/xml";
                response.v('.xml');
            }else if(p.match(/xhtml$/)){
                response.headers.status = 200;
                response.headers["Content-Type"] = "text/html";
                response.v('.xhtml');
            }else{
                response.headers.status = 200;
                response.headers["Content-Type"] = "text/json";
                response.v('.json');
            }
            response.render();
        }
    });
    
})(  jQuery, Claypool, Claypool.Server );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    $$Web.WebProxyServlet = function(options){
        $$.extend(this, $$Web.Servlet);
        this.rewriteMap = null;//Array of Objects providing url rewrites
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.WebProxyServlet");
        this.router = new $$.Router();
        this.strategy = this.strategy||"first";
        this.logger.debug("Compiling url rewrites %s.", this.rewriteMap);
        this.router.compile(this.rewriteMap, "urls");//, "rewrite");
    };
    
    $.extend($$Web.WebProxyServlet.prototype, 
        $$Web.Servlet.prototype,{
        handleGet: function(request, response){
            this.logger.debug("Handling proxy: %s", request.requestURI);
            var _this = this;
            var proxyURL = this.router[this.strategy||"all"]( request.requestURI );
            request.headers["Claypool-Proxy"] = this.proxyHost||"127.0.0.1";
			var params = {};
			for (var prop in request.parameters){
				this.logger.debug("request.parameters[%s]=%s", prop, request.parameters[prop]);
				params[prop+'']=request.parameters[prop]+'';
			}
            if(proxyURL && proxyURL.length && proxyURL.length > 0){
                _this.logger.debug("Proxying get request to: %s", proxyURL[0].payload.rewrite);
                $.ajax({
                    type:"GET",
                    dataType:"text",
                    async:false,
                    data:params,
                    url:proxyURL[0].payload.rewrite+'',
                    beforeSend: function(xhr){
                        _this.logger.debug("Copying Request headers for Proxied Request");
                        for(var header in request.headers){
                            _this.logger.debug("Setting proxied request header %s: %s",header, request.headers[header] );
                            if(header == 'host'){continue;}
                            xhr.setRequestHeader(header, request.headers[header]);
                        }
                        response.headers = {};
                    },
                    success: function(text){
                        _this.logger.debug("Got response for proxy.");
                        response.body = text;
                        _this.logger.debug("Setting Response Status 200.");
                        response.headers.status = 200;
                    },
                    error: function(xhr, status, e){
                        _this.logger.error("Error proxying request. STATUS: %s", status?status:"UNKNOWN");
                        if(e){_this.logger.exception(e);}
                        response.headers.status = 500;
                    },
                    complete: function(xhr, status){
                        _this.logger.debug("Proxy Request Complete, Copying response headers");
                        var proxyResponseHeaders = xhr.getAllResponseHeaders();
                        var responseHeader;
                        var responseHeaderMap;
                        _this.logger.debug("Complete Proxy response header: \n %s" ,proxyResponseHeaders);
                        proxyResponseHeaders = proxyResponseHeaders.split("\r\n");
                        for(var i = 0; i < proxyResponseHeaders.length; i++){
                            responseHeaderMap = proxyResponseHeaders[i].split(":");
                            try{
                                _this.logger.debug("setting response header %s %s", responseHeaderMap[0], responseHeaderMap.join(":"));
                                response.headers[responseHeaderMap.shift()] = responseHeaderMap.join(":");
                            }catch(e){
                                _this.logger.warn("Unable to set a proxied response header");
                                _this.logger.exception(e);
                            }
                        }
                        response.headers["Claypool-Proxy"] = proxyURL[0].payload.rewrite;
                        response.headers["Content-Encoding"] = proxyURL[0].payload.contentEncoding||"";
                        if(proxyURL[0].payload.contentType){
                            //override the content type
                            response.headers["Content-Type"] = proxyURL[0].payload.contentType;
                        }
                    }
                });
            }
            return response;
        }
    });
    
})(  jQuery, Claypool, Claypool.Server );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    $$Web.E4XServlet = function(options){
        $$.extend(this,$$Web.Servlet);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.E4XServlet");
    };
    
    $.extend($$Web.E4XServlet.prototype,
        $$Web.Servlet.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet: function(request, response){
            var _this = this;
            //for this service we use the a json string as the model
            if(!typeof(response.m('postparams')) == "string"){
                //no model has been set by a post
                if($.isFunction($.js2json)){
                    response.m("postparams", $.js2json(request.parameters));
                }else{
                    response.m("postparams","{}");
                }
            }
            try{
                this.logger.info("Loading E4X from url :\n%s", request.requestURI);
                $.ajax({ 
                    type:'GET',  
                    url:(this.baseURI||"./")+request.requestURI, 
                    dataType:"text/plain",
                    async:false,
                    success:function(text){
                        _this.logger.info("Successfully retreived E4X :\n%s \n Evaluating with model %s",
                            request.requestURI, response.m("postparams"));
                        var e4x = eval("(function(){"+
                            "var model = "+response.m("postparams")+";"+
                            "return new XMLList(<>"+text+"</>);"+
                        "})();");
                        response.body = e4x.toString();
                        response.headers["Content-Type"] = "text/html";
                        response.headers.status = 200;
                        _this.logger.info("Finished Evaluating E4X :\n%s", request.requestURI);
                    },
                    error:function(xhr, status, e){
                        _this.logger.info("Error retreiving E4X :\n%s", request.requestURI);
                        response.body = "<html><head></head><body>"+e||"Unknown Error"+"</body></html>";
                        response.headers["Content-Type"] = "text/html";
                        response.headers.status = 200;
                    }
                });
            }catch(e){
                this.logger.error("Error evaluating. \n\n%s", request.requestURI).
                    exception(e);
                response.body = e.toString();
            }
            return response;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            response.m("postparams",String(request.body));//should be a json string
            return this.handleGet(request,response);
        }
    });
    
})(  jQuery, Claypool, Claypool.Server );



/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    $$Web.ConsoleServlet = function(options){
        $$.extend( this, $$Web.Servlet);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.ConsoleServlet");
    };
    
    $.extend($$Web.ConsoleServlet.prototype, 
        $$Web.Servlet.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            var retval = "ok";
            try{
                this.logger.info("Executing command :\n%s", request.body);
                retval = eval(String(request.body));
                retval = (retval===undefined)?"ok":retval;
                this.logger.info("Finished Executing command :\n%s", request.body);
                response.body = retval||"error: see server logs.";
            }catch(e){
                this.logger.error("Error executing command. \n\n%s", request.body).
                    exception(e);
                response.body = e.toString();
            }
            response.body = retval;
            response.headers["Content-Type"] = "text/plain";
            response.headers.status = 200;
            return response;
        }
    });
        
    
})(  jQuery, Claypool, Claypool.Server );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    $$Web.Console = function(options){
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.Console");
    };
    
    $.extend($$Web.Console.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        run: function(command){
            var _this = this;
            $.ajax({ 
                type:'POST',  
                url:'console/',   
                processData:false,  
                contentType:'text', 
                data:command,
                success:function(response){
                    _this.logger.info(response);
                },
                error: function(xhr, status, e){
                    _this.logger.error("Error sending command (%s)", s).exception(e);
                }
            });
        }
    });
        
    
})(  jQuery, Claypool, Claypool.Server );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
	/**
	 * @constructor
	 */
    //TODO There should be some useful errors so we can handle common issues
    //like error pages for 500's, 404's etc
	
})(  jQuery, Claypool, Claypool.Server );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    //TODO : what is the useful static plugin that could be derived from Claypool.Server?
    //      console ?
    var $log;
    
    var console;
    
    $.extend($, {
        _ : function(command){
            console = console || new $$Web.Console();
            console.run(command);
        },
        serve: function(request, response){ 
            $log = $log||$.logger("Claypool.Server");
            $log.info("Handling global request routing for request: %s ", request.requestURL).
                 debug("Dispatching request to Server Sevlet Container");
            response.headers = {};
            $.extend( response.headers, { contentType:'text/html', status: 404 });
            response.body = "<html><head></head><body>"+
                "Not Found :\n\t"+request.requestURL+
            "</body></html>";
            try{
                $(document).trigger("claypool:serve",[
                    {url:request.requestURL},
                    request, response
                ]);
            }catch(e){
                $log.error("Error Handling Request.").exception(e);
                response.headers["Content-Type"] = "text/html";
                response.headers.status = 500;
                response.body = "<html><head></head><body>"+e||"Unknown Error"+"</body></html>";
            }
        }/*,
        //TODO this is deprecated
        render: function(request, response){
            $log.debug("Finished Handling global request : %s  response %o", request.requestURL, response);
        }*/
    });
    
    /**@global*/
    ClaypoolServerHandler = $.serve;
    
    
})(  jQuery, Claypool, Claypool.Server );
