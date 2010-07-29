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
            if( options.batch ){
                batch = [];
                for(i=0;i<model.length;i++){
                    id = model[i].$id;
                    this.validate($.extend({},options,{
                        data: model[i],
                        batch:false,
                        success:function(data){
                            data.$id = id;
                            batch.push(data);
                        },
                        error:function(data, _flash){
                            flash.push(_flash);
                        }
                    }));
                }
                if( flash.length === 0 ){
                    model = batch;
                }
            } else {
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
                                            field: field,
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
                                        field: field,
                                        msg:this.fields[field].msg
                                    };          
                                }
                            }
                        }       
                    }
                    //only validate patterns if defined
                    if(this.fields[field].pattern && (model[field]!==undefined)){
                        if(model[field] instanceof Array){
                            //handle array of simple values
                            for(j=0;j<model[field].length;j++){
                                if(!this.fields[field].pattern.test(model[field][j])){
                                    //store the value and msg in flash
                                    //to pass to the callback
                                    flash[flash.length]={
                                        index:j,
                                        field: field,
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
                                    field: field,
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
                   '__anything__' in this.fields || field == '$id') && !$.isFunction(model[field])){
                    if(this.fields[field] && 
                       this.fields[field].type){
                        if(this.fields[field].type == 'json'){
                            //serializes a json blob
                            serialized[field] = jsPath.js2json(model[field]);
                        }else if (this.fields[field].type == 'html'){
                            //serializes a dom html blob
                            serialized[field] = $('<div/>').append( $(model[field]).clone() ).html();
                        }else if (this.fields[field].type == 'xmllist'){
                            //serializes a e4x xml blob
                            serialized[field] = model[field].toString();
                        }
                    }else{
                        serialized[field] = model[field];
                    }
                }
            }
            return serialized;
        },
        deserialize: function(model){
            var deserialized = {};
            for(var field in this.fields){
                if((model[field]!==undefined ||
                   '__anything__' in this.fields) && !$.isFunction(model[field])){
                    if(this.fields[field].type){
                        if(this.fields[field].type == 'json'){
                            //deserializes a json blob
                            deserialized[field] = $.json2js(model[field]);
                        }else if (this.fields[field].type == 'html'){
                            //deserializes a dom html blob
                            deserialized[field] = $(model[field]);
                        }else if (this.fields[field].type == 'xmllist'){
                            //deserializes a e4x xml blob
                            deserialized[field] = new XMLList(model[field]);
                        }
                    }else{
                        serialized[field] = model[field];
                    }
                }
            }
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
