

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
