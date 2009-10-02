
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){
    /**
     * @constructor 
     * @param {Object} options
     *      - options should include pointcut:{target:'Class or instance', method:'methodName or pattern', advice:function }
     */
    $$AOP.Aspect = function(options){
        this.id   = null;
        this.type = null;
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.AOP.Aspect");
        //only 'first' and 'all' are honored at this point
        //and if it's not 'first' it's 'all'
        this.strategy = this.strategy||"all";
    };
    
    $.extend($$AOP.Aspect.prototype, 
        $$.SimpleCachingStrategy.prototype ,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        weave: function(){
            var _this = this;
            var pattern;
            var targetObject;
            if(!this.target){
                _this.logger.warn( "No pointcut was specified.  Cant weave aspect." );
                return;
            }
            var _weave = function(methodName){
                var pointcut, cutline;//new method , old method
                try{
                    _this.logger.info( "Weaving Advice %s for Aspect %s", methodName, _this.id );
                    _this.hasPrototype = typeof(_this.target.prototype) != 'undefined';
                    cutline = _this.hasPrototype ? 
                        _this.target.prototype[methodName] : 
                        _this.target[methodName];
                    pointcut = _this.advise(cutline);
                    if(!_this.hasPrototype){
                        _this.target[methodName] = pointcut;
                    }else{ 
                        _this.target.prototype[methodName] = pointcut;
                    }
                    return { 
                        pointcut:pointcut,
                        cutline:cutline
                    };
                }catch(e){
                    throw new $$AOP.WeaveError(e, "Weave");
                }
            };
            //we dont want an aspect to be woven multiple times accidently so 
            //its worth a quick check to make sure the internal cache is empty.
            if(this.size===0){//size is empty
                pattern = new RegExp(this[this.type?this.type:"method"]);
                targetObject = this.target.prototype?this.target.prototype: this.target;
                for(var f in targetObject){
                    if($.isFunction(targetObject[f])&&pattern.test(f)){
                        this.logger.debug( "Adding aspect to method %s", f );
                        this.add($.guid(), _weave(f));
                        if(this.strategy==="first"){break;}
                    }
                }
            } return this;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        unweave: function(){
            var aspect;
            try{
                for(var id in this.cache){
                    aspect = this.find(id);
                   if(!this.hasPrototype){
                        this.target[this.method] = aspect.cutline;
                    } else {
                        this.target.prototype[this.method] = aspect.cutline;
                    } this.hasPrototype = null;
                } this.clear();
            }catch(e){
                throw new $$AOP.WeaveError(e, 'Unweave');
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
        advise: function(cutline){
            throw new $$.MethodNotImplementedError();
        }
        
    });
     
    
})(  jQuery, Claypool, Claypool.AOP );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){   
        /**
         * @constructor
         */
        $$AOP.After = function(options){
            $$.extend(this, $$AOP.Aspect);
            $.extend(true, this, options);
            this.logger = $.logger("Claypool.AOP.After");
            this.type = "after";
        };
        
        $.extend($$AOP.After.prototype,
            $$AOP.Aspect.prototype,{
            advise: function(cutline){
                var _this = this;
                try{
                    return function() {
                        //call the original function and then call the advice 
                        //   aspect with the return value and return the aspects return value
                        var returnValue = cutline.apply(this, arguments);//?should be this?
                        return _this.advice.apply(_this, [returnValue]);
                    };
                }catch(e){
                    throw new $$AOP.AspectError(e, "After");
                }
            }
        });

    
})(  jQuery, Claypool, Claypool.AOP );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){   
        /**
         * @constructor
         */
        $$AOP.Before = function(options){
            $$.extend( this, $$AOP.Aspect);
            $.extend(true, this, options);
            this.logger = $.logger("Claypool.AOP.Before");
            this.type = "before";
        };
        $.extend($$AOP.Before.prototype,
            $$AOP.Aspect.prototype,{
            /**
             * Describe what this method does
             * @private
             * @param {String} paramName Describe this parameter
             * @returns Describe what it returns
             * @type String
             */
            advise: function(cutline){
                var _this = this;
                try{
                    return function() {
                        _this.advice.apply(_this, arguments);
                        return cutline.apply(this, arguments);//?should be this?
                    };
                }catch(e){
                    throw new $$AOP.AspectError(e, "Before");
                }
            }
        });
        
})(  jQuery, Claypool, Claypool.AOP );


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$AOP){   
        /**
         * @constructor
         */
        $$AOP.Around = function(options){
            $$.extend( this,  $$AOP.Aspect);
            $.extend(true, this, options);
            this.logger = $.logger("Claypool.AOP.Around");
            this.type = "around";
        };
        $.extend($$AOP.Around.prototype, 
            $$AOP.Aspect.prototype,{
            /**
             * Describe what this method does
             * @private
             * @param {String} paramName Describe this parameter
             * @returns Describe what it returns
             * @type String
             */
            advise: function(cutline){
                var _this = this;
                try{
                    return function() {
                        var invocation = { object: this, args: arguments };
                        return _this.advice.apply(_this, [{ 
                            object: invocation.object,
                            arguments:  invocation.args, 
                            proceed :   function() {
                                var returnValue = cutline.apply(invocation.object, invocation.args);
                                return returnValue;
                            }
                        }] );
                    };
                }catch(e){
                    throw new $$AOP.AspectError(e, "Around");
                }
            }
        });
    
})(  jQuery, Claypool, Claypool.AOP );
