

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
              $$.MVC.Controller.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        //We reduce to a single response handler function because it's not easy to
        //support the asynch stuff on the server side
        
        handle: function(event){
            //data is just the routing info that got us here
            //the request and response is really all we care about
            var method = event.params('method').toUpperCase(); 
            event.params('headers').status = 200;
             
            this.logger.debug("Handling %s request", method);
            switch(method){
                case 'GET':
                    this.handleGet(event, event.response);break;
                case 'POST':
                    this.handlePost(event, event.response);break;
                case 'PUT':
                    this.handlePut(event, event.response);break;
                case 'DELETE':
                    this.handleDelete(event, event.response);break;
                case 'HEAD':
                    this.handleHead(event, event.response);break;
                case 'OPTIONS':
                    this.handleOptions(event, event.response); break;
                default:
                    this.logger.debug("Unknown Method: %s, rendering error response.",  method );
                    this.handleError(event, "Unknown Method: " + method, new Error() );
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet: function(event){
            throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePut: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleDelete: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleHead: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleOptions: function(event){
             throw "MethodNotImplementedError";
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleError: function(event, msg, e){
            this.logger.warn("The default error response should be overriden");
            event.headers.status = 300;
            event.response.body = msg?msg:"Unknown internal error\n";
            event.response.body += e&&e.msg?e.msg+'':(e?e+'':"\nUnpsecified Error.");
        }
    });
    
    
    
})(  jQuery, Claypool, Claypool.Server );
