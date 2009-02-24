

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
    /**
     * @constructor
     *      stores instances and uses an instance factory to
     *      create new instances if one can't be found (for lazy instantiation patterns)
     */
    $$IoC.Container = function(options){
        $$.extend(this, $$.Application.ContextContributor);
        $.extend(true, this, options);
        this.factory = null;
        this.logger = $.logger("Claypool.IoC.Container");
        this.logger.debug("Configuring Claypool IoC Container");
        /**Register first so any changes to the container managed objects 
        are immediately accessible to the rest of the application aware
        components*/
        this.factory = new $$IoC.Factory();
        this.factory.updateConfig();
    };
    
    $.extend( $$IoC.Container.prototype,
        $$.Application.ContextContributor.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
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
                            $(document).bind('claypool:postcreate:'+instance.id,  function(event, reattachedObject, id){
                                _this.logger.info("Reattached Active Object Inside IoC Container");
                                instance._this = reattachedObject;
                            });
                            $(document).bind('claypool:postdestroy:'+instance.id,  function(){
                                _this.logger.info("Removed Active Object Inside IoC Container");
                                _this.remove(id);
                            });
                        }else{
                            //trigger notification of new id in ioc container
                            $(document).trigger("claypool:ioc",[id, this]);
                            //trigger specific notification for the new object
                            $(document).trigger("claypool:ioc:"+id,[id, this]);
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
                throw new $$IoC.ContainerError(e);
            }
            return null;
        }
    });
    
})(  jQuery, Claypool, Claypool.IoC );
