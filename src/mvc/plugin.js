

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
	/**
	 * @constructor
	 */
    var log;
    //TODO : what is the useful static plugin that could be derived from Claypool.MVC?
    //      router ?
	$.extend($, {
        //this defines the built-in low-level controllers. adding more is easy! 
        //For another example see claypool server
	    router : function(confId, options){
            $(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
                log = log||$.logger('Claypool.MVC.Plugins');
                log.debug('registering router plugin: %s', confId);
                registrationFunction.apply(_this, [
                    configuration, confId, "Claypool.MVC.HijaxController", options
                ]);
            });
            return this;
	    },
        mvc  : function(){
            var prop, config;
            if(arguments.length === 0){
                return $.config('mvc');
            }else{
                config = $.config('mvc');
                //because mvc routes are named arrays, the relavant
                //array is not merged.  we force the arrays to be merged
                //if the property already exists
                for(prop in arguments[0]){
                    if(prop in config){
                        $.merge(config[prop], arguments[0][prop]);
                    }else{
                        config[prop] = arguments[0][prop];
                    }
                }
                return this;//chain
            }
        }
	});
    
    $.routes = $.mvc;
	/*
     *   -   Model-View-Controller Patterns  -
     *
     *   Claypool MVC provides some low level built in controllers which a used to 
     *   route control to your controllers.  These Claypool provided controllers have a convenient
     *   configuration, though in general most controllers, views, and models should be
     *   configured using the general ioc configuration patterns and are simply referenced as targets.
     *
     *   The Claypool built-in controllers are:
     *       hijax:a - maps url patterns in hrefs to controllers.
     *           The href resource is resolved via ajax and the result is delivered to the specified
     *           controllers 'handle' method
     * 
     *       hijax:form - maps form submissions to controllers.
     *           The submittion is handled via ajax and the postback is delivered to the specified
     *           controllers 'handle' method
     *
     *       hijax:button - maps button (not submit buttons) to controllers.
     *           This is really useful for dialogs etc when 'cancel' is just a button but 'ok' is a submit.
     *
     *       hijax:event - maps custom or dom events to controllers.  
     */
	$.router( "hijax:a", {
        selector        : 'a',
        event           : 'click',
        strategy        : 'first',
        routerKeys      : 'urls',
        hijaxKey        : 'link',
        eventNamespace  : "Claypool:MVC:HijaxLinkController",
        target       : function(event){ 
            var link = event.target||event.currentTarget;
            while(link.tagName.toUpperCase()!='A'){
                link = $(link).parent()[0];
            }
            return $(link).attr("href");
        },
        normalize:  function(event){
            var link = event.target||event.currentTarget,
                data = {};
            while(link.tagName.toUpperCase()!='A'){
                link = $(link).parent()[0];
            }
            var href = $(link).attr("href");
            var params = href.split('?');
            
            params = params && params.length > 1 ? params[1] : '';
            //now walk the params and split on &, then on =
            $(params.split('&')).each(function(i, param){
                var name_value = param.split('='),
                    name = name_value[0],
                    value = name_value[1],
                    tmp;
                if(name in data){
                    if(!$.isArray(data[name])){
                        tmp = data[name];
                        data[name] = [tmp];
                    }
                    data[name].push(value);
                }else{
                    data[name] = value;
                }
            });
            return data;
        }
    }).router( "hijax:button",{
        selector        : ':button',
        event           : 'click',
        strategy        : 'all',
        routerKeys      : 'ids',
        hijaxKey        : 'button',
        eventNamespace  : "Claypool:MVC:HijaxButtonController",
        target       : function(event){ 
            return event.target.id;
        },
        normalize:  function(event){
            return {};
        }
    }).router( "hijax:input",{
        selector        : 'input',
        event           : 'blur|focus',
        strategy        : 'all',
        routerKeys      : 'ids',
        hijaxKey        : 'input',
        eventNamespace  : "Claypool:MVC:HijaxInputController",
        target       : function(event){ 
            return event.target.id;
        },
        normalize:  function(event){
            var params = {};
            params[event.target.name] = event.target.value;
            return params;
        }
    }).router( "hijax:form",{
        selector        : 'form',
        event           : 'submit',
        strategy        : 'first',
        routerKeys      : 'urls',
        hijaxKey        : 'form',
        eventNamespace  : "Claypool:MVC:HijaxFormController",
        target       : function(event){ 
            return event.target.action;
        },
        normalize:  function(event){
            var params = {},
                serialized = $(event.target).serializeArray();
            $(serialized).each(function(i,object){
                var tmp;
                if(object.name in params){
                    if(!$.isArray(params[object.name])){
                        tmp = params[object.name];
                        params[object.name] = [];
                    }
                    params[object.name].push(object.value);
                } else {
                    params[object.name] = object.value;
                }
            });
            return params;
        }
    }).router( "hijax:event",{
        strategy        : 'all',
        routerKeys      : 'event',
        hijaxKey        : 'event',
        eventNamespace  : "Claypool:MVC:HijaxEventController",
        target       : function(event){ 
            return event.type;
        },
        normalize:  function(event){
            return {};
        }
    });
    
    $.mvc_scanner = $$MVC.Factory.prototype;
	
})(  jQuery, Claypool, Claypool.MVC );
