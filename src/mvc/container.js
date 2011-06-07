

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
    /**
     * @constructor
     */
    $$MVC.Container = function(options){
        $$.extend(this, $$.Application.ContextContributor);
        $.extend(true, this, options);
        this.factory = null;
        this.logger = $.logger("Claypool.MVC.Container").
             debug("Configuring Claypool MVC Container");
        //Register first so any changes to the container managed objects 
        //are immediately accessible to the rest of the application aware
        //components
        this.factory = new $$MVC.Factory();
        this.factory.updateConfig();
    };
    
    $.extend($$MVC.Container.prototype, 
        $$.Application.ContextContributor.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        get: function(id){
            var controller,
				ns;
				
            this.logger.debug("Search for a container managed controller : %s", id);
			//support for namespaces
			ns = typeof(id)=='string'&&id.indexOf('#')>-1?
				[id.split('#')[0],'#'+id.split('#')[1]]:['', id];
			//namespaced app cache
			if(!this.find(ns[0])){
				this.add(ns[0], new $$.SimpleCachingStrategy());
			}
            controller = this.find(ns[0]).find(ns[1]);
            if(controller===undefined||controller===null){
                this.logger.debug("Can't find a container managed controller : %s", id);
				//recall order of args for create is id, namespace so we maintain
				//backward compatability
                controller = this.factory.create( ns[1], ns[0]);
                if(controller !== null){
                    this.find(ns[0]).add(ns[1], controller);
                    return controller._this;
                }else{
                    return null;
                }
            }else{ 
                this.logger.debug("Found container managed controller : %s", id);
                return controller._this;
            }
            throw ("UnknownID:"+id);
        }
    });
    
})(  jQuery, Claypool, Claypool.MVC );
