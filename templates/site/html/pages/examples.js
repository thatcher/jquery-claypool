<e4x>
	{extend("site/html/base.js")}
    <block id='main'>
        <div id='examples' >
            <h3>examples</h3>
            {$(examples).map(function(){
                return {
                    div:{
                        $class:'span-20 prepend-1',
                        $:[
							{div:{
								$class:'span-12 column noborder',
								$:[$.e4x(this.description)]
							}},
                            {div:{
								$class:'span-6 column noborder',
								$:[{h4:
								    {a:{
                                        $href: $.env('root')+'example/'+this.id, 
										$:this.title
									}}
								}]
							}}
                        ]
                    }
                };
            }).e4x()}
        </div>
    </block> 
</e4x> 
