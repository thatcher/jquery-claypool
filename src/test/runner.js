


/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MUnit){
    /**
     * @constructor
     */
    /**
    *   - MethodTestRunner -
    *
    *   @author Chris Thatcher
    *   @credit Based on jQuery testrunner.js by John Resig and the jQuery Team
    *   @description
    *       The MethodTestRunner helps organize a collection of tests meant to 
    *       cover single method
    */
    $$MUnit.MethodTestRunner = function(options){
        $$.extend(this, $$MUnit.AbstractTest);
        $.extend(true, this, options);
        this.id = this.method;
        this.internalError = null; //helps us flag unexpected errors
        try{
            this.logger = $.logger("Claypool.MoonUnit.MethodTestRunner");
        }catch(e){
            //  ignore if the logger fails, we have to be safe since we are
            //  testing claypool itself
            this.fallback();
        }
    };
    
    $.extend($$MUnit.MethodTestRunner.prototype,
        $$MUnit.AbstractTest.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        run: function(name, nowait){
            var _this = this;
            this.logger.debug( "Test Details: \n\tmethod : %s \n\tdescription : %s ", 
                this.method||"NO METHOD SPECIFIED!!",
                this.description||"NO DESCRIPTION PROVIDED!!" );
            try{
                this.logger.debug("Setting up for Test: \n\t\t %s", this.method);
                this.setup();
                this.logger.info("Running Test: \n\t\t %s", this.method);
                this.stats.startTime = (new Date()).getTime();
                this.logger.debug("Synchronizing test function %s", this.test.toString());
                this.synchronize(function() {
                    _this.results = [];
                    try {
                        _this.logger.debug("Running Synchronized function %s", _this.test.toString());
                        _this.test();
                    } catch(e) {
                        _this.logger.exception(e);
                        //need to do something to flag that the test ended
                        //unexpectedly.  
                        _this.internalError = e.stackTrace?e.stackTrace():e.toString();
                        _this.stats.total++;
                        _this.stats.failed++;
                    }
                });
                this.logger.debug("Synchronizing test result examination.");
                this.synchronize(function() {
                    _this.logger.debug("Running test result examination.");
                    // don't output pause tests
                    if(nowait) {return;}
                    
                    //  Methods have a default coverage of 100% assuming they
                    //  exist becuase they are considered the atomic unit of testing
                    //  If however an expected number of tests is specified,
                    //  coverage is based instead on that assertion
                    _this.coverage.total = _this.expected||1;
                    for ( var i = 0; i < _this.results.length; i++ ) {
                        _this.stats.total++;
                        if ( !_this.results[i][0] ) {
                            _this.stats.failed++;
                        } else { _this.stats.passed++; }
                    }	
                    if(_this.expected && _this.expected != _this.results.length) {
                        _this.logger.warn("Did not run the expected number of tests.");
                        _this.incomplete =  "Expected " + _this.expected + " assertions, but " + _this.results.length + " were run." ;
                    }else{
                        _this.logger.debug("Ran the expected number of tests.");
                    }
                    _this.coverage.covered = _this.expected?_this.stats.total:1;
                    _this.coverage.uncovered = _this.expected?(_this.expected - _this.stats.total):1;
                });
            }catch(e){
                this.logger.error("Error Running Test: %s", this.method);
                this.logger.exception(e);
            }finally{
                this.logger.debug("Tearing down for Test: \n\t\t %s", this.method);
                this.stats.endTime = (new Date()).getTime();
                this.stats.totalTime = this.stats.endTime - this.stats.startTime;
                this.teardown();
            }
        }
    });
})(  jQuery, Claypool, Claypool.MoonUnit );

