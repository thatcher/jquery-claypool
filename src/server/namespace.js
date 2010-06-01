
Claypool.Server={
/*
 * Claypool.Server @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008-2010 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Server (Servlet-ish) Patterns  -
 */
};


(function($, $$, $$Web){
    
    var log;
    
    $.router( "hijax:server", {
        event:          'claypool:serve',
        strategy:       'first',
        routerKeys:     'urls',
        hijaxKey:       'request',
        eventNamespace: "Claypool:Server:HijaxServerController",
        target:     function(event, request, response){ 
            log = log||$.logger('Claypool.Server');
            log.debug('targeting request event');
            event.request = request;
            event.response = response;
            event.write = function(str){
                log.debug('writing response.body : %s', str);
                response.body = str+''; 
                return this;
            };
            event.writeln = function(str){
                log.debug('writing line to response.body : %s', str);
                response.body += str+'';
                return this;
            };
            return request.requestURL+'';
        },
        normalize:  function(event){
            //adds request parameters to event.params()
            //normalized state map
            return $.extend({},event.request.parameters,{
                parameters:event.request.parameters,
                method: event.request.method,
                /*body: event.request.body,*/
                headers: $.extend(event.response.headers, event.request.headers)
            });
        }
    });
    
    
    $$.Services = {
        // An object literal plugin point for providing plugins on
        // the Claypool namespace.  This object literal is reserved for
        // services which have been integrated as well established
        // and have been included in the jQuery-Clayool repository
        // as official
    };
    
})(  jQuery, Claypool, Claypool.Server );
