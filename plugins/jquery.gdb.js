/**
 * GDB Implementation for jQuery
 * @author thatcher
 */
(function($, $G){

    var version = 'http://appengine.google.com/1.0/';
    
    var connections = {
        //accessKeyId, secretKey, endpoint, version
        'default':{
            //TODO: allow them to set transaction policy,
            //      this seems to be the only db option
        }
    };
    
    var log = {
        debug:function(){return this;},
        info:function(){return this;},
        warn:function(){return this;},
        error:function(){return this;},
        exception:function(){return this;}
    };
    
    /**
     * @constructor
     */
    $.gdb = function(options){
        this.connections = {};
        $.extend(true, this.connections, connections, options);
        this.entityManager = $G.DatastoreServiceFactory.getDatastoreService();
        
        if($.isFunction($.logger)){
            log = $.logger('jQuery.plugins.gdb');
			log.debug('entityManager : %s', this.entityManager);
        }
        return this;
    };
    
    $.extend($.gdb.prototype,{

        create: function(options){
            //Apps Engine actually has no need to create domains (or 'kind's 
            //as they call it) because they are automatically created as soon
            //as an entity od that 'kind' is put.  However if we want to be able
            //to introspect all the available 'kind's we need to create an iconic
            //record which we can query on a known key 
            log.debug('creating domain %s', options.domain);
            var entity = new $G.Entity('jquery_gdb', options.domain);
            entity.setProperty('kind', options.domain);
            entity.setProperty('timestamp', $.uuid());
            
            var key = this.entityManager.put(entity);
            log.debug('created domain metadata entry %s (%s)', 
                entity.getKind(), $G.KeyFactory.keyToString(key))
                
            return options.success({
                db:      version,
                request:    $.uuid(),
                domain:     options.domain,
                cpu:        'n/a'
            });
        },

        metadata: function(options){
            //DomainMetadata
            //  - operation only available at the domain level
            var entity,
                timestamp,
                count;
            
            entity = this.entityManager.get(
                $G.KeyFactory.createKey('jquery_gdb', options.domain));
            timestamp = entity.getProperty('timestamp');
            count = this.entityManager.prepare(
                        new $G.Query(options.domain)).countEntities();
                    
                    
            return options.success({
                db:      version,
                request:    $.uuid(),
                domain:     options.domain,
                count:      count,
                timestamp:  timestamp,
                cpu:        'n/a',
                namesize:   'n/a',
                valuesize:  'n/a',
                size:       'n/a'
            });
        },
        
        destroy: function(options){
            var select,
                results,
                entity,
                keys,
                i;
            if (options.domain) {
                log.debug('destroying gdb domain %s', options.domain);
                try{
                    entity = this.entityManager.get(
                        $G.KeyFactory.createKey('jquery_gdb', options.domain));
                    this.entityManager['delete'](entity.getKey());
                }catch(e){
                    log.error('error deleting meta record %s', options.domain).
                        exception(e);
                }
                
                select = $G.Query(options.domain);
                results = this.entityManager.prepare(select.setKeysOnly()).
                    asIterator();
                keys = [];
                while(results.hasNext()){
                    entity = results.next();
                    log.debug('will delete %s', entity.getKey());
                    keys.push(entity.getKey());
                }
                log.debug('deleting all entities from %s', options.domian);
                this.entityManager['delete'].apply(this.entityManager, keys);
                
                return options.success({
                    db:      version,
                    request:    $.uuid(),
                    domain:     options.domain,
                    cpu:        'n/a'
                });
            }
            
        },

        remove: function(options){
            var key,
                entity,
                prop,
                value,
                i;
            
            if(options.domain&&options.id){
                //DeleteAttributes
                
                //if no attributes are specified the entire item is deleted!
                key = $G.KeyFactory.createKey(options.domain, options.id);
                
                if(options.data&&(options.data instanceof Array)){
                    //array of names to delete
                    entity = this.entityManager.get(key);
                    for(i=0;i<options.data.length;i++){
                        log.debug('deleting property %s from entity %s %s', 
                            options.data[i], options.domain, options.id);
                        entity.removeProperty(options.data[i]);
                    }
                    this.entityManager.put(entity);
                }else if(options.data&&(options.data instanceof Object)){
                    //object of names/value pairs to delete
                    entity = this.entityManager.get(key);
                    for(prop in options.data){
                        if(entity.hasProperty(prop)){
                            //check for single or multi value
                            value = entity.getProperty(prop);
                            if(value instanceof java.util.Collection){
                                //multi-valued
                                value = (java.utils.ArrayList)(value);
                                for(i=0;i<value.size();i++){
                                    if(value.get(i) == options.data[prop]){
                                        log.debug('deleting property %s=%s from entity %s %s', 
                                            prop, options.data[prop], options.domain, options.id);
                                        value.remove(i--);//decrement index to not skip values
                                    }
                                }
                                this.entityManager.put(entity);
                            }else{
                                //single valued
                                if(value == options.data[prop]){
                                    log.debug('deleting property %s=%s from entity %s %s', 
                                        prop, options.data[prop], options.domain, options.id);
                                    entity.removeProperty(prop);
                                    this.entityManager.put(entity);
                                }
                            }
                        }
                    }
                }else{
                    //delete entire item
                    log.debug('deleting entity %s %s', options.domain, options.id);
                    this.entityManager['delete'](key);
                }
                log.debug('successfully deleted entity or fields from %s %s', 
                    options.domain, options.id);
                return options.success({
                    db:      version,
                    request:    $.uuid(),
                    domain:     options.domain,
                    id:         options.id,
                    cpu:        'n/a'
                });
            }
        },
        
        
        /**
         * @implements PutAttributes, BatchPutAttributes
         */
        save: function(options){
			log.debug('save options domain(%s), id(%s), batch(%s)',
			     options.domain, options.id, options.batch);
            var entity,
                key,
                id,
                prop,
                collection,
                transaction,
                i,j;
            try{
                if (!options.id && options.batch && options.domain) {
                    //  - no options.id implies a batch operation
                    // BatchPutAttributes
                    this.create(options);
                    for(i=0;i<options.data.length;i++){
                        id = options.data[i].$id;
                        //each prop in options.data is an id and its value is the 
                        //object to store
                        if(id === undefined){
                            log.warn("no id specified!!");
                            try{
                                log.warn('%s',jsPath.js2json(options.data[i], null, '\t'));
                            }catch(e){}
                            id = 'gdb_'+$.uuid();
                        }
                        log.debug('saving item %s to domain %s', id, options.domain);
                        //PutAttributes
                        entity = new $G.Entity(options.domain, id);
                        
                        js2entity(options.data[i], entity);
                        
                        entity.setProperty('$id', id);
                        this.entityManager.put(entity);
                    }
                    return options.success({
                        db:      version,
                        request:    $.uuid(),
                        domain:     options.domain,
                        cpu:        'n/a'
                    });
                    
                }else if(options.id&&options.domain){
                    log.debug('saving item %s to domain %s', options.id, options.domain);
                    //PutAttributes
                    if(options.add){
                        key = $G.KeyFactory.createKey(options.domain, options.id);
                        entity = this.entityManager.get(key);
                    }else{
                        entity = new $G.Entity(options.domain, options.id);
                        entity.setProperty('$id', options.id);
                    }
                    
                    js2entity(options.data, entity, options.add);
                    
                    log.debug('saving entity %s', options.id);
                    this.entityManager.put(entity);
                    return options.success({
                        db:      version,
                        request:    $.uuid(),
                        domain:     options.domain,
                        id:         options.id,
                        cpu:        'n/a'
                    });
                }else{
                    log.debug('no case for save');
                }
            }catch(e){
                if(transaction){
                    transaction.rollback();
                }
                log.error('failed to save data %s', options.domain).
                    exception(e);
                if(options.error && $.isFunction(options.error)){
                    options.error({}/*mock xhr*/, 'error', e);
                }
            }
        },
        add: function(options){
            //does not overwrite existing fields, just adds values to them
            return this.save($.extend(options, {add:true}));
        },
        /**
         * $.gdb.get
         * 
         * @implements ListDomains, GetAttributes
         * @options Object
         *     max Number         - The maximum number of domain names you want 
         *                        - returned. (not required)
         *     range Number       - 1 to 100 (default  - 100) 
         *     next String        - that tells Amazon SimpleDB where to start the 
         *                        - next list of domain names. (not required) 
         *         
         * Exceptions  
         *     InvalidParameterValue  - Value (" + value + ") for parameter 
         *                            - 'max'  is invalid. 'max' must be between 
         *                            - 1 and 100.
         *     InvalidNextToken       - The specified next token is not valid.
         *            
         */
        get: function(options){
            var select,
                results,
                key,
                entity,
                props,
                prop,
                list,
                data,
                i,j;
            if (!options.id && !options.domain) {
                //ListDomains
                //  - no options.item implies a domain list operation
                log.debug('listing gdb entity kinds');
                select = new $G.Query('jquery_gdb');
                log.debug('preparing query for jquery.gdb domains');
                results = this.entityManager.prepare(select).
                    asList(new $G.FetchOptions.Builder.withLimit(1000)).
                    toArray();
                list = [];
                log.debug('found %s domains', results.length);
                for(var i=0;i<results.length;i++){
                    list[i] = results[i].getProperty('kind');
                    log.debug('domain %s', list[i]);
                }
                return options.success({
                    db:      version,
                    request:    $.uuid(),
                    cpu:        'n/a',
                    domains:    list
                });
            }else if(!options.id && options.domain){
                select = new $G.Query(options.domain);
                //response is list of item ids for the domain
                log.debug('preparing query for domain %s keys', options.domain);
                //TODO: need to decide on better way to determin max number
                //      of returned id's, while allowing for paging.
                results = this.entityManager.prepare(select).
                        asList(new $G.FetchOptions.Builder.withLimit(100000)).
                        toArray();
                list = [];
                log.debug('found %s items', results.length);
                for(i=0;i<results.length;i++){
                    key = results[i].getProperty('$id');
                    if(key){
                        list.push(key);
                        log.debug('item %s', key);
                    }
                }
                return options.success({
                    db:      version,
                    request:    $.uuid(),
                    cpu:        'n/a',
                    data:        list
                });
            }else if(options.id  && options.domain && typeof(options.id)=='string'){
                //retrieves a single item
                log.debug('getting /|:%s|/|:%s|', options.domain, options.id);
                key = $G.KeyFactory.createKey(options.domain, options.id);
                entity = this.entityManager.get(key);
                if(options.data !== undefined && options.length > 0){
                    props = options.data;
                }else{
                    props = entity.getProperties().keySet().toArray();
                }
                
                data = entity2js(entity, props);
                
                return options.success({
                    db:      version,
                    request:    $.uuid(),
                    cpu:        'n/a',
                    domain:     options.domain,
                    id:         options.id,
                    data:       [data]
                });
            }else if(options.id && !(typeof(options.id) == 'string') && options.domain ){
                //retrieves a list of items
                log.debug('getting list of items by id %s (%s)', options.id, typeof(options.id));
                list = new java.util.ArrayList();
                for(i=0;i<options.id.length;i++){
                    list.add(new $G.KeyFactory.createKey(options.domain, options.id[i]));
                }
                results = this.entityManager.get(list);
                keys = results.keySet().toArray();
                log.debug('found %s items by id', results.length);
                list = []
                for(i=0;i<keys.length;i++){
                    if(options.data !== undefined && options.length > 0){
                        props = options.data;
                    }else{
                        props = results.get(keys[i]).getProperties().keySet().toArray();
                    }
                    data = entity2js(results.get(keys[i]), props);
                    //data.$id = options.id[i];
                    list.push(data);
                }
                return options.success({
                    db:      version,
                    request:    $.uuid(),
                    cpu:        'n/a',
                    domain:     options.domain,
                    id:         options.id,
                    data:       list
                });
            }else{
                log.warn('invalid options %s', jsPath.js2json(options,null,4));
            }
        },
        /**
         * @implements Select
         */
        find: function(options){
            var validQuery = /new Query\(\'\w+\'\)(\.addFilter\(\'\w+\'\,\w+\,\'\w+\'\))*(\.addSort\(\'\w+\'\))?/,
                select,
                ors,
                results,
                data,
                i;
            //requires options.select
            data = [];
            log.debug('selecting expression %s', options.select);
            if(options.select && options.select.match(validQuery)){
                ors = options.select.split('|');
                for(i=0;i<ors.length;i++){
                    select = ors[i];
                    select = select.replace('Query', '$G.Query').
                        replace('$GREATER_THAN_OR_EQUAL', '$G.Query.FilterOperator.GREATER_THAN_OR_EQUAL','g').
                        replace('$GREATER_THAN', '$G.Query.FilterOperator.GREATER_THAN','g').
                        replace('$LESS_THAN_OR_EQUAL', '$G.Query.FilterOperator.LESS_THAN_OR_EQUAL','g').
                        replace('$LESS_THAN', '$G.Query.FilterOperator.LESS_THAN','g').
                        replace('$EQUAL', '$G.Query.FilterOperator.EQUAL','g');
                }
                log.debug('find native:\n\t %s', select);
                results = this.entityManager.
                    prepare(eval(select)).
                    asIterator();
                log.debug('found results, iterating...');
                i=0;
                while(results.hasNext()){
                    log.debug('result %s', i);
                    entity = results.next();
                    data.push(entity2js(entity));
                    i++;
                }
            }
            return options.success({
                db:      version,
                request:    $.uuid(),
                cpu:        'n/a',
                data:        data
            });
            
        },
        
        js2query : function(query){
            //Handle the basic selection predicate and set context 
            var select = 'select `'+query.selectors.join('`,`')+'` ' +
                    'from `'+query.context+'` ';
            //walk through all our expressions
            if(query.expressions.length){
                for(var i=0;i<query.expressions.length;i++){
                    select += ' ';
                    select += i?query.expressions[i].type:'where';
                    select += ' ';
                    switch(query.expressions[i].operator){
                        case '=':
                            select += 
                                '`'+query.expressions[i].name+'` = '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '!=':
                            select += 
                                '`'+query.expressions[i].name+'` != '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '~':
                            select += 
                                '`'+query.expressions[i].name+'` like '+
                                '"'+query.expressions[i].value.replace('*','%')+'" ' 
                            break;
                        case '!~':
                            select += 
                                '`'+query.expressions[i].name+'` not like '+
                                '"'+query.expressions[i].value.replace('*','%')+'" ' 
                            break;
                        case '>':
                            select += 
                                '`'+query.expressions[i].name+'` > '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '>=':
                            select += 
                                '`'+query.expressions[i].name+'` >= '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '><':
                            select += 
                                '`'+query.expressions[i].name+'` between '+
                                '"'+query.expressions[i].value[0]+'" and ' 
                                '"'+query.expressions[i].value[1]+'" ' 
                            break;
                        case '<':
                            select += 
                                '`'+query.expressions[i].name+'` < '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '<=':
                            select += 
                                '`'+query.expressions[i].name+'` <= '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                        case '@':
                            select += 
                                '`'+query.expressions[i].name+'` in '+
                                '("'+query.expressions[i].value.join('","')+'") ' 
                            break;
                        case '!@':
                            select += 
                                '`'+query.expressions[i].name+'` not in '+
                                '"'+query.expressions[i].value+'" ' 
                            break;
                    }
                }
                if(query.orderby&&query.orderby.name){
                    select += ' order by '+query.orderby.name+' '+
                        (query.orderby.direction&&query.orderby.direction=='reverse')?' desc ':'';
                }
                if(query.limit){
                    select +=  ' limit '+query.limit+' ';
                }
                return select;
            }
        }
        
    });
    
    function entity2js(entity, props){
        var data,
            prop,
            i;
        
        props = props?props:entity.getProperties().keySet().toArray();
        
        data = {};
        for(i=0;i<props.length;i++ ){
            log.debug('entity has property %s', props[i]);
            prop = field2js(props[i], entity.getProperty(props[i]));
            
            data[props[i]] = prop;
            log.debug('item[%s] is %s', props[i], data[props[i]]);
        }
        return data;
    };
    
    function field2js(name, value){
        var jsArray, j;
        log.debug('converting property %s (typeof %s)', name, value?value['class']:'undefined' );
        if(value instanceof $G.Text){
            //long text field
            log.debug('Text');
            return value.getValue()+'';
        }else if(value instanceof java.util.Collection){
            log.debug('Collection');
            //ugly way to detect if object is single or multi valued
            jsArray = [];
            value = (java.util.ArrayList)(value).toArray();
            log.debug('item[%s] is multi-valued (%s)', name, value.length);
            for(j=0;j<value.length;j++){
                jsArray.push( field2js(name, value[j]) );
                log.debug('item[%s] has prop %s %s', i, name, value[j]);
            }
            return jsArray;
        }else if(value instanceof java.lang.String){
            //short field
            log.debug('String');
            return value+'';
        }else if(value instanceof java.lang.Boolean){
            //short field
            log.debug('Boolean');
            return !!value;
        }else{
            log.debug('Other');
            //single valued and basic type
            return value+'';
        }
    };
    
    function js2entity(data, entity, update){
        var prop,
            collection;
            
        for(prop in data){
            if(data[prop] instanceof Object && data[prop].length){
                log.debug('entity prop %s is multi-valued', prop);
                //data prop is multi-valued
                if(entity.hasProperty(prop) && update){
                    //prop already exists
                    collection = (java.util.ArrayList)(entity.getProperty(prop));
                }else{
                    //prop is new
                    collection = new java.util.ArrayList();
                }
                for(i = 0; i< data[prop].length;i++){
                    collection.add(js2field(data[prop][i]));
                }
                entity.setProperty(prop, collection);
            }else{
                //data is single valued
                if(entity.hasProperty(prop) && update){
                    log.debug('adding value %s for property %s', prop, data[prop]);
                    //entity prop is multi valued
                    if(!(entity.getProperty(prop).add)){
                        log.debug('adding value to entity by converting property to list');
                        //was a single value but is now a multi value
                        collection = new java.util.ArrayList();
                        collection.add(js2field(entity.getProperty(prop)));
                        collection.add(js2field(data[prop]));
                        entity.setProperty(prop, collection);
                    }else{
                        //was multi value already
                        log.debug('adding value to existing property list');
                        entity.setProperty(prop, (java.util.ArrayList)(entity.getProperty(prop)).
                                add(js2field(data[prop])));
                    }
                }else{
                    //entity prop is single valued
                    log.debug('reseting value %s for property %s', prop, data[prop]);
                    entity.setProperty(prop, js2field(data[prop]));
                }
            }
        }
    };
    
    function js2field(value){
        if(typeof(value) == 'string'  && value.length > 256){
            log.debug('using Text for value ', value);
            return new $G.Text(value);
        }else{
            return value;
        }
    }
    
    var subjects = {

        'type' : function(name){
            /**
             * subject of query has the specified domain/kind/table 
             *      eg: artist 
             *    - means item from table/domain 'artist'
             */
        },
        '#id' : function(value){
            /**
             * subject of query has the specified id 
             *      eg: #thenurbs 
             *    - means item with id 'thenurbs'
             */

        },
        '.class' : function(name){
            /**
             * subject of query has the specified value in the 'class' field 
             *      eg: .surf 
             *    - means item with property 'class' containing value 'surf'
             */
        }
    };
    
    var operators = {

        '_' : function(){
            /**
             * provides a filter for defined properties
             *      eg: foo[bar] 
             *    - means foo has a attribute named bar
             */
        },

        '=' : function(){
            /**
             * provides a filter for properties equal to a value
             *      eg: foo[bar=goop] 
             *    - means foo has a attribute bar with the value 'goop'
             */
        },
        
        '!=' : function(name, value){
            /**
             * provides a filter for properties not equal to a value
             *      eg: foo[bar!=goop] 
             *    - means foo has a attribute bar without the value 'goop'
             */
        },
        
        '>' : function(name, value){
            /**
             * provides a filter for properties lexically after the value
             *      eg: foo[bar>goop] 
             *    - means foo has a attribute bar with the sort order greater
             *      than the value 'goop'
             */
        },
        
        '>=' : function(name, value){
            /**
             * provides a filter for properties lexically after or the same as the value
             *      eg: foo[bar>=goop] 
             *    - means foo has a attribute bar with the sort order greater
             *      than or equal to the value 'goop'
             */
        },
        
        '<' : function(name, value){
            /**
             * provides a filter for properties lexically before the value
             *      eg: foo[bar<goop] 
             *    - means foo has a attribute bar with the sort order less
             *      than the value 'goop'
             */
        },
        
        '<=' : function(name, value){
            /**
             * provides a filter for properties lexically before or the same as the value
             *      eg: foo[bar<=goop] 
             *    - means foo has a attribute bar with the sort order less
             *      than or equal to the value 'goop'
             */
        },
        
        '^=' : function(name, value){
            /**
             * provides a filter for properties starting with a value
             *      eg: foo[bar^=goop] 
             *    - means foo has a attribute bar starting with the value 'goop'
             */
        }
    };

    var logicals = {

        '&': function(){
            /**
             * provides a logical intersection of selectors, though its not used
             * explicitly, all stacked filters are implemented via '&'
             *      eg: foo[bar^=goop][blah=pooh] 
             *    - means foo has a attribute bar starting with the value 'goop'
             *      which also has a property blah equal to 'pooh' 
             */
        },
        '|': function(){
            /**
             * provides a logical union of selectors, though its not used
             * explicitly, all stacked filters are implemented via '&'
             *      eg: foo[bar^=goop], foo[blah=pooh] 
             *    - means foo that has a attribute bar starting with the value 'goop'
             *      or foo that has a property blah equal to 'pooh' 
             */
        }
    };
    
    var filters = {

        'native': function(){
            /**
             * provides access to the implementation specific query engine
             * language.  must be a string.  implementation may still be limited
             * if the underlying engine does not provide a sql-like language
             *      eg: :native( new Query('test_domain').addFilter('city', EQUAL, 'Shepherdstown') ) 
             */
        },
        
        'count': function(){

        },
        
        'guid': function(){

        },
        
        'contains': function(){

        },
        
        'limit': function(){

        },
        
        'chunk': function(){

        },
        
        'offset': function(){

        },
        
        'sift': function(){

        },
        
        'sort': function(){

        },
        
        'reverse': function(){

        }    
    };
    
})(jQuery, Packages.com.google.appengine.api.datastore);