/**
 *  The ClassTestSuite helps organize a collection of tests meant to 
 *  cover an entire class (conceptual) of functions
 *
 * @credit Based on jQuery testrunner.js by John Resig and the jQuery Team
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MUnit){
    /**
     * @constructor
     */	
    $$MUnit.ClassTestRunner = function(options){
        $$.extend(this, $$MUnit.AbstractTest);
        $.extend(true, this,  options);
        this.id = this.$class;
        try{
            this.logger = $.logger("Claypool.MoonUnit.ClassTestRunner");
        }catch(e){
            this.fallback();
        }
    };
    
    $.extend($$MUnit.ClassTestRunner.prototype,
        $$MUnit.AbstractTest.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        run: function(){
            //  The ClassTestRunners job is basically to run an array of MethodTestRunners
            //  while keeping track of the metadata associated with the time it takes the 
            //  classes tests to complete as well as statistics accross methods
            var methodTest;
            var mi;
            this.logger.debug( "Class TestSuite Details: \n\tclass : %s \n\tdescription : %s ", 
                this.$class||"NO CLASSNAME SPECIFIED!!",
                this.description||"NO DESCRIPTION PROVIDED!!" );
            this.coverage.total = 0;
            this.coverage.covered = 0;
            var clazz = $.resolve(this.$class);
            var prop;
            if(clazz.prototype && $.isFunction(clazz)){
                //one for the constructor
                this.coverage.total++;
                for(prop in clazz.prototype){
                    if($.isFunction(clazz.prototype[prop])){
                        this.coverage.total++;
                    }
                }
            }else{
                //this is an object and may represent an interface
                for(prop in clazz){
                    if($.isFunction(clazz[prop])){
                        this.coverage.total++;
                    }
                }
            }
            if(this.methodTests&&this.methodTests.length){
                this.coverage.covered = this.methodTests.length;
                this.coverage.uncovered = this.coverage.total - this.coverage.covered;
                this.stats.startTime = (new Date()).getTime();
                for( mi = 0; mi < this.methodTests.length; mi++){
                    try{
                        this.logger.debug("Running method test %d for class %s", mi, this.$class);
                        methodTest = new $$MUnit.MethodTestRunner(
                            this.methodTests[mi]
                        );
                        methodTest.run();
                        this.results.push(methodTest.summarize());
                        this.stats.total++;
                        if(methodTest.stats.failed>0){
                            this.stats.failed++;
                        }else{
                            this.stats.passed++;
                        }
                    }catch(e){
                        this.logger.error("Error Running method test %d for class %s", mi, this.$class);
                        this.logger.exception(e);
                    }finally{
                        this.logger.debug("Finished Running method test %d for class %s", mi, this.$class);
                    }
                }
                this.stats.endTime = (new Date()).getTime();
                this.stats.totalTime = this.stats.endTime - this.stats.startTime;
            }else{
                //coverage is zero percent because there are no method tests for the class.
                this.logger.warn("There are no method tests for the class %s.", this.$class);
            }
        }
    });
    
})(  jQuery, Claypool, Claypool.MoonUnit );

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MUnit){
    /**
     * @constructor
     */	
    /**
    *   - NamespaceTestRunner -
    *
    *   @author Chris Thatcher
    *   @credit Based on jQuery testrunner.js by John Resig and the jQuery Team
    *   @description
    *       The NamespaceTestRunner helps organize a collection of tests meant to 
    *       cover an entire 'namespace' (conceptual 'package' or 'module') of functions
    */
    $$MUnit.NamespaceTestRunner = function(options){
        $$.extend(this, $$MUnit.AbstractTest);
        $.extend(true, this, options);
        this.id = this.namespace;
        this.staticMethods = [];
        this.classes = [];
        try{
            this.logger = $.logger("Claypool.MoonUnit.NamespaceTestRunner");
        }catch(e){
            this.fallback();
        }
     };
     
     $.extend($$MUnit.NamespaceTestRunner.prototype,
        $$MUnit.AbstractTest.prototype,{
         /**
          * Describe what this method does
          * @private
          * @param {String} paramName Describe this parameter
          * @returns Describe what it returns
          * @type String
          */
        run: function(){
            //  The NamespaceTestRunner job is basically to run an array of ClassTestRunners
            //  while keeping track of the metadata associated with the time it takes the 
            //  namespace tests to complete as well as statistics accross methods
            var methodTest;
            var classTest;
            var i;
            this.logger.debug( "Namespace TestSuite Details: \n\tnamespace : %s \n\tdescription : %s ", 
                this.namespace||"NO NAMESPACE SPECIFIED!!",
                this.description||"NO DESCRIPTION PROVIDED!!" );
            this.coverage.total = 0;
            this.coverage.covered = 0;
            this.coverage.uncoveredByName = [];
            var namespace = $.resolve(this.namespace);
            var counted = {};//helps us account for aliases
            for(var prop in namespace){
                if($.isFunction(namespace[prop])){
                    if(!(counted[prop]===namespace[prop])){
                        this.coverage.total++;
                        this.coverage.uncoveredByName.push(prop);
                        counted[prop] = namespace[prop];
                    }
                }
            }
            this.stats.startTime = (new Date()).getTime();
            if(this.staticMethodTests&&this.staticMethodTests.length){
                this.coverage.covered += this.staticMethodTests.length;
                this.coverage.uncovered = this.coverage.total - this.coverage.covered;
                for( i = 0; i < this.staticMethodTests.length; i++){
                    try{
                        this.logger.debug("Running static method test %d for namespace %s", i, this.namespace);
                        methodTest = new $$MUnit.MethodTestRunner(
                            this.staticMethodTests[i]
                        );
                        methodTest.run();
                        this.results.push(methodTest.summarize());
                        this.stats.total++;
                        if(methodTest.stats.failed>0){
                            this.stats.failed++;
                        }else{
                            this.stats.passed++;
                        }
                    }catch(e){
                        this.logger.error("Error Running method test %d for namespace %s", i, this.namespace);
                        this.logger.exception(e);
                    }finally{
                        this.logger.debug("Finished Running method test %d for namespace %s", i, this.namespace);
                    }
                    this.stats.endTime = (new Date()).getTime();
                    this.stats.totalTime = this.stats.endTime - this.stats.startTime;
                }
            }else{
                //coverage is zero percent because there are no method tests for the class.
                this.logger.info("There are no static methods for the namespace %s.", this.namespace);
            }
            if(this.classTests&&this.classTests.length){
                this.coverage.covered += this.classTests.length;
                this.coverage.uncovered = this.coverage.total - this.coverage.covered;
                for( i = 0; i < this.classTests.length; i++){
                    try{
                        this.logger.debug("Running class test %d for namespace %s", i, this.namespace);
                        classTest = new $$MUnit.ClassTestRunner(
                            this.classTests[i]
                        );
                        classTest.run();
                        this.results.push(classTest.summarize());
                        this.stats.total++;
                        if(classTest.stats.failed>0){
                            this.stats.failed++;
                        }else{
                            this.stats.passed++;
                        }
                    }catch(e){
                        this.logger.error("Error Running class test %d for namespace %s", i, this.namespace);
                        this.logger.exception(e);
                    }finally{
                        this.logger.debug("Finished Running class test %d for namespace %s", i, this.namespace);
                    }
                }
            }else{
                //coverage is zero percent because there are no method tests for the class.
                this.logger.warn("There are no class tests for the namespace %s.", this.namespace);
            }
            this.stats.endTime = (new Date()).getTime();
            this.stats.totalTime = this.stats.endTime - this.stats.startTime;
        }
    });
    
})(  jQuery, Claypool, Claypool.MoonUnit );
