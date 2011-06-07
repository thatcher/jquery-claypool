

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
