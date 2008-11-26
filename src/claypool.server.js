Claypool.Server={
/*
 * Claypool.Server @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Server (Servlet) Patterns  -
 */
};
(function($, $Log, $MVC, $Web){
	jQuery(document).bind("claypool:hijax", function(event, _this, registrationFunction, configuration){
		registrationFunction.apply(_this, [configuration, "hijax:server", "Claypool.MVC.HijaxController", {
            event:          'claypool:serve',
            strategy:       'first',
            routerKeys:     'urls',
            hijaxKey:       'request',
            eventNamespace: "Claypool:Server:HijaxServerController",
            getTarget:     function(event, request){ 
            	return request.url;//request/response object
        	}
        }]);
    });
	
    
	$.extend($Web, {
	    logger: null,
	    serve: function(request, response){
    		$Web.log = $Web.log||$Log.getLogger("Claypool.Server");
	        $Web.log.info("Handling global request routing for request: %s ", request.requestURL).
	        	 debug("Dispatching request to Server Sevlet Container");
	        response.headers = {};
	        $.extend( response.headers, { contentType:'text/html', status: 404 });
            response.body = "<html><head></head><body>"+
                "Not Found :\n\t"+request.requestURL+
            "</body></html>";
	        try{
	            jQuery(document).trigger("claypool:serve",[
	        	    {url:request.requestURL},
	                request, response
	            ]);
            }catch(e){
                $Web.log.error("Error Handling Request.").exception(e);
                response.headers.contentType = "text/html";
                response.headers.status = 500;
                response.body = "<html><head></head><body>"+e+"</body></html>";
            }
	    },
	    render: function(request, response){
            $Web.log.debug("Finished Handling global request : %s  response %o", request.requestURL, response);
		},
		
	    Servlet$Abstract:{
	        constructor: function(options){
	            $.extend( this, new $MVC.Controller(options));
	            $.extend( this, $Web.Servlet$Abstract);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.Server.Servlet");
	        },
	        //We reduce to a single response handler function because it's not easy to
	        //support the asynch stuff on the server side
	        handle: function(event, mvc, data, request, response){
	        	//data is just the routing info that got us here
	        	//the request and response is really all we care about
	        	mvc.w = {
	        	    write: function(str){response.body = str; return this;},
	        	    append: function(str){response.body += str;return this;}
	        	};
	            try{
	                switch(request.method.toUpperCase()){
	                    case 'GET':
	                        this.logger.debug("Handling GET request");
	                        this.handleGet(request, response, mvc);
	                        this.logger.debug("Finished Handling GET request. Setting status 200.");
                            response.headers.status = 200;
	                        break;
	                    case 'POST':
	                        this.logger.debug("Handling POST request");
	                        this.handlePost(request, response, mvc);
	                        break;
	                    case 'PUT':
	                        this.logger.debug("Handling PUT request");
	                        this.handlePut(request, response, mvc);
	                        break;
	                    case 'DELETE':
	                        this.logger.debug("Handling DELETE request");
	                        this.handleDelete(request, response, mvc);
	                        break;
	                    case 'HEAD':
	                        this.logger.debug("Handling HEAD request");
	                        this.handleHead(request, response, mvc);
	                        break;
	                    case 'OPTIONS':
	                        this.logger.debug("Handling OPTIONS request");
	                        this.handleOptions(request, response, mvc);
	                        break;
	                    default:
	                        this.logger.debug("Unknown Method: %s, rendering error response.",  request.method);
	                        this.handleError(request, response, "Unknown Method: " + request.method );
	                }
	            } catch(e) {
	                this.logger.exception(e);
	                this.handleError(request, response, "Caught Exception in Servlet handler", e);
	            }finally{
	                $Web.render(request, response);
	            }
	        },
	        handleGet: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handlePost: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handlePut: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handleDelete: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handleHead: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handleOptions: function(request, response){
	            throw new Error("Method not implemented");
	        },
	        handleError: function(request, response, msg, e){
	            this.logger.warn("The default error response should be overriden");
	            response.headers.status = 300;
	            response.body = msg?msg:"Unknown internal error\n";
	            response.body += e&&e.msg?e.msg:(e?e:"\nUnpsecified Error.");
	        },
	        resolve: function(data){
	            this.logger.warn("The default resolve response is meant to be overriden to allow the rendering of a custom view.");
	            return data.response;
	        }
	    },
	    WebProxyServlet$Class : {
	        rewriteMap:null,//Array of Objects providing url rewrites
	        constructor: function(options){
	            $.extend( this, new $Web.Servlet(options));
	            $.extend( this, $Web.WebProxyServlet$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.Server.WebProxyServlet");
	            this.router = new $.Router();
	            this.strategy = this.strategy||"first";
	            this.logger.debug("Compiling url rewrites %s.", this.rewriteMap);
	            this.router.compile(this.rewriteMap, "urls");//, "rewrite");
	        },
	        handleGet: function(request, response){
	            var _this = this;
	            this.logger.debug("Handling proxy: %s", request.requestURI);
	            var proxyURL = this.router[this.strategy||"all"]( request.requestURI );
	            request.headers["Claypool-Proxy"] = this.proxyHost||"127.0.0.1";
	            if(proxyURL && proxyURL.length && proxyURL.length > 0){
	                _this.logger.debug("Proxying get request to: %s", proxyURL[0].payload.rewrite);
	                jQuery.ajax({
	                    type:"GET",
	                    dataType:"text",
	                    async:false,
	                    data:request.parameters,
	                    url:proxyURL[0].payload.rewrite,
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
	                        response.body = text;//xml.toString();
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
	    }
	});
	/**@global*/
	ClaypoolServerHandler = $Web.serve;
	//Some server side classes that are otherwise not used on the client
	/**@constructorAlias*/
	$Web.Servlet                 		= $Web.Servlet$Abstract.constructor;
	/**@constructorAlias*/
	$Web.WebProxyServlet                 = $Web.WebProxyServlet$Class.constructor;
})( Claypool,/*Required Modules*/
	Claypool.Logging,
	Claypool.MVC,
	Claypool.Server );
	
//Give a little bit, Give a little bit of our web server to you. ;)
(function($){ 
	$.Server = Claypool.Server; 
})(jQuery);
