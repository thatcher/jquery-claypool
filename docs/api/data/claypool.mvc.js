/**
*   Claypool MVC Api Documentation
*   
*   @author Chris Thatcher 
*   @email thatcher.christopher@gmail.com
*/
Claypool.MVC$Doc = {
    "@namespace"    :   "Claypool.MVC",
    "@description"  :   "Claypool's Movel-View-Controller framework provides low-level controllers "+
                        "that allow your own applications Controllers to remain dormant until they "+
                        "are actually required. The basic components are very generic and can be used "+
                        "to integrate which whatever Model and View technologies you prefer, or none at all."+
                        "As applications become large, seperation of the html and javascript is often the "+
                        "critical point of failure as your scripters becomse responsible for managing "+
                        "layout and css becuase the markup has become hidden deeply inside the code, and data "+
                        "access is duplicated and fragile becuase it is intimately mixed with business logic "+
                        "and html update and modification. Taking advantage of MVC seperation lets your team " +
                        "work more efficiently and allows optimal reuse of code and skill sets.  It is also "+
                        "critical to easy integration with emerging frameworks like Gears and Air.",
    example        :   [{
        "@title"        :   "The Basic Event Hijax Controller",
        "@description"  :   "The Event Controller allows you to register all important events "+
                            "at start-up but the application managed components that are interested "+
                            "in those events dont need to be created until they are actually used the "+
                            "first time.",
        source          :   ""+
            "Claypool.Configuration = {\n"+
            "   ioc: [\n"+
            "       { id: 'myController',       clazz:'MyApp.Controllers.MyController'}\n"+
            "       { id: 'anotherController',  clazz:'MyApp.Controllers.AnotherController'}\n"+
            "   ],\n"+
            "   mvc: {\n"+
            "       'hijax:event'[{\n"+
            "           id:'myCustomEventHijax', //required\n"+
            "           selector:'',            //optional jQuery selector\n"+
            "           filter:'',              //optional appended to selector\n"+
            "           active:true,            //optional use livequery\n"+
            "           preventDefault:true,    //optional disable browser default behavior\n"+
            "           stopPropagation:true,   //optional damn the bubble/trickle\n"+
            "           strategy:'all',         //optional route to 'all' or the 'first' match\n"+
            "           hijaxMap:               //required event delegated with mvc object\n"+
            "           [{  \n"+
            "               event:'SomeEvent',    \n"+
            "               controller:'myController',\n"+      
            "               action:'someMethod'\n"+
            "            },{  \n"+
            "               event:'AnotherEvent', \n"+
            "               controller:'anotherController'\n"+
            "               /*default action is 'handle'*/\n"+
            "           }]\n"+
            "       }]\n"+
            "   }\n"+
            "};\n"+
            "// Assumes the app has been initialized.\n"+
            "jQuery(document).trigger('SomeEvent')"
    },{
        "@title"        :   "The Basic Link Hijax Controller",
        "@description"  :   "The Link Controller automatically binds to regular html 'a' elements. "+
                            "What makes it special is that the wiring to your controllers is done "+
                            "via regular expression matching on the url.  For all it's simplicity don't "+
                            "underestimate the power of this controller.  The following two hijax:link "+
                            "maps are enough to drive most of GMail...",
        source          :   
            "Claypool.Configuration = {\n"+
            "   ioc: [\n"+
            "       { id: 'myController',       clazz:'MyApp.Controllers.MyController'}\n"+
            "       { id: 'anotherController',  clazz:'MyApp.Controllers.AnotherController'}\n"+
            "   ],\n"+
            "   mvc: {\n"+
            "       'hijax:link'[{\n"+
            "           id:'myLinkHashHijax',  //required\n"+
            "           filter:'[href^=#]',     //optional filter on links\n"+
            "           active:true,            //optional use livequery\n"+
            "           preventDefault:true,    //optional disable browser default behavior\n"+
            "           stopPropagation:true,   //optional damn the bubble/trickle\n"+
            "           strategy:'first',       //optional route to 'all' or the 'first' match\n"+
            "           hijaxMap:\n"+
            "           [{urls:'#foo.*$', controller:'myController',      action:'someMethod'},\n"+
            "            {urls:'#bar.*$', controller:'anotherController'/*default 'handle'*/}]\n"+
            "       },{\n"+
            "           id:'myLinkQueryHijax',//required\n"+
            "           filter:'[href^=?]',\n"+
            "           active:true,            //optional use livequery\n"+
            "           preventDefault:true,    //optional disable browser default behavior\n"+
            "           stopPropagation:true,   //optional damn the bubble/trickle\n"+
            "           strategy:'first',       //optional route to 'all' or the 'first' match\n"+
            "           hijaxMap:\n"+
            "           [{urls:'search',  controller:'myController', action:'searchMethod'}]\n"+
            "       }]\n"+
            "   }\n"+
            "};\n"
    },{
        "@title"        :   "The Basic Form Hijax Controller",
        "@description"  :   "The Form Controller automatically binds to regular html 'form' elements. "+
                            "What makes it special is that the wiring to your controllers is done "+
                            "via regular expression matching on the url.",
        source          :   
            "Claypool.Configuration = {\n"+
            "   ioc: [\n"+
            "       { id: 'myController',       clazz:'MyApp.Controllers.MyController'}\n"+
            "       { id: 'anotherController',  clazz:'MyApp.Controllers.AnotherController'}\n"+
            "   ],\n"+
            "   mvc: {\n"+
            "       'hijax:form'[{\n"+
            "           id:'myFormPostHijax',//required\n"+
            "           filter:'',//optional filter\n"+
            "           active:false,           //optional use livequery\n"+
            "           preventDefault:true,    //optional disable browser default behavior\n"+
            "           stopPropagation:true,   //optional damn the bubble/trickle\n"+
            "           strategy:'first',       //optional route to 'all' or the 'first' match\n"+
            "           hijaxMap:\n"+
            "           [{urls:'#foo.*$', controller:'myController',    action:'someMethod'},\n"+
            "            {urls:'#bar.*$', controller:'anotherController' /*default 'handle'*/}]\n"+
            "       }]\n"+
            "   }\n"+
            "};\n"
    }],
    clazz       :   [{
        "@name"         :   "Container$Class", 
        "@id"           :   "Claypool.MVC.Container$Class",
        "@description"  :   "Thre MVC Container, like the IoC, container allows all low level controllers to be "+
                            "directly accessible via the application context.  It would ,however, be unusual for you to need "+
                            "to access these objects directly.",
        "@extends"   :   "Claypool.Application.ContextContributor$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.Container$Class.constructor",
            "@description"  :   "Unlike the IoC Container the MVC Container uses its object factory to create "+
                                "all of it managed objects as soon as it's created.  Because event delegation is "+
                                "such a fundamental pattern in Claypool MVC, the low level controllers, though no "+
                                "different than any Application Managed Object, need to be created eagerly so that "+
                                "they can bind to all the required event (on specified elements or the document) "+
                                "immediatly allow the rest of the high level controllers to remain dormant until "+
                                "actually required.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new Container."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "get",
            "@id"           :   "Claypool.MVC.Container$Class.get",
            "@description"  :   "Searches the container to determine if the object has already been created otherwise "+
                                "creates it using the factory, storing it for fast access later. ",
            "@summary"      :   "Retreives an object from the container or creates if it hasn't been created yet.",
            param           :   [{
                "@name"         :    "id",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "A globally unique id."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "registerContext",
            "@id"           :   "Claypool.MVC.Container$Class.registerContext",
            "@description"  :   "Used internally to register the MVC container with the Application Context.  ",
            "@summary"      :   "See Claypool.Application.ContextContributor for details.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "ControllerFactory$Class", 
        "@id"           :   "Claypool.MVC.ControllerFactory$Class",
        "@description"  :   "Claypool MVC use the same highly flexible factory pattern to provide a configuration "+
                            "store and object creation process that Claypool IoC provides (by using the IoC Factory "+
                            "internally).  You will probably never use this class directly but it's important to "+
                            "understand that the low-level controllers which (delegate control) provied by Claypool "+
                            "are eagerly created as soon as the ControllerFactory is created.",
        "@extends"      :   "Claypool.IoC.InstanceFactory$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.ControllerFactory$Class.constructor",
            "@description"  :   "Creates a new instance of the ControllerFactory.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new ControllerFactory."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "updateConfigurationCache",
            "@id"           :   "Claypool.MVC.ControllerFactory$Class.updateConfigurationCache",
            "@description"  :   "The Factory stores a collection of configurations which allow the 'create' method "+
                                "to simply reference which mvc configuration it will use to create the new object. "+
                                "'updateConfigurationCache' causes the Factory to read in the available configurations "+
                                "by searching the global scope for Claypool.Configuration.mvc.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "initializeHijaxController",
            "@id"           :   "Claypool.MVC.ControllerFactory$Class.initializeHijaxController",
            "@description"  :   "Because the Controller Factory is just an extension of the IoC InstanceFactory the "+
                                "MVC Controller Factory uses this method internally to transform the spcialized built-in "+
                                "Controller configuration into a standard IoC configuration and instantiate eagerly since "+
                                "they act as the application event delegates.",
            param           :   [{
                "@name"         :    "mvcConfiguration",
                "@type"         :    "Object",
                "@required"     :    "true",
                "@description"  :    "A json object which describes the hijax controller."
            },{
                "@name"         :    "key",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "At this stage this is one of 'hijax:a', 'hijax:form', 'hijax:event' or 'hijax:server'."
            },{
                "@name"         :    "clazz",
                "@type"         :    "String",
                "@required"     :    "true",
                "@description"  :    "The Class name (as a String) of the implemnting Hijax Controller'."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "AbstractController$Class", 
        "@id"           :   "Claypool.MVC.AbstractController$Class",
        "@description"  :   "The Abstract Controller serves two purposes, primarily codifying the interface "+
                            "for controllers (though this interface is considered 'flexible' in Claypool) by providing "+
                            "the default 'handle' method.  Though this interface is used internally and Claypool defaults "+
                            "to calling 'handle' when the controller is invoked, Claypool allows an easy way to let "+
                            "you specify what method you want the controller to be invoked based on the event which is mapped "+
                            "to it.",
        "@extends"   :   "Claypool.SimpleCachingStrategy$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.AbstractController$Class.constructor",
            "@description"  :   "Creates a new AbstractController.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new AbstractController."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "handle",
            "@id"           :   "Claypool.MVC.AbstractController$Class.handle",
            "@description"  :   "This method is meant to codify the suggested pattern of providing a default handler "+
                                "method which relies opn the standard jQuery pattern of providing the event object and "+
                                "including the optional extra info object mvc which in turn codifies the event resolution "+
                                "flow.",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            param           :   [{
                "@name"         :    "event",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "The event object (by default as provided by jQuery)"
            },{
                "@name"         :    "mvc",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A reference to all flow participants, (model, view, and controller) as well as a closure "+
                                     "to provide easy access to flow resolution and forwarding."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "AbstractHijaxController$Class", 
        "@id"           :   "Claypool.MVC.AbstractHijaxController$Class",
        "@description"  :   "The Abstrac Hijax Controller adds the two additional methods that the built-in, low level "+
                            "Claypool Hijax Controllers each implement to make sure they hijax to the required events "+
                            "and DOM aand also have knowledge of all the delegated routes.",
        "@extends"      :   "Claypool.MVC.AbstractController$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.AbstractHijaxController$Class.constructor",
            "@description"  :   "Creates a new instance of the Abstract Hijax Controller.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new AbstractHijaxController."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "handle",
            "@id"           :   "Claypool.MVC.AbstractHijaxController$Class.handle",
            "@description"  :   "The handle method is implemented here to provide a generic routing implementation to the "+
                                "delegated controllers.  More importantly, Claypool adds the extra event information 'mvc' which "+
                                "helps organize the mvc flow by identifying first the delegated controller as the mvc.c value " +
                                "as well as a continuation closure mvc.resolve that allows the high level controller to fill out "+
                                "the model (mvc.m - json object) and set the view (mvc.v - a container managed id) which, when called "+
                                "will use Claypool internal routing ability to direct flow.",
            "@summary"      :   "See Claypool.MVC.AbstractController for details.",                    
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "makeResolver",
            "@id"           :   "Claypool.MVC.AbstractHijaxController$Class.handle",
            "@description"  :   "A Powerful closure which allows high level controllers to use the mvc.resolve method to "+
                                "end control flow or forward control flow.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "attach",
            "@id"           :   "Claypool.MVC.AbstractHijaxController$Class.attach",
            "@description"  :   "Attach is used internally to provide a simple method for built in controllers to be "+
                                "able to compile the specific routers used to delegate control.",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "hijax",
            "@id"           :   "Claypool.MVC.AbstractHijaxController$Class.hijax",
            "@description"  :   "Hijax must be implemented by each low level controller to delegate control.",
            "@summary"      :   "Cannot use interface unless the implementation is provided.",
            param           :   [{
                "@name"         :    "target",
                "@type"         :    "Object",
                "@required"     :    "true",
                "@description"  :    "The high level controller, (available through application context)"
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "HijaxLinkController$Class", 
        "@id"           :   "Claypool.MVC.HijaxLinkController$Class",
        "@description"  :   "Because Links have a powerful place in both traditional and modern browser based applications "+
                            "they get a special low level controller.  The HijaxLink controller is very simple and allows you"+
                            "to route control to your high level controllers by regular expression matching on the url.",
        "@extends"     :   "Claypool.MVC.AbstractHijaxController$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.HijaxLinkController$Class.constructor",
            "@description"  :   "Creates a new HijaxLinkController",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new HijaxLinkController."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "attach",
            "@id"           :   "Claypool.MVC.HijaxLinkController$Class.attach",
            "@description"  :   "Used intenally to compile the routes for fast matching and attach via jQuery or livequery",
            "@summary"      :   "See Claypool.MVC.AbstractHijaxController for method details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "hijax",
            "@id"           :   "Claypool.MVC.HijaxLinkController$Class.hijax",
            "@description"  :   "Attaches the link click optionally prevent the default behavior and stopping "+
                                "propogation of the event.",
            "@summary"      :   "See Claypool.MVC.AbstractHijaxController for method details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "HijaxFormController$Class", 
        "@id"           :   "Claypool.MVC.HijaxFormController$Class",
        "@description"  :   "Because Forms have a powerful place in both traditional and modern browser based applications "+
                            "they get a special low level controller.  The HijaxForm controller is very simple and allows you"+
                            "to route control to your high level controllers by regular expression matching on the url(in the "+
                            "action attribute).",
        "@extends"      :   "Claypool.MVC.AbstractHijaxController$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.HijaxFormController$Class.constructor",
            "@description"  :   "Creates a new HijaxFormController.",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new HijaxFormController."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "attach",
            "@id"           :   "Claypool.MVC.HijaxFormController$Class.attach",
            "@description"  :   "Used internally to compile the routes for fast matching and attach via jQuery or livequery",
            "@summary"      :   "See Claypool.MVC.AbstractHijaxController for method details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "hijax",
            "@id"           :   "Claypool.MVC.HijaxFormController$Class.hijax",
            "@description"  :   "Attaches to the form submission optionally prevent the default behavior and stopping "+
                                "propogation of the event.",
            "@summary"      :   "See Claypool.MVC.AbstractHijaxController for method details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    },{
        "@name"         :   "HijaxEventController$Class", 
        "@id"           :   "Claypool.MVC.HijaxEventController$Class",
        "@description"  :   "The HijaxEventController is immediatly useful for isolating event configuration with "+
                            "any custom events or traditional dom events. Isolating event binding the the HijaxEventController "+
                            "is a powerful way to keep code clean, clear and highly reusable.",
        "@extends"      :   "Claypool.MVC.AbstractHijaxController$Interface",
        method : [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.HijaxEventController$Class.constructor",
            "@description"  :   "Creates a new HijaxEventController",
            param           :   [{
                "@name"         :    "options",
                "@type"         :    "Object",
                "@required"     :    "false",
                "@description"  :    "A json object which is deeply extended by the resulting new HijaxEventController."
            }],
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "attach",
            "@id"           :   "Claypool.MVC.HijaxEventController$Class.attach",
            "@description"  :   "Used intenally bind via jQuery",
            "@summary"      :   "See Claypool.MVC.AbstractHijaxController for method details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        },{
            "@name"         :   "hijax",
            "@id"           :   "Claypool.MVC.HijaxEventController$Class.hijax",
            "@description"  :   "Attaches to the form submission optionally prevent the default behavior and stopping "+
                                "propogation of the event.",
            "@summary"      :   "See Claypool.MVC.AbstractHijaxController for method details",
            "@author"       :   "Chris Thatcher",
            "@email"        :   "thatcher.christopher@gmail.com"
        }]
    }],
    exception   :   [{
        "@name"         :   "ContainerError$Class",
        "@id"           :   "Claypool.MVC.ContainerError$Class",
        "@extends"      :   "Claypool.Error$Class",
        "@description"  :   "Because the MVC Container is 'eager' the basic low-level controllers are instantiated "+
                            "at initialization time. ContainerError can occur any unexpected error occurs trying to create. "+
                            "the applications core controllers.",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.ConfigurationError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.MVC.ContainerError",
            "@id"       :   "Claypool.MVC.ContainerError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.MVC.ContainerError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.MVC.ContainerError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    },{
        "@name"         :   "ConfigurationError$Class",
        "@id"           :   "Claypool.MVC.ConfigurationError$Class",
        "@extends"      :   "Claypool.ConfigurationError$Class",
        "@description"  :   "ConfigurationError can occur when trying to load a mvc configuration.",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.ConfigurationError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.MVC.ConfigurationError",
            "@id"       :   "Claypool.MVC.ConfigurationError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.MVC.ConfigurationError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.MVC.ConfigurationError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.ConfigurationError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    },{
        "@name"         :   "NoSuchControllerError$Class",
        "@id"           :   "Claypool.MVC.NoSuchControllerError$Class",
        "@extends"      :   "Claypool.Error$Class",
        "@description"  :   "NoSuchControllerError can occur when trying to access a low level controller directly "+
                            "through the application context.  Usually you should not be doing this unless you are an "+
                            "advanced user and/or creating a plugin for Claypool MVC. ",
        "@summary"      :   "Claypool tries to help regulate erros by providing a simple way "+
                            "to extend and identify errors regardless of their position in "+
                            "the hierarchy (like python or java etc).",
        "@author"       :   "Chris Thatcher",
        "@email"        :   "thatcher.christopher@gmail.com",
        method      :   [{
            "@name"         :   "constructor",
            "@id"           :   "Claypool.MVC.NoSuchControllerError$Class.constructor"
        }],
        example     :   [{
            "@title"    :   "Throwing, catching, and identifying a Claypool.MVC.NoSuchControllerError",
            "@id"       :   "Claypool.MVC.ConfigurationError$Example",
            source      :   ""+
                "try{\n"+
                "    throw new Claypool.MVC.NoSuchControllerError();\n"+
                "}catch(e){\n"+
                "   if(e.name.match(\"Claypool.MVC.NoSuchControllerError\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "   if(e.name.match(\"Claypool.Error\")){\n"+
                "       //This will be true\n"+
                "   }\n"+
                "}\n"
        }]
    }]
};
