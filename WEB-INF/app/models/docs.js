/**
 * @author thatcher
 */
(function($, $M, _){ 
    
    var log,
        cache;
    
    $M.Docs = function(options){
        $.extend(true, this, options);
        log = $.logger('Site.Models.Docs');
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
                    datatype:'json',
                    async:false,
                    success: function(json){
                        log.debug('Loaded data %s',json); 
                        cache[url] = _.json2js(json)._;
                    },
                    error:function(xhr, status, e){
                        log.error('failed to load data %s', url).
                            exception(e);
                    }
                });
            }
			
            return cache[url];
        }
    });
    
})(jQuery, Site.Models, jsPath);
 