/**
 * Example @VERSION - 
 *
 * Copyright (c) 2008-2009 ClayoolJS
 *
 */
//-------------------------------------------------------------------------------------//
//  -   ROUTERS     -
//  - Routers are low level controllers that hijax the browsers/servers normal behaviour 
//  - forwarding control to a high level controller that you've written.  In particular
//  - we use links, form sumbission, and events (Claypool.Server includes support
//  - for http request routing).
//  -
//  - Also it's important to note that you dont have to use these low level controllers,
//  - but they help to reduce the memory consumption of an application because the
//  - high level controllers are not created until needed.
//  -
//  - Both links and forms can be hijaxed using regular expression matches to the
//  - href and action atrribute respectively. 
//  - 
//  - When no action is specified for a given controller, the default method 'handle'
//  - will be called.
//_____________________________________________________________________________________//
 
(function($){
   $.config("mvc",{
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
        /*//Hijax Buttons
        "hijax:button": [{
            id:"#example-button-routes",
            hijaxMap:
              [{ids:"question/|:id|",       controller:"#quizController",     action:"goto"}]  
        }]
        //Hijax Events
        "hijax:event": [{
            id:"#example-event-routes",
            hijaxMap:
              [{event:"Splash",             controller:"#indexController"},
               {event:"Reset",              controller:"#indexController",      action:"home"},
               {event:"Logout",             controller:"#userController",       action:"logout"}]  
        }]*/
    });
})(jQuery);
    
