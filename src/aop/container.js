

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
                var aspect, ns;
				//support for namespaces
				ns = typeof(id)=='string'&&id.indexOf('#')>-1?
					[id.split('#')[0],'#'+id.split('#')[1]]:['', id];
				//namespaced app cache
				if(!this.find(ns[0])){
					this.add(ns[0], new $$.SimpleCachingStrategy());
				}
                this.logger.debug("Search for a container managed aspect :%s", id);
                aspect = this.find(ns[0]).find(ns[1]);
                if(aspect===undefined||aspect===null){
                    this.logger.debug("Can't find a container managed aspect :%s", id);
                    aspect = this.factory.create(ns[1], ns[0]);
                    if(aspect !== null){
                        this.find(ns[0]).add(ns[1], aspect);
                        return aspect;
                    }
                }else{
                    this.logger.debug("Found container managed instance :%s", id);
                    return aspect;
                }
                return null;
            }
        });
    
})(  jQuery, Claypool, Claypool.AOP );
