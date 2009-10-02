
(function($){ 
    
   $.logging([
        { category:"Example",               level:"INFO" },
        { category:"Example.Models",        level:"DEBUG" },
        { category:"Example.Views",         level:"DEBUG" },
        { category:"Example.Controllers",   level:"DEBUG" },
        { category:"Claypool",              level:"INFO"  },
        { category:"Claypool.MVC",          level:"INFO" },
        { category:"root",                  level:"WARN"  }
    ]);     
	
})(jQuery);
    
