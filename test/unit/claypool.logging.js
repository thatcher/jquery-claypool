/**
*   Claypool.Logging.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
(function($){
	//Used to test whether or not the message logged
	MockAppender = function(){ this.count = 0; };
	MockAppender.prototype.append = function(){ this.count++; };
	
	
Claypool.Logging$TestSuite = { 
    "@namespace"       :   "Claypool.Logging",
    "staticMethodTests"         :[  
        //StaticLoggerRetrievalConvenienceTest
        {
            "@method"       :   "Claypool.Logging.getLogger",
            "@description"  :   "Static method always returns a logger for the given name.",
            "@summary"      :   "Claypool.Logging doesnt require a logger is configured to exist so \
                                getLogger should be able to be used liberally, though generally only \
                                in the constructor.",
            "@commonErrors" :   "An error would generally imply an internal failure in the LoggerFactory.",
            "test"          :   function(){
                this.expect(6);
                var logger = $.Logging.getLogger("A.B.C");
                this.assertNotNull(logger, "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.debug), "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.info), "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.warn), "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.error), "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.exception), "The Result of getLogger should always return a valid Logger interface.");
            },
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }
    ],
    "classTests":[
        /**
        *   Claypool.Logging.Level
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            "@class"        :   "Claypool.Logging.Level$Enumeration",
            "@description"  :   "Static Enumeration for convenience in comparing log levels.",
            "methodTests"          : [
                //LoggingLevelInternalValueTest
                {
                    "@method"       :   "Claypool.Logging.Level$Enumeration",
                    "@description"  :   "Compares enumeration to integer value.",
                    "@summary"      :   "",
                    "@commonErrors" :   "Failure would imply a change of the enumeration definition.",
                    "test"          :   function(){
                        this.expect(5);
                        this.assertEqual($.Logging.Level.DEBUG,    0,  "DEBUG LEVEL");
                        this.assertEqual($.Logging.Level.INFO,     1,  "INFO  LEVEL");
                        this.assertEqual($.Logging.Level.WARN,     2,  "WARN  LEVEL");
                        this.assertEqual($.Logging.Level.ERROR,    3,  "ERROR LEVEL");
                        this.assertEqual($.Logging.Level.NONE,     4,  "NONE  LEVEL");
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                }
            ]
        },
        /**
        *   Claypool.Logging.LoggerFactory$Class
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            "@class"          : "Claypool.Logging.Factory$Class",
            "@description"  :   "Manages logger configuration and creation.",
            "methodTests"          : [
                //LoggerFactoryCreationTest 
                {
                    "@method"           :   "Claypool.Logging.Factory$Class.constructor",
                    "@description"      :   "Creating a Factory.",
                    "@summary"          :   "The Logger Factory should be able to be used as a constructor.",
                    "@commonErrors"     :   "It would be unusual for this test to fail if the source \
                                            is actually included correctly.  Please use firefox+firebug \
                                            to ensure that the source was downloaded properly.",
                    "test"              :   function(){
                       //    Todo: your test here.
                        this.expect(6);
                        var loggerFactory = new $.Logging.Factory();
                        this.assertTrue(loggerFactory, "The LoggerFactory can be created.");
                        this.assertTrue($.isFunction(loggerFactory.create),     
                            "The factory exposes the method | create |");
                        this.assertTrue($.isFunction(loggerFactory.getConfig),  
                            "The factory exposes the method | getConfig |");
                        this.assertTrue($.isFunction(loggerFactory.setConfig),    
                            "The factory exposes the method | setConfig |");
                        this.assertTrue($.isFunction(loggerFactory.updateConfig),   
                            "The factory exposes the method | updateConfig |");
                        this.assertTrue($.isFunction(loggerFactory.loadConfig),   
                            "The factory exposes the method | loadConfig |");
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                },
                //LoggerFactoryRetreiveLoggerTest
                {
                    "@method"       :   "Claypool.Logging.Factory$Class.create",
                    "@description"  :   "Given a category name, creates or retreives a Logger.",
                    "@summary"      :   "If no Logging is configured, it must return the NullLogger, or \
                                        if Logging is configured it must return the closest matching \
                                        configuration, then the root logging configuration or finally the \
                                        NullLogger.",
                    "@commonErrors" :   "Common errors include forgetting to configure logging, forgetting \
                                        to provide a root logger, or mispelling a category when creating the \
                                        logger.",
                    "setup"      :       function(){
                        $.Configuration.logging = [];
                     },
                    "test"          :   function(){
                        this.expect(4);
                        
                        //No config
                        var factory = new $.Logging.Factory();
                        factory.updateConfig();
                        var logger = factory.create("A.B.C");
                        this.assertUndefined(logger.level, "Logger is the Null Logger when the factory is not configured.");
                        delete factory;
                        delete logger;
                        
                        //Config, no root, no match
                        $.merge( $.Configuration.logging, [{
                            category:"E",
                            level   :"DEBUG"
                        }]); 
                        factory = new $.Logging.Factory();
                        factory.updateConfig();
                        logger = factory.create("A.B.C");
                        this.assertUndefined(logger.level, 
                            "Logger is the Null Logger when the root is not configured and no categories match.");
                        delete factory;
                        delete logger;
                        $.Configuration.logging = [];
                            
                        $.merge( $.Configuration.logging, [{
                            category:"E",
                            level   :"DEBUG",
                            appender:"Claypool.Logging.ConsoleAppender"
                        },{
                            category:"root",
                            level   :"INFO",
                            appender:"Claypool.Logging.ConsoleAppender"
                        }]); 
                        factory = new $.Logging.Factory();
                        factory.updateConfig();
                        logger = factory.create("A.B.C");
                        this.assertEqual(logger.level, 1, 
                            "Logger is configured according to root configuration.");
                        delete factory;
                        delete logger;
                        $.Configuration.logging = [];
                        
                        //Config, root, not exact match
                        $.merge( $.Configuration.logging, [{
                            category:"A.B",
                            level   :"DEBUG",
                            appender:"Claypool.Logging.ConsoleAppender"
                        },{
                            category:"A",
                            level   :"INFO",
                            appender:"Claypool.Logging.ConsoleAppender"
                        },{
                            category:"root",
                            level   :"WARN",
                            appender:"Claypool.Logging.ConsoleAppender"
                        }]); 
                        factory = new $.Logging.Factory();
                        factory.updateConfig();
                        logger = factory.create("A.B.C");
                        this.assertEqual(logger.level, 0, 
                            "Logger is configured according to closest match configuration.");
                        delete factory;
                        delete logger;
                    },
                    "teardown"      :       function(){
                        $.Configuration.logging = [];
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                },
                //LoggerFactoryUpdateConfigurationTest
                {
                    "@method"       :   "Claypool.Logging.LoggerFactory$Class.updateConfigurationCache",
                    "@description"  :   "Reads in a stores the Claypool.Configuration.logging ",
                    "@summary"      :   "This test simply verifies that the method can be called without \
                                        error and that the various configurations are retreivable by \
                                        category.",
                    "@commonErrors" :   "Please add a short paragraph describing simple user errors \
                                        that might occur to create issues this test doesn't address.",
                    "setup"      :       function(){
                        $.Configuration.logging = [];
                        $.merge( $.Configuration.logging, [{
                            category:"A.B",
                            level   :"DEBUG",
                            appender:"Claypool.Logging.ConsoleAppender"
                        },{
                            category:"A",
                            level   :"INFO",
                            appender:"Claypool.Logging.ConsoleAppender"
                        },{
                            category:"root",
                            level   :"WARN",
                            appender:"Claypool.Logging.ConsoleAppender"
                        }]); 
                    },
                    "test"          :   function(){
                       this.expect(5);
                        factory = new $.Logging.Factory();
                        this.assertTrue(factory.updateConfig(),
                            "Logging Configuration can be updated succesfully");
                        this.assertNotNull(factory.find("A.B"), 
                            "Found the expected Configuration by category.");
                        this.assertNotNull(factory.find("A"), 
                            "Found the expected Configuration by category.");
                        this.assertNotNull(factory.find("root"), 
                            "Found the expected Configuration by category.");
                        this.assertNull(factory.find("C"), 
                            "Didnt find unexpected Configuration by category.");
                    },
                    "teardown"      :       function(){
                        $.Configuration.logging = [];
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                }
            ]
        },
        /**
        *   Claypool.Logging.Logger$Interface
        */
        {
            "@class"          : "Claypool.Logging.Logger$Interface",
            "@description"  :   "Defines the interface for all loggers.",
            "methodTests"          : [
                //LoggerInterfaceDebug
                {
                    "@method"       :   "Claypool.Logging.Logger$Interface.debug",
                    "@description"  :   "Please add a one sentence description.",
                    "@summary"      :   "Please add a short paragraph describing the practical \
                                        puposes of this test.  It should also include variations \
                                        of the test already included.",
                    "@commonErrors" :   "It would be unusual for this test to fail if the source \
                                        is actually included correctly.  Please use firefox+firebug \
                                        to ensure that the source was downloaded properly.",
                    "test"          :   function(){
                       try{
                           $.Logging.Logger$Interface.debug();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                },
                //LoggerInterfaceInfo
                {
                    "@method"       :   "Claypool.Logging.Logger$Interface.info",
                    "@description"  :   "Please add a one sentence description.",
                    "@summary"      :   "Please add a short paragraph describing the practical \
                                        puposes of this test.  It should also include variations \
                                        of the test already included.",
                    "@commonErrors" :   "It would be unusual for this test to fail if the source \
                                        is actually included correctly.  Please use firefox+firebug \
                                        to ensure that the source was downloaded properly.",
                    "test"          :   function(){
                       try{
                           $.Logging.Logger$Interface.info();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                },
                //LoggerInterfaceWarn
                {
                    "@method"       :   "Claypool.Logging.Logger$Interface.warn",
                    "@description"  :   "Please add a one sentence description.",
                    "@summary"      :   "Please add a short paragraph describing the practical \
                                        puposes of this test.  It should also include variations \
                                        of the test already included.",
                    "@commonErrors" :   "It would be unusual for this test to fail if the source \
                                        is actually included correctly.  Please use firefox+firebug \
                                        to ensure that the source was downloaded properly.",
                    "test"          :   function(){
                       try{
                           $.Logging.Logger$Interface.warn();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                },
                //LoggerInterfaceError
                {
                    "@method"       :   "Claypool.Logging.Logger$Interface.error",
                    "@description"  :   "Please add a one sentence description.",
                    "@summary"      :   "Please add a short paragraph describing the practical \
                                        puposes of this test.  It should also include variations \
                                        of the test already included.",
                    "@commonErrors" :   "It would be unusual for this test to fail if the source \
                                        is actually included correctly.  Please use firefox+firebug \
                                        to ensure that the source was downloaded properly.",
                    "test"          :   function(){
                       try{
                           $.Logging.Logger$Interface.error();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                },
                //LoggerInterfaceException
                {
                    "@method"       :   "Claypool.Logging.Logger$Interface.exception",
                    "@description"  :   "Please add a one sentence description.",
                    "@summary"      :   "Please add a short paragraph describing the practical \
                                        puposes of this test.  It should also include variations \
                                        of the test already included.",
                    "@commonErrors" :   "It would be unusual for this test to fail if the source \
                                        is actually included correctly.  Please use firefox+firebug \
                                        to ensure that the source was downloaded properly.",
                    "test"          :   function(){
                       try{
                           $.Logging.Logger$Interface.exception();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                }
            ]
        },
        /**
        *   Claypool.Logging.NullLogger$Class
        */
        {
            "@class"          : "Claypool.Logging.NullLogger$Class",
            "@description"  :   "Provides the fastest implementation for Loggers that are turned off.",
            "methodTests"          : [
                //NullLoggerCreationTest
                {
                    "@method"       :   "Claypool.Logging.NullLogger$Class.constructor",
                    "@description"  :   "Successfully creates a NullLogger",
                    "@summary"      :   "Verifies that every function in the Logger$Interface can be used \
                                        and is equivalent to void(0)",
                    "@commonErrors" :   "It would be unusual for this test to fail if the source \
                                        is actually included correctly.  Please use firefox+firebug \
                                        to ensure that the source was downloaded properly.",
                    "test"          :   function(){
                        this.expect(11);
                        var nullLogger = new $.Logging.NullLogger();
                        this.assertTrue( nullLogger, "NullLogger gets created.");
                        this.assertEqual(nullLogger, nullLogger.debug(),      "NullLogger .debug still chains (with no arguments)");
                        this.assertEqual(nullLogger, nullLogger.info(),       "NullLogger .info still chains (with no arguments)");
                        this.assertEqual(nullLogger, nullLogger.warn(),       "NullLogger .warn still chains (with no arguments)");
                        this.assertEqual(nullLogger, nullLogger.error(),      "NullLogger .error still chains (with no arguments)");
                        this.assertEqual(nullLogger, nullLogger.exception(),  "NullLogger .exception still chains (with no arguments)");
                        var anArg = 13;
                        this.assertEqual(nullLogger, nullLogger.debug("message %d", anArg), "NullLogger .debug still chains (with arguments)");
                        this.assertEqual(nullLogger, nullLogger.info("message %d", anArg),  "NullLogger .info still chains (with arguments)");
                        this.assertEqual(nullLogger, nullLogger.warn("message %d", anArg),  "NullLogger .warn still chains (with arguments)");
                        this.assertEqual(nullLogger, nullLogger.error("message %d", anArg), "NullLogger .error still chains (with arguments)");
                        var error = new Error("TEST_ERROR");
                        this.assertEqual(nullLogger, nullLogger.exception(error), "NullLogger .exception still chains (with arguments)");
                    },
                    "@author"       :   "Chris Thatcher",
                    "@email"        :   "thatcher.christopher@gmail.com"
                }
            ]
        },
        /**
        *   Claypool.Logging.Logger$Class
        */
        {
            "@class"          : "Claypool.Logging.Logger$Class",
            "@description"  :   "Provides the standard implementation for Loggers that are turned on.",
            "methodTests"          : [
                //LoggerCreationTest
                {
                    "@method"           :   "Claypool.Logging.Logger$Class.constructor",
                    "@description"      :   "Please add a one sentence description.",
                    "@summary"          :   "Please add a short paragraph describing the practical \
                                            puposes of this test.  It should also include variations \
                                            of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors \
                                            that might occur to create issues this test doesn't address.",
                    "test"              :   function(){
                        this.expect(1);
                        var logger = new $.Logging.Logger({
                                            category:"Test.Fixture",
                                            level:"INFO",
                                            appender:"Claypool.Logging.ConsoleAppender"
                                        });
                        this.assertNotNull(logger, "Logger could be instantiated with no args.");            
                    }
                },
                //LoggerDebugLevelTest
                {
                    "@method"           :   "Claypool.Logging.Logger$Class.debug",
                    "@description"      :   "Please add a one sentence description.",
                    "@summary"          :   "Please add a short paragraph describing the practical \
                                            puposes of this test.  It should also include variations \
                                            of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors \
                                            that might occur to create issues this test doesn't address.",
                    "setup"             :   function(){
                        $.Configuration.logging = [];
                        $.merge( $.Configuration.logging, [{
                            category:"root",
                            level:"ERROR",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture",
                            level:"WARN",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category2",
                            level:"INFO",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category1",
                            level:"DEBUG",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category0",
                            level:"NONE",
                            appender:"MockAppender"
                        }]);
                        $.Logging.loggerFactory = null;
                    },
                    "test"              :   function(){
                        this.expect(6);
                        var logger = $.Logging.getLogger("Test.Fixture.Category1");
                        this.assertEqual(logger.level, Claypool.Logging.Level.DEBUG, "Logger is set to DEBUG level logging");
                        logger.debug("Debug Message");
                        this.assertEqual(logger.appender.count  ,1  ,"Message should log");
                        logger.info( "Info Message");
                        this.assertEqual(logger.appender.count   ,2  ,"Message should log");
                        logger.warn( "Warn Message");
                        this.assertEqual(logger.appender.count   ,3  ,"Message should log");
                        logger.error("Error Message");
                        this.assertEqual(logger.appender.count  ,4  ,"Message should log");
                        var oops = function(){
                            var dumb = undefined;
                            dumb.billiant();
                        };
                        try{ oops(); } catch(e){
                        	logger.exception(e);
                            this.assertEqual(logger.appender.count, 5,  "Message should log");
                        }
                        
                    },
                    "teardown"          :   function(){
                        $.Configuration.logging = [];
                        delete Claypool.Logging.loggerFactory;
                    }
                },
                //LoggerInfoLevelTest
                {
                    "@method"           :   "Claypool.Logging.Logger$Class.info",
                    "@description"      :   "Please add a one sentence description.",
                    "@summary"          :   "Please add a short paragraph describing the practical \
                                            puposes of this test.  It should also include variations \
                                            of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors \
                                            that might occur to create issues this test doesn't address.",
                    "setup"             :   function(){
                        $.Configuration.logging = [];
                        $.merge( $.Configuration.logging, [{
                            category:"root",
                            level:"ERROR",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture",
                            level:"WARN",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category2",
                            level:"INFO",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category1",
                            level:"DEBUG",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category0",
                            level:"NONE",
                            appender:"MockAppender"
                        }]);
                        $.Logging.loggerFactory = null;
                    },
                    "test"              :   function(){
                        this.expect(6);
                        var logger = $.Logging.getLogger("Test.Fixture.Category2");
                        this.assertEqual(logger.level, Claypool.Logging.Level.INFO, "Logger is set to INFO level logging");
                        logger.debug("Debug Message");
                        this.assertEqual(logger.appender.count  ,0  ,"Message should not log");
                        logger.info( "Info Message");
                        this.assertEqual(logger.appender.count   ,1  ,"Message should log");
                        logger.warn( "Warn Message")  ; 
                        this.assertEqual(logger.appender.count,2  ,"Message should log");
                        logger.error("Error Message")  ;
                        this.assertEqual(logger.appender.count,3  ,"Message should log");
                        var oops = function(){
                            var dumb = undefined;
                            dumb.billiant();
                        };
                        try{ oops(); } catch(e){
                        	logger.exception(e);
                            this.assertEqual(logger.appender.count, 4,  "Message should log");
                        }
                        
                    },
                    "teardown"          :   function(){
                        $.Configuration.logging = [];
                        delete $.Logging.loggerFactory;
                    }
                },
                //LoggerWarnLevelTest
                {
                    "@method"           :   "Claypool.Logging.Logger$Class.warn",
                    "@description"      :   "Please add a one sentence description.",
                    "@summary"          :   "Please add a short paragraph describing the practical \
                                            puposes of this test.  It should also include variations \
                                            of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors \
                                            that might occur to create issues this test doesn't address.",
                    "setup"             :   function(){
                        $.Configuration.logging = [];
                        $.merge( $.Configuration.logging, [{
                            category:"root",
                            level:"ERROR",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture",
                            level:"WARN",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category2",
                            level:"INFO",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category1",
                            level:"DEBUG",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category0",
                            level:"NONE",
                            appender:"MockAppender"
                        }]);
                        $.Logging.loggerFactory = null;
                    },
                    "test"              :   function(){
                        this.expect(6);
                        var logger = $.Logging.getLogger("Test.Fixture.Category3");
                        this.assertEqual(logger.level, $.Logging.Level.WARN, "Logger is set to WARN level logging");
                        logger.debug("Debug Message");
                        this.assertEqual(logger.appender.count  ,0  ,"Message should not log");
                        logger.info( "Info Message");
                        this.assertEqual(logger.appender.count   ,0  ,"Message should log");
                        logger.warn( "Warn Message")  ; 
                        this.assertEqual(logger.appender.count,1  ,"Message should log");
                        logger.error("Error Message")  ;
                        this.assertEqual(logger.appender.count,2  ,"Message should log");
                        var oops = function(){
                            var dumb = undefined;
                            dumb.billiant();
                        };
                        try{ oops(); } catch(e){
                        	logger.exception(e);
                            this.assertEqual(logger.appender.count, 3,  "Message should log");
                        }
                        
                    },
                    "teardown"          :   function(){
                        $.Configuration.logging = [];
                        delete $.Logging.loggerFactory;
                    }
                },
                //LoggerErrorLevelTest
                {
                    "@method"           :   "Claypool.Logging.Logger$Class.error",
                    "@description"      :   "Please add a one sentence description.",
                    "@summary"          :   "Please add a short paragraph describing the practical \
                                            puposes of this test.  It should also include variations \
                                            of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors \
                                            that might occur to create issues this test doesn't address.",
                    "setup"             :   function(){
                        $.Configuration.logging = [];
                        $.merge( $.Configuration.logging, [{
                            category:"root",
                            level:"ERROR",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture",
                            level:"WARN",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category2",
                            level:"INFO",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category1",
                            level:"DEBUG",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category0",
                            level:"NONE",
                            appender:"MockAppender"
                        }]);
                        $.Logging.loggerFactory = null;
                    },
                    "test"              :   function(){
                        this.expect(6);
                        var logger = $.Logging.getLogger("Test.Fixture1.Category3");
                        this.assertEqual(logger.level, $.Logging.Level.ERROR, "Logger is set to ERROR level logging");
                        logger.debug("Debug Message");
                        this.assertEqual(logger.appender.count  ,0  ,"Message should not log");
                        logger.info( "Info Message");
                        this.assertEqual(logger.appender.count   ,0  ,"Message should log");
                        logger.warn( "Warn Message")  ; 
                        this.assertEqual(logger.appender.count,0  ,"Message should log");
                        logger.error("Error Message")  ;
                        this.assertEqual(logger.appender.count,1  ,"Message should log");
                        var oops = function(){
                            var dumb = undefined;
                            dumb.billiant();
                        };
                        try{ oops(); } catch(e){
                        	logger.exception(e);
                            this.assertEqual(logger.appender.count, 2,  "Message should log");
                        }
                        
                    },
                    "teardown"          :   function(){
                        $.Configuration.logging = [];
                        delete $.Logging.loggerFactory;
                    }
                },
                //LoggerNoneLevelTest
                {
                    "@method"           :   "Claypool.Logging.Logger$Class.exception",
                    "@description"      :   "Please add a one sentence description.",
                    "@summary"          :   "Please add a short paragraph describing the practical \
                                            puposes of this test.  It should also include variations \
                                            of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors \
                                            that might occur to create issues this test doesn't address.",
                    "setup"             :   function(){
                        
                        $.Configuration.logging = [];
                        $.merge( $.Configuration.logging, [{
                            category:"root",
                            level:"ERROR",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture",
                            level:"WARN",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category2",
                            level:"INFO",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category1",
                            level:"DEBUG",
                            appender:"MockAppender"
                        },{
                            category:"Test.Fixture.Category0",
                            level:"NONE",
                            appender:"MockAppender"
                        }]);
                        $.Logging.loggerFactory = null;
                    },
                    "test"              :   function(){
                        this.expect(6);
                        var logger = $.Logging.getLogger("Test.Fixture.Category0");
                        this.assertEqual(logger.level, $.Logging.Level.NONE, "Logger is set to NONE level logging");
                        logger.debug("Debug Message");
                        this.assertEqual(logger.appender.count, 0    ,"Message should not log");
                        logger.info( "Info Message");
                        this.assertEqual(logger.appender.count, 0    ,"Message should not log");
                        logger.warn( "Warn Message")  ; 
                        this.assertEqual(logger.appender.count, 0    ,"Message should not log");
                        logger.error("Error Message")  ;
                        this.assertEqual(logger.appender.count, 0    ,"Message should not log");
                        var oops = function(){
                            var dumb = undefined;
                            dumb.billiant();
                        };
                        try{ oops(); } catch(e){
                        	logger.exception(e);
                        	this.assertEqual(logger.appender.count, 0    ,"Message should not log");
                        }
                        
                    },
                    "teardown"          :   function(){
                        $.Configuration.logging = [];
                        delete $.Logging.loggerFactory;
                    }
                }
            ]
        },
        /**
        *   Claypool.Logging.ConfigurationError$Class
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            "@class"          : "Claypool.Logging.ConfigurationError$Class",
            "methodTests"          : [
                //CatchLoggingConfigurationErrorTest
                {
                    "@method"           :   "Claypool.Logging.ConfigurationError$Class.constructor",
                    "@description"      :   "Please add a one sentence description.",
                    "@summary"          :   "Please add a short paragraph describing the practical \
                                            puposes of this test.  It should also include variations \
                                            of the test already included.",
                    "@commonErrors"     :   "Please add a short paragraph describing simple user errors \
                                            that might occur to create issues this test doesn't address.",
                    "test"              :   function(){
                        this.expect(3);
                       try{
                           throw new $.Logging.ConfigurationError();
                           this.assertTrue(false, "Should have thrown error.");
                       }catch(e){
                           this.assertTrue(e.name.match( "Claypool.Error"), 
                                            "Can match error as Claypool.Error");
                           this.assertTrue(e.name.match( "Claypool.ConfigurationError"), 
                                            "Can match error as Claypool.ConfigurationError");
                           this.assertTrue(e.name.match( "Claypool.Logging.ConfigurationError"),  
                                            "Can match error as Claypool.Logging.ConfigurationError");
                       }
                    }
                }
            ]
        }
    ]
};
})(jQuery);



