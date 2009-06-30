

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
