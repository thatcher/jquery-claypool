


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
    $$Web.ConsoleServlet = function(options){
        $$.extend( this, $$Web.Servlet);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.ConsoleServlet");
    };
    
    $.extend($$Web.ConsoleServlet.prototype, 
        $$Web.Servlet.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handlePost: function(request, response){
            var retval = "ok";
            try{
                this.logger.info("Executing command :\n%s", request.body);
                retval = eval(String(request.body));
                retval = (retval===undefined)?"ok":retval;
                this.logger.info("Finished Executing command :\n%s", request.body);
                response.body = retval||"error: see server logs.";
            }catch(e){
                this.logger.error("Error executing command. \n\n%s", request.body).
                    exception(e);
                response.body = e.toString();
            }
            response.body = retval;
            response.headers["Content-Type"] = "text/plain";
            response.headers.status = 200;
            return response;
        }
    });
        
    
})(  jQuery, Claypool, Claypool.Server );


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
    $$Web.Console = function(options){
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.Console");
    };
    
    $.extend($$Web.Console.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        run: function(command){
            var _this = this;
            $.ajax({ 
                type:'POST',  
                url:'console/',   
                processData:false,  
                contentType:'text', 
                data:command,
                success:function(response){
                    _this.logger.info(response);
                },
                error: function(xhr, status, e){
                    _this.logger.error("Error sending command (%s)", s).exception(e);
                }
            });
        }
    });
        
    
})(  jQuery, Claypool, Claypool.Server );
