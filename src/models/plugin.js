/**
 * @author thatcher
 */
(function($,$$,$M){
    
    $.extend($, {
        db: function(options){
            return new $M.Factory(options);
        },
        model: function(name, fields, options){
            return new $M.Model(name, fields, options);
        },
        query: function(options){
            return new $M.Query(options);
        },
        index: function(){
            if(arguments.length === 0){
                return $.config('index');
            }else{
                return $.config('index', arguments[0]);
            }
        }
    });
    
})(jQuery, Claypool, Claypool.Models);
