

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    
    $$.CachingStrategy$Interface = {
        cache:  null,
        size:   null,
        clear:  function(){ throw new $$.MethodNotImplementedError(); },
        add:    function(id, object){ throw new $$.MethodNotImplementedError(); },
        remove: function(id){ throw new $$.MethodNotImplementedError(); },
        find:   function(id){ throw new $$.MethodNotImplementedError(); }
    };

})(  jQuery, Claypool );
  

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
	/**
	 * @constructor
	 */
    $$.SimpleCachingStrategy = function(options){
        $.extend(true, this, options);
        this.logger = new $$.Logging.NullLogger();
        this.clear();
        return this;
    };
    
    $.extend($$.SimpleCachingStrategy.prototype, 
        $$.CachingStrategy$Interface,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        clear: function(){
            this.logger.debug("Clearing Cache.");
    		this.cache = null;
    		this.cache = {};
    		this.size = 0;
    	},
    	/**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	add: function(id, object){
	        this.logger.debug("Adding To Cache: %s", id);
		    if ( !this.cache[id] ){
    			this.cache[id] = object;
    			this.size++;
    			return id;
    		}
    		return null;
    	},
    	/**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	remove: function(id){
    	    this.logger.debug("Removing From Cache id: %s", id);
    	    if(this.find(id)){
    	        return (delete this.cache[id])?--this.size:-1; 
    	    }return null;
    	},
    	/**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
    	find: function(id){
    	    this.logger.debug("Searching Cache for id: %s", id);
    		return this.cache[id] || null;
    	}
    	
    });
	
})(  jQuery, Claypool );
