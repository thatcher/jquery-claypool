Claypool.Models = {
/*
 * Claypool.Models @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 */
};
/**
 * @author thatcher
 */


(function($, $$, $M){
    
    /**
     * @constructor
     * @classDescription - Provides a common validation and serialization
     *     deserialization routines
     * @param {Object} name
     * @param {Object} fields
     * @param {Object} options
     */
    $M.Model = function(name, fields, options){
        $.extend(true, this, $M.Factory(options));
        $.extend(this, {
            name: name,
            fields: fields
        });
    };
   
    $.extend($M.Model.prototype, {
        /**
         * 
         * @param {Object} options
         */
        validate:function(options){
            var flash = [],
                model = options.data,
                i, j, 
                batch,
                id;
            if(options.batch){
                batch = {};
                for(id in model){
                    this.validate($.extend({},options,{
                        data: model[id],
                        batch:false,
                        success:function(data){
                            batch[id]=data;
                        },
                        error:function(data, _flash){
                            flash.push(_flash);
                        }
                    }));
                }
                if(flash.length === 0){
                    model = batch;
                }
            }else{
                for(var field in this.fields){
                    if(model[field] === undefined
                    && this.fields[field].generate){
                        //generate the field for them
                        model[field]=this.fields[field].generate();
                    }
                    if(this.fields[field].not){
                       //make sure no item in the list is equivalent
                        for(i=0;i<this.fields[field].not.length;i++){
                            if(model[field] instanceof Array){
                                //handle an array of simple values
                                for(j=0;j<model[field].length;j++){
                                    if(model[field][j]===this.fields[field].not[i]){
                                        //store the value and msg in flash
                                        //to pass to the callback
                                        flash[flash.length]={
                                            index:j,
                                            value:model[field][j],
                                            msg:this.fields[field].msg
                                        };          
                                    }
                                }
                            }else{
                                //handle simple values
                                if(model[field]===this.fields[field].not[i]){
                                    //store the value and msg in flash
                                    //to pass to the callback
                                    flash[flash.length]={
                                        value:model[field],
                                        msg:this.fields[field].msg
                                    };          
                                }
                            }
                        }       
                    }
                    if(this.fields[field].pattern ){
                        if(model[field] instanceof Array){
                            //handle array of simple values
                            for(j=0;j<model[field].length;j++){
                                if(!this.fields[field].pattern.test(model[field][j])){
                                    //store the value and msg in flash
                                    //to pass to the callback
                                    flash[flash.length]={
                                        index:j,
                                        value:model[field][j],
                                        msg:this.fields[field].msg
                                    };        
                                }
                            }
                        }else{
                            //handle a simple type
                            if(!this.fields[field].pattern.test(model[field])){
                                //store the value and msg in flash
                                //to pass to the callback
                                flash[flash.length]={
                                    value:model[field],
                                    msg:this.fields[field].msg
                                };        
                            }
                        }
                    }
                }  
            }
          
            if(flash.length>0 &&
                options.error && $.isFunction(options.error)){
                options.error(model, flash);
            }else{
                if(options.success&&$.isFunction(options.success)){
                    if(options.serialize){
                        model = this.serialize(model);
                    }
                    options.success(model);
                }
            }
            return this;
        },
    	serialize : function(model){
            var serialized = {},
                multi, 
                i;
            for(var field in model){
                if((this.fields[field]!==undefined ||
                   '__anything__' in this.fields) && !$.isFunction(model[field])){
                    if(this.fields[field] && 
                       this.fields[field].type){
                        if(this.fields[field].type == 'json'){
                            //serializes a json blob
                            serialized[field] = jsPath.js2json(model[field]);
                        }else if (this.fields[field].type == 'html'){
                            //serializes a dom html blob
                            serialized[field] = $('<div>').append( $(model[field]).clone() ).html();
                        }else if (this.fields[field].type == 'xmllist'){
                            //serializes a e4x xml blob
                            serialized[field] = model[field].toString();
                        }else if (this.fields[field].type == 'jsam'){
                            //serializes as an array of jsam paths
                            //requires jsPath plugin
                            multi = jsPath('..*', model[field], {resultType:"JSAM", pathStyle:"DOT"});
                            serialized[field] = [];
                            for(i=0;i<multi.length;i++){
                                serialized[field][i] = multi[i];
                            }
                        } 
                    }else{
                        serialized[field] = model[field];
                    }
                }
            }
            return serialized;
        },
        deserialize: function(model){
            var deserialized;
            return deserialized;
        }
        
    });
    
    $.each([
        /**create the domain (or table space)*/
        'create',
        /**deletes the domain (or table space)*/
        'destroy',
        /**retreives available metadata from the domain*/
        'metadata',
        /**overwrites specified fields (does not remove unspecied fields)*/
        'save',
        /**adds values to specified fields does not overwrite them*/
        'add',
        /**removes specified fields or the entire item if no fields are specified*/
        'remove',
        /** gets a list of domains if no domain is specified
        gets a list of items in a domain if no item is specified
        gets a specific list of items is an array of string if no fields are specified
        gets a specific item if item is a string if no fields are specified
        gets a specific set of fields if fields are specified
        gets a specific set of items and set of fields if fields are specified*/
        'get',
        /**executes a query on the domain returning a list of items and/or the requested fields*/
        'find',
        /**returns a valid language specific query representing the query object*/
        'js2query',
        /**used to page through the results sets from find or large gets*/
        'next',
        'previous'
    ], function(index, value){
        $M.Model.prototype[value] = function(options){
           throw new $$.MethodNotImplementedError();
        };
    });
    
})(  jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    
	var log;
	
    $M.Query = function(options){
        $.extend(true, this, options,{
            context: '',
            selectors:[],
            expressions:[],
            orderby:{ direction:'forward' },
            limit:0,
            startPage:0,
            resultsPerPage: 20
        });
		log = $.logger('Claypool.Models.Query');
    };
    var $Q = $M.Query;
   
    $.extend($Q.prototype, {
       /**
        * Target Functions
        * @param {Object} name
        */
       items: function(selector){
           if(selector && (typeof selector == 'string')){
               // if arg is string
               // a select `selector` 
               this.selectors.push(selector);
           }else if(selector && selector.length && 
                   (selector instanceof Array)){
               // if selector is array
               // a select (`selector[0]`, `selector[1]`, etc) 
               $.merge(this.selectors,selector);
           }else{
               // if arg is not any of the above it is '*'
               // a select `selector` 
               this.selectors.push('*');
           }
           //chain all methods
           return this;
       },
       names: function(){
           //chain all methods
           return this.items('itemName()');
       },
       count: function(){
           //chain all methods
           return this.items('count()');
       },
       /**
        * Operator Functions
        * @param {Object} name
        */
       is: function(value){
           _compare(this,'=');
           _value(this,value);
           //chain all methods
           return this;
       },
       isnot: function(value){
           _compare(this,'!=');
           _value(this,value);
           //chain all methods
           return this;
       },
       islike: function(value){
           _compare(this,'~');
           _value(this,value);
           //chain all methods
           return this;
       },
       isnotlike: function(value){
           _compare(this,'!~');
           _value(this,value);
           //chain all methods
           return this;
       },
       isgt:function(value){
           _compare(this,'>');
           _value(this,value);
           //chain all methods
           return this;
       },
       isgte:function(value){
           _compare(this,'>=');
           _value(this,value);
           //chain all methods
           return this;
       },
       isbetween:function(values){
           _compare(this,'><');
           _value(this,values);
           //chain all methods
           return this;
       },
       islte: function(value){
           _compare(this,'<=');
           _value(this,value);
           //chain all methods
           return this;
       },
       islt:function(value){
           _compare(this,'<');
           _value(this,value);
           //chain all methods
           return this;
       },
       isin: function(values){
           _compare(this,'@');
           _value(this,value);
           //chain all methods
           return this;
       },
       isnotin: function(values){
           _compare(this,'!@');
           _value(this,value);
           //chain all methods
           return this;
       },
       /**
        * ResultSet Preparation Functions
        * @param {Object} name
        */
       orderby: function(name){
           _order(this,name);
           //chain all methods
           return this;
       },
       reverseorderby: function(name){
           _order(this, name, 'reverse');
           //chain all methods
           return this;
       },
       limit: function(count){
           this.limit = count;
       },
       //Pagination functions
       page: function(i, resultsPerPage){
           if(resultsPerPage){
               this.count = resultsPerPage;
           }
           this.startPage = i;
           //chain all methods
           return this;
       },
       next: function(callback){
           this.startPage++;
           //chain all methods
           return this;
       },
       previous:function(callback){
           this.startPage--;
           //chain all methods
           return this;
       }
    });
    
   /**
    * Expression Functions
    * @param {Object} name
    */
    var sugar = ['','like','gt','gte','between','lte','lt'];
    for(var i=0;i<sugar.length;i++){
        $Q.prototype['where'+sugar[i]]=function(name){
            _express(this, name, 'where', '');
            return this;
        };
        $Q.prototype['wherenot'+sugar[i]]=function(name){
            _express(this, name, 'where', 'not');
            return this;
        };
        $Q.prototype['whereeither'+sugar[i]]=function(name){
            _express(this, name, 'either', '');
            return this;
        };
        $Q.prototype['whereneither'+sugar[i]]=function(name){
            _express(this, name, 'either', 'not');
            return this;
        };
        $Q.prototype['and'+sugar[i]]=function(name){
            _express(this, name, 'and', '');
            return this;
        };
        $Q.prototype['andnot'+sugar[i]]=function(name){
            _express(this, name, 'and', 'not');
            return this;
        };
        $Q.prototype['or'+sugar[i]]=function(name){
            _express(this, name, 'or', '');
            return this;
        };
        $Q.prototype['ornot'+sugar[i]]=function(name){
            _express(this, name, 'or', 'not');
            return this;
        };
    }
    
                           //this,string|object,and|or,like|gte|lte,not 
    var _express = function(query, condition, logical, operator, negate){
       var prop = null;
       operator = operator?operator:'is';
       
       if(query && condition && logical &&
                $.isFunction(query[logical])){
           
           if(logical == 'where'){
               query.expressions = [];
               logical = 'and';
           }else if(logical == 'whereeither' || logical == 'whereneither'){
               query.expressions = [];
               logical = 'or';
           }
           if(typeof condition == 'string'){
               //or `name` = ""
               query.expressions.push({
                   name:condition,
                   type:logical
               });
           }else if(condition &&
                 	typeof(condition) == 'object' && 
                 	!(condition instanceof Array)){
               // if condition is object
               // where `a` = '1' or `b` = '2'  or `c` = '3'
               for(prop in condition){
                   if(typeof(condition[prop])=='string'){
                       if(negate){
                           query[logical](prop)['isnot'+operator](condition[prop]);
                       }else{
                           query[logical](prop)['isnot'+operator](condition[prop]);
                       }
                   }else if(operator===''&&//arrays only apply to equal/not equal operator
                               condition[prop]&&
                               condition[prop].length&&
                               condition[prop] instanceof Array){
                       if(negate){
                           query[logical](prop).isnotin(condition[prop]);
                       }else{
                           query[logical](prop).isin(condition[prop]);
                       }
                   }
               }
           }
       }
   };
   var _compare = function(query, symbol){
       query.expressions[
           query.expressions.length-1
       ].operator=symbol;
   };
   var _value = function(query, value){
       query.expressions[
           query.expressions.length-1
       ].value=value;
   };
   var _name = function(query, name){
       query.expressions[
           query.expressions.length-1
       ].name=name;
   };
   var _order = function(query, name, direction){
       query.orderby = {
           name:name,
           direction:(direction||'forward')
       };
   };
   
   /**
    * scratch pad 
    * 
        var _;
      
        //select * from `artists` where `$name` = 'Vox Populi' 
        //or $tags in ('alternative', 'rock') 
        _ = new $Q();
      
        $('#artistsModel').find(
           _.items('*').
             where('$name').
             is('Vox Populi').
             or('$tags').
             isin(['alternative', 'rock']),
           function(results, pages){
               //do something with results
           }
        );
        //is equivalent to
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items('*').
             where({$name:'Vox Poluli'}).
             or({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
        
        //select (`$name`, `$artistid`) from `artists` where `$tags` in ('alternative', 'rock')
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items(['$name','$artistid']).
             where({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
       
        //select (`$name`) from `artists` where `$tags` in ('alternative', 'rock')
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items('$name').
             where({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
       
       
       //select (itemName()) from `artists` where `$name`="Vox Populi" 
       // or `$label`="Nonrational"
        _ = new $Q();
        
        $('#artistsModel').find(
           _.names().
             either({
                 '$name':'Vox Populi',
                 '$label':'Nonrational'
             }),
           function(results, pages){
               //do something with results
           }
        );
        
       //select (itemName()) from `releases` where `$date` not null  
       // orderby `$date`
        _ = new $Q();
        
        $('#releasesModel').find(
           _.names().
             orderby('$date'),
           function(results, pages){
               //do something with results
           }
        );
        
       //select (count()) from `releases` where `$artist` = "Vox Populi"
        _ = new $Q();
        
        $('#releasesModel').find(
           _.count().
             where('$artist').
             is("Vox Populi"),
           function(results, pages){
               //do something with results
           }
        );
   */
   })(jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    
    $M.Client = function(options){
        $.extend(true, this, options);
    };
   
    $.each(['create','destroy','metadata','save','add','remove','get','find','js2query','next','previous'], 
        function(index, value){
            $M.Client.prototype[value] = function(options){
               this.db[value]($.extend(options,{
                   domain:this.name
               }));
               return this;
            };
        }
    );
    
})(jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    
    var log;
    
    $M.RestClient = function(options){
        //they must provide a object which implements
        //the methods js2json and json2js
        //we include jsPath's json plugin as a default implementation
        //when present
        this.js2json = jsPath&&jsPath.js2json&&$.isFunction(jsPath.js2json)?
            jsPath.js2json:options.js2json;
        this.json2js = jsPath&&jsPath.json2js&&$.isFunction(jsPath.json2js)?
            jsPath.json2js:options.json2js;
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
            var id;
            if(!options.batch&&options.id){

                if(options.serialize){
                   options.data = this.serialize(options.data);
                }
                $.ajax($.extend({},options,{
                    type: 'POST',
                    url: (this.resturl+this.name+'/'+options.id)+
                            (options.add?'?add':''),
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
	                for(id in options.data){
	                    options.data[id] = this.serialize(options.data[id]);
	                }
				}
                
                $.ajax($.extend({},options,{
                    type: 'POST',
                    url: (this.resturl+this.name +'/')+
                            (options.add?'?add':''),
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
           this.save($.extend({},options,{add:true}));
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
           if(options.id && typeof options.id == 'string'){
               $.ajax($.extend({},options,{
                   type: 'GET',
                   url: this.resturl+this.name+'/'+options.id,
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
               $.ajax($.extend({},options,{
                   type: 'GET',
                   url: this.resturl+this.name+'/',
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
                $.ajax($.extend({},options,{
                    type: 'GET',
                    url: this.resturl+this.name+'/',
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
            //constructed and used here by simply passing 
            //the query as a string.  the server will
            //use content negotiation to determine whether
            //to treat it as json serialized or a native query
            if(options.select){
                if(typeof options.select == 'object'){
                    if(!(options.select instanceof Query)){
                        //using shorthand object notation to define the query
                        //so go ahead and create an internal Query object from
                        //it.
                        options.select = new Query(options.select);
                    }
                    //set the context for the query if its not a native
                    //query string
                    options.select.context = this.name;
                }
                $.ajax($.extend({},options,{
                    type: 'POST',
                    url: this.resturl,
                    data: (typeof options.select == 'string')?
                        options.select:this.js2json(options.select),
                    contentType:(typeof options.select == 'string')?
                        'text/plain':'application/json',
                    processData:false,
                    dataType:'json',
                    success: function(result){
                        _success('saved item to domain', options.success, result);
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
/**
 * @author thatcher
 */
(function($,$$,$M){
    var log;
    //Factory is really just a static function
    $M.Factory = function(options){
        options = options||{};
        log = log||$.logger('Claypool.Models.Factory');
        
        var DB,
            dbconnection;
        
        //select the db client implementation
        //
        // - 'rest' is entirely abstract and is the most reusable accross databases
        //   since it requires no database specific implementations by the client.
        //   the rest server-side services would generally use the 'direct' db client then
        //   to service the rest clients requests
        //
        // - 'direct' requires a reference to the database plugin but is otherwise
        //   generic as well. the db implementation shares a set of
        //   dbconnection parameters which are used to initialize the local
        //   clients connection
        var dbclient = options&&options.dbclient?
            options.dbclient:$.env('dbclient');
        if(!dbclient){
            dbclient = 'rest';
        }
        log.debug("loading database client connection %s", dbclient);
        if(dbclient=='rest'){
            dbclient = new $M.RestClient(options);
        }else if(dbclient == 'direct'){
            //get the database implementation and connection information
            DB = options&&options.db?
                    options.db:$.env('db');
            dbconnection = options&&options.dbconnection?
                    options.dbconnection:$.env('dbconnection');
            log.debug("loading database implementation %s", DB);
            if(typeof(DB)=='string'){
                log.debug("resolving database implementation %s", DB);
                DB = $.resolve(DB);
            }
            dbclient = new $M.Client($.extend({
                //initialize the database connection
                db: new DB(dbconnection)
			},options));
        }
        return dbclient;
    };
    
})(jQuery, Claypool, Claypool.Models);
/**
 * @author thatcher
 */
(function($,$$,$M){
    
    $.extend($, {
        model: function(name, fields, options){
            return new $M.Model(name, fields, options);
        },
        query: function(options){
            return new $M.Query(options);
        }
    });
    
})(jQuery, Claypool, Claypool.Models);
