/**
 * @author thatcher
 */
(function($, $M){
    
    var data,
        log;
    
    $M.Releases = function(options){
        $.extend(true, this, options);
        log = $.logger('ClaypoolJS.Models.Releases');
    };
    
    $.extend($M.Releases.prototype,{
        get: function(id){
            var url = $.env('data')+'releases/metadata.json';
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
                //find the releases based on the id passed
                for(i=0;i<data.length;i++){
                    if(data[i].id == id){
                        return data[i]; 
                    }
                }
                log.warn('Release id %s not found', id);
                return null;
            }
            return data;
        },
        recent: function(){
            var all = this.get();
            return all.slice(0,all.length>1?2:1);
        }
    });
    
})(jQuery, ClaypoolJS.Models);