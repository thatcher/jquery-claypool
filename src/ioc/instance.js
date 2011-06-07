

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
    $$IoC.Instance = function(id, configuration){
        $.extend(this,{
            _this           : null,     //A reference to the managed object
            id              : null,     //published to the application context
            configuration   : null,     //the instance configuration
            guid            : $$.uuid(), //globally (naively) unique id for the instance created internally
            type            : null,     //a reference to the clazz
            id              : id,
            configuration   : configuration||{},
            logger          : $.logger("Claypool.IoC.Instance")
        });
        /**
         * Override the category name so we can identify some extra info about the object
         * in it's logging statements
         */
        this.logger.category = this.logger.category+"."+this.id;
    };
    
    $.extend($$IoC.Instance.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        precreate: function(){
            this._this = {claypoolId:this.id};//a temporary stand-in for the object we are creating
            this.logger.debug("Precreating Instance");
            $(document).trigger("claypool:precreate", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:precreate:"+this.id, [this._this]);
            //TODO:  Apply function specified in ioc hook
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        create: function(){
            var factory,factoryClass,factoryMethod,retVal;
            var _this,_thisOrUndefined,C_onstructor,args;
            var injections, injectionValue;
            /**
            *   The selector, if it isnt null, is used to create the default value
            *   of '_this' using $.  
            */
            this.logger.debug("Applying Selector to Instance");
            if(this.configuration.selector){
                // binds usto the elements via selector,
                //and/or sets defaults on the object we are managing (this._this)
                this._this  = $(this.configuration.selector);
                this.logger.debug("Result for selector : ", this._this);
            }else{
                this.logger.debug("Using default empty object");
                this._this = {};
            }
            /**  
            *   This is where we will create the actual instance from a constructor.
            *   Please use precreate and postcreate to hook you're needs into the
            *   lifecycle process via ioc/aop.
            *   It follows this order:
            *       1. find the appropriate constructor
            *       2. make sure all references in the options are resolved
            *       3. apply the constructor
            */
            if(this.configuration.factory){
                //The factory is either a managed instance (already constructed)
                //or it is the name of a factory class to temporarily instantiate
                factory = {};
                if(this.configuration.factory.substring(6,0)=="ref://"){
                    //its a reference to a managed object
                    this.logger.debug("Retreiving Factory from Application Context");
                    factory = $.$(this.configuration.factory);
                }else{
                    //Its a class, so instantiate it
                    this.logger.info("Creating Instance from Factory");
                    factoryClass = this.resolveConstructor(this.configuration.factory);
                    retval = factoryClass.apply(factory, this.configuration.options);
                    factory = retval||factory;
                }
                this.logger.debug("Applying factory creation method");
                factoryMethod = this.configuration.factoryMethod||"create";
                _this = factory[factoryMethod].apply(factory, this.configuration.options);
                this._this = $.extend(true,  _this, this._this);
            }else{
                //constructorName is just a simple class constructor
                /**
                *   This is here for complex reasons.  There are a plethora ways to instantiate a new object
                *   with javascript, and to be consistent, regardless of the particular approach, modifying the 
                *   prototype must do what it supposed to do.. This is the only way I've found to do that.
                *   PS If your constructor has more than 10 parameters, this wont work.  Why does your constructor
                *   have more than 10 parameters?
                */
                this.logger.info("Creating Instance simulating constructor: %s", this.configuration.clazz);
                C_onstructor = this.resolveConstructor(this.configuration.clazz);
                args = this.configuration.options||[];
                _this = {};
                switch(args.length){
                    case 0: _this = new C_onstructor();break;
                    case 1: _this = new C_onstructor(args[0]);break;
                    case 2: _this = new C_onstructor(args[0],args[1]);break;
                    case 3: _this = new C_onstructor(args[0],args[1],args[2]);break;
                    case 4: _this = new C_onstructor(args[0],args[1],args[2],args[3]);break;
                    case 5: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4]);break;
                    case 6: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4],args[5]);break;
                    case 7: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);break;
                    case 8: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);break;
                    case 9: _this = new C_onstructor(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8]);break;
                    default:
                        //this affect the prototype nature so modifying th proto has no affect on the instance
                        _thisOrUndefined = C_onstructor.apply(_this, args);
                        _this = _thisOrUndefined||_this;
                }
                //Every Instance gets a logger!
                _this.$ns = this.configuration.clazz;
                _this.$log = $.logger(_this.$ns);
                _this.$log.debug("Created new instance of %s", _this.$ns);
                
                this._this = $.extend(true, _this, this._this);
            }
            /**
            *   Now that the object has been successfully created we 'inject' these items
            *   More importantly we scan the top level of the injections for values (not names)
            *   that start tieh 'ref://' which is stripped and the remaining string is used
            *   to search the application scope for a managed object with that specific id.
            *
            *   This does imply that the construction of applications managed objects
            *   cascades until all injected dependencies have resolved.  I wish all
            *   browsers supported the js 'get/set' because we could use a lazy pattern 
            *   here instead.
            */
            injections = this.configuration.inject||{};
            for(var dependency in injections){
                injectionValue = injections[dependency];
                if($.isFunction(injectionValue.substring) &&
                   (injectionValue.substring(0,6) == 'ref://')){
                    injections[dependency] = $.$(
                        injectionValue.substring(6, injectionValue.length)
                    );
                }
            }
            $.extend(this._this, injections);
            $(document).trigger("claypool:create", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:create:"+this.id, [this._this]);
            return this._this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        postcreate:function(){
            //TODO:  Apply function specified in ioc hook
            this.logger.debug("PostCreate invoked");
            $(document).trigger("claypool:postcreate", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:postcreate:"+this.id, [this._this]);
            return this._this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        predestroy:function(){
            //If you need to do something to save state, eg make an ajax call to post
            //state to a server or local db (gears), do it here 
            //TODO:  Apply function specified in ioc hook
            this.logger.debug("Predestory invoked");
            $(document).trigger("claypool:predestroy", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:predestroy:"+this.id, [this._this]);
            return this._this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        destroy:function(){
            //TODO:  
            //we dont actually do anyting here, yet... it might be
            //a good place to 'delete' or null things
            this.logger.info("Destroy invoked");
            $(document).trigger("claypool:destroy", [this._this, this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:destroy:"+this.id, [this._this]);
            return delete this._this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        postdestroy:function(){
            //TODO:  Apply functions specified in ioc hook
            this.logger.debug("Postdestory invoked");
            $(document).trigger("claypool:postdestroy", [this.id]);
            //second event allow listening to the specific object lifecycle if you know it's id
            $(document).trigger("claypool:postdestroy:"+this.id);
            return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        resolveConstructor:function(constructorName){
            var constructor = $.resolve(constructorName); 
            if( $.isFunction(constructor) ){
                this.logger.debug(" Resolved " +constructorName+ " to a function");
                return constructor;
            }else{ 
                throw ("NoSuchConstructor:" + constructorName);
            }
        }
    });
    
})(  jQuery, Claypool, Claypool.IoC );
