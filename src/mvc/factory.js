

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
            try{
                this.logger.debug("Configuring Claypool MVC Controller Factory");
                mvcConfig = this.getConfig()||{};//returns mvc specific configs
                //Extension point for custom low-level hijax controllers
                $(document).trigger("claypool:hijax", [this, this.initializeHijaxController, mvcConfig]);
                
            }catch(e){
                this.logger.exception(e);
                throw new $$MVC.ConfigurationError(e);
            }
        },
        /**
         * Describe what this method does
         * @private
         * @param {String} paramName Describe this parameter
         * @returns Describe what it returns
         * @type String
         */
        scan: function(name){
            var log = this.logger||$.logger("Claypool.MVC.Factory");
            log.debug("Scanning %s" , name);
            var prop, 
                scanBase, 
                configsByConvention = [],
                idNamingConvention = function(localName, type){
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1)+type);
                },
                domNamingConvention = function(localName){
                    return ("#"+localName.substring(0,1).toLowerCase()+localName.substring(1));
                };
            try{
                scanBase = $.resolve(name);
                for(prop in scanBase){
                    log.debug("Scan Checking %s.%s" , name, prop);
                    if($.isFunction(scanBase[prop])){
                        log.debug("Found Function Definition on %s.%s" , name, prop);
                        if(name.match(".Models")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Model"),
                               clazz: name+"."+prop
                            });
                        }else if(name.match(".Views")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "View"),
                               clazz: name+"."+prop,
                               selector: domNamingConvention(prop)
                            });
                        }else if(name.match(".Controllers")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Controller"),
                               clazz: name+"."+prop
                            });
                        }else if(name.match(".Services")){
                            log.debug("Configuring by Convention %s.%s" , name, prop);
                            configsByConvention.push({
                               id: idNamingConvention(prop, "Service"),
                               clazz: name+"."+prop
                            });
                        }
                    }  
                }
            }catch(e){
                log.error("Error Scanning %s!!", name).exception(e);   
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
                    this.add( configuration.id, configuration );
                }
            }
        }
    });
    
})(  jQuery, Claypool, Claypool.MVC );
