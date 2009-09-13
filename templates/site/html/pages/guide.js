<e4x>
    {extend("site/html/base.js")}
    <block id='main'>
        <div id='doc'>
            <h3>
                <a href={$.env('root')+'docs'}>
                    &lt; documentation
                </a>
            </h3>
            <div class=' column span-4 colborder'>
                <h4>running</h4>
                <ul>
                {_('.*',doc.running).map(function(index, value){
                    return {
                        li: {a:{$href:'#'+this.name, $:this.name}}
                    };
                }).e4x()}
                </ul> 
                <h4>walking</h4>
                <ul>
                {_('.*',doc.walking).map(function(index, value){
                    return {
                        li: {a:{$href:'#'+this.name, $:this.name}}
                    };
                }).e4x()}
                </ul> 
                <h4>crawling</h4>
                <ul>
                {_('.*',doc.crawling).map(function(index, value){
                    return {
                        li: {a:{$href:'#'+this.name, $:this.name}}
                    };
                }).e4x()}
                </ul> 
            </div>
            <div class='first column span-13'>
                <h2>
	                <img src={$.env('root')+('images/star_inverting.jpg')}
	                     height='30px'/>
				    running
			     </h2>
                <p>
				    env.rhino.js can be run either with a "generic" version of the Rhino
				    library (js.jar), or with the repackaged/extended version of Rhino
				    supplied with env.js (env-js.jar).  If your application uses multiple
				    windows, frames, or iframes, or if it depends on precise adherence to
				    JavaScript object scoping in event handlers, you will have to use
				    env-js.jar.  Simple applications may be able to run with the generic
				    version of Rhino.
                </p>
				<p>
					The command line used for testing env.js can be found in build.xml,
					although the general form is:<br/><br/>
					<code>
					 java -jar [jar file] [javascript file]
					</code><br/><br/>
					Where "jar file" is either "dist/env-js.jar", "rhino/js.jar", or your
					local path to a different version of the Rhino js.jar file.  The
					"javascript file" is the path to the JavaScript you wish to execute.
				</p>
                <ul>
                {_('.*',doc.running).map(function(index, value){
                    return {
                        li:{$:[
                            {hr:{$id:this.name}},
                            {h3:{$:this.name }},
                            _.e4x(this.description),
                        ]}
                    };
                }).e4x()}
                </ul>
				
				
                <h2>
                    <img src={$.env('root')+('images/star_inverting.jpg')}
                         height='30px'/>
					walking
				</h2>
                <p>
                    Now that you are up and running, it's time to slow down and 
					check outwhat Envjs has to offer.  The goal of Envjs is 
					simply to emulate the browser client-side javascript 
					environment.  All you have to do is load env.rhino.js,
					configure, and go.
                </p>
                <ul>
                {_('.*',doc.walking).map(function(index, value){
                    return {
                        li:{$:[
                            {hr:{$id:this.name}},
                            {h3:{$:this.name }},
                            _.e4x(this.description),
                        ]}
                    };
                }).e4x()}
                </ul>
			    <p>
			       See the <a href={$.env('root')+'api-'+doc.version}>API</a>
				   reference for a complete list of options and their meaning.
			    </p>
				
				
				
                <h2>
                    <img src={$.env('root')+('images/star_inverting.jpg')}
                         height='30px'/>
				    crawling
				</h2>
                <p>
                    With Envjs, we refer to crawling loosely as the act of
					injecting script into an HTML application.  This means you
					could be adding jQuery to the browser environment and grepping
					for all links, potentially storing them and following them, or
					more simply allowing script to run while monitoring the DOM
					for state changes or logging test results to the console.
                </p>
				<p>
				    Crawling can be acheived by combining a little shell scripting
					with Envjs script loading hooks or with pure javascript.
				</p>
                <ul>
                {_('.*',doc.crawling).map(function(index, value){
                    return {
                        li:{$:[
                            {hr:{$id:this.name}},
                            {h3:{$:this.name }},
                            _.e4x(this.description),
                        ]}
                    };
                }).e4x()}
                </ul> 
            </div>
            <div class='last column span-4'>
                <h4>
                    <strong>{doc.label + ' ' + doc.version}</strong>
                </h4>
                <img src={$.env('root')+'images/star_inverting.jpg'} 
                     alt={doc.label} />
                <strong>releases</strong>
                <ul>
                    {_('.*', releases).map(function(){
                        return {li:{$:[
                            {a:{
                                $href:$.env('root')+'doc/'+doc.id+'-'+this.id,
                                $:this.name
                            }},
                            '|',
                            {a:{
                                $href:$.env('root')+'release/'+this.id,
                                $: this.id
                            }}
                        ]}};
                    }).e4x()}
                </ul>
            </div>
        </div>
    </block> 
    <block id='script_extra'>
        <script type='text/javascript' src={$.env('root')+"scripts/doc.js"}>
            <!--
            /**
             *  allows the style link to serve as the hidden form submit
             */
            -->
        </script>
    </block>
</e4x> 
