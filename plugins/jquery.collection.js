/**
 * jQuery.Collection
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com
 * Licensed under GPL license (http://www.opensource.org/licenses/gpl-license.php).
 * Date: 1/28/2008
 *
 * @projectDescription Extensible and inheritable jQuery-like collections
 * @author Ariel Flesler
 * @version 1.0.3
 *
 * @id $.collection
 * @param { *, Array } items Any amount of items for the collection, this is a generic (and the base) collection.
 * @return { $.collection } Returns a generic $.collection object.
 *
 * @id $.collection.build
 * @return {subclass of $.collection} Returns a subclass of it's caller ( $.collection in the first case ).
 */
;(function( $ ){
	
	var 
		f = function(){},
		emptyInstance = function( c ){//get an instance of this constructor, without calling it
			f.prototype = (c._constructor||c).prototype;
			return new f();
		},
		callConstructor = function( obj, args ){//calls the constructor of the object, passing an empty object.
			return obj.init.apply(emptyInstance(obj), args);
		},
		getConstructor = function(){//generate a constructor for a new collections
			return(function( list ){
				var constructor = arguments.callee,
					obj = this instanceof constructor ? this : emptyInstance(constructor);
				if( list && list._constructor === constructor ){//special case, cloning
					return obj.setArray( list.get() );
				} return obj.init.apply(obj,arguments);
			});	
		};
	
	var $collection = $.collection = getConstructor();//$.collection is a valid collection itself
	
	$.extend( $collection, {
		extend: $.extend,
		fn:$collection.prototype,
		statics:'extend,build,include,implement',
		build:function(){//creates a new collection, that include this collections prototype
			//inheritance is possible, all collection will first inherit from $.collection
			var constr = getConstructor();
			
			//copy the statics
			this.include( constr, this, $collection.statics );
			//create inheritance.
			constr.prototype = constr.fn = emptyInstance(this);
			constr._constructor = constr.fn._constructor = constr.fn.constructor = constr;//we could lose it
			
			return constr;
		},
		//imports the given methods (names) into target, from source (optional parse function)
		include:function( target, source, methods, parse ){
			if( !methods || !methods.slice ){
				[].unshift.call( arguments, this );//insert 'this' first
				return this.include.apply(this,arguments);//call again with fixed arguments
			}
			$.each( methods.split ? methods.split(/\s?,\s?/) : methods, function( i, func ){
				target[func] = parse ? parse(source[func], func, source) : source[func];
			});
			return target;
		},
		//same as include, but when calling an implemented function, it will map EACH matched element.
		implement:function( source, methods ){
			this.fn.include( source, methods, function( method ){
				return function(){
					var args = arguments;
					return this.map(function(){
						return method.apply(this,args);
					});
				};
			});
		}
	});
	
	$collection.extend( $collection.fn, {
		extend:$collection.extend,
		include:$collection.include,
		init:function( els ){//IMPORTANT: this is the main function to rewrite for each collection.
			//init should always call setArray with the array of parsed items, to keep jQuery's array structure.
			var items = typeof els == 'object' && 'length' in els ? els : arguments;
			return this.setArray( items );//this is just a generic init.
		},
		filter:function( filter ){//TODO: add more filtering options
			if( typeof filter != 'function' ){
				var out = filter.constructor == Array ? filter : [filter];
				filter = function(){ return $.inArray( this, out ) != -1; };
			}
			return this.pushStack($.grep( this, function( e, i ){
				return filter.call( e, i );
			}));
		},
		not:function( right ){
			right = this.filter(right);
			return this.filter(function(){
				return $.inArray( this, right ) == -1;
			});
		},
		is:function( s ){
			return !!(s && this.filter( s ).length);
		},
		add:function(){
			return this.pushStack( $.merge(this.get(), callConstructor(this,arguments) ) );
		},
		pushStack:function(items){
			var ret = emptyInstance(this).setArray( items.get ? items.get() : items  );
			ret.prevObject = this;
			return ret;
		},
		end:function(){
			return this.prevObject || callConstructor(this);
		},
		attr:function( key, value ){
			return value === undefined ? this[0] != null && this[0][key] : this.each(function(){
				this[key] = value;
			});
		}
	});
	//all these methods can be used in the collections, and are exactly (and literally) like in jQuery.
	$collection.fn.include( $.fn, 'each,extend,index,setArray,get,size,eq,slice,map,andSelf' );
		
})( jQuery );