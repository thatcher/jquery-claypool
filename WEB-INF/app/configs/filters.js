/**
 *
 * Copyright (c) 2008-2009 ClaypoolJS
 *
 */
(function($, _){

    var log;
    
    
    $.filters([
        {
            id        : "#contentNegotiationFilter",
            target    : "Site.Views.*",
            around    : "(render)",
            advice    : function(invocation){
                log = log||$.logger('Site.Filters.ContentNegotiation');
                log.debug('Intercepted call to render');
                var model = invocation.arguments[0];
                if(model.parameters && model.parameters.fo == 'json'){
                    invocation.object.write(_.json(model, null, '\t'));
                    //do not proceed
                }else{
                    invocation.proceed();
                }
            }
        },
        {
            id        : "#requestResponseParamFilter",
            target    : "Site.Services.*",
            before    : "(handleGet|handlePost|handleDelete|handlePut)",
            advice    : function(request, response){
                log = log||$.logger('Site.Filters.ContentNegotiation');
                log.debug('Intercepted call to handleHTTPMethod');
                response.m({
                    parameters:request.parameters,
                    requestHeaders:request.headers,
                    responseHeaders: response.headers
                });
            }
        }
    ]);

})(jQuery, jsPath);
    
