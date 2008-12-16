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
Claypool.Logging={
/*
 * Claypool @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 */
};
(function($, $Log){
	//erase safety provided by core
	$Log.NullLogger$Class = $Log.getLogger =null;
	$.extend($Log, {
	    //Static Closure Method (uses a singleton pattern)
	    loggerFactory:null,
	    getLogger: function(category){
	        if(!$Log.loggerFactory){
	            $Log.loggerFactory = new $Log.Factory();
	            $Log.loggerFactory.updateConfig();
	        }
	        return $Log.loggerFactory.create(category);
	    },
	    Level$Enumeration:{
	        DEBUG:0,
	        INFO:1,
	        WARN:2,
	        ERROR:3,
	        NONE:4
	    },
	    Factory$Class:{
	        configurationId:'logging',
	        constructor: function(options){
	            $.extend( this, new $.BaseFactory(options));
	            $.extend(this, $Log.Factory$Class);
	            $.extend(true, this, options);
	            //The LogFactory is unique in that it will create its own logger
	            //so that it's events can be logged to console or screen in a
	            //standard way.
	            this.logger = new $Log.Logger({
	                category:"Claypool.Logging.Factory",
	                level:"INFO",
	                appender:"Claypool.Logging.ConsoleAppender"
	            });this.attemptedConfigure = false;
	            return this;
	        },
	        create: function(category){
	            var categoryParts;
	            var subcategory;
	            var loggerConf;
	            var rootLoggerConf;
	            if(!this.configuration){
	                //Only warn about lack of configuration once
	                if(!this.attemptedConfigure){
	                    this.logger.warn("Claypool Logging was not initalized correctly.  Logging will not occur unless initialized.");
	                }
	                this.attemptedConfigure = true;
	                return new $Log.NullLogger();
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
	                        return new $Log.Logger( loggerConf );
	                    }
	                }
	                //try the special 'root' category
	                rootLoggerConf = this.find('root');
	                if(rootLoggerConf !== null){
	                    //The level is set by the closest subcategory, but we still want the 
	                    //full category to display when we log the messages
	                    rootLoggerConf.category = category;
	                    return new $Log.Logger(rootLoggerConf);
	                }
	            }
	            //No matching category found
	            this.logger.warn("No Matching category: %s Please configure a root logger.", category);
	            return new $Log.NullLogger();
	        },
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
	                throw new $Log.ConfigurationError(e);
	            }
	            return true;
	        }
	    },
	    Logger$Interface:{
	        debug:      function(){throw new $.MethodNotImplementedError();},
	        info:       function(){throw new $.MethodNotImplementedError();},
	        warn:       function(){throw new $.MethodNotImplementedError();},
	        error:      function(){throw new $.MethodNotImplementedError();},
	        exception:  function(){throw new $.MethodNotImplementedError();}
	    },
	    NullLogger$Class:{
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
	    Logger$Class:{
	        category:"root",
	        level:null,
	        constructor: function(options){
	            try{
	                $.extend(this, $Log.Logger$Interface);
	                $.extend(this, $Log.Logger$Class);
	                $.extend(true, this, options);
	                this.level = $Log.Level[
	                    this.level?this.level:"NONE"
	                ];
	                //allow for appender extension, eg multiple appenders and custom appenders
	                //appenders are expected to be specified as string representations of the
	                //function name, eg 'Claypool.Logging.ConsoleAppender'
	                try{
	                    this.appender = new ($.resolveName(this.appender||"Claypool.Logging.ConsoleAppender"))(options);
	                }catch(e){
	                    try{ this.appender = new $Log.ConsoleAppender(options);
	                    }catch(e){ this.appender = new $Log.SysOutAppender(options); }
	                }
	                return this;
	            }catch(e){
	                return new $Log.NullLogger();
	            }
	        },
	        //All logging calls are chainable
	        debug: function(){
	            if(this.level<=$Log.Level.DEBUG){
	              this.appender.append("DEBUG",this.category,arguments);  
	              return this;
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        },
	        info: function(){
	            if(this.level<=$Log.Level.INFO){
	              this.appender.append("INFO",this.category,arguments);  
	              return this;
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        },
	        warn: function(){
	            if(this.level<=$Log.Level.WARN){
	              this.appender.append("WARN",this.category,arguments);  
	              return this;
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        },
	        error: function(){
	            if(this.level<=$Log.Level.ERROR){
	              this.appender.append("ERROR",this.category,arguments);  
	              return this;
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        },
	        exception: function(e){
	            if(this.level < $Log.Level.NONE){
	                if(e){
	                    this.appender.append("EXCEPTION", this.category,e); 
	              		return this;
              		}
	            }else{ this.debug = function(){return this;}; }
	            return this;
	        }
	    },
	    Appender$Interface:{
	        formatter:null,
	        append: function(level,category,message){throw new $.MethodNotImplementedError();}
	    },
	    ConsoleAppender$Class:{
	        constructor: function(options){
	            try{
	                if(window&&window.console&&window.console.log){
	                    $.extend(this, $Log.Appender$Interface);
	                    $.extend(this, $Log.ConsoleAppender$Class);
	                    $.extend(true, this, options);
	                    this.formatter = new $Log.FireBugFormatter(options);
	                    return this;
	                }
	            }catch(e){
	                /**Since the console isn't available, see if print() is and fall back to it**/
	            }
	            $.extend(this, $Log.SysOutAppender(options));
	            return this;
	        },
	        append: function(level, category, message){
	            switch(level){
	                case ("DEBUG"):
	                    console.log.apply(console, this.formatter.format(level, category, message));break;
	                case ("INFO"):
	                    console.info.apply(console, this.formatter.format(level, category, message));break;
	                case ("WARN"):
	                    console.warn.apply(console, this.formatter.format(level, category, message));break;
	                case ("ERROR"):
	                    console.error.apply(console,this.formatter.format(level, category, message));break;
	                case ("EXCEPTION"):
	                    //message is e
	                    console.error.apply(console, this.formatter.format(level, category, 
	                        message.message?[message.message]:[])); 
	                    console.trace();
	                    break;
	            }
	        }
	    },
	    SysOutAppender$Class:{
	        constructor: function(options){
	            $.extend(this, $Log.Appender$Interface);
	            /**This function is intentionally written to throw an error when called*/
	            var rhinoCheck = function(){ var isRhino = null;isRhino.toString();};
	            /**This is probably rhino if these are defined*/
	            if(jQuery.isFunction(print) && jQuery.isFunction(load) ){
	                try{
	                    rhinoCheck();
	                }catch(caught){/**definitely rhino if this is true*/
	                    if(caught.rhinoException){
	                        $.extend(this, $Log.SysOutAppender$Class);
	                        $.extend(true, this, options);
	                        this.formatter = new $Log.DefaultFormatter(options);
	                        //print("Successfully Loaded SysOutAppender.");
	                        return this;
	                    }
	                }
	            }
	            throw new $Log.NoAppendersAvailableError();
	        },
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
	    },
	    Formatter$Interface:{
	        format: function(level, category, objects){throw new $.MethodNotImplementedError();}
	    },
	    FireBugFormatter$Class:{
	        constructor: function(options){
	            $.extend(this, $Log.Formatter$Interface);
	            $.extend(this, $Log.FireBugFormatter$Class);
	            $.extend(true, this, options);
	        },
	        getDateString: function(){
	            return " ["+ new Date().toUTCString() +"] ";
	        },
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
	    },
	    DefaultFormatter$Class:{
	        parseFormatRegExp:/((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/,
	        functionRenameRegExp:/function ?(.*?)\(/,
	        objectRenameRegExp:/\[object (.*?)\]/,
	        constructor: function(options){
	            $.extend(this, $Log.Formatter$Interface);
	            $.extend(this, $Log.DefaultFormatter$Class);
	            $.extend(true, this, options);
	        },
	        getDateString: function(){
	            return " ["+ new Date().toUTCString() +"] ";
	        },
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
	        parseFormat: function(format){
	            var parts = [];
	            var appenderMap = {s: this.appendText, d: this.appendInteger, i: this.appendInteger, f: this.appendFloat};
	            var type;
	            var appender;
	            var precision;
	            var m;
	            for (m = this.parseFormatRegExp.exec(format); m; m = this.parseFormatRegExp.exec(format)) {
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
	        objectToString: function (object){
	            try{ return object+"";}
	            catch (e){ return null; }
	        },
	        appendText: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendNull: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendString: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendInteger: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendFloat: function (object, msg){
	            msg.push(this.objectToString(object));
	        },
	        appendFunction: function (object, msg){
	            var m = this.functionRenameRegExp.exec(this.objectToString(object));
	            var name = m ? m[1] : "function";
	            msg.push(this.objectToString(name));
	        },
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
	        appendObjectFormatted: function (object, msg){
	            var text = this.objectToString(object);
	            var m = this.objectRenameRegExp.exec(text);
	            msg.push( m ? m[1] : text);
	        },
	        appendSelector: function (object, msg){
	            msg.push(object.nodeName.toLowerCase());
	            if (object.id){ msg.push(object.id);}
	            if (object.className){ msg.push(object.className);}
	            msg.push('</span>');
	        },
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
	    },
	    /**@exception*/
	    ConfigurationError$Class:{
	        constructor: function(e, options){
	            $.extend( this, new $.ConfigurationError(e, options||{
	                name:"Claypool.Logging.ConfigurationError",
	                message: "An error occured trying to configure the logging system."
	            }));
	        }
	    },
	    /**@exception*/
	    NoAppendersAvailableError$Class:{
	        constructor: function(e, options){
	            $.extend( this, new $.Error(e, options||{
	                name:"Claypool.Logging.NoAppendersAvailableError",
	                message: "An error occured trying to configure the logging system."
	            }));
	        }
	    }
	});
	/**@enumerationAlias*/
	$Log.Level            = $Log.Level$Enumeration; 
	/**@constructorAlias*/
	$Log.Factory    	  = $Log.Factory$Class.constructor; 
	/**@constructorAlias*/
	$Log.Logger           = $Log.Logger$Class.constructor; 
	/**@constructorAlias*/
	$Log.NullLogger       = $Log.NullLogger$Class.constructor; 
	/**@constructorAlias*/
	$Log.SysOutAppender   = $Log.SysOutAppender$Class.constructor; 
	/**@constructorAlias*/
	$Log.ConsoleAppender  = $Log.ConsoleAppender$Class.constructor; 
	/**@constructorAlias*/
	$Log.DefaultFormatter  = $Log.DefaultFormatter$Class.constructor; 
	/**@constructorAlias*/
	$Log.FireBugFormatter  = $Log.FireBugFormatter$Class.constructor; 
	
	//Exception Classes
	/**@constructorAlias*/
	$Log.ConfigurationError = $Log.ConfigurationError$Class.constructor; 
	/**@constructorAlias*/
	$Log.NoAppendersAvailableError = $Log.NoAppendersAvailableError$Class.constructor; 
	
})( Claypool,/*Required Modules*/
	Claypool.Logging );

//Give a little bit, Give a little bit of our Log to you. ;)
(function($){ 
	$.Logging = Claypool.Logging; 
})(jQuery);
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
Claypool.AOP={
/*
 * Claypool.AOP @VERSION - A Web 1.6180339... Javascript Application Framework
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
(function($, $Log, $AOP){
	
	jQuery(document).bind("claypool:initialize", function(event, context){
		context['claypool:AOP'] = new $AOP.Container();
		if(context.ContextContributor && $.isFunction(context.ContextContributor)){
			$.extend(context['claypool:AOP'], new context.ContextContributor());
			context['claypool:AOP'].registerContext("Claypool.AOP.Container");
		}
	}).bind("claypool:reinitialize", function(event, context){
		context['claypool:AOP'].factory.updateConfig();
	});
	
	
	$.extend( $AOP, {
	    /** 
	     * @class Claypool.AOP.Container$Class
	     * @description 
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
	     *
	     * @privateMember aspectFactory
	     */
	    Container$Class:{
	        /**
	         * @memberOf Claypool.AOP.Container$Class
	         */
	        factory:null,
	        /**
	         * @method Claypool.AOP.Container$Class.constructor
	     	 * @alias Claypool.AOP.Container
	         * @param {Object} options
	         */
	        constructor: function(options){
	            $.extend( this, 
	            	new $.ContextContributor(options), 
	            	$AOP.Container$Class);
	            $.extend( true, this, options);
	            this.logger = $Log.getLogger("Claypool.AOP.Container");
	            this.logger.debug("Configuring Claypool AOP Container");
	            /**Register first so any changes to the container managed objects 
	            are immediately accessible to the rest of the application aware
	            components*/
	            this.factory = new $AOP.Factory(options); //$AOP.getAspectFactory();
	            this.factory.updateConfig();
	            return this;
	        },
	        /**
	         * Returns all aspects attached to the Class or instance.  If the instance is still 
	         * sleeping, the proxy aspect is returned.
	     	 * @alias Claypool.AOP.Container$Class.constructor
	         * @param {Object} id
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
	                throw new $AOP.ContainerError(e);
	            }
	            return null;
	        }
	    },
	    /**Stores instance configurations and manages instance lifecycles*/
	    /**
	     *  -   Aspect Factory   -
	     * 
	     * @param {Object} options
	     */
	    Factory$Class:{
	        configurationId:'aop',
	        /**
	         * @constructor
	         * @param {Object} options
	         */
	        aspectCache : null,
	        //aspectProxies : null,
	        constructor: function(options){
	            $.extend( this, 
	            	new $.BaseFactory(options),
	            	$AOP.Factory$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.AOP.Factory");
	            this.aspectCache = new $.SimpleCachingStrategy();
	            //this.aspectProxies = new $.SimpleCachingStrategy();
	            return this;
	        },
	        /**
	         * 
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
	                            aopconf.advice = $.resolveName(aopconf.advice);
	                        }
	                        //If the adive is to be applied to an application managed instance
	                        //then bind to its lifecycle events to weave and unweave the
	                        //aspect 
	                        if(aopconf.target.match("^ref://")){
	                        	targetRef = aopconf.target.substr(6,aopconf.target.length);
	                        	jQuery(document).bind("claypool:ioc:"+targetRef, function(event, id, iocContainer){
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
	                                namespace = $.resolveName(aopconf.target.substring(0, aopconf.target.length - 2));
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
    	                            aopconf.target =  $.resolveName(aopconf.target);
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
	                throw new $AOP.ConfigurationError(e);
	            }
	            return true;
	        },
			/**
			 * 
			 * @param {Object} id
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
		    			aspect = new $AOP.After(options);
		    		}else if (options.before){
		    			aspect = new $AOP.Before(options);
		    		}else if (options.around) {
		    			aspect = new $AOP.Around(options);
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
	                                jQuery(configuration.selector).livequery(_continuation);
	                            }else{
	                                //attach the aspect only to the current dom snapshot
	                                jQuery(configuration.selector).each(_continuation);
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
	                    throw new $AOP.FactoryError(e);
	                }
	            }
	        }
	    },
		/**
		 * 
		 */
	    Aspect$Abstract:{//Another good candidate for
	        id:null,
	        type:null,
	        /**options should include pointcut:{target:'Class or instance', method:'methodName or pattern', advice:function }*/
	        /**
	         * @constructor
	         * @param {Object} options
	         */
			constructor: function(options){
			    $.extend( this, 
			    	new $.SimpleCachingStrategy(),
			    	$AOP.Aspect$Abstract);
	            $.extend(true, this, options);
		        this.logger = $Log.getLogger("Claypool.AOP.Aspect");
	            //only 'first' and 'all' are honored at this point
	            //and if it's not 'first' it's 'all'
	            this.strategy = this.strategy||"all";
	        },
			/**
			 * 
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
	        			throw new $AOP.WeaveError(e, "Weave");
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
	                        this.add($.createGUID(), _weave(f));
	                        if(this.strategy==="first"){break;}
	                    }
	                }
	            } return this;
	        },
			/**
			 * 
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
					throw new $AOP.WeaveError(e, 'Unweave');
				}
				return true;
	        },
			/**
			 * 
			 * @param {Object} pointcut
			 * @param {Object} cutline
			 */
	        advise: function(cutline){
	            throw new $.MethodNotImplementedError();
	        }
	    },
		/**
		 * 
		 * @param {Object} options
		 */
		After$Class:{
			/**
	         * @constructor
			 * @param {Object} options
			 */
		    constructor: function(options){
		        $.extend(this, 
		        	new $AOP.Aspect(options),
		         	$AOP.After$Class);
	            $.extend(true, this, options);
		        this.logger = $Log.getLogger("Claypool.AOP.After");
		        this.type = "after";
		    },
			/**
			 * 
			 */
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
	    			throw new $AOP.AspectError(e, "After");
	    		}
		    }
		},
		/**
		 * 
		 * @param {Object} options
		 */
		Before$Class: {
			/**
	         * @constructor
			 * @param {Object} options
			 */
		    constructor: function(options){
		        $.extend( this, 
		        	new $AOP.Aspect(options), 
		        	$AOP.Before$Class);
		        this.logger = $Log.getLogger("Claypool.AOP.Before");
		        this.type = "before";
		    },
			/**
			 * 
			 */
		    advise: function(cutline){
			    var _this = this;
		    	try{
			        return function() {
		    			_this.advice.apply(_this, arguments);
		    			return cutline.apply(this, arguments);//?should be this?
		    		};
	    		}catch(e){
	    			throw new $AOP.AspectError(e, "Before");
	    		}
		    }
		},
		/**
		 * 
		 * @param {Object} options
		 */
		Around$Class: {
			/**
	         * @constructor
			 * @param {Object} options
			 */
		    constructor: function(options){
		        $.extend( this, 
		        	new $AOP.Aspect(options),
		        	$AOP.Around$Class);
		        this.logger = $Log.getLogger("Claypool.AOP.Around");
		        this.type = "around";
		    },
			/**
			 * 
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
					throw new $AOP.AspectError(e, "Around");
				}
		    }
		},
		/**
		 * 
		 * @param {Object} e
		 */
	    ContainerError$Class:{
			/**
	         * @constructor
			 * @param {Object} e
			 */
	        constructor: function(e, options){ var details = {
	                name:"Claypool.AOP.ContainerError",
	                message:"An error occured inside the aop container."
	            };
	            $.extend( this, new $.Error(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    },
	    /**
	     * 
	     * @param {Object} e
	     */
	    ConfigurationError$Class:{
			/**
	         * @constructor
			 * @param {Object} e
			 */
	        constructor: function(e, options){ var details = {
	                name:"Claypool.AOP.ConfigurationError",
	                message:"An error occured updating the aop container configuration."
	            };
	            $.extend( this, new $.ConfigurationError(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    },
	    /**
	     * 
	     * @param {Object} e
	     */
	    FactoryError$Class:{
			/**
	         * @constructor
			 * @param {Object} e
			 */
	        constructor: function(e, options){ var details = {
	                name:"Claypool.AOP.FactoryError",
	                message:"An error occured creating the aspect from the configuration."
	            };
	            $.extend( this, new $.Error(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    },
	    /**
	     * 
	     * @param {Object} e
	     */
	    WeaveError$Class:{
			/**
	         * @constructor
			 * @param {Object} e
			 */
	        constructor: function(e, options){ var details = {
	                name:"Claypool.AOP.WeaveError",
	                message:"An error occured weaving or unweaving the aspect."
	            };
	            $.extend( this, new $.Error(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    },
	    /**
	     * 
	     * @param {Object} e
	     */
	    AspectError$Class:{
			/**
	         * @constructor
			 * @param {Object} e
			 */
	        constructor: function(e, options){ var details = {
	                name:"Claypool.AOP.AspectError",
	                message:"An error occured while applying an aspect."
	            };
	            $.extend( this, new $.Error(e, options?{
	                name:(options.name?(options.name+" > "):"")+details.name,
	                message:(options.message?(options.message+" \n "):"")+details.message
	            }:details));
	        }
	    }
	});
	
	/**  @constructor alias */
	$AOP.Container                      = $AOP.Container$Class.constructor;
	/**  @constructor alias */
	$AOP.Factory                  		= $AOP.Factory$Class.constructor;
	/**  @constructor alias */
	$AOP.Aspect                 		= $AOP.Aspect$Abstract.constructor;
	/**  @constructor alias */
	$AOP.After                          = $AOP.After$Class.constructor;
	/**  @constructor alias */
	$AOP.Before                         = $AOP.Before$Class.constructor;
	/**  @constructor alias */
	$AOP.Around                         = $AOP.Around$Class.constructor;
	
	/**  @constructor alias */
	$AOP.ContainerError                 = $AOP.ContainerError$Class.constructor;
	/**  @constructor alias */
	$AOP.ConfigurationError             = $AOP.ConfigurationError$Class.constructor;
	/**  @constructor alias */
	$AOP.FactoryError             		= $AOP.FactoryError$Class.constructor;
	/**  @constructor alias */
	$AOP.WeaveError                		 = $AOP.WeaveError$Class.constructor;
	/**  @constructor alias */
	$AOP.AspectError             		= $AOP.AspectError$Class.constructor;
	
})( Claypool, /*Required Modules*/
	Claypool.Logging,
	Claypool.AOP );

//Give a little bit, Give a little bit of our aop to you. ;)
(function($){ 
	$.AOP = Claypool.AOP; 
})(jQuery);
Claypool.IoC={
/*
 * Claypool.IOC @VERSION - A Web 1.6180339... Javascript Application Framework
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
(function($, $Log, $IoC){
	
	jQuery(document).bind("claypool:initialize", function(event, context){
		context['claypool:IoC'] = new $IoC.Container();
		if(context.ContextContributor && $.isFunction(context.ContextContributor)){
			$.extend(context['claypool:IoC'], new context.ContextContributor());
			context['claypool:IoC'].registerContext("Claypool.IoC.Container");
		}
	}).bind("claypool:reinitialize", function(event, context){
		context['claypool:IoC'].factory.updateConfig();
	});
	
	$.extend($IoC, {
	    /**stores instances and uses an instance factory to
	    create new instances if one can't be found (for lazy instantiation patterns)*/
	    /**@class*/
	    Container$Class:{
	        /**@private*/
	        factory:null,
	        /**@constructor*/
	        constructor: function(options){
	            $.extend( this, $.ContextContributor(options));
	            $.extend( this, $IoC.Container$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.IoC.Container");
	            this.logger.debug("Configuring Claypool IoC Container");
	            /**Register first so any changes to the container managed objects 
	            are immediately accessible to the rest of the application aware
	            components*/
	            this.factory = new $IoC.Factory();
	            this.factory.updateConfig();
	            return this;
	        },
	        /**@public*/
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
	                            jQuery(document).bind('claypool:postcreate:'+instance.id,  function(event, reattachedObject, id){
	                                _this.logger.info("Reattached Active Object Inside IoC Container");
	                                instance._this = reattachedObject;
	                            });
	                            jQuery(document).bind('claypool:postdestroy:'+instance.id,  function(){
	                                _this.logger.info("Removed Active Object Inside IoC Container");
	                                _this.remove(id);
	                            });
	                        }else{
	                        	//trigger notification of new id in ioc container
	                        	jQuery(document).trigger("claypool:ioc",[id, this]);
	                        	//trigger specific notification for the new object
	                        	jQuery(document).trigger("claypool:ioc:"+id,[id, this]);
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
	                throw new $IoC.ContainerError(e);
	            }
	            return null;
	        }
	    },
	    /**Stores instance configurations and manages instance lifecycles*/
	    /**@class*/
	    Factory$Class:{
	        /**static*/
	        configurationId:'ioc',
	        /**@constructor*/
	        constructor: function(options){
	            $.extend( this, new $.BaseFactory(options));
	            $.extend( this, $IoC.Factory$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.IoC.Factory");
	            return this;
	        },
	        /**@private*/
	        createLifeCycle: function(instance){
	            try{
	                //Walk the creation lifecycle
	                instance.precreate();
	                instance.create();
	                instance.postcreate();
	            }catch(e){
	                this.logger.error("An Error occured in the Creation Lifecycle.");
	                this.logger.exception(e);
	                throw new $IoC.LifeCycleError(e);
	            }
	        },/**@private*/
	        destroyLifeCycle: function(instance){
	            try{
	                //Walk the creation lifecycle
	                instance.predestroy();
	                instance.destroy();
	                instance.postdestroy();
	            }catch(e){
	                this.logger.error("An Error occured in the Destory Lifecycle.");
	                this.logger.exception(e);
	                throw new $IoC.LifeCycleError(e);
	            }
	        },
	        /**@public*/
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
	                    instance = new $IoC.Instance(configuration.id, configuration);
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
	                throw new $IoC.FactoryError(e);
	            }
	        },
	        /**@public*/
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
	                                $.resolveName(iocconf.factory).scan(iocconf.scan)
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
	                throw new $IoC.ConfigurationError(e);
	            }
	            return true;
	        }
	    },
	    /**@class*/
	    Instance$Class:{
	        _this:null,//A reference to the managed object
	        id:null,//published to the application context
	        configuration:null,//the instance configuration
	        guid:null,//globally (naively) unique id for the instance created internally
	        type:null,//a reference to the clazz
	        constructor: function(id, configuration){
	            $.extend( this, $IoC.Instance$Class);
	            /**not a very good guid but naively safe*/
	            this.guid =     $.createGUID();
	            this.id   =     id;
	            this.configuration = configuration||{};
	            this.logger = $Log.getLogger("Claypool.IoC.Instance");
	            /**Override the category name so we can identify some extra info about the object
	            in it's logging statements*/
	            this.logger.category = this.logger.category+this.id;
	            return this;
	        },
	        /**
	        * 
	        */
	        /**@public*/
	        precreate: function(){
	            try{
	                this._this = {claypoolId:this.id};//a temporary stand-in for the object we are creating
	                this.logger.debug("Precreating Instance");
	                jQuery(document).trigger("claypool:precreate", [this._this, this.id]);
	                //second event allow listening to the specific object lifecycle if you know it's id
	                jQuery(document).trigger("claypool:precreate:"+this.id, [this._this]);
	                //TODO:  Apply function specified in ioc hook
	                return this;
	            }catch(e){
	                this.logger.error("An Error occured in the Pre-Create LifeCycle Phase");
	                this.logger.exception(e);
	                throw new $IoC.LifeCycleError(e);
	            }
	        },
	        /**@public*/
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
	                    this._this  = jQuery(this.configuration.selector);
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
	                jQuery(document).trigger("claypool:create", [this._this, this.id]);
	                //second event allow listening to the specific object lifecycle if you know it's id
	                jQuery(document).trigger("claypool:create:"+this.id, [this._this]);
	                return this._this;
	            }catch(e){
	                this.logger.error("An Error occured in the Create LifeCycle Phase");
	                this.logger.exception(e);
	                throw new $IoC.LifeCycleError(e);
	            }
	        },
	        /**@public*/
	        postcreate:function(){
	            try{
	                //TODO:  Apply function specified in ioc hook
	                this.logger.debug("PostCreate invoked");
	                jQuery(document).trigger("claypool:postcreate", [this._this, this.id]);
	                //second event allow listening to the specific object lifecycle if you know it's id
	                jQuery(document).trigger("claypool:postcreate:"+this.id, [this._this]);
	                return this._this;
	            }catch(e){
	                this.logger.error("An Error occured in the Post-Create LifeCycle Phase");
	                this.logger.exception(e);
	                throw new $IoC.LifeCycleError(e);
	            }
	        },
	        /**@public*/
	        predestroy:function(){
	            //If you need to do something to save state, eg make an ajax call to post
	            //state to a server or local db (gears), do it here 
	            try{
	                //TODO:  Apply function specified in ioc hook
	                this.logger.debug("Predestory invoked");
	                jQuery(document).trigger("claypool:predestroy", [this._this, this.id]);
	                //second event allow listening to the specific object lifecycle if you know it's id
	                jQuery(document).trigger("claypool:predestroy:"+this.id, [this._this]);
	                return this._this;
	            }catch(e){
	                this.logger.exception(e);
	                throw new $IoC.LifeCycleError(e);
	            }
	        },
	        /**@public*/
	        destroy:function(){
	            try{
	                //TODO:  
	                //we dont actually do anyting here, yet... it might be
	                //a good place to 'delete' or null things
	                this.logger.info("Destroy invoked");
	                jQuery(document).trigger("claypool:destroy", [this._this, this.id]);
	                //second event allow listening to the specific object lifecycle if you know it's id
	                jQuery(document).trigger("claypool:destroy:"+this.id, [this._this]);
	                return delete this._this;
	            }catch(e){
	                this.logger.exception(e);
	                throw new $IoC.LifeCycleError(e);
	            }
	        },
	        /**@public*/
	        postdestroy:function(){
	            //If you need to do something now that the instance was successfully destroyed
	            //here is your lifecycle hook.  
	            try{
	                //TODO:  Apply functions specified in ioc hook
	                this.logger.debug("Postdestory invoked");
	                jQuery(document).trigger("claypool:postdestroy", [this.id]);
	                //second event allow listening to the specific object lifecycle if you know it's id
	                jQuery(document).trigger("claypool:postdestroy:"+this.id);
	                return this;
	            }catch(e){
	                this.logger.exception(e);
	                throw new $IoC.LifeCycleError(e);
	            }
	        },
	        /**@public*/
	        resolveConstructor:function(constructorName){
	            var constructor;
	            try{
	                constructor = $.resolveName(constructorName); 
	                if( $.isFunction(constructor) ){
	                    this.logger.debug(" Resolved " +constructorName+ " to a function");
	                    return constructor;
	                }else{ 
	                    throw new Error("Constructor is not a function: " + constructorName);
	                }
	            }catch(e){
	                this.logger.exception(e);
	                throw new $IoC.ConstructorResolutionError(e);
	            }
	        }
	    },
	    /**@exception*/
	    ContainerError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.Error(e, {
	                name:"Claypool.IoC.ContainerError",
	                message: "An error occured in the ioc instance factory."
	            }));
	        }
	    },
	    /**@exception*/
	    FactoryError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.Error(e, {
	                name:"Claypool.IoC.FactoryError",
	                message: "An error occured in the ioc factory."
	            }));
	        }
	    },
	    /**@exception*/
	    ConfigurationError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.ConfigurationError(e, {
	                name:"Claypool.IoC.ConfigurationError",
	                message: "An error occured updating the ioc container configuration."
	            }));
	        }
	    },
	    /**@exception*/
	    LifeCycleError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.Error(e, {
	                name:"Claypool.IoC.LifeCycleError",
	                message: "An error occured during the lifecycle process."
	            }));
	        }
	    },
	    /**@exception*/
	    ConstructorResolutionError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.NameResolutionError(e, {
	                name:"Claypool.IoC.ConstructorResolutionError",
	                message: "An error occured trying to resolve the constructor."
	            }));
	        }
	    }
	});
	/**@constructorAlias*/
	$IoC.Container                      = $IoC.Container$Class.constructor;
	/**@constructorAlias*/
	$IoC.Factory                		= $IoC.Factory$Class.constructor;
	/**@constructorAlias*/
	$IoC.Instance                       = $IoC.Instance$Class.constructor;
	
	//Exception Classes
	/**@constructorAlias*/
	$IoC.ContainerError                 = $IoC.ContainerError$Class.constructor;
	/**@constructorAlias*/
	$IoC.FactoryError           		= $IoC.FactoryError$Class.constructor;
	/**@constructorAlias*/
	$IoC.ConfigurationError             = $IoC.ConfigurationError$Class.constructor;
	/**@constructorAlias*/
	$IoC.LifeCycleError                 = $IoC.LifeCycleError$Class.constructor;
	/**@constructorAlias*/
	$IoC.ConstructorResolutionError     = $IoC.ConstructorResolutionError$Class.constructor;
	
})( Claypool,/*Required Modules*/
	Claypool.Logging,
	Claypool.IoC );
	
