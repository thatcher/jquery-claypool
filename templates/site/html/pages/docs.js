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
                    <h2 style='text-align:right;'>
                        <img src={$.env('root')+'images/star_inverting.jpg'}/>
                        Guides
                    </h2>
	                <ul>
	                    {_('.*', docs[0].guides).map(function(index, value){
	                        return {li:{
	                            a:{
	                                $href:$.env('root')+'doc/guides/'+docs[0].version+'/'+value,
	                                $:[{strong:value}]
	                            }
	                        }};
	                    }).e4x()}
	                </ul>
	            </div>
			    <div class='last column  span-10'>
                    <h2 style='text-align:left;'>
                        API
                        <img src={$.env('root')+'images/star_inverting.jpg'}/>
                    </h2>
                    <ul>
                        {_('.*', docs[0].apis).map(function(index, value){
                            return {li:{
                                a:{
                                    $href:$.env('root')+'doc/apis/'+docs[0].version+'/'+value,
                                    $:[{strong:value}]
                                }
                            }};
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
