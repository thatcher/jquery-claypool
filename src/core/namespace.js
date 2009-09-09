var Claypool={
/**
 * Claypool @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */
	Logging:{
	    //because we log in core we need a safe way to null logging
	    //if the real Claypool.Logging isnt present.  This is the safety.
	},
	extend : function(t, $class, args){
	    $class.apply(t,args||[]);
    }
};

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
    
    $$.Logging.NullLogger = function(){
        //for speed why bother implement the interface, just null the functions
        var nullFunction=function(){
            return this;
        };
        $.extend(this,  {
            debug:nullFunction,
            info:nullFunction,
            warn:nullFunction,
            error:nullFunction,
            exception:nullFunction
        });
        return this;
    };
    
    $.extend($$.Logging.NullLogger.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
	    getLogger	: function(){
	    	return new $$.Logging.NullLogger();
	    }
	});
	
	
})(jQuery, Claypool);
