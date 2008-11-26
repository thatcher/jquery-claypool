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
	                        this.logger.debug("IoC Configuration for Id: %s", iocconf.id);
	                        this.add( iocconf.id, iocconf );
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
