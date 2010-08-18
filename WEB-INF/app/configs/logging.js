/**
 * ClaypoolJS @VERSION - 
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 * dont confuse the Claypool and ClaypoolJs namespace.  the ClaypoolJS namespace 
 * is only used for the website.
 */

(function($){ 
    
   $.logging([
        { category:"ClaypoolJS",                 level:"DEBUG" },
        { category:"ClaypoolJS.Models",          level:"DEBUG" },
        { category:"ClaypoolJS.Views",           level:"DEBUG" },
        { category:"ClaypoolJS.Controllers",     level:"DEBUG" },
        { category:"ClaypoolJS.Service",         level:"DEBUG" },
        { category:"Claypool",                   level:"DEBUG" },
        { category:"Claypool.Server",            level:"DEBUG" },
        { category:"Claypool.MVC",               level:"DEBUG" },
        { category:"Claypool.IoC",               level:"DEBUG" },
        { category:"Claypool.AOP",               level:"DEBUG" },
        { category:"jQuery.E4X",                 level:"DEBUG" },
        { category:"root",                       level:"DEBUG" }
    ]);     
	
})(jQuery);
    
