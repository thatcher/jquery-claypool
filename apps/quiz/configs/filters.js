/**
 * Example @VERSION - 
 *
 * Copyright (c) 2008-2009 ClayoolJS
 *
 */
(function($){
   $.config("aop", [
        //-------------------------------------------------------------------------------------//
        //  -   FILTERS     -
        //  - Filters allow you to attach methods that will be called before, after, or
        //  - around (before and after) methods that are called inside your application.
        //  - The name 'filter' is actually a simple name for whats really going on, which
        //  - is called Aspect Oriented Programming.  
        //  
        //  - Ids must be unique, and only the the first filter with a given id will be applied.
        //
        //  - The target of the filter can either be a class (eg a function) which can be
        //  - optionally prefixed by a namespace, or a reference to a specific instance
        //  - managed by the application.  In the later case, use the 'ref://' prefix to
        //  - let Claypool know you mean a specific instance.
        //
        //  - The type of advice can either be before, after, or around and it's value
        //  - is treated as a regular expression which enables you to apply a filter
        //  - to a number of methods with a single configuration.
        //
        //  - The advice is the function that will be called to provide the filtering.  This
        //  - can either be a function specified inline, or a string specifying the name
        //  - of a function that will be resolved (optionally namespaced) to provide the
        //  - filter.
        /*{
            id        : "#testAspect00",
            target    : "TestFixture",
            after     : "fixtureFunction00",
            advice    : "TestAdvice"
        },
        {
            id        : "#exampleLoggingFilter",
            target    : "Example.Controllers.*",
            around    : ".",
            advice    : function(){
                return;
            }
        }*/
        //_____________________________________________________________________________________//
    ]);  
})(jQuery);
    
