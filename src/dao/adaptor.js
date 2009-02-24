
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
    NetWorkAdaptor$Class : {
	        onlineDAO:null,
	        offlineDAO:null,
	        currentDAO:null,
	        constructor: function(options){
	            $.extend(this, new $DAO.NetWorker(options));
	            $.extend(this, $.Models.NetWorkAdaptor$Class);
	            $.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.DAO.NetWorkAdaptor");
	        },
	        onNetworkStatusChange: function(event, extra){
	            var i;
	            var now = new Date.getTime();
	            if(event.type == 'claypool:online' && 
	                this.connectionStatus && (this.connectionStatus == 'OFFLINE') ){
	                this.offlineDAO.synchronize(  null, now, function(offlineUpdates){//array of dirty resources/records
	                    if(offlineUpdates && offlineUpdates.length && offlineUpdates.length > 0){
	                        this.onlineDAO.synchronize( offlineUpdates, now, function(onlineUpdates){
	                            this.onlineDAO.synchronize( null, now,
	                            function(onlineUpdates){//array of dirty resources/records
	                                if(onlineUpdates && onlineUpdates.length && onlineUpdates.length > 0){
	                                    this.offlineDAO.synchronize( onlineUpdates, now );
	                                }
	                            });   
	                        });
	                    }
	                });
	                this.currentDAO = this.onlineDAO;
	            }else if(event.type == 'claypool:offline' && 
	                this.connectionStatus && (this.connectionStatus == 'ONLINE')){
	                this.currentDAO = this.offlineDAO;
	            }
	        }
	    },
	
})(  jQuery, Claypool, Claypool.IoC );
