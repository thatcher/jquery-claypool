<e4x>
	{extend("site/html/base.js")}
    <block id='main'>
        <div id='docs'>
            <h3>documentation</h3>
            <div class='client span-24'>
                <h3 style='text-align:center;'>
                    Client <a href={$.env('root')+'examples'}>Examples</a>
                </h3>
	            <div class='first column span-11 colborder '>
	                <ul>
	                    {_('.*', docs).map(function(index){
	                        return  (index%2===0)?{li:{
	                            a:{
	                                $href:$.env('root')+'doc/'+this.id+'-'+this.version,
	                                $:[
	                                    {strong:this.label},
	                                    {em:this.version},
	                                    {img:{
	                                        $src:$.env('root')+'images/star_inverting.jpg',
	                                        $alt:this.label
	                                    }}
	                                ]
	                            }
	                        }} : {};
	                    }).e4x()}
	                </ul>
	            </div>
			    <div class='last column  span-10'>
	                <ul>
	                    {_('.*', docs).map(function(index){
	                        return (index%2===1)?{li:{
	                            a:{
	                                $href:$.env('root')+'doc/'+this.id+'-'+this.version,
	                                $:[
	                                    {img:{
	                                        $src:$.env('root')+'images/star_inverting.jpg',
	                                        $alt:this.label
	                                    }},
	                                    {strong:this.label},
	                                    {em:this.version}
	                                ]
	                            }
	                        }} : {};
	                    }).e4x()}
	                </ul>
	            </div>
				<div class='clear' 
				     style='padding-top:20px;'>
	                <h3 style='text-align:center;'>
	                    Server <a href={$.env('root')+'examples'}>Examples</a>
	                </h3>
				</div>
			</div>
        </div>
    </block> 
</e4x> 
