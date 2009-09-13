/**
 * @author thatcher
 */
(function($){
    
    $( function(){ 
       $('code', $('#doc')).each(function(){
           $(this).text($(this).text().replace('&#x7B;','{','g'));
       }); 
    });
    
})(jQuery);
        