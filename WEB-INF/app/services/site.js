/**
 * @author thatcher
 */
(function($,  $S){
    
    var log,
        Docs,
        Events,
        Examples,
        News,
        Releases;
    
    $S.Site = function(options){
        log = $.logger('ClaypoolJS.Services.Site');
        $.extend(true, this, options);
        Docs        = $.$('#docsModel');
        Events      = $.$('#eventsModel');
        Examples    = $.$('#examplesModel');
        News        = $.$('#newsModel');
        Releases    = $.$('#releasesModel');
    };
    
    $.extend($S.Site.prototype,{
        
        docs: function(event){
            event.
                m({
                    docs:Docs.get(),
                    template: 'site/html/pages/docs.js'
                }).
                render();
        },
        
        doc: function(event){
            var id = event.params('id'),
                doc;
                
            log.debug("Getting %s", id);
            //find the docs based on the id passed
            
            event.
                m({
                    id:id,
                    docs:Docs.get(),
                    doc:Docs.get(id),
                    releases:Releases.get(),
                    template: id.match('guide')?
                        'site/html/pages/guide.js':
                        'site/html/pages/api.js'
                }).
                render();
        },
        
        //not to be confused with the event parameter, this is just a calander
        //event
        events: function(event){
            event.
                m({
                    events: Events.get(),
                    template: 'site/html/pages/events.js' 
                }).
                render();  
        },
        
        examples: function(event){
            event.
                m({
                    examples: Examples.get(),
                    template: 'site/html/pages/examples.js' 
                }).
                render();  
        },
        
        
        example: function(event){
            var id = event.params('id');
            event.
                m({
                    example:  Examples.get(id),
                    template: 'site/html/pages/examples/'+id+'.js'
                }).
                render();  
        },
        
        home: function(event){
            event.
                m({
                    recent:   Releases.recent(),
                    news:     News.recent(),
                    events:   Events.recent(),
                    template: 'site/html/pages/home.js' 
                }).
                render();
        },
        
        news: function(event){
            event.
                m({
                    news:News.get(),
                    template: 'site/html/pages/news.js' 
                }).
                render();  
        },
        
        releases: function(event){
            event.
                m({
                    releases:Releases.get(),
                    template: 'site/html/pages/releases.js' 
                }).
                render();
        },
        
        release: function(event){
            var id = event.params('id'),
                release = Releases.get(id);
            event.
                m({
                    id:id,
                    doc:Docs.forRelease(release),
                    release:release,
                    template: 'site/html/pages/release.js' 
                }).
                render();
        },
        
        support: function(event){
            log.debug('loading support');
            event.m({
                template: 'site/html/pages/support.js' 
            }).render();  
        }
    });
    
})(jQuery, ClaypoolJS.Services );