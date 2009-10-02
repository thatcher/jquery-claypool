

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
                            if(aopconf.target.match(/\.\*$/)){
                                //The string ends with '.*' which implies the target is every function
                                //in the namespace.  hence we resolve the namespace, look for every
                                //function and create a new filter for each function.
                                this.logger.debug("Broad aspect target %s", aopconf.target);
                                namespace = $.resolve(aopconf.target.substring(0, aopconf.target.length - 2));
                                for(prop in namespace){
                                    if($.isFunction(namespace[prop])){
                                        //extend the original aopconf replacing the id and target
                                        genconf = $.extend({}, aopconf, {
                                            id : aopconf.id+$.guid(),
                                            target : namespace[prop]
                                        });
                                        this.logger.debug("Creating aspect id %s [%s] (%s)", 
                                            aopconf.target, prop, genconf.id);
                                        this.add(genconf.id, genconf);
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
