/**
 * @author thatcher
 */
(function($, $M){ 
    
    var data,
        log;
        
    $M.Examples = function(options){
        $.extend(true, this, options);
        log = $.logger('ClaypoolJS.Models.Examples');
    };
    
    $.extend($M.Examples.prototype,{
        get: function(id){
            var url = $.env('data')+'examples/metadata.json';
            if(!data){
                $.ajax({
                    type:'GET',
                    url:url,
                    dataType:'text',
                    async:false,
                    success: function(json){
                        log.debug('Loaded data %s',json); 
                        data = $.json2js(json)._;
                    },
                    error:function(xhr, status, e){
                        log.error('failed to load data %s',url).
                            exception(e);
                    }
                });
            }
            if(id){
                //find the example based on the id passed
                for(i=0;i<data.length;i++){
                    if(data[i].id == id){
                        return data[i]; 
                    }
                }
                log.warn('Example id %s not found', id);
                return null;
            }
            return data;
        }
    });
    
})(jQuery, ClaypoolJS.Models);
 