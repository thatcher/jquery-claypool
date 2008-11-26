Claypool.MVC={
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
(function($, $Log, $IoC, $MVC){
	
	jQuery(document).bind("claypool:initialize", function(event, context){
		context['claypool:MVC'] = new $MVC.Container();
		if(context.ContextContributor && $.isFunction(context.ContextContributor)){
			$.extend(context['claypool:MVC'], new context.ContextContributor());
			context['claypool:MVC'].registerContext("Claypool.MVC.Container");
		}
	}).bind("claypool:reinitialize", function(event, context){
		context['claypool:MVC'].factory.updateConfig();
	});
	
	$.extend( $MVC, {
	    Container$Class:{
	        factory:null,
	        constructor: function(options){
	            $.extend( this, new $.ContextContributor(options));
	            $.extend( this, $MVC.Container$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.MVC.Container");
	            this.logger.debug("Configuring Claypool MVC Container");
	            //Register first so any changes to the container managed objects 
	            //are immediately accessible to the rest of the application aware
	            //components
	            this.factory = new $MVC.Factory();
	            this.factory.updateConfig();
	            //create global contollors non-lazily
	            var controller;
	            var controllerId;
	            for(controllerId in this.factory.cache){
	                //will trigger the controllerFactory to instantiate the controllers
	                controller = this.get(controllerId);
	                //activates the controller
	                this.logger.debug("attaching mvc core controller: %s", controllerId);
	                controller.attach();
	            }
	            return this;
	        },
	        get: function(id){
	            var controller;
	            try{
	                this.logger.debug("Search for a container managed controller : %s", id);
	                controller = this.find(id);
	                if(controller===undefined||controller===null){
	                    this.logger.debug("Can't find a container managed controller : %s", id);
	                    controller = this.factory.create(id);
	                    if(controller !== null){
	                        this.add(id, controller);
	                        return controller._this;
	                    }
	                }else{ 
	                    this.logger.debug("Found container managed controller : %s", id);
	                    return controller._this;
	                }
	            }catch(e){
	                this.logger.exception(e);
	                throw new $MVC.ContainerError();
	            }
	            throw new $MVC.FactoryError(id);
	        }
	    },
	    Factory$Class:{
	        configurationId:'mvc',
	        constructor: function(options){
	            $.extend( this, new $IoC.Factory(options));
	            $.extend( this, $MVC.Factory$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.MVC.Factory");
	        },
	        updateConfig: function(){
	            var mvcConfig;
	            try{
	                this.logger.debug("Configuring Claypool MVC Controller Factory");
	                mvcConfig = this.getConfig()||{};//returns mvc specific configs
	                //Extension point for custom low-level hijax controllers
	                jQuery(document).trigger("claypool:hijax", [this, this.initializeHijaxController, mvcConfig]);
	            }catch(e){
	                this.logger.exception(e);
	                throw new $MVC.ConfigurationError(e);
	            }
	        },
	        /**@private*/
	        initializeHijaxController: function(mvcConfig, key, clazz, options){
	            var configuration;
	            var i;
	            if(mvcConfig[key]){
	                for(i=0;i<mvcConfig[key].length;i++){
	                    configuration = {};
	                    configuration.id = mvcConfig[key][i].id;
	                    configuration.clazz = clazz;
	                    configuration.options = [ $.extend(true,mvcConfig[key][i], options||{}) ];
	                    this.logger.debug("Adding MVC Configuration for Controller Id: %s", configuration.id);
	                    this.add( configuration.id, configuration );
	                }
	            }
	        }
	    },
	    //Basic MVC interfaces
	    /**
	    *   In Claypool a controller is meant to be a wrapper for a generally 'atomic'
	    *   unit of business logic.  
	    */
	    Controller$Abstract:{ 
	        model:null,
	        view:null,
	        constructor: function(options){
	            $.extend( this, new $.SimpleCachingStrategy(options));
	            $.extend( this, $MVC.Controller$Abstract);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.MVC.Controller");
	        },
	        handle: function(event){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    /**
	    *   The hijax 'or' routing controller implements the handle and resolve methods and provides
	    *   a new abstract method 'strategy' which should be a function that return 
	    *   a list, possibly empty of controller names to forward the data to.  In general
	    *   the strategy can be used to create low level filtering controllers, broadcasting controllers
	    *   pattern matching controllers (which may be first match or all matches), etc
	    */
	    HijaxController$Abstract:{
	        constructor: function(options){
	            $.extend( this, new $MVC.Controller(options));
	            $.extend( this, $MVC.HijaxController$Abstract);
	            $.extend(true, this, {/*defaults*/
	                forwardingList:[],
	                selector:"",
	                filter:"",
	                active:true,
	                preventDefault:true,
	                stopPropagation:true,
	                hijaxMap:[],
	                resolveQueue:[],//TODO
	                strategy:null//must be provided by implementing class
	            },  options );
	            this.router = new $.Router();
	            this.bindCache = new $.SimpleCachingStrategy();
	            this.logger = $Log.getLogger("Claypool.MVC.HijaxController");
	        },
	        handle: function(data){
	            //Apply the strategy
	            this.logger.debug("Handling pattern: %s", data.pattern);
	            this.forwardingList = this.router[this.strategy||"all"]( data.pattern );
	            this.logger.debug("Resolving matched paterns");
	            var target, action, resolver, defaultView;
	            var resolvedResponses = [];
	            var _this = this;
	            return jQuery(this.forwardingList).each(function(){
	            	//the event is the first arg, we are going to force the second arg to always
	            	//be 'mvc' and the tack back on the original extra args.
	            	var _event = data.args[0];
	            	var mvc;
	            	var extra = [];
	            	for(var i = 1; i < data.args.length; i++){extra[i-1]=data.args[i];}
	                try{
	                    _this.logger.info("Forwaring to registered controller %s", this.payload.controller);
	                    target = $.$(this.payload.controller);
	                    //the default view for 'fooController' or 'fooService' is 'fooView' otherwise the writer
	                    //is required to provide it before a mvc flow can be resolved.
	                    defaultView = this.payload.controller.match('Controller') ?
	                    	this.payload.controller.replace('Controller', 'View') : null;
	                    defaultView = this.payload.controller.match('Service') ?
	                    	this.payload.controller.replace('Service', 'View') : defaultView;
	                    mvc = {
	                        m:{},
	                        v:defaultView,
	                        c:target,
	                        resolve:_this.makeResolver(_event)
		                };
		                //tack back on the extra event arguments
	                    target[this.payload.action||"handle"].apply(target, [ _event, mvc ].concat(extra) );
	                }catch(e){
	                    e = e?e:new Error();
	                    if(e.name&&e.name.indexOf("Claypool.Application.ContextError")>-1){
	                        _this.logger.warn("No controller with id: %s", this.payload.controller);
	                    }else{  /**propogate unknown errors*/
	                        _this.logger.exception(e); throw e;
	                    }
	                }
	            });
	        },
	        attach: function(){
	            this.router.compile(this.hijaxMap, this.routerKeys);//, "controller", "action");
	            var _this = this;
	            if(this.active&&(this.selector!==""||this.filter!=="")){
	                this.logger.debug("Actively Hijaxing %s's.", this.hijaxKey);
	                jQuery(this.selector+this.filter).livequery(function(){
	                    _this.hijax(this);
	                });
	            }else if (this.selector!==""||this.filter!==""){
	                this.logger.debug("Hijaxing Current %s's.", this.hijaxKey);
	                jQuery(this.selector+this.filter).each(function(){
	                    _this.hijax(this);
	                });
	            }else if(document!==undefined){
	                this.logger.debug("Hijaxing Document For %s's.", this.hijaxKey);
	                _this.hijax(document);
	            }else{this.logger.warn("Unable to attach controller: %s", options.id);}
	        },
	        hijax: function(target){
	            this.logger.debug("Hijaxing %s: %s", this.hijaxKey, target);
	            var _this = this;
	            var _hijax = function(event){
	                //var retVal = true;
	                _this.logger.info("Hijaxing %s: ", _this.hijaxKey);
	                if(_this.stopPropagation){
	                    _this.logger.debug("Stopping propogation of event");
	                    event.stopPropagation();
	                }
	                if(_this.preventDefault){
	                    _this.logger.debug("Preventing default event behaviour");
	                    event.preventDefault();
	                    //retVal = false;
	                }
	                _this.handle({pattern: _this.getTarget.apply(_this, arguments), args:arguments});
	                //return retVal;
	            };
	            if(this.event){
	                /**This is a specific event hijax so we bind once and dont think twice  */
	                jQuery(target).bind(this.event+"."+this.eventNamespace, _hijax);
	                _this.logger.debug("Binding event %s to hijax controller on target", this.event, target);
	            }else{     
	                /**
	                *   This is a '(m)any' event hijax so we need to bind based on each routed endpoints event.
	                *   Only bind to the event once (if its a custom event) as we will progagate the event
	                *   to each matching registration, but dont want this low level handler invoked more than once.
	                */
	                jQuery(this.hijaxMap).each(function(){
	                    if(this.event&&!_this.bindCache.find(this.event)){
	                        _this.bindCache.add(this.event, _this);
	                        _this.logger.debug("Binding event %s to controller %s on target %s",
	                            this.event, this.controller ,target);
	                        jQuery(target).bind(this.event+"."+_this.eventNamespace,_hijax);
	                    }
	                });
	            }   
	            return true;
	        },
	        //provides a continuation for the mvc flow to allow room for asynch dao's and the like
	        makeResolver: function(event){
	            var _this = this;
	            var callbackStack = [];
	            var forwardedEvent = event;
	            return function(eventOrCallback){
	                var mvc = this;
	                var target;
	                var controller;
	                var action;
	                var view, viewMethod;
	                var guidedEventRegistration;
	                /**
	                *   event might be propogated if control is being forwarded, otherwise callback (optional)
	                *   callbacks are saved until any forwarding is completed and then executed sequentially 
	                *   by popping off the top (so in reverse of the order they where added)
	                */
	                if(eventOrCallback&&$.isFunction(eventOrCallback)){
	                    callbackStack.push(eventOrCallback);
	                }else{
	                    forwardedEvent  = eventOrCallback?eventOrCallback:forwardedEvent;
	                }
	                if(mvc.m===null){
	                    _this.logger.debug("No Model passed to MVC Resolver");
	                    mvc.m = {};
	                }
	                if(mvc.m&&mvc.v&&mvc.c){
	                    _this.logger.debug(" - Resolving Control - \n\tmvc:(\n\t\tm:%s,\n\t\tv:%s,\n\t\tc:%s)",mvc.m, mvc.v, mvc.c);
	                    try{
	                        if(mvc.v.indexOf("forward://")===0){
	                            //expects "forward://target{/action}"
	                            target = mvc.v.replace("forward://","").split("/");
	                            action = (target.length>0&&target[1].length>0)?target[1]:"handle";
	                            controller = _this.find(target[0]);
	                            if(controller === null){
	                                controller = $.$(target[0]);
	                                //cache it for speed on later use
	                                _this.add(target[0], controller);
	                            }
	                            controller[action](forwardedEvent, mvc);
	                        }else {
	                        	//a view can specifiy a method other than the default 'update'
	                        	//by providing a '.name' on the view
	                        	view = mvc.v;
	                        	//If a writer is provided, the default view method is 'render'
	                        	viewMethod = mvc.w?"render":"update";
	                        	if(mvc.v.indexOf(".") > -1){
	                        		viewMethod = mvc.v.split('.');
	                        		view = viewMethod[0];
	                        		//always use the last so we can additively use the mvc resolver in closures
	                        		viewMethod = viewMethod[viewMethod.length-1];
	                        	}
	                        	_this.logger.debug("Calling View %s.%s", view, viewMethod);
	                            view = $.$(view);
	                            if(view){
	                                if($.isFunction(view[viewMethod])){
	                                    _this.logger.debug("Updating view %s, intended? %s, model? %o, writer? %o", 
	                                        mvc.v, viewMethod, mvc.m, mvc.w);
	                                    //if a 'writer' is provided the view is called with both args
	                                    if(mvc.w){view[viewMethod](mvc.m, mvc.w);}else{view[viewMethod](mvc.m);}
	                                    _this.logger.debug("Cascading callbacks");
	                                    while(callbackStack.length > 0){ (callbackStack.pop())(); }
	                                }else if (view["@claypool:activeobject"]){
	                                	//some times a view is removed and reattached.  such 'active' views
	                                	//are bound to the post create lifecycle event so they can resolve 
	                                	//as soon as possible
	                                    guidedEventRegistration = "claypool:postcreate:"+view["@claypool:id"]+"."+$.createGUID();
	                                    jQuery(document).bind(guidedEventRegistration,function(event, newView){
	                                        _this.logger.warn("The view is reattached to the dom.");
	                                        //unbind handler
	                                        jQuery(document).unbind(guidedEventRegistration);
	                                        newView.update(mvc.m);
	                                        _this.logger.debug("Cascading callbacks");
	                                        while(callbackStack.length > 0){ (callbackStack.pop())(); }
	                                    });
	                                }else{
	                                	_this.logger.debug("View method cannot be resolve", viewMethod);
	                                }
	                            }else{
	                                _this.logger.warn("Cant resolve view %s. ", mvc.v);
	                            }
	                        }
	                    }catch(e){
	                        _this.logger.exception(e);
	                        throw e;
	                    }
	                }else{
	                    _this.logger.error("Can't resolve mvc flow:  \n\tmvc:(\n\t\tm:%s,\n\t\tv:%s,\n\t\tc:%s)", mvc.m, mvc.v, mvc.c);
	                }
	            };
	        },
	        /**returns some part of the event to use in router, eg event.type*/
	        getTarget: function(event){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    View$Interface:{
	        update: function(model){//refresh screen display logic
	            throw new $.MethodNotImplementedError();
	        },
	        think: function(){//display activity occuring, maybe block
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    
	    /**@exception*/
	    ContainerError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.Error(e, {
	                name:"Claypool.MVC.ContainerError",
	                message: "An error occurred trying to retreive a container managed object."
	            }));
	        }
	    },
	    /**@exception*/
	    FactoryError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.Error(e, {
	                name:"Claypool.MVC.FactoryError",
	                message: "An error occured trying to create the factory object."
	            }));
	        }
	    },
	    /**@exception*/
	    ConfigurationError$Class:{
	        constructor: function(e){
	            $.extend( this, new $.ConfigurationError(e, {
	                name:"Claypool.MVC.ConfigurationError",
	                message: "An error occured during the configuration."
	            }));
	        }
	    }
	});
	/**@constructorAlias*/
	$MVC.Container                      = $MVC.Container$Class.constructor;
	/**@constructorAlias*/
	$MVC.Factory              = $MVC.Factory$Class.constructor;
	/**@constructorAlias*/
	$MVC.Controller             = $MVC.Controller$Abstract.constructor;
	/**@constructorAlias*/
	$MVC.HijaxController        = $MVC.HijaxController$Abstract.constructor;
	
	
	//Exception Classes
	/**@constructorAlias*/
	$MVC.ContainerError                 = $MVC.ContainerError$Class.constructor;
	/**@constructorAlias*/
	$MVC.FactoryError          			= $MVC.FactoryError$Class.constructor;
	/**@constructorAlias*/
	$MVC.ConfigurationError             = $MVC.ConfigurationError$Class.constructor;

	//this defines the built-in low-level controllers. adding more is easy! just register for the
	//event and use this as an example template.
	//For another example see claypool server
	jQuery(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
		registrationFunction.apply(_this, [configuration, "hijax:a",       "Claypool.MVC.HijaxController", {
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
            getTarget:     function(event){ return event.target.value;}
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:input",  "Claypool.MVC.HijaxController", {
            selector:       'input',
            event:          'click',
            strategy:       'all',
            routerKeys:     'urls',
            hijaxKey:       'button',
            eventNamespace: "Claypool:MVC:HijaxInputController",
            getTarget:     function(event){ return event.target.name;}
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:form",    "Claypool.MVC.HijaxController", {
            selector:       'form',
            event:          'submit',
            strategy:       'first',
            routerKeys:     'urls',
            hijaxKey:       'form',
            eventNamespace: "Claypool:MVC:HijaxFormController",
            getTarget:     function(event){ return event.target.action;}
        }]);
        registrationFunction.apply(_this, [configuration, "hijax:event",   "Claypool.MVC.HijaxController", {
            strategy:       'all',
            routerKeys:     'event',
            hijaxKey:       'event',
            eventNamespace: "Claypool:MVC:HijaxEventController",
            getTarget:     function(event){ return event.type;}
        }]);
	});
})( Claypool, /*Required Modules*/
	Claypool.Logging, 
	Claypool.IoC, 
	Claypool.MVC );


Claypool.Models = {};
Claypool.Views = {};
Claypool.Controllers = {};
//Give a little bit, Give a little bit of our mvc to you. ;)
(function($){ 
	$.MVC 			= Claypool.MVC;
	$.Models 		= Claypool.Models;
	$.Views 		= Claypool.Views;
	$.Controllers 	= Claypool.Controllers;
})(jQuery);

