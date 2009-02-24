

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    
    $$.Configuration = {
        /** Please see each module for specific configuration options */
        //this is a short list of well knowns, but can always be '$.extend'ed
        ioc:[], 
        aop:[], 
        logging:[], 
        mvc:{ 
        	"hijax:a":[],
        	"hijax:form":[],
        	"hijax:button":[],
        	"hijax:event":[]
	    },
    	env : {
    	  dev:{},
    	  prod:{},
    	  test:{}
    	}
    };

})(  jQuery, Claypool );
