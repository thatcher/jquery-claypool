
/*
 * Claypool @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-09-27 13:17:28 -0400 (Sat, 27 Sep 2008) $
 * $Rev: 273 $
 */



/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$IoC){
	/**
	 * @constructor
	 */
    NetWorker$AbstractClass : {
	        connectionStatus: null,
	        constructor: function(options){
	            $.extend(this, $.Models.NetWorker$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.DAO.NetWorker");
	            var _this = this;
	            jQuery(document).bind('claypool:online claypool:offline', this.onNetworkStatusChange);
	            jQuery(document).bind('ajaxSend', this.testConnection);
	            jQuery(document).bind('ajaxComplete', function(xhr, status){
	                _this.logger.debug("Resource retreival Complete : %s", status);
	            });
	        },
	        testConnection: function(xhr){
	            var _this = this;
	            if(xhr.type !== 'HEAD'){//avoid infite stack of calls to testConnection ;)
	                jQuery.ajax({
	                    type:"HEAD",
	                    async:false,
	                    url:"/",
	                    success: function(){
	                        /**Online implementation*/
	                        _this.logger.debug("Application Network Mode: Online");
	                        _this.connectionStatus = 'ONLINE';
	                        jQuery(document).trigger("claypool:online");
	                    },
	                    error: function(xhr){
	                        /**Offline implementation*/
	                        _this.logger.debug("Application Network Mode: Offline");
	                        _this.connectionStatus = 'OFFLINE';
	                        jQuery(document).trigger("claypool:offline");
	                        return true;//Cancels the request                    
	                    }
	                });
	            }
	        },
	        onNetworkStatusChange: function(event, extra){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	
})(  jQuery, Claypool, Claypool.IoC );
