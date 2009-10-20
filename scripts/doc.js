/**
 * @author thatcher
 */
(function($){
    
    $( function(){ 
       $('code, pre', $('#doc')).each(function(){
           $(this).text($(this).text().replace('&#x7B;','{','g'));
       }); 
    });
    
})(jQuery);
        