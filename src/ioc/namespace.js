
Claypool.IoC={
/*
 * Claypool.IOC @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Inversion of Control (Dependency Injection) Patterns  -
 */
};

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
	
    $.manage("Claypool.IoC.Container", "claypool:IoC");
	/*$(document).bind("claypool:initialize", function(event, context){
		context['claypool:IoC'] = new $$IoC.Container();
		if(context.ContextContributor && $.isFunction(context.ContextContributor)){
			$.extend(context['claypool:IoC'], new context.ContextContributor());
			context['claypool:IoC'].registerContext("Claypool.IoC.Container");
		}
	}).bind("claypool:reinitialize", function(event, context){
		context['claypool:IoC'].factory.updateConfig();
	});*/

})(  jQuery, Claypool, Claypool.IoC );
