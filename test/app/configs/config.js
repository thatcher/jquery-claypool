Spec = {
    /**
     * jquery.claypool unit tests
     *
     * Copyright (c) 2008-2009 ClayoolJS
     *
     */
     //  -   NAMESPACE DECLARATIONS   -
     //  It's good form to go ahead and declare the additional namespaces you might be using
     //  here.  We define just a couple standards.  Additional nested namespaces are very 
     //  useful for isolating application log message based on the categories defined by
     //  the namespace.
	Models:{},
	Views:{},
	Controllers:{},
	Services:{}
};
(function($){
	
   $.config("ioc", [
            //-------------------------------------------------------------------------------------//
            //  -   MODELS  (aka Domain Objects)    -
            //  - Models *should* be JSON serializable.  This includes xml, but more importantly
            //  - should disclude any functions that arent directly pertanent . Simple types, {}, 
            //  - and [], are a good rule of thumb.  
            //  -
            //  - Some Models are *smart*, that is they have the DataAccessObject built-in so
            //  - you can save them or retrieve them using built-in methods.
            //  - DataAccessObjects implement a specific approach to access models.  This might 
            //  - be cached objects, restful server resources in xml/json, relational resources
            //  - that are persisted via JStORM, or an XML db like eXist.
            //  -
            //  - Claypool doesnt require any particlar Model technology.  You can feel free to use
            //  - your preferred technology.
            {scan:"Spec.Models", factory:$.mvc_scanner}, 
            //______________________________________________________________________________________//
            
            //-------------------------------------------------------------------------------------//
            //  -   VIEWS  (aka DOM Objects) -
            //  - Each View or DomAccessObject is a class that is ussually attached to a DOM
            //  - element(s) identified by a jQuery selector ( a css3 selctor). Views are flexible
            //  - in terms of the implementation, it only needs to implement the 'update' method
            //  - (or the controller may specify another view action ) which modifies the dom 
            //  - depending on the 'model' object passed to it.  It's the controllers responsibility
            //  - to filter the model to prevent the view from having access to any data or methods
            //  - it shouldn't have.
            //
            //  - By default the view is attached to dom by the following convention.  If the name 
            //  - is Example.Views.FooBar, the view is attached to $("#fooBar").  You may wish to 
            //  - attach to more than a single element.  See the documentation for complete references
            //  - on how to do this as well as more configuration options.
            //  - 
            //  - Claypool doesnt require any particlar View technology.  You can feel free to use
            //  - your preferred technology.
            {scan:"Spec.Views", factory:$.mvc_scanner},
            //______________________________________________________________________________________//
            
            //-------------------------------------------------------------------------------------//
            //  -   CONTROLLERS -
            //  - Controllers contain the business logic of the application.  Event, links, and forms
            //  - are routed to the controllers in the mvc configuration section. (see routes.js).
            //  - Simple controller ussually implements the 'handle' method
            //  - but 'multi-action' controllers can implement any methods they choose and only need
            //  - to supply the specified endpoint in the configuration
            //  -
            {scan:"Spec.Controllers", factory:$.mvc_scanner}
            //_____________________________________________________________________________________//
            
            //-------------------------------------------------------------------------------------//
            //  -   SERVICES  (aka SERVER Objects) -
            //  - Services usually run on the server but, in the case of integration with Gears,
            //  - may run on the client as well.  Services are simply specialized Controllers that
            //  - treat a special kind of event, an HTTP request. 
            //{scan:"Example.Services", factory:$.mvc_scanner}

    ]);
})(jQuery);

