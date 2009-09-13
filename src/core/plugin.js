
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    var globalContext = [],
        guid = 0,
        plugins = {},
        env;
        
    $.extend(plugins, {
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns Describe what it returns
	     * @type String
	     */
        $:function(id, value){
            var a,i;
            if(value === undefined){
                //search the contexts in priority order
                a = null;
                for(i=0;i<globalContext.length;i++){
                    a = globalContext[i]().get(id);
                    if(a){return a;}
                } return null;
            }else{
                if(globalContext[0]().find(id)){
                    globalContext[0]().remove(id);
                }
                globalContext[0]().put(id, value);
            }
        },
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns Describe what it returns
	     * @type String
	     */
        register: function(context, priority){
            if( Math.abs(priority) > (globalContext.length-1)/2 ){
                //should be claypool.application but possible to modify
                if(priority === 0 && $.isFunction(context.getContext)){
                    globalContext[0]=context.getContext;
                    
                }else if(priority !== 0 ){
                    //wrap the global context
                    if($.isFunction(context.getContext)){
                        globalContext.push(context.getContext);
                    }
                    if($.isFunction(context.getCachedContext)){
                        globalContext.unshift(context.getCachedContext);
                    }
                }
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        guid: function(){
            return (++guid)+"_"+new Date().getTime()+"_"+Math.round(Math.random()*100000000);
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        resolve: function(namespacedName){
            var _resolver;
            var namespaces;
            var target; //the resolved object/function/array/thing or null
            var i;
            try{
                _resolver = function(name){
                    return this[name];
                };
                namespaces = namespacedName.split('.');
                target = null;
                for( i = 0; i < namespaces.length; i++){
                    target = _resolver.call(target,namespaces[i]);
                    if(target === undefined){
                        return target;
                    }
                }
                return target;
            }catch(e){
                throw new $$.NameResolutionError(e);
            }
        },
	    /**
	     * Describe what this method does
	     * @private
	     * @param {String} paramName Describe this parameter
	     * @returns If no arguments are given this function returns the entire configuration object.
	     *          If a single arg is present it return the resolved portion of the subconfiguration.
	     *          Otherwise it treats the first arg as the name of the subconfiguration and the
	     *          second arg as an object or array to extend or merge respectively into the subconfiguration.
	     * @type String
	     */
        config: function(){
            var config, subconfig;
            if(arguments.length === 0){
                return $$.Configuration;
            }else if(arguments.length === 1 && typeof(arguments[0]) == "string"){
                return $.resolve("Claypool.Configuration."+arguments[0]);
            }else{
                config = $.resolve("Claypool.Configuration."+arguments[0]);
                if(config){
                    subconfig = arguments[1];
                    if(subconfig instanceof Array){
                        config = $.merge(config, subconfig);
                    }else if(subconfig instanceof  Object){
                        config = $.extend(true, config, subconfig);
                    }
                }
            }
            return this;//chain
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
         env: function(){
             //an environment is set or defined by calling
             //$.env('defaults', 'client.dev')
             if(arguments.length == 2){
                 //env is not necessarily flat so deep extension may be necessary
                 env = $.extend( true, env||{}, 
                     $.config('env.'+arguments[0]),
                     $.config('env.'+arguments[1]));
                 return env;
             }else{
                 if(arguments.length === 1 && !(typeof(arguments[0])=='string')){
                    //a convenience method for defining environments
					//like $.config('env',{});
					return $.config('env', arguments[0]);
                 }
                 return env[arguments[0]]||null;
             }
         }
        //TODO add plugin convenience methods for creating factory;
        //factory : function(){}
        //TODO add plugin convenience methods for creating context;
        //context : function(){}
        //TODO add plugin convenience methods for creating cache;
        //cache: function(){} 
        
    });
    $.extend($$, plugins);
    $.extend($, plugins);
    
    //Add an event listener for claypool loaded so we can initialize loggers
})(jQuery, Claypool);