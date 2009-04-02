
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    $$Web.WebProxyServlet = function(options){
        $$.extend(this, $$Web.Servlet);
        this.rewriteMap = null;//Array of Objects providing url rewrites
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.WebProxyServlet");
        this.router = new $$.Router();
        this.strategy = this.strategy||"first";
        this.logger.debug("Compiling url rewrites %s.", this.rewriteMap);
        this.router.compile(this.rewriteMap, "urls");//, "rewrite");
    };
    
    $.extend($$Web.WebProxyServlet.prototype, 
        $$Web.Servlet.prototype,{
        handleGet: function(request, response){
            this.logger.debug("Handling proxy: %s", request.requestURI);
            var _this = this;
            var proxyURL = this.router[this.strategy||"all"]( request.requestURI );
            request.headers["Claypool-Proxy"] = this.proxyHost||"127.0.0.1";
			var params = {};
			for (var prop in request.parameters){
				this.logger.debug("request.parameters[%s]=%s", prop, request.parameters[prop]);
				params[prop+'']=request.parameters[prop]+'';
			}
            if(proxyURL && proxyURL.length && proxyURL.length > 0){
                _this.logger.debug("Proxying get request to: %s", proxyURL[0].payload.rewrite);
                $.ajax({
                    type:"GET",
                    dataType:"text",
                    async:false,
                    data:params,
                    url:proxyURL[0].payload.rewrite+'',
                    beforeSend: function(xhr){
                        _this.logger.debug("Copying Request headers for Proxied Request");
                        for(var header in request.headers){
                            _this.logger.debug("Setting proxied request header %s: %s",header, request.headers[header] );
                            if(header == 'host'){continue;}
                            xhr.setRequestHeader(header, request.headers[header]);
                        }
                        response.headers = {};
                    },
                    success: function(text){
                        _this.logger.debug("Got response for proxy.");
                        response.body = text;
                        _this.logger.debug("Setting Response Status 200.");
                        response.headers.status = 200;
                    },
                    error: function(xhr, status, e){
                        _this.logger.error("Error proxying request. STATUS: %s", status?status:"UNKNOWN");
                        if(e){_this.logger.exception(e);}
                        response.headers.status = 500;
                    },
                    complete: function(xhr, status){
                        _this.logger.debug("Proxy Request Complete, Copying response headers");
                        var proxyResponseHeaders = xhr.getAllResponseHeaders();
                        var responseHeader;
                        var responseHeaderMap;
                        _this.logger.debug("Complete Proxy response header: \n %s" ,proxyResponseHeaders);
                        proxyResponseHeaders = proxyResponseHeaders.split("\r\n");
                        for(var i = 0; i < proxyResponseHeaders.length; i++){
                            responseHeaderMap = proxyResponseHeaders[i].split(":");
                            try{
                                _this.logger.debug("setting response header %s %s", responseHeaderMap[0], responseHeaderMap.join(":"));
                                response.headers[responseHeaderMap.shift()] = responseHeaderMap.join(":");
                            }catch(e){
                                _this.logger.warn("Unable to set a proxied response header");
                                _this.logger.exception(e);
                            }
                        }
                        response.headers["Claypool-Proxy"] = proxyURL[0].payload.rewrite;
                        response.headers["Content-Encoding"] = proxyURL[0].payload.contentEncoding||"";
                        if(proxyURL[0].payload.contentType){
                            //override the content type
                            response.headers["Content-Type"] = proxyURL[0].payload.contentType;
                        }
                    }
                });
            }
            return response;
        }
    });
    
})(  jQuery, Claypool, Claypool.Server );
