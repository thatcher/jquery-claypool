Claypool.MVC = {
/*
 * Claypool.MVC @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 */
};

(function($){
    
    $.manage("Claypool.MVC.Container", "claypool:MVC");
    
})(  jQuery);


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
    $$MVC.View$Interface = {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        update: function(model){//refresh screen display logic
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        think: function(){//display activity occuring, maybe block
            throw new $$.MethodNotImplementedError();
        }
    };
	
})(  jQuery, Claypool, Claypool.MVC );

/**
 * In Claypool a controller is meant to be a wrapper for a generally 'atomic'
 * unit of business logic. 
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
	/**
	 * @constructor
	 */
	$$MVC.Controller = function(options){
        this.model  = null;
        this.view   = null;
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.MVC.Controller");
    };
    $.extend($$MVC.Controller.prototype,
        $$.SimpleCachingStrategy.prototype,{
        handle: function(event){
            throw new $$.MethodNotImplementedError();
        }
    });
	
})(  jQuery, Claypool, Claypool.MVC );

/**
 *  The hijax 'or' routing controller implements the handle and resolve methods and provides
 *   a new abstract method 'strategy' which should be a function that return 
 *   a list, possibly empty of controller names to forward the data to.  In general
 *   the strategy can be used to create low level filtering controllers, broadcasting controllers
 *   pattern matching controllers (which may be first match or all matches), etc
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
    /**
     * @constructor
     */
    $$MVC.HijaxController = function(options){
		$$.extend(this, $$MVC.Controller);
        /*defaults*/
        $.extend(true, this, {
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
        this.router = new $$.Router();
        this.bindCache = new $$.SimpleCachingStrategy();
        this.logger = $.logger("Claypool.MVC.HijaxController");
    };
    
    $.extend($$MVC.HijaxController.prototype, 
            $$MVC.Controller.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handle: function(data){
            //Apply the strategy
            this.logger.debug("Handling pattern: %s", data.pattern);
            this.forwardingList = this.router[this.strategy||"all"]( data.pattern );
            this.logger.debug("Resolving matched paterns");
            var _this = this;
            return jQuery(this.forwardingList).each(function(){
                var target, 
                    action, 
                    defaultView;
                try{
                    _this.logger.info("Forwaring to registered controller %s", this.payload.controller);
                    target = $.$(this.payload.controller);
                    //the default view for 'fooController' or 'fooService' is 'fooView' otherwise the writer
                    //is required to provide it before a mvc flow can be resolved.
                    defaultView = this.payload.controller.match('Controller') ?
                        this.payload.controller.replace('Controller', 'View') : null;
                    defaultView = this.payload.controller.match('Service') ?
                        this.payload.controller.replace('Service', 'View') : defaultView;
                    (function(t){
                        var  _event = data.args[0],//the event is the first arg, 
                            extra = [],//and then tack back on the original extra args.
                            m = {flash:[], length:0},//each in flash should be {id:"", msg:""}
                            v = defaultView,
                            c = target;
                        for(var i = 1; i < data.args.length; i++){extra[i-1]=data.args[i];}
                        var eventflow = $.extend( {}, _event, {
                           m: function(){
                               if(arguments.length === 0){
                                   return m;
                               }else if(arguments.length === 1){
                                   if(typeof(arguments[0]) == 'string'){
                                       return m[arguments[0]];
                                   }else if(arguments[0] instanceof Array){
                                       m.length += arguments[0].length;
                                       Array.prototype.push.apply(m,arguments[0]);
                                   }else if(arguments[0] instanceof Object){
                                       $.extend(true, m, arguments[0]);
                                   }
                               }else if(arguments.length === 2){
                                   if(arguments[1] instanceof Array){
                                       if(typeof(arguments[0]) == 'string' && !(arguments[0] in  m)){
                                           m[arguments[0]] = [];
                                       }
                                       $.merge(m[arguments[0]], arguments[1]);
                                   }else if(arguments[1] instanceof XML || arguments[1] instanceof XMLList){
                                       m[arguments[0]] = arguments[1];
                                   }else if(arguments[1] instanceof Object){
                                       if(typeof(arguments[0]) == 'string' && !(arguments[0] in  m)){
                                           m[arguments[0]] = {};
                                       }
                                       $.extend(true, m[arguments[0]], arguments[1]);
                                   }
                               }
                               return this;//chain
                           },
                           v: function(view){
                               if(!view){
                                   return v;
                               }
                               if(view && typeof(view)=='string'){
                                   view = view.split('.');
                                   if(view.length === 1){
                                       v = view;
                                   }else if(view.length === 2){
                                       if(view[0] !== ""){
                                           v = view.join('.');
                                       }else{
                                           v = v.split('.')[0]+"."+view[1];
                                       }
                                   }
                               }
                               return this;//chain
                           },
                           c : function(){
                               var target, action, controller;
                               if(arguments.length === 0){
                                   return c;
                               }else if(arguments.length > 0 && typeof(arguments[0] == "string")){
                                    //expects "target{.action}"
                                    target = arguments[0].split(".");
                                    c = target[0];
                                    v  = c.match('Controller') ? c.replace('Controller', 'View') : null;
                                    v  = c.match('Service') ? c.replace('Service', 'View') : v;
                                    action = (target.length>1&&target[1].length>0)?target[1]:"handle";
                                    controller = _this.find(target[0]);
                                    if(controller === null){
                                        controller = $.$(target[0]);
                                        //cache it for speed on later use
                                        _this.add(target[0], controller);
                                    }
                                    controller[action||"handle"].apply(controller,  [this].concat(extra) );
                               }
                               return this;//chain
                           },
                           render:_this.renderer(),
                           reset:function(){
                               m = {flash:[], length:0};//each in flash should be {id:"", msg:""}
                               v = defaultView;
                               c = target;
                               return this;//chain
                           },
						   params: function(param){
						   	   if (arguments.length === 0) {
							   	return t.map ? t.map : {};
							   }
							   else {
							   	return t.map && t.map[param] ? t.map[param] : null;
							   }
						   }
                        });
                        //tack back on the extra event arguments
                        target[t.payload.action||"handle"].apply(target,  [eventflow ].concat(extra) );
                    })(this);
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
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        attach: function(){
            this.router.compile(this.hijaxMap, this.routerKeys);//, "controller", "action");
            var _this = this;
            if(this.active&&(this.selector!==""||this.filter!=="")){
                this.logger.debug("Actively Hijaxing %s's %s%s", this.hijaxKey, this.selector, this.filter);
                $(this.selector+this.filter).livequery(function(){
                    _this.hijax(this);
                });
            }else if (this.selector!==""||this.filter!==""){
                this.logger.debug("Hijaxing Current %s's.", this.hijaxKey);
                $(this.selector+this.filter).each(function(){
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
                var retVal = true;
                _this.logger.info("Hijaxing %s: ", _this.hijaxKey);
                if(_this.stopPropagation){
                    _this.logger.debug("Stopping propogation of event");
                    event.stopPropagation();
                }
                if(_this.preventDefault){
                    _this.logger.debug("Preventing default event behaviour");
                    event.preventDefault();
                    retVal = false;
                }
                _this.handle({pattern: _this.target.apply(_this, arguments), args:arguments});
                return retVal;
            };
            if(this.event){
                $(this.event.split('|')).each(function(){
                    /**This is a specific event hijax so we bind once and dont think twice  */
                    $(target).bind(this+"."+_this.eventNamespace, _hijax);
                    _this.logger.debug("Binding event %s to hijax controller on target", this, target);
                    
                });
            }else{     
                /**
                *   This is a '(m)any' event hijax so we need to bind based on each routed endpoints event.
                *   Only bind to the event once (if its a custom event) as we will progagate the event
                *   to each matching registration, but dont want this low level handler invoked more than once.
                */
                $(this.hijaxMap).each(function(){
                    if(this.event&&!_this.bindCache.find(this.event)){
                        _this.bindCache.add(this.event, _this);
                        _this.logger.debug("Binding event %s to controller %s on target %s",
                            this.event, this.controller ,target);
                        $(target).bind(this.event+"."+_this.eventNamespace,_hijax);
                    }
                });
            }   
            return true;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        //provides a continuation for the mvc flow to allow room for asynch dao's and the like
        renderer: function(){
            var _this = this;
            var callbackStack = [];
            return function(callback){
                var target,
                    controller,
                    action,
                    view, 
                    viewMethod,
                    guidedEventRegistration;
                /**
                *   callbacks are saved until any forwarding is completed and then executed sequentially 
                *   by popping off the top (so in reverse of the order they where added)
                */
                if(callback&&$.isFunction(callback)){
                    callbackStack.push(callback);
                }
                _this.logger.debug(" - Resolving Control - %s)", this.c());
                try{
                    //a view can specifiy a method other than the default 'update'
                    //by providing a '.name' on the view
                    view = this.v();
                    //If a writer is provided, the default view method is 'render'
                    viewMethod = $.isFunction(this.write)?"render":"update";
                    if(view.indexOf(".") > -1){
                        viewMethod = view.split('.');
                        view = viewMethod[0];
                        //always use the last so we can additively use the mvc v value in closures
                        viewMethod = viewMethod[viewMethod.length-1];
                    }
                    _this.logger.debug("Calling View %s.%s", view, viewMethod);
                    view = $.$(view);
                    if(view){
                        if($.isFunction(view[viewMethod])){
                            //if a 'writer' is provided the view is called with both args
                            if(this.write){
                                view.write = this.write;
                                view.append = this.append;
                                view[viewMethod](this.m());
                            }else{
                                view[viewMethod](this.m());
                            }
                            _this.logger.debug("Cascading callbacks");
                            while(callbackStack.length > 0){ (callbackStack.pop())(); }
                        }else if (view["@claypool:activeobject"]){
                            //some times a view is removed and reattached.  such 'active' views
                            //are bound to the post create lifecycle event so they can resolve 
                            //as soon as possible
                            guidedEventRegistration = "claypool:postcreate:"+view["@claypool:id"]+"."+$.guid();
                            $(document).bind(guidedEventRegistration,function(event, newView){
                                _this.logger.warn("The view is reattached to the dom.");
                                //unbind handler
                                $(document).unbind(guidedEventRegistration);
                                newView.update(this.m());
                                _this.logger.debug("Cascading callbacks");
                                while(callbackStack.length > 0){ (callbackStack.pop())(); }
                            });
                        }else{
                            _this.logger.debug("View method cannot be resolve", viewMethod);
                        }
                    }else{
                        _this.logger.warn("Cant resolve view %s. ", this.v());
                    }
                }catch(e){
                    _this.logger.error("Error resolving flow %s => %s", this.c(), this.v()).
                        exception(e);
                    throw e;
                }
                return this;//chain
            };
        },
        /**returns some part of the event to use in router, eg event.type*/
        target: function(event){
            throw new $$.MethodNotImplementedError();
        }
    });
    
})(  jQuery, Claypool, Claypool.MVC );


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
    $$MVC.Factory = function(options){
        $$.extend(this, $$.IoC.Factory);
        $.extend(true, this, options);
        this.configurationId = 'mvc';
        this.logger = $.logger("Claypool.MVC.Factory");
    };
    
    $.extend($$MVC.Factory.prototype,
        $$.IoC.Factory.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(){
            var mvcConfig;
            try{
                this.logger.debug("Configuring Claypool MVC Controller Factory");
                mvcConfig = this.getConfig()||{};//returns mvc specific configs
                //Extension point for custom low-level hijax controllers
                $(document).trigger("claypool:hijax", [this, this.initializeHijaxController, mvcConfig]);
            }catch(e){
                this.logger.exception(e);
                throw new $$MVC.ConfigurationError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        scan: function(name){
            var log = this.logger||$.logger("Claypool.MVC.Factory");
            log.debug("Scanning %s" , name);
            var prop, 
                scanBase, 
                configsByConvention = [],
                idNamingConvention = function(localName, type){
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1)+type);
                },
                domNamingConvention = function(localName){
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1));
                };
            try{
                scanBase = $.resolve(name);
                for(prop in scanBase){
                    log.debug("Scan Checking %s.%s" , name, prop);
                    if($.isFunction(scanBase[prop])){
                        log.debug("Found Function Definition on %s.%s" , name, prop);
                        if(name.match(".Models")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Model"),
                               clazz: name+"."+prop
                            });
                        }else if(name.match(".Views")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "View"),
                               clazz: name+"."+prop,
                               selector: domNamingConvention(prop)
                            });
                        }else if(name.match(".Controllers")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Controller"),
                               clazz: name+"."+prop
                            });
                        }else if(name.match(".Services")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Service"),
                               clazz: name+"."+prop
                            });
                        }
                    }  
                }
            }catch(e){
                log.error("Error Scanning %s!!", name).exception(e);   
            }
            return configsByConvention;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        initializeHijaxController: function(mvcConfig, key, clazz, options){
            var configuration;
            var i;
            if(mvcConfig[key]){
                for(i=0;i<mvcConfig[key].length;i++){
                    configuration = {};
                    configuration.id = mvcConfig[key][i].id;
                    configuration.clazz = clazz;
                    configuration.options = [ $.extend(true, {}, options, mvcConfig[key][i]) ];
                    this.logger.debug("Adding MVC Configuration for Controller Id: %s", configuration.id);
                    this.add( configuration.id, configuration );
                }
            }
        }
    });
    
})(  jQuery, Claypool, Claypool.MVC );


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
    $$MVC.Container = function(options){
        $$.extend(this, $$.Application.ContextContributor);
        $.extend(true, this, options);
        this.factory = null;
        this.logger = $.logger("Claypool.MVC.Container").
             debug("Configuring Claypool MVC Container");
        //Register first so any changes to the container managed objects 
        //are immediately accessible to the rest of the application aware
        //components
        this.factory = new $$MVC.Factory();
        this.factory.updateConfig();
        //create global controllers non-lazily
        var controller,
            id;
        for(id in this.factory.cache){
            //will trigger the controllerFactory to instantiate the controllers
            controller = this.get(id);
            //activates the controller
            this.logger.debug("attaching mvc core controller: %s", id);
            controller.attach();
        }
    };
    
    $.extend($$MVC.Container.prototype, 
        $$.Application.ContextContributor.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
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
                    }else{
                        return null;
                    }
                }else{ 
                    this.logger.debug("Found container managed controller : %s", id);
                    return controller._this;
                }
            }catch(e){
                this.logger.exception(e);
                throw new $$MVC.ContainerError();
            }
            throw new $$MVC.FactoryError(id);
        }
    });
    
})(  jQuery, Claypool, Claypool.MVC );

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
    $$MVC.ContainerError = function(e){
        $.extend( this, new $$.Error(e, {
            name:"Claypool.MVC.ContainerError",
            message: "An error occurred trying to retreive a container managed object."
        }));
    };
})(  jQuery, Claypool, Claypool.MVC );


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
    $$MVC.FactoryError = function(e){
        $.extend( this, new $$.Error(e, {
            name:"Claypool.MVC.FactoryError",
            message: "An error occured trying to create the factory object."
        }));
    };
})(  jQuery, Claypool, Claypool.MVC );


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
    $$MVC.ConfigurationError = function(e){
        $.extend( this, new $$.ConfigurationError(e, {
            name:"Claypool.MVC.ConfigurationError",
            message: "An error occured during the configuration."
        }));
    };
    
})(  jQuery, Claypool, Claypool.MVC );


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
    //TODO : what is the useful static plugin that could be derived from Claypool.MVC?
    //      router ?
	$.extend($, {
        //this defines the built-in low-level controllers. adding more is easy! 
        //For another example see claypool server
	    router : function(confId, options){
            $(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
                registrationFunction.apply(_this, [
                    configuration, confId, "Claypool.MVC.HijaxController", options
                ]);
            });
            return this;
	    },
        mvc  : function(){
            if(arguments.length === 0){
                return $.config('mvc');
            }else{
                return $.config('mvc', arguments[0]);
            }
        }
	});
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
        }
    }).router( "hijax:event",{
        strategy        : 'all',
        routerKeys      : 'event',
        hijaxKey        : 'event',
        eventNamespace  : "Claypool:MVC:HijaxEventController",
        target       : function(event){ 
            return event.type;
        }
    }).router( "hijax:image-rollover",{
        selector        : 'img',
        event           : 'mouseover|mouseout',
        strategy        : 'all',
        routerKeys      : 'urls',
        hijaxKey        : 'image',
        eventNamespace  : "Claypool:MVC:HijaxImageRolloverController",
        target       : function(event){ 
            return event.target.src;
        }
    });
    
    $.mvc_scanner = $$MVC.Factory.prototype;
	
})(  jQuery, Claypool, Claypool.MVC );
