/**
*   Claypool Logging Api Documentation
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
Claypool.Logging$Doc = {
    "@namespace"    :   "Claypool.Logging",
    "@description"  :   "As applications become more complex and longer lived at a single url "+
                        "even stepping through a debugger can be difficult and time consuming "+
                        "(not to mention the lack of a useful debugger on IE).  Tracking down issues "+
                        "can be the critical bridge between an application that can grow and one "+
                        "that reaches critical mass.  Category Logging has been around for many "+
                        "languages for many years now, but javascript still apparently was lacking "+
                        "a good implementation. Using logging correctly can reduce you development "+
                        "cost and headaches and needn't burden the performance of production code.", 
    example        :   [{
        "@title"        :   "Creating a Logger",
        "@description"  :   "Logging relies on the notion of Categories. "+
                            "Categories are '.' delimited strings which allow you to "+
                            "turn on and off all, some, or single logger(s) so you can easily "+
                            "peer under the hood of any aspect of your application." ,
        source          :   ""+
            "/**\n"+
            "* Press F12 or Ctrl+Shift+L to see the messages logged by this application.\n"+
            "**/\n"+
            "var logger = MyApp.Logging.getLogger('MyApp.DataAccess.FeedReader');\n"
    },{
        "@title"        :   "Configuring Loggers for your Application.",
        "@description"  :   "The Categories are hierarchical so in the example below "+
                            "a logger with the category 'DocsApp.Foo' would be logged "+
                            "at the level INFO (since the category 'DocsApp' is the next "+
                            "closest).  The special Category 'root' is used for all loggers"+
                            "that dont fit into any configured Category." ,
        source          :   ""+
            "/**\n"+
            "* Press F12 or Ctrl+Shift+L to see the messages logged by this application.\n"+
            "**/\n"+
            "MyApp = {\n"+
            "    // Namespace Aliasing promotes independence of app from framework!\n"+
            "    Logging     : Claypool.Logging,\n"+
            "    Configuration:{ \n"+
            "        logging : [\n"+
            "           {\n"+
            "               category:'DocsApp',\n"+
            "               level:'INFO',\n"+
            "               appender:'Claypool.Logging.ConsoleAppender'\n"+
            "           },{\n"+
            "               category:'DocsApp.Models',\n"+
            "               level:'DEBUG',\n"+
            "               appender:'Claypool.Logging.ConsoleAppender'\n"+
            "           },{\n"+
            "               category:'DocsApp.Views',\n"+
            "               level:'DEBUG',\n"+
            "               appender:'Claypool.Logging.ConsoleAppender'\n"+
            "           },{\n"+
            "               category:'DocsApp.Controllers',\n"+
            "               level:'DEBUG',\n"+
            "               appender:'Claypool.Logging.ConsoleAppender'\n"+
            "           },{\n"+
            "               category:'Claypool',\n"+
            "               level:'WARN',\n"+
            "               appender:'Claypool.Logging.ConsoleAppender'\n"+
            "           },{\n"+
            "               category:'root',\n"+
            "               level:'ERROR',\n"+
            "               appender:'Claypool.Logging.ConsoleAppender'\n"+
            "           }\n"+
            "       ]\n"+
            "    }\n"+
            "};\n"
    },{
        "@title"        :   "Getting started using a Logger.",
        "@description"  :   "Loggers allow you to use sprintf style calls which minimizes performance "+
                            "impact when loggers are turned down or off, because the messages are not" +
                            "formatted unless they are actually logged.  The general rules of logging are "+
                            "(1) 86% of messages are DEBUG.\n"+
                            "(2) 12% of messages are INFO.\n"+
                            "(3) The remaining 2% are WARN, ERROR, and EXCEPTION.\n"+
                            "(4) Log meaningful, human readable sentences, not reverse polish...\n"+
                            "(5)Dont log position, eg 'Entering method', 'Leaving Method', We'll see how"+
                            " we can accomplish that with a Aspect using only a few lines of code.\n"+
                            "(P.S. Claypool will also log in Rhino!)" +
                            "",
        source      :   ""+
            "/**\n"+
            "* Press F12 or Ctrl+Shift+L to see the messages logged by this application.\n"+
            "**/\n"+
            "//simple messages\n"+
            "logger.debug('This is my first log message!');\n"+
            "logger.debug('This is my %s log message!', 'second');\n"+
            "logger.info('This is my %s log message! And it has %s sentences.', 'third', 'two');\n"+
            "logger.warn('This is a pretty serious message.  Better be careful...');\n"+
            "try{\n"+
            "   throw new Error('Oops');\n"+
            "}catch(e){\n"+
            "   logger.error('You made a mistake.');\n"+
            "   logger.exception(e);//formats a stack trace to the logs\n"+
            "}"
    }],
    method      :   [{
        "@name"         :   "getLogger",
        "@id"           :   "Claypool.Logging.getLogger",
        "@summary"      :   "Easily create new category loggers.",
        "@description"  :   "Normally each 'Class' has it's own logger it create inside it's constructor. "+
                            "That logger is then used throughout the class wherever logging is considered "+
                            "important or relavant.  The getLogger provides a simple static method to hide "+
                            "the details of the Logging system, simply returning a logger to you.",
        "example"       :   ""+
            "//Assumes the namespace Example.Classes is a defined namespace.\n"+
            "var Example.Classes.MyComponent = function(){\n"+
            "   //constructor \n"+
            "   this.logger = Claypool.Logging.getLogger('Example.Classes.MyComponent');\n"+
            "};\n"+
            "Example.Classes.MyComponent.prototype.someMethod = function(event){\n"+
            "   this.logger.debug('Handling event type %s.', event.type);\n"+
            "}",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com"
    }],
    clazz       :   [{
        "@name"         :   "Logger$Interface",
        "@id"           :   "Claypool.Logging.Logger$Interface",
        "@description"  :   "Application Developers often need to peer into a part of a large application "+
                            "and while a nice debugger like firebug is an amazing tool, it unfortunatly doesn't "+
                            "help in IE or in Rhino, and even in Firefox, a large application with multiple asynchronous "+
                            "data accessing happening in parallel, debuggers can be tedious.  Using loggers and understanding "+
                            "this interface will allow you to create a vertical view of the application flow. "+
                            "Think of the logger interface as the 'volume knob' that gives you the ability to throttle or "+
                            "shut off these messages when you don't want them, but easy pump up the jam when you do.",
        "@summary"      :   "Claypool exposes several interface contracts that allow "+
                            "you to develop useful implementations.  Interfaces are "+
                            "not checked and will result in runtime errors being thrown.",
        method : [ {
            "@name"         :   "debug",
            "@id"           :   "Claypool.Logging.Logger$Interface.debug",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Debug messages should account for approximately 86% of logging statements written "+
                                "into your application.  Logging messages that are meaningful, complete sentences is good practice.",
            param           :   [{
                "@name"         :    "message",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A printf style string."
            },{
                "@name"         :"...",
                "@type"         :"Any",
                "@required"     :"false",
                "@description"  :"Any number of arguments are there after treated as the objects to format into the message."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "info",
            "@id"           :   "Claypool.Logging.Logger$Interface.info",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Info messages should account for approximately 12% of logging statements written "+
                                "into your application.  Logging messages that are meaningful, complete sentences is good practice.",
            param           :   [{
                "@name"         :    "message",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A printf style string."
            },{
                "@name"         :"...",
                "@type"         :"Any",
                "@required"     :"false",
                "@description"  :"Any number of arguments are there after treated as the objects to format into the message."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "warn",
            "@id"           :   "Claypool.Logging.Logger$Interface.warn",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Warn messages should account for approximately less than 2% of logging statements written "+
                                "into your application.  Logging messages that are meaningful, complete sentences is good practice.",
            param           :   [{
                "@name"         :    "message",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A printf style string."
            },{
                "@name"         :"...",
                "@type"         :"Any",
                "@required"     :"false",
                "@description"  :"Any number of arguments are there after treated as the objects to format into the message."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "error",
            "@id"           :   "Claypool.Logging.Logger$Interface.error",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Error messages should account for approximately less than 2% of logging statements written "+
                                "into your application.  Logging messages that are meaningful, complete sentences is good practice.",
            param           :   [{
                "@name"         :    "message",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A printf style string."
            },{
                "@name"         :"...",
                "@type"         :"Any",
                "@required"     :"false",
                "@description"  :"Any number of arguments are there after treated as the objects to format into the message."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "exception",
            "@id"           :   "Claypool.Logging.Logger$Interface.exception",
            "@description"  :   "Exception stack trace logging should be used everywhere you have a catch.",
            param           :   [{
                "@name"         :    "e",
                "@type"         :    "Error",
                "@required"     :    "true",
                "@description"  :    "An exception whose stack trace is to be logged."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "NullLogger$Class",
        "@id"           :   "Claypool.Logging.NullLogger$Class",
        "@description"  :   "Logging can has some impact on performance, ussually only when debbuging and substantial "+
                            "amounts of messages are logged.  To allow loggers that are turned entirly off to have the "+
                            "absolute minimal impact on application performance, the NullLogger simple provides an " +
                            "implementation for every method which is the equivalent of 'void()'.",
        "@summary"      :   "Claypool provides this implementation for when logging is turned off.",
        "@implements"   :   "Claypool.Logging.Logger$Interface",
        method : [ {
            "@name"         :   "debug",
            "@id"           :   "Claypool.Logging.NullLogger$Class.debug",
            "@summary"      :   "Equivalent to calling void();",
            "@description"  :   "The optimal implementation the Logger$Interface for use when logging is turned entirely off.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "info",
            "@id"           :   "Claypool.Logging.NullLogger$Class.info",
            "@summary"      :   "Equivalent to calling void();",
            "@description"  :   "The optimal implementation the Logger$Interface for use when logging is turned entirely off.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "warn",
            "@id"           :   "Claypool.Logging.NullLogger$Class.warn",
            "@summary"      :   "Equivalent to calling void();",
            "@description"  :   "The optimal implementation the Logger$Interface for use when logging is turned entirely off.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "error",
            "@id"           :   "Claypool.Logging.NullLogger$Class.error",
            "@summary"      :   "Equivalent to calling void();",
            "@description"  :   "The optimal implementation the Logger$Interface for use when logging is turned entirely off.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "exception",
            "@id"           :   "Claypool.Logging.NullLogger$Class.exception",
            "@summary"      :   "Equivalent to calling void();",
            "@description"  :   "The optimal implementation the Logger$Interface for use when logging is turned entirely off.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "Logger$Class",
        "@id"           :   "Claypool.Logging.Logger$Class",
        "@description"  :   "The Logger$Class is the basic implementation if the Logger$Interface used when a logger "+
                            "is in an active category.  It optimizes performance by checkings it's level internally "+
                            "before formating and appending the message.",
        "@summary"      :   "Active Loggers use the Logger$Class implementation while inactive loggers use the NullLogger$Class "+
                            "implementation.",
        "@implements"   :   "Claypool.Logging.Logger$Interface",
        method : [ {
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Logging.Logger$Class.constructor",
            "@description"  :   "Creates a new instance of a Claypool.Logging.Logger.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new Logger."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "debug",
            "@id"           :   "Claypool.Logging.Logger$Class.debug",
            "@summary"      :   "See Claypool.Logging.Logger$Interface for method details",
            "@description"  :   "Debug messages should account for approximately 86% of logging statements written "+
                                "into your application.  Logging messages that are meaningful, complete sentences is good practice.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "info",
            "@id"           :   "Claypool.Logging.Logger$Class.info",
            "@summary"      :   "See Claypool.Logging.Logger$Interface for method details",
            "@description"  :   "Debug messages should account for approximately 12% of logging statements written "+
                                "into your application.  Logging messages that are meaningful, complete sentences is good practice.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "warn",
            "@id"           :   "Claypool.Logging.Logger$Class.warn",
            "@summary"      :   "See Claypool.Logging.Logger$Interface for method details",
            "@description"  :   "Warn messages should account for approximately less than 2% of logging statements written "+
                                "into your application.  Logging messages that are meaningful, complete sentences is good practice.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "error",
            "@id"           :   "Claypool.Logging.Logger$Class.error",
            "@summary"      :   "See Claypool.Logging.Logger$Interface for method details",
            "@description"  :   "Error messages should account for approximately less than 2% of logging statements written "+
                                "into your application.  Logging messages that are meaningful, complete sentences is good practice.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "exception",
            "@id"           :   "Claypool.Logging.Logger$Class.exception",
            "@summary"      :   "See Claypool.Logging.Logger$Interface for method details",
            "@description"  :   "Exception stack trace logging should be used everywhere you have a catch.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "LoggingFactory$Class",
        "@id"           :   "Claypool.Logging.LoggingFactory$Class",
        "@description"  :   "The Claypool.Logging.LoggerFactory builds on top of the BaseFactory, ",
        "@summary"      :   "The LoggerFactory provides the implementation for creating Loggers based on Claypool.Configuration.logging ",
        "@extends"      :   "Claypool.BaseFactory$Class",
        method          :    [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Logging.LoggerFactory$Class.constructor",
            "@description"  :   "Creates a new instance of a Claypool.Logging.LoggerFactory.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new LoggerFactory."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "updateConfigurationCache",
            "@id"           :   "Claypool.Logging.LoggingFactory$Class.updateConfigurationCache",
            "@description"  :   "Reads in the available logging configurations and caches them for "+
                                "fast access by Category.",
            "@summary"      :   "See Claypool.Configurable$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "create",
            "@id"           :   "Claypool.Logging.LoggingFactory$Class.create",
            "@description"  :   "Searches the available cached configurations for the 'closest' configured category "+
                                "or the 'root' logging configuration if matching category is found.  If no root logger "+
                                "was configured, then finally the NullLogger is returned providing the highest performance "+
                                "as no messages are ever logged, formatted, or even checked for level.",
            param           :   [{
                "@name"         :    "category",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A '.' delimited name."
            }],
            "@summary"      :   "See Claypool.Factory$Interface for parameter details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "loadConfiguration",
            "@id"           :   "Claypool.BaseFactory$Class.loadConfiguration",
            "@summary"      :   "See Claypool.Logging.LoggingFactory$Class for details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "getConfiguration",
            "@id"           :   "Claypool.Logging.LoggingFactory$Class.getConfiguration",
            "@summary"      :   "See Claypool.BaseFactory$Class for details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "setConfiguration",
            "@id"           :   "Claypool.Logging.LoggingFactory$Class.setConfiguration",
            "@summary"      :   "See Claypool.BaseFactory$Class for details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "Appender$Interface",
        "@id"           :   "Claypool.Logging.Appender$Interface",
        "@description"  :   "The Appdender is responsible for the I/O operation that writes the logging message. By "+
                            "default the Claypool provides two appenders implementations that is enough to use Logging "+
                            "with Firebug, Firebug Lite, and Rhino.  Other Appenders might include a Gear's SQLite Appender, "+
                            "and XMLHttpPost Appender and so on.",
        "@summary"      :   "Appenders define where the logger will write it's message to.",
        method : [{
            "@name"         :   "append",
            "@id"           :   "Claypool.Logging.Appender$Interface.append",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "Appends the formatted message to an I/O interface.",
            param           :   [{
                "@name"         :   "level",
                "@type"         :   "String",
                "@required"     :   "true",
                "@description"  :   "The name of the log level, eg 'DEBUG', 'INFO', etc"
            },{
                "@name"         :   "category",
                "@type"         :   "Any",
                "@required"     :   "false",
                "@description"  :   "Name of the logger category."
            },{
                "@name"         :   "message",
                "@type"         :   "Array",
                "@required"     :   "false",
                "@description"  :   "An array containting the message to be formatted and all additional objects to "+
                                    "be formatted inside it."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "ConsoleAppender$Class",
        "@id"           :   "Claypool.Logging.ConsoleAppender$Class",
        "@description"  :   "The ConsoleAppender is Claypool most basic Appender implementation, taking advantage of the "+
                            "power of Firebug and Firebug Lite.  The ConsoleAppender is the preferred default appender and "+
                            "is smart enough to check for the availability of the 'console'.  When it's not available the "+
                            "ConsoleAppender will attempt to instead return a SysOutAppender so you don't have to change "+
                            "logging configurations to switch between the browser and rhino.",
        "@summary"      :   "The ConsoleAppender requires Firebug or Firebug Lite but fails gracefully without it.",
        "@implements"   :   "Claypool.Logging.Appender$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Logging.ConsoleAppender$Class.constructor",
            "@description"  :   "Creates a new instance of a Claypool.Logging.ConsoleAppender or if 'console' is "+
                                "not available will attempt to return a new SysOutAppender.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new LoggerFactory."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "append",
            "@id"           :   "Claypool.Logging.ConsoleAppender$Class.append",
            "@summary"      :   "See Claypool.Logging.Appender$Interface for method details.",
            "@description"  :   "Appends the formatted message to an I/O interface.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "SysOutAppender$Class",
        "@id"           :   "Claypool.Logging.SysOutAppender$Class",
        "@description"  :   "The SysOutAppender is designed for being able to log with Rhino's 'print' facility "+
                            "which writes messages to Standard System.Out Java I/O.  This is particularly useful "+
                            "for server-side Claypool...",
        "@summary"      :   "The SysOutAppnder requires Rhino but fails gracefully without it.",
        "@implements"   :   "Claypool.Logging.Appender$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Logging.SysOutAppender$Class.constructor",
            "@description"  :   "Creates a new instance of a Claypool.Logging.SysOutAppender or Rhino is not detected "+
                                "will throw a Claypool.Logging.NoAppendersAvailableError to ensure that the NullLogger "+
                                "implementation is used to minimize the cost of logging (which would be pointless with no "+
                                "where to write the message too!)",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object wich is deeply extended by the resulting new LoggerFactory."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "append",
            "@id"           :   "Claypool.Logging.ConsoleAppender$Class.append",
            "@summary"      :   "See Claypool.Logging.Appender$Interface for method details.",
            "@description"  :   "Appends the formatted message to an I/O interface.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "Formatter$Interface",
        "@id"           :   "Claypool.Logging.Formatter$Interface",
        "@description"  :   "The Formatter is responsible for combining the printf style message and args "+
                            "in a single reslting object.  In may optionally add additional information, like a timestamp, "+
                            "the category, and any additional wrapper (for example it might just provide a single string ) "+
                            "or wrap it with XML or trun it into JSON.  Appenders own the formatter to ensure that the appender "+
                            "is provided with a format meaningful to it.",
        method : [{
            "@name"         :   "format",
            "@id"           :   "Claypool.Logging.Formatter$Interface.format",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@description"  :   "The format method can return any valid javascript object, though the most usual resulting format " +
                                "is a String.",
            param           :   [{
                "@name"         :   "level",
                "@type"         :   "String",
                "@required"     :   "true",
                "@description"  :   "The name of the log level, eg 'DEBUG', 'INFO', etc"
            },{
                "@name"         :   "category",
                "@type"         :   "Any",
                "@required"     :   "false",
                "@description"  :   "Name of the logger category."
            },{
                "@name"         :   "objects",
                "@type"         :   "Array",
                "@required"     :   "false",
                "@description"  :   "An array containting the message to be formatted and all additional objects to "+
                                    "be formatted inside it."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "FireBugFormatter$Class",
        "@id"           :   "Claypool.Logging.FireBugFormatter$Class",
        "@description"  :   "The Firebug Formatter simple takes advantage of the fact that Firebug is available and trusts " +
                            "it to format the message into a string.",
        "@summary"      :   "Requires the presence of Firebug or Firebug Lite.",
        "@implements"   :   "Claypool.Logging.Formatter$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Logging.FireBugFormatter$Class.constructor",
            "@description"  :   "",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new FireBugFormatter."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "format",
            "@id"           :   "Claypool.Logging.FireBugFormatter$Class.format",
            "@summary"      :   "See Claypool.Logging.Formatter$Interface for method details.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "DefaultFormatter$Class", 
        "@id"           :   "Claypool.Logging.DefaultFormatter$Class",
        "@description"  :   "The DefaultFormatter basically duplicates for Rhino or any other simple I/O interface, "+
                            "what Firebug would otherwise provide.",
        "@implements"   :   "Claypool.Logging.DefaultFormatter$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Logging.DefaultFormatter$Class.constructor",
            "@description"  :   "",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new DefaultFormatter."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "format",
            "@id"           :   "Claypool.Logging.DefaultFormatter$Class.format",
            "@summary"      :   "See Claypool.Logging.Formatter$Interface for method details.",
            "@description"  :   "",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    }],
    exception   :   [{
        "@name"         :   "ConfigurationError$Class",
        "@id"           :   "Claypool.Logging.ConfigurationError$Class",
        "@extends"      :   "Claypool.ConfigurationError$Class",
        "@description"  :   "ConfigurationError can occur when trying to load a logging configuration.",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.Logging.ConfigurationError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.Logging.ConfigurationError",
            "@id"       :   "Claypool.Logging.ConfigurationError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.Logging.ConfigurationError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.Logging.ConfigurationError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.ConfigurationError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    }]
};
