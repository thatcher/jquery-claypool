
/**
 * @author thatcher
 */
(function($, $$, $M, $Web){
    
    var log;
	
	//TODO: event.response.* must be replaced with event.write, event.writeln,
	//		and event.headers (headers are echoed based on request and new headers 
	//		add onto, or overwrite, request headers with additional response headers)
    
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
