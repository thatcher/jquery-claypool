
Claypool.AOP={
/*
 * Claypool.AOP @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 * @projectDescription 	This code is adopted from the jQuery AOP plugin project.  It was incorporated so it
 * 						could be extended and modified to match the overall javascript style of the rest of
 * 						Claypool. Many thanks to it's author(s), as we rely heavily on the code and learned
 * 						a lot from it's integration into Claypool.
 *
 * @author	Christopher Thatcher thatcher.christopher@gmail.com
 * @version	0.1 
 * 
 * The original header is retained below:
 * 
 * 		jQuery AOP - jQuery plugin to add features of aspect-oriented programming (AOP) to jQuery.
 * 		http://jquery-aop.googlecode.com/
 *
 * 		Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 * 		Version: 1.0
 */
};
(function($, $$, $$AOP){
    
    $.manage("Claypool.AOP.Container", "claypool:AOP");
    /*$(document).bind("claypool:initialize", function(event, context){
        context['claypool:AOP'] = new $$AOP.Container();
        if(context.ContextContributor && $.isFunction(context.ContextContributor)){
            $.extend(context['claypool:AOP'], new context.ContextContributor());
            context['claypool:AOP'].registerContext("Claypool.AOP.Container");
        }
    }).bind("claypool:reinitialize", function(event, context){
        context['claypool:AOP'].factory.updateConfig();
    });*/
    
    
})(  jQuery, Claypool, Claypool.AOP );
