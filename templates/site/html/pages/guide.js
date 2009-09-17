<e4x>
    {extend("site/html/base.js")}
    <block id='main'>
        <div id='doc'>
            <h3>
                <a href={$.env('root')+'docs'}>
                    &lt; documentation
                </a>
            </h3>
			<div class='column span-4 colborder'>
			{_('.*', doc.sections).map(function(){
                return {div:{$:[
				    {h4:this.name},
				    {ul:{$:
					    _('.*',this.subsections).map(function(){
                            return {li:{
                                a:{
                                    $:this.name,
									$href:'#'+this.name.replace(' ','_') 
							     }
						    }};
                        })
					}}
				]}};
            }).e4x()}
			</div>
            <div class='first column span-13'>
            <hr/>
            {_('.*', doc.sections).map(function(){
                return {div:{$:[
                    {h2:{
                        img:{
						  $src:$.env('root')+('images/star_inverting.jpg'),
						  $height:'30px'
						},
						$:this.name
					}},
					_.e4x(this.description),
                    {ul:{$:
						_('.*',this.subsections).map(function(){
		            return {li:{$:[
	                            {hr:{$id:this.name.replace(' ','_')}},
	                            {h3:{$:this.name }},
	                            _.e4x(this.description)
	                        ]}};
		                })
                    }}
                ]}};
            }).e4x()}
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
                {_.e4x(doc.description)}
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
