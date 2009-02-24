Claypool.DAO={
/*
 * Claypool.DAO @VERSION - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 *   -   Generic DataAccessObject Patterns  -
 */
};
(function($, $Log, $DAO){
	
	$.extend( $DAO,  {
	    Publisher$Interface : {
	        create: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        replace: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        update: function(id, model, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        _delete: function(id, callback){//reserved word 'delete'
	            throw new $.MethodNotImplementedError();
	        }
	    },
    	Consumer$Interface : {
	        //Generic Query interface to get entire records
	        find: function(id, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        findAll: function(callback){
	            throw new $.MethodNotImplementedError();
	        },
	        findBy: function(criteria, params, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    Searcher$Interface : {
	        //Think OpenSearch, for getting paged result sets
	        search: function(query, callback){
	            throw new $.MethodNotImplementedError();
	        },
	        suggest: function(query, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
	    Synchronizer$Interface : {
	        // if dirtyRecords is null, the method is expected to determine
	        //  which records have changed since the timestamp and provide 
	        //  those records as as array to the callback.  Otherwise it
	        //  is expected to provide any logic to update the dirty records
	        //  in its own storage implementation
	        synchronize: function(dirtyRecords, timestamp, callback){
	            throw new $.MethodNotImplementedError();
	        }
	    },
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
	    Gears$Class : {
	    	dbName:null,
	    	connection:null,
	        constructor: function(options){
	            jQuery.extend(this, $DAO.Gears$Class);
	            jQuery.extend(true, this, options);
	            this.logger = $Log.getLogger("Claypool.DAO.Gears");
	            this.connection = google.gears.factory.create('beta.database');
	        },
	        execute: function(options){
	            this.logger.debug("Executing SQL: \n\t\t %s", options.sql);
	            var resultSet = this.connection.execute(options.sql);
	            if(options.callback){options.callback(resultSet);}else{resultSet.close();}
	            return this;//chain
	        },
	        executeWithParams: function(options){
	            this.logger.debug("Executing SQL: \n\t\t %s, %s", options.sql, options.params);
	            var resultSet =  this.connection.execute( options.sql, options.params );
	            if(options.callback){options.callback(resultSet);}else{resultSet.close();}
	            return this;//chain
	        },
	        begin: function(){
	            this.logger.debug("Beginning SQL Transaction %s", this);
	            this.connection.execute( "BEGIN" );
	            return this;//chain
	        },
	        commit: function(){
	            this.logger.debug("Commit SQL Transaction %s", this);
	            this.connection.execute( "COMMIT" ).close();
	            return this;//chain
	        },
	        rollback: function(){
	            this.logger.info("Rolling Back SQL Transaction %s", this);
	            this.connection.execute( "ROLLBACK" ).close();
	            return this;//chain
	        },
	        lastId: function(){
	            //doesnt chain
	            return this.connection.lastInsertRowId;
	        }
	    }
	});
	/**@constructorAlias*/
	$DAO.NetWorker                  = $DAO.NetWorker$AbstractClass.constructor;
	/**@constructorAlias*/
	$DAO.NetWorkAdaptor             = $DAO.NetWorkAdaptor$Class.constructor;
	/**@constructorAlias*/
	$DAO.Gears                      = $DAO.Gears$Class.constructor;
		
})( Claypool,/*Required Modules*/
	Claypool.Logging,
	Claypool.DAO );

//Give a little bit, Give a little bit of our dao to you. ;)
(function($){ 
	$.DAO = Claypool.DAO;
})(jQuery);
