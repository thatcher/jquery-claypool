
(function($){
	$.merge($.Configuration.logging, [ {
            category:"example",
            level:"NONE",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"example.app",
            level:"ERROR",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"example.app.view",
            level:"DEBUG",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"example.app.model",
            level:"INFO",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"example.app.controller",
            level:"WARN",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"Claypool",
            level:"ERROR",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"Claypool.IoC",
            level:"INFO",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"Claypool.MVC",
            level:"INFO",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"Claypool.MVC.AbstractHijaxController",
            level:"DEBUG",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"Claypool.AOP",
            level:"DEBUG",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"Claypool.Tests",
            level:"DEBUG",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"Claypool.Window",
            level:"DEBUG",
            appender:"Claypool.Logging.ConsoleAppender"
        }, {
            category:"root",
            level:"NONE",
            appender:"Claypool.Logging.ConsoleAppender"
        }]);
})(jQuery);

