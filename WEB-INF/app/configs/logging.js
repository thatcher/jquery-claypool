/**
 * ClaypoolSite @VERSION - 
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */

(function($){ 
    
   $.logging([
        { category:"Site",                       level:"DEBUG" },
        { category:"Site.Models",                level:"INFO" },
        { category:"Site.Views",                 level:"DEBUG" },
        { category:"Site.Controllers",           level:"DEBUG" },
        { category:"Site.Service",               level:"DEBUG" },
        { category:"Claypool",                   level:"WARN" },
        { category:"Claypool.Application",       level:"WARN" },
        { category:"Claypool.Server",            level:"WARN" },
        { category:"Claypool.MVC",               level:"WARN" },
        { category:"Claypool.IoC",               level:"WARN" },
        { category:"Claypool.AOP",               level:"WARN" },
        { category:"jQuery.E4X",                 level:"INFO" },
        { category:"root",                       level:"WARN" }
    ]);     
	
})(jQuery);
    
