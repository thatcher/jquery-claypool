/**
 * @author thatcher
 */
(function($,$$,$M){
    
    var log;
    
    $M.RestClient = function(options){
        //they must provide a object which implements
        //the methods js2json and json2js
        //we include $'s json plugin as a default implementation
        //when present
        this.js2json = $&&$.js2json&&$.isFunction($.js2json)?
            $.js2json:options.js2json;
        this.json2js = $&&$.json2js&&$.isFunction($.json2js)?
            $.json2js:options.json2js;
        $.extend(true, this, options);
        this.resturl = $.env('resturl')?$.env('resturl'):'/rest/';
		log = $.logger('Claypool.Models.RestClient');
    };
   
   $.extend($M.RestClient.prototype, {
       /**
        *     create,
        *         creates the domain for storage of items
        *     destroy,
        *         deletes the domain and all items in it
        *     save,
        *         save a single item or many items
        *     remove, 
        *     load 
        *         - operates on id an optional object (id, object) 
        */
       create: function(options){
           $.ajax($.extend({},options,{
                type: 'PUT',
                url: this.resturl+this.name+'/',
                dataType:'json',
                success: function(result){
                    _success('created data domain (%s)', options.success, result);
                },
                error: function(xhr, status, e){
                    _error('failed to create data domain', options.error, xhr, status, e);
                }
            }));
            return this;
       },
       destroy: function(options){
           $.ajax($.extend({},options,{
                type: 'DELETE',
                url: this.resturl+this.name+'/',
                dataType:'json',
                success: function(result){
                    _success('destroyed data domain', options.success, result);
                },
                error: function(xhr, status, e){
                    _error('failed to destroy data domain', options.error, xhr, status, e);
                }
            }));
            return this;
        },
        save: function(options){
            var id,
                i;
            if(!options.batch&&options.id){

                if(options.serialize){
                   options.data = this.serialize(options.data);
                }
                $.ajax($.extend({},options,{
                    type: options.update?'POST':'PUT',
                    url: (this.resturl+this.name+'/'+options.id),
                    data: this.js2json(options.data),
                    contentType:'application/json',
                    dataType:'json',
                    processData:false,
                    success: function(result){
                        _success('saved data to domain', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('failed to save data to domain', options.error, xhr, status, e);
                    }
               }));
            }else if(options.batch){
                //process as a batch save
                //batch is an object of objects, each
                //property name corresponding to the id
                //and each property value corresponding
                //to the item to be saved
				if(options.serialize){
	                for(i=0;i<options.data.length;i++){
	                    options.data[i] = this.serialize(options.data[i]);
	                }
				}
                
                $.ajax($.extend({},options,{
                    type: options.update?'POST':'PUT',
                    url: (this.resturl+this.name +'/'),
                    data: this.js2json(options.data),
                    contentType:'application/json',
                    processData:false,
                    dataType:'json',
                    success: function(result){
                        _success('saved batch data to domain', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('failed to save batch data to domain', options.error, xhr, status, e);
                    }
               }));
           }
            return this;
       },
       update:function(options){
           //saves additional fields to the object.
           this.save($.extend({},options,{update: true}));
           return this;
       },
       remove: function(options){
           
           if(options.id){
               $.ajax($.extend({},options,{
                   type: 'DELETE',
                   url: this.resturl+this.name+'/'+options.id,
                   data:(options.data instanceof Array)?
                           {data:options.data.join(',')}:
                           (options.data instanceof Object)?
                           options.data:
                           null,
                   dataType:'json',
                   success: function(result){
                       _success('removed item or item data from domain', options.success, result);
                   },
                   error: function(xhr, status, e){
                       _error('failed to delete item or item data from domain', options.error, xhr, status, e);
                   }
               }));
           }
            return this;
       },
       get: function(options){
           var ids,
               params = {
                   limit:options.limit ? Number(options.limit) : 1000,
                   start:options.start ? Number(options.start) : 1,
                   offset: options.offset ? Number(options.offset) : 0,
                   from: options.from ? options.from : ''
               };
           if(options.id && typeof options.id == 'string'){
               $.ajax($.extend({},options,{
                   type: 'GET',
                   url: this.resturl+this.name+'/'+options.id,
                   dataType:'json',
                   data: params,
                   success: function(result){
                       _success('retrieved data by id from domain', options.success, result);
                   },
                   error: function(xhr, status, e){
                       _error('failed to retrieved data by id from domain', options.error, xhr, status, e);
                   }
               }));
           }else if(options.id&&options.id.length){
               //batch get of items specified by array of id
               ids = options.id.join(',');
               $.ajax($.extend({},options,{
                   type: ids.length>1024?'POST':'GET',
                   url: this.resturl+this.name+'/',
                   data: $.extend(params, {id:ids}),
                   dataType:'json',
                   success: function(result){
                       _success('successfully for data by ids from domain', options.success, result);
                   },
                   error: function(xhr, status, e){
                       _error('failed to get data by ids from domain', options.error, xhr, status, e);
                   }
               }));
           }else{
                //get an array of items in the models domain
                $.ajax($.extend({},options,{
                    type: 'GET',
                    url: this.resturl+this.name+'/',
                    dataType:'json',
                    data: params,
                    success: function(result){
                        _success('loaded list of ids from domain', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('failed to list ids from domain ', options.error, xhr, status, e);
                    }
                }));
            }
            return this;
        },
        find: function(options){
            //allow language specific queries to be hand
            //constructed and used here by simply passing 
            //the query as a string.  the server will
            //use content negotiation to determine whether
            //to treat it as json serialized or a native query
            if(options.select){
                if(typeof options.select == 'object'){
                    if(!(options.select instanceof $M.Query)){
                        //using shorthand object notation to define the query
                        //so go ahead and create an internal Query object from
                        //it.
                        options.select = new $M.Query(options.select);
                    }
                    //set the context for the query if its not a native
                    //query string
                    options.select.context = this.name;
                }
                $.ajax($.extend({},options,{
                    type: 'POST',
                    url: this.resturl,
                    data: (typeof options.select == 'string') ?
                        options.select : 
                        this.js2json( $.extend(options.data||{}, options.select)),
                    contentType:(typeof options.select == 'string')?
                        'text/plain' :
                        'application/json',
                    processData:false,
                    dataType:'json',
                    success: function(result){
                        _success('saved item to domain', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('failed to save item to domain', options.error, xhr, status, e);
                    }
                }));
            }else{
                //rely on passed options to be sufficient
                //get an array of items in the models domain
                log.debug('performing simple parameter search');
                $.ajax($.extend({},options,{
                    type: 'GET',
                    url: this.resturl,
                    dataType:'json',
                    success: function(result){
                        _success('performed search', options.success, result);
                    },
                    error: function(xhr, status, e){
                        _error('error performing search', options.error, xhr, status, e);
                    }
                }));
            }
            return this;
        },
        next: function(options){
            this.find(query.next(), callback);
            return this;
        },
        previous: function(options){
            this.find(query.previous(), callback);
            return this;
        }
    });
    
    
    var _success = function(msg, callback, result, pager){
        log.debug('loaded list of items from domain: %s', result);
        if(callback&&$.isFunction(callback)){
            callback(result, pager);
        }
    };
    
    var _error = function(msg, callback, xhr, status, e){
        log.error( msg+' %s-%s', xhr.status, status).
            exception(e);
        if(callback&&$.isFunction(callback)){
            //second arg implies error condition occured
            callback([{msg:msg}], true);
        }
    };
    
})(jQuery, Claypool, Claypool.Models);
