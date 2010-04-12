/**
 * @author thatcher
 */
(function($, $M){ 
    
    var log,
        cache;
    
    $M.Docs = function(options){
        $.extend(true, this, options);
        log = $.logger('ClaypoolJS.Models.Docs');
        cache = {};
    };
    
    $.extend($M.Docs.prototype,{
        get: function(id){
            id = 'docs/'+(id||'metadata');
            var url = $.env('data')+id+'.json';
            if(!cache[url]){
                $.ajax({
                    type:'GET',
                    url:url,
                    dataType:'text',
                    async:false,
                    success: function(json){
                        log.debug('Loaded data %s',json); 
                        cache[url] = $.json2js(json)._;
                    },
                    error:function(xhr, status, e){
                        log.error('failed to load data %s', url).
                            exception(e);
                    }
                });
            }
			
            return cache[url];
        },
        forRelease: function(release){
            var docs = this.get(),
                doc;
            for(i=0;i<docs.length;i++){
                if(docs[i].id == release.doc){
                    doc = docs[i];
                    break;
                }
            }
            return doc||{};
        }
    });
    
})(jQuery, ClaypoolJS.Models);
 