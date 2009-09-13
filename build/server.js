
Claypool.Server={
/*
 * Claypool.Server @VERSION@ - A Web 1.6180339... Javascript Application Framework
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
(function($, $$, $$Web){
    
    $.router( "hijax:server", {
        event:          'claypool:serve',
        strategy:       'first',
        routerKeys:     'urls',
        hijaxKey:       'request',
        eventNamespace: "Claypool:Server:HijaxServerController",
        target:     function(event, request){ 
            return request.url;//request/response object
        }
    });
    
    
})(  jQuery, Claypool, Claypool.Server );


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
    $$Web.Servlet = function(options){
        $$.extend(this, $$.MVC.Controller);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.Servlet");
    };
    
    $.extend( $$Web.Servlet.prototype,
        $$.MVC.Controller.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        //We reduce to a single response handler function because it's not easy to
        //support the asynch stuff on the server side
        handle: function(event, data, request, response){
            //data is just the routing info that got us here
            //the request and response is really all we care about
            response = $.extend(true, response, event, {
                write: function(str){response.body = str; return this;},
                append: function(str){response.body += str;return this;}
            });
            response.headers.status = 200;
            try{
                switch(request.method.toUpperCase()){
                    case 'GET':
                        this.logger.debug("Handling GET request");
                        this.handleGet(request, response);
                        break;
                    case 'POST':
                        this.logger.debug("Handling POST request");
                        this.handlePost(request, response);
                        break;
                    case 'PUT':
                        this.logger.debug("Handling PUT request");
                        this.handlePut(request, response);
                        break;
                    case 'DELETE':
                        this.logger.debug("Handling DELETE request");
                        this.handleDelete(request, response);
                        break;
                    case 'HEAD':
                        this.logger.debug("Handling HEAD request");
                        this.handleHead(request, response);
                        break;
                    case 'OPTIONS':
                        this.logger.debug("Handling OPTIONS request");
                        this.handleOptions(request, response);
                        break;
                    default:
                        this.logger.debug("Unknown Method: %s, rendering error response.",  request.method);
                        this.handleError(request, response, "Unknown Method: " + request.method );
                }
            } catch(e) {
                this.logger.exception(e);
                this.handleError(request, response, "Caught Exception in Servlet handler", e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePut: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleDelete: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleHead: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleOptions: function(request, response){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleError: function(request, response, msg, e){
            this.logger.warn("The default error response should be overriden");
            response.headers.status = 300;
            response.body = msg?msg:"Unknown internal error\n";
            response.body += e&&e.msg?e.msg:(e?e:"\nUnpsecified Error.");
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        resolve: function(data){
            this.logger.warn("The default resolve response is meant to be overriden to allow the rendering of a custom view.");
            return data.response;
        }
    });
    
})(  jQuery, Claypool, Claypool.Server );

/**
 * @author thatcher
 */
(function($, $$, $M, $Web){
    
    var log;
    
    $Web.RestServlet = function(options){
        $$.extend(this, $Web.Servlet);
        $.extend(true, this, $M.Factory(options));
        log = $.logger('Claypool.Server.RestServlet');
        //they must provide a object which implements
        //the methods js2json and json2js
        //we include jsPath's json plugin as a default implementation
        //when present
        this.js2json = jsPath&&jsPath.js2json&&$.isFunction(jsPath.js2json)?
            jsPath.js2json:options.js2json;
        this.json2js = jsPath&&jsPath.json2js&&$.isFunction(jsPath.json2js)?
            jsPath.json2js:options.json2js;
    };
    
    $.extend($Web.RestServlet.prototype, 
            $Web.Servlet.prototype,{
        handleGet: function(request, response){
            var _this = this,
			    domain = response.params('domain'),
                id = response.params('id'),
                ids,
                select;
            log.debug("Handling GET for %s %s", domain, id);
            if(!domain && !id){
                //response is an array of all domain names
                this.db.get({
                    async: false,
                    success: function(result){
                        response.headers.status = 200;
                        response.body = _this.js2json(
                            $.extend(result, response.params())
                        );
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }else if(domain && !id){
                log.debug("Handling GET for %s %s", domain, request.params);
                for(var param in request.parameters){
                    log.debug('param[%s]=%s', param, request.parameters[param]);
                }
                if(request.parameters&&('id' in request.parameters)){
                    log.debug("LIST OF ITEMS!!!");
                    //response is batch get of items by id
                    ids = request.parameters.id.split(',');
                    select = 'select * from `'+domain+'` where itemName() in (\''+
                        ids.join("','")+
                    '\')';
                    log.debug("%s",select);
                    this.db.find({
                        select: select,
                        async: false,
                        success: function(result){
                            response.headers.status = 200;
                            response.body = _this.js2json(
                                $.extend(result, response.params())
                            );
                        },
	                    error: function(result){
	                        handleError(result, response, _this);
	                    }
                    });
                }else{
                    log.debug("LIST OF ITEM NAMES!!!", domain, id);
                    //response is list of item names for the domain
                    this.db.find({
                        select: "select itemName() from `"+domain+"`",
                        async: false,
                        success: function(result){
                            response.headers.status = 200;
                            response.body = _this.js2json(
                                $.extend(result, response.params())
                            );
                        },
	                    error: function(result){
	                        handleError(result, response, _this);
	                    }
                    });
                }
            }else if(domain && id && id!='metadata'){
                //response is the record
                this.db.get({
                    domain: domain,
                    id: id,
                    async: false,
                    dataType:'text',
                    success: function(result){
                        response.headers.status = 200;
                        response.body = _this.js2json(
                            $.extend(result, response.params())
                        );
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }else if(domain && id && id == 'metadata'){
                this.db.metadata({
                    domain: domain,
                    id: id,
                    async: false,
                    dataType:'text',
                    success:function(result){
                        response.headers.status = 200;
                        response.body = _this.js2json(
                            $.extend(result, response.params())
                        );
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }
        },
        handlePost: function(request, response){
            var _this = this,
			    domain = response.params('domain'),
                id = response.params('id'),
                item,
                items,
                query;
            log.debug("Handling POST for %s %s", domain, id).
                debug("Reading POST body %s", request.body);
            
            if(domain && id){
                //create a new record(s)
                log.debug('saving single object', request.body);
                item = this.json2js(request.body);
                this.db.save({
                    domain: domain,
                    id:id,
                    data:item,
                    async: false,
                    replace: ('update' in request.parameters)?false:true,
                    success: function(result){
                        var body = _this.js2json(
                            $.extend(result, response.params())
                        );
                        log.debug('response %s', body);
                        response.headers.status = 200;
                        response.body = body;
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }else if(domain && !id){
                log.debug('saving array of objects (bulk save)');
                items = this.json2js(request.body);
    			this.db.save({
                    domain: domain,
                    data: items,
                    async: false,
					batch: true,
                    replace: ('update' in request.parameters)?false:true,
                    success: function(result){
                        response.headers.status = 200;
                        response.body = _this.js2json(
                            $.extend(result, response.params())
                        );
                        log.debug('resultset %s', response.body);
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }else if(!domain && !id){
                //is is a general query string or a json
                //serialization used to build a query
                //dynamically - use the content-type
                //header
                query = request.body;
                if(request.contentType.match('application/json')){
                    query = js2query(this.json2js(query));
                }
                log.debug('executing query \n%s', query);
                this.db.find({
                    select:query,
                    async: false,
                    success: function(result){
                        response.headers.status = 200;
                        response.body = _this.js2json(
                            $.extend(result, response.params())
                        );
                        log.debug('resultset %s', response.body);
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }
            
        },
        handlePut: function(request, response){
            var _this = this,
			    domain = response.params('domain');
            log.debug("Handling PUT for %s %s", domain);
            if(domain){
                //create a new domain
                this.db.create({
                    domain: domain,
                    async: false,
                    success: function(result){
                        response.headers.status = 200;
                        response.body = _this.js2json(
                            $.extend(result, response.params())
                        );
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }
        },
        handleDelete: function(request, response){
            var _this = this,
			    domain = response.params('domain'),
                id = response.params('id');
            log.debug("Handling DELETE for %s %s", domain, id);

            if(domain && id){
                //delete an item
                this.db.remove({
                    domain: domain,
                    id:id,
                    async: false,
                    success: function(result){
                        response.headers.status = 200;
                        response.body = _this.js2json(
                            $.extend(result, response.params())
                        );
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }else if(domain && !id){
                //delete a domain
    			this.db.destroy({
                    domain: domain,
                    async: false,
                    success: function(result){
                        response.headers.status = 200;
                        response.body = _this.js2json(
                            $.extend(result, response.params())
                        );
                    },
                    error: function(result){
                        handleError(result, response, _this);
                    }
                });
            }
        }
    });
    
    var handleError = function(result, response, servlet){
        var body =  servlet.js2json(result);
        log.error('failed. %s', body);
        response.headers.status = result.$code?result.$code:500;
        response.body = body?body:
              "{'db$error':{"+
                "'$code'  : 500,"+
                "'$type'  : 'UnknownClaypoolWrapperError',"+
                "'$msg'   : 'unknown error, check network'"+
               "}}";
    };
    
    
})(jQuery, Claypool, Claypool.Models, Claypool.Server);

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
    $$Web.ConsoleServlet = function(options){
        $$.extend( this, $$Web.Servlet);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.ConsoleServlet");
    };
    
    $.extend($$Web.ConsoleServlet.prototype, 
        $$Web.Servlet.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            var retval = "ok";
            try{
                this.logger.info("Executing command :\n%s", request.body);
                retval = eval(String(request.body));
                retval = (retval===undefined)?"ok":retval;
                this.logger.info("Finished Executing command :\n%s", request.body);
                response.body = retval||"error: see server logs.";
            }catch(e){
                this.logger.error("Error executing command. \n\n%s", request.body).
                    exception(e);
                response.body = e.toString();
            }
            response.body = retval;
            response.headers["Content-Type"] = "text/plain";
            response.headers.status = 200;
            return response;
        }
    });
        
    
})(  jQuery, Claypool, Claypool.Server );


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
    $$Web.Console = function(options){
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.Console");
    };
    
    $.extend($$Web.Console.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        run: function(command){
            var _this = this;
            $.ajax({ 
                type:'POST',  
                url:'console/',   
                processData:false,  
                contentType:'text', 
                data:command,
                success:function(response){
                    _this.logger.info(response);
                },
                error: function(xhr, status, e){
                    _this.logger.error("Error sending command (%s)", s).exception(e);
                }
            });
        }
    });
        
    
})(  jQuery, Claypool, Claypool.Server );


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
    //TODO There should be some useful errors so we can handle common issues
    //like error pages for 500's, 404's etc
	
})(  jQuery, Claypool, Claypool.Server );


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
    //TODO : what is the useful static plugin that could be derived from Claypool.Server?
    //      console ?
    var $log;
    
    var console;
    
    $.extend($, {
        '>' : function(command){
            console = console || new $$Web.Console();
            console.run(command);
        },
        serve: function(request, response){ 
            $log = $log||$.logger("Claypool.Server");
            $log.info("Handling global request routing for request: %s ", request.requestURL).
                 debug("Dispatching request to Server Sevlet Container");
            response.headers = {};
            $.extend( response.headers, { contentType:'text/html', status: 404 });
            response.body = "<html><head></head><body>"+
                "Not Found :\n\t"+request.requestURL+
            "</body></html>";
            try{
                $(document).trigger("claypool:serve",[
                    {url:request.requestURL},
                    request, response
                ]);
            }catch(e){
                $log.error("Error Handling Request.").exception(e);
                response.headers["Content-Type"] = "text/html";
                response.headers.status = 500;
                response.body = "<html><head></head><body>"+e||"Unknown Error"+"</body></html>";
            }
        },
		servlet: function(target){
            $$.extend(target, $$Web.Servlet);
        }
		/*,
        //TODO this is deprecated
        render: function(request, response){
            $log.debug("Finished Handling global request : %s  response %o", request.requestURL, response);
        }*/
    });
    
    /**@global*/
    ClaypoolServerHandler = $.serve;
    
    
})(  jQuery, Claypool, Claypool.Server );
