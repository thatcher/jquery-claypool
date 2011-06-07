
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
