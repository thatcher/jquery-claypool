
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
            return $.extend({},event.request.parameters, {
                parameters:event.request.parameters,
                method: event.request.method,
                body: event.request.body,
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
              $$.MVC.Controller.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        //We reduce to a single response handler function because it's not easy to
        //support the asynch stuff on the server side
        
        handle: function(event){
            //data is just the routing info that got us here
            //the request and response is really all we care about
            var method = event.params('method').toUpperCase(); 
            event.params('headers').status = 200;
             
            this.logger.debug("Handling %s request", method);
            switch(method){
                case 'GET':
                    this.handleGet(event, event.response);break;
                case 'POST':
                    this.handlePost(event, event.response);break;
                case 'PUT':
                    this.handlePut(event, event.response);break;
                case 'DELETE':
                    this.handleDelete(event, event.response);break;
                case 'HEAD':
                    this.handleHead(event, event.response);break;
                case 'OPTIONS':
                    this.handleOptions(event, event.response); break;
                default:
                    this.logger.debug("Unknown Method: %s, rendering error response.",  method );
                    this.handleError(event, "Unknown Method: " + method, new Error() );
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet: function(event){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(event){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePut: function(event){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleDelete: function(event){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleHead: function(event){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleOptions: function(event){
            throw new $$.MethodNotImplementedError();
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleError: function(event, msg, e){
            this.logger.warn("The default error response should be overriden");
            event.headers.status = 300;
            event.response.body = msg?msg:"Unknown internal error\n";
            event.response.body += e&&e.msg?e.msg+'':(e?e+'':"\nUnpsecified Error.");
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
        //we include $'s json plugin as a default implementation
        //when present
        this.js2json = $.js2json && $.isFunction($.js2json)?
            $.js2json:options.js2json;
        this.json2js = $.json2js && $.isFunction($.json2js)?
            $.json2js:options.json2js;
    };
    
    $.extend( $Web.RestServlet.prototype, 
              $Web.Servlet.prototype, {
        handleGet: function( event ){
            var _this=  this,
			    domain= event.params( 'domain' ),
                id=     event.params( 'id' ),
                query=  event.params( 'q' ),
                ids=    id ? id.split( ',' ) : [],
                select;
                
            log.debug("Handling GET for %s %s", domain, id);
            if( query ){
                //treat as a 'find' operation
                log.debug('finding results with url constructed query %o', 
                    event.params());
                this.db.find($.extend({
                    data:event.params('values'),
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(xhr, status, e){
                        handleError(event, result, _this);
                    }
                }, event.params()));
            }else if(!domain && !id){
                //response is an array of all domain names
                this.db.get($.extend({
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                }, event.params()));
            }else if(domain && (ids.length > 1 || !id)){
                log.debug("Handling GET for %s %s", domain, ids);
                if(ids.length > 1){
                    //response is batch get of items by id
                    this.db.get($.extend(event.params(),{
                        id: ids,
                        domain:domain,
                        async: false,
                        success: function(result){
                            handleSuccess(event, result, _this);
                        },
                        error: function(result){
                            handleError(event, result, _this);
                        }
                    }));
                }else{
                    log.debug("getting list of item ids for domain %s", domain, id);
                    //response is list of item names for the domain
                    this.db.get($.extend({
                        domain:domain,
                        async: false,
                        success: function(result){
                            handleSuccess(event, result, _this);
                        },
	                    error: function(result){
	                        handleError(event, result, _this);
	                    }
                    }, event.params()));
                }
            }else if(domain && id && id!='metadata'){
                //response is the record
                this.db.get({
                    domain: domain,
                    id: id,
                    async: false,
                    dataType:'text',
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(domain && id && id == 'metadata'){
                this.db.metadata({
                    domain: domain,
                    id: id,
                    async: false,
                    dataType:'text',
                    success:function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }
        },
        handlePost: function(event){
            var _this = this,
			    domain = event.params('domain'),
                id = event.params('id'),
                ids,
                item,
                items,
                query;
            log.debug("Handling POST for %s %s", domain, id).
                debug("Reading POST body %s", event.body);
            
            if(domain && id){
                if(!event.params('body')){
                    //just a 'get' on an array of ids (where array is very large)
                    ids = id.split(',');
                    
                    //response is batch get of items by id
                    this.db.get($.extend(event.params(),{
                        id: ids,
                        domain:domain,
                        async: false,
                        success: function(result){
                            handleSuccess(event, result, _this);
                        },
                        error: function(result){
                            handleError(event, result, _this);
                        }
                    }));
                }else{
                    //create a new record(s)
                    log.debug('updating single object', event.request.body);
                    item = this.json2js(event.request.body);
                    this.db.update({
                        domain: domain,
                        id:id,
                        data:item,
                        async: false,
                        success: function(result){
                            handleSuccess(event, result, _this);
                        },
                        error: function(result){
                            handleError(event, result, _this);
                        }
                    });
                }
            }else if(domain && !id){
                log.debug('updating array of objects (bulk save)');
                items = this.json2js(event.request.body);
    			this.db.update({
                    domain: domain,
                    data: items,
                    async: false,
					batch: true,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(!domain && !id){
                //is is a general query string or a json
                //serialization used to build a query
                //dynamically - use the content-type
                //header
                query = event.request.body;
                if(event.request.contentType.match('application/json')){
                    query = this.json2js(query);
                }
                log.debug('executing query \n%s', query);
                this.db.find($.extend({
                    select:query,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                }, event.params()));
            }
            
        },
        handlePut: function(event){
            var _this = this,
			    id = event.params('id');
                domain = event.params('domain');
            log.debug("Handling PUT for %s %s", domain);
            if(domain && id){
                //create a new record(s)
                log.debug('saving single object', event.request.body);
                item = this.json2js(event.request.body);
                this.db.save({
                    domain: domain,
                    id:id,
                    data:item,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(domain && event.request.body){
                log.debug('saving array of objects (bulk save)');
                items = this.json2js(event.request.body);
                this.db.save({
                    domain: domain,
                    data: items,
                    async: false,
                    batch: true,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(domain){
                //create a new domain
                this.db.create({
                    domain: domain,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }
        },
        handleDelete: function(event){
            var _this = this,
			    domain = event.params('domain'),
                id = event.params('id');
            log.debug("Handling DELETE for %s %s", domain, id);

            if(domain && id){
                //delete an item
                this.db.remove({
                    domain: domain,
                    id:id,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }else if(domain && !id){
                //delete a domain
    			this.db.destroy({
                    domain: domain,
                    async: false,
                    success: function(result){
                        handleSuccess(event, result, _this);
                    },
                    error: function(result){
                        handleError(event, result, _this);
                    }
                });
            }
        }
    });
    
    var handleSuccess = function(event, result, servlet){
        var body =  servlet.js2json(result, null, '   ');
        log.debug('succeeded. %s', body);
        event.response.headers = {
            status:         200,
            'Content-Type': 'text/javascript; charset=utf-8'
        };
        event.response.body = body;
    };
    
    
    var handleError = function(event, result, servlet){
        var body =  servlet.js2json(result, null, '    ');
        log.error('failed. %s', body);
        event.response.headers ={
            status : result.code?result.code:500,
            'Content-Type': 'text/javascript; charset=utf-8'
        };
        event.response.body = body?body:"{'error':{"+
            "'code'  : 500,"+
            "'type'  : 'UnknownClaypoolRestError',"+
            "'msg'   : 'unknown error, check network'"+
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
        handleGet: function(event, response){
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
                    beforeSend:function(xhr){_proxy.beforeSend(event.request, response, xhr);},
                    success:function(text){_proxy.success(response, text);},
                    error: function(xhr, status, e){_proxy.error(response, xhr, status, e);},
                    complete: function(xhr, status){_proxy.complete(response, proxyURL, xhr, status);}
                });
            }
            return response;
        },
        handlePost:function(event, response){
            var options = _proxy.route(event.request, this);
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
                    beforeSend:function(xhr){_proxy.beforeSend(event.request, response, xhr);},
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
 * @author thatcher
 */
(function($, $$, $S){

    var log,
        db;
    
    $S.Manage = function(options){
        $.extend(true, this, options);
        log = $.logger('Claypool.Services.Manage');
        db = $$.Models.Factory();
    };
    
    $.extend($S.Manage.prototype, {
        handle:function(event){
            var command = event.params('command'),
                target = event.params('target');
            log.debug("handling command %s %s", command, target);
            $$.Commands[command](target, event);
            if(('reset' == command)||('syncdb' == command)){
                log.debug('forwarding to rest service');
                event.response.headers =  {
                    status:   302,
                    "Location": '/rest/'
                };
            }
        }
    });
    
    $.extend( true, $$.Commands, {
        reset: function(targets){
            var domains;
            db.get({
                async: false,
                success: function(result){
                    domains = result.domains;
                    log.debug('loaded domains');
                },
                error: function(xhr, status, e){
                    log.error('failed to get db domains');
                }
            });
            //drops domains (tables) for each model
            $(domains).each(function(index, domain){
                db.destroy({
                    domain: domain,
                    async: false,
                    success: function(result){
                        log.info('destroyed domain %s', domain);
                    },
                    error: function(xhr, status, e){
                        log.error('failed to delete domain %s', domain);
                    }
                });
            });
        },
        syncdb: function(targets){
            //creates domain (tables) for each model
            var data,
                data_url = $.env('initialdata')+'dump.json?'+$.uuid(),
                domain;
                
            log.info('loading initial data from %s', data_url);
            $.ajax({
                type:'get',
                async:false,
                url:data_url,
                dataType:'text',
                success:function(_data){
                    data = $.json2js(_data);
                    log.info('loaded initial data');
                },
                error:function(xhr, status, e){
                    log.error('failed [%s] to load initial data %s', status, e);
                }
            });
            
            for(domain in data){
                db.create({
                    domain: domain,
                    async:false,
                    success:function(result){
                        log.info('created domain %s', domain);
                    }
                });
                db.save({
                    async:false,
                    batch:true,
                    domain: domain,
                    data:data[domain],
                    success: function(){
                        log.info('batch save successful %s ', domain);
                    },
                    error: function(){
                        log.error('batch save failed %s', domain);
                    }
                });
            }
        },
        dumpdata: function(targets, event){
            var data = {};
            var domains;
                
            db.get({
                async: false,
                success: function(result){
                    domains = result.domains;
                    log.debug('loaded domains');
                },
                error: function(xhr, status, e){
                    log.error('failed to get db domains');
                }
            });
            
            $(domains).each(function(i, domain){
                db.find({
                    select:"new Query('"+domain+"')",
                    async: false,
                    success: function(result){
                        log.info('found %s entries in %s', result.data.length, domain);
                        data[domain] = result.data;
                    },
                    error: function(xhr, status, e){
                        ok(false, 'failed load entries from %s', domain);
                    }
                });
            });
            
            event.write($.js2json(data, null, '    '));
            event.response.headers =  {
                status:   200,
                'Content-Type':'application/json'
            };
        }
    });

})(jQuery, Claypool, Claypool.Services);

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
                id:options.id||'proxy_'+$.uuid(),    
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
