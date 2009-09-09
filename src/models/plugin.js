/**
 * @author thatcher
 */
(function($,$$,$M){
    
    $.extend($, {
        model: function(name, fields, options){
            return new $M.Model(name, fields, options);
        },
        query: function(options){
            return new $M.Query(options);
        }
    });
    
})(jQuery, Claypool, Claypool.Models);
