Claypool.MVC = {
/*
 * Claypool.MVC @VERSION@ - A Web 1.6180339... Javascript Application Framework
 *
 * Copyright (c) 2008 Chris Thatcher (claypooljs.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-08-06 14:34:08 -0400 (Wed, 06 Aug 2008) $
 * $Rev: 265 $
 * 
 *
 */
};

(function($){
    
    $.manage("Claypool.MVC.Container", "claypool:MVC", function(container){
        var i,
            id,
            router,
            config = container.factory.getConfig(),
            type;
        for(type in config){
            container.logger.debug("eagerly loading mvc routers: %s", type);
            for(i=0;i<config[type].length;i++){
                //eagerly load the controller
                id = config[type][i].id;
                controller = container.get(id);
                //activates the controller
                container.logger.debug("attaching mvc core controller: %s", id);
                if(controller && !controller.attached){
                    controller.attach();
                    controller.attached = true;
                }
            }
        }
    });
    
})(  jQuery);
