var Claypool={
/*
 * Claypool @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-09-27 13:17:28 -0400 (Sat, 27 Sep 2008) $
 * $Rev: 273 $
 */
	Logging:{
	    //because we log in core we need a safe way to null logging
	    //if the real Claypool.Logging isnt present.  This is the safety.
	}
};
//Take a little whipping from jQuery 
(function($){ 
	$.extend( Claypool, {
		extend:		$.extend,
		isFunction: $.isFunction
	}); 
})(jQuery);

(function($){
	var globalContext = [];
	var guid = (-1)*Math.pow(2,31);
	$.extend(true,{
	    Configuration:{
	        /** Please see each module for specific configuration options */
	        //this is a short list of well knowns, but can always be '$.extend'ed
	        ioc:[], aop:[], logging:[], mvc:{ 
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
        }});
    $.extend({
	    $:function(id){
	    	//search the contexts in priority order
	    	var a = null;
	    	for(var i=0;i<globalContext.length;i++){
	    		a = globalContext[i]().get(id);
	    		if(a){return a;}
    		} return null;
	    },
	    register: function(context, priority){
	    	if( Math.abs(priority) > (globalContext.length-1)/2 ){
	    		//should be claypool.application but possible to modify
	    		if(priority === 0 && $.isFunction(context.getContext)){
	    			globalContext[0]=context.getContext;
	    			
    			}else if(priority !== 0 ){
	    			//wrap the global context
	    			if($.isFunction(context.getContext)){
	    				globalContext.push(context.getContext);
    				}if($.isFunction(context.getCachedContext)){
	    				globalContext.unshift(context.getCachedContext);
    				}
    			}
	    	}
	    },
	    createGUID: function(){
	        return ++guid;
	    },
	    resolveName:function(namespacedName){
	        var _resolver;
	        var namespaces;
	        var target; //the resolved object/function/array/thing or null
	        var i;
	        try{
	            _resolver = function(name){return this[name];};
	            namespaces = namespacedName.split('.');
	            target = null;
	            for( i = 0; i < namespaces.length; i++){
	                target = _resolver.call(target,namespaces[i]);
	                if(target === undefined){return target;}
	            }
	            return target;
	        }catch(e){
	            throw new $.NameResolutionError(e);
	        }
	    },
	    CachingStrategy$Interface:{
	        cache:  null,
	        size:   null,
	        clear:  function(){ throw new $.MethodNotImplementedError(); },
	        add:    function(id, object){ throw new $.MethodNotImplementedError(); },
	        remove: function(id){ throw new $.MethodNotImplementedError(); },
	        find:   function(id){ throw new $.MethodNotImplementedError(); }
	    },
	    SimpleCachingStrategy$Class:{
	        cache:null,
	        size:null,
	        constructor: function(options){
	            $.extend( this, $.CachingStrategy$Interface);
	            $.extend( this, $.SimpleCachingStrategy$Class);
	            $.extend(true, this, options);
	            this.logger = new $.Logging.NullLogger();
	            this.clear();
	            return this;
	        },
	        clear: function(){
	            this.logger.debug("Clearing Cache.");
	    		this.cache = null;
	    		this.cache = {};
	    		this.size = 0;
	    	},
	    	add: function(id, object){
		        this.logger.debug("Adding To Cache: %s", id);
			    if ( !this.cache[id] ){
	    			this.cache[id] = object;
	    			this.size++;
	    			return id;
	    		}
	    		return null;
	    	},
	    	remove: function(id){
	    	    this.logger.debug("Removing From Cache id: %s", id);
	    	    if(this.find(id)){
	    	        return (delete this.cache[id])?--this.size:-1; 
	    	    }return null;
	    	},
	    	find: function(id){
	    	    this.logger.debug("Searching Cache for id: %s", id);
	    		return this.cache[id] || null;
	    	}
	    },
	    Router$Class:{//TODO: a good place to use jQuery.collections?
	        constructor: function(options){
	            $.extend( this, new $.SimpleCachingStrategy(options));
	            $.extend( this, $.Router$Class);
	            $.extend(true, this, options);
	            this.logger = $.Logging.getLogger("Claypool.Router");
	        },
	        /**the pattern map is any object, the pattern key is the name of 
	        the objects property which is treated as a string to be compiled to
	        a regular expression, The pattern key can actually be a '|' seperated
	        set of strings.  the first one that is a property of the map will be used*/
	        compile: function(patternMap, patternKey){
	            this.logger.debug("compiling patterns for match strategies");
	            var pattern, routable;
	            var i, j; 
	            patternKey = patternKey.split('|');//supports flexible pattern keys
	            for(i=0;i<patternMap.length;i++){
	                for( j = 0; j<patternKey.length;j++){
	                    pattern = patternMap[i][patternKey[j]];
	                    if(pattern){
	                        this.logger.debug("Compiling \n\tpattern: %s for \n\ttarget.", pattern);
	                        /**pattern might be used more than once so we need a unique key to store the route*/
	                        this.add(String($.createGUID()) , {
	                            pattern:new RegExp(pattern), 
	                            payload:patternMap[i]
	                        });
	                    }
	                }
	            }
	            return this;
	        },
	        first: function(string){
	            this.logger.debug("Using strategy 'first'");
	            var route, id;
	            for(id in this.cache){
	                route = this.find(id);
	                this.logger.debug("checking pattern %s for string %s", route.pattern, string);
	                if(route&&route.pattern&&route.pattern.test&&route.pattern.test(string)){
	                    this.logger.debug("found match for \n\tpattern: %s \n\ttarget : %s ", 
	                        route.pattern, route.payload.controller||route.payload.rewrite );
	                    return [route];
	                }
	            }
	            this.logger.debug("found no match for \n\tpattern: %s", string);
	            return [];
	        },
	        all: function(string){
	            this.logger.debug("Using strategy 'all'");
	            var routeList = [];
	            var route, id;
	            for(id in this.cache){
	                route = this.find(id);
	                this.logger.debug("checking pattern: %s for string %s", route.pattern, string);
	                if(route&&route.pattern&&route.pattern.test&&route.pattern.test(string)){
	                    this.logger.debug("found match for \n\tpattern: %s \n\ttarget : %s ", 
	                        route.pattern, route.payload.controller);
	                    routeList.push(route);
	                }
	            }
	            if(routeList.length===0){this.logger.debug("found no match for \n\tpattern: %s", string);}
	            return routeList;
	        }
	    },
	    Context$Abstract:{
	        constructor: function(options){
	            $.extend( this, new $.SimpleCachingStrategy(options));
	            $.extend( this, $.Context$Abstract);
	            $.extend(true, this, options);
	            this.logger = new $.Logging.NullLogger();
	        },
	        get: function(id){ throw new $.MethodNotImplementedError();  },
	        put: function(id, object){ throw new $.MethodNotImplementedError(); }
	    },
	    ContextContributor$Abstract:{
	        constructor: function(options){
	            $.extend( this, new $.Context(options));
	            $.extend( this, $.ContextContributor$Abstract);
	            $.extend(true, this, options);
	            this.logger = $.Logging.getLogger("Claypool.ContextContributor");
	            return this;
	        },
	        registerContext: function(id){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    Factory$Interface:{
	        create: function(){ throw new $.MethodNotImplementedError(); }
	    },
	    Configurable$Interface:{
	    	//This is the old school app framework configuration model.  It
	    	//gives you the greatest flexibility and power to work with
	    	//even legacy code, and allows you to consolidate configuration
	    	//to a small number, or just a single, file.  It requires an investment
	    	//to get it wired.
	        configurationId:null,//an array of two unique string identifing the property 
	        configuration:null,//
	        configurationUrl:null,//
	        configurationType:null,//"json" or "xml"
	        getConfig: function(){ throw new $.MethodNotImplementedError();},
	        loadConfig: function(){ throw new $.MethodNotImplementedError();},
	        setConfig: function(){ throw new $.MethodNotImplementedError();},
	        updateConfig: function(){ throw new $.MethodNotImplementedError();}
	    },
	    Scanner$Interface:{
	    	//The scanner is the new school app framework configuration model.  It
	    	// relies heavily on convention to reduce the development overhead.  In
	    	// the end, it's job is to simply walk a namespace and build the internal
	    	// representation of the equivalent hand-wire configuration
	        scan:function(){ throw new $.MethodNotImplementedError();}
	    },
	    BaseFactory$Abstract:{
	        //By default the factories are configured programatically, using setConfiguration,
	        //however all the wiring is available for separating it into a data format like
	        //json or xml and retreiving via ajax (though not asynchronously)
	        //Factories also manage the cache of objects they create for fast retreival
	        //by id, thus the cache is a simple map implementation.
	        constructor: function(options){
	            $.extend( this, $.Factory$Interface);
	            $.extend( this, $.Configurable$Interface);
	            $.extend( this, $.Scanner$Interface);
	            $.extend( this, new $.SimpleCachingStrategy(options));
	            $.extend( this, $.BaseFactory$Abstract);
	            $.extend(true, this, {//defaults
	                configurationUrl:"./application.context.js",
	                configurationType:"json"//or xml
	            }, options /* overrides */ );
	            this.logger = new $.Logging.NullLogger();
	            return this;
	        },
	        //returns the portion configuration specified by 'configurationId'
	        getConfig: function(){
	            if( !this.configuration ){
	                //First look for an object name Claypool.Configuration
	                this.logger.warn( "Configuration for <%s> has not been set explicitly or has been updated implicitly.",  this.configurationId );
	                try{
	                	this.logger.debug("$.Configuration: \n %o", $.Configuration);
	                    if($.Configuration[this.configurationId]){
	                        this.logger.info("Found Claypool.Configuration");
	                        this.configuration = $.Configuration[this.configurationId];
	                    }else if(!$.Configuration){
	                        //it's not specified in js code so look for it remotely
	                        this.loadConfig();
	                    }
	                }catch(e){
	                    this.logger.exception(e);
	                    throw new $.ConfigurationError(e);
	                }
	            }
	            return this.configuration;
	        },
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
	        	            if(_this.configurationUrl == 'application.context.js'){
	        	                $.Configuration = $.Configuration||{};
	        	                $.extend(true, $.Configuration, json);
	        	            }else{
	        	                _this.setConfig(_this.configurationId,
	        	                    json?json:null
	    	                    );
		                    }
		                    if(options.callback){
		                    	options.callback($.Configuration);
		                    }
	        	        }
	        	    });
	    	    }catch(e){
	    	        this.logger.exception(e);
	                throw new $.ConfigurationError(e);
	    	    }
	        },
	    	setConfig: function(id, configuration){
	    	    this.logger.info("Setting configuration");
	            this.configuration = configuration;
	            $.Configuration[id] = configuration;
	        },
	        updateConfig: function(id){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    Error$Class:{
	        constructor: function(e, options){
	            $.extend(true, this, e||new Error());
	            this.name = (options&&options.name?options.name:"Claypool.UnknownError") + " > Claypool.Error" + (this.name?(" > "+this.name):"") ;
	            this.message = (options&&options.name?options.name:"No Message Provided \n Nested exception is:\n\t") +
	                (this.message||"UnknownError");
	        }
	    },
	    /**@exception*/
	    ConfigurationError$Class:{
	        constructor: function(e, options){
	            var details = {
	                name:"Claypool.ConfigurationError",
	                message:"An error occured trying to locate or load the system configuration."
	            };
	            $.extend( this, new $.Error(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    },
	    /**@exception*/
	    MethodNotImplementedError$Class:{
	        constructor: function(e, options){var details = {
	                name:"Claypool.MethodNotImplementedError",
	                message:"Method not implemented."
	            };
	            $.extend( this, new $.Error(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    },
	    /**@exception*/
	    NameResolutionError$Class:{
	        constructor: function(e, options){var details = {
	                name:"Claypool.NameResolutionError",
	                message:"Unexpected error resolving name."
	            };
	            $.extend( this, new $.Error(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    }
	});
	
	/**@constructorAlias*/
	$.SimpleCachingStrategy  = $.SimpleCachingStrategy$Class.constructor;
	/**@constructorAlias*/
	$.Router                 = $.Router$Class.constructor;
	/**@constructorAlias*/
	$.Context				 = $.Context$Abstract.constructor;
	/**@constructorAlias*/
	$.ContextContributor     = $.ContextContributor$Abstract.constructor;
	/**@constructorAlias*/
	$.BaseFactory            = $.BaseFactory$Abstract.constructor;
	/**@constructorAlias*/
	$.Error                  = $.Error$Class.constructor;
	
	//Exception Classes
	/**@constructorAlias*/
	$.ConfigurationError         = $.ConfigurationError$Class.constructor;
	/**@constructorAlias*/
	$.MethodNotImplementedError  = $.MethodNotImplementedError$Class.constructor;
	/**@constructorAlias*/
	$.NameResolutionError        = $.NameResolutionError$Class.constructor;
	
})( /*Required Modules*/ Claypool);

//Give a little bit, Give a little bit of our ioc to you. ;)
(function($){ 
	$.extend(Claypool); 
})(jQuery);

(function($, $Log){
	$.extend($Log, { NullLogger$Class:{
	        constructor: function(){
	            //for speed why bother implement the interface, just null the functions
	            var nullFunction=function(){return this;};
	            $.extend(this,  {
	                debug:nullFunction,
	                info:nullFunction,
	                warn:nullFunction,
	                error:nullFunction,
	                exception:nullFunction
	            });
	            return this;
	        }
	    },
	    getLogger	: function(){
	    	return new $Log.NullLogger();
	    }
	});
	
	/**@constructorAlias*/
	$Log.NullLogger  		 = $Log.NullLogger$Class.constructor;
})( /*Required Modules*/ Claypool, Claypool.Logging );
