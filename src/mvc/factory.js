

/**
 * Descibe this class
 * @author 
 * @version $Rev$
 * @requires OtherClassName
 */
(function($, $$, $$MVC){
    /**
     * @constructor
     */
    $$MVC.Factory = function(options){
        $$.extend(this, $$.IoC.Factory);
        $.extend(true, this, options);
        this.configurationId = 'mvc';
        this.logger = $.logger("Claypool.MVC.Factory");
		//support for namespaces - routers are always in default
		//empty namespace
		this.add('', new $$.SimpleCachingStrategy());
    };
    
    $.extend($$MVC.Factory.prototype,
        $$.IoC.Factory.prototype,{
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        updateConfig: function(){
            var mvcConfig,
                controller,
                type,
                id,
                i;
                
            this.logger.debug("Configuring Claypool MVC Controller Factory");
            mvcConfig = this.getConfig()||{};//returns mvc specific configs
            //Extension point for custom low-level hijax controllers
            $(document).trigger("claypool:hijax", [this, this.initializeHijaxController, mvcConfig]);
                
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        scan: function(name, namespace){
            var log = this.logger||$.logger("Claypool.MVC.Factory");
            var prop, 
                scanBase, 
                configsByConvention = [],
				conf,
                idNamingConvention = function(localName, type){
					//type : eg Views will be shortened to => View
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1)+type.substring(0, type.length-1));
                },
                domNamingConvention = function(localName){
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1));
                };

			namespace = namespace||'';
            log.debug("Scanning %s%s", namespace, name);
            
			if(name.split('.').length == 1){
				//MyApp
				scanBase = $.resolve(name);
				for(prop in scanBase){
					log.debug("Scan Checking %s.%s" , name, prop);
					if($.isPlainObject(scanBase[prop])){
						log.debug("Scan Following %s.%s" , name, prop);
						//we now get $.scan(['MyApp.Models', 'MyApp.Configs', etc])
						configsByConvention.push(this.scan(name+'.'+prop, namespace));
					}
				}
				
			}else if(name.split('.').length == 2){
				//MyApp.Controllers
				scanBase = $.resolve(name);
				for(prop in scanBase){
					log.debug("Scan Checking %s.%s" , name, prop);
					if($.isFunction(scanBase[prop])){
						log.debug("Configuring by Convention %s.%s" , name, prop);
						config = {
							id: idNamingConvention(prop, name.split('.')[1]),
							clazz: name+"."+prop,
							namespace: namespace
						};
						if(name.match(".Views")){
							//by convention views bind to element with id
							config.selector = domNamingConvention(prop);
						}
						configsByConvention.push(config);
					} 
				}
			}else if(name.split('.').length == 3){
				//MyApp.Controllers.Admin
				scanBase = $.resolve(name);
				if($.isFunction(scanBase)){
					log.debug('Appending to Configuration by Convention %s', name);
					config = {
						id: idNamingConvention(prop, name.split('.')[2]),
						clazz: name,
						namespace: namespace
					};
					if(name.match(".Views")){
						//by convention views bind to element with id
						config.selector = domNamingConvention(prop);
					}
					configsByConvention.push(config);
				}
			}
            return configsByConvention;
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        initializeHijaxController: function(mvcConfig, key, clazz, options){
            var configuration,
                i;
            if(mvcConfig[key]){
                for(i=0;i<mvcConfig[key].length;i++){
                    configuration = {};
                    configuration.id = mvcConfig[key][i].id;
                    configuration.clazz = clazz;
                    configuration.options = [ $.extend(true, {}, options, mvcConfig[key][i]) ];
                    this.logger.debug("Adding MVC Configuration for Controller Id: %s", configuration.id);
                    this.find('').add( configuration.id, configuration );
                }
            }
        }
    });
    
})(  jQuery, Claypool, Claypool.MVC );
