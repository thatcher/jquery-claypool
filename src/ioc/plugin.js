


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
	$$.Namespaces = {};
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
					//eg $.scan({ my: 'MyApp', abc: "OtherApp"})
					//or $.scan({ my: 'MyApp', abc: ["OtherApp.Services", "OtherApp.Models"]})
					for(ns in arguments[0]){
						_scan(arguments[0][ns], ns);
					}
				}else if($.isArray(arguments[0])){
					//no namespace array of paths to scan
					// eg $.scan(['MyApp.Models, MyApp.Views']);
					_scan(arguments[0]);
				}else if(typeof arguments[0] == 'string'){
					//no namespace single path
					// eg $.scan('MyApp')
					_scan(arguments[0]);
				}
				return $.config('ioc', scanPaths);
            }
			function _scan(path, namespace){
				var i;
				namespace = namespace||'';
				if($.isArray(path)){
					if(! (namespace in $$.Namespaces)){
						$$.Namespaces[namespace] = path[0].split('.')[0];
					}
					for(i = 0;i < path.length; i++){
	                    scanPaths.push({
	                        scan:path[i], 
							factory:$$.MVC.Factory.prototype,
							namespace: namespace?namespace:null
						}); 
				    }
				}else{
					if(! (namespace in $$.Namespaces)){
						$$.Namespaces[namespace] = path;
					}
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
