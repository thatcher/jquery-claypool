(function($, $V){
    
	
    $V.Quiz = function(options){
        $.extend(true, this, options);    
    };
    
    $.extend($V.Quiz.prototype,{
        think: function(){
			if(!$(this).hasTemplate()){
				$(this).text("loading quiz..");
            }
		},
        update : function(model){
            var _this = this;
            this.$log.debug("Rendering template");
			if(!$(this).hasTemplate()){
                $(this).setTemplateURL($.env('root')+$.env('templates')+"quiz.html");
				$(this).processTemplate(model);
            }
			if(model.flash.length>0){
				$('.flash',this).text(model.flash.join('<br/>'));
			}else{
				$('.flash',this).text('');
			}
        },
		score : function(model){
			$('#quiz_score',this).text("\
				You got "+model.score.correct+" correct!\
			");
		}
		
    });
    
    
})(jQuery,  Example.Views);