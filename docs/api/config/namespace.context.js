API = {
/*
 * Claypool @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-09-08 08:17:31 -0400 (Mon, 08 Sep 2008) $
 * $Rev: 269 $
 *
 *   NAMESPACE DECLARATIONS   -
 *  	It's good form to go ahead and declare the additional namespaces you might be using
 * 	 	here.  We define just a couple standards.  Additional nested namespaces are very 
 *  	useful for isolating application log message based on the categories defined by
 *  	the namespace.
 *
 */
};
(function($, $Api){
	$.extend(true, $Api, {
    	Models:{},
    	Views:{},
    	Controllers:{},
	});
})(jQuery, API);
