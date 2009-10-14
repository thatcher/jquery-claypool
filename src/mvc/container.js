

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
            var controller;
            try{
                this.logger.debug("Search for a container managed controller : %s", id);
                controller = this.find(id);
                if(controller===undefined||controller===null){
                    this.logger.debug("Can't find a container managed controller : %s", id);
                    controller = this.factory.create(id);
                    if(controller !== null){
                        this.add(id, controller);
                        return controller._this;
                    }else{
                        return null;
                    }
                }else{ 
                    this.logger.debug("Found container managed controller : %s", id);
                    return controller._this;
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$MVC.ContainerError();
            }
            throw new $$MVC.FactoryError(id);
        }
    });
    
})(  jQuery, Claypool, Claypool.MVC );
