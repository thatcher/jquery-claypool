/**
 * Example @VERSION - 
 *
 * Copyright (c) 2008-2009 ClayoolJS
 *
 */
 
(function($){
   $.mvc({
        "hijax:a" : [{
            id:"#example-hash-routes",
            active: true,
            filter:"[href*=#]",
			stopPropagation:true,
			preventDefault:true,
            strategy:"first",
            hijaxMap:
               [{urls:"examples/|:id|/$",   controller:"#quizController",      action:"show"}]
        }],
        //Hijax Forms
        "hijax:form": [{
            id:"#example-form-routes",
            active: true,
            filter:"[action*=example]",
			stopPropagation:true,
			preventDefault:true,
            hijaxMap:
              [{urls:"score$",         		controller:"#quizController",      action:"score"}] 
        }]
    });
})(jQuery);
    
