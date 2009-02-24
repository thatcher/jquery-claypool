

/**
 *       The AbstractTest provides everything a test needs to run
 *       expect that it requires one method to be implemented. 
 *       That method is, of course 'test'.
 *
 *       The AbstractTest also provides default implementations
 *       of 'setup' and 'teardown' which do nothing but potentially
 *       log the fact that they have been called and do nothing.
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
    $$MUnit.AbstractTest = function(options){
        $.extend(true, this, {
            id: null,     //descriptive metadata
            results:[],//an array of objects with test result details
            queue:[], //holds a list of methods to be executed synchronously
            blocking:false,//state
            timeout:0,//state
            coverage:{
                total: 0,
                covered : 0,
                uncovered : 0
            },
            stats:{
                passed:0,
                failed:0,
                total:0,
                startTime:0,
                endTime:0
            }
        });
        $.extend(true, this, options);
        try{
            this.logger = $.logger("Claypool.MoonUnit.AbstractTest");
        }catch(e){
            //  ignore if the logger fails, we have to be safe since we are
            //  testing claypool itself
            this.fallback();
        }
    };
    
    $.extend($$MUnit.AbstractTest.prototype,{
        //should provide a safe failover for anything we use from the software being tested
        fallback: function(){
            //  ignore if the logger fails, we have to be safe since we are
            //  testing claypool itself
            var nullFunction=function(){};
            this.logger =  {
                debug:nullFunction,
                info:nullFunction,
                warn:nullFunction,
                error:nullFunction,
                exception:nullFunction
            };
        },
        test: function(){
          throw new Error("Test method must be implemented!");  
        },
        expect: function(numberOfExpectedAsserts) {
            this.expected = numberOfExpectedAsserts;
        },
        setup: function(){
            this.logger.debug("Doing Nothing to Set Up for Test ");
        },
        teardown: function(){
            this.logger.debug("Doing Nothing to Tear Down the test Test ");
        },
        // all assert* are loosely based on jQuery testrunner.js
        assertTrue: function(statement, msg){
            this.results.push( [!!statement, msg] );
        },
        assertFalse: function(statement, msg){
            this.results.push( [!statement, msg] );
        },
        assertNull: function(statement, msg){
            this.results.push( [(statement===null), msg] );
        },
        assertNotNull: function(statement, msg){
            this.results.push( [(statement!==null), msg] );
        },
        assertUndefined: function(statement, msg){
            this.results.push( [(statement===undefined), msg] );
        },
        assertDefined: function(statement, msg){
            this.results.push( [(statement!==undefined), msg] );
        },
        assertEqual: function(expected, actual, msg){
            this.results.push( [(expected==actual), msg] );
        },
        assertNotEqual: function(expected, actual, msg){
            this.results.push( [(expected!=actual), msg] );
        },
        assertSame: function(expected, actual, msg){
            this.results.push( [(expected===actual), msg] );
        },
        assertDifferent: function(expected, actual, msg){
            this.results.push( [(expected!==actual), msg] );
        },
        fail: function(msg){
            this.results.push( [false, msg]);
        },
        synchronize: function(callback) {
            this.queue[this.queue.length] = callback;
            if(!this.blocking) {
                this.process();
            }
        },
        process: function() {
            var call = null;
            this.logger.debug("Processing Synchronized Test Queue");
            while(this.queue.length && !this.blocking) {
                this.logger.debug("Queue length before call: %s", this.queue.length);
                call = this.queue[0];
                this.queue = this.queue.slice(1);
                call();
                this.logger.debug("Queue length after call: %s", this.queue.length);
            }
        },
        stop: function(allowFailure) {
            var _this = this;
            _this.blocking = true;
            var handler = allowFailure ? _this.start : function() {
                throw new $$MUnit.TimedOutError();
            };
        },
        start: function() {
            // A slight delay, to avoid any current callbacks
            var _this = this;
            setTimeout( function(){
                if(_this.timeout){
                    clearTimeout(_this.timeout);
                }
                _this.blocking = false;
                _this.process();
            }, 13);
        },
        summarize: function(){
            var testRunSummary = {
                id          : this.id,
                description : this.description,
                coverage    : this.coverage,
                stats       : this.stats,
                results     : this.results,
                namespace   : this.namespace||null,
                $class      : this.$class||null,
                method      : this.method||null,
                encode      : function(s){
                    return s.replace(/&(?!\w+([;\s]|$))/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
            };
            for(var prop in this){
                if(prop.match(/Test$/)){
                    testRunSummary[prop] = this[prop];
                }
            }
            return testRunSummary;
        },
        run: function(abstractTestDetails){
           throw new $$.MethodNotImplementedError();
        }
    });
    
})(  jQuery, Claypool, Claypool.MoonUnit );
