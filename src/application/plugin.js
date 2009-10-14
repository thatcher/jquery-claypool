
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$App){
    
    $.extend($,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        app : function(){
            return $$App.getContext();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        boot : function(cb){
            $$App.Initialize(cb);
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        reboot : function(cb){
            $$App.Reinitialize(cb);
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        manage : function(containerName, managedId){
            $(document).bind("claypool:initialize", function(event, context){
                if(!context[managedId]){
                    context[managedId] = new ($.resolve( containerName ))();
                    if(context.ContextContributor && $.isFunction(context.ContextContributor)){
                        //$.extend(context.managedId, new context.ContextContributor());
                        context[managedId].registerContext(containerName);
                    }
                }else{
                    context[managedId].factory.updateConfig();
                }
            }).bind("claypool:reinitialize", function(event, context){
                //TODO: need to do a better job cleaning slate here.
                context[managedId] = new ($.resolve( containerName ))();
                if(context.ContextContributor && $.isFunction(context.ContextContributor)){
                    //$.extend(context.managedId, new context.ContextContributor());
                    context[managedId].registerContext(containerName);
                }
            });
            return this;
        }
    });
	
})(  jQuery, Claypool, Claypool.Application );
