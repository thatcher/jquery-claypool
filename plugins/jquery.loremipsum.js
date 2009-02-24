(function($){
/**
*	Chris Thatcher - claypooljs.com
*
* 	Ported with love (and little change or effort) from the 
*	Django Python Application Framework (djangoproject.com)
*	"""
*	Utility functions for generating "lorem ipsum" Latin text.
*	"""
*/

	var COMMON_P = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

	var WORDS = ['exercitationem', 'perferendis', 'perspiciatis', 'laborum', 'eveniet',
        'sunt', 'iure', 'nam', 'nobis', 'eum', 'cum', 'officiis', 'excepturi',
        'odio', 'consectetur', 'quasi', 'aut', 'quisquam', 'vel', 'eligendi',
        'itaque', 'non', 'odit', 'tempore', 'quaerat', 'dignissimos',
        'facilis', 'neque', 'nihil', 'expedita', 'vitae', 'vero', 'ipsum',
        'nisi', 'animi', 'cumque', 'pariatur', 'velit', 'modi', 'natus',
        'iusto', 'eaque', 'sequi', 'illo', 'sed', 'ex', 'et', 'voluptatibus',
        'tempora', 'veritatis', 'ratione', 'assumenda', 'incidunt', 'nostrum',
        'placeat', 'aliquid', 'fuga', 'provident', 'praesentium', 'rem',
        'necessitatibus', 'suscipit', 'adipisci', 'quidem', 'possimus',
        'voluptas', 'debitis', 'sint', 'accusantium', 'unde', 'sapiente',
        'voluptate', 'qui', 'aspernatur', 'laudantium', 'soluta', 'amet',
        'quo', 'aliquam', 'saepe', 'culpa', 'libero', 'ipsa', 'dicta',
        'reiciendis', 'nesciunt', 'doloribus', 'autem', 'impedit', 'minima',
        'maiores', 'repudiandae', 'ipsam', 'obcaecati', 'ullam', 'enim',
        'totam', 'delectus', 'ducimus', 'quis', 'voluptates', 'dolores',
        'molestiae', 'harum', 'dolorem', 'quia', 'voluptatem', 'molestias',
        'magni', 'distinctio', 'omnis', 'illum', 'dolorum', 'voluptatum', 'ea',
        'quas', 'quam', 'corporis', 'quae', 'blanditiis', 'atque', 'deserunt',
        'laboriosam', 'earum', 'consequuntur', 'hic', 'cupiditate',
        'quibusdam', 'accusamus', 'ut', 'rerum', 'error', 'minus', 'eius',
        'ab', 'ad', 'nemo', 'fugit', 'officia', 'at', 'in', 'id', 'quos',
        'reprehenderit', 'numquam', 'iste', 'fugiat', 'sit', 'inventore',
        'beatae', 'repellendus', 'magnam', 'recusandae', 'quod', 'explicabo',
        'doloremque', 'aperiam', 'consequatur', 'asperiores', 'commodi',
        'optio', 'dolor', 'labore', 'temporibus', 'repellat', 'veniam',
        'architecto', 'est', 'esse', 'mollitia', 'nulla', 'a', 'similique',
        'eos', 'alias', 'dolore', 'tenetur', 'deleniti', 'porro', 'facere',
        'maxime', 'corrupti'];

	var COMMON_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
        'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt',
        'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];

	$.sentence = function(){
	    /*"""
	    Returns a randomly generated sentence of lorem ipsum text.
	
	    The first word is capitalized, and the sentence ends in either a period or
	    question mark. Commas are added at random.
	    """*/
	    //# Determine the number of comma-separated sections and number of words in
	    //# each section for this sentence.
	    var sections = [];
	    var range = randomNumber(1,5);
	    for(var i=0;i<range;i++){
	    	sections.push(randomSample(WORDS, randomNumber(3, 12)).join(' '));
	    } var s = sections.join(', ');
	    //# Convert to sentence case and add end punctuation.
	    return (s.charAt(0).toUpperCase() + s.slice(1) + randomLetter('?.'));
	};

	$.paragraph = function(){
	    /*"""
	    Returns a randomly generated paragraph of lorem ipsum text.
	
	    The paragraph consists of between 1 and 4 sentences, inclusive.
	    """*/
	    var paragraph = [];
	    var range = randomNumber(1,4);
	    for(var i=0;i<range;i++){
	    	paragraph.push($.sentence());
	    } return paragraph.join(' ');
	};

	$.paragraphs = function(count, common){
		common = (common===null)?true:common;
	    /*"""
	    Returns a list of paragraphs as returned by paragraph().
	
	    If `common` is True, then the first paragraph will be the standard
	    'lorem ipsum' paragraph. Otherwise, the first paragraph will be random
	    Latin text. Either way, subsequent paragraphs will be random Latin text.
	    """*/
	    var paras = [];
	    for ( var i=0; i<count;i++){
	        if (common && i == 0)
	            paras = paras.concat(COMMON_P);
	        else
	            paras = paras.concat($.paragraph());
	    } return paras;
	};

	$.words = function(count, common){
		common = (common===null)?true:common;
	    /*"""
	    Returns a string of `count` lorem ipsum words separated by a single space.
	
	    If `common` is True, then the first 19 words will be the standard
	    'lorem ipsum' words. Otherwise, all words will be selected randomly.
	    """*/
	    var word_list;
	    if (common)
	        word_list = COMMON_WORDS;
	    else
	        word_list = [];
	        
	    var c = word_list.length;
	    var i;
	    if (count > c){
	    	word_list = word_list.concat( randomSample(WORDS, count-c) );
	    }else{
	        word_list = word_list.splice(0,count);
	    } return word_list.join(' ');
	};

	$.titled = function(count, common){
		//a convience function to upper case the resulting words
		var title = [];
		var words = $.words(count, common);
		$.each(words.split(' '), function(pos, word){
			title.push(word.charAt(0).toUpperCase()+word.slice(1));
		}); return title.join(' ');
	};
	
	var randomSample = function(array, count){
		var randomArray = [];
		for(var i=0;i<count;i++){
			randomArray.push(array[randomNumber(0, array.length)]);
		} return randomArray;
	};
	
	var randomNumber = function(startRange, endRange){
		var range = endRange - startRange;
		return Math.ceil(Math.random()*range);
	};
	
	var randomLetter = function(letters){
		return letters.charAt(randomNumber(0, letters.length-1));
	};
})(jQuery);