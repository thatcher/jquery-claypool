

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
