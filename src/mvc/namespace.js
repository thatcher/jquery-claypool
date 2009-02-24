Claypool.MVC = {
/*
 * Claypool.MVC @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Model-View-Controller Patterns  -
 *
 *   Claypool MVC provides some low level built in controllers which a used to 
 *   route control to your controllers.  These Claypool provided controllers have a convenient
 *   configuration, though in general most controllers, views, and models should be
 *   configured using the general ioc configuration patterns and are simply referenced as targets.
 *
 *   The Claypool built-in controllers are:
 *       Claypool.MVC.HijaxLinkController - maps url patterns in hrefs to custom controllers.
 *           The href resource is resolved via ajax and the result is delivered to the specified
 *           controllers 'handle' method
 * 
 *       Claypool.MVC.HijaxFormController - maps form submissions to custom controllers.
 *           The submittion is handled via ajax and the postback is delivered to the specified
 *           controllers 'handle' method
 *
 *       Claypool.MVC.HijaxButtonController - maps button (not submit buttons) to custom controllers.
 *           This is really useful for dialogs etc when 'cancel' is just a button but 'ok' is a submit.
 *
 *       Claypool.MVC.HijaxEventController - maps events to custom controllers.  This would normally
 *           be browser events based on the dom, but with providers like jQuery the eventing
 *           is much richer.  By default the event system is provided by jquery.
 *
 */
};

(function($, $Log, $$MVC){
    $.manage("Claypool.MVC.Container", "claypool:MVC");
    /*$(document).bind("claypool:initialize", function(event, context){
        context['claypool:MVC'] = new $$MVC.Container();
        if(context.ContextContributor && $.isFunction(context.ContextContributor)){
            $.extend(context['claypool:MVC'], new context.ContextContributor());
            context['claypool:MVC'].registerContext("Claypool.MVC.Container");
        }
    }).bind("claypool:reinitialize", function(event, context){
        context['claypool:MVC'].factory.updateConfig();
    });*/
    
    /*$(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
        registrationFunction.apply(_this, [configuration, "hijax:a", "Claypool.MVC.HijaxController", {
            selector:       'a',
            event:          'click',
            strategy:       'first',
            routerKeys:     'urls',
            hijaxKey:       'link',
            eventNamespace: "Claypool:MVC:HijaxLinkController",
            getTarget:     function(event){ 
                var link = event.target||event.currentTarget;
                while(link.tagName.toUpperCase()!='A'){
                    link = jQuery(link).parent()[0];
                }
                return jQuery(link).attr("href");
            }
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:button",  "Claypool.MVC.HijaxController", {
            selector:       ':button',
            event:          'click',
            strategy:       'all',
            routerKeys:     'urls',
            hijaxKey:       'button',
            eventNamespace: "Claypool:MVC:HijaxButtonController",
            getTarget:     function(event){ 
                return event.target.value;
            }
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:input",  "Claypool.MVC.HijaxController", {
            selector:       'input',
            event:          'click',
            strategy:       'all',
            routerKeys:     'urls',
            hijaxKey:       'button',
            eventNamespace: "Claypool:MVC:HijaxInputController",
            getTarget:     function(event){ 
                return event.target.name;
            }
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:form",    "Claypool.MVC.HijaxController", {
            selector:       'form',
            event:          'submit',
            strategy:       'first',
            routerKeys:     'urls',
            hijaxKey:       'form',
            eventNamespace: "Claypool:MVC:HijaxFormController",
            getTarget:     function(event){ 
                return event.target.action;
            }
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:event",   "Claypool.MVC.HijaxController", {
            strategy:       'all',
            routerKeys:     'event',
            hijaxKey:       'event',
            eventNamespace: "Claypool:MVC:HijaxEventController",
            getTarget:     function(event){ 
                return event.type;
            }
        }]);
    });*/
        
})(  jQuery, Claypool, Claypool.MVC );
