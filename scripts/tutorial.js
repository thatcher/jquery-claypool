/**
 * @author thatcher
 */

jQuery(function($){
    $('a[href*=tutorial]').click(function(event){
        event.stopPropagation();
        event.preventDefault();
        $('#tutorial_src').attr('src',
            $(event.target).attr('href'));
    });
});