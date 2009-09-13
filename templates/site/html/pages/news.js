<e4x>
	{extend("site/html/base.js")}
    <block id='main'>
        <div id='news' >
            <h3>news archives</h3>
            {_('.*', news).map(function(index){
                return {
                    div:{
                        $class:'span-20 prepend-1',
                        $:[
                            //{strong:this.date},
							{div:{
								$class:'span-12 column noborder',
								$:[_.e4x(this.description)]
							}},
                            {div:{
								$class:'span-6 column noborder',
								$:[{h4:this.title}]
							}}
                        ]
                    }
                };
            }).e4x()}
        </div>
    </block> 
</e4x> 
