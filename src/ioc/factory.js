

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
        create: function(id, namespace){
	        var configuration,
            	instance,
            	_this = this,
				remote, folder, file;
            try{	
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
						/*folder = $.env('lazyload')+remote.pop().toLowerCase()+'s';
						file = remote[1].toLowerCase()+'.js';
						_this.logger.debug('attempting to lazyload %s from %s%s',
							id, folder, file)
						$.getScript(folder+file, function(){
							$.scan
						});*/
						//Work In Progress
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