//Give a little bit, Give a little bit of our ioc to you. ;)
(function($){ 
	$.IoC = Claypool.IoC; 
})(jQuery);
Claypool.MVC={
/*
 * Claypool.MVC @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Model-View-Controller Patterns  -
 *
 *   Claypool MVC provides some low level built in controllers which a used to 
 *   route control to your controllers.  These Claypool provided controllers have a convenient
 *   configuration, though in general most controllers, views, and models should be
 *   configured using the general ioc configuration patterns and are simply referenced as targets.
 *
 *   The Claypool built-in controllers are:
 *       Claypool.MVC.HijaxLinkController - maps url patterns in hrefs to custom controllers.
 *           The href resource is resolved via ajax and the result is delivered to the specified
 *           controllers 'handle' method
 * 
 *       Claypool.MVC.HijaxFormController - maps form submissions to custom controllers.
 *           The submittion is handled via ajax and the postback is delivered to the specified
 *           controllers 'handle' method
 *
 *       Claypool.MVC.HijaxButtonController - maps button (not submit buttons) to custom controllers.
 *           This is really useful for dialogs etc when 'cancel' is just a button but 'ok' is a submit.
 *
 *       Claypool.MVC.HijaxEventController - maps events to custom controllers.  This would normally
 *           be browser events based on the dom, but with providers like jQuery the eventing
 *           is much richer.  By default the event system is provided by jquery.
 *
 */
};
(function($, $Log, $IoC, $MVC){
	
	jQuery(document).bind("claypool:initialize", function(event, context){
		context['claypool:MVC'] = new $MVC.Container();
		if(context.ContextContributor && $.isFunction(context.ContextContributor)){
			$.extend(context['claypool:MVC'], new context.ContextContributor());
			context['claypool:MVC'].registerContext("Claypool.MVC.Container");
		}
	}).bind("claypool:reinitialize", function(event, context){
		context['claypool:MVC'].factory.updateConfig();
	});
	
	$.extend( $MVC, {
	    Container$Class:{
	        factory:null,
	        constructor: function(options){
	            $.extend( this, new $.ContextContributor(options));
	            $.extend( this, $MVC.Container$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.MVC.Container");
	            this.logger.debug("Configuring Claypool MVC Container");
	            //Register first so any changes to the container managed objects 
	            //are immediately accessible to the rest of the application aware
	            //components
	            this.factory = new $MVC.Factory();
	            this.factory.updateConfig();
	            //create global contollors non-lazily
	            var controller;
	            var controllerId;
	            for(controllerId in this.factory.cache){
	                //will trigger the controllerFactory to instantiate the controllers
	                controller = this.get(controllerId);
	                //activates the controller
	                this.logger.debug("attaching mvc core controller: %s", controllerId);
	                controller.attach();
	            }
	            return this;
	        },
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
	                    }
	                }else{ 
	                    this.logger.debug("Found container managed controller : %s", id);
	                    return controller._this;
	                }
	            }catch(e){
	                this.logger.exception(e);
	                throw new $MVC.ContainerError();
	            }
	            throw new $MVC.FactoryError(id);
	        }
	    },
	    Factory$Class:{
	        configurationId:'mvc',
	        constructor: function(options){
	            $.extend( this, new $IoC.Factory(options));
	            $.extend( this, $MVC.Factory$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.MVC.Factory");
	        },
	        updateConfig: function(){
	            var mvcConfig;
	            try{
	                this.logger.debug("Configuring Claypool MVC Controller Factory");
	                mvcConfig = this.getConfig()||{};//returns mvc specific configs
	                //Extension point for custom low-level hijax controllers
	                jQuery(document).trigger("claypool:hijax", [this, this.initializeHijaxController, mvcConfig]);
	            }catch(e){
	                this.logger.exception(e);
	                throw new $MVC.ConfigurationError(e);
	            }
	        },
	        scan: function(name){
	            var log = this.logger||$Log.getLogger("Claypool.MVC.Factory$Class");
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
                    scanBase = $.resolveName(name);
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
	        /**@private*/
	        initializeHijaxController: function(mvcConfig, key, clazz, options){
	            var configuration;
	            var i;
	            if(mvcConfig[key]){
	                for(i=0;i<mvcConfig[key].length;i++){
	                    configuration = {};
	                    configuration.id = mvcConfig[key][i].id;
	                    configuration.clazz = clazz;
	                    configuration.options = [ $.extend(true,mvcConfig[key][i], options||{}) ];
	                    this.logger.debug("Adding MVC Configuration for Controller Id: %s", configuration.id);
	                    this.add( configuration.id, configuration );
	                }
	            }
	        }
	    },
	    //Basic MVC interfaces
	    /**
	    *   In Claypool a controller is meant to be a wrapper for a generally 'atomic'
	    *   unit of business logic.  
	    */
	    Controller$Abstract:{ 
	        model:null,
	        view:null,
	        constructor: function(options){
	            $.extend( this, new $.SimpleCachingStrategy(options));
	            $.extend( this, $MVC.Controller$Abstract);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.MVC.Controller");
	        },
	        handle: function(event){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    /**
	    *   The hijax 'or' routing controller implements the handle and resolve methods and provides
	    *   a new abstract method 'strategy' which should be a function that return 
	    *   a list, possibly empty of controller names to forward the data to.  In general
	    *   the strategy can be used to create low level filtering controllers, broadcasting controllers
	    *   pattern matching controllers (which may be first match or all matches), etc
	    */
	    HijaxController$Abstract:{
	        constructor: function(options){
	            $.extend( this, new $MVC.Controller(options));
	            $.extend( this, $MVC.HijaxController$Abstract);
	            $.extend(true, this, {/*defaults*/
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
	            this.router = new $.Router();
	            this.bindCache = new $.SimpleCachingStrategy();
	            this.logger = $Log.getLogger("Claypool.MVC.HijaxController");
	        },
	        handle: function(data){
	            //Apply the strategy
	            this.logger.debug("Handling pattern: %s", data.pattern);
	            this.forwardingList = this.router[this.strategy||"all"]( data.pattern );
	            this.logger.debug("Resolving matched paterns");
	            var target, action, resolver, defaultView;
	            var resolvedResponses = [];
	            var _this = this;
	            return jQuery(this.forwardingList).each(function(){
	            	//the event is the first arg, we are going to force the second arg to always
	            	//be 'mvc' and the tack back on the original extra args.
	            	var _event = data.args[0];
	            	var mvc;
	            	var extra = [];
	            	for(var i = 1; i < data.args.length; i++){extra[i-1]=data.args[i];}
	                try{
	                    _this.logger.info("Forwaring to registered controller %s", this.payload.controller);
	                    target = $.$(this.payload.controller);
	                    //the default view for 'fooController' or 'fooService' is 'fooView' otherwise the writer
	                    //is required to provide it before a mvc flow can be resolved.
	                    defaultView = this.payload.controller.match('Controller') ?
	                    	this.payload.controller.replace('Controller', 'View') : null;
	                    defaultView = this.payload.controller.match('Service') ?
	                    	this.payload.controller.replace('Service', 'View') : defaultView;
	                    mvc = {
	                        m:{},
	                        v:defaultView,
	                        c:target,
	                        resolve:_this.makeResolver(_event)
		                };
		                //tack back on the extra event arguments
	                    target[this.payload.action||"handle"].apply(target, [ _event, mvc ].concat(extra) );
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
	        attach: function(){
	            this.router.compile(this.hijaxMap, this.routerKeys);//, "controller", "action");
	            var _this = this;
	            if(this.active&&(this.selector!==""||this.filter!=="")){
	                this.logger.debug("Actively Hijaxing %s's.", this.hijaxKey);
	                jQuery(this.selector+this.filter).livequery(function(){
	                    _this.hijax(this);
	                });
	            }else if (this.selector!==""||this.filter!==""){
	                this.logger.debug("Hijaxing Current %s's.", this.hijaxKey);
	                jQuery(this.selector+this.filter).each(function(){
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
	                //var retVal = true;
	                _this.logger.info("Hijaxing %s: ", _this.hijaxKey);
	                if(_this.stopPropagation){
	                    _this.logger.debug("Stopping propogation of event");
	                    event.stopPropagation();
	                }
	                if(_this.preventDefault){
	                    _this.logger.debug("Preventing default event behaviour");
	                    event.preventDefault();
	                    //retVal = false;
	                }
	                _this.handle({pattern: _this.getTarget.apply(_this, arguments), args:arguments});
	                //return retVal;
	            };
	            if(this.event){
	                /**This is a specific event hijax so we bind once and dont think twice  */
	                jQuery(target).bind(this.event+"."+this.eventNamespace, _hijax);
	                _this.logger.debug("Binding event %s to hijax controller on target", this.event, target);
	            }else{     
	                /**
	                *   This is a '(m)any' event hijax so we need to bind based on each routed endpoints event.
	                *   Only bind to the event once (if its a custom event) as we will progagate the event
	                *   to each matching registration, but dont want this low level handler invoked more than once.
	                */
	                jQuery(this.hijaxMap).each(function(){
	                    if(this.event&&!_this.bindCache.find(this.event)){
	                        _this.bindCache.add(this.event, _this);
	                        _this.logger.debug("Binding event %s to controller %s on target %s",
	                            this.event, this.controller ,target);
	                        jQuery(target).bind(this.event+"."+_this.eventNamespace,_hijax);
	                    }
	                });
	            }   
	            return true;
	        },
	        //provides a continuation for the mvc flow to allow room for asynch dao's and the like
	        makeResolver: function(event){
	            var _this = this;
	            var callbackStack = [];
	            var forwardedEvent = event;
	            return function(eventOrCallback){
	                var mvc = this;
	                var target;
	                var controller;
	                var action;
	                var view, viewMethod;
	                var guidedEventRegistration;
	                /**
	                *   event might be propogated if control is being forwarded, otherwise callback (optional)
	                *   callbacks are saved until any forwarding is completed and then executed sequentially 
	                *   by popping off the top (so in reverse of the order they where added)
	                */
	                if(eventOrCallback&&$.isFunction(eventOrCallback)){
	                    callbackStack.push(eventOrCallback);
	                }else{
	                    forwardedEvent  = eventOrCallback?eventOrCallback:forwardedEvent;
	                }
	                if(mvc.m===null){
	                    _this.logger.debug("No Model passed to MVC Resolver");
	                    mvc.m = {};
	                }
	                if(mvc.m&&mvc.v&&mvc.c){
	                    _this.logger.debug(" - Resolving Control - \n\tmvc:(\n\t\tm:%s,\n\t\tv:%s,\n\t\tc:%s)",mvc.m, mvc.v, mvc.c);
	                    try{
	                        if(mvc.v.indexOf("forward://")===0){
	                            //expects "forward://target{/action}"
	                            target = mvc.v.replace("forward://","").split("/");
	                            action = (target.length>0&&target[1].length>0)?target[1]:"handle";
	                            controller = _this.find(target[0]);
	                            if(controller === null){
	                                controller = $.$(target[0]);
	                                //cache it for speed on later use
	                                _this.add(target[0], controller);
	                            }
	                            controller[action](forwardedEvent, mvc);
	                        }else {
	                        	//a view can specifiy a method other than the default 'update'
	                        	//by providing a '.name' on the view
	                        	view = mvc.v;
	                        	//If a writer is provided, the default view method is 'render'
	                        	viewMethod = mvc.w?"render":"update";
	                        	if(mvc.v.indexOf(".") > -1){
	                        		viewMethod = mvc.v.split('.');
	                        		view = viewMethod[0];
	                        		//always use the last so we can additively use the mvc resolver in closures
	                        		viewMethod = viewMethod[viewMethod.length-1];
	                        	}
	                        	_this.logger.debug("Calling View %s.%s", view, viewMethod);
	                            view = $.$(view);
	                            if(view){
	                                if($.isFunction(view[viewMethod])){
	                                    _this.logger.debug("Updating view %s, intended? %s, model? %o, writer? %o", 
	                                        mvc.v, viewMethod, mvc.m, mvc.w);
	                                    //if a 'writer' is provided the view is called with both args
	                                    if(mvc.w){view[viewMethod](mvc.m, mvc.w);}else{view[viewMethod](mvc.m);}
	                                    _this.logger.debug("Cascading callbacks");
	                                    while(callbackStack.length > 0){ (callbackStack.pop())(); }
	                                }else if (view["@claypool:activeobject"]){
	                                	//some times a view is removed and reattached.  such 'active' views
	                                	//are bound to the post create lifecycle event so they can resolve 
	                                	//as soon as possible
	                                    guidedEventRegistration = "claypool:postcreate:"+view["@claypool:id"]+"."+$.createGUID();
	                                    jQuery(document).bind(guidedEventRegistration,function(event, newView){
	                                        _this.logger.warn("The view is reattached to the dom.");
	                                        //unbind handler
	                                        jQuery(document).unbind(guidedEventRegistration);
	                                        newView.update(mvc.m);
	                                        _this.logger.debug("Cascading callbacks");
	                                        while(callbackStack.length > 0){ (callbackStack.pop())(); }
	                                    });
	                                }else{
	                                	_this.logger.debug("View method cannot be resolve", viewMethod);
	                                }
	                            }else{
	                                _this.logger.warn("Cant resolve view %s. ", mvc.v);
	                            }
	                        }
	                    }catch(e){
	                        _this.logger.exception(e);
	                        throw e;
	                    }
	                }else{
	                    _this.logger.error("Can't resolve mvc flow:  \n\tmvc:(\n\t\tm:%s,\n\t\tv:%s,\n\t\tc:%s)", mvc.m, mvc.v, mvc.c);
	                }
	            };
	        },
	        /**returns some part of the event to use in router, eg event.type*/
	        getTarget: function(event){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    View$Interface:{
	        update: function(model){//refresh screen display logic
	            throw new $.MethodNotImplementedError();
	        },
	        think: function(){//display activity occuring, maybe block
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    
	    /**@exception*/
	    ContainerError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.Error(e, {
	                name:"Claypool.MVC.ContainerError",
	                message: "An error occurred trying to retreive a container managed object."
	            }));
	        }
	    },
	    /**@exception*/
	    FactoryError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.Error(e, {
	                name:"Claypool.MVC.FactoryError",
	                message: "An error occured trying to create the factory object."
	            }));
	        }
	    },
	    /**@exception*/
	    ConfigurationError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.ConfigurationError(e, {
	                name:"Claypool.MVC.ConfigurationError",
	                message: "An error occured during the configuration."
	            }));
	        }
	    }
	});
	/**@constructorAlias*/
	$MVC.Container                      = $MVC.Container$Class.constructor;
	/**@constructorAlias*/
	$MVC.Factory              = $MVC.Factory$Class.constructor;
	/**@constructorAlias*/
	$MVC.Controller             = $MVC.Controller$Abstract.constructor;
	/**@constructorAlias*/
	$MVC.HijaxController        = $MVC.HijaxController$Abstract.constructor;
	
	
	//Exception Classes
	/**@constructorAlias*/
	$MVC.ContainerError                 = $MVC.ContainerError$Class.constructor;
	/**@constructorAlias*/
	$MVC.FactoryError          			= $MVC.FactoryError$Class.constructor;
	/**@constructorAlias*/
	$MVC.ConfigurationError             = $MVC.ConfigurationError$Class.constructor;

	//this defines the built-in low-level controllers. adding more is easy! just register for the
	//event and use this as an example template.
	//For another example see claypool server
	jQuery(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
		registrationFunction.apply(_this, [configuration, "hijax:a",       "Claypool.MVC.HijaxController", {
            selector:       'a',
            event:          'click',
            strategy:       'first',
            routerKeys:     'urls',
            hijaxKey:       'link',
            eventNamespace: "Claypool:MVC:HijaxLinkController",
            getTarget:     function(event){ 
            	var link = event.target||event.currentTarget;
            	while(link.tagName.toUpperCase()!='A'){
            		link = jQuery(link).parent()[0];
            	}
            	return jQuery(link).attr("href");
        	}
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:button",  "Claypool.MVC.HijaxController", {
            selector:       ':button',
            event:          'click',
            strategy:       'all',
            routerKeys:     'urls',
            hijaxKey:       'button',
            eventNamespace: "Claypool:MVC:HijaxButtonController",
            getTarget:     function(event){ return event.target.value;}
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:input",  "Claypool.MVC.HijaxController", {
            selector:       'input',
            event:          'click',
            strategy:       'all',
            routerKeys:     'urls',
            hijaxKey:       'button',
            eventNamespace: "Claypool:MVC:HijaxInputController",
            getTarget:     function(event){ return event.target.name;}
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:form",    "Claypool.MVC.HijaxController", {
            selector:       'form',
            event:          'submit',
            strategy:       'first',
            routerKeys:     'urls',
            hijaxKey:       'form',
            eventNamespace: "Claypool:MVC:HijaxFormController",
            getTarget:     function(event){ return event.target.action;}
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:event",   "Claypool.MVC.HijaxController", {
            strategy:       'all',
            routerKeys:     'event',
            hijaxKey:       'event',
            eventNamespace: "Claypool:MVC:HijaxEventController",
            getTarget:     function(event){ return event.type;}
        }]);
	});
})( Claypool, /*Required Modules*/
	Claypool.Logging, 
	Claypool.IoC, 
	Claypool.MVC );


Claypool.Models = {};
Claypool.Views = {};
Claypool.Controllers = {};
//Give a little bit, Give a little bit of our mvc to you. ;)
(function($){ 
	$.MVC 			= Claypool.MVC;
	$.Models 		= Claypool.Models;
	$.Views 		= Claypool.Views;
	$.Controllers 	= Claypool.Controllers;
})(jQuery);

Claypool.Server={
/*
 * Claypool.Server @VERSION - A Web 1.6180339... Javascript Application Framework
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
(function($, $Log, $MVC, $Web){
	jQuery(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
		registrationFunction.apply(_this, [configuration, "hijax:server", "Claypool.MVC.HijaxController", {
            event:          'claypool:serve',
            strategy:       'first',
            routerKeys:     'urls',
            hijaxKey:       'request',
            eventNamespace: "Claypool:Server:HijaxServerController",
            getTarget:     function(event, request){ 
            	return request.url;//request/response object
        	}
        }]);
    });
	
    
	$.extend($Web, {
	    logger: null,
	    serve: function(request, response){
    		$Web.log = $Web.log||$Log.getLogger("Claypool.Server");
	        $Web.log.info("Handling global request routing for request: %s ", request.requestURL).
	        	 debug("Dispatching request to Server Sevlet Container");
	        response.headers = {};
	        $.extend( response.headers, { contentType:'text/html', status: 404 });
            response.body = "<html><head></head><body>"+
                "Not Found :\n\t"+request.requestURL+
            "</body></html>";
	        try{
	            jQuery(document).trigger("claypool:serve",[
	        	    {url:request.requestURL},
	                request, response
	            ]);
            }catch(e){
                $Web.log.error("Error Handling Request.").exception(e);
                response.headers.contentType = "text/html";
                response.headers.status = 500;
                response.body = "<html><head></head><body>"+e||"Unknown Error"+"</body></html>";
            }
	    },
	    render: function(request, response){
            $Web.log.debug("Finished Handling global request : %s  response %o", request.requestURL, response);
		},
		
	    Servlet$Abstract:{
	        constructor: function(options){
	            $.extend( this, new $MVC.Controller(options));
	            $.extend( this, $Web.Servlet$Abstract);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.Server.Servlet");
	        },
	        //We reduce to a single response handler function because it's not easy to
	        //support the asynch stuff on the server side
	        handle: function(event, mvc, data, request, response){
	        	//data is just the routing info that got us here
	        	//the request and response is really all we care about
	        	mvc.w = {
	        	    write: function(str){response.body = str; return this;},
	        	    append: function(str){response.body += str;return this;}
	        	};
	            try{
	                switch(request.method.toUpperCase()){
	                    case 'GET':
	                        this.logger.debug("Handling GET request");
	                        this.handleGet(request, response, mvc);
	                        this.logger.debug("Finished Handling GET request. Setting status 200.");
                            response.headers.status = 200;
	                        break;
	                    case 'POST':
	                        this.logger.debug("Handling POST request");
	                        this.handlePost(request, response, mvc);
	                        break;
	                    case 'PUT':
	                        this.logger.debug("Handling PUT request");
	                        this.handlePut(request, response, mvc);
	                        break;
	                    case 'DELETE':
	                        this.logger.debug("Handling DELETE request");
	                        this.handleDelete(request, response, mvc);
	                        break;
	                    case 'HEAD':
	                        this.logger.debug("Handling HEAD request");
	                        this.handleHead(request, response, mvc);
	                        break;
	                    case 'OPTIONS':
	                        this.logger.debug("Handling OPTIONS request");
	                        this.handleOptions(request, response, mvc);
	                        break;
	                    default:
	                        this.logger.debug("Unknown Method: %s, rendering error response.",  request.method);
	                        this.handleError(request, response, "Unknown Method: " + request.method );
	                }
	            } catch(e) {
	                this.logger.exception(e);
	                this.handleError(request, response, "Caught Exception in Servlet handler", e);
	            }finally{
	                $Web.render(request, response);
	            }
	        },
	        handleGet: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handlePost: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handlePut: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handleDelete: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handleHead: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handleOptions: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handleError: function(request, response, msg, e){
	            this.logger.warn("The default error response should be overriden");
	            response.headers.status = 300;
	            response.body = msg?msg:"Unknown internal error\n";
	            response.body += e&&e.msg?e.msg:(e?e:"\nUnpsecified Error.");
	        },
	        resolve: function(data){
	            this.logger.warn("The default resolve response is meant to be overriden to allow the rendering of a custom view.");
	            return data.response;
	        }
	    },
	    WebProxyServlet$Class : {
	        rewriteMap:null,//Array of Objects providing url rewrites
	        constructor: function(options){
	            $.extend( this, new $Web.Servlet(options));
	            $.extend( this, $Web.WebProxyServlet$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.Server.WebProxyServlet");
	            this.router = new $.Router();
	            this.strategy = this.strategy||"first";
	            this.logger.debug("Compiling url rewrites %s.", this.rewriteMap);
	            this.router.compile(this.rewriteMap, "urls");//, "rewrite");
	        },
	        handleGet: function(request, response){
	            var _this = this;
	            this.logger.debug("Handling proxy: %s", request.requestURI);
	            var proxyURL = this.router[this.strategy||"all"]( request.requestURI );
	            request.headers["Claypool-Proxy"] = this.proxyHost||"127.0.0.1";
	            if(proxyURL && proxyURL.length && proxyURL.length > 0){
	                _this.logger.debug("Proxying get request to: %s", proxyURL[0].payload.rewrite);
	                jQuery.ajax({
	                    type:"GET",
	                    dataType:"text",
	                    async:false,
	                    data:request.parameters,
	                    url:proxyURL[0].payload.rewrite,
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
	                        response.body = text;//xml.toString();
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
	    },
	    ConsoleServlet$Class:{
	        constructor: function(options){
	            $.extend( this, new $Web.Servlet(options));
	            $.extend( this, $Web.ConsoleServlet$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.Server.ConsoleServlet");
	        },
	        handlePost: function(request, response, mvc){
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
	        },
	        run: function(command){
	            var _this = this;
                jQuery.ajax({ 
                    type:'POST',  
                    url:'console/',   
                    processData:false,  
                    contentType:'text', 
                    data:command,
                    success:function(rsp){
                        _this.logger.info(rsp);
                    }
                });
	        }
	    }
	});
	/**@global*/
	ClaypoolServerHandler = $Web.serve;
	//Some server side classes that are otherwise not used on the client
	/**@constructorAlias*/
	$Web.Servlet                 		= $Web.Servlet$Abstract.constructor;
	/**@constructorAlias*/
	$Web.WebProxyServlet                = $Web.WebProxyServlet$Class.constructor;
	/**@constructorAlias*/
	$Web.ConsoleServlet                 = $Web.ConsoleServlet$Class.constructor;
})( Claypool,/*Required Modules*/
	Claypool.Logging,
	Claypool.MVC,
	Claypool.Server );
	
//Give a little bit, Give a little bit of our web server to you. ;)
(function($){ 
	$.Server = Claypool.Server; 
})(jQuery);
Claypool.Data={
/*
 * Claypool @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Unit Testing Patterns  -
 */
};
(function($, $Log, $Data){
	$.extend( $Data, {
		PlaceHolder:null
	});
})(Claypool, Claypool.Logging, Claypool.Data);Claypool.DAO={
/*
 * Claypool.DAO @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Generic DataAccessObject Patterns  -
 */
};
(function($, $Log, $DAO){
	
	$.extend( $DAO,  {
	    Publisher$Interface : {
	        create: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        replace: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        update: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        _delete: function(id, callback){//reserved word 'delete'
	            throw new $.MethodNotImplementedError();
	        }
	    },
    	Consumer$Interface : {
	        //Generic Query interface to get entire records
	        find: function(id, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        findAll: function(callback){
	            throw new $.MethodNotImplementedError();
	        },
	        findBy: function(criteria, params, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    Searcher$Interface : {
	        //Think OpenSearch, for getting paged result sets
	        search: function(query, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        suggest: function(query, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    Synchronizer$Interface : {
	        // if dirtyRecords is null, the method is expected to determine
	        //  which records have changed since the timestamp and provide 
	        //  those records as as array to the callback.  Otherwise it
	        //  is expected to provide any logic to update the dirty records
	        //  in its own storage implementation
	        synchronize: function(dirtyRecords, timestamp, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    NetWorker$AbstractClass : {
	        connectionStatus: null,
	        constructor: function(options){
	            $.extend(this, $.Models.NetWorker$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.DAO.NetWorker");
	            var _this = this;
	            jQuery(document).bind('claypool:online claypool:offline', this.onNetworkStatusChange);
	            jQuery(document).bind('ajaxSend', this.testConnection);
	            jQuery(document).bind('ajaxComplete', function(xhr, status){
	                _this.logger.debug("Resource retreival Complete : %s", status);
	            });
	        },
	        testConnection: function(xhr){
	            var _this = this;
	            if(xhr.type !== 'HEAD'){//avoid infite stack of calls to testConnection ;)
	                jQuery.ajax({
	                    type:"HEAD",
	                    async:false,
	                    url:"/",
	                    success: function(){
	                        /**Online implementation*/
	                        _this.logger.debug("Application Network Mode: Online");
	                        _this.connectionStatus = 'ONLINE';
	                        jQuery(document).trigger("claypool:online");
	                    },
	                    error: function(xhr){
	                        /**Offline implementation*/
	                        _this.logger.debug("Application Network Mode: Offline");
	                        _this.connectionStatus = 'OFFLINE';
	                        jQuery(document).trigger("claypool:offline");
	                        return true;//Cancels the request                    
	                    }
	                });
	            }
	        },
	        onNetworkStatusChange: function(event, extra){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    NetWorkAdaptor$Class : {
	        onlineDAO:null,
	        offlineDAO:null,
	        currentDAO:null,
	        constructor: function(options){
	            $.extend(this, new $DAO.NetWorker(options));
	            $.extend(this, $.Models.NetWorkAdaptor$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.DAO.NetWorkAdaptor");
	        },
	        onNetworkStatusChange: function(event, extra){
	            var i;
	            var now = new Date.getTime();
	            if(event.type == 'claypool:online' && 
	                this.connectionStatus && (this.connectionStatus == 'OFFLINE') ){
	                this.offlineDAO.synchronize(  null, now, function(offlineUpdates){//array of dirty resources/records
	                    if(offlineUpdates && offlineUpdates.length && offlineUpdates.length > 0){
	                        this.onlineDAO.synchronize( offlineUpdates, now, function(onlineUpdates){
	                            this.onlineDAO.synchronize( null, now,
	                            function(onlineUpdates){//array of dirty resources/records
	                                if(onlineUpdates && onlineUpdates.length && onlineUpdates.length > 0){
	                                    this.offlineDAO.synchronize( onlineUpdates, now );
	                                }
	                            });   
	                        });
	                    }
	                });
	                this.currentDAO = this.onlineDAO;
	            }else if(event.type == 'claypool:offline' && 
	                this.connectionStatus && (this.connectionStatus == 'ONLINE')){
	                this.currentDAO = this.offlineDAO;
	            }
	        }
	    },
	    Gears$Class : {
	    	dbName:null,
	    	connection:null,
	        constructor: function(options){
	            jQuery.extend(this, $DAO.Gears$Class);
	            jQuery.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.DAO.Gears");
	            this.connection = google.gears.factory.create('beta.database');
	        },
	        execute: function(options){
	            this.logger.debug("Executing SQL: \n\t\t %s", options.sql);
	            var resultSet = this.connection.execute(options.sql);
	            if(options.callback){options.callback(resultSet);}else{resultSet.close();}
	            return this;//chain
	        },
	        executeWithParams: function(options){
	            this.logger.debug("Executing SQL: \n\t\t %s, %s", options.sql, options.params);
	            var resultSet =  this.connection.execute( options.sql, options.params );
	            if(options.callback){options.callback(resultSet);}else{resultSet.close();}
	            return this;//chain
	        },
	        begin: function(){
	            this.logger.debug("Beginning SQL Transaction %s", this);
	            this.connection.execute( "BEGIN" );
	            return this;//chain
	        },
	        commit: function(){
	            this.logger.debug("Commit SQL Transaction %s", this);
	            this.connection.execute( "COMMIT" ).close();
	            return this;//chain
	        },
	        rollback: function(){
	            this.logger.info("Rolling Back SQL Transaction %s", this);
	            this.connection.execute( "ROLLBACK" ).close();
	            return this;//chain
	        },
	        lastId: function(){
	            //doesnt chain
	            return this.connection.lastInsertRowId;
	        }
	    }
	});
	/**@constructorAlias*/
	$DAO.NetWorker                  = $DAO.NetWorker$AbstractClass.constructor;
	/**@constructorAlias*/
	$DAO.NetWorkAdaptor             = $DAO.NetWorkAdaptor$Class.constructor;
	/**@constructorAlias*/
	$DAO.Gears                      = $DAO.Gears$Class.constructor;
		
})( Claypool,/*Required Modules*/
	Claypool.Logging,
	Claypool.DAO );

//Give a little bit, Give a little bit of our dao to you. ;)
(function($){ 
	$.DAO = Claypool.DAO;
})(jQuery);
