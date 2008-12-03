(function($,$M){
	$M.TracWiki$Class = {
	    url:null,
	    manifest: null,
	    defaultHash:null,
	    currentHash:null,
	    defaultUrl:null,
	    currentUrl:null,
	    constructor: function(options){
	        $.extend( this, 
	        	$.DAO.Publisher$Interface,
	        	new $.SimpleCachingStrategy(options),
	        	$M.TracWiki$Class,
	        	$.Logging.getLogger("API.Model.TracWiki")
        	 );
	        jQuery.extend(true, this, options);
	        this.currentHash = this.defaultHash;
	    },
	    find: function(id, _callback){
	        this.debug("Accessing data %s", id);
	        var main, sub = null;
	        var hashIndex = id.indexOf("#")==-1?id.length:id.indexOf("#");
	        main = id.substring(0, hashIndex);
	        if(main==""){main=this.currentUrl;}
	        sub  = id.substring(hashIndex+1 , id.length);
	        if(sub==""){sub=this.currentHash;}
	        this.currentHash = sub;
	        var _this = this;
	        var route = null;
	        for(var i=0; i< this.manifest.length; i++){
	        	route = this.manifest[i];
	        	if(route.source.match(main)){
	        		break;
	        	}route = null;
	        }
	        if(route){
	            if(this.cache[route.target]){
	                this.debug("Getting data from cache %s", route.target);
	                if(_callback){_callback( this.cache[route.target] );}
	                return this.cache[route.target];
	            }else{
	                this.debug("Getting data from url %s", route.target);
	                $.ajax({
	                	type	: 'get',
	                    url		: this.serviceUrl + ((this.mode=="path")?route.target+sub:""),
	                    dataType: 'text',
	                    data	: { 
	                    	format	: 'txt',
	                    	page	: route.target + ((this.mode=="param")?sub:"")
                    	},
	                    success	: function(wikiText){
	                        _this.info("Retreived target %s", route.target);
	                        _this.add(id, wikiText);
	                        _this.currentUrl = main;
	                      	if(_callback){_callback({
	                       			wikiText:wikiText,
	                       			target:sub
	                       		});
                       		}
	                   },
	                   error	: function(xhr, status, e){
	                   		_this.warn("Failed to load target %s.", route.target);
	                   }
	                });
	            }
	        }else{
	            this.warn("Can't find entry %s in manifest", id);        
	        }
	        return null;
	    },
        findAll: function(callback){
            throw new $.MethodNotImplementedError();
        },
        findBy: function(criteria, params, callback){
            throw new $.MethodNotImplementedError();
        }
	};
	/**constructor alias*/
	$M.TracWiki = $M.TracWiki$Class.constructor;
})(jQuery, API.Models);