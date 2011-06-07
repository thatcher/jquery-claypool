

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    
    $$.Factory$Interface = {
        create: function(){ throw "MethodNotImplementedError"; }
    };

})(jQuery, Claypool);

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */ 
(function($, $$){   
    /**
     *
     */
    $$.Configurable$Interface = {
    	//This is the old school app framework configuration model.  It
    	//gives you the greatest flexibility and power to work with
    	//even legacy code, and allows you to consolidate configuration
    	//to a small number, or just a single, file.  It requires an investment
    	//to get it wired.
        configurationId:null,//an array of two unique string identifing the property 
        configuration:null,//
        configurationUrl:null,//
        configurationType:null,//"json" or "xml"
        getConfig: function(){ throw "MethodNotImplementedError";},
        loadConfig: function(){ throw "MethodNotImplementedError";},
        setConfig: function(){ throw "MethodNotImplementedError";},
        updateConfig: function(){ throw "MethodNotImplementedError";}
    };
})(jQuery, Claypool);

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){    
    /**
    
    */
    $$.Scanner$Interface = {
    	//The scanner is the new school app framework configuration model.  It
    	// relies heavily on convention to reduce the development overhead.  In
    	// the end, it's job is to simply walk a namespace and build the internal
    	// representation of the equivalent hand-wire configuration
        scan:function(){ throw "MethodNotImplementedError"; }
    };
})(jQuery, Claypool);

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){    
    /**
     * @constructor
     * By default the factories are configured programatically, using setConfiguration,
     * however all the wiring is available for separating it into a data format like
     * json or xml and retreiving via ajax (though not asynchronously)
     * Factories also manage the cache of objects they create for fast retreival
     * by id, thus the cache is a simple map implementation.
     */
    $$.BaseFactory = function(options){
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, {
            configurationUrl:"./app/configs/config.js",
            configurationType:"json"//or xml
        }, options /* overrides */ );
        this.logger = new $$.Logging.NullLogger();
        return this;
    };
    
    $.extend($$.BaseFactory.prototype,
        $$.SimpleCachingStrategy.prototype, 
        $$.Factory$Interface,
        $$.Configurable$Interface,
        $$.Scanner$Interface,{
        /**
         * returns the portion configuration specified by 'configurationId'
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        getConfig: function(){
            if( !this.configuration ){
                //First look for an object name Claypool.Configuration
                this.logger.debug( "Configuration for <%s> has not been set explicitly or has been updated implicitly.",  this.configurationId );      
                this.logger.debug("$$.Configuration: \n %o", $$.Configuration);
                if($$.Configuration[this.configurationId]){
                    this.logger.debug("Found Claypool.Configuration");
                    this.configuration = $$.Configuration[this.configurationId];
                }else if(!$$.Configuration){
                    //it's not specified in js code so look for it remotely
                    this.loadConfig();
                }
            }
            return this.configuration;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        loadConfig: function(options){
        	options = options||{};
            this.configurationUrl = options.url||this.configurationUrl;
            this.logger.debug("Attempting to load configuration from: %s", this.configurationUrl);
            //a non async call because we need to configure the loggers
            //with this info before they are called!
            var _this = this;
            jQuery.ajax({
                type: "Get",
              url: this.configurationUrl,
              async: false,
              data:{},
              dataType: "json",
    	        success: function(json){
    	            if(_this.configurationUrl == './app/configs/config.js'){
    	                $$.Configuration = $$.Configuration||{};
    	                $.extend(true, $$.Configuration, json);
    	            }else{
    	                _this.setConfig(_this.configurationId,
    	                    json?json:null
	                    );
                    }
                    if(options.callback){
                    	options.callback($$.Configuration);
                    }
    	        }
    	    });
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	setConfig: function(id, configuration){
    	    this.logger.debug("Setting configuration");
            this.configuration = configuration;
            $$.Configuration[id] = configuration;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(id){
             throw "MethodNotImplementedError";
        }
    });

})(jQuery, Claypool);
