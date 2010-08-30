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
        { category:"ClaypoolJS.Models",          level:"INFO" },
        { category:"ClaypoolJS.Views",           level:"INFO" },
        { category:"ClaypoolJS.Controllers",     level:"DEBUG" },
        { category:"ClaypoolJS.Services",        level:"DEBUG" },
        { category:"ClaypoolJS.Filters",         level:"DEBUG" },
        { category:"Claypool",                   level:"WARN" },
        { category:"Claypool.Server",            level:"INFO" },
        { category:"Claypool.MVC",               level:"INFO" },
        { category:"Claypool.IoC",               level:"INFO" },
        { category:"Claypool.AOP",               level:"INFO" },
        { category:"jQuery.E4X",                 level:"INFO" },
        { category:"root",                       level:"ERROR" }
    ]);     
	
})(jQuery);
    
