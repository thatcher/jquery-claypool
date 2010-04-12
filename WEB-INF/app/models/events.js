/**
 * @author thatcher
 */
(function($, $M){ 
    
    var data,
        log;
    
    $M.Events = function(options){
        $.extend(true, this, options);
        log = $.logger('ClaypoolJS.Models.Events');
    };
    
    $.extend($M.Events.prototype,{
        get: function(){
            var url = $.env('data')+'events/metadata.json';
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
            return data;
        },
        recent: function(){
            var all = this.get();
            return all.slice(0,all.length>2?3:all.length)
        }
    });
    
})(jQuery, ClaypoolJS.Models );
 