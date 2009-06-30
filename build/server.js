
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
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$Web){
    /**
     * @constructor
     */
    $$Web.ReSTScaffold = function(options){
        $$.extend(this, $$Web.Servlet);
        $.extend( true, this, options);
        this.logger = $.logger("Claypool.Server.ReSTScaffold");
        this.Model  = $.$(options.model);
    };
    
    $.extend($$Web.ReSTScaffold.prototype,
        $$Web.Servlet.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet:function(request, response){
            var instance, id$format, 
                _this = this, p = request.requestURL;
            if(p){
                id$format = p.match(/(\d+)\.(\w+)$/);
                if(id$format){
                    //Find an existing record
                    this.logger.debug("Getting Instance %", id$format[1]);
                    instance = new this.Model(Number(id$format[1]));
                    response.body = this.Model.serialize(instance, id$format[2]);
                    response.headers["Content-Type"] =
                        "text/"+id$format[2];
                }else{
                    id$format = p.match(/(\w+)$/);
                    if(id$format){
                        p.replace(/(\w+)$/, function(url, action){
                            _this.logger.debug("using custom action : %s", action);
                            if($.isFunction(_this[action])){
                                _this[action](request, response);
                            }
                            return action;
                        });
                        return response;
                    }else{
                        //the search is a good catch-all for a get
                        this.search(request,response);
                    }
                }
                this.chooseView(request, response);
            }
            return response;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        search: function(request, response){
            this.logger.debug("Searching for records.");
            var searchTerms =  request.parameters.searchTerms||'*',
                itemsPerPage = Number(request.parameters.itemsPerPage||40),
                startIndex =   Number(request.parameters.startIndex||0), 
                offsetIndex =  Number(request.parameters.offsetIndex||0),
                startPage =    Number(request.parameters.startPage||0),
                language = "en-US",
                inputEncoding = "utf-8",
                outputEncoding = "utf-8",
                results = [],
                filter,
                i;
            for (var param in request.parameters ){
                this.logger.debug("checking for filter % ", param);
                for(i=0;i<this.Model._meta.fields.length;i++){
                    if(this.Model._meta.fields[i].fieldName == param){
                        this.logger.debug("adding filter % = ? (%)", param, request.parameters[param]);
                        filter = filter? filter.filter(param + " = ?", request.parameters[param]):
                            this.Model.filter(param + " = ?", request.parameters[param]);
                    }
                }
            }
            filter = filter ? filter : this.Model.all();
            if(searchTerms == "*"){
                results =   filter.
                            limit(itemsPerPage).
                            offset((startPage*itemsPerPage)+offsetIndex+startIndex).
                            toArray();
                for(i=0;i<results.length;i++){
                    results[i] = this.Model.serialize(results[i]);
                }
                this.logger.debug("Found %s results from search.", results.length);
                response.m({
                    xmlns$opensearch    : "http://a9.com/-/spec/opensearch/1.1/",
                    searchTerms         : searchTerms,
                    startPage           : startPage,
                    totalResults        : results.length,
                    startIndex          : startIndex,
                    itemsPerPage        : itemsPerPage,
                    results             : results
                });
            }
            
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            var instance, newuser, id$format, p = request.requestURL,
                _this = this;
            this.logger.debug("ReSTService POST: \n%s", request.body);
            if(p){
                if(p.match(/(\d+)\.(\w+)$/)){
                    id$format = p.match(/(\d+)\.(\w+)$/);
                    //Update an existing record
                    this.logger.debug("Updating Instance %", id$format[1]);
                    instance = this.Model(Number(id$format[1]));
                    //UPDATE
                    newinstance = this.Model.deserialize(request.body, id$format[2]);
                    newinstance = new this.Model(newinstance);
                    newinstance.setPkValue(instance.getPkValue());
                    this.Model.transaction(function(){
                        instance.remove();
                        newinstance.save();
                    });
                    response.body = newinstance.getPkValue();
                    response.headers.status = 200;
                    response.headers["Content-Type"] = "text/plain";
                }else if(p.match(/(new)\.(\w+)$/)){
                    id$format = p.match(/(new)\.(\w+)$/);
                    this.logger.debug("Saving New Instance (formatted as %s) \n%s ", id$format[2], request.body);
                    newinstance = this.Model.deserialize(request.body, id$format[2]);
                    newinstance = new this.Model(newinstance);
                    this.logger.debug("Deserialized new instance %s ", newinstance);
                    //SAVE
                    newinstance.save();
                    response.body = newinstance.getPkValue();
                    response.headers.status = 200;
                    response.headers["Content-Type"] = "text/plain";
                }else if(p.match(/search$/)){
                    this.search(request,response);
                    this.chooseView(request, response);
                }else {
                    p.replace(/(\w+)$/, function(url, action){
                        _this.logger.debug("using custom action : %s", action);
                        if($.isFunction(_this[action])){
                            _this[action](request, response);
                        }
                        return action;
                    });
                }
            }
            this.logger.debug("POST RESPONSE \n %s", response.body);
            return response;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleDelete: function(request, response){
            var instance, id$format, p = request.requestURL;
            if(p){
                id$format = p.match(/(\d+)\.(\w+)$/);
                if(id$format){
                    //Delete an existing record
                    this.logger.debug("Deleting Instance %", id$format[1]);
                    instance = this.Model.find(id$format[1]);
                    instance.remove();
                    response.body = "";
                    response.headers.status = 200;
                    response.headers["Content-Type"] = "text/plain";
                }
            }
            return response;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        chooseView:function(request, response){
            var p = request.requestURL;
            if(p.match(/atom$/)){
                response.headers.status = 200;
                response.headers["Content-Type"] = "application/atom+xml";
                response.v('.atom');
            }else if(p.match(/xml$/)){
                response.headers.status = 200;
                response.headers["Content-Type"] = "text/xml";
                response.v('.xml');
            }else if(p.match(/xhtml$/)){
                response.headers.status = 200;
                response.headers["Content-Type"] = "text/html";
                response.v('.xhtml');
            }else{
                response.headers.status = 200;
                response.headers["Content-Type"] = "text/json";
                response.v('.json');
            }
            response.render();
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
                        _this.logger.debug("Got response for proxy \n %s.", text);
                        response.body = text;
                    },
                    error: function(xhr, status, e){
                        _this.logger.error("Error proxying request. STATUS: %s", status?status:"UNKNOWN");
                        if(e){_this.logger.exception(e);}
                        response.body = xhr.responseText;
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
    $$Web.E4XServlet = function(options){
        $$.extend(this,$$Web.Servlet);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.E4XServlet");
    };
    
    $.extend($$Web.E4XServlet.prototype,
        $$Web.Servlet.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet: function(request, response){
            var _this = this;
            //for this service we use the a json string as the model
            if(!typeof(response.m('postparams')) == "string"){
                //no model has been set by a post
                if($.isFunction($.js2json)){
                    response.m("postparams", $.js2json(request.parameters));
                }else{
                    response.m("postparams","{}");
                }
            }
            try{
                this.logger.info("Loading E4X from url :\n%s", request.requestURI);
                $.ajax({ 
                    type:'GET',  
                    url:(this.baseURI||"./")+request.requestURI, 
                    dataType:"text/plain",
                    async:false,
                    success:function(text){
                        _this.logger.info("Successfully retreived E4X :\n%s \n Evaluating with model %s",
                            request.requestURI, response.m("postparams"));
                        var e4x = eval("(function(){"+
                            "var model = "+response.m("postparams")+";"+
                            "return new XMLList(<>"+text+"</>);"+
                        "})();");
                        response.body = e4x.toString();
                        response.headers["Content-Type"] = "text/html";
                        response.headers.status = 200;
                        _this.logger.info("Finished Evaluating E4X :\n%s", request.requestURI);
                    },
                    error:function(xhr, status, e){
                        _this.logger.info("Error retreiving E4X :\n%s", request.requestURI);
                        response.body = "<html><head></head><body>"+e||"Unknown Error"+"</body></html>";
                        response.headers["Content-Type"] = "text/html";
                        response.headers.status = 200;
                    }
                });
            }catch(e){
                this.logger.error("Error evaluating. \n\n%s", request.requestURI).
                    exception(e);
                response.body = e.toString();
            }
            return response;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            response.m("postparams",String(request.body));//should be a json string
            return this.handleGet(request,response);
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
        _ : function(command){
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
        }/*,
        //TODO this is deprecated
        render: function(request, response){
            $log.debug("Finished Handling global request : %s  response %o", request.requestURL, response);
        }*/
    });
    
    /**@global*/
    ClaypoolServerHandler = $.serve;
    
    
})(  jQuery, Claypool, Claypool.Server );
