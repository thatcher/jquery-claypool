

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
    //TODO : what is the useful static plugin that could be derived from Claypool.Server?
    //      console ?
    var $log;
    
    var console;
    
    $.extend($, {
        '>' : function(command){
            console = console || new $$Web.Console();
            console.run(command);
        },
        serve: function(request, response){ 
            $log = $log||$.logger("Claypool.Server");
            $log.info("Handling global request routing for request: %s ", request.requestURL).
                 debug("Dispatching request to Server Sevlet Container");
            response.headers = {};
            $.extend( response.headers, { contentType:'text/html', status: 404 });
            response.body = "<html><head></head><body>"+
                "Not Found :\n\t"+request.requestURL+
            "</body></html>";
            try{
                $(document).trigger("claypool:serve",[
                    {url:request.requestURL},
                    request, response
                ]);
            }catch(e){
                $log.error("Error Handling Request.").exception(e);
                response.headers["Content-Type"] = "text/html";
                response.headers.status = 500;
                response.body = "<html><head></head><body>"+e||"Unknown Error"+"</body></html>";
            }
        },
		servlet: function(target){
            $$.extend(target, $$Web.Servlet);
        },
        proxy: function(options){
            return $.invert([{ 
                id:options.id||'proxy_'+$.guid(),    
                clazz:"Claypool.Server.WebProxyServlet", 
                options:[{
                    rewriteMap:options.rewrites
                }]
            }]);
        }
		/*,
        //TODO this is deprecated
        render: function(request, response){
            $log.debug("Finished Handling global request : %s  response %o", request.requestURL, response);
        }*/
    });
    
    /**@global*/
    ClaypoolServerHandler = $.serve;
    
    
})(  jQuery, Claypool, Claypool.Server );
