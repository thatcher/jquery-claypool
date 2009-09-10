/**
 * @author thatcher
 */
(function($,$$,$M){
    
	var log;
	
    $M.Query = function(options){
        $.extend(true, this, options,{
            context: '',
            selectors:[],
            expressions:[],
            orderby:{ direction:'forward' },
            limit:0,
            startPage:0,
            resultsPerPage: 20
        });
		log = $.logger('Claypool.Models.Query');
    };
    var $Q = $M.Query;
   
    $.extend($Q.prototype, {
       /**
        * Target Functions
        * @param {Object} name
        */
       items: function(selector){
           if(selector && (typeof selector == 'string')){
               // if arg is string
               // a select `selector` 
               this.selectors.push(selector);
           }else if(selector && selector.length && 
                   (selector instanceof Array)){
               // if selector is array
               // a select (`selector[0]`, `selector[1]`, etc) 
               $.merge(this.selectors,selector);
           }else{
               // if arg is not any of the above it is '*'
               // a select `selector` 
               this.selectors.push('*');
           }
           //chain all methods
           return this;
       },
       names: function(){
           //chain all methods
           return this.items('itemName()');
       },
       count: function(){
           //chain all methods
           return this.items('count()');
       },
       /**
        * Operator Functions
        * @param {Object} name
        */
       is: function(value){
           _compare(this,'=');
           _value(this,value);
           //chain all methods
           return this;
       },
       isnot: function(value){
           _compare(this,'!=');
           _value(this,value);
           //chain all methods
           return this;
       },
       islike: function(value){
           _compare(this,'~');
           _value(this,value);
           //chain all methods
           return this;
       },
       isnotlike: function(value){
           _compare(this,'!~');
           _value(this,value);
           //chain all methods
           return this;
       },
       isgt:function(value){
           _compare(this,'>');
           _value(this,value);
           //chain all methods
           return this;
       },
       isgte:function(value){
           _compare(this,'>=');
           _value(this,value);
           //chain all methods
           return this;
       },
       isbetween:function(values){
           _compare(this,'><');
           _value(this,values);
           //chain all methods
           return this;
       },
       islte: function(value){
           _compare(this,'<=');
           _value(this,value);
           //chain all methods
           return this;
       },
       islt:function(value){
           _compare(this,'<');
           _value(this,value);
           //chain all methods
           return this;
       },
       isin: function(values){
           _compare(this,'@');
           _value(this,value);
           //chain all methods
           return this;
       },
       isnotin: function(values){
           _compare(this,'!@');
           _value(this,value);
           //chain all methods
           return this;
       },
       /**
        * ResultSet Preparation Functions
        * @param {Object} name
        */
       orderby: function(name){
           _order(this,name);
           //chain all methods
           return this;
       },
       reverseorderby: function(name){
           _order(this, name, 'reverse');
           //chain all methods
           return this;
       },
       limit: function(count){
           this.limit = count;
       },
       //Pagination functions
       page: function(i, resultsPerPage){
           if(resultsPerPage){
               this.count = resultsPerPage;
           }
           this.startPage = i;
           //chain all methods
           return this;
       },
       next: function(callback){
           this.startPage++;
           //chain all methods
           return this;
       },
       previous:function(callback){
           this.startPage--;
           //chain all methods
           return this;
       }
    });
    
   /**
    * Expression Functions
    * @param {Object} name
    */
    var sugar = ['','like','gt','gte','between','lte','lt'];
    for(var i=0;i<sugar.length;i++){
        $Q.prototype['where'+sugar[i]]=function(name){
            _express(this, name, 'where', '');
            return this;
        };
        $Q.prototype['wherenot'+sugar[i]]=function(name){
            _express(this, name, 'where', 'not');
            return this;
        };
        $Q.prototype['whereeither'+sugar[i]]=function(name){
            _express(this, name, 'either', '');
            return this;
        };
        $Q.prototype['whereneither'+sugar[i]]=function(name){
            _express(this, name, 'either', 'not');
            return this;
        };
        $Q.prototype['and'+sugar[i]]=function(name){
            _express(this, name, 'and', '');
            return this;
        };
        $Q.prototype['andnot'+sugar[i]]=function(name){
            _express(this, name, 'and', 'not');
            return this;
        };
        $Q.prototype['or'+sugar[i]]=function(name){
            _express(this, name, 'or', '');
            return this;
        };
        $Q.prototype['ornot'+sugar[i]]=function(name){
            _express(this, name, 'or', 'not');
            return this;
        };
    }
    
                           //this,string|object,and|or,like|gte|lte,not 
    var _express = function(query, condition, logical, operator, negate){
       var prop = null;
       operator = operator?operator:'is';
       
       if(query && condition && logical &&
                $.isFunction(query[logical])){
           
           if(logical == 'where'){
               query.expressions = [];
               logical = 'and';
           }else if(logical == 'whereeither' || logical == 'whereneither'){
               query.expressions = [];
               logical = 'or';
           }
           if(typeof condition == 'string'){
               //or `name` = ""
               query.expressions.push({
                   name:condition,
                   type:logical
               });
           }else if(condition &&
                 	typeof(condition) == 'object' && 
                 	!(condition instanceof Array)){
               // if condition is object
               // where `a` = '1' or `b` = '2'  or `c` = '3'
               for(prop in condition){
                   if(typeof(condition[prop])=='string'){
                       if(negate){
                           query[logical](prop)['isnot'+operator](condition[prop]);
                       }else{
                           query[logical](prop)['isnot'+operator](condition[prop]);
                       }
                   }else if(operator===''&&//arrays only apply to equal/not equal operator
                               condition[prop]&&
                               condition[prop].length&&
                               condition[prop] instanceof Array){
                       if(negate){
                           query[logical](prop).isnotin(condition[prop]);
                       }else{
                           query[logical](prop).isin(condition[prop]);
                       }
                   }
               }
           }
       }
   };
   var _compare = function(query, symbol){
       query.expressions[
           query.expressions.length-1
       ].operator=symbol;
   };
   var _value = function(query, value){
       query.expressions[
           query.expressions.length-1
       ].value=value;
   };
   var _name = function(query, name){
       query.expressions[
           query.expressions.length-1
       ].name=name;
   };
   var _order = function(query, name, direction){
       query.orderby = {
           name:name,
           direction:(direction||'forward')
       };
   };
   
   /**
    * scratch pad 
    * 
        var _;
      
        //select * from `artists` where `$name` = 'Vox Populi' 
        //or $tags in ('alternative', 'rock') 
        _ = new $Q();
      
        $('#artistsModel').find(
           _.items('*').
             where('$name').
             is('Vox Populi').
             or('$tags').
             isin(['alternative', 'rock']),
           function(results, pages){
               //do something with results
           }
        );
        //is equivalent to
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items('*').
             where({$name:'Vox Poluli'}).
             or({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
        
        //select (`$name`, `$artistid`) from `artists` where `$tags` in ('alternative', 'rock')
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items(['$name','$artistid']).
             where({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
       
        //select (`$name`) from `artists` where `$tags` in ('alternative', 'rock')
        _ = new $Q();
        
        $('#artistsModel').find(
           _.items('$name').
             where({'$tags':['alternative', 'rock']}),
           function(results, pages){
               //do something with results
           }
        );
       
       
       //select (itemName()) from `artists` where `$name`="Vox Populi" 
       // or `$label`="Nonrational"
        _ = new $Q();
        
        $('#artistsModel').find(
           _.names().
             either({
                 '$name':'Vox Populi',
                 '$label':'Nonrational'
             }),
           function(results, pages){
               //do something with results
           }
        );
        
       //select (itemName()) from `releases` where `$date` not null  
       // orderby `$date`
        _ = new $Q();
        
        $('#releasesModel').find(
           _.names().
             orderby('$date'),
           function(results, pages){
               //do something with results
           }
        );
        
       //select (count()) from `releases` where `$artist` = "Vox Populi"
        _ = new $Q();
        
        $('#releasesModel').find(
           _.count().
             where('$artist').
             is("Vox Populi"),
           function(results, pages){
               //do something with results
           }
        );
   */
   })(jQuery, Claypool, Claypool.Models);
