/**
 * Example @VERSION - 
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
//  -   BOOT THE APP  -
jQuery.noConflict();
(function($){
    
    //A static logger for any initialization routines we might add here
    var log = $.logger("Site");
    
    //The environments are described in environments.js
    try{
       //$.env('defaults', "dev.server");
 	   $.env('defaults', "appengine.server");
       
 	}catch(e){
 	   log.error("Environmental selection is invalid!").exception(e);
 	}
    
    $(document).ready(function(){
        log.info("Initializing Application");
        $.boot(function(){
          //you can do additional initialization here
            log.info("Successfully Initialized Application");
            //preload all application data
            $.$('#docsModel').get();
            $.$('#releasesModel').get();
            $.$('#newsModel').get();
            $.$('#eventsModel').get();
            $.$('#examplesModel').get();
        });
    });    
    
})(jQuery);  
