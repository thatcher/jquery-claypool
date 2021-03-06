/**
 * <: @VERSION@ :>
 * 
 * Copyright (c) 2008-2009 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * jQuery E4X Templates  
 * 
 * A Django Style Templating language leveraging the 
 * power of e4x and jQuery 
 */
 
(function($){
 
    var cache = {},
		stateMapCache = {},
		blockMapCache = {},
		log;
    
    $.fn.e4x = function(){
        return new XMLList($(this).x());
    };
    
    $.e4x = function(url, model, is_root){
        if(arguments.length == 1){
            return new XMLList($.x(arguments[0]));
        }
        var e4x, nullfunction = function(){return this;};
        log = $.logger?$.logger('jQuery.E4X'):{
            debug:nullfunction,
            info:nullfunction,
            warn:nullfunction,
            error:nullfunction,
            exception:nullfunction
        };
        url = (  $.env ? $.env('templates') : '' ) + url;
		if(!cache[url]){
            log.info('loading template %s', url);
	        $.ajax({
	            url: url,
	            type: "GET",
	            dataType:"text",
	            async:false,
	            success: function(text){
                    text = text+'';
                    log.debug('loaded %s', url);
	                var base, block, blockMap = {};
					if(is_root){
						//we need to render out the block hierarchy
						//and cache the result so we don't waste time on each 
						//actual render with static block logic
						cache[url] = e4x_eval(text, blockMap, model, false).toString();
					}else{
						cache[url] =  e4x_eval(text, blockMap, model, false);
					} 
					blockMapCache[url] = blockMap;
					
					//causes template to be added to file monitor
                    if($.env&&$.env('monitorTemplates')=='true'){
                        try{load(url.split('?')[0])}catch(e){};
                    }                
	            }, 
				error:function(xhr, status, e){
                    log.error('error loading %s (%s)', url, status).
                        exception(e);
	                cache[url] = e4x_eval("<e4x>"+
                            "<h3>Error Loading: "+url+"</h3>"+
                        "</e4x>", 
                        null, model, false).toXMLString();  
				}
	        });  
		}

	    return is_root ? 
            e4x_eval(cache[url], blockMapCache[url], model, true) :
            cache[url];
    };
    
    var e4x_eval = function(text, blockMap, model, deep){
		var xml_settings = XML.settings();
		
    	var extend = function(url){
    		return $.e4x(url, model, deep);
    	};
        
        
        var evaluated;
        with(model){
            log.debug('evaluating as e4x \n%s',text);
            eval("evaluated = (function(){"+
                "return new XMLList("+text+");"+
            "})();"); 
        }
					
		//all blocks are treated in document order
		var blocks = evaluated..block,
			compiled,
			rendered,
			parent,
			block, id; 
			
		if(deep){
            log.debug('checking blocks');
			//first loop through and make sure we know
			//which blocks are part of the final cascade
			for each(block in blocks){
                log.debug('checking block')
				if( !block.@id ){
					//if it doesn't have an id it's not
					//a valid block and we throw it out
					//with the bath water
					delete block;
				}else{
					id = block.@id.toString();
                    log.debug('checking block id %s', id);
					if(!blockMap[id]){
                        log.debug('block %s not yet defined', id);
						//store the default block
						blockMap[id] = block.*.copy();
						delete block.*;
					}else{
                        log.debug('block %s already defined', id);
						//replace the default block
						blockMap[id] = block.*.copy();
						delete block.*;
						delete block;
					}
				}
			}
			//now loop through the final remaining blocks
			if(evaluated.elements().length() > 0){
                log.debug('replacing compiled blocks');
                compiled = evaluated.elements()[0].copy();
                delete evaluated;
                
                blocks = compiled..block;
                log.debug('beginning with %s compiled blocks', blocks.length());
                while(blocks.length() > 0){
                    
                    log.debug('replacing blocks');
                    for each(block in blocks){
                        id = block.@id.toString();
                        log.debug('replacing block id %s', id);
                        //step 2: check block
                        if(!blockMap[id]){
                            //step 2: deleting block 
                            delete block;
                        }
                        //step 2: replacing block
                        compiled..block.(@id == id)[0] = blockMap[id]||'';
                    }
                    
                    blocks = compiled..block;
                }
				
                //finally replace each <e4x> element with it's children
                for each(var e4x in compiled..e4x){
                    e4x = e4x.children();
                }
                    
				rendered = compiled.*.copy();
				delete compiled;
			}
			
		}
		rendered = rendered||evaluated;
		XML.setSettings(xml_settings);
		return rendered;
		
    };

})(jQuery);