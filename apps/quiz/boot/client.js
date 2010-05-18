//  -   BOOT THE APP  -
jQuery.noConflict();
(function($){
    
    //A static logger for any initialization routines we might add here
    var log = $.logger("Quiz");
    
    //The environments are described in environments.js
    try{
 	   $.env();
 	}catch(e){
 	   log.error("Environmental selection is invalid!").exception(e);
 	}
    
    $(document).ready(function(){
        log.info("Initializing Application");
        $.boot(function(){
          //you can do additional initialization here
            log.info("Successfully Initialized Application");
            var countdown = 10;
            var interval = setInterval(function(){
                $('#mini-app').text('Mini-App(loading)'+(countdown--));
                if(countdown === 0){
                    clearInterval(interval);
                    //Simulates definition of new app added via runtime script load
                    $.logging([{category:'Test.Controllers', level:'DEBUG'}]);
                    Test = {Models:{},Views:{},Controllers:{}};
                    (function($, $C){
                        var log;
                        $C.Foo = function(){
                            log = $.logger('Test.Controllers.Foo');
                        };
                        $C.Foo.prototype.handle = function(event){
                            log.debug('got event from mini app');
                            $('#mini-app').text('Mini-App(executed)');
                        };
                    })(jQuery, Test.Controllers);
                    $.scan(['Test.Controllers']);
                    $.routes({
                        'hijax:a':[{
                            id:'#test-hash-router',
                            active: true,
                            filter:"[href*=#test]",
                            stopPropagation:true,
                            preventDefault:true,
                            strategy:"first",
                            hijaxMap:
                               [{urls:"test/|:id|/$",   controller:"#fooController"}]
                        }]
                    });
                    $.boot(function(){
                        $('#mini-app').text('Mini-App(loaded)');
                    });
                }
            },1000);
        });
    });    
    
})(jQuery);  
