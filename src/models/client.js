/**
 * @author thatcher
 */
(function($,$$,$M){
    
    $M.Client = function(options){
        $.extend(true, this, options);
    };
   
    $.each(['create','destroy','metadata','save','update','remove','get','find','js2query','next','previous'], 
        function(index, value){
            $M.Client.prototype[value] = function(options){
               this.db[value]($.extend(options,{
                   domain:this.name
               }));
               return this;
            };
        }
    );
    
})(jQuery, Claypool, Claypool.Models);
