/**
 * @author thatcher
 */
(function($,$$,$M){
    
    var resturl;
    
    $M.RestClient = function(options){
        $.extend(true, this, options);
        resturl = $.env('resturl')?$.env('resturl'):'/rest/';
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
           $.ajax($.extend(options,{
                type: 'PUT',
                url: $.env('resturl')+this.name+'/',
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
           $.ajax($.extend(options,{
                type: 'DELETE',
                url: $.env('resturl')+this.name+'/',
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
            if(!options.batch&&options.id){
                $.ajax($.extend(options,{
                    type: 'POST',
                    url: $.env('resturl')+this.name+'/'+options.id+
                            (options.add)?'?add':'',
                    data: this.js2json(this.serialize(options.data)),
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
                for(var id in options.data){
                    options.data[id] = this.serialize(options.data[id]);
                }
                
                $.ajax($.extend(options,{
                    type: 'POST',
                    url: $.env('resturl')+this.name +'/'+
                            (options.add)?'?add':'',
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
       add:function(options){
           //saves additional fields to the object.
           this.save($.extend(options,{add:true}));
           return this;
       },
       remove: function(options){
           
           if(options.id){
               $.ajax($.extend(options,{
                   type: 'DELETE',
                   url: $.env('resturl')+this.name+'/'+options.id,
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
           if(options.id && typeof options.id == 'string'){
               $.ajax($.extend(options,{
                   type: 'GET',
                   url: $.env('resturl')+this.name+'/'+options.id,
                   dataType:'json',
                   success: function(result){
                       _success('retrieved data by id from domain', options.success, result);
                   },
                   error: function(xhr, status, e){
                       _error('failed to retrieved data by id from domain', options.error, xhr, status, e);
                   }
               }));
           }else if(options.id&&options.id.length){
               //batch get of items specified by array of id
               $.ajax($.extend(options,{
                   type: 'GET',
                   url: $.env('resturl')+this.name+'/',
                   data:{id:options.id.join(',')},
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
                $.ajax($.extend(options,{
                    type: 'GET',
                    url: $.env('resturl')+this.name+'/',
                    dataType:'json',
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
            //contructed and used here by simply passing 
            //the query as a string.  the server will
            //use content negotiation to determine whether
            //to treat it as json serialized or a native query
            if(options.query){
                if(typeof options.query == 'object'){
                    if(!(options.query instanceof Query)){
                        //using shorthand object notation to define the query
                        //so go ahead and create an internal Query object from
                        //it.
                        options.query = new Query(options.query);
                    }
                    //set the context for the query if its not a native
                    //query string
                    options.query.context = this.name;
                }
                $.ajax($.extend(options,{
                    type: 'POST',
                    url: $.env('resturl'),
                    data: (typeof options.query == 'string')?
                        options.query:this.js2json(options.query),
                    contentType:(typeof options.query == 'string')?
                        'text/plain':'application/json',
                    processData:false,
                    success: function(result){
                        _success('saved item to domain', options.success, result, query);
                    },
                    error: function(xhr, status, e){
                        _error('failed to save item to domain', options.error, xhr, status, e);
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
