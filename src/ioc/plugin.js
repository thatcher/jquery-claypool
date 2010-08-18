


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
            var scanPaths, ns;
            if(arguments.length === 0){
                return $.config('ioc');
            }else{
                scanPaths = [];
				if($.isPlainObject(arguments[0])){
					//namespaced application paths
					//eg { my: 'MyApp', abc: "OtherApp"}
					//or { my: 'MyApp', abc: ["OtherApp.Services", "OtherApp.Models"]}
					for(ns in arguments[0]){
						_scan(arguments[0][ns], ns);
					}
				}else if($.isArray(arguments[0])){
					//no namespace array of paths to scan
					_scan(arguments[0]);
				}else if(typeof arguments[0] == 'string'){
					//no namespace single path
					_scan(arguments[0]);
				}
				return $.config('ioc', scanPaths);
            }
			function _scan(path, namespace){
				var i;
				if($.isArray(path)){
					for(i = 0;i < path.length; i++){
	                    scanPaths.push({
	                        scan:path[i], 
							factory:$$.MVC.Factory.prototype,
							namespace: namespace?namespace:null
						}); 
				    }
				}else{
					scanPaths.push({
                        scan:path, 
						factory:$$.MVC.Factory.prototype,
						namespace: namespace?namespace:null
					});
				}
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
