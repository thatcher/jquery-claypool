
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    var log;
    /**
     * @constructor
     */
    $$Web.WebProxyServlet = function(options){
        $$.extend(this, $$Web.Servlet);
        this.rewriteMap = null;//Array of Objects providing url rewrites
        $.extend(true, this, options);
        log = $.logger("Claypool.Server.WebProxyServlet");
        this.router = new $$.Router();
        this.strategy = this.strategy||"first";
        log.debug("Compiling url rewrites %s.", this.rewriteMap);
        this.router.compile(this.rewriteMap, "urls");//, "rewrite");
    };
    $.extend($$Web.WebProxyServlet.prototype, 
        $$Web.Servlet.prototype,{
        handleGet: function(request, response){
            var options = _proxy.route(request, this);
            var proxyURL = options.proxyURL,
                params   = options.params;
            if(proxyURL && proxyURL.length && proxyURL.length > 0){
                log.debug("Proxying get request to: %s", proxyURL[0].payload.rewrite);
                $.ajax({
                    type:"GET",
                    dataType:"text",
                    async:false,
                    data:params,
                    url:proxyURL[0].payload.rewrite+'',
                    beforeSend:function(xhr){_proxy.beforeSend(request, response, xhr);},
                    success:function(text){_proxy.success(response, text);},
                    error: function(xhr, status, e){_proxy.error(response, xhr, status, e);},
                    complete: function(xhr, status){_proxy.complete(response, proxyURL, xhr, status);}
                });
            }
            return response;
        },
        handlePost:function(request, response){
            var options = _proxy.route(request, this);
            var proxyURL = options.proxyURL,
                params   = options.params;
            if(proxyURL && proxyURL.length && proxyURL.length > 0){
                log.debug("Proxying post request to: %s", proxyURL[0].payload.rewrite);
                $.ajax({
                    type:"POST",
                    dataType:"text",
                    async:false,
                    data:params,
                    url:proxyURL[0].payload.rewrite+'',
                    beforeSend:function(xhr){_proxy.beforeSend(request, response, xhr);},
                    success:function(text){_proxy.success(response, text);},
                    error: function(xhr, status, e){_proxy.error(response, xhr, status, e);},
                    complete: function(xhr, status){_proxy.complete(response, proxyURL, xhr, status);}
                });
            }
            return response;
        }
    });
    
    
    var _proxy = {
        route:function(request, options){
            log.debug("Handling proxy: %s", request.requestURI);
            var proxyURL = options.router[options.strategy||"all"]( request.requestURI );
            request.headers["Claypool-Proxy"] = options.proxyHost||"127.0.0.1";
			var params = {};
			for (var prop in request.parameters){
				log.debug("request.parameters[%s]=%s", prop, request.parameters[prop]);
				params[prop+'']=request.parameters[prop]+'';
			}
            var body = (request.body&&request.body.length)?request.body:'';
            return {
                proxyURL:proxyURL,
                params:params,
                body:body
            };
        },
        beforeSend: function(request, response, xhr){
            log.debug("Copying Request headers for Proxied Request");
            for(var header in request.headers){
                log.debug("Setting proxied request header %s: %s",header, request.headers[header] );
                xhr.setRequestHeader(header, request.headers[header]);
            }
            response.headers = {};
        },
        success: function(response, text){
            log.debug("Got response for proxy \n %s.", text);
            response.body = text+'';
        },
        error: function(response, xhr, status, e){
            log.error("Error proxying request. STATUS: %s", status?status:"UNKNOWN");
            if(e){log.exception(e);}
            response.body = xhr.responseText+'';
        },
        complete: function(response, proxyURL, xhr, status){
            log.debug("Proxy Request Complete, Copying response headers");
            var proxyResponseHeaders = xhr.getAllResponseHeaders();
            var responseHeader;
            var responseHeaderMap;
            log.debug("Complete Proxy response header: \n %s" ,proxyResponseHeaders);
            proxyResponseHeaders = proxyResponseHeaders.split("\r\n");
            for(var i = 0; i < proxyResponseHeaders.length; i++){
                responseHeaderMap = proxyResponseHeaders[i].split(":");
                try{
                    log.debug("setting response header %s %s", responseHeaderMap[0], responseHeaderMap.join(":"));
                    response.headers[responseHeaderMap.shift()] = responseHeaderMap.join(":");
                }catch(e){
                    log.warn("Unable to set a proxied response header");
                    log.exception(e);
                }
            }
            log.debug('response status (%s)', xhr.status);
            response.headers.status = Number(xhr.status);
            response.headers["Claypool-Proxy"] = proxyURL[0].payload.rewrite+'';
            response.headers["Content-Encoding"] = proxyURL[0].payload.contentEncoding||"";
            response.headers["Transfer-Encoding"] = proxyURL[0].payload.transferEncoding||"";
            if(proxyURL[0].payload.contentType){
                //override the content type
                response.headers["Content-Type"] = proxyURL[0].payload.contentType+'';
            }
        }
    };
    
})(  jQuery, Claypool, Claypool.Server );
