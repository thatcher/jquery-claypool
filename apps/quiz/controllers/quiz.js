/**
 * Example @VERSION - 
 *
 * Copyright (c) 2008-2009 ClayoolJS
 *
 */
(function($, $C){
    
	var Quiz,
	    log;
	
    $C.Quiz = function(options){
        $.extend(true, this, options);
		Quiz = $.$('#quizModel');
		log = $.logger('Example.Controllers.Quiz');
    };
    $.extend($C.Quiz.prototype, {
        show:function(event){
			var params = event.params();
			log.debug('Handling event %s, id: %s', event.target, params.id);
			event.v('.think').render(function(){
				Quiz.get('questions',function(questions){			
					event.
						m({'questions':questions}).
						v('.update').
						render(function(){
					  		//preload answers
					  		Quiz.get('answers');
						});  
				});
			});
        },
		score:function(event){
			var responses, score = {
				correct: 0,
				incorrect: 0,
				total: 0
			};
			log.debug('Handling event %s', event.target);
			Quiz.get('answers',function(answers){		
				//do the scoring
				responses = $('input[name*=question]:checked',event.target);
				if(responses.length!=answers.length){
					//renders to default view method '.update'
					event.m().flash.
						push('Please complete all questions.');
					event.render();
				}else{
					score.total = score.incorrect = answers.length;
					$(responses).each(function(index,value){
						if(this.value == answers[index].value){
							score.incorrect--;
							score.correct++;
						}
					});
					event.
						m({'score':score}).
						v('.score').
						render().
						c('#quizController.show');//clears the flash if any 
				}
			});
		}
    });
    
})(jQuery, Example.Controllers);