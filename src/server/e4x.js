
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
    $$Web.E4XServlet = function(options){
        $$.extend(this,$$Web.Servlet);
        $.extend(true, this, options);
        this.logger = $.logger("Claypool.Server.E4XServlet");
    };
    
    $.extend($$Web.E4XServlet.prototype,
        $$Web.Servlet.prototype, {
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        handleGet: function(request, response){
            var _this = this;
            //for this service we use the a json string as the model
            if(!typeof(response.m('postparams')) == "string"){
                //no model has been set by a post
                if($.isFunction($.js2json)){
                    response.m("postparams", $.js2json(request.parameters));
                }else{
                    response.m("postparams","{}");
                }
            }
            try{
                this.logger.info("Loading E4X from url :\n%s", request.requestURI);
                $.ajax({ 
                    type:'GET',  
                    url:(this.baseURI||"./")+request.requestURI, 
                    dataType:"text/plain",
                    async:false,
                    success:function(text){
                        _this.logger.info("Successfully retreived E4X :\n%s \n Evaluating with model %s",
                            request.requestURI, response.m("postparams"));
                        var e4x = eval("(function(){"+
                            "var model = "+response.m("postparams")+";"+
                            "return new XMLList(<>"+text+"</>);"+
                        "})();");
                        response.body = e4x.toString();
                        response.headers["Content-Type"] = "text/html";
                        response.headers.status = 200;
                        _this.logger.info("Finished Evaluating E4X :\n%s", request.requestURI);
                    },
                    error:function(xhr, status, e){
                        _this.logger.info("Error retreiving E4X :\n%s", request.requestURI);
                        response.body = "<html><head></head><body>"+e||"Unknown Error"+"</body></html>";
                        response.headers["Content-Type"] = "text/html";
                        response.headers.status = 200;
                    }
                });
            }catch(e){
                this.logger.error("Error evaluating. \n\n%s", request.requestURI).
                    exception(e);
                response.body = e.toString();
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
        handlePost: function(request, response){
            response.m("postparams",String(request.body));//should be a json string
            return this.handleGet(request,response);
        }
    });
    
})(  jQuery, Claypool, Claypool.Server );
