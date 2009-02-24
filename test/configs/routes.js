
(function($, $$){
	$.merge($$.Configuration.mvc["hijax:a"], [{
        id:"$testLinkRouter01",
        filter:"[href*=#]",//default value 
        active:true,//default value
        preventDefault:true,     //default value
        stopPropagation:true,    //default value
        hijaxMap:
          [{urls:"#testLink01",    controller:"#testLinkController01"  },//default action:"handle"
           {urls:"#testLink02",    controller:"#testLinkController02"  },//default action:"handle"
           {urls:"#testLink03",    controller:"#testLinkController03"  },//default action:"handle"
           {urls:"#testLink04",    controller:"#testLinkController04",   action:"action04"},
           {urls:"#testLink05",    controller:"#testLinkController05",   action:"action05"},
           {urls:"#testLink05",    controller:"#testLinkController06",   action:"action06"}]
           /*TODO: Some realistic urls of regexp matching
           {urls:"http://www.yahoo.com/\$"        ,controller:"#testLinkController",  action:"flip"},
           {urls:"http://www.yahoo.com/(\\w+)\$"  ,controller:"#testLinkController2", action:"flop"},
           {urls:"\^#(\\w+)"                      ,controller:"#catchHashController", action:"goop"}]*/
   }]);
})(jQuery, Claypool);

(function($, $$){
	$.merge($$.Configuration.mvc["hijax:form"], [{
       id:"$testFormRouter01",
       filter:"",//default value 
       active:true,//default value
       preventDefault:true,     //default value
       stopPropagation:true,    //default value
       hijaxMap://This could be confusing becuase the form action is what we call url
          [{urls:"testForm01",    controller:"#testFormController01"  },//default action:"handle"
           {urls:"testForm02",    controller:"#testFormController02"  },//default action:"handle"
           {urls:"testForm03",    controller:"#testFormController03"  },//default action:"handle"
           {urls:"testForm04",    controller:"#testFormController04",   action:"action04"},
           {urls:"testForm05",    controller:"#testFormController05",   action:"action05"},
           {urls:"testForm05",    controller:"#testFormController06",   action:"action06"}]
           /*TODO: Some realistic urls and examples of regexp matching
           [{urls:"http://www.yahoo.com/"  ,controller:"#testFormController",    action:"redirectToGoogle"},
           {urls:"/bar?(\\w*)param=(\\w)" ,controller:"#barQueryController",    action:"ajaxOpenSearch"},
           {urls:"\^foo\$"                ,controller:"#exactMatchController",  action:"blah"}]*/
   }]);
})(jQuery, Claypool);


(function($, $$){
	$.merge($$.Configuration.mvc["hijax:event"], [{
       id:"$testEventRouter01",
       filter:"",               //default value
       active:true,             //default value
       preventDefault:true,     //default value
       stopPropagation:true,    //default value
       hijaxMap:
          [{event:"testEvent01",    controller:"#testEventController01"  },//default action:"handle"
           {event:"testEvent02",    controller:"#testEventController02"  },//default action:"handle"
           {event:"testEvent03",    controller:"#testEventController03"  },//default action:"handle"
           {event:"testEvent04",    controller:"#testEventController04",   action:"action04"},
           {event:"testEvent05",    controller:"#testEventController05",   action:"action05"},
           {event:"testEvent05",    controller:"#testEventController06",   action:"action06"}]
   }]);
})(jQuery, Claypool);


