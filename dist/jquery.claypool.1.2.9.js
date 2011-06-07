var Claypool={
/**
 * Claypool jquery.claypool.1.2.9 - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008-2010 Chris Thatcher (claypooljs.com)
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
        clear:  function(){ throw "MethodNotImplementedError"; },
        add:    function(id, object){ throw "MethodNotImplementedError"; },
        remove: function(id){ throw "MethodNotImplementedError"; },
        find:   function(id){ throw "MethodNotImplementedError"; }
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
        get: function(id){ throw "MethodNotImplementedError";  },
        put: function(id, object){ throw "MethodNotImplementedError"; }
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
            throw "MethodNotImplementedError";
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
                            //the claypool 'word' class is an extension of the standard word which
                            //includes - and .
							return '([\\w\\-\\.]+)';
						});
                        /**pattern might be used more than once so we need a unique key to store the route*/
                        this.add(String($$.uuid()) , {
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
        create: function(){ throw "MethodNotImplementedError"; }
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
        getConfig: function(){ throw "MethodNotImplementedError";},
        loadConfig: function(){ throw "MethodNotImplementedError";},
        setConfig: function(){ throw "MethodNotImplementedError";},
        updateConfig: function(){ throw "MethodNotImplementedError";}
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
        scan:function(){ throw "MethodNotImplementedError"; }
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
                this.logger.debug( "Configuration for <%s> has not been set explicitly or has been updated implicitly.",  this.configurationId );      
                this.logger.debug("$$.Configuration: \n %o", $$.Configuration);
                if($$.Configuration[this.configurationId]){
                    this.logger.debug("Found Claypool.Configuration");
                    this.configuration = $$.Configuration[this.configurationId];
                }else if(!$$.Configuration){
                    //it's not specified in js code so look for it remotely
                    this.loadConfig();
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
            this.logger.debug("Attempting to load configuration from: %s", this.configurationUrl);
            //a non async call because we need to configure the loggers
            //with this info before they are called!
            var _this = this;
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
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	setConfig: function(id, configuration){
    	    this.logger.debug("Setting configuration");
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
             throw "MethodNotImplementedError";
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
			//support for namespaces
            if(value === undefined){
                //search the contexts in priority order
                a = null;
                for(i=0;i<globalContext.length;i++){
                    a = globalContext[i]().get(id);
                    if(a){return a;}
                } return null;
            }else{
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
        resolve: function(namespacedName){
            var _resolver;
            var namespaces;
            var target; //the resolved object/function/array/thing or null
            var i;
            
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
             var applocation,
                 automap;
             //an environment is set or defined by calling
             //$.env('defaults', 'client.dev')
             if(arguments.length == 2 ){
                 //env is not necessarily flat so deep extension may be necessary
                 env = $.extend( true, env||{}, 
                     $.config('env.'+arguments[0]),
                     $.config('env.'+arguments[1]));
                 return env;
             }else if (arguments.length === 0){
                //automatic environment detection via location introspection
                //is based on an excellent contribution from
                //Gabriel Birke
                automap = $.config('env.automap');
                //attempt to auto-configure environment based on window location
                for(applocation in automap){
                    if(new RegExp(applocation).exec(window.location)){
                        return $.env('defaults', automap[applocation]);
                    }
                }
             }else{
                 if(arguments.length === 1 && !(typeof(arguments[0])=='string')){
                    //a convenience method for defining environments
					//like $.config('env',{});
					return $.config('env', arguments[0]);
                 }
                 return env[arguments[0]]||null;
             }
             return null;
         }
        //TODO add plugin convenience methods for creating factory;
        //factory : function(){}
        //TODO add plugin convenience methods for creating context;
        //context : function(){}
        /* Deprecated: clashes with jQuery.cache and never used internally
         * Not even a good plugin in jquery spirit, so not trying to provide
         * equivalent with different name unless someone notices.
         * Thanks to Olly Wenn for noting this conflict 
        cache: function(options){
            return new $$.SimpleCachingStrategy(options);
        } 
        */
        
    });
    $.extend($$, plugins, {
		/**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns Describe what it returns
	     * @type String
	     */
	    uuid: function(){
	        return new Date().getTime()+"_"+(++guid)+"_"+Math.round(Math.random()*100000000);
		}
    });
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
            }
            if($$Log.updated){
                $$Log.loggerFactory.updateConfig();
                $$Log.updated = false;
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
            throw "MethodNotImplementedError";
        },
        info:       function(){
            throw "MethodNotImplementedError";
        },
        warn:       function(){
            throw "MethodNotImplementedError";
        },
        error:      function(){
            throw "MethodNotImplementedError";
        },
        exception:  function(){
            throw "MethodNotImplementedError";
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
        var test;
        try{
            if(window&&window.console&&window.console.log){
                try{
                    if( 'Envjs' in window ){
                    	return new $$Log.SysOutAppender(options);
					}
                }catch(e){
                    //swallow
                }
                $.extend(true, this, options);
                this.formatter = new $$Log.FireBugFormatter(options);
                return this;
            }else{
                return new $$Log.SysOutAppender(options);
            }
        }catch(e){
            //Since the console and print arent available use a null implementation.
            //Thanks to Brandon Smith for finding this bug!
            throw e;
        }
        return this;
    };
    
	//stupid ie8 added a console object but wont let you call
	//apply on its methods!!! nice one ie8 :{
    //this means logging messages need to have 9 params or less
	function console_apply(fn, args){//a is args
		if(fn.apply){
			fn.apply(console, args);
		}else if(args && args.length){
			switch(args.length){
				case 1: fn(args[0]);break;
				case 2: fn(args[0], args[1]);break;
				case 3: fn(args[0], args[1], args[2]);break;
				case 4: fn(args[0], args[1], args[2], args[3]);break;
				case 5: fn(args[0], args[1], args[2], args[3], args[4]);break;
				case 6: fn(args[0], args[1], args[2], args[3], args[4], args[5]);break;
				case 7: fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);break;
				case 8: fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);break;
				case 9: fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);break;
			}
		}
	}

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
                    console_apply(console.log, this.formatter.format(level, category, message));
                    break;
                case ("INFO"):
                    console_apply(console.info, this.formatter.format(level, category, message));
                    break;
                case ("WARN"):
                    console_apply(console.warn, this.formatter.format(level, category, message));
                    break;
                case ("ERROR"):
                    console_apply(console.error,this.formatter.format(level, category, message));
                    break;
                case ("EXCEPTION"):
                    //message is e
                    //console_apply(console.error, this.formatter.format(level, category, 
                    //    message.message?[message.message]:[])); 
                    console_apply(console.error, [e]);//[printStackTrace({e:message}).join('\n')]);
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
            throw "MethodNotImplementedError";
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
                    this.logger.warn("Claypool Logging was not initalized correctly. Logging will not occur unless initialized.");
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
                this.logger.debug('root logging category is set to %s', rootLoggerConf);
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
            this.logger.debug("Configuring Claypool Logging");
            this.clear();
            loggingConfiguration = this.getConfig()||[];
            for(i=0;i<loggingConfiguration.length;i++){
                logconf = loggingConfiguration[i];
                this.add( logconf.category, logconf );
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
	$.extend($, {
	    logger  : function(name){
	        return $$Log.getLogger(name);
	    },
		//careful, names are very similiar!
        logging  : function(){
            if(arguments.length === 0){
                return $.config('logging');
            }else{
                $$Log.updated = true;
                return $.config('logging', arguments[0]);
            }
        }
	});
	
	var $log;
	
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
    
    
    $$.Commands = {
    // An object literal plugin point for providing plugins on
    // the Claypool namespace.  This object literal is reserved for
    // commands which have been integrated as well established
    // and have been included in the jQuery-Clayool repository
    // as official
    };
	
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
            var contextObject,
            	contributor,
				ns;
            
			//support for namespaces
			ns = typeof(id)=='string'&&id.indexOf('#')>-1?
				[id.split('#')[0],'#'+id.split('#')[1]]:['', id];
			//namespaced app cache
			if(!this.find(ns[0])){
				this.add(ns[0], new $$.SimpleCachingStrategy());
			}
            this.logger.debug("Searching application context for object: %s" ,id);
            contextObject = null;
            contextObject = this.find(ns[0]).find(ns[1]);
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
        },
        put: function(id, object){
			//support for namespaces
			var ns, nscache;
			ns = typeof(id)=='string'&&id.indexOf('#')>-1?
				[id.split('#')[0],'#'+id.split('#')[1]]:['', id];
			//namespaced app cache
			nscache = this.find(ns[0]);
			if(!nscache){
				nscache = new $$.SimpleCachingStrategy();
				this.add(ns[0], nscache);
			}
			if(nscache.find(ns[0])){
				nscache.remove(ns[1]);
			}
            this.logger.debug("Adding object to global application context %s", id);
            nscache.add(ns[1], object);
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
                var pointcut, cutline, details;//new method , old method
                _this.logger.debug( "Weaving Advice %s for Aspect %s", methodName, _this.id );
                
                _this.hasPrototype = typeof(_this.target.prototype) != 'undefined';
                cutline = _this.hasPrototype ? 
                    _this.target.prototype[methodName] : 
                    _this.target[methodName];
                pointcut = _this.advise(cutline, _this._target, methodName);
                if(!_this.hasPrototype){
                    _this.target[methodName] = pointcut;
                }else{ 
                    _this.target.prototype[methodName] = pointcut;
                }
                details = { 
                    pointcut:pointcut,
                    cutline:cutline,
					method: methodName,
					target: _this._target
                };
				return details;
            };
            //we dont want an aspect to be woven multiple times accidently so 
            //its worth a quick check to make sure the internal cache is empty.
            if(this.size===0){//size is empty
                pattern = new RegExp(this[this.type?this.type:"method"]);
                targetObject = this.target.prototype?this.target.prototype: this.target;
                for(var f in targetObject){
                    if($.isFunction(targetObject[f])&&pattern.test(f)){
                        this.logger.debug( "Adding aspect to method %s", f );
                        this.add($$.uuid(), _weave(f));
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
            for(var id in this.cache){
                aspect = this.find(id);
               if(!this.hasPrototype){
                    this.target[this.method] = aspect.cutline;
                } else {
                    this.target.prototype[this.method] = aspect.cutline;
                } this.hasPrototype = null;
            } 
            this.clear();
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
            throw "MethodNotImplementedError";
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
            advise: function(cutline, target, method){
                var _this = this;
                return function() {
                    //call the original function and then call the advice 
                    //   aspect with the return value and return the aspects return value
                    var returnValue = cutline.apply(this, arguments);//?should be this?
                    return _this.advice.apply(_this, [returnValue, target, method]);
                };
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
            advise: function(cutline, target, method){
                var _this = this;
                return function() {
					var args = [];
					_this.logger.debug('cutline arguments length %s', arguments.length);
					for(var i=0;i<arguments.length;i++){
						args.push(arguments[i]);
					}
					args.push({
						target: target,
						method: method
					});
					_this.logger.debug('applying advice to %s.%s', target, method);
                    _this.advice.apply(_this, args);
                    return cutline.apply(this, arguments);//?should be this?
                };
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
            advise: function(cutline, target, method){
                var _this = this;
                return function() {
                    var invocation = { object: this, args: arguments};
                    return _this.advice.apply(_this, [{ 
                        object: invocation.object,
                        arguments:  invocation.args, 
						target: target, 
						method: method,
                        proceed :   function() {
                            var returnValue = cutline.apply(invocation.object, invocation.args);
                            return returnValue;
                        }
                    }] );
                };
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
         * @param {Object} lateTarget provided only if a lazy loaded app-managed object
		 *					needs to have aop applied to it.
         * @returns true if no errors occured
         * @type Boolean
         */
        updateConfig: function(lateTarget){
            var _this = this;
            var aopConfiguration;//entire config
            var aopconf;//unit of config
            var i;
            var targetRef, namespace, prop, genconf;
            
            this.logger.debug("Configuring Claypool AOP AspectFactory");
            aopConfiguration = this.getConfig()||[];
            this.logger.debug("AOP Configurations: %d", aopConfiguration.length);
            for(i=0;i<aopConfiguration.length;i++){
                aopconf = aopConfiguration[i];
				//in the case where we are late binding (lazy loading) an application
				//instance, the aopconf.target property will still be a string (otherwise an object)
				//and so we can easily update the aop engine by only checking only those entries
				if(typeof(aopconf.target)=='string'){
                    //  resolve the advice which must be specified as an optionally
                    //  namespaced string eg 'Foo.Bar.goop' 
                    if(!$.isFunction(aopconf.advice)){
                        aopconf.advice = $.resolve(aopconf.advice);
                    }
                    //If the adive is to be applied to an application managed instance
                    //then bind to its lifecycle events to weave and unweave the
                    //aspect.  This works without modification for lazy loaded app-managed
					//objects.
                    if(aopconf.target.match("^ref://")){
                        targetRef = aopconf.target.substr(6,aopconf.target.length);
                        $(document).bind("claypool:ioc:"+targetRef, function(event, id, iocContainer){
                            _this.logger.debug("Creating aspect id %s for instance %s", aopconf.id);
                            var instance, ns;
							//support for namespaces
							ns = typeof(id)=='string'&&id.indexOf('#')>-1?
								[id.split('#')[0],'#'+id.split('#')[1]]:['', id];
							if(!iocContainer.find(ns[0])){
								iocContainer.add(ns[0], new $$.SimpleCachingStrategy());
							}
								instance = iocContainer.find(ns[0]).find(ns[1]);
							aopconf.literal = {
								scope: 'global',
								object: id
							};
                            aopconf._target = aopconf.target;
                            aopconf.target = instance._this;
                            _this.add(aopconf.id, aopconf);
                            //replace the ioc object with the aspect attached
                            var aspect = _this.create(aopconf.id);
                            instance._this = aspect.target;
                            iocContainer.find(ns[0]).remove(ns[1]);
                            iocContainer.find(ns[0]).add(ns[1], instance);
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
                        *   flexible enough to allow a namespaced class, and in either case,
                        *   it's specified as a string so we have to resolve it
                        */
                        if(aopconf.target.match(/\.\*$/)){
                            //The string ends with '.*' which implies the target is every function
                            //in the namespace.  hence we resolve the namespace, look for every
                            //function and create a new filter for each function.
                            this.logger.debug("Broad aspect target %s", aopconf.target);
							
							if(!lateTarget || (lateTarget.clazz.match(aopconf.target))){
                            	namespace = $.resolve(aopconf.target.substring(0, aopconf.target.length - 2));
                                for(prop in namespace){
                                    if($.isFunction(namespace[prop])){
                                        //extend the original aopconf replacing the id and target
                                        genconf = $.extend({}, aopconf, {
                                            id : aopconf.id+$$.uuid(),
                                            target : namespace[prop],
                                            _target: aopconf.target.substring(0, aopconf.target.length - 1)+prop
                                        });
                                        this.logger.debug("Creating aspect id %s [%s] (%s)", 
                                            aopconf.target, prop, genconf.id);
                                        this.add(genconf.id, genconf);
                                        this.create(genconf.id);//this creates the aspect
                                    }
                                }
							}
                        }else{	
							//Finally when we do have a late target, make sure we only bother with checking
							//aop configs that match the late targets clazz
							if(!lateTarget || (lateTarget.clazz.match(aopconf.target))){
                            	this.logger.debug("Creating aspect id %s", aopconf.id);
								aopconf._target = aopconf.target;
                                aopconf.target =  $.resolve(aopconf.target);
						
                                this.add(aopconf.id, aopconf);
                                this.create(aopconf.id);//this creates the aspect
							}
                        }
                    }
				}
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
        create: function(id, namespace){//id is #instance or $Class
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
                var aspect, ns;
				//support for namespaces
				ns = typeof(id)=='string'&&id.indexOf('#')>-1?
					[id.split('#')[0],'#'+id.split('#')[1]]:['', id];
				//namespaced app cache
				if(!this.find(ns[0])){
					this.add(ns[0], new $$.SimpleCachingStrategy());
				}
                this.logger.debug("Search for a container managed aspect :%s", id);
                aspect = this.find(ns[0]).find(ns[1]);
                if(aspect===undefined||aspect===null){
                    this.logger.debug("Can't find a container managed aspect :%s", id);
                    aspect = this.factory.create(ns[1], ns[0]);
                    if(aspect !== null){
                        this.find(ns[0]).add(ns[1], aspect);
                        return aspect;
                    }
                }else{
                    this.logger.debug("Found container managed instance :%s", id);
                    return aspect;
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
(function($, $$, $AOP){
	/**
	 * @constructor
	 */
	$.extend($, {
	    filters  : function(){
            if(arguments.length === 0){
                return $.config('aop');
            }else{
                return $.config('aop', arguments[0]);
            }
	    }
	});
	
	
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
            guid            : $$.uuid(), //globally (naively) unique id for the instance created internally
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
            this._this = {claypoolId:this.id};//a temporary stand-in for the object we are creating
            this.logger.debug("Precreating Instance");
            $(document).trigger("claypool:precreate", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:precreate:"+this.id, [this._this]);
            //TODO:  Apply function specified in ioc hook
            return this;
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
                _this.$log.debug("Created new instance of %s", _this.$ns);
                
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
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        postcreate:function(){
            //TODO:  Apply function specified in ioc hook
            this.logger.debug("PostCreate invoked");
            $(document).trigger("claypool:postcreate", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:postcreate:"+this.id, [this._this]);
            return this._this;
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
            //TODO:  Apply function specified in ioc hook
            this.logger.debug("Predestory invoked");
            $(document).trigger("claypool:predestroy", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:predestroy:"+this.id, [this._this]);
            return this._this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        destroy:function(){
            //TODO:  
            //we dont actually do anyting here, yet... it might be
            //a good place to 'delete' or null things
            this.logger.info("Destroy invoked");
            $(document).trigger("claypool:destroy", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:destroy:"+this.id, [this._this]);
            return delete this._this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        postdestroy:function(){
            //TODO:  Apply functions specified in ioc hook
            this.logger.debug("Postdestory invoked");
            $(document).trigger("claypool:postdestroy", [this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:postdestroy:"+this.id);
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        resolveConstructor:function(constructorName){
            var constructor = $.resolve(constructorName); 
            if( $.isFunction(constructor) ){
                this.logger.debug(" Resolved " +constructorName+ " to a function");
                return constructor;
            }else{ 
                throw ("NoSuchConstructor:" + constructorName);
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
		this.lazyLoadAttempts = {};
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
            //Walk the creation lifecycle
            instance.precreate();
            instance.create();
            instance.postcreate();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        destroyLifeCycle: function(instance){
            //Walk the creation lifecycle
            instance.predestroy();
            instance.destroy();
            instance.postdestroy();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        create: function(id, namespace){
	        var configuration,
            	instance,
            	_this = this,
				remote, folder, file, appbase,
				literal;
            
			namespace = namespace||'';
			if(!this.find(namespace)){
				this.logger.debug("Adding cache for namespace %s", namespace);
				this.add(namespace, new $$.SimpleCachingStrategy());
			}
            this.logger.debug("Looking for configuration for instance %s%s", namespace, id);
            configuration = this.find(namespace).find(id);
            if(configuration === null){
                this.logger.warn("No known configuration for instance %s%s", namespace, id);
				remote = id.match(/#([a-z]+([A-Z]?[a-z]+)+)([A-Z][a-z]+)+/);
				if(remote){
					_this.logger.debug('resolving lazyload %s', id);
					//holds reference to names eg ['MyApp','Model','FooBar']
					literal = [  $$.Namespaces[namespace] ];
					//now prepend appbase if specified otherwise use the root /
					//and finally determine the intermediate package as 'models'
					//'views', etc
					literal[1] = remote.pop();
					literal[1] = literal[1]+'s';
					//allows 'appbase' to be null for default case, a single string,
					//or a map of appbases per namespace
					appbase = $.env('appbase');
					if(appbase && namespace){
					    //only use a namespace based folder if there is a namespace
					    //and they havent specified an appbase
					    folder = "";
					}else if (namespace){
					    folder = namespace + '/';
					}else{
					    folder = '';
					}
					appbase = (appbase === null) ? '/' :
						typeof(appbase)=='string' ?
							appbase :
							appbase[namespace];
					folder = appbase+literal[1].toLowerCase()+'/';
					//finally determine the script itself which should be the lowercase
					//foobar from an id like abc#fooBarModel or #fooBarModel or #foobarModel etc
					literal[2] = remote[1].substring(0,1).toUpperCase()+remote[1].substring(1);
					file = remote[1].toLowerCase()+'.js';
					_this.logger.debug('attempting to lazyload %s from %s%s', id, folder, file);
					if(_this.lazyLoadAttempts[folder+file]){
						//avoid danger of infinite recursion here
						_this.logger.debug('already attempted to load %s%s', folder, file);
						return null;
					}else{
						_this.lazyLoadAttempts[folder+file] = 1;
						$.ajax({
							async:false,
							url:folder+file,
							dataType:'text',
							timeout:3000,
							success: function(text){
								_this.logger.info('lazyloaded %s ', literal.join('.'));
								if(!$.env('debug')){
									jQuery.globalEval(text);
								}else{
									eval(text);
								}
								var config = {
									id: id,
									namespace: namespace,
									clazz: literal.join('.')
								};
								if(literal[1] == 'Views'){
									config.selector = '#'+literal[2].substring(0,1).toLowerCase()+literal[2].substring(1);
								}
								_this.find(namespace).add(id, config);
								try{
									//late bound (lazy loaded) application managed objects have to
									//go through a process of iteration over the registered aop filters
									//to see if any apply to it.  This call is sufficient to do that.
									$$.Application["claypool:AOP"].factory.updateConfig(config);
								}catch(e){
									_this.logger.error('Failed in late binding to aop configuration').
										exception(e);
								}
							},
							error: function(xhr, status, e){
								_this.logger.error('failed (%s) to load %s%s', xhr.status, folder, file).
									exception(e);
							}
						});		
						_this.logger.info('completed lazyloaded for %s%s ', id, namespace);
						return _this.create(id, namespace);
					}
					//Work In Progress
				}else{
					_this.logger.warn('id requested did not match those applicable for late loading %s', id);
				}
                return null;
            }else{
                this.logger.debug("Found configuration for instance %s%s", namespace, id);
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
            
            this.logger.debug("Configuring Claypool IoC Factory");
            iocConfiguration = this.getConfig()||[];
            this.logger.debug("IoC Configurations: %d", iocConfiguration.length);
            for(i=0;i<iocConfiguration.length;i++){
                iocconf = iocConfiguration[i];
                if(iocconf.scan && iocconf.factory){
                    this.logger.debug("Scanning %s with %s", iocconf.scan, iocconf.factory);
                    iocConfiguration = iocConfiguration.concat(
                        iocconf.factory.scan(iocconf.scan, iocconf.namespace)
                    );
                }else{
                    this.logger.debug("IoC Configuration for Id: %s%s", 
						iocconf.namespace||'', iocconf.id );
					if(iocconf.namespace){
						//namespaced app configs
						if(!this.find(iocconf.namespace)){
							this.add(iocconf.namespace, new $$.SimpleCachingStrategy());
						}
						this.find(iocconf.namespace).add(iocconf.id, iocconf);
					}else{
						//non-namespaced app configs
						if(!this.find('')){
							this.add('', new $$.SimpleCachingStrategy());
						}
						this.find('').add(iocconf.id, iocconf);
					}
                }
            }
            return true;
        }
    });
    
})(  jQuery, Claypool, Claypool.IoC );


/**
 * Holds references to application managed objects or 
 * uses the factory to create them the first time.
 * @thatcher 
 * @requires core, logging
 */
(function($, $$, $$IoC){
    /**
     * @constructor
     * stores instances and uses an instance factory to
     * create new instances if one can't be found 
	 * (for lazy instantiation patterns)
     */
    $$IoC.Container = function(options){
        $$.extend(this, $$.Application.ContextContributor);
        $.extend(true, this, options);
        this.factory = null;
        this.logger = $.logger("Claypool.IoC.Container");
        this.logger.debug("Configuring Claypool IoC Container");
        /**
		Register first so any changes to the container managed objects 
        are immediately accessible to the rest of the application aware
        components
		*/
        this.factory = new $$IoC.Factory();
        this.factory.updateConfig();
    };
    
    $.extend( $$IoC.Container.prototype,
        $$.Application.ContextContributor.prototype,{
        /**
         * Checks cache for existing instance and delegates to factory
		 * factory if none currently exists
         * @private
         * @param {String} id Application ID
         * @returns Application managed instance
         * @type Object
         */
        get: function(id){
            var instance,
				ns,
				_this = this;
			//support for namespaces
			ns = typeof(id)=='string'&&id.indexOf('#')>-1?
				[id.split('#')[0],'#'+id.split('#')[1]]:['', id];
			//namespaced app cache
			if(!this.find(ns[0])){
				this.add(ns[0], new $$.SimpleCachingStrategy());
			}
            this.logger.debug("Searching for a container managed instance :%s", id);
            instance = this.find(ns[0]).find(ns[1]);
            if(!instance){
                this.logger.debug("Can't find a container managed instance :%s", id);
				//note order of args is id, namespace to ensure backward compat
				//with claypool 1.x apps
                instance = this.factory.create(ns[1], ns[0]);
                if(instance){
                    this.logger.debug("Storing managed instance %s in container", id);
                    this.find(ns[0]).add(ns[1], instance);
                    //The container must be smart enough to replace active objects bound to dom 
                    if(instance._this["@claypool:activeobject"]){
                        $(document).bind('claypool:postcreate:'+instance.id,  function(event, reattachedObject, id){
                            _this.logger.info("Reattached Active Object Inside IoC Container");
                            instance._this = reattachedObject;
                        });
                        $(document).bind('claypool:postdestroy:'+instance.id,  function(){
                            _this.logger.info("Removed Active Object Inside IoC Container");
                            _this.find(ns[0]).remove(ns[1]);
                        });
                    }else{
                        //trigger notification of new id in ioc container
                        $(document).trigger("claypool:ioc",[id, this]);
                        //trigger specific notification for the new object
                        $(document).trigger("claypool:ioc:"+id,[id, this]);
                    }
                    //is safer than returning instance._this becuase the the object may be modified
                    //during the event hooks above
                    return this.find(ns[0]).find(ns[1])._this;
                }
            }else{
                this.logger.debug("Found container managed instance :%s", id);
                return instance._this;
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
	$$.Namespaces = {};
	/**
	 * @constructor
	 */
    $.extend($, {
        scan  : function(){
            var scanPaths, ns;
            if(arguments.length === 0){
                return $.config('ioc');
            }else{
                scanPaths = [];
				if($.isPlainObject(arguments[0])){
					//namespaced application paths
					//eg $.scan({ my: 'MyApp', abc: "OtherApp"})
					//or $.scan({ my: 'MyApp', abc: ["OtherApp.Services", "OtherApp.Models"]})
					for(ns in arguments[0]){
						_scan(arguments[0][ns], ns);
					}
				}else if($.isArray(arguments[0])){
					//no namespace array of paths to scan
					// eg $.scan(['MyApp.Models, MyApp.Views']);
					_scan(arguments[0]);
				}else if(typeof arguments[0] == 'string'){
					//no namespace single path
					// eg $.scan('MyApp')
					_scan(arguments[0]);
				}
				return $.config('ioc', scanPaths);
            }
			function _scan(path, namespace){
				var i;
				namespace = namespace||'';
				if($.isArray(path)){
					if(! (namespace in $$.Namespaces)){
						$$.Namespaces[namespace] = path[0].split('.')[0];
					}
					for(i = 0;i < path.length; i++){
	                    scanPaths.push({
	                        scan:path[i], 
							factory:$$.MVC.Factory.prototype,
							namespace: namespace?namespace:null
						}); 
				    }
				}else{
					if(! (namespace in $$.Namespaces)){
						$$.Namespaces[namespace] = path;
					}
					scanPaths.push({
                        scan:path, 
						factory:$$.MVC.Factory.prototype,
						namespace: namespace?namespace:null
					});
				}
			}
        },
		invert: function(){
            if(arguments.length === 0){
                return $.config('ioc');
            }else{
                return $.config('ioc', arguments[0]);
            }
        }
    });
	
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

(function($){
    
    $.manage("Claypool.MVC.Container", "claypool:MVC", function(container){
        var i,
            id,
            router,
            config = container.factory.getConfig(),
            type;
        for(type in config){
            container.logger.debug("eagerly loading mvc routers: %s", type);
            for(i=0;i<config[type].length;i++){
                //eagerly load the controller
                id = config[type][i].id;
                controller = container.get(id);
                //activates the controller
                container.logger.debug("attaching mvc core controller: %s", id);
                if(controller && !controller.attached){
                    controller.attach();
                    controller.attached = true;
                }
            }
        }
    });
    
})(  jQuery);


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
            throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        think: function(){//display activity occuring, maybe block
            throw "MethodNotImplementedError";
        }
    };
	
})(  jQuery, Claypool, Claypool.MVC );

/**
 * In Claypool a controller is meant to be expose various 
 * aggregations of event-scope state.
 * 
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
	/**
	 * @constructor
	 */
	$$MVC.Controller = function(options){
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.MVC.Controller");
    };
    $.extend($$MVC.Controller.prototype,
        $$.SimpleCachingStrategy.prototype,{
        handle: function(event){
            throw "MethodNotImplementedError";
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
            var _this = this,
                _event = data.args[0],//the event is the first arg,
                extra = [],//and then tack back on the original extra args.
                state = {};
            for(var i = 1; i < data.args.length; i++){extra[i-1]=data.args[i];}
            if(this.forwardingList.length > 0){
                this.logger.debug('normalizing event state params %s', _event);
                if($.isFunction(this.normalize)){
                    state = this.normalize(_event/*the event*/);
                }
            }
            return jQuery(this.forwardingList).each(function(){
                var target, 
                    action, 
                    defaultView,
                    targetId;
                    
                _this.logger.info("Forwaring to registered controller %s", this.payload.controller);
                target = $.$(this.payload.controller);
                targetId = this.payload.controller;
                //the default view for 'fooController' or 'fooService' is 'fooView' otherwise the writer
                //is required to provide it before a mvc flow can be resolved.
                defaultView = this.payload.controller.match('Controller') ?
                    this.payload.controller.replace('Controller', 'View') : null;
                defaultView = this.payload.controller.match('Service') ?
                    this.payload.controller.replace('Service', 'View') : defaultView;
                //make params object represent the normalized state accentuated by route param map
                this.map = $.extend(state, this.map);
                (function(t){
                    var m,v,c, eventflow = $.extend( {}, _event, {
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
                            }else if(arguments.length > 0 && typeof(arguments[0]) == "string"){
                                //allow forwarded controller to have extra params info passed
                                //along with it.  .c('#fooController', { extra: 'info' });
                                if(arguments.length > 1 && $.isPlainObject(arguments[1])){
                                    t.map = $.extend(true, t.map||{}, arguments[1]);
                                }
                                //expects "target{.action}"
                                target = arguments[0].split(".");
                                //TODO: verify this was unintended and is bug. before this function
                                //      is called, internal 'c' is an object, after this function it 
                                //      is a string (if next line was reincluded)
                                //c = target[0]; 
                                v  = target[0].match('Controller') ? target[0].replace('Controller', 'View') : null;
                                v  = target[0].match('Service') ? target[0].replace('Service', 'View') : v;
                                action = (target.length>1&&target[1].length>0)?target[1]:"handle";
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
                            c = targetId;
                            m.reset = function resetm(){ m = {flash:[], length:0}; m.reset = resetm; return eventflow; };
                            v.reset = function resetv(){ v = defaultView; v.reset = resetv; return eventflow; };
                            c.reset = function resetc(){ c = targetId; c.reset = resetc; return eventflow; };
                            return this;//chain
                        },
                        params: function(param){
                            if (arguments.length === 0) {
                                return t.map ? t.map : {};
                            } else {
                                return (t.map && (param in t.map)) ? t.map[param] : null;
                            }
                        }
                    });
                    eventflow.reset();
                    //tack back on the extra event arguments
                    target[t.payload.action||"handle"].apply(target, [eventflow].concat(extra) );
                })(this);
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
                _this.handle({
                    pattern: _this.target.apply(_this, arguments), 
                    args:arguments,
                    normalize: _this.normalize?_this.normalize:function(){
                        return {};
                    }
                });
                return retVal;
            };
            if(this.event){
                $(this.event.split('|')).each(function(){
                    /**This is a specific event hijax so we bind once and dont think twice  */
                    $(target).bind(this+"."+_this.eventNamespace, _hijax);
                    _this.logger.debug("Binding event %s to hijax controller on target", this, target);
                    
                });
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
                
                //a view can specifiy a method other than the default 'update'
                //by providing a '.name' on the view
                view = this.v();
                //If a writer is provided, the default view method is 'render'
                viewMethod = $.isFunction(this.write)?
                    //since claypool 1.1.4 we prefer 'write' as the default 
                    //server-side view action since jquery.tmpl is being
                    //introduced an adds $.fn.render
                    ($.isFunction($.render)?"write":"render"):
                    //live dom modification should prefer the method 'update'
                    "update";
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
                        switch(viewMethod){
                            case "write":
                            case "writeln":
                                //calls event.write/event.writeln on the return
                                //value from view.write/view.writeln
                                this[viewMethod](view[viewMethod](this.m(), this));
                                break;
                            case "render":
                                //pre 1.1.4 the api called render and the
                                //view invoked 'write' but jquery.fn.tmpl
                                //uses render
                                view.write = this.write;
                                view.writeln = this.writeln;
                                view[viewMethod](this.m(), this);
                                break;
                            default:
                                //of course allow the users preference for view method
                                view[viewMethod](this.m(), this);
                        }
                        _this.logger.debug("Cascading callbacks");
                        while(callbackStack.length > 0){ (callbackStack.pop())(); }
                    }else if (view["@claypool:activeobject"]){
                        //some times a view is removed and reattached.  such 'active' views
                        //are bound to the post create lifecycle event so they can resolve 
                        //as soon as possible
                        guidedEventRegistration = "claypool:postcreate:"+view["@claypool:id"]+"."+$$.uuid();
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
                return this;//chain
            };
        },
        /**returns some part of the event to use in router, eg event.type*/
        target: function(event){
            throw "MethodNotImplementedError";
        }
    });
    
})(jQuery, Claypool, Claypool.MVC );


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
		//support for namespaces - routers are always in default
		//empty namespace
		this.add('', new $$.SimpleCachingStrategy());
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
            var mvcConfig,
                controller,
                type,
                id,
                i;
                
            this.logger.debug("Configuring Claypool MVC Controller Factory");
            mvcConfig = this.getConfig()||{};//returns mvc specific configs
            //Extension point for custom low-level hijax controllers
            $(document).trigger("claypool:hijax", [this, this.initializeHijaxController, mvcConfig]);
                
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        scan: function(name, namespace){
            var log = this.logger||$.logger("Claypool.MVC.Factory");
            var prop, 
                scanBase, 
                configsByConvention = [],
				conf,
                idNamingConvention = function(localName, type){
					//type : eg Views will be shortened to => View
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1)+type.substring(0, type.length-1));
                },
                domNamingConvention = function(localName){
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1));
                };

			namespace = namespace||'';
            log.debug("Scanning %s%s", namespace, name);
            
			if(name.split('.').length == 1){
				//MyApp
				scanBase = $.resolve(name);
				for(prop in scanBase){
					log.debug("Scan Checking %s.%s" , name, prop);
					if($.isPlainObject(scanBase[prop])){
						log.debug("Scan Following %s.%s" , name, prop);
						//we now get $.scan(['MyApp.Models', 'MyApp.Configs', etc])
						configsByConvention.push(this.scan(name+'.'+prop, namespace));
					}
				}
				
			}else if(name.split('.').length == 2){
				//MyApp.Controllers
				scanBase = $.resolve(name);
				for(prop in scanBase){
					log.debug("Scan Checking %s.%s" , name, prop);
					if($.isFunction(scanBase[prop])){
						log.debug("Configuring by Convention %s.%s" , name, prop);
						config = {
							id: idNamingConvention(prop, name.split('.')[1]),
							clazz: name+"."+prop,
							namespace: namespace
						};
						if(name.match(".Views")){
							//by convention views bind to element with id
							config.selector = domNamingConvention(prop);
						}
						configsByConvention.push(config);
					} 
				}
			}else if(name.split('.').length == 3){
				//MyApp.Controllers.Admin
				scanBase = $.resolve(name);
				if($.isFunction(scanBase)){
					log.debug('Appending to Configuration by Convention %s', name);
					config = {
						id: idNamingConvention(prop, name.split('.')[2]),
						clazz: name,
						namespace: namespace
					};
					if(name.match(".Views")){
						//by convention views bind to element with id
						config.selector = domNamingConvention(prop);
					}
					configsByConvention.push(config);
				}
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
            var configuration,
                i;
            if(mvcConfig[key]){
                for(i=0;i<mvcConfig[key].length;i++){
                    configuration = {};
                    configuration.id = mvcConfig[key][i].id;
                    configuration.clazz = clazz;
                    configuration.options = [ $.extend(true, {}, options, mvcConfig[key][i]) ];
                    this.logger.debug("Adding MVC Configuration for Controller Id: %s", configuration.id);
                    this.find('').add( configuration.id, configuration );
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
            var controller,
				ns;
				
            this.logger.debug("Search for a container managed controller : %s", id);
			//support for namespaces
			ns = typeof(id)=='string'&&id.indexOf('#')>-1?
				[id.split('#')[0],'#'+id.split('#')[1]]:['', id];
			//namespaced app cache
			if(!this.find(ns[0])){
				this.add(ns[0], new $$.SimpleCachingStrategy());
			}
            controller = this.find(ns[0]).find(ns[1]);
            if(controller===undefined||controller===null){
                this.logger.debug("Can't find a container managed controller : %s", id);
				//recall order of args for create is id, namespace so we maintain
				//backward compatability
                controller = this.factory.create( ns[1], ns[0]);
                if(controller !== null){
                    this.find(ns[0]).add(ns[1], controller);
                    return controller._this;
                }else{
                    return null;
                }
            }else{ 
                this.logger.debug("Found container managed controller : %s", id);
                return controller._this;
            }
            throw ("UnknownID:"+id);
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
    var log;
    //TODO : what is the useful static plugin that could be derived from Claypool.MVC?
    //      router ?
	$.extend($, {
        //this defines the built-in low-level controllers. adding more is easy! 
        //For another example see claypool server
	    router : function(confId, options){
            $(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
                log = log||$.logger('Claypool.MVC.Plugins');
                log.debug('registering router plugin: %s', confId);
                registrationFunction.apply(_this, [
                    configuration, confId, "Claypool.MVC.HijaxController", options
                ]);
            });
            return this;
	    },
        mvc  : function(){
            var prop, config;
            if(arguments.length === 0){
                return $.config('mvc');
            }else{
                config = $.config('mvc');
                //because mvc routes are named arrays, the relavant
                //array is not merged.  we force the arrays to be merged
                //if the property already exists
                for(prop in arguments[0]){
                    if(prop in config){
                        $.merge(config[prop], arguments[0][prop]);
                    }else{
                        config[prop] = arguments[0][prop];
                    }
                }
                return this;//chain
            }
        }
	});
    
    $.routes = $.mvc;
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
        },
        normalize:  function(event){
            var link = event.target||event.currentTarget,
                data = {};
            while(link.tagName.toUpperCase()!='A'){
                link = $(link).parent()[0];
            }
            var href = $(link).attr("href");
            var params = href.split('?');
            
            params = params && params.length > 1 ? params[1] : '';
            //now walk the params and split on &, then on =
            $(params.split('&')).each(function(i, param){
                var name_value = param.split('='),
                    name = name_value[0],
                    value = name_value[1],
                    tmp;
                if(name in data){
                    if(!$.isArray(data[name])){
                        tmp = data[name];
                        data[name] = [tmp];
                    }
                    data[name].push(value);
                }else{
                    data[name] = value;
                }
            });
            return data;
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
        },
        normalize:  function(event){
            return {};
        }
    }).router( "hijax:input",{
        selector        : 'input',
        event           : 'blur|focus',
        strategy        : 'all',
        routerKeys      : 'ids',
        hijaxKey        : 'input',
        eventNamespace  : "Claypool:MVC:HijaxInputController",
        target       : function(event){ 
            return event.target.id;
        },
        normalize:  function(event){
            var params = {};
            params[event.target.name] = event.target.value;
            return params;
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
        },
        normalize:  function(event){
            var params = {},
                serialized = $(event.target).serializeArray();
            $(serialized).each(function(i,object){
                var tmp;
                if(object.name in params){
                    if(!$.isArray(params[object.name])){
                        tmp = params[object.name];
                        params[object.name] = [];
                    }
                    params[object.name].push(object.value);
                } else {
                    params[object.name] = object.value;
                }
            });
            return params;
        }
    }).router( "hijax:event",{
        strategy        : 'all',
        routerKeys      : 'event',
        hijaxKey        : 'event',
        eventNamespace  : "Claypool:MVC:HijaxEventController",
        target       : function(event){ 
            return event.type;
        },
        normalize:  function(event){
            return {};
        }
    });
    
    $.mvc_scanner = $$MVC.Factory.prototype;
	
})(  jQuery, Claypool, Claypool.MVC );
Claypool.Models = {
/*
 * Claypool.Models @VERSION@ - A Web 1.6180339... Javascript Application Framework
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


/**
 * store configuration for building indexes
 **/
Claypool.Configuration.index = [];
/**
 * @author thatcher
 */


(function($, $$, $M){
    
    /**
     * @constructor
     * @classDescription - Provides a common validation and serialization
     *     deserialization routines
     * @param {Object} name
     * @param {Object} fields
     * @param {Object} options
     */
    $M.Model = function(name, fields, options){
        $.extend(true, this, $M.Factory(options));
        $.extend(this, {
            name: name,
            fields: fields
        });
    };
   
    $.extend($M.Model.prototype, {
        /**
         * 
         * @param {Object} options
         */
        validate:function(options){
            var flash = [],
                model = options.data,
                i, j, 
                batch,
                id;
            if( options.batch ){
                batch = [];
                for(i=0;i<model.length;i++){
                    id = model[i].$id;
                    this.validate($.extend({},options,{
                        data: model[i],
                        batch:false,
                        success:function(data){
                            data.$id = id;
                            batch.push(data);
                        },
                        error:function(data, _flash){
                            flash.push(_flash);
                        }
                    }));
                }
                if( flash.length === 0 ){
                    model = batch;
                }
            } else {
                for(var field in this.fields){
                    if(model[field] === undefined
                    && this.fields[field].generate){
                        //generate the field for them
                        model[field]=this.fields[field].generate();
                    }
                    if(this.fields[field].not){
                       //make sure no item in the list is equivalent
                        for(i=0;i<this.fields[field].not.length;i++){
                            if(model[field] instanceof Array){
                                //handle an array of simple values
                                for(j=0;j<model[field].length;j++){
                                    if(model[field][j]===this.fields[field].not[i]){
                                        //store the value and msg in flash
                                        //to pass to the callback
                                        flash[flash.length]={
                                            index:j,
                                            field: field,
                                            value:model[field][j],
                                            msg:this.fields[field].msg
                                        };          
                                    }
                                }
                            }else{
                                //handle simple values
                                if(model[field]===this.fields[field].not[i]){
                                    //store the value and msg in flash
                                    //to pass to the callback
                                    flash[flash.length]={
                                        value:model[field],
                                        field: field,
                                        msg:this.fields[field].msg
                                    };          
                                }
                            }
                        }       
                    }
                    //only validate patterns if defined
                    if(this.fields[field].pattern && (model[field]!==undefined)){
                        if(model[field] instanceof Array){
                            //handle array of simple values
                            for(j=0;j<model[field].length;j++){
                                if(!this.fields[field].pattern.test(model[field][j])){
                                    //store the value and msg in flash
                                    //to pass to the callback
                                    flash[flash.length]={
                                        index:j,
                                        field: field,
                                        value:model[field][j],
                                        msg:this.fields[field].msg
                                    };        
                                }
                            }
                        }else{
                            //handle a simple type
                            if(!this.fields[field].pattern.test(model[field])){
                                //store the value and msg in flash
                                //to pass to the callback
                                flash[flash.length]={
                                    value:model[field],
                                    field: field,
                                    msg:this.fields[field].msg
                                };        
                            }
                        }
                    }
                }  
            }
          
            if(flash.length>0 &&
                options.error && $.isFunction(options.error)){
                options.error(model, flash);
            }else{
                if(options.success&&$.isFunction(options.success)){
                    if(options.serialize){
                        model = this.serialize(model);
                    }
                    options.success(model);
                }
            }
            return this;
        },
    	serialize : function(model){
            var serialized = {},
                multi, 
                i;
            for(var field in model){
                if((this.fields[field]!==undefined ||
                   '__anything__' in this.fields || field == '$id') && !$.isFunction(model[field])){
                    if(this.fields[field] && 
                       this.fields[field].type){
                        if(this.fields[field].type == 'json'){
                            //serializes a json blob
                            serialized[field] = jsPath.js2json(model[field]);
                        }else if (this.fields[field].type == 'html'){
                            //serializes a dom html blob
                            serialized[field] = $('<div/>').append( $(model[field]).clone() ).html();
                        }else if (this.fields[field].type == 'xmllist'){
                            //serializes a e4x xml blob
                            serialized[field] = model[field].toString();
                        }
                    }else{
                        serialized[field] = model[field];
                    }
                }
            }
            return serialized;
        },
        deserialize: function(model){
            var deserialized = {};
            for(var field in this.fields){
                if((model[field]!==undefined ||
                   '__anything__' in this.fields) && !$.isFunction(model[field])){
                    if(this.fields[field].type){
                        if(this.fields[field].type == 'json'){
                            //deserializes a json blob
                            deserialized[field] = $.json2js(model[field]);
                        }else if (this.fields[field].type == 'html'){
                            //deserializes a dom html blob
                            deserialized[field] = $(model[field]);
                        }else if (this.fields[field].type == 'xmllist'){
                            //deserializes a e4x xml blob
                            deserialized[field] = new XMLList(model[field]);
                        }
                    }else{
                        serialized[field] = model[field];
                    }
                }
            }
            return deserialized;
        }
        
    });
    
    $.each([
        /**create the domain (or table space)*/
        'create',
        /**deletes the domain (or table space)*/
        'destroy',
        /**retreives available metadata from the domain*/
        'metadata',
        /**overwrites specified fields (does not remove unspecied fields)*/
        'save',
        /**adds values to specified fields does not overwrite them*/
        'add',
        /**removes specified fields or the entire item if no fields are specified*/
        'remove',
        /** gets a list of domains if no domain is specified
        gets a list of items in a domain if no item is specified
        gets a specific list of items is an array of string if no fields are specified
        gets a specific item if item is a string if no fields are specified
        gets a specific set of fields if fields are specified
        gets a specific set of items and set of fields if fields are specified*/
        'get',
        /**executes a query on the domain returning a list of items and/or the requested fields*/
        'find',
        /**returns a valid language specific query representing the query object*/
        'js2query',
        /**used to page through the results sets from find or large gets*/
        'next',
        'previous'
    ], function(index, value){
        $M.Model.prototype[value] = function(options){
           throw "MethodNotImplementedError";
        };
    });
    
})(  jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    
	var log;
	
    $M.Query = function(options){
        if(typeof(options) == 'string'){
            options = {context: options};
        }
        $.extend(true, this, {
            context: '',
            selectors:[],
            expressions:[],
            orderby:{ direction:'forward' },
            limit:0,
            startPage:0,
            resultsPerPage: 20
        }, options);
		log = $.logger('Claypool.Models.Query');
    };
    var $Q = $M.Query;
   
    $.extend($Q.prototype, {
       /**
        * Target Functions
        * @param {Object} name
        */
       items: function(selector){
           if(selector && (typeof selector == 'string')){
               // if arg is string
               // a select `selector` 
               this.selectors.push(selector);
           }else if(selector && selector.length && 
                   (selector instanceof Array)){
               // if selector is array
               // a select (`selector[0]`, `selector[1]`, etc) 
               $.merge(this.selectors, selector);
           }else{
               // if arg is not any of the above it is '*'
               // a select `selector` 
               this.selectors.push('*');
           }
           //chain all methods
           return this;
       },
       names: function(){
           //chain all methods
           return this.items('itemName()');
       },
       count: function(){
           //chain all methods
           return this.items('count()');
       },
       /**
        * Operator Functions
        * @param {Object} name
        */
       is: function(value){
           _compare(this,'=');
           _value(this,value);
           //chain all methods
           return this;
       },
       isnot: function(value){
           _compare(this,'!=');
           _value(this,value);
           //chain all methods
           return this;
       },
       islike: function(value){
           _compare(this,'~');
           _value(this,value);
           //chain all methods
           return this;
       },
       isnotlike: function(value){
           _compare(this,'!~');
           _value(this,value);
           //chain all methods
           return this;
       },
       isgt:function(value){
           _compare(this,'>');
           _value(this,value);
           //chain all methods
           return this;
       },
       isgte:function(value){
           _compare(this,'>=');
           _value(this,value);
           //chain all methods
           return this;
       },
       isbetween:function(values){
           _compare(this,'><');
           _value(this,values);
           //chain all methods
           return this;
       },
       islte: function(value){
           _compare(this,'<=');
           _value(this,value);
           //chain all methods
           return this;
       },
       islt:function(value){
           _compare(this,'<');
           _value(this,value);
           //chain all methods
           return this;
       },
       isin: function(values){
           _compare(this,'@');
           _value(this,values);
           //chain all methods
           return this;
       },
       isnotin: function(values){
           _compare(this,'!@');
           _value(this,values);
           //chain all methods
           return this;
       },
       /**
        * ResultSet Preparation Functions
        * @param {Object} name
        */
       orderby: function(name){
           _order(this,name);
           //chain all methods
           return this;
       },
       reverseorderby: function(name){
           _order(this, name, 'reverse');
           //chain all methods
           return this;
       },
       limit: function(count){
           this.limit = count;
       },
       //Pagination functions
       page: function(i, resultsPerPage){
           if(resultsPerPage){
               this.count = resultsPerPage;
           }
           this.startPage = i;
           //chain all methods
           return this;
       },
       next: function(callback){
           this.startPage++;
           //chain all methods
           return this;
       },
       previous:function(callback){
           this.startPage--;
           //chain all methods
           return this;
       }
    });
    
   /**
    * Expression Functions
    * @param {Object} name
    */
    var sugar = ['','like','gt','gte','between','lte','lt'];
    for(var i=0;i<sugar.length;i++){
        $Q.prototype['where'+sugar[i]]=function(name){
            _express(this, name, 'where', '');
            return this;
        };
        $Q.prototype['wherenot'+sugar[i]]=function(name){
            _express(this, name, 'where', 'not');
            return this;
        };
        $Q.prototype['whereeither'+sugar[i]]=function(name){
            _express(this, name, 'either', '');
            return this;
        };
        $Q.prototype['whereneither'+sugar[i]]=function(name){
            _express(this, name, 'either', 'not');
            return this;
        };
        $Q.prototype['and'+sugar[i]]=function(name){
            _express(this, name, 'and', '');
            return this;
        };
        $Q.prototype['andnot'+sugar[i]]=function(name){
            _express(this, name, 'and', 'not');
            return this;
        };
        $Q.prototype['or'+sugar[i]]=function(name){
            _express(this, name, 'or', '');
            return this;
        };
        $Q.prototype['ornot'+sugar[i]]=function(name){
            _express(this, name, 'or', 'not');
            return this;
        };
    }
    
                           //this,string|object,and|or,like|gte|lte,not 
    var _express = function(query, condition, logical, operator, negate){
       var prop = null;
       operator = operator?operator:'is';
       
       if(query && condition && logical &&
                $.isFunction(query[logical])){
           
           if(logical == 'where'){
               query.expressions = [];
               logical = 'and';
           }else if(logical == 'whereeither' || logical == 'whereneither'){
               query.expressions = [];
               logical = 'or';
           }
           if(typeof condition == 'string'){
               //or `name` = ""
               query.expressions.push({
                   name:condition,
                   type:logical
               });
           }else if(condition &&
                 	typeof(condition) == 'object' && 
                 	!(condition instanceof Array)){
               // if condition is object
               // where `a` = '1' or `b` = '2'  or `c` = '3'
               for(prop in condition){
                   if(typeof(condition[prop])=='string'){
                       if(negate){
                           query[logical](prop)['isnot'+operator](condition[prop]);
                       }else{
                           query[logical](prop)['isnot'+operator](condition[prop]);
                       }
                   }else if(operator===''&&//arrays only apply to equal/not equal operator
                               condition[prop]&&
                               condition[prop].length&&
                               condition[prop] instanceof Array){
                       if(negate){
                           query[logical](prop).isnotin(condition[prop]);
                       }else{
                           query[logical](prop).isin(condition[prop]);
                       }
                   }
               }
           }
       }
   };
   var _compare = function(query, symbol){
       query.expressions[
           query.expressions.length-1
       ].operator=symbol;
   };
   var _value = function(query, value){
       query.expressions[
           query.expressions.length-1
       ].value=value;
   };
   var _name = function(query, name){
       query.expressions[
           query.expressions.length-1
       ].name=name;
   };
   var _order = function(query, name, direction){
       query.orderby = {
           name:name,
           direction:(direction||'forward')
       };
   };
   
   /**
    * scratch pad 
    * 
        var _;
      
        //select * from `artists` where `$name` = 'Vox Populi' 
        //or $tags in ('alternative', 'rock') 
        _ = $.query();
      
        $('#artistsModel').find({
            query: _.items('*').
                    where('name').
                    is('Vox Populi').
                    or('tags').
                    isin(['alternative', 'rock']),
            success: function ( results ) {
                //do something with results
            },
            error: function( code, exception ){
                //do something with error conditions
            }
        });
        //is equivalent to
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items('*').
             where({$name:'Vox Poluli'}).
             or({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
        
        //select (`$name`, `$artistid`) from `artists` where `$tags` in ('alternative', 'rock')
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items(['$name','$artistid']).
             where({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
       
        //select (`$name`) from `artists` where `$tags` in ('alternative', 'rock')
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items('$name').
             where({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
       
       
       //select (itemName()) from `artists` where `$name`="Vox Populi" 
       // or `$label`="Nonrational"
        _ = new $Q();
        
        $('#artistsModel').find(
           _.names().
             either({
                 '$name':'Vox Populi',
                 '$label':'Nonrational'
             }),
           function(results, pages){
               //do something with results
           }
        );
        
       //select (itemName()) from `releases` where `$date` not null  
       // orderby `$date`
        _ = new $Q();
        
        $('#releasesModel').find(
           _.names().
             orderby('$date'),
           function(results, pages){
               //do something with results
           }
        );
        
       //select (count()) from `releases` where `$artist` = "Vox Populi"
        _ = new $Q();
        
        $('#releasesModel').find(
           _.count().
             where('$artist').
             is("Vox Populi"),
           function(results, pages){
               //do something with results
           }
        );
   */
   })(jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    
    $M.Client = function(options){
        $.extend(true, this, options);
    };
   
    $.each(['create','destroy','metadata','save','update','remove','get','find','js2query','next','previous'], 
        function(index, value){
            $M.Client.prototype[value] = function(options){
               this.db[value]($.extend(options,{
                   domain:this.name
               }));
               return this;
            };
        }
    );
    
})(jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    
    var log;
    
    $M.RestClient = function(options){
        //they must provide a object which implements
        //the methods js2json and json2js
        //we include $'s json plugin as a default implementation
        //when present
        this.js2json = $&&$.js2json&&$.isFunction($.js2json)?
            $.js2json:options.js2json;
        this.json2js = $&&$.json2js&&$.isFunction($.json2js)?
            $.json2js:options.json2js;
        $.extend(true, this, options);
        this.resturl = $.env('resturl')?$.env('resturl'):'/rest/';
		log = $.logger('Claypool.Models.RestClient');
    };
   
   $.extend($M.RestClient.prototype, {
       /**
        *     create,
        *         creates the domain for storage of items
        *     destroy,
        *         deletes the domain and all items in it
        *     save,
        *         save a single item or many items
        *     remove, 
        *     load 
        *         - operates on id an optional object (id, object) 
        */
       create: function(options){
           $.ajax($.extend({},options,{
                type: 'PUT',
                url: this.resturl+this.name+'/',
                dataType:'json',
                success: function(result){
                    _success('created data domain (%s)', options.success, result);
                },
                error: function(xhr, status, e){
                    _error('failed to create data domain', options.error, xhr, status, e);
                }
            }));
            return this;
       },
       destroy: function(options){
           $.ajax($.extend({},options,{
                type: 'DELETE',
                url: this.resturl+this.name+'/',
                dataType:'json',
                success: function(result){
                    _success('destroyed data domain', options.success, result);
                },
                error: function(xhr, status, e){
                    _error('failed to destroy data domain', options.error, xhr, status, e);
                }
            }));
            return this;
        },
        save: function(options){
            var id,
                i;
            if(!options.batch&&options.id){

                if(options.serialize){
                   options.data = this.serialize(options.data);
                }
                $.ajax($.extend({},options,{
                    type: options.update?'POST':'PUT',
                    url: (this.resturl+this.name+'/'+options.id),
                    data: this.js2json(options.data),
                    contentType:'application/json',
                    dataType:'json',
                    processData:false,
                    success: function(result){
                        _success('saved data to domain', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('failed to save data to domain', options.error, xhr, status, e);
                    }
               }));
            }else if(options.batch){
                //process as a batch save
                //batch is an object of objects, each
                //property name corresponding to the id
                //and each property value corresponding
                //to the item to be saved
				if(options.serialize){
	                for(i=0;i<options.data.length;i++){
	                    options.data[i] = this.serialize(options.data[i]);
	                }
				}
                
                $.ajax($.extend({},options,{
                    type: options.update?'POST':'PUT',
                    url: (this.resturl+this.name +'/'),
                    data: this.js2json(options.data),
                    contentType:'application/json',
                    processData:false,
                    dataType:'json',
                    success: function(result){
                        _success('saved batch data to domain', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('failed to save batch data to domain', options.error, xhr, status, e);
                    }
               }));
           }
            return this;
       },
       update:function(options){
           //saves additional fields to the object.
           this.save($.extend({},options,{update: true}));
           return this;
       },
       remove: function(options){
           
           if(options.id){
               $.ajax($.extend({},options,{
                   type: 'DELETE',
                   url: this.resturl+this.name+'/'+options.id,
                   data:(options.data instanceof Array)?
                           {data:options.data.join(',')}:
                           (options.data instanceof Object)?
                           options.data:
                           null,
                   dataType:'json',
                   success: function(result){
                       _success('removed item or item data from domain', options.success, result);
                   },
                   error: function(xhr, status, e){
                       _error('failed to delete item or item data from domain', options.error, xhr, status, e);
                   }
               }));
           }
            return this;
       },
       get: function(options){
           var ids,
               params = {
                   limit:options.limit ? Number(options.limit) : 1000,
                   start:options.start ? Number(options.start) : 1,
                   offset: options.offset ? Number(options.offset) : 0,
                   from: options.from ? options.from : ''
               };
           if(options.id && typeof options.id == 'string'){
               $.ajax($.extend({},options,{
                   type: 'GET',
                   url: this.resturl+this.name+'/'+options.id,
                   dataType:'json',
                   data: params,
                   success: function(result){
                       _success('retrieved data by id from domain', options.success, result);
                   },
                   error: function(xhr, status, e){
                       _error('failed to retrieved data by id from domain', options.error, xhr, status, e);
                   }
               }));
           }else if(options.id&&options.id.length){
               //batch get of items specified by array of id
               ids = options.id.join(',');
               $.ajax($.extend({},options,{
                   type: ids.length>1024?'POST':'GET',
                   url: this.resturl+this.name+'/',
                   data: $.extend(params, {id:ids}),
                   dataType:'json',
                   success: function(result){
                       _success('successfully for data by ids from domain', options.success, result);
                   },
                   error: function(xhr, status, e){
                       _error('failed to get data by ids from domain', options.error, xhr, status, e);
                   }
               }));
           }else{
                //get an array of items in the models domain
                $.ajax($.extend({},options,{
                    type: 'GET',
                    url: this.resturl+this.name+'/',
                    dataType:'json',
                    data: params,
                    success: function(result){
                        _success('loaded list of ids from domain', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('failed to list ids from domain ', options.error, xhr, status, e);
                    }
                }));
            }
            return this;
        },
        find: function(options){
            //allow language specific queries to be hand
            //constructed and used here by simply passing 
            //the query as a string.  the server will
            //use content negotiation to determine whether
            //to treat it as json serialized or a native query
            if(options.select){
                if(typeof options.select == 'object'){
                    if(!(options.select instanceof $M.Query)){
                        //using shorthand object notation to define the query
                        //so go ahead and create an internal Query object from
                        //it.
                        options.select = new $M.Query(options.select);
                    }
                    //set the context for the query if its not a native
                    //query string
                    options.select.context = this.name;
                }
                $.ajax($.extend({},options,{
                    type: 'POST',
                    url: this.resturl,
                    data: (typeof options.select == 'string') ?
                        options.select : 
                        this.js2json( $.extend(options.data||{}, options.select)),
                    contentType:(typeof options.select == 'string')?
                        'text/plain' :
                        'application/json',
                    processData:false,
                    dataType:'json',
                    success: function(result){
                        _success('saved item to domain', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('failed to save item to domain', options.error, xhr, status, e);
                    }
                }));
            }else{
                //rely on passed options to be sufficient
                //get an array of items in the models domain
                log.debug('performing simple parameter search');
                $.ajax($.extend({},options,{
                    type: 'GET',
                    url: this.resturl,
                    dataType:'json',
                    success: function(result){
                        _success('performed search', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('error performing search', options.error, xhr, status, e);
                    }
                }));
            }
            return this;
        },
        next: function(options){
            this.find(query.next(), callback);
            return this;
        },
        previous: function(options){
            this.find(query.previous(), callback);
            return this;
        }
    });
    
    
    var _success = function(msg, callback, result, pager){
        log.debug('loaded list of items from domain: %s', result);
        if(callback&&$.isFunction(callback)){
            callback(result, pager);
        }
    };
    
    var _error = function(msg, callback, xhr, status, e){
        log.error( msg+' %s-%s', xhr.status, status).
            exception(e);
        if(callback&&$.isFunction(callback)){
            //second arg implies error condition occured
            callback([{msg:msg}], true);
        }
    };
    
})(jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    var log;
    //Factory is really just a static function
    $M.Factory = function(options){
        options = options||{};
        log = log||$.logger('Claypool.Models.Factory');
        
        var DB,
            dbconnection;
        
        //select the db client implementation
        //
        // - 'rest' is entirely abstract and is the most reusable accross databases
        //   since it requires no database specific implementations by the client.
        //   the rest server-side services would generally use the 'direct' db client then
        //   to service the rest clients requests
        //
        // - 'direct' requires a reference to the database plugin but is otherwise
        //   generic as well. the db implementation shares a set of
        //   dbconnection parameters which are used to initialize the local
        //   clients connection
        var dbclient = options&&options.dbclient?
            options.dbclient:$.env('dbclient');
        if(!dbclient){
            dbclient = 'rest';
        }
        log.debug("loading database client connection %s", dbclient);
        if(dbclient=='rest'){
            dbclient = new $M.RestClient(options);
        }else{// if(dbclient == 'direct'){
            try{
                //get the database implementation and connection information
                DB = options&&options.db?
                        options.db:$.env('db');
                dbconnection = options&&options.dbconnection?
                        options.dbconnection:$.env('dbconnection');
                log.debug("loading database implementation %s", DB);
                if(typeof(DB)=='string'){
                    log.debug("resolving database implementation %s", DB);
                    DB = $.resolve(DB);
                }
                dbclient = new $M.Client($.extend({
                    //initialize the database connection
                    db: new DB(dbconnection)
    			},options));
            }catch(e){
                log.error('direct connection not available', e).
                    exception(e);
                //try the rest client
                dbclient = new $M.RestClient(options);
            }
        }
        return dbclient;
    };
    
})(jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    
    $.extend($, {
        db: function(options){
            return new $M.Factory(options);
        },
        model: function(name, fields, options){
            return new $M.Model(name, fields, options);
        },
        query: function(options){
            return new $M.Query(options);
        },
        index: function(){
            if(arguments.length === 0){
                return $.config('index');
            }else{
                return $.config('index', arguments[0]);
            }
        }
    });
    
})(jQuery, Claypool, Claypool.Models);

Claypool.Server={
/*
 * Claypool.Server @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008-2010 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Server (Servlet-ish) Patterns  -
 */
};


(function($, $$, $$Web){
    
    var log;
    
    $.router( "hijax:server", {
        event:          'claypool:serve',
        strategy:       'first',
        routerKeys:     'urls',
        hijaxKey:       'request',
        eventNamespace: "Claypool:Server:HijaxServerController",
        target:     function(event, request, response){ 
            log = log||$.logger('Claypool.Server');
            log.debug('targeting request event');
            event.request = request;
            event.response = response;
            event.write = function(str){
                log.debug('writing response.body : %s', str);
                response.body = str+''; 
                return this;
            };
            event.writeln = function(str){
                log.debug('writing line to response.body : %s', str);
                response.body += str+'';
                return this;
            };
            return request.requestURL+'';
        },
        normalize:  function(event){
            //adds request parameters to event.params()
            //normalized state map
            return $.extend({},event.request.parameters, {
                parameters:event.request.parameters,
                method: event.request.method,
                body: event.request.body,
                headers: $.extend(event.response.headers, event.request.headers)
            });
        }
    });
    
    
    $$.Services = {
        // An object literal plugin point for providing plugins on
        // the Claypool namespace.  This object literal is reserved for
        // services which have been integrated as well established
        // and have been included in the jQuery-Clayool repository
        // as official
    };
    
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
              $$.MVC.Controller.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        //We reduce to a single response handler function because it's not easy to
        //support the asynch stuff on the server side
        
        handle: function(event){
            //data is just the routing info that got us here
            //the request and response is really all we care about
            var method = event.params('method').toUpperCase(); 
            event.params('headers').status = 200;
             
            this.logger.debug("Handling %s request", method);
            switch(method){
                case 'GET':
                    this.handleGet(event, event.response);break;
                case 'POST':
                    this.handlePost(event, event.response);break;
                case 'PUT':
                    this.handlePut(event, event.response);break;
                case 'DELETE':
                    this.handleDelete(event, event.response);break;
                case 'HEAD':
                    this.handleHead(event, event.response);break;
                case 'OPTIONS':
                    this.handleOptions(event, event.response); break;
                default:
                    this.logger.debug("Unknown Method: %s, rendering error response.",  method );
                    this.handleError(event, "Unknown Method: " + method, new Error() );
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet: function(event){
            throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePut: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleDelete: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleHead: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleOptions: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleError: function(event, msg, e){
            this.logger.warn("The default error response should be overriden");
            event.headers.status = 300;
            event.response.body = msg?msg:"Unknown internal error\n";
            event.response.body += e&&e.msg?e.msg+'':(e?e+'':"\nUnpsecified Error.");
        }
    });
    
    
    
})(  jQuery, Claypool, Claypool.Server );

/**
 * @author thatcher
 */
(function($, $$, $M, $Web){
    
    var log;
	
	//TODO: event.response.* must be replaced with event.write, event.writeln,
	//		and event.headers (headers are echoed based on request and new headers 
	//		add onto, or overwrite, request headers with additional response headers)
    
    $Web.RestServlet = function(options){
        $$.extend(this, $Web.Servlet);
        $.extend(true, this, $M.Factory(options));
        log = $.logger('Claypool.Server.RestServlet');
        //they must provide a object which implements
        //the methods js2json and json2js
        //we include $'s json plugin as a default implementation
        //when present
        this.js2json = $.js2json && $.isFunction($.js2json)?
            $.js2json:options.js2json;
        this.json2js = $.json2js && $.isFunction($.json2js)?
            $.json2js:options.json2js;
    };
    
    $.extend( $Web.RestServlet.prototype, 
              $Web.Servlet.prototype, {
        handleGet: function( event ){
            var _this=  this,
			    domain= event.params( 'domain' ),
                id=     event.params( 'id' ),
                query=  event.params( 'q' ),
                ids=    id ? id.split( ',' ) : [],
                select;
                
            log.debug("Handling GET for %s %s", domain, id);
            if( query ){
                //treat as a 'find' operation
                log.debug('finding results with url constructed query %o', 
                    event.params());
                this.db.find($.extend({
                    data:event.params('values'),
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(xhr, status, e){
                        handleError(event, result, _this);
                    }
                }, event.params()));
            }else if(!domain && !id){
                //response is an array of all domain names
                this.db.get($.extend({
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                }, event.params()));
            }else if(domain && (ids.length > 1 || !id)){
                log.debug("Handling GET for %s %s", domain, ids);
                if(ids.length > 1){
                    //response is batch get of items by id
                    this.db.get($.extend(event.params(),{
                        id: ids,
                        domain:domain,
                        async: false,
                        success: function(result){
                            handleSuccess(event, result, _this);
                        },
                        error: function(result){
                            handleError(event, result, _this);
                        }
                    }));
                }else{
                    log.debug("getting list of item ids for domain %s", domain, id);
                    //response is list of item names for the domain
                    this.db.get($.extend({
                        domain:domain,
                        async: false,
                        success: function(result){
                            handleSuccess(event, result, _this);
                        },
	                    error: function(result){
	                        handleError(event, result, _this);
	                    }
                    }, event.params()));
                }
            }else if(domain && id && id!='metadata'){
                //response is the record
                this.db.get({
                    domain: domain,
                    id: id,
                    async: false,
                    dataType:'text',
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(domain && id && id == 'metadata'){
                this.db.metadata({
                    domain: domain,
                    id: id,
                    async: false,
                    dataType:'text',
                    success:function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }
        },
        handlePost: function(event){
            var _this = this,
			    domain = event.params('domain'),
                id = event.params('id'),
                ids,
                item,
                items,
                query;
            log.debug("Handling POST for %s %s", domain, id).
                debug("Reading POST body %s", event.body);
            
            if(domain && id){
                if(!event.params('body')){
                    //just a 'get' on an array of ids (where array is very large)
                    ids = id.split(',');
                    
                    //response is batch get of items by id
                    this.db.get($.extend(event.params(),{
                        id: ids,
                        domain:domain,
                        async: false,
                        success: function(result){
                            handleSuccess(event, result, _this);
                        },
                        error: function(result){
                            handleError(event, result, _this);
                        }
                    }));
                }else{
                    //create a new record(s)
                    log.debug('updating single object', event.request.body);
                    item = this.json2js(event.request.body);
                    this.db.update({
                        domain: domain,
                        id:id,
                        data:item,
                        async: false,
                        success: function(result){
                            handleSuccess(event, result, _this);
                        },
                        error: function(result){
                            handleError(event, result, _this);
                        }
                    });
                }
            }else if(domain && !id){
                log.debug('updating array of objects (bulk save)');
                items = this.json2js(event.request.body);
    			this.db.update({
                    domain: domain,
                    data: items,
                    async: false,
					batch: true,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(!domain && !id){
                //is is a general query string or a json
                //serialization used to build a query
                //dynamically - use the content-type
                //header
                query = event.request.body;
                if(event.request.contentType.match('application/json')){
                    query = this.json2js(query);
                }
                log.debug('executing query \n%s', query);
                this.db.find($.extend({
                    select:query,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                }, event.params()));
            }
            
        },
        handlePut: function(event){
            var _this = this,
			    id = event.params('id');
                domain = event.params('domain');
            log.debug("Handling PUT for %s %s", domain);
            if(domain && id){
                //create a new record(s)
                log.debug('saving single object', event.request.body);
                item = this.json2js(event.request.body);
                this.db.save({
                    domain: domain,
                    id:id,
                    data:item,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(domain && event.request.body){
                log.debug('saving array of objects (bulk save)');
                items = this.json2js(event.request.body);
                this.db.save({
                    domain: domain,
                    data: items,
                    async: false,
                    batch: true,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(domain){
                //create a new domain
                this.db.create({
                    domain: domain,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }
        },
        handleDelete: function(event){
            var _this = this,
			    domain = event.params('domain'),
                id = event.params('id');
            log.debug("Handling DELETE for %s %s", domain, id);

            if(domain && id){
                //delete an item
                this.db.remove({
                    domain: domain,
                    id:id,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(domain && !id){
                //delete a domain
    			this.db.destroy({
                    domain: domain,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }
        }
    });
    
    var handleSuccess = function(event, result, servlet){
        var body =  servlet.js2json(result, null, '   ');
        log.debug('succeeded. %s', body);
        event.response.headers = {
            status:         200,
            'Content-Type': 'text/javascript; charset=utf-8'
        };
        event.response.body = body;
    };
    
    
    var handleError = function(event, result, servlet){
        var body =  servlet.js2json(result, null, '    ');
        log.error('failed. %s', body);
        event.response.headers ={
            status : result.code?result.code:500,
            'Content-Type': 'text/javascript; charset=utf-8'
        };
        event.response.body = body?body:"{'error':{"+
            "'code'  : 500,"+
            "'type'  : 'UnknownClaypoolRestError',"+
            "'msg'   : 'unknown error, check network'"+
        "}}";
    };
    
    
})(jQuery, Claypool, Claypool.Models, Claypool.Server);

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    var log;
    /**
     * @constructor
     */
    $$Web.WebProxyServlet = function(options){
        $$.extend(this, $$Web.Servlet);
        this.rewriteMap = null;//Array of Objects providing url rewrites
        $.extend(true, this, options);
        log = $.logger("Claypool.Server.WebProxyServlet");
        this.router = new $$.Router();
        this.strategy = this.strategy||"first";
        log.debug("Compiling url rewrites %s.", this.rewriteMap);
        this.router.compile(this.rewriteMap, "urls");//, "rewrite");
    };
    $.extend($$Web.WebProxyServlet.prototype, 
        $$Web.Servlet.prototype,{
        handleGet: function(event, response){
            var options = _proxy.route(request, this);
            var proxyURL = options.proxyURL,
                params   = options.params;
            if(proxyURL && proxyURL.length && proxyURL.length > 0){
                log.debug("Proxying get request to: %s", proxyURL[0].payload.rewrite);
                $.ajax({
                    type:"GET",
                    dataType:"text",
                    async:false,
                    data:params,
                    url:proxyURL[0].payload.rewrite+'',
                    beforeSend:function(xhr){_proxy.beforeSend(event.request, response, xhr);},
                    success:function(text){_proxy.success(response, text);},
                    error: function(xhr, status, e){_proxy.error(response, xhr, status, e);},
                    complete: function(xhr, status){_proxy.complete(response, proxyURL, xhr, status);}
                });
            }
            return response;
        },
        handlePost:function(event, response){
            var options = _proxy.route(event.request, this);
            var proxyURL = options.proxyURL,
                params   = options.params;
            if(proxyURL && proxyURL.length && proxyURL.length > 0){
                log.debug("Proxying post request to: %s", proxyURL[0].payload.rewrite);
                $.ajax({
                    type:"POST",
                    dataType:"text",
                    async:false,
                    data:params,
                    url:proxyURL[0].payload.rewrite+'',
                    beforeSend:function(xhr){_proxy.beforeSend(event.request, response, xhr);},
                    success:function(text){_proxy.success(response, text);},
                    error: function(xhr, status, e){_proxy.error(response, xhr, status, e);},
                    complete: function(xhr, status){_proxy.complete(response, proxyURL, xhr, status);}
                });
            }
            return response;
        }
    });
    
    
    var _proxy = {
        route:function(request, options){
            log.debug("Handling proxy: %s", request.requestURI);
            var proxyURL = options.router[options.strategy||"all"]( request.requestURI );
            request.headers["Claypool-Proxy"] = options.proxyHost||"127.0.0.1";
			var params = {};
			for (var prop in request.parameters){
				log.debug("request.parameters[%s]=%s", prop, request.parameters[prop]);
				params[prop+'']=request.parameters[prop]+'';
			}
            var body = (request.body&&request.body.length)?request.body:'';
            return {
                proxyURL:proxyURL,
                params:params,
                body:body
            };
        },
        beforeSend: function(request, response, xhr){
            log.debug("Copying Request headers for Proxied Request");
            for(var header in request.headers){
                log.debug("Setting proxied request header %s: %s",header, request.headers[header] );
                xhr.setRequestHeader(header, request.headers[header]);
            }
            response.headers = {};
        },
        success: function(response, text){
            log.debug("Got response for proxy \n %s.", text);
            response.body = text+'';
        },
        error: function(response, xhr, status, e){
            log.error("Error proxying request. STATUS: %s", status?status:"UNKNOWN");
            if(e){log.exception(e);}
            response.body = xhr.responseText+'';
        },
        complete: function(response, proxyURL, xhr, status){
            log.debug("Proxy Request Complete, Copying response headers");
            var proxyResponseHeaders = xhr.getAllResponseHeaders();
            var responseHeader;
            var responseHeaderMap;
            log.debug("Complete Proxy response header: \n %s" ,proxyResponseHeaders);
            proxyResponseHeaders = proxyResponseHeaders.split("\r\n");
            for(var i = 0; i < proxyResponseHeaders.length; i++){
                responseHeaderMap = proxyResponseHeaders[i].split(":");
                try{
                    log.debug("setting response header %s %s", responseHeaderMap[0], responseHeaderMap.join(":"));
                    response.headers[responseHeaderMap.shift()] = responseHeaderMap.join(":");
                }catch(e){
                    log.warn("Unable to set a proxied response header");
                    log.exception(e);
                }
            }
            log.debug('response status (%s)', xhr.status);
            response.headers.status = Number(xhr.status);
            response.headers["Claypool-Proxy"] = proxyURL[0].payload.rewrite+'';
            response.headers["Content-Encoding"] = proxyURL[0].payload.contentEncoding||"";
            response.headers["Transfer-Encoding"] = proxyURL[0].payload.transferEncoding||"";
            if(proxyURL[0].payload.contentType){
                //override the content type
                response.headers["Content-Type"] = proxyURL[0].payload.contentType+'';
            }
        }
    };
    
})(  jQuery, Claypool, Claypool.Server );
/**
 * @author thatcher
 */
(function($, $$, $S){

    var log,
        db;
    
    $S.Manage = function(options){
        $.extend(true, this, options);
        log = $.logger('Claypool.Services.Manage');
        db = $$.Models.Factory();
    };
    
    $.extend($S.Manage.prototype, {
        handle:function(event){
            var command = event.params('command'),
                target = event.params('target');
            log.debug("handling command %s %s", command, target);
            $$.Commands[command](target, event);
            if(('reset' == command)||('syncdb' == command)){
                log.debug('forwarding to rest service');
                event.response.headers =  {
                    status:   302,
                    "Location": '/rest/'
                };
            }
        }
    });
    
    $.extend( true, $$.Commands, {
        reset: function(targets){
            var domains;
            db.get({
                async: false,
                success: function(result){
                    domains = result.domains;
                    log.debug('loaded domains');
                },
                error: function(xhr, status, e){
                    log.error('failed to get db domains');
                }
            });
            //drops domains (tables) for each model
            $(domains).each(function(index, domain){
                db.destroy({
                    domain: domain,
                    async: false,
                    success: function(result){
                        log.info('destroyed domain %s', domain);
                    },
                    error: function(xhr, status, e){
                        log.error('failed to delete domain %s', domain);
                    }
                });
            });
        },
        syncdb: function(targets){
            //creates domain (tables) for each model
            var data,
                data_url = $.env('initialdata')+'dump.json?'+$$.uuid(),
                domain;
                
            log.info('loading initial data from %s', data_url);
            $.ajax({
                type:'get',
                async:false,
                url:data_url,
                dataType:'text',
                success:function(_data){
                    data = $.json2js(_data);
                    log.info('loaded initial data');
                },
                error:function(xhr, status, e){
                    log.error('failed [%s] to load initial data %s', status, e);
                }
            });
            
            for(domain in data){
                db.create({
                    domain: domain,
                    async:false,
                    success:function(result){
                        log.info('created domain %s', domain);
                    }
                });
                db.save({
                    async:false,
                    batch:true,
                    domain: domain,
                    data:data[domain],
                    success: function(){
                        log.info('batch save successful %s ', domain);
                    },
                    error: function(){
                        log.error('batch save failed %s', domain);
                    }
                });
            }
        },
        dumpdata: function(targets, event){
            var data = {};
            var domains;
                
            db.get({
                async: false,
                success: function(result){
                    domains = result.domains;
                    log.debug('loaded domains');
                },
                error: function(xhr, status, e){
                    log.error('failed to get db domains');
                }
            });
            
            $(domains).each(function(i, domain){
                db.find({
                    select:"new Query('"+domain+"')",
                    async: false,
                    success: function(result){
                        log.info('found %s entries in %s', result.data.length, domain);
                        data[domain] = result.data;
                    },
                    error: function(xhr, status, e){
                        ok(false, 'failed load entries from %s', domain);
                    }
                });
            });
            
            event.write($.js2json(data, null, '    '));
            event.response.headers =  {
                status:   200,
                'Content-Type':'application/json'
            };
        }
    });

})(jQuery, Claypool, Claypool.Services);
(function($, $$, $$Web){

    var log,
        console;
    
    $.extend($, {
        /**
         * 
         * @param {Object} request
         * @param {Object} response
         */
        serve: function(request, response){ 
            var prop;
            log = log||$.logger("Claypool.Server");
            log.info("Handling global request routing for request: %s ", request.requestURL).
                 debug("Dispatching request to Server Sevlet Container");
            response.headers = {};
            $.extend( response.headers, { 'Content-Type':'text/html; charset=utf-8', status: -1 });
            response.body = "";
            try{
                log.debug('serving request event');
                $(document).trigger("claypool:serve",[ request, response ]);
                
                log.debug('finished serving request event');
                //Hope for the best
                if(response.headers.status === -1){
                    response.headers.status = 200;
                    if(!response.body){
                        response.headers.status = 404;
                        response.body = "<html><head></head><body><h1>jQuery-Claypool Server Error</h1>";
                        response.body += "<p>"+
                            "Not Found :\n\t"+request.requestURL+
                        "</p></body></html>";
                        
                    }
                }
            }catch(e){
                log.error("Error Handling Request.").exception(e);
                response.headers["Content-Type"] = "text/html; charset=utf-8";
                response.headers.status = 500;
                response.body = "<html><head></head><body><h1>jQuery-Claypool Server Error</h1>";
                
                response.body += "<h2>Error Details</h2>";
                for(prop in e){
                    response.body += 
                        '<strong>'+prop+'</strong><br/>'+
                        '<span>'+e[prop]+'</span><br/>';
                }
                response.body += "<h2>General Request Details</h2>";
                for(prop in request){
                    response.body += 
                        '<strong>'+prop+'</strong><br/>'+
                        '<span>'+request[prop]+'</span><br/>';
                } 
                response.body += "<h2>Request Header Details</h2>";
                for(prop in request.headers){
                    response.body += 
                        '<strong>'+prop+'</strong><br/>'+
                        '<span>'+request.headers[prop]+'</span><br/>';
                }
                response.body += "</body></html>";
            }
        },
        /**
         * 
         * @param {Object} target
         */
		servlet: function(target){
            log = log||$.logger("Claypool.Server");
            log.debug('Applying servlet pattern to %s', target);
            $$.extend(target, $$Web.Servlet);
        },
        /**
         * 
         * @param {Object} options
         */
        proxy: function(options){
            return $.invert([{ 
                id:options.id||'proxy_'+$$.uuid(),    
                clazz:"Claypool.Server.WebProxyServlet", 
                options:[{
                    rewriteMap:options.rewrites
                }]
            }]);
        }
    });
    
    /**@global*/
    ClaypoolServerHandler = $.serve;
    
    
})(  jQuery, Claypool, Claypool.Server );
