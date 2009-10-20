<e4x>
    {extend("site/html/base.js")}
    <block id='main'>
        <div id='doc'>
            <h3>
                <a href={$.env('root')+'docs'}>
                    &lt; documentation
                </a>
            </h3>
			<div class='column span-5'>
                <h4>
                    <img src={$.env('root')+'images/star_inverting.jpg'}/>
                    Guides
                </h4>
                <ul>
                    {_('.*', docs[0].guides).map(function(index, value){
                        return {li:
                        (id.match(value))?
                            ({strong:value}):
                            ({a:{
                                $href:$.env('root')+'doc/guides/'+docs[0].version+'/'+value,
                                $:[{strong:value}]
                            }})
                        };
                    }).e4x()}
                </ul>
                
    			{_('.*', doc.sections).map(function(){
                    return {div:{$:[
    				    {h4:{
                            a:{
                                $:this.name,
                                $href:'#'+this.name.replace(' ','_') 
                            }
                        }},
    				    {ul:{
                            $class:'subsections',
                            $:
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
                
                <h4>
                    <img src={$.env('root')+'images/star_inverting.jpg'}/>
                    Project
                </h4>
                <ul>
                    {_('.*', docs[0].apis['project/conventions']).map(function(index, value){
                        return {li:{
                            a:{
                                $href:$.env('root')+'doc/apis/'+docs[0].version+
                                    '/project/conventions/'+value,
                                $:[{strong:value}]
                            }
                        }};
                    }).e4x()}
                </ul>
            </div>
            <div class='first column span-13'>
                <h2 class='api_label'>
                    {doc.label + ' ' + doc.version}
                </h2>
                <hr/>
                {_('.*', doc.sections).map(function(){
                    return {div:{
                        $id:this.name.replace(' ','_'),
                        $:[
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
                <img src={$.env('root')+'images/star_inverting.jpg'} 
                     alt={doc.label} />
                <strong>releases</strong>
                <ul>
                    {_('.*', releases).map(function(){
                        return {li:{$:[
                            {a:{
                                $href:$.env('root')+'doc/guides/'+this.id+'/'+doc.id,
                                $:this.name
                            }},
                            '|',
                            {a:{
                                $href:$.env('root')+'doc/guides/'+this.id+'/'+doc.id,
                                $: this.id
                            }}
                        ]}};
                    }).e4x()}
                </ul>
                
                <h4>
                    <img src={$.env('root')+'images/star_inverting.jpg'}/>
                    Plugins
                </h4>
                <ul>
                    {_('.*', docs[0].apis['plugins/user']).map(function(index, value){
                        return {li:{
                            a:{
                                $href:$.env('root')+'doc/apis/'+docs[0].version+
                                    '/plugins/user/'+value,
                                $:[{strong:value}]
                            }
                        }};
                    }).e4x()}
                </ul>
                
                
                <h4>
                    <img src={$.env('root')+'images/star_inverting.jpg'}/>
                    Extension Points
                </h4>
                <ul>
                    {_('.*', docs[0].apis['plugins/developer']).map(function(index, value){
                        return {li:{
                            a:{
                                $href:$.env('root')+'doc/apis/'+docs[0].version+
                                    '/plugins/developer/'+value,
                                $:[{strong:value}]
                            }
                        }};
                    }).e4x()}
                </ul>
                <p>
                    <strong>
                        This guide is applicable to both the jquery-claypool 
                        client and server application frameworks.
                    </strong>  
                    Where the two differ functionally the documentation will 
                    provide notes and examples of usage in each environment.
                </p>
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
