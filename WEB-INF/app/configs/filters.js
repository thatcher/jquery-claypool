/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($){

    var log;
    
    $.filters([{
        id        : "#requestResponseParamFilter",
        target    : "ClaypoolJS.Services.*",
        before    : "([a-z]*)",
        advice    : function(event){
            log = log||$.logger('ClaypoolJS.Filters');
            log.debug('Adding normalized event state to event scoped model');
            var params = event.params('parameters');
            
            event.
                m({admin:('admin' in params)?true:false }).
                m(event.params());
        }
    },{
        id        : "#contentNegotiationFilter",
        target    : "ClaypoolJS.Views.*",
        around    : "(render)",
        advice    : function(invocation){
            log = log||$.logger('ClaypoolJS.Filters');
            log.debug('Intercepted call to render');
            var model = invocation.arguments[0],
                view = invocation.object;
            if(model.parameters.fo == 'json'){
                model.headers['Content-Type']='text/javascript';
                return view.write($.json(model, null, '\t'));
                //do not proceed
            }else if(model.parameters.fo == 'xml'){
                model.headers['Content-Type']='application/xml';
                return view.write($.x({x:model}));
                //do not proceed
            }else{
                if('template' in model)
                    model.template += '?'+new Date().getTime();
                return invocation.proceed();
            }
        }
    }]);

})(jQuery);
    
