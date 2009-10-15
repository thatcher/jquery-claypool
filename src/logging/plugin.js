

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Log){
	/**
	 * @constructor
	 */
	$.extend($, {
	    logger  : function(name){
	        return $$Log.getLogger(name);
	    },
		//careful, names are very similiar!
        logging  : function(){
            if(arguments.length === 0){
                return $.config('logging');
            }else{
                $$Log.updated = true;
                return $.config('logging', arguments[0]);
            }
        }
	});
	
	var $log;
	
	$.extend($, {
	    debug  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.debug.apply($log,arguments);
	        return this;
	    },
	    info  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.info.apply($log,arguments);
	        return this;
	    },
	    warn  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.warn.apply($log,arguments);
	        return this;
	    },
	    error  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.error.apply($log,arguments);
	        return this;
	    },
	    exception  : function(){
	        $log = $log||$.logger("jQuery");
	        $log.exception.apply($log,arguments);
	        return this;
	    }
	});
	
	
})(  jQuery, Claypool, Claypool.Logging );
