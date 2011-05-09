
(function($, $$, $$Web){

    var log,
        console;
    
    $.extend($, {
        /**
         * 
         * @param {Object} request
         * @param {Object} response
         */
        serve: function(request, response){ 
            var prop;
            log = log||$.logger("Claypool.Server");
            log.info("Handling global request routing for request: %s ", request.requestURL).
                 debug("Dispatching request to Server Sevlet Container");
            response.headers = {};
            $.extend( response.headers, { 'Content-Type':'text/html; charset=utf-8', status: -1 });
            response.body = "";
            try{
                log.debug('serving request event');
                $(document).trigger("claypool:serve",[ request, response ]);
                
                log.debug('finished serving request event');
                //Hope for the best
                if(response.headers.status === -1){
                    response.headers.status = 200;
                    if(!response.body){
                        response.headers.status = 404;
                        response.body = "<html><head></head><body><h1>jQuery-Claypool Server Error</h1>";
                        response.body += "<p>"+
                            "Not Found :\n\t"+request.requestURL+
                        "</p></body></html>";
                        
                    }
                }
            }catch(e){
                log.error("Error Handling Request.").exception(e);
                response.headers["Content-Type"] = "text/html; charset=utf-8";
                response.headers.status = 500;
                response.body = "<html><head></head><body><h1>jQuery-Claypool Server Error</h1>";
                
                response.body += "<h2>Error Details</h2>";
                for(prop in e){
                    response.body += 
                        '<strong>'+prop+'</strong><br/>'+
                        '<span>'+e[prop]+'</span><br/>';
                }
                response.body += "<h2>General Request Details</h2>";
                for(prop in request){
                    response.body += 
                        '<strong>'+prop+'</strong><br/>'+
                        '<span>'+request[prop]+'</span><br/>';
                } 
                response.body += "<h2>Request Header Details</h2>";
                for(prop in request.headers){
                    response.body += 
                        '<strong>'+prop+'</strong><br/>'+
                        '<span>'+request.headers[prop]+'</span><br/>';
                }
                response.body += "</body></html>";
            }
        },
        /**
         * 
         * @param {Object} target
         */
		servlet: function(target){
            log = log||$.logger("Claypool.Server");
            log.debug('Applying servlet pattern to %s', target);
            $$.extend(target, $$Web.Servlet);
        },
        /**
         * 
         * @param {Object} options
         */
        proxy: function(options){
            return $.invert([{ 
                id:options.id||'proxy_'+$$.uuid(),    
                clazz:"Claypool.Server.WebProxyServlet", 
                options:[{
                    rewriteMap:options.rewrites
                }]
            }]);
        }
    });
    
    /**@global*/
    ClaypoolServerHandler = $.serve;
    
    
})(  jQuery, Claypool, Claypool.Server );
