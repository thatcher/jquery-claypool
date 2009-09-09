/**
*   Claypool.Logging.TestSuite
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
(function($, $$, $$Log){
	//Used to test whether or not the message logged
	MockAppender = function(){ this.count = 0; };
	MockAppender.prototype.append = function(){ this.count++; };
	
	
Claypool.Logging$TestSuite = { 
    namespace       :   "Claypool.Logging",
    staticMethodTests         :[  
        //StaticLoggerRetrievalConvenienceTest
        {
            method       :   "getLogger",
            description  :   "Static method always returns a logger for the given name.",
            test          :   function(){
                this.expect(6);
                var logger = $$Log.getLogger("A.B.C");
                this.assertNotNull(logger, "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.debug), "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.info), "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.warn), "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.error), "The Result of getLogger should always return a valid Logger interface.");
                this.assertTrue($.isFunction(logger.exception), "The Result of getLogger should always return a valid Logger interface.");
            }
        }
    ],
    classTests:[
        /**
        *   Claypool.Logging.Level
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class        :   "Claypool.Logging.Level",
            description  :   "Static Enumeration for convenience in comparing log levels.",
            methodTests          : [
                //LoggingLevelInternalValueTest
                {
                    method       :   "Level",
                    description  :   "Compares enumeration to integer value.",
                    test          :   function(){
                        this.expect(5);
                        this.assertEqual($$Log.Level.DEBUG,    0,  "DEBUG LEVEL");
                        this.assertEqual($$Log.Level.INFO,     1,  "INFO  LEVEL");
                        this.assertEqual($$Log.Level.WARN,     2,  "WARN  LEVEL");
                        this.assertEqual($$Log.Level.ERROR,    3,  "ERROR LEVEL");
                        this.assertEqual($$Log.Level.NONE,     4,  "NONE  LEVEL");
                    }
                }
            ]
        },
        /**
        *   Claypool.Logging.LoggerFactory
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class          : "Claypool.Logging.Factory",
            description  :   "Manages logger configuration and creation.",
            methodTests          : [
                //LoggerFactoryCreationTest 
                {
                    method           :   "constructor",
                    description      :   "Creating a Factory.",
                    test              :   function(){
                       //    Todo: your test here.
                        this.expect(6);
                        var loggerFactory = new $$Log.Factory();
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
                    }
                },
                //LoggerFactoryRetreiveLoggerTest
                {
                    method       :   "create",
                    description  :   "Given a category name, creates or retreives a Logger.",
                    setup      :       function(){
                        $$.Configuration.logging = [];
                     },
                    test          :   function(){
                        this.expect(4);
                        
                        //No config
                        var factory = new $$Log.Factory();
                        factory.updateConfig();
                        var logger = factory.create("A.B.C");
                        this.assertUndefined(logger.level, "Logger is the Null Logger when the factory is not configured.");
                        delete factory;
                        delete logger;
                        
                        //Config, no root, no match
                        $.merge( $$.Configuration.logging, [{
                            category:"E",
                            level   :"DEBUG"
                        }]); 
                        factory = new $$Log.Factory();
                        factory.updateConfig();
                        logger = factory.create("A.B.C");
                        this.assertUndefined(logger.level, 
                            "Logger is the Null Logger when the root is not configured and no categories match.");
                        delete factory;
                        delete logger;
                        $$.Configuration.logging = [];
                            
                        $.merge( $$.Configuration.logging, [{
                            category:"E",
                            level   :"DEBUG",
                            appender:"Claypool.Logging.ConsoleAppender"
                        },{
                            category:"root",
                            level   :"INFO",
                            appender:"Claypool.Logging.ConsoleAppender"
                        }]); 
                        factory = new $$Log.Factory();
                        factory.updateConfig();
                        logger = factory.create("A.B.C");
                        this.assertEqual(logger.level, 1, 
                            "Logger is configured according to root configuration.");
                        delete factory;
                        delete logger;
                        $$.Configuration.logging = [];
                        
                        //Config, root, not exact match
                        $.merge( $$.Configuration.logging, [{
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
                        factory = new $$Log.Factory();
                        factory.updateConfig();
                        logger = factory.create("A.B.C");
                        this.assertEqual(logger.level, 0, 
                            "Logger is configured according to closest match configuration.");
                        delete factory;
                        delete logger;
                    },
                    teardown      :       function(){
                        $$.Configuration.logging = [];
                    }
                },
                //LoggerFactoryUpdateConfigurationTest
                {
                    method       :   "updateConfigurationCache",
                    description  :   "Reads in a stores the Claypool.Configuration.logging ",
                    setup      :       function(){
                        $$.Configuration.logging = [];
                        $.merge( $$.Configuration.logging, [{
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
                    test          :   function(){
                       this.expect(5);
                        factory = new $$Log.Factory();
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
                    teardown      :       function(){
                        $$.Configuration.logging = [];
                    }
                }
            ]
        },
        /**
        *   Claypool.Logging.Logger$Interface
        */
        {
            $class          : "Claypool.Logging.Logger$Interface",
            description  :   "Defines the interface for all loggers.",
            methodTests          : [
                //LoggerInterfaceDebug
                {
                    method       :   "debug",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                       try{
                           $$Log.Logger$Interface.debug();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    }
                },
                //LoggerInterfaceInfo
                {
                    method       :   "info",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                       try{
                           $$Log.Logger$Interface.info();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    }
                },
                //LoggerInterfaceWarn
                {
                    method       :   "warn",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                       try{
                           $$Log.Logger$Interface.warn();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    }
                },
                //LoggerInterfaceError
                {
                    method       :   "error",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                       try{
                           $$Log.Logger$Interface.error();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    }
                },
                //LoggerInterfaceException
                {
                    method       :   "exception",
                    description  :   "Please add a one sentence description.",
                    test          :   function(){
                       try{
                           $$Log.Logger$Interface.exception();
                       }catch(e){
                           this.assertTrue(e.name.match("Claypool.MethodNotImplementedError"), "Found expected error.");
                       }
                    }
                }
            ]
        },
        /**
        *   Claypool.Logging.NullLogger
        */
        {
            $class          : "Claypool.Logging.NullLogger",
            description  :   "Provides the fastest implementation for Loggers that are turned off.",
            methodTests          : [
                //NullLoggerCreationTest
                {
                    method       :   "constructor",
                    description  :   "Successfully creates a NullLogger", 
                    test          :   function(){
                        this.expect(11);
                        var nullLogger = new $$Log.NullLogger();
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
                    }
                }
            ]
        },
        /**
        *   Claypool.Logging.Logger
        */
        {
            $class          : "Claypool.Logging.Logger",
            description  :   "Provides the standard implementation for Loggers that are turned on.",
            methodTests          : [
                //LoggerCreationTest
                {
                    method           :   "Claypool.Logging.Logger.constructor",
                    description      :   "Please add a one sentence description.",
                    test              :   function(){
                        this.expect(1);
                        var logger = new $$Log.Logger({
                                            category:"Test.Fixture",
                                            level:"INFO",
                                            appender:"Claypool.Logging.ConsoleAppender"
                                        });
                        this.assertNotNull(logger, "Logger could be instantiated with no args.");            
                    }
                },
                //LoggerDebugLevelTest
                {
                    method           :   "debug",
                    description      :   "Please add a one sentence description.",
                    setup             :   function(){
                        $$.Configuration.logging = [];
                        $.merge( $$.Configuration.logging, [{
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
                        $$Log.loggerFactory = null;
                    },
                    test              :   function(){
                        this.expect(6);
                        var logger = $$Log.getLogger("Test.Fixture.Category1");
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
                    teardown          :   function(){
                        $$.Configuration.logging = [];
                        delete Claypool.Logging.loggerFactory;
                    }
                },
                //LoggerInfoLevelTest
                {
                    method           :   "info",
                    description      :   "Please add a one sentence description.",
                    setup             :   function(){
                        $$.Configuration.logging = [];
                        $.merge( $$.Configuration.logging, [{
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
                        $$Log.loggerFactory = null;
                    },
                    test              :   function(){
                        this.expect(6);
                        var logger = $$Log.getLogger("Test.Fixture.Category2");
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
                    teardown          :   function(){
                        $$.Configuration.logging = [];
                        delete $$Log.loggerFactory;
                    }
                },
                //LoggerWarnLevelTest
                {
                    method           :   "warn",
                    description      :   "Please add a one sentence description.",
                    setup             :   function(){
                        $$.Configuration.logging = [];
                        $.merge( $$.Configuration.logging, [{
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
                        $$Log.loggerFactory = null;
                    },
                    test              :   function(){
                        this.expect(6);
                        var logger = $$Log.getLogger("Test.Fixture.Category3");
                        this.assertEqual(logger.level, $$Log.Level.WARN, "Logger is set to WARN level logging");
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
                    teardown          :   function(){
                        $$.Configuration.logging = [];
                        delete $$Log.loggerFactory;
                    }
                },
                //LoggerErrorLevelTest
                {
                    method           :   "error",
                    description      :   "Please add a one sentence description.",
                    setup             :   function(){
                        $$.Configuration.logging = [];
                        $.merge( $$.Configuration.logging, [{
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
                        $$Log.loggerFactory = null;
                    },
                    test              :   function(){
                        this.expect(6);
                        var logger = $$Log.getLogger("Test.Fixture1.Category3");
                        this.assertEqual(logger.level, $$Log.Level.ERROR, "Logger is set to ERROR level logging");
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
                    teardown          :   function(){
                        $$.Configuration.logging = [];
                        delete $$Log.loggerFactory;
                    }
                },
                //LoggerNoneLevelTest
                {
                    method           :   "exception",
                    description      :   "Please add a one sentence description.",
                    setup             :   function(){
                        
                        $$.Configuration.logging = [];
                        $.merge( $$.Configuration.logging, [{
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
                        $$Log.loggerFactory = null;
                    },
                    test              :   function(){
                        this.expect(6);
                        var logger = $$Log.getLogger("Test.Fixture.Category0");
                        this.assertEqual(logger.level, $$Log.Level.NONE, "Logger is set to NONE level logging");
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
                    teardown          :   function(){
                        $$.Configuration.logging = [];
                        delete $$Log.loggerFactory;
                    }
                }
            ]
        },
        /**
        *   Claypool.Logging.ConfigurationError
        *   
        *   @author Chris Thatcher 
        *   @email thatcher.christopher@gmail.com
        */
        {
            $class          : "Claypool.Logging.ConfigurationError",
            methodTests          : [
                //CatchLoggingConfigurationErrorTest
                {
                    method           :   "constructor",
                    description      :   "Please add a one sentence description.",
                    test              :   function(){
                        this.expect(3);
                       try{
                           throw new $$Log.ConfigurationError();
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
})(jQuery, Claypool, Claypool.Logging);



