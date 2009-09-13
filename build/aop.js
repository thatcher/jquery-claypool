
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
