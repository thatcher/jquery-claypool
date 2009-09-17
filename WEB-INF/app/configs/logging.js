/**
 * ClaypoolSite @VERSION - 
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */

(function($){ 
    
   $.logging([
        { category:"Site",                       level:"INFO" },
        { category:"Site.Models",                level:"INFO" },
        { category:"Site.Views",                 level:"DEBUG" },
        { category:"Site.Controllers",           level:"DEBUG" },
        { category:"Site.Service",               level:"DEBUG" },
        { category:"Claypool",                   level:"WARN" },
        { category:"Claypool.Application",       level:"WARN" },
        { category:"Claypool.Server",            level:"INFO" },
        { category:"Claypool.MVC",               level:"INFO" },
        { category:"Claypool.IoC",               level:"INFO" },
        { category:"Claypool.AOP",               level:"WARN" },
        { category:"jQuery.E4X",                 level:"INFO" },
        { category:"root",                       level:"WARN" }
    ]);     
	
})(jQuery);
    
