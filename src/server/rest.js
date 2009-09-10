
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
