
/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$){
    /**
     * @constructor
     */
    $$.Router = function(options){
        $$.extend(this, $$.SimpleCachingStrategy);
        $.extend(true, this, options);
        this.logger = $$.Logging.getLogger("Claypool.Router");
    };
    
    $.extend($$.Router.prototype, 
        $$.SimpleCachingStrategy.prototype, {
        /**the pattern map is any object, the pattern key is the name of 
        the objects property which is treated as a string to be compiled to
        a regular expression, The pattern key can actually be a '|' seperated
        set of strings.  the first one that is a property of the map will be used*/
        
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        compile: function(patternMap, patternKey){
            this.logger.debug("compiling patterns for match strategies");
            var pattern, routable, params;
            var i, j; 
            patternKey = patternKey.split('|');//supports flexible pattern keys
            for(i=0;i<patternMap.length;i++){
                for( j = 0; j<patternKey.length;j++){
                    pattern = patternMap[i][patternKey[j]];
					params = [];
                    if(pattern){
                        this.logger.debug("Compiling \n\tpattern: %s for \n\ttarget.", pattern);
						/**
						 * Suggestion from Martin Hrabovčin
						 * allow capturing via |:param|
						 * also added '<:foo(regexp):>/<:bar(regexp):>'
						 */
                        pattern = pattern.replace(/<\:(.+?)\:\>/g, function(){
							var name, i = arguments[0].indexOf('(');
							name = arguments[0].substring(2,i);
							params.push(name);
							return arguments[0].substring(i,arguments[0].length-2);
						});
						pattern = pattern.replace(/\|\:\w+\|/g, function(){
							var name;
							name = arguments[0].substring(2,arguments[0].length-1);
							params.push(name);
							return '(\\w+)';
						});
                        /**pattern might be used more than once so we need a unique key to store the route*/
                        this.add(String($.guid()) , {
                            pattern:new RegExp(pattern), 
                            payload:patternMap[i],
							params : params
                        });
                    }
                }
            }
            return this;
        },

        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        
        first: function(string){
            this.logger.debug("Using strategy 'first'");
            var route, id, map = {};
            for(id in this.cache){
                route = this.find(id);
                this.logger.debug("checking pattern %s for string %s", route.pattern, string);
                if(route&&route.pattern&&route.pattern.test&&route.pattern.test(string)){
                    this.logger.debug("found match for \n\tpattern: %s \n\ttarget : %s ", 
                        route.pattern, route.payload.controller||route.payload.rewrite );
					if (route.params && route.params.length > 0) {
						//make a parameter map
						string.replace(route.pattern, function(){
							var i;
							for (i = 1; i < arguments.length - 2; i++) {
								map[route.params[i-1]] = arguments[i];
							}
						});
					}
                    return [$.extend({map: map}, route)];
                }
            }
            this.logger.debug("found no match for \n\tpattern: %s", string);
            return [];
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        all: function(string){
            this.logger.debug("Using strategy 'all'");
            var routeList = [];
            var route, id, map = {};
            for(id in this.cache){
                route = this.find(id);
                this.logger.debug("checking pattern: %s for string %s", route.pattern, string);
                if(route&&route.pattern&&route.pattern.test&&route.pattern.test(string)){
                    this.logger.debug("found match for \n\tpattern: %s \n\ttarget : %s ", 
                        route.pattern, route.payload.controller);
					if (route.params && route.params.length > 0) {
						//make a parameter map
						string.replace(route.pattern, function(){
							var i;
							for (i = 1; i < arguments.length - 2; i++) {
								map[route.params[i-1]] = arguments[i];
							}
						});
					}
                    routeList.push($.extend({map: map}, route));
                }
            }
            if(routeList.length===0){this.logger.debug("found no match for \n\tpattern: %s", string);}
            return routeList;
        }
        
    });
    
})( jQuery, Claypool);
