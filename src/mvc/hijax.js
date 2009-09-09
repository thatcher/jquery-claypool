
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
