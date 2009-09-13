/**
 * @author thatcher
 */
(function($, $M, _){ 
    
    var data,// the data
        log;
    
    $M.Docs = function(options){
        $.extend(true, this, options);
        log = $.logger('Site.Models.Docs');
    };
    
    $.extend($M.Docs.prototype,{
        get: function(){
            var url = $.env('data')+'docs/metadata.json';
            if(!data){
                $.ajax({
                    type:'GET',
                    url:url,
                    datatype:'json',
                    async:false,
                    success: function(json){
                        log.debug('Loaded data %s',json); 
                        data = _.json2js(json)._;
                    },
                    error:function(xhr, status, e){
                        log.error('failed to load data %s', url).
                            exception(e);
                    }
                });
            }
			
            return data;
        }
    });
    
})(jQuery, Site.Models, jsPath);
 