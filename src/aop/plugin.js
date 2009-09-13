

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $AOP){
	/**
	 * @constructor
	 */
	$.extend($, {
	    filters  : function(){
            if(arguments.length === 0){
                return $.config('aop');
            }else{
                return $.config('aop', arguments[0]);
            }
	    }
	});
	
	
})(  jQuery, Claypool, Claypool.AOP );
