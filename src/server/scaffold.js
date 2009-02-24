


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
