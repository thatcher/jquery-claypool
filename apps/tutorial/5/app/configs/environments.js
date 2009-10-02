
(function($){ 
    
   $.env({
        defaults:{
            version:'0.0.0'
        },
        dev:{
            client:{
                pages:'/apps/tutorial/5/data/'
            }
        },
        test:{
            client:{
                pages:'/jquery-claypool/apps/tutorial/5/data/'
            }    
        },
        qa:{
            client:{
                pages:'/jquery-claypool-qa/apps/tutorial/5/data/'
            }
        },
        prod:{
            client:{
                pages:'/data/'
            }
        }
    });     
    
})(jQuery);
    
