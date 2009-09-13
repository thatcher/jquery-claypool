


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){

	/**
	 * @constructor
	 */
    $.extend($, {
        scan  : function(){
            var scanPaths,
			    i;
            if(arguments.length === 0){
                return $.config('ioc');
            }else{
                scanPaths = [];
                for(i = 0;i<arguments[0].length;i++){
                    scanPaths.push({
                        scan:arguments[0][i], 
						factory:$$.MVC.Factory.prototype
					}); 
			    }
				return $.config('ioc', scanPaths);
				 
            }
        },
		invert: function(){
            if(arguments.length === 0){
                return $.config('ioc');
            }else{
                return $.config('ioc', arguments[0]);
            }
        }
    });
	
})(  jQuery, Claypool, Claypool.IoC );
