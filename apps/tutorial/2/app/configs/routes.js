(function($){
   
   $.mvc({
        "hijax:a" : [{
            id:"#example-hash-routes",
            active:false,
            filter:"[href*=#example]",
            hijaxMap:
               [{urls:"page/|:id|$",   controller:"#pagesController"}]
        }]
    });
    
})(jQuery);
    
