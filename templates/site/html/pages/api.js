<e4x>
    {extend("site/html/base.js")}
    <block id='main'>
        <div id='doc'>
            <h3 id='alldocs'>
                <a href={$.env('root')+'docs'}>
                    &lt; documentation
                </a>
            </h3>
            <div class=' column span-4 colborder'>
			    <h4>options</h4>
                <ul>
                {_('.*',doc.options).map(function(index, value){
                    return {
                        li: {a:{$href:'#'+this.name, $:this.name}}
                    };
                }).e4x()}
                </ul> 
                <h4>hooks</h4>
                <ul>
                {_('.*',doc.hooks).map(function(index, value){
                    return {
                        li: {a:{$href:'#'+this.name, $:this.name}}
                    };
                }).e4x()}
                </ul> 
                <h4>platform</h4>
                <ul>
                {_('.*',doc.platform).map(function(index, value){
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
				    options
				</h2>
				<p>
				    Envjs provides a number of basic configurable options
					which allow users to modify the default behavior
					the code base.
				</p>
				<p>
				    Options, Hooks, and Platform functions are all set, or
					overridden via the same mechanism, using Envjs as a
					function whose argument as an object is used to
					effectively replace the default value.
				</p>
                <ul>
                {_('.*',doc.options).map(function(index, value){
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
                    hooks
				</h2>
				<p>
				    Hooks allow users of Envjs to extend the usual behavior
					at well known points, or to subscribe to internal
					events that a browser would not normally expose.  
				</p>
				<p>
				    These are very useful, for example, to allow Envjs users 
					to run existing HTML files unmodified, while still being 
					able to provide additional information to the console,
					or to store state regarding the HTML applications
					processes. 
				</p>
				<ul>
                {_('.*',doc.hooks).map(function(index, value){
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
                    platform
				</h2>
				<p>
				    Platform functions are required to be implemented by
					authors who wish to run Envjs on additional javascript
					engines.  Currenlty only rhino is supported though
					we hope to support additional engines in the future.
				</p>
				<p>
				    These functions are also available to the Envjs users
					as utilities, for example, to write out the resulting
					dom, after manipulation by javascript, to a local file. 
					Also the default implementations may be easily overridden
					to suit the users particular needs.
				</p>
                <ul>
                {_('.*',doc.platform).map(function(index, value){
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
